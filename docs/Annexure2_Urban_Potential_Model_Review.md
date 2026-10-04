# Review of Annexure 2: Urban Potential Modelling and Zone Delineation Method

**Purpose:** Technical review of the Urban Potential Model (Annexure 2, 21 Nov 2018) that underpins the City of Johannesburg Nodal Review Policy (approved 27 Feb 2020), with proposals for the next review cycle.

**Sources reviewed:**
- Annexure 2: Urban Potential Modelling and Zone Delineation Method, updated with public comments, 21 November 2018 (20 pp).
- Nodal Review Policy 2019/20, City Transformation and Spatial Planning, approved by Council 27 February 2020 (63 pp, with reviewer highlights).
- Repository layers: `NodalReview.json` (8 dissolved node/zone polygons), `Regions.json` (Regions A to G), `output.json` (TopoJSON of both).

---

## Executive summary

This report reviews Annexure 2 of the Nodal Review Policy 2019/20, the Urban Potential Modelling and Zone Delineation Method of November 2018, ahead of the next policy review cycle. It describes the model and its data, assesses it through a SWOT and a gap analysis, compares it with practice in other cities, and sets out the data and method changes recommended for the redesign that the Department has decided to undertake.

**Findings.** The 2018 model was a sound first step: a transparent, city-wide, network-based accessibility index on a uniform 400 m grid, reconciled with approved policy and two rounds of public participation. Its weaknesses now outweigh its strengths. Every input dates from 2011 to 2017. Economic activity is measured only by counting formal commercial buildings, which leaves township economies invisible and makes the Economic Nodes Index describe the current commercial geography rather than potential. Public transport is scored by distance alone, with no service frequency or operating status. Development capacity, bulk services and environmental constraints are absent from the model, weights were never tested, node classes were set by Jenks breaks and manual adjustment, and the model was never validated against where development actually occurred. The workflow in ArcMap, QGIS 2.16 and Excel cannot be re-run.

**Gaps.** Twenty-two gaps are identified against the policy's own intent, SPLUMA and accepted practice. Eight are rated High: job access for low-income households, transit-oriented densification, economic potential versus performance, infrastructure feasibility, data currency, the informal economy, reproducibility, and validation. They share one root cause, a static accessibility snapshot built on old, formal-sector data with no capacity layer, no validation and no reproducible classification.

**Comparators.** Cape Town's Transit Oriented Development Comprehensive Model, Transit Accessible Precincts and Economic Areas Management Programme are the closest South African precedents. London's Public Transport Accessibility Level, the Node-Place model, Portland's State of the Centers report and the United States EPA Smart Location Database are the international equivalents. All separate transport supply from land-use performance, use service frequency, and monitor centres on a cycle.

**Recommendations.** Rebuild the index as four pillars matching the Department's four policy intents: opportunity access, node value, place value and capacity. Use Census 2022, SEAD-SA employment data, LIS zoning headroom, LUMS applications and building plans, and a City-built GTFS feed. Score operating and committed infrastructure, with an operating-only map published alongside. Classify nodes with a node-place matrix and published thresholds, set weights through a structured stakeholder process with sensitivity testing, validate against 2018 to 2025 development, code the pipeline so it can be re-run, and institute a State of the Nodes monitoring report. Immediate actions are the data requests listed in section 11.8 and the construction of a minimal GTFS feed described in section 11.9.

---

## 1. What the 2018 model does (one-page summary)

> Document order: sections 1 and 2 describe the model and its data; sections 3 and 4 are the review proper (SWOT and gap analysis); sections 5 to 9 give supporting detail, comparators and options; sections 10 and 11 record decisions and the resulting redesign.

The model is a **grid-based, network-distance, composite accessibility index**. In other cities this family of methods is called a *composite accessibility index*, *spatial multi-criteria evaluation (SMCE)*, *location-based accessibility modelling* or *development-potential / suitability modelling*. Johannesburg's branding of it as "urban potential modelling" is local.

| Step | What was done | Key parameters |
|---|---|---|
| Grid | 400 m hexagons (and a 200 m grid) built with MMQGIS in QGIS 2.16.2, Gauteng extent plus 10 km buffer, clipped to CoJ | Hartebeesthoek Lo29 |
| Street network | OpenStreetMap (Geofabrik) roads, downloaded 6 July 2016 | Snapped to Gauteng 10 km buffer |
| Walkability | 1 km walking service area from each hexagon centroid (ArcGIS Network Analyst), 40 m trim; area divided by 3.14 km² (area of a 1 km-radius circle) | Motorway, path, service, construction, bridleway, raceway, proposed roads excluded; centroids >200 m from a road score 0 |
| Accessibility | 2 km walking service areas (200 m trim) to count facilities; OD cost matrix for distance to closest facility | No roads excluded; 2 km justified as a 30-minute walk |
| Normalisation | Counts divided by the city maximum; distances mapped linearly from 1.0 at 500 m to 0 at 5 000 m | 0 also used for "not on network" (null) |
| Sub-indexes | Walkability; Education (public 1/3 each all/primary/high; private x0.8; max of public and private; tertiary 0.5/0.3/0.2; max of schools and tertiary); Parks (0.8 current, 0.2 undeveloped); Health (max of public hospital and clinic; private x0.8; max); Capex (3-year JSIP spend within 2 km); Public transport (max of BRT x0.9, rail x0.9, taxi rank x0.7 and averages of combinations) | Weights set by the modellers |
| Economic Nodes Index | 15 % public transport + 70 % formal commercial buildings within 2 km + 15 % commercial buildings in the hexagon; Jenks natural breaks into 5 levels; manual "rationalisation" of isolated cells; LED overlay for cells in the top 20 % of population within 2 km but below the top 20 % of commercial+industrial | Level 1 = Inner City, 2 = Metropolitan, 3 = Regional (added after comment), 4 = General Urban, 4a = LED |
| Residential Densification Index | Walkability 12 %, Parks 12 %, Education 12 %, Health 12 %, Public transport 25 %, Jobs 25 %, Capex 2 % | Converted to du/ha by a straight line (y = 78.571x + 1.07), 5 to 60 du/ha, banded; applies to Suburban and Peri-urban only |
| Node redefinition | Existing SDF/RSDF/precinct nodes compared to index levels and reclassified; erven joined to the zone they predominantly fall in | LIS property layer 11 Dec 2017 and 28 Aug 2018 |
| Post-comment changes | Proclaimed townships and zoned erven in the UDB moved from Peri-urban to Suburban; UDB moved for Steyn City and Anchorville; Waterfall core merged into Midrand node; Florida added as Metropolitan node | |

**Approved zone footprint (from `NodalReview.json`):**

