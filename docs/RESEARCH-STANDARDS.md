# Research standards

## Source hierarchy

Use the strongest source appropriate to the subject: peer-reviewed literature, primary records, government agencies, universities, scientific organizations, museums, recognized historical institutions, authoritative technical documentation, and other established reference institutions. Use secondary sources when primary or institutional sources cannot answer the claim, and document why.

## Current production record

The implemented V1 fact schema records quantitative claims with:

- stable internal ID and human-readable claim;
- numeric value and unit;
- whether it is measured, defined, derived, or estimated;
- display precision and uncertainty/notes;
- authoritative source name and URL;
- retrieval date;
- optional derivation from other verified values.

Committed facts are render inputs. Production rendering must not depend on live web access.

## Knowledge Package V1

The implemented claim model covers quantitative and qualitative claims. In addition to source provenance, each material claim records its claim type, evidence notes, caveats, and verification status: `unverified`, `supported`, `conflicting`, `uncertain`, or `verified`. `docs/KNOWLEDGE-PACKAGES.md` is authoritative for the semantic distinction between these states. Existing videos remain on the legacy fact model until migrated; do not imply their schema encodes a workflow state that it does not.

## Review checklist

1. Confirm the cited page says what the record claims.
2. Confirm like-for-like quantities (for example mean radius to mean radius).
3. Recompute ratios from committed base values where possible.
4. Use `≈`, “about,” a range, or an explicit estimate when warranted.
5. Revisit volatile superlatives and uncertain stellar measurements before publication.
6. Never fill a missing value or citation with model-generated text.
7. Distinguish source quality from claim status: a reputable source can still be irrelevant, outdated, or contradicted.
8. Health, psychology, history, economics, and current-event claims require domain-appropriate review; do not apply astronomy-style numeric sourcing mechanically.

Video 001 intentionally avoids “largest star” language. Betelgeuse is variable and its radius depends on observational/model assumptions, so the video labels the selected NASA value as an estimate.

Video 002 treats Challenger Deep as an approximate depth because survey results vary slightly. Its Everest comparison is derived from NOAA's approximate 10,935 m Challenger Deep value and the Government of Nepal's 8,848.86 m Everest elevation. The procedural mountain is an illustrative silhouette; only its vertical height-to-depth ratio is quantitative.

Video 003 derives ten million $100 notes from the denomination's face value and approximately ten metric tons from the U.S. Currency Education Program's approximate one-gram note weight. Its approximately 1.1 km single-stack height is a deliberately rounded slight upper estimate derived from the institution's statement that a mile-high stack contains more than 14.5 million notes. The 25×40 block arrangement is an editorial packing choice, not a claim about a standardized cash pallet. The Burj Khalifa comparison uses the owner's published 828 m architectural height.

Video 004 distinguishes exact, measured, derived, and rounded quantities. The vacuum speed of light is exactly 299,792,458 m/s by SI definition. The approximately 7.5 Earth laps per second and 1.28-second Earth–Moon light time are derived from that exact speed plus NASA's equatorial circumference and mean lunar distance. The 8 minute 20 second Sun–Earth time, 9.46 trillion km light-year, and 4.25 light-year Proxima distance are intentionally rounded NASA educational values. Earth–Moon distance varies, and the on-screen distance diagrams are labeled illustrative rather than spatially proportional.

Video 005 compares only one-dimensional extents: Burj Khalifa's 828 m height, the Three Gorges dam's approximately 2.3 km dam-axis length, the LHC's 26.7 km circumference, and the Gotthard Base Tunnel's 57.1 km length. The values come from the structure owner/operator or responsible government/scientific institution. The closing ≈69 comparison is derived as 57,100 m ÷ 828 m; the end-to-end orientation is illustrative and is not a claim that the structures share a function, footprint, mass, volume, or construction method.
