"""Original task diagrams for the October 2 guides; no simulated Microsoft UI."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json
raw=Path('lib/article-content/windows-guides-2026-10-02.ts').read_text()
articles=json.loads(raw.split(' = ',1)[1].rstrip().removesuffix(';'))
LABELS={
'windows-clipboard':['نص تجريبي','اختيار العنصر','مراجعة اللصق','محو ما يلزم'],
'windows-screen-capture':['تحديد المشكلة','قص المساحة','حفظ النسخة','فحص الصورة'],
'windows-cleanup':['قياس المساحة','مراجعة الفئات','فحص النسخة','تنظيف واختبار'],
'windows-nearby-share':['الجهاز المقصود','إعداد الطرفين','قبول الاستقبال','فحص النسخة'],
'windows-zip':['قائمة الملفات','إنشاء الأرشيف','استخراج منفصل','فتح الملفات'],
'windows-snap':['مصدر ووجهة','نافذتان متجاورتان','تعديل المساحة','مقارنة وحفظ'],
'windows-desktops':['تحديد مهمتين','تسمية الأسطح','اختيار العرض','فحص الحساب'],
'windows-startup-apps':['اسم ووظيفة','إعداد واحد','إعادة تشغيل','مقارنة النتيجة'],
'windows-text-size':['تحديد الصعوبة','نص أم كل العناصر','تكبير مؤقت','فحص الأزرار'],
'windows-default-apps':['نوع الملف','تطبيق مناسب','نسخة تجريبية','فحص المحتوى'],
}
DIAGRAMS={
'windows-clipboard':('حافظة مؤقتة؛ احتفظ بالأصل', [('السجل المحلي','للتنقل بين النصوص المنسوخة'),('مستندك الأصلي','مرجع الصياغة المهمة'),('المزامنة','قرار مستقل يرفع النص للسحابة'),('المحو','راجع العناصر المثبتة أيضًا')]),
'windows-cleanup':('راجع أثر الحذف قبل التنظيف', [('المساحة المتاحة','سجل القرص الذي به المشكلة'),('ملفاتك المهمة','افتح نسخة محفوظة أولًا'),('النسخة السابقة','حذفها يزيل خيار العودة'),('فحص النتيجة','قارن المساحة وافتح المستند')]),
'windows-nearby-share':('النقل لا يكتمل باسم الجهاز', [('المصدر','ملف تجريبي معلوم'),('الوجهة','تحقق من الجهاز المقصود'),('الاستقبال','اقبل الحفظ في مجلد معلوم'),('التحقق','افتح النسخة قبل حذف الأصل')]),
'windows-text-size':('اختر إعداد العرض بحسب الحاجة', [('حجم النص','تكبير الكلمات'),('Scale','تكبير العناصر معًا'),('المكبر','فحص تفصيل مؤقت'),('اختبار المهمة','اقرأ ثم تحقق من الأزرار')]),
'windows-default-apps':('إعداد الفتح ليس تحويلًا للصيغة', [('حدد النوع','مثال: مستند نصي .txt'),('اختر التطبيق','أداة مناسبة من الإعدادات'),('افتح نسخة','ملف تجريبي بلا بيانات حساسة'),('راجع النتيجة','اسم التطبيق ومحتوى مطابق')]),
}
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def text(d,xy,t,size=30,fill='#17324d',maxw=1080):
 while size>15:
  f=ImageFont.truetype(FONT,size)
  if d.textlength(t,font=f,direction='rtl')<=maxw:break
  size-=1
 d.text(xy,t,font=f,fill=fill,anchor='mm',direction='rtl',language='ar')
for i,a in enumerate(articles):
 im=Image.new('RGB',(1200,630),'#f2f5f8');d=ImageDraw.Draw(im);c=['#1e687b','#3b6c50','#5f5595','#8d582d','#23559a'][i%5]
 d.rounded_rectangle((40,30,1160,595),radius=30,fill='white',outline=c,width=3)
 text(d,(600,86),a['title'],36,c)
 # A distinct editorial geometry represents the task rather than a product interface.
 if a['slug'] in ['windows-snap','windows-desktops']:
  for j in range(2):d.rounded_rectangle((390+j*215,140,590+j*215,275),radius=10,outline=c,width=4,fill='#eaf0f6')
 elif a['slug']=='windows-nearby-share':
  for j in range(2):d.rounded_rectangle((345+j*340,150,515+j*340,270),radius=8,outline=c,width=4)
  d.line((535,210,665,210),fill=c,width=5);d.polygon([(665,210),(645,197),(645,223)],fill=c)
 elif a['slug']=='windows-screen-capture':
  d.rectangle((450,145,750,280),outline=c,width=4)
  for x,y in [(430,125),(750,125),(430,280),(750,280)]:d.line((x,y,x+20,y),fill=c,width=6);d.line((x,y,x,y+20),fill=c,width=6)
 elif a['slug']=='windows-zip':
  d.rounded_rectangle((460,145,740,280),radius=16,fill='#eaf0f6',outline=c,width=3)
  for y in range(150,275,20):d.rectangle((585,y,615,y+10),fill=c)
 else:
  for j in range(3):d.rounded_rectangle((440+j*38,140+j*20,685+j*38,245+j*20),radius=12,outline=c,width=3,fill=['#edf4f7','#e1ebf2','white'][j])
 for j,label in enumerate(LABELS[a['slug']]):
  x=640 if j%2==0 else 70;y=325+(j//2)*100
  d.rounded_rectangle((x,y,x+490,y+80),radius=12,fill='#edf3f7')
  text(d,(x+245,y+40),label,28,c,maxw=440)
 text(d,(600,560),'لوسيل | Windows 11 | رسم تحريري أصلي',22,'#52667b')
 im.save(Path('public/images/articles')/(a['slug']+'.webp'),'WEBP',quality=88)
for slug,(title,rows) in DIAGRAMS.items():
 im=Image.new('RGB',(1200,700),'#eef4f8');d=ImageDraw.Draw(im);text(d,(600,60),title,36)
 for j,(h,b) in enumerate(rows):
  x=620 if j%2==0 else 40;y=125+(j//2)*230
  d.rounded_rectangle((x,y,x+540,y+185),radius=18,fill='white',outline='#b3c9d7',width=2)
  text(d,(x+270,y+50),h,29,'#145e91',480);text(d,(x+270,y+125),b,25,maxw=490)
 text(d,(600,650),'رسم يوضح القرار؛ لا يمثل واجهة رسمية',22,'#52667b')
 im.save(Path('public/images/diagrams')/(slug+'-map.webp'),'WEBP',quality=88)
print('10 original covers; 5 explanatory diagrams')
