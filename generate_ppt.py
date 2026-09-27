"""
NEXUS TWIN — Hackathon Submission PowerPoint Generator
Team: Code Amigos
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
import pptx.oxml.ns as nsmap
from lxml import etree
import copy

# ── Palette ───────────────────────────────────────────────────────────────────
BG          = RGBColor(0x0F, 0x17, 0x2A)   # slate-950
CARD        = RGBColor(0x1E, 0x29, 0x3B)   # slate-800
CARD2       = RGBColor(0x0F, 0x24, 0x38)   # deeper card
BORDER      = RGBColor(0x33, 0x41, 0x55)   # slate-700
CYAN        = RGBColor(0x06, 0xB6, 0xD4)   # cyan-500
CYAN_DIM    = RGBColor(0x08, 0x52, 0x63)   # cyan-950
EMERALD     = RGBColor(0x10, 0xB9, 0x81)   # emerald-500
AMBER       = RGBColor(0xF5, 0x9E, 0x0B)   # amber-500
ROSE        = RGBColor(0xF4, 0x3F, 0x5E)   # rose-500
SKY         = RGBColor(0x38, 0xBD, 0xF8)   # sky-400
VIOLET      = RGBColor(0xA7, 0x8B, 0xFA)   # violet-400
TEXT_WHITE  = RGBColor(0xF8, 0xFA, 0xFC)   # slate-50
TEXT_GRAY   = RGBColor(0x94, 0xA3, 0xB8)   # slate-400
TEXT_LIGHT  = RGBColor(0xCB, 0xD5, 0xE1)   # slate-300

W = Inches(13.33)
H = Inches(7.5)

# ── Helpers ───────────────────────────────────────────────────────────────────

def new_prs():
    prs = Presentation()
    prs.slide_width  = W
    prs.slide_height = H
    return prs

def blank_slide(prs):
    layout = prs.slide_layouts[6]   # completely blank
    slide = prs.slides.add_slide(layout)
    return slide

def fill_bg(slide, color: RGBColor):
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color

def add_rect(slide, x, y, w, h, fill_color, border_color=None, border_pt=0):
    shape = slide.shapes.add_shape(
        1,  # MSO_SHAPE_TYPE.RECTANGLE
        Inches(x), Inches(y), Inches(w), Inches(h)
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    if border_color and border_pt:
        shape.line.color.rgb = border_color
        shape.line.width = Pt(border_pt)
    else:
        shape.line.fill.background()
    return shape

def add_text(slide, text, x, y, w, h,
             font_size=18, bold=False, italic=False,
             color=TEXT_WHITE, align=PP_ALIGN.LEFT,
             wrap=True, font_name="Segoe UI"):
    txBox = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = txBox.text_frame
    tf.word_wrap = wrap
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(font_size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    run.font.name = font_name
    return txBox

def add_multiline(slide, lines, x, y, w, h,
                  font_size=14, bold=False, color=TEXT_WHITE,
                  align=PP_ALIGN.LEFT, line_spacing=1.1, font_name="Segoe UI"):
    """Add a textbox with multiple paragraphs."""
    txBox = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = txBox.text_frame
    tf.word_wrap = True
    for i, (txt, sz, bld, col) in enumerate(lines):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.alignment = align
        run = p.add_run()
        run.text = txt
        run.font.size = Pt(sz)
        run.font.bold = bld
        run.font.color.rgb = col
        run.font.name = font_name
    return txBox

def add_grad_rect(slide, x, y, w, h, color1: RGBColor, color2: RGBColor):
    """Simulate gradient with two overlapping rects at different opacity."""
    add_rect(slide, x, y, w, h, color1)
    shape = slide.shapes.add_shape(1, Inches(x), Inches(y), Inches(w), Inches(h))
    shape.fill.solid()
    shape.fill.fore_color.rgb = color2
    shape.line.fill.background()
    # Set transparency ~60%
    sp = shape._element
    solidFill = sp.find('.//' + nsmap.qn('a:solidFill'))
    if solidFill is not None:
        srgb = solidFill.find(nsmap.qn('a:srgbClr'))
        if srgb is not None:
            alpha = etree.SubElement(srgb, nsmap.qn('a:alpha'))
            alpha.set('val', '60000')  # 60% = 40% opacity

def dot_bullet(slide, items, x, y, w, dot_color=CYAN, font_size=13, gap=0.32):
    """Render a bullet list with colored dot markers."""
    for i, (item, col) in enumerate(items):
        yi = y + i * gap
        # dot
        dot = slide.shapes.add_shape(9, Inches(x), Inches(yi + 0.07), Inches(0.12), Inches(0.12))
        dot.fill.solid()
        dot.fill.fore_color.rgb = dot_color if col is None else col
        dot.line.fill.background()
        # text
        add_text(slide, item, x + 0.2, yi, w - 0.2, gap + 0.05,
                 font_size=font_size, color=TEXT_LIGHT, wrap=True)

def pill(slide, text, x, y, w=1.6, h=0.3, bg=CYAN_DIM, fg=CYAN, font_size=10):
    r = add_rect(slide, x, y, w, h, bg, CYAN, 0.8)
    add_text(slide, text, x, y + 0.02, w, h - 0.04,
             font_size=font_size, bold=True, color=fg, align=PP_ALIGN.CENTER)

def stat_card(slide, value, label, unit, x, y, w=2.0, h=1.0,
              val_color=CYAN, border=CYAN):
    add_rect(slide, x, y, w, h, CARD, border, 0.8)
    # value
    add_text(slide, value, x + 0.1, y + 0.08, w - 0.2, 0.45,
             font_size=28, bold=True, color=val_color, align=PP_ALIGN.CENTER)
    # unit
    if unit:
        add_text(slide, unit, x + 0.1, y + 0.5, w - 0.2, 0.22,
                 font_size=9, color=TEXT_GRAY, align=PP_ALIGN.CENTER)
    # label
    add_text(slide, label, x + 0.1, y + 0.72, w - 0.2, 0.22,
             font_size=10, bold=True, color=TEXT_GRAY, align=PP_ALIGN.CENTER)

def section_label(slide, text, x, y, accent=CYAN):
    add_rect(slide, x, y, 0.05, 0.22, accent)
    add_text(slide, text, x + 0.12, y, 3, 0.25,
             font_size=10, bold=True, color=accent)

def horiz_bar(slide, x, y, w_total, pct, color, bg_color=CARD, h=0.12):
    add_rect(slide, x, y, w_total, h, bg_color)
    if pct > 0:
        add_rect(slide, x, y, w_total * (pct / 100), h, color)

# ══════════════════════════════════════════════════════════════════════════════
#  SLIDE 1 — TITLE / TEAM
# ══════════════════════════════════════════════════════════════════════════════
def slide1(prs):
    slide = blank_slide(prs)
    fill_bg(slide, BG)

    # ── Decorative top cyan stripe ────────────────────────────────────────────
    add_rect(slide, 0, 0, 13.33, 0.06, CYAN)

    # ── Left hero panel (65%) ─────────────────────────────────────────────────
    add_rect(slide, 0, 0.06, 8.6, 7.44, RGBColor(0x07, 0x10, 0x1E))

    # Subtle grid lines
    for i in range(1, 15):
        add_rect(slide, 0, 0.06 + i * 0.53, 8.6, 0.005, RGBColor(0x1E, 0x29, 0x3B))
    for i in range(1, 18):
        add_rect(slide, i * 0.5, 0.06, 0.005, 7.44, RGBColor(0x1E, 0x29, 0x3B))

    # Glowing orb behind logo (simulate with semi-transparent large rect)
    add_rect(slide, 0.5, 1.0, 2.5, 2.5, RGBColor(0x04, 0x3A, 0x4A))

    # Big N logo box
    add_rect(slide, 0.6, 1.15, 1.5, 1.5, RGBColor(0x06, 0x34, 0x45), CYAN, 1.5)
    add_text(slide, "N", 0.6, 1.15, 1.5, 1.5,
             font_size=56, bold=True, color=CYAN, align=PP_ALIGN.CENTER)

    # NEXUS TWIN
    add_text(slide, "NEXUS TWIN", 2.4, 1.22, 6.0, 0.85,
             font_size=52, bold=True, color=TEXT_WHITE)

    # Glowing cyan accent line under title
    add_rect(slide, 2.4, 2.12, 5.5, 0.05, CYAN)

    # Tagline
    add_text(slide, "AI-Powered Digital Twin for Climate-Resilient Sustainable Cities",
             2.4, 2.25, 5.9, 0.5,
             font_size=14, italic=True, color=SKY)

    # Description paragraph
    add_text(slide,
             "Test environmental decisions in a virtual city before implementing them "
             "in the real world. NEXUS TWIN fuses real-time sensor telemetry, machine "
             "learning anomaly detection, predictive forecasting, and what-if scenario "
             "modelling to evaluate clean energy, water, mobility, and flood resilience.",
             0.5, 2.95, 7.9, 1.1,
             font_size=12, color=TEXT_GRAY, wrap=True)

    # ── Tech pills ───────────────────────────────────────────────────────────
    pills_data = [
        ("React + Three.js", 0.5,  4.25, CYAN_DIM,    CYAN),
        ("FastAPI",          2.35, 4.25, RGBColor(0x06,0x22,0x11), EMERALD),
        ("Isolation Forest", 4.1,  4.25, RGBColor(0x2D,0x1F,0x06), AMBER),
        ("Random Forest RF", 6.0,  4.25, RGBColor(0x2D,0x06,0x18), ROSE),
        ("Python 3.13",      0.5,  4.65, RGBColor(0x06,0x22,0x11), EMERALD),
        ("scikit-learn",     2.35, 4.65, RGBColor(0x06,0x22,0x2D), SKY),
        ("Tailwind CSS",     4.1,  4.65, CYAN_DIM, CYAN),
        ("SQLite ORM",       6.0,  4.65, RGBColor(0x1E,0x1A,0x06), AMBER),
    ]
    for txt, px, py, bg, fg in pills_data:
        pill(slide, txt, px, py, w=1.7, h=0.28, bg=bg, fg=fg, font_size=9)

    # Tagline footer
    add_rect(slide, 0, 6.8, 8.6, 0.7, RGBColor(0x04, 0x0D, 0x18))
    add_text(slide, '"Simulate today.  Sustain tomorrow."',
             0.3, 6.88, 8.0, 0.5,
             font_size=14, italic=True, bold=True, color=CYAN, align=PP_ALIGN.CENTER)

    # ── Right team panel (35%) ────────────────────────────────────────────────
    add_rect(slide, 8.6, 0.06, 4.73, 7.44, CARD)

    # Header strip
    add_rect(slide, 8.6, 0.06, 4.73, 0.7, RGBColor(0x04, 0x34, 0x45))
    add_text(slide, "TEAM", 8.7, 0.12, 4.5, 0.3,
             font_size=9, bold=True, color=TEXT_GRAY, align=PP_ALIGN.CENTER)
    add_text(slide, "Code Amigos", 8.6, 0.3, 4.73, 0.4,
             font_size=22, bold=True, color=CYAN, align=PP_ALIGN.CENTER)

    # Divider
    add_rect(slide, 8.7, 0.8, 4.5, 0.04, CYAN)

    # Hackathon badge
    add_rect(slide, 9.3, 0.95, 3.3, 0.38, RGBColor(0x08, 0x30, 0x3A), CYAN, 0.5)
    add_text(slide, "🏆  HACKATHON SUBMISSION 2025",
             9.3, 0.97, 3.3, 0.32,
             font_size=9, bold=True, color=CYAN, align=PP_ALIGN.CENTER)

    # Team members
    members = [
        ("Sidharthan S",           "Full-Stack Engineer",       CYAN),
        ("Sidharth D",             "AI / ML Engineer",          EMERALD),
        ("Tharsan Kanthaswamy",    "3D & Data Visualisation",   AMBER),
    ]
    for idx, (name, role, col) in enumerate(members):
        y_base = 1.55 + idx * 1.55
        # Card
        add_rect(slide, 8.75, y_base, 4.4, 1.3, RGBColor(0x0B, 0x17, 0x27), col, 0.8)
        # Avatar circle (simulated with small rect)
        add_rect(slide, 8.9, y_base + 0.12, 0.7, 0.7,
                 RGBColor(0x0D, 0x3A, 0x4D) if col == CYAN else
                 RGBColor(0x08, 0x2A, 0x1A) if col == EMERALD else
                 RGBColor(0x30, 0x1F, 0x06),
                 col, 0.6)
        # Initials
        initials = "".join(w[0] for w in name.split())
        add_text(slide, initials, 8.9, y_base + 0.17, 0.7, 0.6,
                 font_size=18, bold=True, color=col, align=PP_ALIGN.CENTER)
        # Name
        add_text(slide, name, 9.7, y_base + 0.12, 3.3, 0.38,
                 font_size=14, bold=True, color=TEXT_WHITE)
        # Role pill
        pill(slide, role, 9.7, y_base + 0.55, w=2.2, h=0.27,
             bg=RGBColor(0x06, 0x22, 0x2D), fg=col, font_size=9)
        # Divider
        add_rect(slide, 8.75, y_base + 1.26, 4.4, 0.04, col)

    # Built with
    add_text(slide, "BUILT WITH", 8.7, 6.25, 4.5, 0.22,
             font_size=8, bold=True, color=TEXT_GRAY, align=PP_ALIGN.CENTER)
    stack_pills = [("React", CYAN), ("FastAPI", EMERALD), ("Three.js", AMBER), ("sklearn", ROSE)]
    for i, (s, c) in enumerate(stack_pills):
        pill(slide, s, 8.7 + i * 1.15, 6.48, w=1.05, h=0.25, bg=CARD2, fg=c, font_size=9)

    # Bottom accent
    add_rect(slide, 8.6, 7.38, 4.73, 0.12, CYAN)

# ══════════════════════════════════════════════════════════════════════════════
#  SLIDE 2 — PROBLEM STATEMENT
# ══════════════════════════════════════════════════════════════════════════════
def slide2(prs):
    slide = blank_slide(prs)
    fill_bg(slide, BG)
    add_rect(slide, 0, 0, 13.33, 0.06, ROSE)

    # Title band
    add_rect(slide, 0, 0.06, 13.33, 1.0, RGBColor(0x0B, 0x0D, 0x14))
    add_rect(slide, 0, 0.06, 0.06, 1.0, ROSE)
    add_text(slide, "02", 0.15, 0.08, 0.6, 0.3,
             font_size=10, bold=True, color=RGBColor(0x44, 0x55, 0x66))
    add_text(slide, "PROBLEM STATEMENT", 0.1, 0.36, 6, 0.4,
             font_size=28, bold=True, color=TEXT_WHITE)
    add_text(slide, "Why cities urgently need a Digital Twin decision engine",
             0.1, 0.72, 8, 0.28,
             font_size=12, italic=True, color=TEXT_GRAY)

    # ── Hero stat ─────────────────────────────────────────────────────────────
    add_rect(slide, 9.8, 0.18, 3.3, 0.7, RGBColor(0x30, 0x06, 0x14), ROSE, 0.8)
    add_text(slide, "70%+", 9.8, 0.18, 3.3, 0.45,
             font_size=30, bold=True, color=ROSE, align=PP_ALIGN.CENTER)
    add_text(slide, "of global greenhouse emissions from cities",
             9.8, 0.58, 3.3, 0.24,
             font_size=9, color=TEXT_GRAY, align=PP_ALIGN.CENTER)

    # ── 3-col problem breakdown ───────────────────────────────────────────────
    problems = [
        (ROSE,    "⚡",  "Energy Crisis",
         "Buildings & transport consume ~70% of urban electricity. Undetected HVAC spikes "
         "and solar under-utilisation cost cities millions in grid overdependence annually.",
         ["No real-time load prediction", "Grid over-dependence", "Hidden peak-demand spikes"]),
        (SKY,     "💧",  "Water Wastage",
         "Subsurface pipe fractures lose 20-30% of daily supply undetected. Manual "
         "inspection crews take 24-72 hours to respond, wasting ~15,600 L per incident.",
         ["Pipe leaks undetected for days", "Pressure drop not monitored", "Manual, reactive response"]),
        (AMBER,   "🌧️", "Climate Shocks",
         "Extreme storms overwhelm drainage. Without green-infrastructure simulation, "
         "flood risk scores reach Critical (82/100) and damage costs spiral out of control.",
         ["No pre-storm resilience planning", "Flood zones unmapped", "No green-cover ROI model"]),
    ]

    for i, (col, icon, title, desc, bullets) in enumerate(problems):
        x = 0.2 + i * 4.36
        add_rect(slide, x, 1.22, 4.15, 5.7, CARD, col, 0.8)
        # icon circle
        add_rect(slide, x + 0.15, 1.35, 0.65, 0.65,
                 RGBColor(0x1A, 0x00, 0x0A) if col == ROSE else
                 RGBColor(0x00, 0x15, 0x25) if col == SKY else
                 RGBColor(0x20, 0x15, 0x00), col, 0.6)
        add_text(slide, icon, x + 0.15, 1.37, 0.65, 0.65,
                 font_size=22, align=PP_ALIGN.CENTER)
        add_text(slide, title, x + 0.9, 1.42, 3.1, 0.45,
                 font_size=15, bold=True, color=col)
        # Horizontal divider
        add_rect(slide, x + 0.15, 2.12, 3.8, 0.04, col)
        add_text(slide, desc, x + 0.15, 2.22, 3.8, 1.3,
                 font_size=10, color=TEXT_GRAY, wrap=True)
        # Bullets
        for j, b in enumerate(bullets):
            dot = slide.shapes.add_shape(9,
                Inches(x + 0.2), Inches(3.65 + j * 0.38),
                Inches(0.1), Inches(0.1))
            dot.fill.solid(); dot.fill.fore_color.rgb = col
            dot.line.fill.background()
            add_text(slide, b, x + 0.38, 3.6 + j * 0.38, 3.6, 0.35,
                     font_size=10, color=TEXT_LIGHT)

    # ── Root cause box ────────────────────────────────────────────────────────
    add_rect(slide, 0.2, 5.9, 12.9, 1.42, RGBColor(0x0F, 0x0A, 0x00), AMBER, 0.8)
    add_rect(slide, 0.2, 5.9, 0.06, 1.42, AMBER)
    add_text(slide, "Root Cause: No Decision Support Tool",
             0.45, 5.95, 6, 0.35,
             font_size=13, bold=True, color=AMBER)
    add_text(slide,
             "Municipal planners have zero validated framework to simulate 'what if we install 50 kW solar + increase green cover 15%?' "
             "before committing ₹5 Cr in capital expenditure. Every intervention is a multi-million-rupee gamble with no simulation safety net.",
             0.45, 6.32, 12.5, 0.75,
             font_size=11, color=TEXT_GRAY, wrap=True)

    add_rect(slide, 0, 7.38, 13.33, 0.12, ROSE)

# ══════════════════════════════════════════════════════════════════════════════
#  SLIDE 3 — SOLUTION & ARCHITECTURE
# ══════════════════════════════════════════════════════════════════════════════
def slide3(prs):
    slide = blank_slide(prs)
    fill_bg(slide, BG)
    add_rect(slide, 0, 0, 13.33, 0.06, CYAN)

    # Title band
    add_rect(slide, 0, 0.06, 13.33, 0.95, RGBColor(0x04, 0x10, 0x1A))
    add_rect(slide, 0, 0.06, 0.06, 0.95, CYAN)
    add_text(slide, "03", 0.15, 0.08, 0.6, 0.3,
             font_size=10, bold=True, color=RGBColor(0x44, 0x55, 0x66))
    add_text(slide, "SOLUTION & ARCHITECTURE", 0.1, 0.3, 7, 0.4,
             font_size=28, bold=True, color=TEXT_WHITE)
    add_text(slide, "How NEXUS TWIN transforms raw data into verified sustainability decisions",
             0.1, 0.67, 9, 0.28,
             font_size=12, italic=True, color=TEXT_GRAY)

    # ── Pipeline flow (top section) ───────────────────────────────────────────
    add_rect(slide, 0.2, 1.15, 12.9, 1.62, CARD)
    add_text(slide, "DATA PIPELINE ARCHITECTURE",
             0.35, 1.18, 4, 0.25, font_size=8, bold=True, color=TEXT_GRAY)

    pipeline = [
        (CYAN,    "Python\nSensor Engine",  "Diurnal sine/cosine\nbaseline curves\n+6 event triggers"),
        (EMERALD, "Isolation Forest\nAnomaly ML",  "1,200 normal\ntraining samples\nPrecision: 96%"),
        (SKY,     "Random Forest\nForecast Engine","3-hour demand\nprediction\nMAE ±4.2 kW"),
        (AMBER,   "What-If\nSimulation Lab",  "6-parameter\nscenario engine\nFormula-transparent"),
        (ROSE,    "Impact &\nDashboard",      "CO₂ / Water /\nFlood / Traffic\nReal-time KPIs"),
    ]
    for i, (col, title, sub) in enumerate(pipeline):
        x = 0.3 + i * 2.55
        add_rect(slide, x, 1.5, 2.3, 1.18, RGBColor(0x0B, 0x17, 0x27), col, 0.8)
        add_text(slide, title, x + 0.08, 1.55, 2.14, 0.42,
                 font_size=11, bold=True, color=col)
        add_text(slide, sub, x + 0.08, 1.97, 2.14, 0.62,
                 font_size=8.5, color=TEXT_GRAY, wrap=True)
        # Arrow
        if i < 4:
            add_rect(slide, x + 2.32, 1.97, 0.18, 0.04, BORDER)
            # arrowhead triangle
            arr = slide.shapes.add_shape(5,  # right arrow
                Inches(x + 2.32), Inches(1.9), Inches(0.22), Inches(0.22))
            arr.fill.solid(); arr.fill.fore_color.rgb = col
            arr.line.fill.background()

    # ── Tech stack 2-col below ────────────────────────────────────────────────
    # Left: Frontend
    add_rect(slide, 0.2, 2.9, 6.1, 4.45, CARD, CYAN, 0.5)
    add_rect(slide, 0.2, 2.9, 6.1, 0.4, RGBColor(0x04, 0x28, 0x38))
    add_text(slide, "⚛  FRONTEND STACK", 0.35, 2.92, 5.8, 0.34,
             font_size=11, bold=True, color=CYAN)

    fe_items = [
        ("React 18 + TypeScript", "Component-driven SPA — strict typed props across all 8 pages"),
        ("Vite 5 + Tailwind CSS", "Sub-second HMR dev server · Dark design system · Custom glow utilities"),
        ("Three.js / @react-three/fiber", "3D low-poly city with 5 clickable buildings, roads, water tank, solar park"),
        ("@react-three/drei", "Sky, OrbitControls, Html overlays — all interactive in real-time"),
        ("Recharts", "8 live charts: Energy, Water, Traffic, Waste Bins, Building Comparison"),
        ("Lucide React", "450+ icon library — consistent iconography throughout the UI"),
    ]
    for i, (title, desc) in enumerate(fe_items):
        add_rect(slide, 0.25, 3.4 + i * 0.59, 0.06, 0.42, CYAN)
        add_text(slide, title, 0.4, 3.4 + i * 0.59, 5.6, 0.22,
                 font_size=10, bold=True, color=TEXT_WHITE)
        add_text(slide, desc, 0.4, 3.6 + i * 0.59, 5.6, 0.25,
                 font_size=9, color=TEXT_GRAY, wrap=True)

    # Right: Backend
    add_rect(slide, 6.5, 2.9, 6.6, 4.45, CARD, EMERALD, 0.5)
    add_rect(slide, 6.5, 2.9, 6.6, 0.4, RGBColor(0x04, 0x22, 0x14))
    add_text(slide, "🐍  BACKEND STACK", 6.65, 2.92, 6.3, 0.34,
             font_size=11, bold=True, color=EMERALD)

    be_items = [
        ("FastAPI + Uvicorn",       "16 REST endpoints · Auto-reload · Pydantic v2 schema validation · OpenAPI docs"),
        ("scikit-learn",            "IsolationForest anomaly detector + RandomForestRegressor 3-hour forecast"),
        ("NumPy + Pandas",          "Diurnal curve synthesis · 1,200-sample training data generation"),
        ("Python deque (History)",  "24-slot circular buffer persists sensor history across all client navigations"),
        ("SQLAlchemy + SQLite",     "ORM-ready session store — extensible to persistent time-series storage"),
        ("Docker + Nginx",          "Multi-stage Dockerfile · Nginx reverse proxy · docker-compose for 1-command deploy"),
    ]
    for i, (title, desc) in enumerate(be_items):
        add_rect(slide, 6.55, 3.4 + i * 0.59, 0.06, 0.42, EMERALD)
        add_text(slide, title, 6.7, 3.4 + i * 0.59, 6.1, 0.22,
                 font_size=10, bold=True, color=TEXT_WHITE)
        add_text(slide, desc, 6.7, 3.6 + i * 0.59, 6.1, 0.25,
                 font_size=9, color=TEXT_GRAY, wrap=True)

    add_rect(slide, 0, 7.38, 13.33, 0.12, CYAN)

# ══════════════════════════════════════════════════════════════════════════════
#  SLIDE 4 — KEY FEATURES
# ══════════════════════════════════════════════════════════════════════════════
def slide4(prs):
    slide = blank_slide(prs)
    fill_bg(slide, BG)
    add_rect(slide, 0, 0, 13.33, 0.06, EMERALD)

    add_rect(slide, 0, 0.06, 13.33, 0.95, RGBColor(0x04, 0x12, 0x0C))
    add_rect(slide, 0, 0.06, 0.06, 0.95, EMERALD)
    add_text(slide, "04", 0.15, 0.08, 0.6, 0.3,
             font_size=10, bold=True, color=RGBColor(0x44, 0x55, 0x66))
    add_text(slide, "KEY FEATURES & CAPABILITIES", 0.1, 0.3, 7, 0.4,
             font_size=28, bold=True, color=TEXT_WHITE)
    add_text(slide, "Six interconnected modules — each one demo-ready and independently impressive",
             0.1, 0.68, 9, 0.28, font_size=12, italic=True, color=TEXT_GRAY)

    # ── Feature cards (3x2 grid) ──────────────────────────────────────────────
    features = [
        (CYAN, "🌐", "3D Digital Twin",
         "Interactive low-poly urban model. Click any building, water tank, solar array, "
         "pipeline or waste bin to inspect live telemetry in a floating panel.",
         ["5 buildings with live metrics", "Animated vehicles on roads", "Clickable flood overlay"],
         ["React Three Fiber", "Three.js"]),

        (ROSE, "🔬", "AI Anomaly Detection",
         "scikit-learn IsolationForest trained on 1,200 normal operational samples. Detects "
         "water leaks, HVAC spikes, congestion, and waste overflow with confidence scores.",
         ["Precision 96% · Recall 94%", "F1-Score = 0.95", "Toast alerts on detection"],
         ["IsolationForest", "NumPy"]),

        (SKY, "📈", "Predictive Forecasting",
         "Three Random Forest Regressors (energy, water, traffic) use sin/cos diurnal hour "
         "features to forecast 3 hours ahead — adjusting in real-time for active events.",
         ["Energy MAE ±4.2 kW", "Water MAE ±28.5 L/hr", "4 domain forecasts"]),

        (AMBER, "🧪", "Simulation Lab",
         "Six interactive sliders control Solar PV, Public Transit %, Green Canopy, Water "
         "Efficiency, Storm Rainfall, and Drainage — triggering formula-transparent What-If "
         "calculations with side-by-side Baseline vs Simulated output.",
         ["Instant recalculation", "6 independent parameters", "Flood risk formula exposed"],
         ["What-If Engine", "Pydantic"]),

        (EMERALD, "💡", "AI Recommendation Engine",
         "Scans live anomalies + predictions to generate prioritised intervention plans. "
         "Covers Water, Energy, Mobility, and Waste domains with actionable impact estimates.",
         ["Anomaly-triggered recs", "Prediction-driven alerts", "City Resilience Score 0-100"],
         ["Optimiser Engine"]),

        (VIOLET, "📊", "Sustainability Impact",
         "Calculates 5 key impact dimensions: CO₂ avoided, water conserved, grid energy saved, "
         "traffic reduction %, and flood risk score delta — all with transparent formula breakdowns.",
         ["−51% CO₂ with 100 kW solar", "−31.5 pt flood risk", "5 impact KPI cards"],
         ["Simulation Engine"]),
    ]

    cols = [0.2, 4.47, 8.73]
    rows = [1.18, 4.32]

    for idx, feat in enumerate(features):
        row, col_i = divmod(idx, 3)
        x, y = cols[col_i], rows[row]
        col = feat[0]

        add_rect(slide, x, y, 4.07, 2.9, CARD, col, 0.7)
        add_rect(slide, x, y, 4.07, 0.48, RGBColor(0x0A, 0x12, 0x1E))

        # icon + title
        add_text(slide, feat[1], x + 0.1, y + 0.05, 0.38, 0.38,
                 font_size=18, align=PP_ALIGN.CENTER)
        add_text(slide, feat[2], x + 0.52, y + 0.1, 3.4, 0.32,
                 font_size=12, bold=True, color=col)

        add_rect(slide, x + 0.15, y + 0.5, 3.75, 0.03, BORDER)

        add_text(slide, feat[3], x + 0.15, y + 0.58, 3.7, 0.9,
                 font_size=9, color=TEXT_GRAY, wrap=True)

        for bi, bullet in enumerate(feat[4]):
            bx = x + 0.25
            by = y + 1.55 + bi * 0.35
            dot_s = slide.shapes.add_shape(9, Inches(bx - 0.1), Inches(by + 0.08),
                                           Inches(0.09), Inches(0.09))
            dot_s.fill.solid(); dot_s.fill.fore_color.rgb = col
            dot_s.line.fill.background()
            add_text(slide, bullet, bx + 0.02, by, 3.6, 0.32,
                     font_size=9.5, color=TEXT_LIGHT)

    add_rect(slide, 0, 7.38, 13.33, 0.12, EMERALD)

# ══════════════════════════════════════════════════════════════════════════════
#  SLIDE 5 — AI & ML ENGINE
# ══════════════════════════════════════════════════════════════════════════════
def slide5(prs):
    slide = blank_slide(prs)
    fill_bg(slide, BG)
    add_rect(slide, 0, 0, 13.33, 0.06, AMBER)

    add_rect(slide, 0, 0.06, 13.33, 0.95, RGBColor(0x12, 0x0B, 0x01))
    add_rect(slide, 0, 0.06, 0.06, 0.95, AMBER)
    add_text(slide, "05", 0.15, 0.08, 0.6, 0.3,
             font_size=10, bold=True, color=RGBColor(0x44, 0x55, 0x66))
    add_text(slide, "AI & MACHINE LEARNING ENGINE", 0.1, 0.3, 7, 0.4,
             font_size=28, bold=True, color=TEXT_WHITE)
    add_text(slide, "Real trained ML models — not mock data, not hard-coded thresholds",
             0.1, 0.68, 9, 0.28, font_size=12, italic=True, color=TEXT_GRAY)

    # ── Left: Anomaly model ───────────────────────────────────────────────────
    add_rect(slide, 0.2, 1.15, 6.1, 6.25, CARD, ROSE, 0.8)
    add_rect(slide, 0.2, 1.15, 6.1, 0.42, RGBColor(0x1A, 0x05, 0x0F))
    add_text(slide, "🔬  MODEL 1: ENVIRONMENTAL ANOMALY DETECTOR",
             0.35, 1.18, 5.8, 0.36, font_size=10, bold=True, color=ROSE)

    add_text(slide, "Isolation Forest (scikit-learn)", 0.35, 1.65, 5.6, 0.3,
             font_size=14, bold=True, color=TEXT_WHITE)
    add_text(slide, "contamination=0.04 · random_state=42", 0.35, 1.92, 5.6, 0.26,
             font_size=10, color=TEXT_GRAY)

    add_rect(slide, 0.3, 2.25, 5.8, 0.03, BORDER)

    # Training data
    add_text(slide, "Training Data", 0.35, 2.35, 2, 0.28, font_size=10, bold=True, color=ROSE)
    add_text(slide, "1,200 synthetic normal operational samples\ngenerated from realistic diurnal baseline curves",
             0.35, 2.6, 5.7, 0.5, font_size=9.5, color=TEXT_GRAY, wrap=True)

    # Features
    add_text(slide, "Input Features (5-D vector)", 0.35, 3.18, 4, 0.28,
             font_size=10, bold=True, color=ROSE)
    features_ml = ["water_flow_lhr", "water_pressure_psi", "energy_demand_kw",
                   "traffic_volume", "waste_fill_max_pct"]
    for i, f in enumerate(features_ml):
        pill(slide, f, 0.35 + (i % 3) * 1.95, 3.5 + (i // 3) * 0.38,
             w=1.85, h=0.3, bg=RGBColor(0x20, 0x06, 0x10), fg=ROSE, font_size=8.5)

    add_rect(slide, 0.3, 4.35, 5.8, 0.03, BORDER)

    # Eval metrics
    add_text(slide, "Evaluation Metrics", 0.35, 4.45, 3, 0.28,
             font_size=10, bold=True, color=ROSE)
    metrics = [("Precision", "96%", ROSE), ("Recall", "94%", ROSE),
               ("F1-Score", "0.95", AMBER), ("Contamination", "4%", TEXT_GRAY)]
    for i, (lab, val, col) in enumerate(metrics):
        x_ = 0.35 + i * 1.46
        add_rect(slide, x_, 4.78, 1.36, 0.78, RGBColor(0x1A, 0x05, 0x0F), col, 0.6)
        add_text(slide, val, x_, 4.82, 1.36, 0.38,
                 font_size=22, bold=True, color=col, align=PP_ALIGN.CENTER)
        add_text(slide, lab, x_, 5.17, 1.36, 0.28,
                 font_size=9, color=TEXT_GRAY, align=PP_ALIGN.CENTER)

    add_rect(slide, 0.3, 5.7, 5.8, 0.03, BORDER)
    add_text(slide, "Detected Events", 0.35, 5.78, 3, 0.28,
             font_size=10, bold=True, color=ROSE)
    events_ = ["Water Leak / Pressure Drop", "Unscheduled Energy Spike",
               "Severe Traffic Bottleneck", "Waste Bin Overflow Risk"]
    for i, ev in enumerate(events_):
        add_text(slide, f"• {ev}", 0.4, 6.1 + i * 0.28, 5.5, 0.26,
                 font_size=9.5, color=TEXT_LIGHT)

    # ── Right: Forecast model ─────────────────────────────────────────────────
    add_rect(slide, 6.5, 1.15, 6.6, 6.25, CARD, SKY, 0.8)
    add_rect(slide, 6.5, 1.15, 6.6, 0.42, RGBColor(0x02, 0x14, 0x22))
    add_text(slide, "📈  MODEL 2: MULTI-DOMAIN PREDICTIVE ENGINE",
             6.65, 1.18, 6.3, 0.36, font_size=10, bold=True, color=SKY)

    add_text(slide, "Random Forest Regressor (×3)", 6.65, 1.65, 6.2, 0.3,
             font_size=14, bold=True, color=TEXT_WHITE)
    add_text(slide, "n_estimators=50 · random_state=42 · 3 domain models",
             6.65, 1.92, 6.2, 0.26, font_size=10, color=TEXT_GRAY)

    add_rect(slide, 6.55, 2.25, 6.35, 0.03, BORDER)

    # Training
    add_text(slide, "Training Data", 6.65, 2.35, 2, 0.28,
             font_size=10, bold=True, color=SKY)
    add_text(slide,
             "1,000 synthetic hourly samples (10 days × 96 15-min readings).\n"
             "Labels generated from diurnal sine/cosine energy, water and traffic curves.",
             6.65, 2.6, 6.2, 0.5, font_size=9.5, color=TEXT_GRAY, wrap=True)

    # Features
    add_text(slide, "Input Features (Diurnal Encoding)", 6.65, 3.18, 4, 0.28,
             font_size=10, bold=True, color=SKY)
    feats2 = ["hour (0–23.75)", "sin(2π×hour/24)", "cos(2π×hour/24)"]
    for i, f in enumerate(feats2):
        pill(slide, f, 6.65 + i * 2.1, 3.5, w=2.0, h=0.3,
             bg=RGBColor(0x02, 0x18, 0x28), fg=SKY, font_size=9)

    add_rect(slide, 6.55, 4.35, 6.35, 0.03, BORDER)

    add_text(slide, "3-Hour Forecast Performance", 6.65, 4.45, 4, 0.28,
             font_size=10, bold=True, color=SKY)

    perf = [
        ("Energy Demand", "MAE ±4.2 kW",   "RMSE 5.8 kW",  "High Risk > 200 kW",   SKY),
        ("Water Outflow",  "MAE ±28.5 L/hr","RMSE 36.2",    "High Risk > 1,400 L/hr", CYAN),
        ("Traffic Volume", "MAE ±3.8 v/m",  "RMSE 5.1",     "High Risk > 90 v/min", EMERALD),
        ("Waste Fill %",   "MAE ±3.2%",     "Fixed +15%",   "High Risk ≥ 90%",      AMBER),
    ]
    for i, (dom, mae, rmse, risk, col) in enumerate(perf):
        y_ = 4.82 + i * 0.54
        add_rect(slide, 6.6, y_, 6.3, 0.46, RGBColor(0x04, 0x12, 0x1C), col, 0.5)
        add_text(slide, dom, 6.75, y_ + 0.04, 2.2, 0.22,
                 font_size=10, bold=True, color=col)
        add_text(slide, f"{mae}  ·  {rmse}", 6.75, y_ + 0.24, 3.5, 0.2,
                 font_size=9, color=TEXT_GRAY)
        add_text(slide, risk, 10.7, y_ + 0.12, 2.1, 0.22,
                 font_size=8.5, color=TEXT_GRAY)

    add_rect(slide, 0, 7.38, 13.33, 0.12, AMBER)

# ══════════════════════════════════════════════════════════════════════════════
#  SLIDE 6 — IMPACT & FUTURE
# ══════════════════════════════════════════════════════════════════════════════
def slide6(prs):
    slide = blank_slide(prs)
    fill_bg(slide, BG)
    add_rect(slide, 0, 0, 13.33, 0.06, EMERALD)

    add_rect(slide, 0, 0.06, 13.33, 0.95, RGBColor(0x04, 0x12, 0x0C))
    add_rect(slide, 0, 0.06, 0.06, 0.95, EMERALD)
    add_text(slide, "06", 0.15, 0.08, 0.6, 0.3,
             font_size=10, bold=True, color=RGBColor(0x44, 0x55, 0x66))
    add_text(slide, "SUSTAINABILITY IMPACT & FUTURE ROADMAP", 0.1, 0.3, 9, 0.4,
             font_size=28, bold=True, color=TEXT_WHITE)
    add_text(slide, "Quantified results from the NEXUS TWIN What-If Simulation Engine",
             0.1, 0.68, 9, 0.28, font_size=12, italic=True, color=TEXT_GRAY)

    # ── 5 big impact stat cards ───────────────────────────────────────────────
    stats = [
        ("-51%",  "CO₂ Emissions",  "1,465 kg/day avoided",  EMERALD, "100 kW Solar + Transit Shift"),
        ("-15%",  "Water Demand",   "2,775 L/day conserved", SKY,     "Pipe isolation + efficiency"),
        ("-53%",  "Grid Dependency","1,632 kWh/day saved",   CYAN,    "Solar generation offset"),
        ("-42%",  "Traffic Volume", "36 fewer vehicles/min", AMBER,   "45% public transit adoption"),
        ("−31.5", "Flood Risk pts", "Moderate → Low Risk",   ROSE,    "Green cover + drainage boost"),
    ]
    for i, (val, lbl, sub, col, note) in enumerate(stats):
        x = 0.2 + i * 2.6
        add_rect(slide, x, 1.12, 2.42, 1.75, CARD, col, 0.9)
        add_text(slide, val, x + 0.08, 1.18, 2.26, 0.6,
                 font_size=30, bold=True, color=col, align=PP_ALIGN.CENTER)
        add_rect(slide, x + 0.15, 1.78, 2.1, 0.03, BORDER)
        add_text(slide, lbl, x + 0.08, 1.83, 2.26, 0.28,
                 font_size=10, bold=True, color=TEXT_WHITE, align=PP_ALIGN.CENTER)
        add_text(slide, sub, x + 0.08, 2.1, 2.26, 0.22,
                 font_size=8.5, color=TEXT_GRAY, align=PP_ALIGN.CENTER)
        add_text(slide, f"↑ {note}", x + 0.08, 2.36, 2.26, 0.4,
                 font_size=7.5, color=col, align=PP_ALIGN.CENTER, wrap=True)

    # ── Demo flow strip ───────────────────────────────────────────────────────
    add_rect(slide, 0.2, 3.08, 12.9, 0.32, RGBColor(0x04, 0x20, 0x18))
    add_text(slide, "12-STEP GUIDED DEMO MODE  |  Auto-Play · Manual Step · Progress Dots · Event Injection · Simulation Sync",
             0.35, 3.1, 12.6, 0.26, font_size=9, bold=True, color=EMERALD)

    # ── Future roadmap (left) ─────────────────────────────────────────────────
    add_rect(slide, 0.2, 3.52, 5.8, 3.88, CARD, CYAN, 0.5)
    add_rect(slide, 0.2, 3.52, 5.8, 0.4, RGBColor(0x04, 0x22, 0x2E))
    add_text(slide, "🚀  FUTURE ROADMAP", 0.35, 3.54, 5.6, 0.34,
             font_size=11, bold=True, color=CYAN)

    roadmap = [
        ("Q4 2025", "Real IoT Hardware Integration",
         "Replace synthetic sensor generator with live MQTT streams from actual weather stations, "
         "smart meters, and traffic cameras via an IoT gateway."),
        ("Q1 2026", "Generative AI Advisory Layer",
         "Add a Claude / GPT-4 Turbo integration that reads anomaly + prediction state and generates "
         "natural-language policy memos for city commissioners."),
        ("Q2 2026", "Multi-City Twin Federation",
         "Extend the platform to federate multiple city-district Digital Twins, enabling cross-city "
         "comparative benchmarking of sustainability KPIs."),
        ("Q3 2026", "Citizen Engagement Portal",
         "Public-facing dashboard showing live air quality, flood risk, and energy savings — with a "
         "gamified 'Green Actions' system for community participation."),
    ]
    for i, (quarter, title, desc) in enumerate(roadmap):
        y_ = 4.02 + i * 0.84
        pill(slide, quarter, 0.3, y_, w=1.1, h=0.26, bg=CYAN_DIM, fg=CYAN, font_size=8.5)
        add_text(slide, title, 1.52, y_, 4.3, 0.26,
                 font_size=10, bold=True, color=TEXT_WHITE)
        add_text(slide, desc, 0.35, y_ + 0.3, 5.55, 0.44,
                 font_size=8.5, color=TEXT_GRAY, wrap=True)

    # ── Closing statement + team (right) ──────────────────────────────────────
    add_rect(slide, 6.2, 3.52, 6.9, 3.88, CARD, EMERALD, 0.5)
    add_rect(slide, 6.2, 3.52, 6.9, 0.4, RGBColor(0x04, 0x22, 0x14))
    add_text(slide, "🌱  WHY NEXUS TWIN WINS", 6.35, 3.54, 6.6, 0.34,
             font_size=11, bold=True, color=EMERALD)

    wins = [
        ("✦  Real ML, not mock data",
         "IsolationForest + RandomForest both trained and evaluated. Metrics are genuine, not fabricated."),
        ("✦  Formula-transparent simulation",
         "Every what-if calculation uses documented physics-based formulas visible in the UI and codebase."),
        ("✦  End-to-end full stack",
         "FastAPI backend + React/Three.js frontend + Docker deployment — fully functional in < 2 minutes."),
        ("✦  Live interactive demo",
         "12-step guided walkthrough with auto-play, live event injection, 3D flood overlay and AI alerts."),
        ("✦  Scientific honesty",
         "Simulation disclaimers, assumptions page, and transparent ML evaluation page built into the app."),
    ]
    for i, (title, desc) in enumerate(wins):
        y_ = 4.06 + i * 0.64
        add_rect(slide, 6.25, y_, 6.7, 0.56, RGBColor(0x06, 0x18, 0x10), EMERALD, 0.4)
        add_text(slide, title, 6.38, y_ + 0.04, 6.4, 0.22,
                 font_size=10, bold=True, color=EMERALD)
        add_text(slide, desc, 6.38, y_ + 0.27, 6.4, 0.24,
                 font_size=8.5, color=TEXT_GRAY, wrap=True)

    # Tagline footer
    add_rect(slide, 0, 7.08, 13.33, 0.9, RGBColor(0x04, 0x12, 0x0C))
    add_rect(slide, 0, 7.08, 13.33, 0.03, EMERALD)

    add_text(slide, "Code Amigos", 0.3, 7.14, 4, 0.35,
             font_size=16, bold=True, color=CYAN)
    add_text(slide, "Sidharthan S  ·  Sidharth D  ·  Tharsan Kanthaswamy",
             0.3, 7.44, 6, 0.28, font_size=10, color=TEXT_GRAY)

    add_text(slide, '"Simulate today.  Sustain tomorrow."',
             4.5, 7.22, 5.3, 0.38,
             font_size=15, bold=True, italic=True, color=EMERALD, align=PP_ALIGN.CENTER)

    add_text(slide, "NEXUS TWIN  ·  2025", 10.0, 7.14, 3.1, 0.35,
             font_size=12, bold=True, color=TEXT_GRAY, align=PP_ALIGN.RIGHT)
    add_text(slide, "Hackathon Submission", 10.0, 7.45, 3.1, 0.25,
             font_size=9, color=TEXT_GRAY, align=PP_ALIGN.RIGHT)

    add_rect(slide, 0, 7.38, 13.33, 0.12, EMERALD)

# ══════════════════════════════════════════════════════════════════════════════
#  BUILD
# ══════════════════════════════════════════════════════════════════════════════
def build():
    prs = new_prs()
    print("Building slide 1: Title & Team...")
    slide1(prs)
    print("Building slide 2: Problem Statement...")
    slide2(prs)
    print("Building slide 3: Solution & Architecture...")
    slide3(prs)
    print("Building slide 4: Key Features...")
    slide4(prs)
    print("Building slide 5: AI & ML Engine...")
    slide5(prs)
    print("Building slide 6: Impact & Roadmap...")
    slide6(prs)

    out = r"D:\Hackathons\Satin Finserv\NEXUS_TWIN_CodeAmigos.pptx"
    prs.save(out)
    print(f"\n✅  Saved → {out}")
    return out

if __name__ == "__main__":
    build()
