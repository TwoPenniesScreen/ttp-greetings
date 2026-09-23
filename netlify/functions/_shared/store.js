import { getStore, getDeployStore } from "@netlify/blobs";
import { seedSlides } from "./seed.js";
const store = () => globalThis.Netlify?.context?.deploy?.context === "production"
  ? getStore({ name:"ttp-greetings-config", consistency:"strong" })
  : getDeployStore({ name:"ttp-greetings-config", consistency:"strong" });
export async function readSlides() {
  const saved = await store().get("slides", { type:"json" });
  return Array.isArray(saved?.slides) ? saved.slides : seedSlides;
}
export async function writeSlides(slides) { await store().setJSON("slides", { slides, updatedAt:new Date().toISOString() }); }
