"""Original editorial covers and diagrams; never simulated Google UI screenshots."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import re

ROOT = Path(__file__).resolve().parents[1]
SOURCE = (ROOT / "lib/article-content/google-forms-slides-guides-2026-10-04.ts").read_text()
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
ENTRIES = re.findall(
    r'slug: "([^"]+)"[\s\S]*?title: "([^"]+)"[\s\S]*?stepLabels: \[([^\]]+)\]',
    SOURCE,
)


def draw_text(draw, center, value, size=30, color="#17324d", width=1080):
    while size > 15:
        font = ImageFont.truetype(FONT, size)
        if draw.textlength(value, font=font, direction="rtl") <= width:
            break
        size -= 1
    draw.text(center, value, font=font, fill=color, anchor="mm", direction="rtl", language="ar")


for index, (slug, title, labels_source) in enumerate(ENTRIES):
    labels = re.findall(r'"([^"]+)"', labels_source)[:4]
    image = Image.new("RGB", (1200, 630), "#eef5f6")
    draw = ImageDraw.Draw(image)
    color = "#5d4497" if slug.startswith("forms-") else "#176c78"
    draw.rounded_rectangle((34, 24, 1166, 606), radius=28, fill="white", outline=color, width=3)
    draw_text(draw, (600, 80), title, 37, color)
    if slug.startswith("forms-"):
        draw.rounded_rectangle((430, 125, 770, 280), radius=18, fill="#f2effa", outline=color, width=3)
        for y in (160, 200, 240):
            draw.ellipse((455, y - 9, 473, y + 9), outline=color, width=3)
            draw.line((490, y, 735, y), fill="#ad9ec9", width=4)
    else:
        draw.rounded_rectangle((390, 125, 810, 280), radius=14, fill="#edf7f8", outline=color, width=3)
        draw.rectangle((420, 150, 555, 250), fill="#b8d9dc")
        for y in (160, 190, 220, 250):
            draw.line((585, y, 775, y), fill="#7ab0b6", width=4)
    for step, label in enumerate(labels):
        x = 625 if step % 2 == 0 else 65
        y = 320 + (step // 2) * 105
        draw.rounded_rectangle((x, y, x + 505, y + 83), radius=13, fill="#edf3f7")
        draw_text(draw, (x + 252, y + 41), label, 27, color, 455)
    draw_text(draw, (600, 565), "لوسيل | دليل عملي | رسم تحريري أصلي", 22, "#52667b")
    image.save(ROOT / "public/images/articles" / f"{slug}.webp", "WEBP", quality=88)


MAPS = {
    "forms-question-types-map.webp": ("نوع السؤال يتبع القرار", [("إجابة واحدة", "اختيار متعدد أو قائمة"), ("عدة إجابات", "مربعات اختيار"), ("تفسير قصير", "إجابة قصيرة"), ("شرح مفصل", "فقرة")]),
    "forms-file-upload-limits.webp": ("افحص شروط رفع الملف", [("الدخول", "حساب Google مطلوب"), ("النوع", "طابق الصيغة المسموحة"), ("العدد والحجم", "التزم بالحدين"), ("المصدر", "لا رفع من Shared Drive")]),
    "forms-sections-routing-map.webp": ("مسار المجيب حتى الإرسال", [("سؤال القرار", "اختيار متعدد أو قائمة"), ("الخيار الأول", "القسم المناسب له"), ("الخيار الثاني", "قسم مختلف"), ("النهاية", "إرسال بلا حلقة")]),
    "forms-sheets-files.webp": ("ملفان مستقلان وصلاحيتان", [("Google Forms", "الأسئلة والردود الأصلية"), ("Google Sheets", "صفوف للتحليل والمتابعة"), ("الحذف", "لا يحذف الملف الآخر"), ("الوصول", "راجعه في كل ملف")]),
    "slides-linked-chart-flow.webp": ("راجع قبل تحديث المخطط", [("ورقة المصدر", "تعريف وفترة وصيغة"), ("المخطط", "محاور ووحدة واضحة"), ("Update", "قارن النسخة الجديدة"), ("العرض", "اكتب المصدر والتاريخ")]),
    "slides-captions-requirements.webp": ("التسميات مساعدة مباشرة", [("المتصفح", "إصدار حديث مدعوم"), ("الميكروفون", "إذن وصوت واضح"), ("الإنترنت", "اتصال أثناء العرض"), ("الحدود", "لا حفظ ولا تفريغ رسمي")]),
}

for filename, (heading, rows) in MAPS.items():
    image = Image.new("RGB", (1200, 700), "#eef4f8")
    draw = ImageDraw.Draw(image)
    draw_text(draw, (600, 65), heading, 36)
    for index, (label, value) in enumerate(rows):
        x = 620 if index % 2 == 0 else 40
        y = 125 + (index // 2) * 230
        draw.rounded_rectangle((x, y, x + 540, y + 190), radius=18, fill="white", outline="#b3c9d7", width=2)
        draw_text(draw, (x + 270, y + 52), label, 29, "#145e91", 485)
        draw_text(draw, (x + 270, y + 127), value, 25, "#17324d", 490)
    draw_text(draw, (600, 650), "رسم تحريري أصلي؛ لا يمثل واجهة Google", 22, "#52667b")
    image.save(ROOT / "public/images/diagrams" / filename, "WEBP", quality=88)

sheet = Image.new("RGB", (1000, 790), "white")
for index, (slug, _, _) in enumerate(ENTRIES):
    image = Image.open(ROOT / "public/images/articles" / f"{slug}.webp")
    image.thumbnail((250, 158))
    sheet.paste(image, ((index % 4) * 250, (index // 4) * 158))
sheet.save("/tmp/forms-slides-covers-contact.jpg")
print(f"{len(ENTRIES)} original WebP covers and {len(MAPS)} explanatory diagrams")
