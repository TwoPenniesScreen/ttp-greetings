import { getStore } from "@netlify/blobs";
import { weightedPick, londonParts, renderSlide } from "../functions/_shared/core.js";
import { seedSlides } from "../functions/_shared/seed.js";

const store = () => getStore({ name: "ttp-greetings-config", consistency: "strong" });

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  }
});

async function readSlides() {
  const saved = await store().get("slides", { type: "json" });
  return Array.isArray(saved?.slides) ? saved.slides : seedSlides;
}

export default async (request, context) => {
  const url = new URL(request.url);

  // Admin and Publisher reads keep their existing authentication and serverless
  // implementation. Only the public screen selector moves to the Edge allowance.
  if (url.searchParams.get("admin") === "1" || url.searchParams.get("publisher") === "1") {
    return context.next();
  }

  try {
    const slides = await readSlides();
    const at = londonParts();
    const exclude = (url.searchParams.get("exclude") || "")
      .split(",")
      .map(id => id.slice(0, 120))
      .filter(Boolean)
      .slice(0, 10);
    let event = null;
    try {
      const response = await fetch("https://ttp-brand.netlify.app/api/events?page=generic-slides", {
        signal: AbortSignal.timeout(3000)
      });
      if (response.ok) event = (await response.json()).active;
    } catch {}
    const selected = weightedPick(slides, Math.random, at, exclude, event?.id || null);
    return json({ slide: renderSlide(selected, at), at, event });
  } catch {
    // Preserve the established API contract so the screen can show its local
    // fallback rather than repeatedly retrying a broken service.
    return json({ error: "Slides unavailable." }, 503);
  }
};

export const config = {
  path: "/api/slides",
  method: ["GET"]
};
