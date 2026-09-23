export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
export const LOGOS = ["two-pennies", "basement"];

export function validateSlide(input) {
  const text = value => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, 120);
  const id = text(input.id) || crypto.randomUUID();
  const headline = text(input.headline);
  const subheading = text(input.subheading);
  const name = text(input.name) || headline || "Untitled slide";
  const logo = LOGOS.includes(input.logo) ? input.logo : "two-pennies";
  const weight = Math.max(1, Math.min(20, Math.round(Number(input.weight) || 1)));
  const starts = /^\d{4}-\d{2}-\d{2}$/.test(input.starts || "") ? input.starts : "";
  const ends = /^\d{4}-\d{2}-\d{2}$/.test(input.ends || "") ? input.ends : "";
  const eventIds = Array.isArray(input.eventIds) ? [...new Set(input.eventIds.map(value=>String(value)).filter(value=>/^[a-zA-Z0-9-]{1,80}$/.test(value)))].slice(0,20) : [];
  if (!headline && !subheading) throw new Error("Add a headline or subheading.");
  if (starts && ends && starts > ends) throw new Error("The end date must be after the start date.");
  const schedule = {};
  for (const day of DAYS) {
    const value = input.schedule?.[day];
    const enabled = Boolean(value?.enabled);
    const start = /^([01]\d|2[0-3]):[0-5]\d$/.test(value?.start || "") ? value.start : "00:00";
    const end = /^([01]\d|2[0-3]):[0-5]\d$/.test(value?.end || "") ? value.end : "23:59";
    if (enabled && start > end) throw new Error(`${day.toUpperCase()}: end time must be after start time.`);
    schedule[day] = { enabled, start, end };
  }
  return { id, name, headline, subheading, logo, weight, enabled: input.enabled !== false, starts, ends, eventIds, schedule };
}

export function londonParts(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London", weekday: "short", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  }).formatToParts(now).filter(x => x.type !== "literal").map(x => [x.type, x.value]));
  return { day: parts.weekday.toLowerCase(), date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}

export function eligible(slide, at = londonParts()) {
  if (!slide.enabled || (slide.starts && at.date < slide.starts) || (slide.ends && at.date > slide.ends)) return false;
  const window = slide.schedule?.[at.day];
  return Boolean(window?.enabled && window.start <= at.time && at.time <= window.end);
}

export function weightedPick(slides, random = Math.random, at = londonParts(), excludeIds = [], eventId = null) {
  const timed = slides.filter(slide => eligible(slide, at));
  const eventSlides = eventId ? timed.filter(slide => slide.eventIds?.includes(eventId)) : [];
  const evergreen = timed.filter(slide => !slide.eventIds?.length);
  const eligibleSlides = eventId && eventSlides.length ? eventSlides : evergreen;
  const recent = Array.isArray(excludeIds) ? excludeIds : [excludeIds];
  let active = eligibleSlides;
  for (let count = recent.length; count > 0; count--) {
    const excluded = new Set(recent.slice(0, count));
    const candidates = eligibleSlides.filter(slide => !excluded.has(slide.id));
    if (candidates.length) { active = candidates; break; }
  }
  if (!active.length) return null;
  const total = active.reduce((sum, slide) => sum + slide.weight, 0);
  let cursor = random() * total;
  for (const slide of active) { cursor -= slide.weight; if (cursor < 0) return slide; }
  return active.at(-1);
}
