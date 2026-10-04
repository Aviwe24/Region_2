# Review of Annexure 2: Urban Potential Modelling and Zone Delineation Method

**Purpose:** Technical review of the Urban Potential Model (Annexure 2, 21 Nov 2018) that underpins the City of Johannesburg Nodal Review Policy (approved 27 Feb 2020), with proposals for the next review cycle.

**Sources reviewed:**
- Annexure 2: Urban Potential Modelling and Zone Delineation Method, updated with public comments, 21 November 2018 (20 pp).
- Nodal Review Policy 2019/20, City Transformation and Spatial Planning, approved by Council 27 February 2020 (63 pp, with reviewer highlights).
- Repository layers: `NodalReview.json` (8 dissolved node/zone polygons), `Regions.json` (Regions A to G), `output.json` (TopoJSON of both).

---

## 1. What the 2018 model does (one-page summary)

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

## 3. Limitations of the 2018 method

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

## 4. How other cities do this work

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

## 5. Additional datasets to add in the next cycle

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

## 6. Proposed method improvements

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

## 7. Suggested phasing

| Phase | Scope | Output |
|---|---|---|
| 1. Refresh (quick win) | Re-run the 2018 logic with Census 2022, GTI latest, OSM 2026, current PT networks and JSIP; code the pipeline | Updated maps, a "what changed" report, data-vintage table |
| 2. Validate | Compare 2018 index against 2018 to 2025 building plans and rezonings; sensitivity analysis of weights | Evidence note for the policy review |
| 3. Redesign | Node-place structure, travel-time accessibility, capacity and constraints, transformation index, structured weighting | Revised Annexure 2 and draft node boundaries for public comment |
| 4. Institutionalise | State of the Nodes dashboard, data agreements, five-year cycle | Monitoring framework in the policy |

---

## 8. Open questions to settle before modelling

1. Is the next cycle a **refresh** of the 2018 method, a **redesign**, or a phased combination?
2. Which licensed or internal datasets are actually available to the team (GTI 2022/23, SEAD-SA, LIS, LUMS applications, building plans, JSIP, GTFS, EMIS)?
3. Should planned infrastructure (BRT 1C completion, PRASA restoration, Gautrain extensions) count towards potential, or only operating services?
4. What should the index optimise for first: transit-oriented densification, job access for the poor, economic growth in existing nodes, or infrastructure feasibility?
5. What software environment will the model live in (ArcGIS Pro, QGIS 3, Python), and who maintains it between review cycles?
6. Should Industrial nodes and the SAF corridors be brought into the model rather than overlaid from the SDF?

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