| Level | Zone | Area km² | Share |
|---|---|---|---|
| 1 | Inner City Node | 20.3 | 1.2 % |
| 2 | Metropolitan Node | 113.1 | 6.6 % |
| 3 | Regional Node | 47.7 | 2.8 % |
| 4 | General Urban Zone | 274.3 | 16.1 % |
| 4a | LED Zone | 128.2 | 7.5 % |
| 5 | Sub-Urban Zone | 589.1 | 34.6 % |
| 6 | Peri-Urban Zone | 212.2 | 12.4 % |
| 7 | Beyond the UDB | 319.5 | 18.7 % |
| | Total | 1 704.3 | |

Note the repository layer does not carry the Industrial nodes shown on Figure 7 of the policy, nor the SAF overlays.

---

## 2. Datasets used in the 2018 version

| Theme | Dataset | Source | Vintage | Comment |
|---|---|---|---|---|
| Network | Roads | OpenStreetMap via Geofabrik | 6 Jul 2016 | Township coverage in OSM was uneven in 2016 |
| Grid | 400 m / 200 m hexagons | Generated | 2017 | |
| Population | Sub-place population | Census 2011 | 2011 | Rasterised at 5 m from sub-place mean density |
| Education | Public, independent, combined and special schools | Gauteng Dept of Education shapefile | Not stated | No enrolment or capacity attributes |
| Education | Universities, registered and provisionally registered institutions | DHET lists, geocoded with Google Maps API | 6 Jul 2017 | Geocoding accuracy not reported |
| Health | Public hospitals and clinics | Gauteng Dept of Health | Not stated | |
| Health | Private hospitals (Life, Mediclinic, NHN, Netcare, Mooimed, JMH, Akeso, Lenmed, Clinix) | HASA and group websites, geocoded | 2017 | GP practices and pharmacies excluded |
| Economy | Formal commercial and industrial building points | GeoTerraImage building-based land use | 2012 | Counts only; no floor area, employment or informal activity |
| Transport | Rail stations (Gautrain and PRASA) | OSM / Mapzen metro extracts | 2016 | 150 m buffers to create multi-side access |
| Transport | BRT stations Phase 1A, 1B and planned 1C | CoJ Transport; Louis Botha, Empire-Perth and Turffontein SAFs | 2015 | Planned and operating stations treated equally |
| Transport | Taxi routes and formal ranks | CoJ Transport | 2013 | Routes converted to 10 m points; no frequency |
| Open space | Parks, nature reserves, koppies, ridges, undeveloped parks | Johannesburg City Parks and Zoo | May 2017 | CoJ only, so edge effects at municipal boundary |
| Investment | Capital budget points, 3-year MTREF | JSIP | 2017/18 | Unlocated items placed outside the city |
| Safety | Police stations | SAPS website | 2017 | Collected, but not used in any index |
| Cadastre | Property and township layers | CoJ LIS | Dec 2017, Aug 2018 | Used for erf join and post-comment reclassification |
| Policy | Existing nodes, UDB, SAFs, precinct plans, UDFs | CoJ CTSP | 2010 to 2017 | Used to reconcile model with approved policy |

---

## 3. SWOT analysis of the 2018 Urban Potential Model

The SWOT reads Annexure 2 against its own stated purpose: an evidence base for nodal boundaries and density that reflects the SDF 2040, SPLUMA, and current realities, and that can be defended in land-use decisions and at tribunal.

### Strengths

| # | Strength | Evidence in the documents |
|---|---|---|
| S1 | First city-wide, quantified and published basis for node boundaries, replacing nodes inherited unchanged from the 2010/11 RSDFs | Policy s1.1; model and maps published at bit.ly/nodal-council |
| S2 | Uniform 400 m hexagon unit avoids the size and shape bias of wards, suburbs and erven | Policy s2.2 |
| S3 | Network-based walking distances rather than straight-line buffers, consistent with the SDF's walkable, transit-oriented intent | Annexure s2; Figure 4 station comparison |
| S4 | Multi-dimensional: education, health, open space, public transport, jobs, capital investment, walkability | Annexure s3.2 |
| S5 | Two separate indexes for two separate policy questions (where economic nodes go; how dense residential areas may become) | Annexure s3.2.2 and s3.2.4 |
| S6 | LED overlay deliberately corrects for areas with high population but low formal activity | Annexure s3.2.3 |
| S7 | Transect approach produces a gradient across the whole city instead of a binary in-node / out-of-node test | Policy s3.1 |
| S8 | Reconciled with approved policy and two rounds of public participation; changes after comment are itemised | Annexure s4, s5; Policy Annexure 2 |
| S9 | Translated to erf level and joined to LIS, so it is usable in day-to-day land-use decisions | Annexure s4.3 |
| S10 | Built on free data and desktop GIS at low cost, so it is affordable to repeat | Annexure throughout |

### Weaknesses

| # | Weakness | Consequence |
|---|---|---|
| W1 | All inputs date from 2011 to 2017 (Census 2011, GTI 2012, taxis 2013, OSM 2016) | Index describes a city that no longer exists; Census 2022, BRT 1C, PRASA collapse and township densification are absent |
| W2 | Economic activity measured only as counts of formal commercial buildings | Township and informal economies invisible; LED overlay needed as a patch |
| W3 | Economic Nodes Index is 70 % existing commercial buildings | Measures current activity, not potential; entrenches the status quo |
| W4 | Public transport has no frequency or operating status | Planned, dead and frequent stations score alike |
| W5 | Walkability is a service-area ratio with footpaths excluded and no slope, barriers or sidewalks | Understates township walking; overstates gated suburbs |
| W6 | Cells more than 200 m from a mapped road score zero on everything | "No data" is treated as "no access" |
| W7 | One linear distance decay (500 m to 5 km) for all facility types | Same curve for a crèche and a university |
| W8 | Max-divide normalisation | Sandton and the CBD compress the rest of the city towards zero; Jenks breaks set by a few cells |
| W9 | Weights set by the modellers with no stakeholder process, sensitivity test or validation | Classes cannot be defended as other than a judgement |
| W10 | Jenks plus manual "rationalisation" and narrative node-reconciliation rules | Not reproducible; no decision log |
| W11 | No development capacity (zoning headroom, vacant land, bulk services) and no constraints (dolomite, flood, CBAs, heritage) inside the model | Potential is supply-side only; feasibility handled by policy text alone |
| W12 | No demand or market signal (building plans, rezonings, transactions, values) | Index never tested against where development happened |
| W13 | Facility counts carry no capacity (school places, clinic headcount, jobs) | Full and empty facilities score the same |
| W14 | Linear conversion of index to 5 to 60 du/ha | Density bands have no built-form or services basis |
| W15 | Erf assignment by "predominant overlap" from a 400 m grid | Split and large erven handled by text rule |
| W16 | Parks and capex are CoJ-only while roads and schools are Gauteng-wide | Boundary cells scored inconsistently |
| W17 | Police stations collected but unused; no libraries, halls, ECD centres, sports facilities | Social infrastructure picture incomplete |
| W18 | ArcMap 10.x, QGIS 2.16 and Excel workflow | Cannot be re-run; institutional memory sits in files and individuals |
| W19 | No uncertainty, completeness or data-vintage reporting | Users cannot see where the index is weak |
| W20 | No indicator set or monitoring link despite the policy's JSIP and five-year review commitments | No way to tell whether nodes are performing |

