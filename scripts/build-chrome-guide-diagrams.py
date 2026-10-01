"""Original editorial diagrams, not simulated Google UI. Run from repo root."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
COVERS = {
 'chrome-update-check': ('تحديث المتصفح والتحقق', ['احفظ العمل', 'افحص الإصدار', 'أعد التشغيل', 'راجع النتيجة']),
 'chrome-cache-site-data': ('اختر بيانات الحذف بعناية', ['ملفات مؤقتة', 'بيانات موقع', 'سجل التصفح', 'اختبار النتيجة']),
 'chrome-reset-settings': ('استعادة إعدادات المتصفح', ['حدد المشكلة', 'اقرأ الأثر', 'أكد الإجراء', 'اختبر السلوك']),
 'chrome-bookmarks-transfer': ('نقل الإشارات المرجعية', ['المصدر الصحيح', 'ملف HTML', 'استيراد الملف', 'فتح الروابط']),
 'chrome-default-search': ('اختيار محرك البحث', ['شريط العنوان', 'إعداد البحث', 'اختبار الوجهة', 'فحص التغيير']),
 'chrome-download-errors': ('تشخيص خطأ التنزيل', ['رسالة الخطأ', 'الشبكة والمساحة', 'إذن الوصول', 'فحص الملف']),
 'chrome-crash-diagnosis': ('لماذا لا يفتح المتصفح؟', ['نافذة لا تفتح', 'صفحة تتعطل', 'مقارنة متصفح', 'تسجيل النتيجة']),
 'chrome-translate-arabic': ('اقرأ الصفحة بالعربية', ['صفحة كاملة', 'نص محدد', 'إعداد اللغات', 'مقارنة الأصل']),
 'chrome-separate-profiles': ('افصل مهامك وحساباتك', ['ملف العمل', 'ملف الدراسة', 'فحص الحساب', 'حماية البيانات']),
 'chrome-guest-session': ('جلسة مؤقتة وحدود واضحة', ['جهاز موثوق', 'ملف الضيف', 'إنهاء النوافذ', 'مراجعة الملفات']),
}
DIAGRAMS = {
 'chrome-cache-choice': ('ثلاث فئات مختلفة؛ اقرأ قبل الحذف', [
  ('الصور والملفات المؤقتة', 'أجزاء محفوظة من الصفحات'), ('بيانات موقع واحد', 'قد تتأثر جلسة الدخول والتفضيلات'),
  ('سجل التصفح', 'قائمة زيارات وليست ملف التنزيل'), ('الاختبار بعد الإجراء', 'كرر الوظيفة التي كانت تتعطل')]),
 'chrome-bookmarks-check': ('انقل الإشارات ثم افحص النسخة', [
  ('١ — المصدر', 'افتح الملف الشخصي المقصود'), ('٢ — التصدير', 'احفظ الإشارات في ملف HTML'),
  ('٣ — الاستيراد', 'اختر الملف في المتصفح الجديد'), ('٤ — التحقق', 'افتح روابط من مجلدات مهمة')]),
 'chrome-download-map': ('اختر الحل من رسالة التنزيل', [
  ('الشبكة', 'افحص الاتصال وجرب الاستئناف'), ('القرص الممتلئ', 'راجع المساحة قبل حذف الملفات'),
  ('إذن الحفظ', 'اختر مجلدًا يمكنك الوصول إليه'), ('إذن الخادم', 'راجع تسجيل الدخول ومالك الملف')]),
 'chrome-guest-limits': ('وضع الضيف: الحفظ المحلي والظهور', [
  ('عند انتهاء الجلسة', 'يحذف السجل والكوكيز محليًا'), ('المواقع والشبكة', 'قد يبقى نشاطك مرئيًا لها'),
  ('الجهاز غير الموثوق', 'لا تدخل حسابات حساسة عليه'), ('الملفات المحفوظة', 'راجع التنزيلات خارج المتصفح')]),
}

def text(draw, xy, value, size, fill='#17324d'):
    font = ImageFont.truetype(FONT, size)
    assert draw.textlength(value, font=font, direction='rtl') < 1080
    draw.text(xy, value, font=font, fill=fill, anchor='mm', direction='rtl', language='ar')

for index, (slug, (title, labels)) in enumerate(COVERS.items()):
    image = Image.new('RGB', (1200, 630), '#eef5f8')
    draw = ImageDraw.Draw(image)
    accent = ['#186a82', '#356d52', '#57579a', '#9a5c25'][index % 4]
    draw.rounded_rectangle((45, 35, 1155, 590), radius=28, fill='white', outline=accent, width=4)
    text(draw, (600, 100), title, 42, accent)
    # Stylized editorial browser silhouette with labels, not a UI screenshot.
    for i, label in enumerate(labels):
        x = 625 if i % 2 == 0 else 85
        y = 165 + (i // 2) * 150
        draw.rounded_rectangle((x, y, x+490, y+125), radius=16, fill='#edf3f8')
        draw.ellipse((x+430, y+16, x+470, y+56), fill=accent)
        text(draw, (x+245, y+77), label, 30)
    text(draw, (600, 535), 'لوسيل | دليل عملي للكمبيوتر | رسم أصلي', 23, '#52667b')
    path = Path('public/images/articles') / (slug+'.webp')
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, 'WEBP', quality=90)

for slug, (title, rows) in DIAGRAMS.items():
    image = Image.new('RGB', (1200, 700), '#eff5f9')
    draw = ImageDraw.Draw(image)
    text(draw, (600, 62), title, 34)
    for i, (heading, body) in enumerate(rows):
        x = 620 if i % 2 == 0 else 40
        y = 125 + (i // 2) * 230
        draw.rounded_rectangle((x, y, x+540, y+190), radius=18, fill='white', outline='#b8cedd', width=2)
        text(draw, (x+270, y+55), heading, 29, '#145e91')
        text(draw, (x+270, y+126), body, 23)
    text(draw, (600, 651), 'رسم إرشادي أصلي؛ لا يمثل واجهة رسمية', 23, '#52667b')
    path = Path('public/images/diagrams') / (slug+'.webp')
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, 'WEBP', quality=90)
print('Created 10 covers and 4 instructional diagrams')
