"""Original editorial diagrams, never simulated Google interface screenshots."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json
A=json.loads(Path('lib/article-content/google-editor-guides-2026-10-03.ts').read_text().split(' = ',1)[1].rstrip().removesuffix(';'))
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def text(d,xy,t,size=30,fill='#17324d',maxw=1080):
 while size>15:
  f=ImageFont.truetype(FONT,size)
  if d.textlength(t,font=f,direction='rtl')<=maxw:break
  size-=1
 d.text(xy,t,font=f,fill=fill,anchor='mm',direction='rtl',language='ar')
for i,a in enumerate(A):
 im=Image.new('RGB',(1200,630),'#f1f5f7');d=ImageDraw.Draw(im);c=['#1d6a71','#426f46','#635499','#98672e','#255c91'][i%5]
 d.rounded_rectangle((35,25,1165,605),radius=25,fill='white',outline=c,width=3)
 text(d,(600,82),a['title'],36,c)
 if a['slug'].startswith('sheets'):
  d.rounded_rectangle((395,135,805,275),radius=8,fill='#edf4f4',outline=c,width=3)
  for x in range(475,805,80):d.line((x,135,x,275),fill='#aec6ca',width=2)
  for y in range(170,275,35):d.line((395,y,805,y),fill='#aec6ca',width=2)
  d.rectangle((395,135,805,170),fill=c)
 else:
  d.rounded_rectangle((450,130,750,280),radius=10,fill='#f0f2f7',outline=c,width=3)
  d.rectangle((475,150,700,164),fill=c)
  for y in [185,209,233,257]:d.line((475,y,720,y),fill='#aab8c6',width=3)
 for j,s in enumerate(a['steps'][:4]):
  x=625 if j%2==0 else 65;y=320+(j//2)*105
  d.rounded_rectangle((x,y,x+505,y+83),radius=12,fill='#edf3f7')
  text(d,(x+252,y+41),s['title'],28,c,465)
 text(d,(600,566),'لوسيل | دليل عملي | رسم تحريري أصلي',22,'#52667b')
 im.save(Path('public/images/articles')/(a['slug']+'.webp'),'WEBP',quality=88)
MAPS={
'sheets-sort-filter':('حافظ على ارتباط رقم الطلب ببياناته',[('قبل الفرز','101: مريم، القاهرة'),('بعد الفرز','101: مريم، القاهرة'),('ما الذي يتغير؟','ترتيب الصفوف بحسب العمود'),('الفحص','لا تفصل الاسم عن رقم الطلب')]),
'sheets-clean-import':('تشابه الاسم لا يعني تكرار الطلب',[('طلب 101','مريم — القاهرة'),('طلب 102','مريم — القاهرة'),('قرار المراجعة','رقمان مختلفان يحتاجان فحصًا'),('مفتاح السجل','عرّفه قبل إزالة التكرار')]),
'sheets-conditional-format':('اختبار شرط: أقل من 10',[('القيمة 5','تحقق الشرط: نعم'),('القيمة 10','تحقق الشرط: لا'),('القيمة 20','تحقق الشرط: لا'),('دلالة اللون','اقرأ الشرط والوحدة مع القيمة')]),
'sheets-protect':('اختر أداة التحرير وافصل عنها السرية',[('تحذير','تنبيه لا يمنع التعديل'),('تقييد المحررين','حدد من يمكنه تعديل النطاق'),('خلايا الإدخال','افحص أنها ما زالت متاحة'),('بيانات خاصة','راجع الوصول والمشاركة')]),
'docs-pages-mode':('وجهة المستند تحدد وضع التخطيط',[('الصفحات','رأس وتذييل وترقيم وهوامش'),('بلا صفحات','قراءة مستمرة وجدول واسع'),('رأس اختفى','ارجع إلى الصفحات وافحصه'),('عرض النص','اختيارك لا يغير رؤية زملائك')]),
'docs-translate':('راجع المعنى قبل اعتماد النسخة',[('الأسماء والأرقام','قارنها بالنص الأصلي'),('المواعيد والشروط','تحقق مما يجب فعله ومتى'),('الجملة المنفية','لا تقلب المنع إلى طلب'),('حد الاعتماد','النسخة الآلية ليست رسمية')]),
}
for slug,(title,rows) in MAPS.items():
 im=Image.new('RGB',(1200,700),'#eef4f8');d=ImageDraw.Draw(im);text(d,(600,65),title,36)
 for j,(h,b) in enumerate(rows):
  x=620 if j%2==0 else 40;y=125+(j//2)*230
  d.rounded_rectangle((x,y,x+540,y+190),radius=18,fill='white',outline='#b3c9d7',width=2)
  text(d,(x+270,y+52),h,29,'#145e91',485);text(d,(x+270,y+127),b,25,maxw=490)
 text(d,(600,650),'مثال تحريري أو رسم قرار؛ لا يمثل واجهة رسمية',22,'#52667b')
 im.save(Path('public/images/diagrams')/(slug+'-map.webp'),'WEBP',quality=88)
# Contact sheet is a disposable visual QA artifact.
thumbs=Image.new('RGB',(1000,630*5//4),'white')
for i,a in enumerate(A):
 im=Image.open(Path('public/images/articles')/(a['slug']+'.webp'));im.thumbnail((250,158));thumbs.paste(im,((i%4)*250,(i//4)*158))
thumbs.save('/tmp/google-covers-contact.jpg')
print('20 original WebP covers and 6 explanatory diagrams')
