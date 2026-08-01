# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

This repository has no application code, build system, package manifest, or tests. It contains three static geospatial data files describing the City of Johannesburg (South Africa) — its administrative regions and its Spatial Development Framework (SDF) nodal hierarchy. Any "development work" here means editing/validating GIS data, not writing/compiling software.

## Files

- **`Regions.json`** — GeoJSON `FeatureCollection`, 7 `Polygon` features: the City of Johannesburg's administrative Regions A–G. Properties include `REGION_ID`, `REGION_NAM`, `GDP`, `perofGDP`, `GVA`, `Area`, `Area_km2`, plus raw GIS export fields (`OBJECTID`, `OBJECTID_1`, `GLOBALID`, `SHAPE_Leng`/`Shape_Length`, `Shape_Area`, `REGION_NOT`).
- **`NodalReview.json`** — GeoJSON `FeatureCollection`, 8 `MultiPolygon` features: the SDF nodal zones, in hierarchy order via `N_Rev_new` (1=Regional Node, 2=Inner City Node, 3=Metropolitan Node, 4=General Urban Zone, 5=Sub-Urban Zone, 6=Peri-Urban Zone, 7=LED Zone, 8=Beyond Urban Development Boundary). Properties include `Zone_Name`, `N_Rev_new`, `NodalR_Area_km2`, `Area_km2`, `OBJECTID`, `Shape_Length`, `Shape_Area`.
- **`output.json`** — TopoJSON `Topology` combining both layers as `objects.Regions` and `objects.NodalReview`, sharing a common `arcs` array. This is a derived/compiled artifact (the typical output of a tool like `mapshaper` or the `topojson` CLI merging the two GeoJSON files), not a hand-authored source file.

## Data conventions

- **Coordinates**: WGS84 lon/lat decimal degrees (EPSG:4326). All data covers Johannesburg, roughly 27.7–28.0° E, −25.9 to −26.5° S.
- **`output.json` is quantized**: it carries a `transform` (`scale`/`translate`) and delta-encoded integer arcs per the TopoJSON spec — coordinates are not raw lon/lat and must be run through `topojson-client`'s `feature()` (or equivalent) to recover GeoJSON geometry.
- **Inconsistent property types in `Regions.json`**: `Area` is a clean float (e.g. `186.71`), but `Area_km2` is a string with a comma decimal separator and unit suffix (e.g. `"186,71 km2"`) — parse `Area`/`Area_km2` accordingly, don't assume both are numeric.
- **Legacy GIS export fields** (`OBJECTID*`, `GLOBALID`, `SHAPE_Leng`/`Shape_Length`, `Shape_Area`, `REGION_NOT`) are artifacts of the original shapefile/ArcGIS export and are largely redundant with the cleaner `Area`/`Area_km2` fields — treat them as reference data, not the canonical values.
- Feature `id` values are sequential integers aligned with each feature's `OBJECTID`.

## Working with this repo

- `Regions.json` and `NodalReview.json` are the source layers; `output.json` should be treated as generated output. If you edit either source file, regenerate `output.json` from it (e.g. via `mapshaper` or `topojson-client`) rather than hand-editing the topology.
- There is no linter, formatter, or test suite configured. When validating edits, check that the file still parses as JSON and that `type`/`Feature`/geometry structures remain valid GeoJSON (or valid TopoJSON for `output.json`).
