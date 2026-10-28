# Handoff: what adults still need to check

AI helped build this site, and AI can make mistakes. Please check the science, translations, and design
before sharing. The team decides whether the site does what they wanted.

## 1. Pictures

- **Santa Fe rain garden.** The site shows our own simplified drawing (a street, runoff flowing into a
  planted dip, trees, and an information sign), based on a photo from NPR. The drawing doesn't copy the
  sign's words or diagram. The credits say it is based on the NPR photo, and the real photo is linked.
  The team said the garden is in Santa Fe; the sign in the photo says "Alameda Stormwater Rain Garden".
  I did not independently confirm the location.
- **Rain Garden in a Box (re-store.org).** Their diagram belongs to them and is not copied. Our sketches are original.
- **Team design image.** No separate team drawing was supplied. If the team has one, it could be added.

## 2. Our idea: what the sketch shows

Decided by the team and shown on the site:
- Gutter into a raised wooden box, native plants on top.
- Big rocks on top, then smaller and smaller rocks, then sand.
- A pipe with holes running along the whole bottom, carrying water out the side.

Still undecided (not shown as decisions): box size, layer depths, which plants, where the outlet
water goes next, and whether to add a liner or overflow pipe like the re-store.org plans have.

## 3. Facts to re-check (sources checked October 2026)

| Claim on site | Source used | Note |
| --- | --- | --- |
| Wild axolotls are Critically Endangered | IUCN Red List, AmphibiaWeb, Conservation International | Check the assessment is still current. |
| Wild axolotls live only in Xochimilco canals, Mexico City | AmphibiaWeb, Conservation International | Some sources also mention Chalco. |
| Threats: city growth, pollution, carp and tilapia eating eggs and babies | IUCN, Mongabay | No population numbers used on purpose. |
| Axolotls keep their gills and stay in water | Conservation International | |
| Scientists and farmers making safer canal spots | Mongabay Latam 2024 | |
| You can't judge water by looking | USGS Water Science School | |
| Street drains often flow straight to creeks | City of Colorado Springs | Some cities treat stormwater; "often" is the hedge. |
| What rain gardens do and can't do | US EPA Soak Up the Rain | EPA page says it is no longer updated. |
| Siting, soil test, native plants | Penn State Extension | No distances used on purpose. |
| "In the US, call 811" | General knowledge; Penn State says call your state utility-marking service | Rules differ in Mexico. |

The Meet Carl section, the filter-test story, and the pH explanation were removed at the team's request.

## 4. Spanish translation review

All Spanish in `js/i18n.js` (the `es` section) is a **draft written by AI** and needs review by a fluent
speaker, ideally someone familiar with Mexican Spanish. Look closely at "escurrimiento" (runoff),
"coladera" (storm drain), "canaleta" (gutter), "jardín de lluvia", and the tone for kids 7 to 12.

## 5. Design notes

- Original light palette: pale aqua and cream backgrounds, navy text and outlines, yellow buttons,
  pink axolotl. Navy text on every background measures at least 8:1 contrast.
- Word definitions (runoff, habitat, etc.) are tap-to-open, so the page stays short.
- The language and pause controls are at the top of the opening section. The site says the team is
  from the United States and does not name the school.
- The "Build a rain garden in a box (with an adult)" section is about building **our box idea**, not a
  regular dug-in rain garden. It is labeled "Our idea to test." Please check the steps match what the
  team actually plans: downspout, permission and expert check, adults build the frame, pipe with holes
  on the bottom aimed away from buildings, sand then smaller rocks then big rocks, native plants.
- Wording avoids "here" and "there" because readers may be in Mexico, the US, or anywhere.

## 6. What was tested and what was not

**Tested (in a Chromium-based browser pane):**
- Phone (375px), tablet (768px), and desktop widths: no sideways scrolling.
- Keyboard Tab order (skip link, language, pause, then the jump buttons).
- Calm (`?calm`) mode: still axolotl, taco row instead of falling tacos, all water steps lit.
- Every text key exists in both English and Spanish; no em dashes.
- Language switch, Pause animations, Taco Button (capped at 24 tacos), filter demo (hidden dots show in the
  dirty water before pouring and in the cup after), Follow the water,
  all five idea-part buttons, quiz feedback and smile. No console errors.

**Not tested:** real iPads, Chromebooks, Safari, Firefox, or a real screen reader.