### Opportunities

| # | Opportunity | How it helps |
|---|---|---|
| O1 | Census 2022 Small Area Layer | Current population, income, employment and dwelling type at fine scale |
| O2 | SEAD-SA (SARS-based employment and firm data) via National Treasury | Jobs, not building counts, as the economic measure; confirmed accessible |
| O3 | LIS, LUMS applications and approved building plans 2018 to 2025 | Zoning headroom and a seven-year record to validate the 2018 index; confirmed accessible |
| O4 | Operator GTFS and ridership, or a City-built GTFS | Frequency-aware transit scoring and time-based job access; confirmed accessible or buildable |
| O5 | Open tooling: r5, OpenTripPlanner, OSMnx, GeoPandas, QGIS 3; Google Open Buildings; LiDAR DEM; GCRO Quality of Life 7 | Travel-time accessibility, densification detection, slope, equity, at no licence cost |
| O6 | SPLUMA five-year SDF review and the current SDF review process | Natural moment to re-base the nodal evidence and align cycles |
| O7 | Established precedents: Cape Town TOD Comprehensive Model and ECAMP, London PTAL, Node-Place model, Portland State of the Centers | Tested designs to borrow rather than invent |
| O8 | Inclusionary Housing policy, Land Use Scheme 2018, UDZ incentive, JSIP integration already promised in the policy | Index can be wired directly into instruments that change outcomes |
| O9 | Building a City GTFS and data-sharing agreements with GDE, GDoH and Treasury | Durable data assets beyond this project |
| O10 | Publishing code, parameters and a decision log | Credibility with the public and defensibility at tribunal |

### Threats

| # | Threat | Exposure |
|---|---|---|
| T1 | Data access failure: GTI licence not available, operators slow to share, SEAD-SA agreement delayed | Economic and transit pillars weakened or delayed |
| T2 | Legal challenge under SPLUMA s22 and s42 where a boundary or density cannot be reproduced or explained | Policy set aside or discounted at tribunal |
| T3 | Infrastructure decline (PRASA service, water, electricity) making modelled potential undeliverable; committed projects slipping | Nodes designated where growth cannot be serviced |
| T4 | Boundary capture by individual developments, as with the post-comment Steyn City, Waterfall and Anchorville changes | Erodes the evidence base; invites further special pleading |
| T5 | Stakeholder resistance from residents' associations and heritage bodies, as in 2018 | Delay, dilution of densification in well-located suburbs |
| T6 | Staff turnover and loss of ArcMap and Excel working files | Model cannot be re-run or explained |
| T7 | Over-complex redesign perceived as a black box | Loss of the transparency that was the 2018 model's main strength |
| T8 | Informal and backyard densification outpacing policy in Soweto, Diepsloot, Ivory Park | Policy densities become irrelevant on the ground |
| T9 | Climate hazards (flooding, heat) ignored in siting intensification | Liability and resilience failures |
| T10 | SDF review and nodal review running on different timelines and evidence | Inconsistent policy hierarchy |

---

## 4. Gap analysis

Each row compares what the policy, SPLUMA, the SDF 2040 or accepted practice requires with what the 2018 model delivers. Severity: **High** means the gap undermines a core policy intent or legal defensibility; **Medium** means it materially distorts results; **Low** means it is a quality or presentation issue.

| # | Dimension | Required by policy, law or practice | What the 2018 model does | Gap | Severity | Closing action (sections 8 and 11) |
|---|---|---|---|---|---|---|
| G1 | Job access for low-income households | SPLUMA spatial justice; SDF "bring jobs to residential areas"; policy intent confirmed | Distance to formal buildings; LED overlay | No travel-time-to-jobs measure; no income or deprivation weighting | High | P1 opportunity-access pillar on SEAD-SA jobs and routed travel time |
| G2 | Transit-oriented densification | SDF TOD nodes with minimum 60 du/ha within 500 m of stations | Nearest station by distance, planned and operating alike, no frequency | Frequency, operating status and ridership absent | High | PTAL-style score from GTFS; status field; ridership |
| G3 | Economic node potential | Policy aims to "unlock potential"; ECAMP-type separation of performance from potential | 70 % weight on existing commercial counts | Index measures present activity, not potential | High | Node-place matrix; SEAD-SA employment; building-plan trend |
| G4 | Infrastructure feasibility | SPLUMA s42(1)(c)(v) services impact; policy s3.1.2 infrastructure availability | Not in model; handled as policy text | No capacity or constraint layer | High | P4 capacity pillar with services capacity and constraint mask |
| G5 | Data currency | SPLUMA five-year review; "respond to current realities" | 2011 to 2017 inputs | 9 to 15 years out of date | High | Census 2022, current networks, vintage manifest |
| G6 | Informal economy and settlements | Inclusive city principle | Formal buildings only | Township economies and informal settlements unmeasured | High | Trading permits, informal settlement register, Open Buildings |
| G7 | Reproducibility and defensibility | SPLUMA s22 consistency; tribunal scrutiny | Jenks plus manual rationalisation; mixed desktop tools | No code, no decision log | High | Coded pipeline; rule-based thresholds; published log |
| G8 | Validation | Evidence-based planning claim in policy s1.1 | None | Index never tested against outcomes | High | Regression against LUMS and building plans 2018 to 2025 |
| G9 | Weighting legitimacy | Multi-criteria practice; public participation principle | Modeller-set weights | No stakeholder process or sensitivity | Medium | AHP or Delphi; Monte Carlo robustness map |
| G10 | Walkability quality | SDF walkable neighbourhoods; policy permeability guidance (80 to 120 intersections per km²) | Service-area ratio, paths excluded | Slope, barriers, sidewalks, footpaths, intersection density missing | Medium | Pedestrian network with slope and barriers; intersection density |
| G11 | Facility capacity | SPLUMA s42 social infrastructure | Counts and nearest distance | No school places, clinic headcounts | Medium | EMIS and DoH capacity attributes |
| G12 | Population accuracy | Fine-scale density for 2 km catchments and LED test | Census 2011 sub-place means | Coarse polygons, old data | Medium | Census 2022 SAL with dasymetric mapping |
| G13 | Density conversion | SDF densities table; built-form feasibility | Linear 5 to 60 du/ha line | No typology or services basis | Medium | Zone and typology ranges with transit uplift |
| G14 | Normalisation | Standard index practice | Max-divide; linear decay; zero for null | Outlier-driven; data gaps scored as no access | Medium | Percentile or log scaling; explicit no-data class |
| G15 | Scale and erf assignment | Erf-level decisions in LIS | 400 m grid, predominant overlap | Split and large erven ambiguous | Medium | Erf access-point scoring; majority rule; published lookup |
| G16 | Edge effects | Functional region extends beyond CoJ | Parks and capex CoJ-only | Boundary cells inconsistent | Low | Include neighbouring municipalities' facilities |
| G17 | Scenario capability | Committed vs planned infrastructure decision | Single static run | Cannot show delivery risk | Medium | Status field; operating-only and committed maps |
| G18 | Monitoring | Policy s3.1.2 JSIP link; five-year UDF sunset | No indicators | No way to measure node performance | Medium | State of the Nodes indicator set |
| G19 | Data governance | Repeatable five-year cycle | No custodian, vintage or agreements recorded | Model depends on individuals | Medium | Vintage manifest; custodians; data-sharing agreements; City GTFS |
| G20 | Uncertainty and completeness | Public transparency | None reported | Users cannot judge reliability | Low | Completeness and robustness maps |
| G21 | Climate and environmental risk | SDF resilient city; Table 9 CBAs | Not in model | Flood, heat, biodiversity outside the index | Medium | Constraint mask and heat/greenness indicators |
| G22 | Social facility coverage | Inclusive city | Schools, clinics, hospitals, parks only | Libraries, halls, ECD, sports, police unused | Low | Add facility classes; use SAPS layer already collected |

