"""Generate deterministic, explicitly fictional demo evidence assets."""
from pathlib import Path
import qrcode
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "demo"
OUT.mkdir(parents=True, exist_ok=True)


def build_fir():
    regular = "/Library/Fonts/Arial Unicode.ttf"
    bold = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
    pdfmetrics.registerFont(TTFont("DemoSans", regular))
    pdfmetrics.registerFont(TTFont("DemoSansBold", bold))
    path = OUT / "nightfall-fir.pdf"
    doc = SimpleDocTemplate(str(path), pagesize=A4, leftMargin=20*mm, rightMargin=20*mm, topMargin=18*mm, bottomMargin=18*mm)
    styles = getSampleStyleSheet()
    for style in styles.byName.values():
        style.fontName = "DemoSansBold" if "Heading" in style.name or style.name == "Title" else "DemoSans"
    story = [
        Paragraph("FICTIONAL DEMO EVIDENCE - NOT AN OFFICIAL RECORD", styles["Heading2"]),
        Paragraph("Decypher by Epoch / Operation Nightfall", styles["Title"]),
        Spacer(1, 8),
        Table([
            ["Case ID", "CASE-2026-017"],
            ["Case number", "DL-NCR/2026/017"],
            ["Lead investigator", "Investigator Aditi Rao"],
            ["Recorded", "10 September 2026, 20:15 IST"],
            ["Classification", "Synthetic hackathon demonstration"],
        ], colWidths=[45*mm, 110*mm], style=TableStyle([
            ("GRID", (0,0), (-1,-1), .5, colors.HexColor("#b3bdc9")),
            ("BACKGROUND", (0,0), (0,-1), colors.HexColor("#eef2f7")),
            ("FONTNAME", (0,0), (0,-1), "DemoSansBold"),
            ("FONTNAME", (1,0), (1,-1), "DemoSans"),
            ("VALIGN", (0,0), (-1,-1), "TOP"),
            ("PADDING", (0,0), (-1,-1), 7),
        ])),
        Spacer(1, 12),
        Paragraph("Initial report", styles["Heading2"]),
        Paragraph(
            "At 20:42, a call-detail record placed a fictional communication between Raj Mehta and Arjun Verma near Connaught Place. "
            "At 21:15, synthetic CCTV material showed a white compact sedan associated with identifier DL01AB1234 entering a Gurugram parking structure. "
            "At 22:04, a fictional financial export recorded a transfer to an account ending 4821. No statement in this document establishes guilt.",
            styles["BodyText"],
        ),
        Spacer(1, 10),
        Paragraph("Evidence expected", styles["Heading2"]),
        Paragraph("CDR export, transaction export, CCTV still and clip, dispatch audio, and field investigation note. Every analytical claim must cite one or more evidence IDs.", styles["BodyText"]),
        Spacer(1, 16),
        Paragraph("Human review notice", styles["Heading2"]),
        Paragraph("This material is entirely fictional and exists only to demonstrate evidence provenance, cryptographic integrity, graph analysis, and investigator-controlled verification.", styles["BodyText"]),
    ]
    doc.build(story)
    return path


if __name__ == "__main__":
    print(build_fir())
    for index in range(1, 8):
        token = f"nightfall-ev-2026-{index:04d}"
        qrcode.make(f"http://localhost:8443/verify/{token}").save(OUT / f"{token}-qr.png")
