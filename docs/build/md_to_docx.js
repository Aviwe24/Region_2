// Convert docs/Annexure2_Urban_Potential_Model_Review.md into a formatted Word report.
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, ShadingType, PageOrientation, TableOfContents,
  LevelFormat, PageBreak, Footer, Header, PageNumber, ExternalHyperlink, VerticalAlign,
} = require("docx");

const src = fs.readFileSync(path.join(__dirname, "..", "Annexure2_Urban_Potential_Model_Review.md"), "utf8");
const lines = src.split("\n");

const NAVY = "1F3864", TEAL = "2E75B6", GREY = "F2F2F2", LIGHT = "DEEAF6", DARK = "333333";
const FONT = "Calibri";

// ---------- inline markdown ----------
function inline(text, base = {}) {
  const runs = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|https?:\/\/\S+)/g;
  let last = 0, m;
  while ((m = re.exec(text))) {
    if (m.index > last) runs.push(new TextRun({ text: text.slice(last, m.index), font: FONT, ...base }));
    const t = m[0];
    if (t.startsWith("**")) runs.push(new TextRun({ text: t.slice(2, -2), bold: true, font: FONT, ...base }));
    else if (t.startsWith("*")) runs.push(new TextRun({ text: t.slice(1, -1), italics: true, font: FONT, ...base }));
    else if (t.startsWith("`")) runs.push(new TextRun({ text: t.slice(1, -1), font: "Consolas", ...base }));
    else if (t.startsWith("[")) {
      const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(t);
      runs.push(new ExternalHyperlink({ link: mm[2], children: [new TextRun({ text: mm[1], style: "Hyperlink", font: FONT, ...base })] }));
    } else runs.push(new ExternalHyperlink({ link: t, children: [new TextRun({ text: t, style: "Hyperlink", font: FONT, size: base.size || 18 })] }));
    last = m.index + t.length;
  }
  if (last < text.length) runs.push(new TextRun({ text: text.slice(last), font: FONT, ...base }));
  return runs;
}