### Gap priorities

Eight gaps are rated High and share a common root: the 2018 model is a static accessibility snapshot built on old, formal-sector data, with no capacity, no validation and no reproducible classification. Closing G1, G3, G4 and G7 changes the architecture of the index; closing G2, G5, G6 and G8 is mostly data acquisition and testing. Section 8 lists the method responses and section 11 sets out the redesign that follows from this analysis.

---

## 5. Detailed limitations of the 2018 method (supporting notes to the SWOT)

### 3.1 Data
1. **Everything is 9 to 15 years old now.** Census 2011 population, GTI 2012 land use, 2013 taxi data and 2016 OSM roads pre-date Census 2022, BRT Phase 1C, the PRASA collapse and partial restoration, the Gautrain ridership shift, Waterfall and Modderfontein build-out, and large-scale backyard densification in Soweto, Diepsloot and Ivory Park.
2. **Population at sub-place scale is too coarse.** Soweto and Diepsloot sub-places are several km² each. Rasterising a polygon mean to 5 m cells does not add precision. Census 2022 Small Area Layer (SAL) data, dasymetric mapping with building footprints, or WorldPop/HRSL grids would materially change the population-in-2 km layer and therefore the LED overlay.
3. **Formal buildings are the only measure of economic activity.** Counting formal commercial points structurally under-scores township economies and informal trading. The LED overlay was a patch for this bias rather than a fix.
4. **Facility counts carry no size or capacity.** A corner shop and Sandton City each count 1. A full school and an under-enrolled school score the same. Clinics have no headcount.
5. **Public transport has no service frequency or operating status.** A PRASA station with no trains, a planned BRT station and a Gautrain station all score similarly. Taxi routes have no headway.
6. **Edge effects.** Parks and capex are CoJ only, while schools and roads are Gauteng-wide. Cells along the Ekurhuleni, Tshwane and Mogale City boundaries are penalised inconsistently.
7. **Police stations were collected but never used**, and there are no libraries, community halls, early childhood centres, sports facilities or post offices.

### 3.2 Measures
8. **The walkability score is a crude area ratio.** Service-area area divided by circle area captures network density but ignores slope (Johannesburg ridges), sidewalks, crossings, barriers (freeways, rail, mine land, gated estates) and personal safety. Excluding OSM "path" removes the footpaths that carry most township walking.
9. **The 200 m snap rule produces arbitrary zeros.** Cells whose centroid is more than 200 m from a mapped road receive 0 for every accessibility measure, which conflates "no data" with "no access".
10. **One distance decay for everything.** A linear 500 m to 5 km decay is applied to a primary school, a hospital and a university alike. Standard practice uses facility-specific thresholds and time rather than distance, and cumulative-opportunity or gravity formulations.
11. **Max-divide normalisation is outlier-driven.** Dividing commercial counts by the Sandton or CBD maximum compresses the rest of the city towards zero, so Jenks breaks are decided by a handful of cells.
12. **Non-standard combination rules.** The "max of public and private x0.8" and the seven-way public transport combination logic are defensible but opaque, undocumented in the literature, and impossible for the public to re-derive.

### 3.3 Index construction
13. **Weights are unexplained and untested.** The Economic Nodes Index is 70 % existing commercial buildings, so it largely reproduces the current commercial geography and measures *current* rather than *potential* activity. No sensitivity analysis, stakeholder weighting or validation was done.
14. **Jenks plus manual rationalisation is not reproducible.** The rules used to reclassify isolated cells and to merge model results with existing nodes (section 4.2 of the Annexure) are described narratively only; there is no logged decision table.
15. **Potential is supply-side only.** The model has no notion of development *capacity* (vacant or under-used land, unused zoning bulk, bulk water, sewer and electricity capacity) or *constraints* (CBAs, wetlands, flood lines, dolomite, undermined land, heritage). The policy handles these as overriding statements rather than as model inputs.
16. **No demand or market signal.** Building plans, rezoning and township applications, deeds transactions, valuations, vacancy and rentals are absent, so the index cannot be validated against where development actually happened between 2018 and 2025.
17. **The density conversion is a straight line.** Mapping index 0 to 0.71 onto 5 to 60 du/ha has no basis in built-form feasibility or services capacity.
18. **Scale and MAUP.** 400 m hexagons are joined to erven by "predominant" overlap; split erven and large erven are handled by a text rule. With current tooling, erf-level accessibility is computable directly.

### 3.4 Process and tooling
19. **Mixed ArcMap 10.x, QGIS 2.16 and Excel workflow.** ArcMap is end-of-life, QGIS 2.16 is unsupported, and the normalisation lived in spreadsheets. The model cannot be re-run from code.
20. **No monitoring link.** The policy promises to feed JSIP and to review UDFs every five years, but there is no indicator set to test whether nodes are performing.
21. **No uncertainty or completeness reporting.** OSM completeness, geocoding accuracy and data vintages are not mapped, so users cannot tell where the index is trustworthy.

---

## 6. How other cities do this work

