import { getStore, getDeployStore } from "@netlify/blobs";
import { seedSlides } from "./seed.js";
const isProduction = () => globalThis.Netlify?.context?.deploy?.context === "production";
const siteStore = () => getStore({ name:"ttp-greetings-config", consistency:"strong" });
const store = () => isProduction() ? siteStore() : getDeployStore({ name:"ttp-greetings-config", consistency:"strong" });
export async function readSlides() {
  const target=store();
  let saved=await target.get("slides",{type:"json"}).catch(()=>null);
  if(!isProduction()&&!saved){saved=await siteStore().get("slides",{type:"json"}).catch(()=>null);if(saved)await target.setJSON("slides",saved)}
  if(!Array.isArray(saved?.slides)){const backup=await target.get("slides-backup",{type:"json"}).catch(()=>null);if(Array.isArray(backup?.slides))return backup.slides;return seedSlides}
  return saved.slides;
}
export async function writeSlides(slides) {const target=store(),current=await target.get("slides",{type:"json"}).catch(()=>null);if(Array.isArray(current?.slides))await target.setJSON("slides-backup",{...current,snapshotAt:new Date().toISOString()});await target.setJSON("slides",{slides,updatedAt:new Date().toISOString()})}
