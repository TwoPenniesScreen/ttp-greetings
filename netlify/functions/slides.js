import { readSlides,writeSlides } from "./_shared/store.js";
import { adminGuard,json } from "./_shared/http.js";
import { validateSlide,weightedPick,londonParts } from "./_shared/core.js";

export default async request => {
  if (request.method === "GET") {
    const slides=await readSlides();
    if (new URL(request.url).searchParams.get("admin") === "1") {
      const denied=await adminGuard(request); if (denied) return denied;
      return json({slides});
    }
    const url=new URL(request.url),at=londonParts();
    const exclude=(url.searchParams.get("exclude") || "").split(",").map(id=>id.slice(0,120)).filter(Boolean).slice(0,10);
    return json({slide:weightedPick(slides,Math.random,at,exclude),at});
  }
  if (request.method === "PUT") {
    const denied=await adminGuard(request); if (denied) return denied;
    try {
      const input=await request.json();
      if (!Array.isArray(input.slides) || input.slides.length > 200) throw new Error("The slide list is invalid.");
      const slides=input.slides.map(validateSlide);
      if (new Set(slides.map(x=>x.id)).size !== slides.length) throw new Error("Each slide needs a unique ID.");
      await writeSlides(slides); return json({slides});
    } catch(error) { return json({error:error.message || "Unable to save slides."},400); }
  }
  return json({error:"Method not allowed."},405);
};
export const config={path:"/api/slides"};