| City / body | Name of the method or product | What it does | Relevance to Johannesburg |
|---|---|---|---|
| **London (TfL, GLA)** | **PTAL (Public Transport Accessibility Level)**, WebCAT travel-time mapping, ATOS (Access to Opportunities and Services), London Plan town-centre network and five-yearly town-centre health checks | PTAL grades every 100 m cell 1a to 6b from walk time to stops plus service frequency. The London Plan historically tied permitted density to PTAL; town centres are classified (International, Metropolitan, Major, District, Local) and re-checked on a cycle | Closest analogue to the public transport sub-index, but frequency-aware. Health checks are the monitoring step Johannesburg lacks |
| **Cape Town** | **TOD Strategic Framework (2016) and TOD Comprehensive Land Use Model (TODC)** with **Transit Accessible Precincts (TAPs)**; **ECAMP (Economic Areas Management Programme)**; **Urban Development Index (UDI)** and Transport Development Index; MSDF 2023 Spatial Transformation Areas; annual Spatial Trends Report | TODC optimises where households and jobs should locate to cut transport cost; TAPs are 500 m station precincts used to measure performance. ECAMP scores ~70 business precincts on market performance versus location potential and plots them on a quadrant. The UDI tracks spatial transformation with eleven indices | The most comparable South African work. ECAMP's "performance vs potential" quadrant is exactly the distinction the Economic Nodes Index blurs |
| **Netherlands / international** | **Node-Place model** (Bertolini 1999) and TOD index variants ("actual TOD index" vs "potential TOD index") | Scores each station on node value (transport supply) and place value (density, diversity, jobs) and classifies as balanced, unbalanced node, unbalanced place, stressed or dependent | Direct template for classifying Johannesburg's rail, BRT and rank precincts and for prioritising capex |
| **Portland Metro (USA)** | 2040 Growth Concept centres hierarchy (Central City, Regional Centres, Town Centres, Station Communities, Main Streets) and the **State of the Centers** report | Each centre scored on people per acre, jobs, "urban living infrastructure" (amenities), street connectivity and transit; published as a recurring report card | Model for a recurring "state of the nodes" report |
| **Toronto / Ontario** | Official Plan Centres and Avenues; **Urban Growth Centres** and **Major Transit Station Areas (MTSAs)** with statutory minimum density targets (people + jobs per hectare); Avenues and Mid-Rise Buildings Study | Density floors tied to transit and measured as residents plus jobs per hectare | Alternative to du/ha only; combines residential and employment intensity |
| **Melbourne / Victoria** | Plan Melbourne activity-centre hierarchy (Metropolitan, Major, Neighbourhood) and the **20-minute neighbourhood** programme; Activity Centres Program | Access to daily needs within a 20-minute walk/cycle/local PT trip; centre structure plans | 20-minute framing is a clear public message for the General Urban Zone |
| **Sydney (Greater Cities Commission)** | **30-minute city** metric and Strategic Centres with jobs targets | Share of residents within 30 minutes by PT of a strategic centre | Time-based accessibility target rather than distance |
| **Perth (WAPC)** | State Planning Policy 4.2 Activity Centres and accessibility-based prioritisation research | Centre hierarchy with floor-space and accessibility criteria | Rule-based centre classification |
| **Edmonton, Vancouver** | City Plan nodes and corridors; Metro Vancouver Frequent Transit Development Areas | Nodes and corridors typology with district plans; density focused on frequent-transit corridors | Corridor treatment for Louis Botha, Empire-Perth and Turffontein |
| **US EPA** | **Smart Location Database and National Walkability Index** | Block-group walkability from intersection density, land-use mix, transit proximity, employment mix | Standardised, open normalisation approach |
| **Tshwane / CSIR** | **Access envelopes** (Green, CSIR), Tshwane MSDF 2022 nodal hierarchy (Capital Core, Metropolitan Nodes, Urban Cores, Emerging Nodes) | GIS accessibility envelopes used to test job access for poor households and transport scenarios | South African method already applied to Gauteng; focused on job access for the poor |
| **eThekwini** | SDF densification strategy and Integrated Rapid Public Transport Network (C3/C9) accessibility work; CSIR UrbanSim pilot | Density and nodal hierarchy aligned with planned IRPTN; land-use simulation | Scenario-based testing of planned transit |
| **CSIR / National Treasury / GCRO** | StepSA mesozones, Spatial Economic Activity Data South Africa (SEAD-SA), GCRO Quality of Life Survey, Gauteng SDF 2030 node hierarchy | Mesozone and hexagon-level economic activity from SARS tax data; biennial household survey with travel and satisfaction data | Provides the employment and equity layers missing in 2018 |
| **Private / research** | Walk Score, Space Syntax (integration/choice), r5/OpenTripPlanner accessibility (Access Across America) | Street configuration and multimodal travel-time accessibility to jobs | Off-the-shelf tooling for the measures proposed below |

**Answer to "which city has done something like the modelling and what is it known as":** Cape Town is the nearest South African example, with the **TOD Comprehensive Model and Transit Accessible Precincts** (transport-led) and **ECAMP** (economic node performance and potential). Internationally the closest named products are London's **PTAL**, the Dutch-origin **Node-Place model**, Portland's **State of the Centers**, and the US EPA **Smart Location Database / Walkability Index**. In planning literature the generic terms are *composite accessibility index*, *cumulative-opportunity / gravity accessibility*, and *spatial multi-criteria evaluation*.

---

## 7. Additional datasets to add in the next cycle

### A. Refresh the existing inputs
| Dataset | Source | Why |
|---|---|---|
| Census 2022 Small Area Layer population, households, income, employment, dwelling type | Stats SA | Replaces 2011 sub-place; enables deprivation and jobs-housing measures |
| GeoTerraImage building-based land use 2022/23 (or latest) | GTI (CoJ licence) | Replaces 2012 commercial/industrial counts; adds floor area and retail centre typology |
| OpenStreetMap 2026 plus CoJ road centrelines and JRA sidewalk / NMT inventory | OSM, JRA | Far better township coverage; allows a true pedestrian network with paths |
| Rea Vaya Phase 1A, 1B, 1C stations and routes as GTFS; Metrobus GTFS; Gautrain GTFS | CoJ Transport, Gautrain Management Agency | Enables frequency-aware PT scoring and travel-time accessibility |
| PRASA operational status by line and station | PRASA | Score only operating services; model restoration as a scenario |
| Taxi routes and ranks (post-2017 Gauteng taxi route mapping, e.g. GoMetro / WhereIsMyTransport datasets; CoJ rank surveys) | CoJ Transport, GPDRT | Replace 2013 routes; add passenger volumes at ranks |
| GDE schools with EMIS enrolment and capacity; DoH clinics with headcounts | GDE, GDoH | Capacity-adjusted access rather than counts |
| JCPZ open space with asset condition; neighbouring municipalities' parks | JCPZ, Ekurhuleni, Tshwane, Mogale | Quality and edge effects |
| JSIP capital budget 2025/26 MTREF with project polygons | CoJ Group Strategy / JSIP | Current investment signal |
| LIS cadastre, Land Use Scheme 2018 zoning and consent uses | CoJ Development Planning | Zoning headroom: permitted bulk minus built bulk |

