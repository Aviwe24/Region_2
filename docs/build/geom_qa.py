# Approximate overflow / overlap check for a pptx using python-pptx + Pillow text metrics.
import sys
from pptx import Presentation
from pptx.util import Emu
from PIL import ImageFont
prs = Presentation(sys.argv[1])
font_cache = {}
def font(sz, bold):
    k=(sz,bold)
    if k not in font_cache:
        path="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
        font_cache[k]=ImageFont.truetype(path, int(sz*96/72))
    return font_cache[k]
SCALE=0.92  # DejaVu is wider than Calibri; scale widths down
def wrap_lines(text, f, max_px):
    words=text.split(); lines=[]; cur=""
    for w in words:
        t=(cur+" "+w).strip()
        if f.getlength(t)*SCALE<=max_px or not cur: cur=t
        else: lines.append(cur); cur=w
    if cur: lines.append(cur)
    return lines
issues=[]
for si,slide in enumerate(prs.slides,1):
    for sh in slide.shapes:
        if not sh.has_text_frame: continue
        tf=sh.text_frame
        if not tf.text.strip(): continue
        w_px=(sh.width/914400)*96 - 10; h_px=(sh.height/914400)*96
        total=0; lines_all=[]
        for p in tf.paragraphs:
            runs=p.runs
            if not runs: total+=14; continue
            sz=None; bold=False
            for r in runs:
                if r.font.size: sz=r.font.size.pt
                if r.font.bold: bold=True
            if sz is None: sz=18
            txt="".join(r.text for r in runs)
            ls=wrap_lines(txt,font(sz,bold),w_px)
            lines_all.extend(ls)
            total+=len(ls)*sz*1.2*96/72 + (p.space_after.pt*96/72 if p.space_after else 0)
        if total>h_px*1.02:
            issues.append((si, sh.name, round(total/96,2), round(h_px/96,2), tf.text[:60].replace("\n"," | ")))
for i in issues: print("OVERFLOW slide %d %s need %.2fin have %.2fin :: %s"%i)
print("checked", len(prs.slides), "slides;", len(issues), "possible overflows")
