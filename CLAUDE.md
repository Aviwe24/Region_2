# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

City of Johannesburg (South Africa) spatial planning work. At its core are three static geospatial data files: the city's administrative regions and its Spatial Development Framework (SDF) nodal hierarchy. Around them sit outputs made from that data: an interactive map, the Annexure 2 nodal review documents, and a first-year urban design class pack. There is no application, package manifest or test suite. "Development work" here means editing or validating GIS data and the documents built from it.

The owner is a spatial planner, not a software developer. Explain in plain, non-technical language. Ask questions when a request is ambiguous rather than guessing.

## Layout

| Path | What it is |
|---|---|
| `Regions.json`, `NodalReview.json` | Source GeoJSON layers (see Data files below) |
| `output.json` | TopoJSON built from the two source layers; generated, not hand-edited |
| `index.html` | Interactive D3 map of nodal zones and regions. Fetches `output.json`, so serve the repo root over HTTP (`python3 -m http.server`); opening the file directly will not load the data |
| `docs/` | Annexure 2 urban potential model review: `Annexure2_Urban_Potential_Model_Review.md` (source text), the Word report for the department and the non-technical briefing deck |
| `docs/build/` | Build scripts for the review outputs (see Rebuilding outputs) |
| `class-session/` | "Building in the Middle", a missing middle housing studio session for Vrededorp (Fietas). See `class-session/README.md` |
| `guides/` | The owner's Claude Code working guide (starter prompts, standing rules). Not project data |

## Data files

- **`Regions.json`**: GeoJSON `FeatureCollection`, 7 `Polygon` features for the City of Johannesburg's administrative Regions A–G. Properties include `REGION_ID`, `REGION_NAM`, `GDP`, `perofGDP`, `GVA`, `Area`, `Area_km2`, plus raw GIS export fields (`OBJECTID`, `OBJECTID_1`, `GLOBALID`, `SHAPE_Leng`/`Shape_Length`, `Shape_Area`, `REGION_NOT`).
- **`NodalReview.json`**: GeoJSON `FeatureCollection`, 8 `MultiPolygon` features for the SDF nodal zones, in hierarchy order via `N_Rev_new` (1=Regional Node, 2=Inner City Node, 3=Metropolitan Node, 4=General Urban Zone, 5=Sub-Urban Zone, 6=Peri-Urban Zone, 7=LED Zone, 8=Beyond Urban Development Boundary). Properties include `Zone_Name`, `N_Rev_new`, `NodalR_Area_km2`, `Area_km2`, `OBJECTID`, `Shape_Length`, `Shape_Area`.
- **`output.json`**: TopoJSON `Topology` combining both layers as `objects.Regions` and `objects.NodalReview`, sharing one `arcs` array. It is the kind of output `mapshaper` or the `topojson` CLI produces from the two GeoJSON files.

## Data conventions

- **Coordinates**: WGS84 lon/lat decimal degrees (EPSG:4326). All data covers Johannesburg, roughly 27.7–28.0° E, −25.9 to −26.5° S.
- **`output.json` is quantized**: it carries a `transform` (`scale`/`translate`) and delta-encoded integer arcs per the TopoJSON spec. Coordinates are not raw lon/lat; run them through `topojson-client`'s `feature()` (or equivalent) to recover GeoJSON geometry.
- **Inconsistent property types in `Regions.json`**: `Area` is a clean float (e.g. `186.71`), but `Area_km2` is a string with a comma decimal separator and unit suffix (e.g. `"186,71 km2"`). Parse them accordingly; don't assume both are numeric.
- **Legacy GIS export fields** (`OBJECTID*`, `GLOBALID`, `SHAPE_Leng`/`Shape_Length`, `Shape_Area`, `REGION_NOT`) come from the original shapefile/ArcGIS export and largely duplicate `Area`/`Area_km2`. Treat them as reference data, not canonical values.
- Feature `id` values are sequential integers aligned with each feature's `OBJECTID`.

## Known data issues

Flag these when the data is used for analysis or published figures; don't silently "fix" them.

- **`GDP` units are inconsistent across regions.** Regions E (1754), F (2268) and G (432) do not match their `perofGDP` shares against Regions A–D (98–113.5). `perofGDP` is internally consistent (sums to 100.1% through rounding), so prefer it for shares.
- **`GVA` is 0 for every region and `CITY_ID` is blank.** Treat both as missing, not zero.
- **Nodal zone areas total 1,704.29 km² against 1,645.38 km² for the regions** (+58.9 km²). The layers don't share an exact outer boundary, so zone-by-region overlay results will not sum to regional totals.

## Working with this repo

- `Regions.json` and `NodalReview.json` are the source layers. If you edit either, regenerate `output.json` (e.g. via `mapshaper` or `topojson-client`) rather than hand-editing the topology. `index.html` and `class-session/index.html` both depend on that data.
- There is no linter, formatter or test suite. When validating edits, check that the file still parses as JSON and that `type`/`Feature`/geometry structures remain valid GeoJSON (or valid TopoJSON for `output.json`).

## Rebuilding outputs

- **Class pack map**: `python3 class-session/build_map.py` (run from the repo root) re-embeds a simplified map from the two source layers into `class-session/index.html`.
- **Word report**: `node docs/build/md_to_docx.js` rebuilds `docs/Annexure2_Review_for_Department.docx` from the review markdown. Needs the `docx` npm package. Edit the `.md` first, then rebuild, so the two stay in step.
- **Briefing deck**: `node docs/build/build_deck.js` rebuilds `docs/Annexure2_Review_Briefing.pptx`. Needs `pptxgenjs`, `react`, `react-dom`, `react-icons` and `sharp`. It also loads a theme helper from a Claude cloud skill path (`/root/.claude/skills/...`), so it only runs as-is in a Claude Code cloud session with the pptx skill.
- **Deck QA**: `python3 docs/build/geom_qa.py docs/Annexure2_Review_Briefing.pptx` gives an approximate text-overflow check (needs `python-pptx` and `Pillow`).
- The Word and PowerPoint files can't be rendered exactly as Office shows them here. After a rebuild, ask the owner to open and check them.