### B. Economy and jobs (the biggest gap)
| Dataset | Source | Use |
|---|---|---|
| **SEAD-SA (Spatial Economic Activity Data South Africa)**: firm counts, employment and payroll from SARS at hexagon / mesozone level | National Treasury Cities Support Programme | Employment-weighted "place" value instead of building counts |
| Informal trading permits and designated trading areas; linear markets | JPC, Dept of Economic Development | Make the informal economy visible |
| Business licences; UIF employer registrations | CoJ, Dept of Labour | Firm density cross-check |
| Commercial and retail vacancy and rentals | SAPOA / MSCI, Rode, Lightstone | Market performance for an ECAMP-style quadrant |
| Mobile-phone activity or footfall counts; VIIRS night-time lights | MNOs via data agreement; NASA | Observed activity intensity including informal nodes |
| Points of interest | OSM, Google Places, Yellow Pages | Diversity / land-use mix (entropy) measure |

### C. Development pressure and validation
| Dataset | Source | Use |
|---|---|---|
| Building plans approved 2018 to 2025 with m² and use | CoJ Building Development Management | Validate 2018 index against actual development |
| Rezoning, consent and township applications and decisions | CoJ LUMS | Where rights were sought versus where policy wanted them |
| Deeds transactions, sectional title registrations | Deeds Office / Lightstone | Price gradients and investment flows |
| General Valuation 2023 roll | CoJ Valuations | Land value as a potential signal |
| Building footprint change (Google Open Buildings 2.5D temporal, Microsoft footprints) | Google, Microsoft | Detect backyard and informal densification in townships |
| Inclusionary housing approvals, UDZ incentive uptake | CoJ Housing, SARS | Policy uptake |

### D. Capacity and constraints
| Dataset | Source | Use |
|---|---|---|
| Water, sewer and electricity bulk capacity by zone or substation | Joburg Water WSDP, City Power | Capacity-constrained potential; SPLUMA s42 compliance |
| Dolomite risk, undermined land, mine residue areas | Council for Geoscience, DMRE, CoJ EISD | Hard constraints |
| Flood lines, wetlands (NFEPA), rivers | JRA, SANBI, GDARD | Hard constraints |
| Critical Biodiversity Areas and Ecological Support Areas (Gauteng C-Plan), ridges policy | GDARD, CoJ EISD | Policy constraints already referenced in Table 9 |
| Heritage register and heritage areas | PHRA-G, CoJ Arts Culture and Heritage | Sensitivity layer, not a veto |
| Slope from LiDAR DEM | CoJ Corporate GIS | Slope impedance in walking network |
| Vacant and under-used land, state-owned land | CoJ JPC, HDA, state land audit | Development capacity |

### E. Equity and behaviour
| Dataset | Source | Use |
|---|---|---|
| GCRO Quality of Life Survey 7 (2023/24): travel time, mode, satisfaction, safety | GCRO (open) | Equity weighting and validation of perceived access |
| National Household Travel Survey 2020 | Stats SA | Mode share and commute time by region |
| Rea Vaya smartcard ridership, Gautrain boardings, rank counts | Operators | Node value (actual demand) |
| Informal settlement register, hostels | CoJ Housing | Transformation-area targeting |
| SAPS crime per station precinct | SAPS | Safety as a walkability moderator |
| Tree canopy / NDVI and land surface temperature | Sentinel-2, Landsat | Green quality and heat for liveability |

---

## 8. Proposed method improvements

### 6.1 Make it reproducible
1. Rebuild the pipeline in code (Python with GeoPandas, OSMnx, r5py or OpenTripPlanner, pandana) or ArcGIS Pro / QGIS 3 model builder, with all parameters in a single configuration file and all inputs versioned with their vintage. Publish code and outputs alongside the policy, as the City already does for maps.
2. Keep the 400 m hexagon for continuity, but compute measures at erf access points as well so the property lookup is direct rather than a "predominant overlap" join. Consider H3 resolution 9 for interoperability with SEAD-SA and other national datasets.
3. Replace manual rationalisation with documented rules: majority filter, minimum mapping unit, contiguity to a transit stop or activity street, and a published decision log for every node whose boundary differs from the model.

### 6.2 Better measures
4. **Walkability:** build a pedestrian network including paths and sidewalks, apply slope impedance, treat freeways, rail lines, rivers and gated estates as barriers, and report intersection density and block length alongside the service-area ratio. Map OSM completeness and flag low-confidence cells instead of scoring them 0.
5. **Accessibility:** use travel time rather than distance, with facility-specific thresholds (for example primary school 15 minutes, clinic 30 minutes, tertiary 45 minutes by public transport) and cumulative-opportunity or gravity formulations. Count capacity (enrolment places, clinic headcount, jobs) rather than facilities.
6. **Public transport:** adopt a PTAL-style score from GTFS (walk time to stop plus frequency plus reliability) and a jobs-within-45-minutes-by-PT measure computed with r5. Score operating services only, and run planned infrastructure as a separate scenario.
7. **Normalisation:** use rank or percentile scaling, or log transform with winsorising, so a single outlier node does not compress the rest of the city. Distinguish "no data" from "no access".

### 6.3 Better index design
8. **Separate node value from place value** (Node-Place model). Node = transit level and walkability; place = population and employment density, land-use mix, amenities. Classify each cell or station precinct as balanced, transit-rich but under-developed (densify), activity-rich but transit-poor (invest in transport), or low on both. This replaces the 70 % commercial weighting that makes the current index describe today rather than potential.
9. **Add a capacity-and-constraints layer**: zoning headroom, vacant and under-used land, bulk services capacity, minus hard constraints (dolomite, flood, wetlands, CBAs). Potential = accessibility x capacity, masked by constraints.
10. **Add a demand layer and validate**: test whether the 2018 index predicted 2018 to 2025 building plans and rezonings (for example logistic regression of application presence on index score and sub-indexes). Report the result in the review; it is the single strongest piece of evidence for or against the weights.
11. **Weights:** derive through a structured process (Analytic Hierarchy Process or Delphi with CTSP, Transport, EISD, Housing, Economic Development and the public), then run Monte Carlo sensitivity and publish a robustness map showing how often each cell keeps its class.
12. **Replace the LED patch with an explicit transformation index**: population density, deprivation (Census 2022 and GCRO), jobs-housing imbalance, and travel time to jobs, used both to classify LED zones and to prioritise JSIP spending.
13. **Density conversion:** replace the straight line with zone-and-typology ranges tested against built-form feasibility (for example 40 to 60 du/ha as three-storey walk-ups) and bulk-services capacity, with transit-based uplifts similar to Ontario MTSA targets expressed as residents plus jobs per hectare.

