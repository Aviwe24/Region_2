# Building in the Middle

A three-hour, first-year urban design studio session on missing middle housing
typologies, set in Johannesburg.

`index.html` is the full session pack:

- Learning outcomes and a minute-by-minute run of show
- An opener ("What the street shows") with hidden plans to reveal in class
- Mini-lecture notes: five key ideas, with a street-elevation spectrum
- Eight printable type cards, all drawn at the same scale, with density metrics
- A student-facing studio brief and four test stands
- A plot lab that calculates coverage, FAR, net density and open space, and
  checks a scheme against Nodal Review guidance
- An interactive Nodal Review map built from this repository's data
- A formative rubric, an exit ticket, facilitator notes and sources

The page is published as an artifact, which adds the document skeleton
(`<!doctype>`, `<head>`, `<body>`) at publish time, so the file starts with
`<title>`.

## Map data

The map is embedded in `index.html`. After changing `NodalReview.json` or
`Regions.json`, regenerate it from the repository root:

```sh
python3 class-session/build_map.py
```

## Caveats

Nodal Review density and height figures come from City and press summaries of
the policy (approved by Council in February 2020). Check them against the
approved document before teaching. Stand sizes and type figures are
illustrative teaching numbers.