// ---------- block parsing ----------
const blocks = [];
let i = 0;
while (i < lines.length) {
  const l = lines[i];
  if (/^\s*$/.test(l)) { i++; continue; }
  if (l.startsWith("---")) { i++; continue; }
  let h;
  if ((h = /^(#{1,3}) (.*)/.exec(l))) { blocks.push({ t: "h", lvl: h[1].length, text: h[2] }); i++; continue; }
  if (l.startsWith("> ")) { blocks.push({ t: "quote", text: l.slice(2) }); i++; continue; }
  if (l.startsWith("|")) {
    const rows = [];
    while (i < lines.length && lines[i].startsWith("|")) { rows.push(lines[i]); i++; }
    const parse = r => r.replace(/^\||\|$/g, "").split("|").map(c => c.trim());
    const header = parse(rows[0]);
    const body = rows.slice(2).map(parse);
    blocks.push({ t: "table", header, body });
    continue;
  }
  if (/^- /.test(l)) { blocks.push({ t: "bullet", text: l.slice(2) }); i++; continue; }
  if (/^\d+\. /.test(l)) { blocks.push({ t: "num", text: l.replace(/^\d+\. /, "") }); i++; continue; }
  if (/^   - /.test(l)) { blocks.push({ t: "bullet2", text: l.trim().slice(2) }); i++; continue; }
  // paragraph (may continue on following non-empty, non-special lines)
  let para = l;
  i++;
  while (i < lines.length && lines[i].trim() && !/^(#|\||- |\d+\. |> |---|   - )/.test(lines[i])) { para += " " + lines[i].trim(); i++; }
  blocks.push({ t: "p", text: para });
}

// ---------- group into sections by H2 ----------
const sections = [];
let cur = { title: null, blocks: [] };
for (const b of blocks) {
  if (b.t === "h" && b.lvl === 1) continue; // title handled on cover
  if (b.t === "h" && b.lvl === 2) { if (cur.blocks.length || cur.title) sections.push(cur); cur = { title: b.text, blocks: [] }; continue; }
  cur.blocks.push(b);
}
sections.push(cur);

// ---------- renderers ----------
const spacing = { after: 120, line: 276 };
function para(text, opts = {}) { return new Paragraph({ children: inline(text, opts.run || {}), spacing, ...opts.p }); }

function table(b, landscape) {
  const ncol = b.header.length;
  const pageW = landscape ? 15026 : 9638; // A4 minus 1.27cm margins (landscape) / 2cm margins (portrait)
  // weight columns by average text length, bounded
  const lens = b.header.map((_, c) => {
    const all = [b.header[c], ...b.body.map(r => r[c] || "")];
    const avg = all.reduce((s, x) => s + x.length, 0) / all.length;
    return Math.min(Math.max(avg, 4), 60);
  });
  const tot = lens.reduce((a, x) => a + x, 0);
  let widths = lens.map(x => Math.round(pageW * x / tot));
  widths[widths.length - 1] += pageW - widths.reduce((a, x) => a + x, 0);
  const size = ncol >= 6 ? 16 : ncol >= 4 ? 17 : 19;
  const border = { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF" };
  const borders = { top: border, bottom: border, left: border, right: border };
  const cell = (txt, c, isHead, shade) => new TableCell({
    width: { size: widths[c], type: WidthType.DXA },
    borders,
    shading: shade ? { type: ShadingType.CLEAR, fill: shade, color: "auto" } : undefined,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    verticalAlign: VerticalAlign.TOP,
    children: [new Paragraph({ children: inline(txt || "", { size, bold: isHead, color: isHead ? "FFFFFF" : DARK }), spacing: { after: 0, line: 252 } })],
  });
  const rows = [new TableRow({ tableHeader: true, cantSplit: true, children: b.header.map((h, c) => cell(h, c, true, NAVY)) })];
  b.body.forEach((r, ri) => rows.push(new TableRow({ cantSplit: true, children: b.header.map((_, c) => cell(r[c], c, false, ri % 2 ? GREY : undefined)) })));
  return [new Table({ rows, width: { size: pageW, type: WidthType.DXA }, columnWidths: widths }), new Paragraph({ spacing: { after: 120 } })];
}

function render(b, landscape) {
  switch (b.t) {
    case "h": return [new Paragraph({ text: b.text, heading: b.lvl === 3 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3, spacing: { before: 240, after: 120 } })];
    case "p": return [para(b.text)];
    case "quote": return [new Paragraph({ children: inline(b.text, { italics: true, color: "595959" }), indent: { left: 567 }, border: { left: { style: BorderStyle.SINGLE, size: 12, color: TEAL, space: 8 } }, spacing })];
    case "bullet": return [new Paragraph({ children: inline(b.text), numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 } })];
    case "bullet2": return [new Paragraph({ children: inline(b.text), numbering: { reference: "bullets", level: 1 }, spacing: { after: 80 } })];
    case "num": return [new Paragraph({ children: inline(b.text), numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 } })];
    case "table": return table(b, landscape);
  }
  return [];
}

// ---------- page setup ----------
const portrait = { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } };
const landscapeProps = { page: { size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE }, margin: { top: 720, bottom: 720, left: 720, right: 720 } } };

const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
  new TextRun({ text: "Review of Annexure 2: Urban Potential Modelling Method  |  Page ", font: FONT, size: 16, color: "7F7F7F" }),
  new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: "7F7F7F" }) ] })] });
const header = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "City of Johannesburg  |  City Transformation and Spatial Planning  |  Nodal Review Policy", font: FONT, size: 16, color: "7F7F7F" })], border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "BFBFBF", space: 4 } } })] });