### 6.4 Policy and monitoring
14. Publish an annual or biennial **State of the Nodes** report (Portland model, Cape Town Spatial Trends model) with per-node indicators: du/ha achieved, building-plan m², rezonings, vacancy, PT ridership, land-use mix, inclusionary units. Tie it to the five-year UDF and precinct-plan sunset clause already in the policy.
15. Align the model refresh to the SPLUMA five-year SDF cycle and lock a data-vintage table into the Annexure so every input has a date and owner.
16. Formalise data-sharing agreements for the heavy inputs (GDE EMIS, GDoH, SEAD-SA via National Treasury, GTI licence, operator GTFS and ridership).
17. Include facilities in neighbouring municipalities for all layers to remove boundary artefacts.
18. Report uncertainty: data completeness, geocoding accuracy, and sensitivity results, so the public and tribunals can see where the index is weak.

---

## 9. Suggested phasing

| Phase | Scope | Output |
|---|---|---|
| 1. Refresh (quick win) | Re-run the 2018 logic with Census 2022, GTI latest, OSM 2026, current PT networks and JSIP; code the pipeline | Updated maps, a "what changed" report, data-vintage table |
| 2. Validate | Compare 2018 index against 2018 to 2025 building plans and rezonings; sensitivity analysis of weights | Evidence note for the policy review |
| 3. Redesign | Node-place structure, travel-time accessibility, capacity and constraints, transformation index, structured weighting | Revised Annexure 2 and draft node boundaries for public comment |
| 4. Institutionalise | State of the Nodes dashboard, data agreements, five-year cycle | Monitoring framework in the policy |

---

## 10. Open questions settled before modelling

1. Is the next cycle a **refresh** of the 2018 method, a **redesign**, or a phased combination?
2. Which licensed or internal datasets are actually available to the team (GTI 2022/23, SEAD-SA, LIS, LUMS applications, building plans, JSIP, GTFS, EMIS)?
3. Should planned infrastructure (BRT 1C completion, PRASA restoration, Gautrain extensions) count towards potential, or only operating services?
4. What should the index optimise for first: transit-oriented densification, job access for the poor, economic growth in existing nodes, or infrastructure feasibility?
5. What software environment will the model live in (ArcGIS Pro, QGIS 3, Python), and who maintains it between review cycles?
6. Should Industrial nodes and the SAF corridors be brought into the model rather than overlaid from the SDF?

---

## 11. Agreed direction and redesign specification

Decisions recorded on 4 October 2026 from the policy owner:

| Question | Decision |
|---|---|
| Scope | Full redesign of the index, not a refresh of the 2018 logic |
| Data confirmed available | SEAD-SA employment data; LIS cadastre, LUMS applications and approved building plans; GTFS and ridership from Rea Vaya, Metrobus and Gautrain; open-source data. GTI building-based land use is **not** confirmed |
| Planned infrastructure | Count operating **and committed** services. Committed means an approved MTREF construction budget or an awarded contract. Everything else is a scenario only |
| Policy intent | All four: job access for low-income households, transit-oriented densification, growth of existing economic nodes, infrastructure-feasible growth |

### 11.1 Index architecture: four pillars, one classification

Each 400 m hexagon (and each erf access point) receives four pillar scores on 0 to 1. The pillars map one-to-one onto the four policy intents so that the weighting debate is explicit.

| Pillar | Policy intent served | Core measures | Primary data |
|---|---|---|---|
| **P1 Opportunity access** | Job access for low-income households | Jobs reachable within 45 and 60 minutes by walking plus public transport (door to door, including waiting from GTFS headways); same measure weighted by household deprivation; travel time to nearest clinic, primary school, high school by walking | SEAD-SA jobs, GTFS (Rea Vaya, Metrobus, Gautrain), PRASA operating lines, taxi route network, Census 2022 SAL income and unemployment, OSM pedestrian network, r5 routing |
| **P2 Node value** | Transit-oriented densification | PTAL-style score from walk time to stops and service frequency; number of distinct frequent services; ridership at the nearest station or rank; pedestrian network walkability (service-area ratio, intersection density, slope-adjusted) | GTFS, operator ridership, rank counts, OSM plus JRA sidewalks, LiDAR slope |
| **P3 Place value** | Growth of existing economic nodes | Employment density and firm count within 1 km; land-use mix entropy from zoning and points of interest; building-plan floor area approved 2018 to 2025; informal trading intensity; population density | SEAD-SA, LIS zoning, OSM and other open POIs, building plans, JPC trading permits, Census 2022 |
| **P4 Capacity** | Infrastructure-feasible growth | Zoning headroom (permitted bulk minus built bulk); vacant and under-used land; bulk water, sewer and electricity capacity class; hard-constraint mask (dolomite class, flood line, wetland, CBA, undermined land) | LIS and Land Use Scheme 2018, building plans, Joburg Water WSDP, City Power, Council for Geoscience, JRA, GDARD C-Plan |

**Substitute for GTI.** Without GeoTerraImage, the economic layer rests on SEAD-SA (employment and firms from tax records), LIS zoning (what is permitted), approved building plans (what was built), and open POIs (what is there). Building footprints from Google Open Buildings or Microsoft give built area where plans are missing. This combination is arguably stronger than 2012 GTI counts for a jobs-focused index, but it should be stated in the Annexure as a deliberate choice.

### 11.2 Classification

1. **Node-place matrix.** Node = mean of P1 and P2. Place = P3. Plot every hexagon:
   - High node, high place: *balanced* candidate for Metropolitan or Regional node.
   - High node, low place: *transit-rich, under-developed* candidate for General Urban densification or LED.
   - Low node, high place: *activity-rich, transit-poor* flag for transport investment before further intensification.
   - Low on both: Suburban or Peri-urban.
2. **Capacity gate.** P4 scales the permitted intensity within a class rather than the class itself, so a well-located cell with no sewer capacity is still shown as a node but carries a capacity flag and a lower interim density band. Hard constraints mask the cell regardless of score.
3. **Rule-based thresholds** replace Jenks: for example Metropolitan requires node score in the top decile and employment above a stated floor; Regional requires frequent transit plus a smaller employment floor. Thresholds are published in the Annexure and tested in the sensitivity run.
4. **Contiguity rules** replace manual rationalisation: majority filter over neighbouring cells, minimum mapping unit, and a logged list of every boundary set by hand with the reason.

### 11.3 Committed infrastructure handling

- Maintain one network dataset with a `status` field: operating, committed, planned.
- Base model uses operating plus committed. Publish a second map using operating only so the public can see how much of a node's standing depends on delivery.
- Review the committed list every budget cycle; a project that loses its budget drops back to planned and the affected cells are re-scored.

### 11.4 Weighting and sensitivity

- Hold one AHP or Delphi session with City Transformation and Spatial Planning, Transport, EISD, Housing, Economic Development and Joburg Water to set weights between the four pillars and within each pillar.
- Run a Monte Carlo perturbation of weights (for example 5 000 draws, plus or minus 20 % per weight) and publish a robustness map showing how often each cell keeps its class.
- Also publish an equal-weights map as a neutral reference.

