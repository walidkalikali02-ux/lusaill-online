# الدفعة الثالثة عشرة — حماية البيانات قبل نسخ Android واستعادته وإخلاء صور Google
**تاريخ المراجعة:** 10 نوفمبر 2026  
**النطاق:** توسيع ثلاث صفحات منشورة أصلًا في موسوعة لوسيل، دون تغيير عناوينها الدائمة أو حذف محتواها السابق. لم نتصل بهاتف المستخدم أو حسابه أو نطلع على صور أو جهات اتصال.

| الصفحة | فصول إضافية | كلمات إضافية | مراجع رسمية مرتبطة |
|---|---:|---:|---:|
| `/articles/android-backup-check` | 7 | 1330 | 5 |
| `/articles/android-restore-contacts` | 7 | 1349 | 5 |
| `/articles/google-photos-free-device-space` | 7 | 1371 | 5 |
| **الإجمالي** | **21** | **4050** | |

## 1. النسخ الاحتياطي لهاتف Android
- [Google — Back up or restore data on Android](https://support.google.com/android/answer/2819582): نوع البيانات التي تشملها النسخة العامة، وتنبيه أن تطبيقات معينة قد لا تدعم جميع أنواع البيانات، وشرط توافق إصدار Android أثناء الاستعادة.
- [Google — Back up your phone](https://support.google.com/android/answer/12760783): مسار التفعيل والإجراء الفوري وحالة النسخة.
- [Google Photos — Check your backup](https://support.google.com/photos/answer/9343402): حساب الصور الصحيح ومجلدات الجهاز وضرورة مراجعة حالة رفع الصور.
- [Google — Transfer troubleshooting](https://support.google.com/android/answer/13769784): الخيارات عند تفويت مرحلة نقل البيانات أثناء إعداد الجهاز.
- [Google — Restore contacts](https://support.google.com/android/answer/12761392): الفرق بين استعادة جهات جهاز/شريحة ومزامنة جهات حساب Google.
- **القرار التحريري:** لا نعد باستعادة جميع بيانات تطبيق واحد؛ الاختبار العملي للبيانات الحرجة يسبق مسح الجهاز الأصلي.

## 2. استعادة جهات الاتصال
- [Android — Restore contacts](https://support.google.com/android/answer/12761392): اختيار حساب Google ومصدر الجهاز وSIM قبل تنفيذ الاستعادة.
- [Google Contacts — Export/backup/restore contacts](https://support.google.com/contacts/answer/7199294): المزامنة، وملف VCF، وحدود النسخ عند اختلاف إصدارات Android.
- [Google Contacts — Deleted contacts/undo changes](https://support.google.com/contacts/answer/7280886): نافذة **30 يومًا** للمهملات والتراجع؛ التنبيه إلى أن التراجع قد يخفي جهات أضيفت بعد نقطة الاستعادة.
- [Android — Back up or restore](https://support.google.com/android/answer/2819582) للمراجعة المقارنة.
- **القرار التحريري:** جهة لم تُحفظ في حساب Google لا يُضمن ظهورها في مهملات Google Contacts.

## 3. إخلاء مساحة الهاتف في Google Photos
- [Google Photos — Free up space on your device](https://support.google.com/photos/answer/6128843): حذف النسخ المحلية المؤمّنة بالنسخ، مع إمكان عرض النسخ السحابية دون استمرار ظهورها في معرض الهاتف أو عدم الاتصال.
- [Google Photos — Check your backup](https://support.google.com/photos/answer/9343402) و[Backup photos](https://support.google.com/photos/answer/6193313): التحقق من الحساب والمجلدات وحالة النسخ قبل الحذف.
- [Google Photos — Manage storage](https://support.google.com/photos/answer/9284827): تخزين حساب Google.
- [Google Play — Free up Android storage](https://support.google.com/googleplay/answer/7431795): تخزين الهاتف المحلي وخيارات المساحة.
- **القرار التحريري:** خيار «إخلاء المساحة» غير حذف الصور من مكتبة Google Photos، ولا يضمن استعادة صورة حُذفت دون نسخة.

## الجودة والحدود
1. كل فصل من التوسعات الجديدة يحتوي على رابط مصدر مدرج في قائمة المقال الرسمية.
2. فحص `scripts/encyclopedia-quality.mjs` يتحقق من الحد الأدنى للكلمات والفصول والمصادر ووجود الصور المرتبطة.
3. فحص `scripts/test-topic-discovery.mjs` يتحقق من ربط المقال بالموسوعة وأهليته لقواعد البحث الداخلية، ويلتقط غياب تحذيرات فقد البيانات.
4. شرح الواجهة يستند إلى تعليمات Google العامة، وقد تختلف الأزرار حسب Android والشركة وإصدار التطبيق.
5. لا يثبت هذا العمل أن النسخ أو الاستعادة أو الإخلاء نُفذت على هاتف حقيقي، ولا أن Google فهرس الصفحات.
6. لا ينبغي للقارئ إجراء حذف أو إعادة ضبط قبل التحقق من البيانات والحساب والنسخ البديل.
