# Two Pennies generic slides

A lightweight text-slide screen and admin. The live page chooses one eligible weighted slide on load and keeps it until the signage player loads the page again. Schedules use Europe/London time. Backgrounds, tint and seasonal corner logos come from `ttp-brand`; central bar logos and the Two Pennies font are bundled locally for immediate rendering.

- Live screen: `/`
- Admin: `/admin.html` (open from the Two Pennies admin hub)
- Public selection endpoint: `/api/slides`

The initial library recreates the standard centred, image-free slides and their AbleSign schedules. Changes are stored in site-scoped Netlify Blobs.

Slides with no event ticked are evergreen. A slide tagged to an event appears only while that event is active for Generic slides in `ttp-brand`; if an active event has no eligible tagged slide, the screen safely falls back to an eligible evergreen slide. The screen checks once on load and does not refresh itself.