### 11.5 Validation plan

- Build a 2018-equivalent score from the new pipeline on 2018 inputs where they exist, then test whether it predicts where LUMS rezoning and consent applications and approved building-plan floor area occurred in 2018 to 2025 (logistic or negative-binomial regression at hexagon level).
- Repeat for the new index on a hold-out: fit on 2018 to 2022 applications, test on 2023 to 2025.
- Report the results in the policy review. If the 2018 Economic Nodes Index predicts applications no better than SEAD-SA employment alone, that is the evidence for dropping the 70 % commercial-count weighting.

### 11.6 Tooling

- Python stack: GeoPandas, Shapely, OSMnx for the pedestrian network, r5py for public transport travel times, pandana or networkx for walking accessibility, h3-py for an optional H3 layer, scikit-learn for sensitivity and validation.
- QGIS 3 for cartography and public maps; ArcGIS Pro acceptable for the cadastral join if LIS workflows require it.
- Repository layout: `data/raw` with a vintage manifest, `data/processed`, `src` for the pipeline, `config/weights.yaml`, `outputs` for hexagon and erf layers, `docs` for the Annexure and decision log.

### 11.7 Outputs

1. Hexagon layer with the four pillar scores, node-place class, capacity flag, robustness value, and data-completeness flag.
2. Erf-level lookup (erf key, access-point node class, majority class, density band) for LIS and the public portal.
3. Node and zone boundary layer with a decision log for every hand-set boundary.
4. Two public maps: operating plus committed (policy basis) and operating only (delivery risk).
5. State of the Nodes indicator table per node for the monitoring cycle.

### 11.8 Immediate data requests

| Item | Owner to approach | Format wanted |
|---|---|---|
| SEAD-SA hexagon or mesozone employment and firm counts, latest two years | National Treasury Cities Support Programme | CSV with geography keys |
| GTFS feeds and 12 months of ridership by stop or station | Rea Vaya (CoJ Transport), Metrobus, Gautrain Management Agency | GTFS zip; CSV ridership |
| PRASA lines and stations with operating status | PRASA | Shapefile plus status table |
| Taxi routes and ranks, latest survey, with rank passenger counts | CoJ Transport, GPDRT | Shapefile, CSV |
| LIS cadastre with Land Use Scheme 2018 zoning, FAR, coverage, height | CoJ Development Planning | Geodatabase |
| LUMS applications 2018 to 2025 with type, decision and date | CoJ LUMS | CSV with erf key |
| Approved building plans 2018 to 2025 with use and m² | CoJ Building Development Management | CSV with erf key |
| Bulk services capacity by zone or substation | Joburg Water, City Power | Shapefile or zone table |
| JSIP MTREF project list with status flag (committed vs planned) | CoJ Group Strategy | Shapefile, CSV |
| Census 2022 SAL population, income, employment, dwelling type | Stats SA | CSV plus SAL boundaries |
| GCRO Quality of Life 7 ward-level indicators | GCRO (open) | CSV |
| OSM extract, Open Buildings footprints, LiDAR DEM | Geofabrik, Google, CoJ Corporate GIS | PBF, CSV, raster |

### 11.9 If no GTFS feed can be obtained

No Johannesburg operator publishes a GTFS feed openly. The specification therefore treats GTFS as something the project builds, not something it downloads.

| Step | Action | Effort |
|---|---|---|
| Internal request | Ask Rea Vaya scheduling and the Gautrain Management Agency for "the GTFS zip supplied to Google Maps". Ask CoJ Transport for the 2017 WhereIsMyTransport taxi route dataset | Letters, 2 to 4 weeks lead time |
| Minimal feed | Build stops, routes, trips and stop_times only, from published timetables: Rea Vaya, Gautrain (10 stations), Metrobus frequent routes first, PRASA operating lines only | 3 to 6 weeks of data entry; validate with the MobilityData GTFS validator |
| Taxi headways | No timetables exist. Attach assumed peak and off-peak headways to each route from the 2013 routes layer or newer CoJ surveys, and flag them as estimates in the output | 1 week |
| Fallback without GTFS | For a PTAL-style score, attach a headway attribute to each stop point and compute walk time plus half-headway directly. Only the jobs-within-45-minutes measure strictly needs a full feed for routing | None beyond attribute entry |
| Ownership | Register the Johannesburg GTFS as a City asset with a named custodian and an annual refresh, so the next review does not start from zero | Governance decision |

---

## Selected references and comparators

- Transport for London, Public Transport Accessibility Levels: https://data.london.gov.uk/dataset/public-transport-accessibility-levels
- C40, London PTAL scoring good-practice guide: https://www.c40.org/case-studies/c40-good-practice-guides-london-public-transport-accessibility-level-scoring/
- City of Cape Town, Transit Oriented Development Strategic Framework (2016): https://resource.capetown.gov.za/documentcentre/Documents/City%20strategies,%20plans%20and%20frameworks/Trans-Oriented_Development_TOD_Strategic_Framework.pdf
- City of Cape Town, Spatial Trends Report and MSDF 2023: https://www.capetown.gov.za/Work%20and%20business/Planning-portal/spatial-analysis-and-research/spatial-trends-report
- Cape Town Urban Development Index (UP repository): https://repository.up.ac.za/handle/2263/82421
- Access envelopes, Tshwane case studies (UP repository): https://repository.up.ac.za/handle/2263/45350
- Portland Metro, State of the Centers: https://oregonmetro.gov/state-centers-report
- Edmonton City Plan, Nodes and Corridors: https://www.edmonton.ca/sites/default/files/public-files/assets/PDF/CityPlan_NodesAndCorridors.pdf
- Victoria, Activity Centres structure planning (PPN58): https://www.planning.vic.gov.au/__data/assets/word_doc/0031/654268/PPN58-Structure-planning-for-activity-centres.doc
- Perth activity centre accessibility prioritisation: https://katalog.hcu-hamburg.de/vufind/Search2Record/DOAJ072507950
- US EPA Smart Location Mapping and National Walkability Index: https://www.epa.gov/node/46219
- GCRO Quality of Life Survey data: https://www.gcro.ac.za/outputs/dataportal/detail/
- City of Johannesburg, Nodal Review (public document): https://cpms.joburg.org.za/asset_uplds/docs/Laws%20and%20Regulations/Nodal%20Review.pdf
- City of Johannesburg, SDF 2040: https://joburg.org.za/documents_/Documents/Johannesburg-Spatial-Development-Framework-2040_APPROVED.pdf
- Bertolini, L. (1999) Spatial development patterns and public transport: the application of an analytical model in the Netherlands. *Planning Practice and Research* 14(2).

---
