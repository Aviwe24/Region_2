const pptxgen = require("pptxgenjs");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const sharp = require("sharp");
const path = require("path");
const fa = require("react-icons/fa");
const { applyTheme } = require("/root/.claude/skills/synced/6b77b78b-1713-4be5-858b-d37010aa16b9_66883df4-feea-450c-b835-6a08efb5b52e/pptx/scripts/apply_theme.js");

const THEME = {
  name: "Joburg Nodal Review",
  headFontFace: "Cambria", bodyFontFace: "Calibri",
  colors: { dk1: "1B2A41", lt1: "FFFFFF", dk2: "3A4A5E", lt2: "EEF2F6", accent1: "F2A900", accent2: "2E8B8B", accent3: "C0392B", accent4: "7F8C8D", accent5: "1B2A41", accent6: "A3B18A", hlink: "2E8B8B", folHlink: "7F8C8D" },
};
const H = THEME.colors;

async function icon(Comp, color, px = 256) {
  const svg = renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size: px }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = "Where should Johannesburg grow? Reviewing the evidence behind our nodes";
  pres.author = "City Transformation and Spatial Planning";
  const C = pres.SchemeColor;
  const W = 13.33, M = 0.6;

  // ---------- layouts ----------
  pres.defineSlideMaster({ title: "DARK", background: { color: H.dk1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: M, y: 2.3, w: W - 2 * M, h: 1.6, fontSize: 40, bold: true, color: C.background1, align: "left", valign: "bottom", margin: 0 } } },
      { placeholder: { options: { name: "body", type: "body", x: M, y: 4.05, w: W - 2 * M, h: 1.6, fontSize: 20, color: "CADCE8", align: "left", valign: "top", margin: 0 } } },
      { text: { text: "City of Johannesburg  |  Nodal Review Policy", options: { x: M, y: 6.9, w: 8, h: 0.35, fontSize: 10, color: "8DA2B5", margin: 0 } } },
    ] });
  pres.defineSlideMaster({ title: "LIGHT", background: { color: H.lt1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: M, y: 0.45, w: W - 2 * M, h: 0.9, fontSize: 32, bold: true, color: C.text1, align: "left", valign: "middle", margin: 0 } } },
      { text: { text: "City of Johannesburg  |  Nodal Review Policy  |  Review of Annexure 2", options: { x: M, y: 6.95, w: 9, h: 0.35, fontSize: 10, color: C.accent4, margin: 0 } } },
    ], slideNumber: { x: W - M - 0.8, y: 6.95, w: 0.8, h: 0.35, fontSize: 10, color: H.accent4, align: "right" } });
  pres.defineSlideMaster({ title: "SECTION", background: { color: H.accent2 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: M, y: 2.6, w: W - 2 * M, h: 1.4, fontSize: 40, bold: true, color: C.background1, align: "left", valign: "bottom", margin: 0 } } },
      { placeholder: { options: { name: "body", type: "body", x: M, y: 4.1, w: W - 2 * M, h: 1.2, fontSize: 20, color: "E6F2F2", align: "left", valign: "top", margin: 0 } } },
    ] });

  // helpers
  const tb = (slide, text, o) => slide.addText(text, { isTextBox: true, margin: 0, fontFace: undefined, ...o });
  const card = (slide, x, y, w, h, fill = H.lt2) => slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, line: { color: fill }, rectRadius: 0.12 });
  async function iconCard(slide, x, y, w, h, Comp, head, body, opts = {}) {
    card(slide, x, y, w, h, opts.fill || H.lt2);
    slide.addShape(pres.ShapeType.ellipse, { x: x + 0.25, y: y + 0.25, w: 0.6, h: 0.6, fill: { color: opts.circle || H.accent1 }, line: { color: opts.circle || H.accent1 } });
    slide.addImage({ data: await icon(Comp, opts.iconColor || H.dk1), x: x + 0.39, y: y + 0.39, w: 0.32, h: 0.32 });
    tb(slide, head, { x: x + 0.95, y: y + 0.18, w: w - 1.15, h: 0.78, fontSize: 16, bold: true, color: opts.headColor || H.dk1, valign: "middle" });
    tb(slide, body, { x: x + 0.25, y: y + 1.05, w: w - 0.5, h: h - 1.2, fontSize: 13, color: opts.bodyColor || H.dk2, valign: "top", paraSpaceAfter: 4 });
  }
  const notes = (s, t) => s.addNotes(t);

  // ================= 1. TITLE =================
  pres.addSection({ title: "Opening" });
  let s = pres.addSlide({ masterName: "DARK", sectionTitle: "Opening" });
  tb(s, "REVIEW OF ANNEXURE 2  |  URBAN POTENTIAL MODEL", { x: M, y: 1.6, w: 10, h: 0.4, fontSize: 13, color: H.accent1, bold: true, charSpacing: 2 });
  s.addText("Where should Johannesburg grow?", { placeholder: "title" });
  s.addText("What the evidence behind our nodes got right, where it falls short, and how we will rebuild it", { placeholder: "body" });
  tb(s, "City Transformation and Spatial Planning  |  Departmental briefing  |  October 2026", { x: M, y: 5.9, w: 10, h: 0.4, fontSize: 14, color: "CADCE8" });
  notes(s, "Purpose: brief non-technical colleagues on the review of the model behind the 2020 Nodal Review Policy and the decisions taken on its redesign. About 20 minutes plus discussion.");

  // ================= 2. WHY WE ARE HERE =================
  s = pres.addSlide({ masterName: "LIGHT", sectionTitle: "Opening" });
  s.addText("Why we are looking at this now", { placeholder: "title" });
  const steps = [
    ["2016", "SDF 2040 approved. It promised a dedicated review of the city's nodes, based on modelling and public input."],
    ["2018", "The Urban Potential Model was built and published. It scored every part of the city on access to transport, jobs and services."],
    ["2020", "Council approved the Nodal Review Policy. Seven zones replaced the old node boundaries."],
    ["2026", "SPLUMA asks for a five-year refresh. The SDF is under review. The model is now built on data that is 9 to 15 years old."],
  ];
  steps.forEach(([yr, txt], i) => {
    const x = M + i * 3.07;
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.9, y: 1.75, w: 1.2, h: 1.2, fill: { color: i === 3 ? H.accent1 : H.accent2 }, line: { color: i === 3 ? H.accent1 : H.accent2 } });
    tb(s, yr, { x: x + 0.9, y: 1.75, w: 1.2, h: 1.2, fontSize: 20, bold: true, color: i === 3 ? H.dk1 : H.lt1, align: "center", valign: "middle" });
    if (i < 3) s.addShape(pres.ShapeType.line, { x: x + 2.15, y: 2.35, w: 0.85, h: 0, line: { color: H.accent4, width: 1.5, dashType: "dash" } });
    tb(s, txt, { x, y: 3.2, w: 2.9, h: 1.9, fontSize: 13.5, color: H.dk2, valign: "top" });
  });
  card(s, M, 5.35, W - 2 * M, 1.2, H.lt2);
  tb(s, [{ text: "The question for the Department: ", options: { bold: true, color: H.dk1 } }, { text: "is the evidence behind our node boundaries and density rules still good enough to defend, and if not, what do we rebuild?", options: { color: H.dk2 } }], { x: M + 0.3, y: 5.35, w: W - 2 * M - 0.6, h: 1.2, fontSize: 16, valign: "middle" });
  notes(s, "Set the context. The nodal review was always meant to be revisited. We are now at that point, and the SDF review makes it timely.");

  // ================= 3. WHAT THE MODEL DID =================
  pres.addSection({ title: "The 2018 model" });
  s = pres.addSlide({ masterName: "SECTION", sectionTitle: "The 2018 model" });
  s.addText("What the 2018 model did", { placeholder: "title" });
  s.addText("In plain language, and what the city looks like as a result", { placeholder: "body" });

  s = pres.addSlide({ masterName: "LIGHT", sectionTitle: "The 2018 model" });
  s.addText("The model in four steps", { placeholder: "title" });
  const how = [
    [fa.FaThLarge, "Divide the city into cells", "The city was cut into about 10 000 hexagons, each 400 m across. That is a five-minute walk edge to edge."],
    [fa.FaWalking, "Measure walking access", "From the centre of each cell, how many schools, clinics, shops, parks and stations can you walk to in 30 minutes along real streets?"],
    [fa.FaCalculator, "Combine into scores", "Each count was turned into a 0 to 1 score and blended with fixed weights into two indexes: one for economic nodes, one for residential density."],
    [fa.FaMapMarkedAlt, "Draw the zones", "High scores became nodes, low scores became suburban or peri-urban. Existing nodes and public comments were then used to adjust the lines."],
  ];
  for (let i = 0; i < 4; i++) {
    const x = M + i * 3.07;
    await iconCard(s, x, 1.65, 2.87, 4.6, how[i][0], `${i + 1}. ${how[i][1]}`, how[i][2]);
  }
  notes(s, "Keep it simple. The model is essentially a walkability and access scorecard for every 400 m cell in the city.");

  // ================= 4. ZONE FOOTPRINT CHART =================
  s = pres.addSlide({ masterName: "LIGHT", sectionTitle: "The 2018 model" });
  s.addText("What came out of it: seven zones", { placeholder: "title" });
  s.addChart(pres.ChartType.bar, [{ name: "Share of city area", labels: ["Inner City Node", "Metropolitan Nodes", "Regional Nodes", "General Urban Zone", "LED Zone", "Suburban Zone", "Peri-urban Zone", "Beyond the UDB"], values: [1.2, 6.6, 2.8, 16.1, 7.5, 34.6, 12.4, 18.7] }],
    { x: M, y: 1.55, w: 7.6, h: 5.1, barDir: "bar", chartColors: [H.accent2], showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '0.0"%"', dataLabelFontSize: 11, dataLabelColor: H.dk1, dataLabelFontFace: "+mn-lt",
      catAxisLabelFontSize: 12, catAxisLabelColor: H.dk1, catAxisLabelFontFace: "+mn-lt", catAxisOrientation: "maxMin", valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, showLegend: false, showTitle: false, valAxisMaxVal: 42 });
  card(s, 8.6, 1.65, 4.13, 2.3, H.lt2);
  tb(s, "10%", { x: 8.85, y: 1.8, w: 3.6, h: 1.0, fontSize: 54, bold: true, color: H.accent2 });
  tb(s, "of the city's land is in the three node types where the policy wants the most growth", { x: 8.85, y: 2.8, w: 3.6, h: 1.0, fontSize: 14, color: H.dk2 });
  card(s, 8.6, 4.2, 4.13, 2.4, H.lt2);
  tb(s, "47%", { x: 8.85, y: 4.35, w: 3.6, h: 1.0, fontSize: 54, bold: true, color: H.accent1 });
  tb(s, "is suburban or peri-urban, where the model sets density by a sliding scale from 5 to 60 units per hectare", { x: 8.85, y: 5.35, w: 3.6, h: 1.1, fontSize: 14, color: H.dk2 });
  notes(s, "Areas are from the approved 2020 layer. Total 1 704 km². Industrial nodes and the Strategic Area Frameworks sit outside these seven classes.");

  // ================= 5. OLD DATA =================
  pres.addSection({ title: "What we found" });
  s = pres.addSlide({ masterName: "SECTION", sectionTitle: "What we found" });
  s.addText("What we found", { placeholder: "title" });
  s.addText("A SWOT and gap analysis of the 2018 method", { placeholder: "body" });

  s = pres.addSlide({ masterName: "LIGHT", sectionTitle: "What we found" });
  s.addText("The model describes a city that no longer exists", { placeholder: "title" });
  const stats = [["2011", "Population", "Census 2011 sub-places. Census 2022 is available."], ["2012", "Shops and factories", "GeoTerraImage building points, 14 years old."], ["2013", "Taxi routes", "Before the 2017 Gauteng taxi mapping."], ["2016", "Streets", "OpenStreetMap before most township streets were mapped."], ["2017", "Parks, schools, budget", "Pre-dates BRT Phase 1C and the PRASA collapse."]];
  stats.forEach(([n, l, d], i) => {
    const x = M + i * 2.45;
    card(s, x, 1.7, 2.3, 3.0, H.lt2);
    tb(s, n, { x: x + 0.2, y: 1.85, w: 1.9, h: 0.9, fontSize: 40, bold: true, color: H.accent3 });
    tb(s, l, { x: x + 0.2, y: 2.75, w: 1.9, h: 0.55, fontSize: 14, bold: true, color: H.dk1, valign: "top" });
    tb(s, d, { x: x + 0.2, y: 3.3, w: 1.9, h: 1.3, fontSize: 12, color: H.dk2, valign: "top" });
  });
  tb(s, "Since then: Census 2022, Waterfall and Modderfontein built out, Rea Vaya Phase 1C, PRASA collapsed and partly recovered, and large-scale backyard densification in Soweto, Diepsloot and Ivory Park.", { x: M, y: 5.05, w: W - 2 * M, h: 1.0, fontSize: 16, color: H.dk1, valign: "top" });
  tb(s, "Every number in the current policy map rests on inputs that are 9 to 15 years old.", { x: M, y: 6.05, w: W - 2 * M, h: 0.6, fontSize: 16, bold: true, color: H.accent3 });
  notes(s, "This is the simplest point to land with any audience. The data vintages come straight from Annexure 2.");

  // ================= 6. STRENGTHS =================
  s = pres.addSlide({ masterName: "LIGHT", sectionTitle: "What we found" });
  s.addText("What the 2018 model got right", { placeholder: "title" });
  const str = [
    [fa.FaBalanceScale, "A fair, city-wide yardstick", "Every part of the city was measured the same way for the first time, instead of inheriting node lines drawn in 2010."],
    [fa.FaWalking, "Built around walking and transit", "It measured access along real streets on foot, which is exactly what the SDF's compact-city vision asks for."],
    [fa.FaUsers, "Tested with the public", "Two rounds of participation, more than 80 written inputs, and every change after comment was written down."],
    [fa.FaFileAlt, "Published and usable", "The model, maps and method were put online, and the results were attached to every property in the City's land system."],
  ];
  for (let i = 0; i < 4; i++) { const col = i % 2, row = Math.floor(i / 2); await iconCard(s, M + col * 6.17, 1.65 + row * 2.5, 5.97, 2.3, str[i][0], str[i][1], str[i][2], { circle: H.accent2, iconColor: H.lt1 }); }
  notes(s, "Acknowledge the strengths. The redesign builds on these, it does not discard them.");

  // ================= 7. WEAKNESSES =================
  s = pres.addSlide({ masterName: "LIGHT", sectionTitle: "What we found" });
  s.addText("Where it falls short", { placeholder: "title" });
  const weak = [
    [fa.FaStore, "It counts shops, not jobs", "Economic activity was measured by counting formal commercial buildings. A spaza shop and Sandton City each count as one, and informal trading counts for nothing."],
    [fa.FaTrain, "A station is a station", "A planned BRT stop, a station with no trains and Gautrain all score the same. Frequency and whether the service runs were never included."],
    [fa.FaEyeSlash, "Township economies are invisible", "Because only formal buildings were counted, places like Diepsloot scored low. A special LED overlay was added to patch this."],
    [fa.FaPlug, "It ignores pipes and power", "Whether water, sewer and electricity can carry more growth, and whether land is dolomitic or floods, sit outside the model."],
    [fa.FaClipboardCheck, "It was never tested against reality", "Nobody checked whether the areas it scored highly are where development applications actually came in."],
    [fa.FaRedo, "It cannot be re-run", "The work lives in old ArcMap, QGIS 2.16 and Excel files. Node lines were partly adjusted by hand with no written rules."],
  ];
  for (let i = 0; i < 6; i++) { const col = i % 3, row = Math.floor(i / 3); await iconCard(s, M + col * 4.1, 1.6 + row * 2.55, 3.9, 2.4, weak[i][0], weak[i][1], weak[i][2], { circle: H.accent3, iconColor: H.lt1 }); }
  notes(s, "Six of the twenty weaknesses in the full review. These are the ones that matter for policy credibility.");

  // ================= 8. GAPS =================
  s = pres.addSlide({ masterName: "LIGHT", sectionTitle: "What we found" });
  s.addText("Eight gaps that matter most", { placeholder: "title" });
  tb(s, "Measured against what the policy itself promises, what SPLUMA requires, and what other cities now do", { x: M, y: 1.3, w: W - 2 * M, h: 0.4, fontSize: 14, color: H.accent4, italic: true });
  const gaps = [
    ["Job access for the poor", "No measure of how long it takes to reach work by taxi, bus or on foot"],
    ["Transit-led density", "Stations scored by distance only, with no frequency or operating status"],
    ["Potential vs performance", "The index mostly reflects where business already is, not where it could grow"],
    ["Infrastructure feasibility", "No link to water, sewer or electricity capacity, which SPLUMA requires us to consider"],
    ["Current data", "Inputs are 9 to 15 years old"],
    ["Informal economy", "Township trading and backyard growth are not measured"],
    ["Reproducibility", "No code and no written rules for hand-drawn boundaries, which weakens us at tribunal"],
    ["Validation", "Never tested against seven years of building plans and rezonings"],
  ];
  gaps.forEach(([h, d], i) => {
    const col = i % 4, row = Math.floor(i / 4), x = M + col * 3.07, y = 1.85 + row * 2.35;
    card(s, x, y, 2.87, 2.15, H.lt2);
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5, fill: { color: H.accent3 }, line: { color: H.accent3 } });
    tb(s, String(i + 1), { x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5, fontSize: 14, bold: true, color: H.lt1, align: "center", valign: "middle" });
    tb(s, h, { x: x + 0.85, y: y + 0.2, w: 1.9, h: 0.5, fontSize: 14, bold: true, color: H.dk1, valign: "middle" });
    tb(s, d, { x: x + 0.2, y: y + 0.85, w: 2.5, h: 1.2, fontSize: 12, color: H.dk2, valign: "top" });
  });
  tb(s, "All eight share one root cause: a one-off snapshot built on old, formal-sector data, with no capacity check, no validation and no repeatable rules.", { x: M, y: 6.4, w: W - 2 * M, h: 0.5, fontSize: 13, bold: true, color: H.dk1, valign: "top" });
  notes(s, "The full gap analysis has 22 rows. These eight are rated High.");

  // ================= 9. OPPORTUNITIES AND THREATS =================
  s = pres.addSlide({ masterName: "LIGHT", sectionTitle: "What we found" });
  s.addText("Opportunities and threats", { placeholder: "title" });
  const colW = (W - 2 * M - 0.4) / 2;
  const opp = ["Census 2022 gives us current population down to small areas", "SARS-based employment data (SEAD-SA) tells us where jobs really are", "Our own land system, applications and building plans can test the model", "Free routing tools can measure travel time by taxi, bus and on foot", "Cape Town, London and others have tested designs we can borrow", "The SDF review is the right moment to re-base the evidence"];
  const thr = ["Operators and agencies slow to share transit and jobs data", "Legal challenge where a boundary cannot be explained or reproduced", "Water, power and rail decline making modelled growth undeliverable", "Boundaries bent for single developments, as happened in 2018", "Staff turnover losing the files and the know-how again", "A redesign so complex that nobody outside the team trusts it"];
  const otCols = [[opp, "Opportunities", H.accent2, fa.FaLightbulb], [thr, "Threats", H.accent3, fa.FaExclamationTriangle]];
  for (let k = 0; k < 2; k++) {
    const [items, head, col, Ic] = otCols[k];
    const x = M + k * (colW + 0.4);
    card(s, x, 1.6, colW, 5.1, H.lt2);
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.3, y: 1.85, w: 0.6, h: 0.6, fill: { color: col }, line: { color: col } });
    s.addImage({ data: await icon(Ic, H.lt1), x: x + 0.44, y: 1.99, w: 0.32, h: 0.32 });
    tb(s, head, { x: x + 1.05, y: 1.85, w: 4, h: 0.6, fontSize: 20, bold: true, color: H.dk1, valign: "middle" });
    tb(s, items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1 } })), { x: x + 0.3, y: 2.65, w: colW - 0.6, h: 3.9, fontSize: 14, color: H.dk2, valign: "top", paraSpaceAfter: 8 });
  }
  notes(s, "Opportunities are largely about data that did not exist or was not accessible in 2017. Threats are about delivery and credibility.");

  // ================= 10. OTHER CITIES =================
  pres.addSection({ title: "Learning from others" });
  s = pres.addSlide({ masterName: "LIGHT", sectionTitle: "Learning from others" });
  s.addText("How other cities do it", { placeholder: "title" });
  const cities = [
    ["Cape Town", "TOD Comprehensive Model and ECAMP", "Models where households and jobs should go to cut transport cost, and scores each business precinct on how it performs today against how well it is located."],
    ["London", "PTAL and town-centre health checks", "Grades every 100 m of the city on walk time to a stop plus how often the service runs. Centres are re-checked on a fixed cycle."],
    ["Netherlands", "Node-Place model", "Scores each station on transport supply and on surrounding land use separately, then asks which is lagging the other."],
    ["Portland, USA", "State of the Centers report", "A recurring report card for every centre: people, jobs, amenities, street connections and transit."],
  ];
  for (let i = 0; i < 4; i++) {
    const x = M + i * 3.07;
    card(s, x, 1.65, 2.87, 3.75, H.lt2);
    tb(s, cities[i][0], { x: x + 0.25, y: 1.8, w: 2.4, h: 0.45, fontSize: 18, bold: true, color: H.accent2 });
    tb(s, cities[i][1], { x: x + 0.25, y: 2.25, w: 2.4, h: 0.7, fontSize: 13, bold: true, color: H.dk1, valign: "top" });
    tb(s, cities[i][2], { x: x + 0.25, y: 2.95, w: 2.4, h: 2.35, fontSize: 12.5, color: H.dk2, valign: "top" });
  }
  card(s, M, 5.6, W - 2 * M, 1.0, H.dk1);
  tb(s, [{ text: "The two ingredients we lack: ", options: { bold: true, color: H.accent1 } }, { text: "service frequency on transport, and a clear split between how a place performs now and what it could become.", options: { color: H.lt1 } }], { x: M + 0.3, y: 5.6, w: W - 2 * M - 0.6, h: 1.0, fontSize: 16, valign: "middle" });
  notes(s, "None of these cities invented something exotic. They separate transport supply from land-use performance, they use frequency, and they monitor on a cycle.");

  // ================= 11. DECISIONS =================
  pres.addSection({ title: "The way forward" });
  s = pres.addSlide({ masterName: "SECTION", sectionTitle: "The way forward" });
  s.addText("The way forward", { placeholder: "title" });
  s.addText("Decisions taken and what the rebuilt model will do", { placeholder: "body" });

  s = pres.addSlide({ masterName: "LIGHT", sectionTitle: "The way forward" });
  s.addText("Four decisions already taken", { placeholder: "title" });
  const dec = [
    [fa.FaDraftingCompass, "Rebuild, do not patch", "A full redesign of the index rather than re-running the 2018 method with newer data."],
    [fa.FaDatabase, "Use the data we can get", "SARS-based jobs data, our own land and applications systems, transport schedules, and open data. Licensed building data is not assumed."],
    [fa.FaHardHat, "Count what is built or budgeted", "Operating services and committed projects count. Everything else is shown as a separate scenario so delivery risk is visible."],
    [fa.FaBullseye, "Serve four aims at once", "Job access for low-income households, growth around transit, stronger existing nodes, and growth that infrastructure can carry."],
  ];
  for (let i = 0; i < 4; i++) { const col = i % 2, row = Math.floor(i / 2); await iconCard(s, M + col * 6.17, 1.65 + row * 2.5, 5.97, 2.3, dec[i][0], dec[i][1], dec[i][2]); }
  notes(s, "These were confirmed with the policy owner during the review and are recorded in section 11 of the written report.");

  // ================= 12. NEW APPROACH DIAGRAM =================
  s = pres.addSlide({ masterName: "LIGHT", sectionTitle: "The way forward" });
  s.addText("The new approach on one page", { placeholder: "title" });
  const pillars = [
    [fa.FaBriefcase, "Opportunity", "How many jobs can you reach in 45 minutes by taxi, bus or on foot?", H.accent2],
    [fa.FaBus, "Transport", "How often do services run, and how walkable are the streets around them?", H.accent2],
    [fa.FaCity, "Place", "How many jobs, people and mixed uses are already here?", H.accent1],
    [fa.FaTint, "Capacity", "Can the pipes, power and land rights carry more growth, and is the land safe to build on?", H.accent1],
  ];
  for (let i = 0; i < 4; i++) {
    const y = 1.6 + i * 1.25;
    card(s, M, y, 4.6, 1.1, H.lt2);
    s.addShape(pres.ShapeType.ellipse, { x: M + 0.2, y: y + 0.25, w: 0.6, h: 0.6, fill: { color: pillars[i][3] }, line: { color: pillars[i][3] } });
    s.addImage({ data: await icon(pillars[i][0], H.dk1), x: M + 0.34, y: y + 0.39, w: 0.32, h: 0.32 });
    tb(s, pillars[i][1], { x: M + 0.95, y: y + 0.12, w: 3.5, h: 0.4, fontSize: 15, bold: true, color: H.dk1 });
    tb(s, pillars[i][2], { x: M + 0.95, y: y + 0.5, w: 3.5, h: 0.55, fontSize: 11.5, color: H.dk2, valign: "top" });
  }
  // arrows
  s.addShape(pres.ShapeType.rightArrow, { x: 5.35, y: 3.5, w: 0.6, h: 0.6, fill: { color: H.accent4 }, line: { color: H.accent4 } });
  // 2x2 matrix
  const mx = 6.55, my = 1.75, cw = 1.7, ch = 1.6;
  const cells = [["Good transport, little activity", "Densify here", H.accent2, H.lt1], ["Strong on both", "Our nodes", H.dk1, H.lt1], ["Weak on both", "Suburban or peri-urban", H.lt2, H.dk1], ["Busy place, poor transport", "Invest in transport first", H.accent1, H.dk1]];
  cells.forEach(([a, b, f, t], i) => {
    const col = i % 2, row = Math.floor(i / 2), x = mx + col * (cw + 0.08), y = my + row * (ch + 0.08);
    s.addShape(pres.ShapeType.rect, { x, y, w: cw, h: ch, fill: { color: f }, line: { color: f } });
    tb(s, [{ text: b, options: { bold: true, fontSize: 13, breakLine: true } }, { text: a, options: { fontSize: 10.5 } }], { x: x + 0.12, y: y + 0.1, w: cw - 0.24, h: ch - 0.2, color: t, valign: "middle", align: "center" });
  });
  tb(s, "Place: weak  \u2192  strong", { x: mx - 0.1, y: my + 2 * ch + 0.12, w: 2 * cw + 0.3, h: 0.3, fontSize: 11, color: H.accent4, align: "center" });
  tb(s, "Transport and opportunity: weak  \u2192  strong", { x: mx - 1.9, y: my + ch - 0.1, w: 3.6, h: 0.3, fontSize: 11, color: H.accent4, align: "center", rotate: 270 });
  tb(s, "Capacity sets how much growth each cell may take, and flags where services must come first.", { x: mx - 0.1, y: my + 2 * ch + 0.5, w: 2 * cw + 0.9, h: 0.9, fontSize: 11.5, color: H.dk2, italic: true, valign: "top" });
  s.addShape(pres.ShapeType.rightArrow, { x: 10.3, y: 3.5, w: 0.7, h: 0.6, fill: { color: H.accent4 }, line: { color: H.accent4 } });
  card(s, 11.2, 1.75, 1.75, 4.6, H.dk1);
  tb(s, [{ text: "Zones", options: { bold: true, fontSize: 16, color: H.accent1, breakLine: true } }, { text: " ", options: { fontSize: 6, breakLine: true } }, ...["Inner City", "Metropolitan", "Regional", "General Urban", "LED", "Suburban", "Peri-urban", "Beyond UDB"].map((z, i, a) => ({ text: z, options: { fontSize: 12, color: H.lt1, breakLine: i < a.length - 1 } }))], { x: 11.35, y: 1.9, w: 1.5, h: 4.3, valign: "top", paraSpaceAfter: 5 });
  tb(s, "Classes are set by published thresholds and written rules, not by hand. Every weight is tested to show how much the map moves if it changes.", { x: M, y: 6.5, w: W - 2 * M, h: 0.45, fontSize: 12, color: H.dk1, bold: true, valign: "top" });
  notes(s, "Four questions in, a simple sort in the middle, the familiar zones out. The matrix is the Node-Place idea in plain words.");

  // ================= 13. WHAT CHANGES FOR THE PUBLIC =================
  s = pres.addSlide({ masterName: "LIGHT", sectionTitle: "The way forward" });
  s.addText("What will be different this time", { placeholder: "title" });
  const diff = [
    ["Then", "Now", H.accent4, H.accent2],
  ];
  const rows = [
    ["Counted shops within 2 km", "Counts jobs and how long it takes to reach them"],
    ["Any station, any status, same score", "Frequency counts; only running or budgeted services count"],
    ["Services and constraints handled by policy text", "Water, power, dolomite and flood lines inside the model"],
    ["Weights chosen by the modellers", "Weights set with departments and tested for sensitivity"],
    ["Node lines partly adjusted by hand", "Published thresholds and a written log of every change"],
    ["One map, once", "A State of the Nodes report on a fixed cycle"],
    ["Files on one person's computer", "A re-runnable model owned by the City"],
  ];
  const tw = W - 2 * M, c1 = 1.1, c2 = (tw - c1) / 2;
  s.addTable([
    [{ text: "", options: { fill: { color: H.lt1 } } }, { text: "2018 model", options: { bold: true, color: H.lt1, fill: { color: H.accent4 }, fontSize: 15 } }, { text: "Rebuilt model", options: { bold: true, color: H.lt1, fill: { color: H.accent2 }, fontSize: 15 } }],
    ...rows.map((r, i) => [{ text: String(i + 1), options: { bold: true, color: H.accent4, align: "center" } }, { text: r[0], options: { color: H.dk2 } }, { text: r[1], options: { color: H.dk1, bold: true } }]),
  ], { x: M, y: 1.6, w: tw, colW: [c1, c2, c2], fontSize: 13, fontFace: "+mn-lt", rowH: 0.58, border: { type: "solid", color: "FFFFFF", pt: 2 }, fill: { color: H.lt2 }, valign: "middle", margin: [4, 10, 4, 10] });
  notes(s, "A before-and-after view is the easiest way for a non-technical audience to grasp the redesign.");

  // ================= 14. WHAT WE NEED =================
  s = pres.addSlide({ masterName: "LIGHT", sectionTitle: "The way forward" });
  s.addText("What we need from partners", { placeholder: "title" });
  const asks = [
    [fa.FaBus, "Transport operators", "Rea Vaya, Metrobus, Gautrain and PRASA: schedules in a standard format and a year of passenger numbers. Where no schedule exists, we will build one from timetables."],
    [fa.FaLandmark, "National Treasury", "Access to the SARS-based employment dataset (SEAD-SA) so we can count jobs, not buildings."],
    [fa.FaBuilding, "Inside the City", "Land Use Scheme rights from LIS, seven years of applications and building plans, bulk services capacity from Joburg Water and City Power, and the capital budget with a committed or planned flag."],
    [fa.FaSchool, "Province and open sources", "School places and clinic headcounts from GDE and Health; Census 2022; the GCRO Quality of Life survey; Gauteng's taxi route mapping."],
  ];
  for (let i = 0; i < 4; i++) { const col = i % 2, row = Math.floor(i / 2); await iconCard(s, M + col * 6.17, 1.65 + row * 2.5, 5.97, 2.3, asks[i][0], asks[i][1], asks[i][2], { circle: H.accent2, iconColor: H.lt1 }); }
  notes(s, "Data requests are itemised in section 11.8 of the report with the format wanted for each.");

  // ================= 15. TIMELINE =================
  s = pres.addSlide({ masterName: "LIGHT", sectionTitle: "The way forward" });
  s.addText("How the work unfolds", { placeholder: "title" });
  const ph = [
    ["1", "Gather and build", "Data requests out, City GTFS built from timetables, pipeline coded on the 2018 logic as a baseline"],
    ["2", "Test the old model", "Check whether the 2018 scores predicted where applications actually came in. Publish the result"],
    ["3", "Rebuild and consult", "Four-pillar model, weights set with departments, draft boundaries out for public comment"],
    ["4", "Institutionalise", "State of the Nodes report, data custodians named, five-year cycle aligned with the SDF"],
  ];
  ph.forEach(([n, h, d], i) => {
    const x = M + i * 3.07;
    s.addShape(pres.ShapeType.chevron, { x, y: 1.9, w: 2.95, h: 1.0, fill: { color: i % 2 ? H.accent2 : H.dk1 }, line: { color: H.lt1, width: 2 } });
    tb(s, `Phase ${n}`, { x: x + 0.45, y: 1.9, w: 2.1, h: 1.0, fontSize: 18, bold: true, color: H.lt1, valign: "middle" });
    tb(s, h, { x: x + 0.1, y: 3.15, w: 2.7, h: 0.5, fontSize: 17, bold: true, color: H.dk1 });
    tb(s, d, { x: x + 0.1, y: 3.7, w: 2.7, h: 2.0, fontSize: 13, color: H.dk2, valign: "top" });
  });
  card(s, M, 5.75, W - 2 * M, 0.85, H.lt2);
  tb(s, [{ text: "Quick win: ", options: { bold: true, color: H.dk1 } }, { text: "Phase 2 can start as soon as the applications and building-plan extracts are in hand. It needs no new data from outside the City.", options: { color: H.dk2 } }], { x: M + 0.3, y: 5.75, w: W - 2 * M - 0.6, h: 0.85, fontSize: 15, valign: "middle" });
  notes(s, "Phasing is indicative. Timing depends on data access, which is the main threat.");

  // ================= 16. CLOSE =================
  pres.addSection({ title: "Close" });
  s = pres.addSlide({ masterName: "DARK", sectionTitle: "Close" });
  s.addText("An evidence base we can defend", { placeholder: "title" });
  s.addText("The 2018 model gave the City its first fair yardstick. The rebuilt model will measure jobs, service frequency and capacity, be tested against what was actually built, and be re-run by the City on a fixed cycle.", { placeholder: "body" });
  tb(s, "Asks of this meeting", { x: M, y: 5.55, w: 5, h: 0.4, fontSize: 14, bold: true, color: H.accent1 });
  tb(s, [{ text: "Endorse the four decisions", options: { bullet: true, breakLine: true } }, { text: "Authorise the data requests to operators, Treasury and internal departments", options: { bullet: true, breakLine: true } }, { text: "Nominate a model custodian in the Department", options: { bullet: true } }], { x: M, y: 5.95, w: 11, h: 0.95, fontSize: 14, color: "CADCE8", paraSpaceAfter: 3 });
  notes(s, "Close on the asks. Full written review is in the Word report circulated with this deck.");

  const out = "/home/user/Region_2/docs/Annexure2_Review_Briefing.pptx";
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  console.log("wrote", out);
})().catch(e => { console.error(e); process.exit(1); });
