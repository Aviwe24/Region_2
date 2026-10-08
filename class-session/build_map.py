"""Embed a simplified Nodal Review + Regions map into index.html.

Reads NodalReview.json and Regions.json from the repository root, projects
them to a flat 1000-unit-wide frame, simplifies each ring (Douglas-Peucker)
and writes the result into the <script id="map-data"> block of index.html.

Usage (from the repository root):
    python3 class-session/build_map.py
"""
import json
import math
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
PAGE = HERE / "index.html"

ZONE_TOL, ZONE_MIN_AREA = 1.2, 6      # map units (1 unit is about 50 m)
REGION_TOL, REGION_MIN_AREA = 1.5, 10


def rings(geom):
    if geom["type"] == "Polygon":
        return [geom["coordinates"]]
    if geom["type"] == "MultiPolygon":
        return geom["coordinates"]
    return []


def area(pts):
    return abs(sum(pts[i][0] * pts[i - 1][1] - pts[i - 1][0] * pts[i][1]
                   for i in range(len(pts)))) / 2


def simplify(pts, tol):
    if len(pts) < 3:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        (ax, ay), (bx, by) = pts[a], pts[b]
        dx, dy = bx - ax, by - ay
        length = math.hypot(dx, dy)
        best, best_i = 0.0, -1
        for i in range(a + 1, b):
            px, py = pts[i]
            if length > 1e-9:
                d = abs(dy * px - dx * py + bx * ay - by * ax) / length
            else:
                d = math.hypot(px - ax, py - ay)
            if d > best:
                best, best_i = d, i
        if best > tol:
            keep[best_i] = True
            stack += [(a, best_i), (best_i, b)]
    return [p for p, k in zip(pts, keep) if k]


def main():
    nodal = json.loads((REPO / "NodalReview.json").read_text())
    regions = json.loads((REPO / "Regions.json").read_text())

    coords = [p for fc in (nodal, regions) for f in fc["features"]
              for poly in rings(f["geometry"]) for ring in poly for p in ring]
    lons = [p[0] for p in coords]
    lats = [p[1] for p in coords]
    lat0 = (min(lats) + max(lats)) / 2
    kx, ky = 111320 * math.cos(math.radians(lat0)), 110540
    minx, maxx = min(lons) * kx, max(lons) * kx
    miny, maxy = min(-l * ky for l in lats), max(-l * ky for l in lats)
    width = 1000
    scale = width / (maxx - minx)
    height = (maxy - miny) * scale

    def project(p):
        return ((p[0] * kx - minx) * scale, (-p[1] * ky - miny) * scale)

    def to_path(geom, tol, min_area):
        out = []
        for poly in rings(geom):
            for ring in poly:
                pts = [project(p) for p in ring]
                if area(pts) < min_area:
                    continue
                s = simplify(pts, tol)
                if len(s) < 4:
                    continue
                out.append("M" + "L".join(f"{x:.0f},{y:.0f}" for x, y in s[:-1]) + "Z")
        return "".join(out)

    zones = []
    for f in sorted(nodal["features"], key=lambda f: f["properties"]["N_Rev_new"]):
        p = f["properties"]
        zones.append({"code": p["N_Rev_new"], "name": p["Zone_Name"], "km2": p["Area_km2"],
                      "d": to_path(f["geometry"], ZONE_TOL, ZONE_MIN_AREA)})

    regs = []
    for f in sorted(regions["features"], key=lambda f: f["properties"]["REGION_ID"]):
        p = f["properties"]
        outer = max((poly[0] for poly in rings(f["geometry"])),
                    key=lambda r: area([project(q) for q in r]))
        pts = [project(q) for q in outer]
        a = cx = cy = 0.0
        for i in range(len(pts)):
            (x0, y0), (x1, y1) = pts[i - 1], pts[i]
            c = x0 * y1 - x1 * y0
            a += c
            cx += (x0 + x1) * c
            cy += (y0 + y1) * c
        a /= 2
        regs.append({"id": p["REGION_ID"], "km2": p["Area"],
                     "d": to_path(f["geometry"], REGION_TOL, REGION_MIN_AREA),
                     "cx": round(cx / (6 * a), 1), "cy": round(cy / (6 * a), 1)})

    data = json.dumps({"w": width, "h": round(height, 1), "zones": zones, "regions": regs},
                      separators=(",", ":"))
    page = PAGE.read_text()
    page, n = re.subn(r'(<script id="map-data" type="application/json">).*?(</script>)',
                      lambda m: m.group(1) + data + m.group(2), page, flags=re.S)
    if n != 1:
        raise SystemExit("map-data block not found in index.html")
    PAGE.write_text(page)
    print(f"Embedded {len(zones)} zones and {len(regs)} regions ({len(data) // 1024} KB)")


if __name__ == "__main__":
    main()