// ---------- cover ----------
const today = "October 2026";
const cover = {
  properties: portrait,
  children: [
    new Paragraph({ spacing: { before: 2400 } }),
    new Paragraph({ children: [new TextRun({ text: "CITY OF JOHANNESBURG", font: FONT, size: 24, color: TEAL, bold: true })], spacing: { after: 120 } }),
    new Paragraph({ children: [new TextRun({ text: "City Transformation and Spatial Planning", font: FONT, size: 22, color: "595959" })], spacing: { after: 1200 } }),
    new Paragraph({ children: [new TextRun({ text: "Review of Annexure 2", font: FONT, size: 56, bold: true, color: NAVY })], spacing: { after: 120 } }),
    new Paragraph({ children: [new TextRun({ text: "Urban Potential Modelling and Zone Delineation Method", font: FONT, size: 36, color: NAVY })], spacing: { after: 240 } }),
    new Paragraph({ children: [new TextRun({ text: "SWOT analysis, gap analysis and recommendations for the Nodal Review Policy review", font: FONT, size: 26, color: "595959", italics: true })], border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: TEAL, space: 12 } }, spacing: { after: 2400 } }),
    new Paragraph({ children: [new TextRun({ text: "Discussion document for departmental review", font: FONT, size: 22, bold: true })], spacing: { after: 80 } }),
    new Paragraph({ children: [new TextRun({ text: today, font: FONT, size: 22 })], spacing: { after: 1200 } }),
    new Table({
      width: { size: 9638, type: WidthType.DXA }, columnWidths: [2800, 6838],
      rows: [
        ["Document", "Review of Annexure 2 to the Nodal Review Policy 2019/20"],
        ["Status", "Draft for departmental discussion"],
        ["Version", "0.1"],
        ["Date", today],
        ["Prepared for", "City Transformation and Spatial Planning, City of Johannesburg"],
        ["Source documents", "Annexure 2: Urban Potential Modelling and Zone Delineation Method (21 Nov 2018); Nodal Review Policy 2019/20 (approved 27 Feb 2020)"],
      ].map(([k, v], ri) => new TableRow({ children: [
        new TableCell({ width: { size: 2800, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: LIGHT, color: "auto" }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: k, bold: true, font: FONT, size: 20 })] })] }),
        new TableCell({ width: { size: 6838, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: v, font: FONT, size: 20 })] })] }),
      ] })),
    }),
  ],
};

// ---------- TOC section ----------
const toc = {
  properties: portrait, headers: { default: header }, footers: { default: footer },
  children: [
    new Paragraph({ text: "Contents", heading: HeadingLevel.HEADING_1 }),
    new TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-2" }),
  ],
};

// ---------- body sections ----------
const bodySections = sections.filter(s => s.title).map(s => {
  const wide = s.blocks.some(b => b.t === "table" && b.header.length >= 5);
  const children = [new Paragraph({ text: s.title, heading: HeadingLevel.HEADING_1, spacing: { before: 0, after: 200 } })];
  for (const b of s.blocks) children.push(...render(b, wide));
  return { properties: wide ? landscapeProps : portrait, headers: { default: header }, footers: { default: footer }, children };
});

const doc = new Document({
  creator: "City Transformation and Spatial Planning",
  title: "Review of Annexure 2: Urban Potential Modelling and Zone Delineation Method",
  features: { updateFields: true },
  styles: {
    default: { document: { run: { font: FONT, size: 21, color: DARK } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 32, bold: true, color: NAVY, font: FONT }, paragraph: { spacing: { before: 240, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 26, bold: true, color: TEAL, font: FONT }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 22, bold: true, color: DARK, font: FONT }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ],
  },
  numbering: { config: [
    { reference: "bullets", levels: [
      { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 567, hanging: 283 } } } },
      { level: 1, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1134, hanging: 283 } } } } ] },
    { reference: "numbers", levels: [ { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 567, hanging: 283 } } } } ] },
  ] },
  sections: [cover, toc, ...bodySections],
});

const out = path.join(__dirname, "..", "Annexure2_Review_for_Department.docx");
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(out, buf); console.log("wrote", out, buf.length, "bytes;", bodySections.length, "sections"); });
