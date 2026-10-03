import { readSlides,writeSlides } from "./_shared/store.js";
import { adminGuard,json } from "./_shared/http.js";
import { assignAdminNames,validateSlide,weightedPick,londonParts,renderSlide,deliveryDecision } from "./_shared/core.js";

export default async request => {
  if (request.method === "GET") {
    const slides=(await readSlides()).map(validateSlide);
    if (new URL(request.url).searchParams.get("admin") === "1") {
      const denied=await adminGuard(request); if (denied) return denied;
      return json({slides});
    }
    if (new URL(request.url).searchParams.get("publisher") === "1") {
      return json({slides:slides.map(slide=>({...slide,deliveryDecision:deliveryDecision(slide)}))});
    }
    const url=new URL(request.url),at=londonParts();
    const exclude=(url.searchParams.get("exclude") || "").split(",").map(id=>id.slice(0,120)).filter(Boolean).slice(0,10);
    let event=null;
    const brandBase=new URL(request.url).hostname.startsWith("signage-control-review--")?"https://signage-control-review--ttp-brand.netlify.app":"https://ttp-brand.netlify.app";
    try{const response=await fetch(`${brandBase}/api/events?page=generic-slides`,{signal:AbortSignal.timeout(3000)});if(response.ok)event=(await response.json()).active}catch{}
    const selected=weightedPick(slides,Math.random,at,exclude,event?.seriesId||event?.id||null);
    return json({slide:renderSlide(selected,at),at,event});
  }
  if (request.method === "PUT") {
    const denied=await adminGuard(request); if (denied) return denied;
    try {
      const input=await request.json();
      if (!Array.isArray(input.slides) || input.slides.length > 200) throw new Error("The slide list is invalid.");
      const slides=assignAdminNames(input.slides.map(validateSlide));
      if (new Set(slides.map(x=>x.id)).size !== slides.length) throw new Error("Each slide needs a unique ID.");
      await writeSlides(slides); return json({slides});
    } catch(error) { return json({error:error.message || "Unable to save slides."},400); }
  }
  return json({error:"Method not allowed."},405);
};
export const config={path:"/api/slides"};
