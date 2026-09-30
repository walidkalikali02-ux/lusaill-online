from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
out=Path('public/images/diagrams');out.mkdir(parents=True,exist_ok=True)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def f(n):return ImageFont.truetype(font,n)
def t(d,x,y,txt,size=26,fill='#172b4d'):
 d.text((x,y),txt,font=f(size),fill=fill,anchor='mm',direction='rtl',language='ar')
diagrams={
'android-backup-map':('نسخة الهاتف ليست نسخة لكل الملفات',[('بيانات الجهاز','افحص تفاصيل النسخة وتاريخها'),('الصور والفيديو','افحص النسخ في Google Photos'),('الملفات المحلية','انسخها إلى الكمبيوتر أو Drive'),('بيانات التطبيقات','راجع دعم النسخ لكل تطبيق')]),
'photos-space-choice':('ميّز بين إجراءين قبل حذف الصور',[('إخلاء مساحة الجهاز','إزالة النسخ المحلية المحفوظة احتياطيًا'),('حذف من Google Photos','قد يؤثر في النسخة السحابية أيضًا'),('قبل الإجراء','تحقق من اكتمال النسخ بالحساب الصحيح'),('بعد الإجراء','اختبر ظهور صورك في حساب الصور')]),
'usb-transfer-check':('نقل ملف: اتصال ثم اختيار ثم تحقق',[('وصّل الهاتف','استخدم كابلًا يدعم نقل البيانات'),('افتح قفل الهاتف','اختر نقل الملفات من إشعار USB'),('انسخ إلى الكمبيوتر','اختر ملفاتك والمجلد المطلوب'),('تحقق قبل الحذف','افتح الملف المنسوخ من الكمبيوتر')]),
'reset-safety-check':('لا تبدأ المسح قبل اكتمال الفحص',[('حساب Google','تأكد من كلمة المرور وقفل الشاشة'),('نسخة البيانات','افحص الصور والملفات والتطبيقات'),('تجهيز الهاتف','شحن ٧٠٪ على الأقل واتصال بالشبكة'),('التأكيد النهائي','اتبع تعليمات الشركة؛ البيانات تُمحى')]),
'permissions-review':('راجع الإذن بحسب حاجة التطبيق',[('حدد الإذن','كاميرا أو ميكروفون أو موقع مثلًا'),('راجع الحاجة','هل تتطلب الوظيفة هذا الوصول؟'),('غيّر الخيار المتاح','بحسب إصدار الهاتف ونوع الإذن'),('اختبر الوظيفة','إن تعطلت، راجع الإذن الضروري')]),
}
for slug,(title,rows) in diagrams.items():
 im=Image.new('RGB',(1200,700),'#f0f5fa');d=ImageDraw.Draw(im);t(d,600,65,title,36)
 for i,(heading,body) in enumerate(rows):
  # Read in RTL order, top row then bottom row.
  x=620 if i%2==0 else 40;y=125+(i//2)*230
  d.rounded_rectangle((x,y,x+540,y+190),radius=18,fill='white',outline='#bfd1e0',width=2)
  t(d,x+270,y+55,heading,29,'#145da0');t(d,x+270,y+125,body,23)
 t(d,600,650,'رسم إرشادي أصلي من لوسيل؛ لا يمثل واجهة رسمية',22,'#465469')
 im.save(out/(slug+'.webp'),'WEBP',quality=92)
