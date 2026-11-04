import type { ArticleContentOverride } from "./types";

// WPS / Microsoft official references reviewed 2026-11-04. No hands-on recovery is claimed.
export const kingsoftExcelRecovery: ArticleContentOverride[] = [
  {
    "id": 331,
    "slug": "wps-kingsoft-deleted-excel-recovery",
    "title": "استرجاع ملف Excel محذوف من Kingsoft أو WPS Office: الدليل الكامل",
    "status": "published",
    "publishedAt": "2026-11-04T19:24:00+03:00",
    "updatedAt": "2026-11-04T19:24:00+03:00",
    "metaDescription": "حُذف ملف Excel من Kingsoft أو WPS؟ تعرّف على استرجاعه من سلة المحذوفات ونسخ WPS وOneDrive وFile History، وحلول الحذف النهائي دون فقد بيانات أخرى.",
    "coverImage": "https://res-academy.cache.wpscdn.com/images/seo_posts/20230321/8ef9a7152eab4e26bb8370445e3ccf51.png",
    "coverImageAlt": "لقطة شاشة من مركز مساعدة WPS Office تعرض مسار Backup and Recovery لفتح النسخ الاحتياطية",
    "quickAnswer": "لا تبدأ بتنزيل برنامج استرجاع عشوائي. إذا اختفى ملف Excel من Kingsoft (الاسم السابق لـ WPS Office)، فافحص أولًا هل أزيل من قائمة الملفات الأخيرة فقط؛ ثم ابحث عنه في الكمبيوتر وسلة محذوفات Windows. إذا كان محذوفًا فعلًا، افتح WPS Office > Menu > Backup and Recovery > Auto Backup وابحث عن نسخة، وافحص سلة WPS Cloud إن كان محفوظًا سحابيًا. بعد ذلك جرّب File History أو سلة OneDrive. للحذف النهائي من قرص محلي توجد أداة Windows File Recovery، لكن النجاح غير مضمون. قلّل استخدام القرص فورًا إذا كان الملف لا يُعوّض.",
    "summaryTable": [
      {
        "label": "الحالة",
        "value": "ملف Excel ‏(.xlsx أو .xls) اختفى أو حُذف من Kingsoft / WPS Office على Windows 10 أو Windows 11."
      },
      {
        "label": "أسرع حل",
        "value": "سلة المحذوفات في Windows، ثم البحث في This PC؛ قد يكون الملف موجودًا ولم يعد ظاهرًا في Recent."
      },
      {
        "label": "استرجاع نسخ البرنامج",
        "value": "WPS: ‏Menu > Backup and Recovery > Auto Backup > View Details، بشرط وجود نسخة احتياطية بالفعل."
      },
      {
        "label": "إذا كان في السحابة",
        "value": "WPS Cloud Recycle Bin أو OneDrive Recycle Bin، مع الدخول إلى الحساب الصحيح."
      },
      {
        "label": "عند الحذف النهائي",
        "value": "File History إن كان مفعّلًا مسبقًا، أو Windows File Recovery إلى قرص آخر؛ لا توجد ضمانات."
      },
      {
        "label": "قبل أي محاولة",
        "value": "لا تحفظ ملفات جديدة على القرص الأصلي، ولا تثبت عليه أدوات الاسترجاع أو التنظيف."
      }
    ],
    "steps": [
      {
        "title": "حدّد معنى «تمسح»: حذف الملف أم اختفاؤه من Recent؟",
        "detail": "اسأل أولًا: هل كان الملف يُفتح من قسم Recent في WPS ثم اختفى، أم ضغطت العميلة Delete على الملف من مجلد Documents أو Desktop، أم حُذف من WPS Cloud؟ اختفاء العنصر من Recent قد يعني إزالة الاختصار فقط وليس حذف الملف الأصلي. دوّن آخر اسم تتذكره، امتداده، المجلد، تاريخ آخر تعديل، وهل الجهاز متصل بحساب WPS أو OneDrive. لا تنشئ ملفًا جديدًا بالاسم نفسه ولا تنفّذ أوامر تنظيف أو إفراغ سلة المحذوفات. إن كان الملف محذوفًا من قرص داخلي فعلًا، فإن نشاط الكمبيوتر قد يكتب فوق مساحته، ما يقلّل فرص استرجاعه. ابدأ بطرق الاستعادة غير المدمّرة وانتقل للأصعب فقط إذا لم تعثر على نسخة قابلة للفتح.",
        "sourceUrl": "https://support.microsoft.com/ar-sa/windows/experience/backup-recovery/windows-file-recovery"
      },
      {
        "title": "افحص سلة محذوفات Windows واستعد الملف إلى مكانه الأصلي",
        "detail": "افتح Recycle Bin من سطح المكتب، أو ابحث عنها من قائمة Start، ثم رتّب العناصر بتاريخ الحذف. راجع أسماء الملفات المنتهية بـ .xlsx و.xls، واستخدم الاسم التقريبي إن كنت تعرفه. عند العثور على الملف تأكد من خانة Original Location ثم اضغط عليه بزر الماوس الأيمن واختر Restore. يعود عادة إلى مجلده الأصلي؛ افتحه من ذلك المجلد وتحقّق من وجود أوراق العمل والبيانات. لا تعتمد على وجود الأيقونة وحدها لتأكيد نجاح الاسترجاع: الملف قد يكون قديمًا أو مختلفًا. إذا كانت سلة المحذوفات فارغة فلا يعني هذا استحالة الاسترجاع، فقد يكون الحذف نهائيًا أو وقع من سحابة أو قرص خارجي لم يُنقل إلى السلة.",
        "sourceUrl": "https://support.microsoft.com/ar-sa/windows/experience/backup-recovery/windows-file-recovery"
      },
      {
        "title": "افتح النسخ الاحتياطية داخل WPS: ‏Auto Backup",
        "detail": "شغّل Kingsoft Spreadsheets أو WPS Spreadsheets وافتح واجهة البرنامج. وفقًا لدليل WPS الرسمي، يمكن الوصول في بعض الإصدارات إلى Menu > Backup and Recovery > Auto Backup. من لوحة النسخ اضغط View Details، وابحث عن اسم المصنف أو عن نسخة زمنية قريبة من آخر تعديل صحيح. افتح الملف المرشح، وافحص تبويبات أوراق العمل والخلايا والصيغ قبل اختيار Save As وحفظه بنسخة جديدة. توضح WPS الخطوات على تطبيق Writer كمثال، وقد تختلف أسماء الأزرار أو مواضعها في إصدار Spreadsheets عند العميلة. تنبيه مهم: ميزة Auto Backup صُممت كذلك للملفات غير المحفوظة أو التي أُغلقت بصورة مفاجئة؛ وجودها لا يعني تلقائيًا وجود نسخة لكل ملف حُذف.",
        "sourceUrl": "https://help.wps.com/articles/how-to-recover-files-deleted-by-mistake-and-unsaved-files-and-view-backup-files/"
      },
      {
        "title": "استخدم View Details أو View Other Backups وافحص النسخ القديمة",
        "detail": "إن لم تجد ملفك مباشرة في لوحة Auto Backup، افحص View Details، أو خيار View Other Backups إن كان ظاهرًا في إصدارها. عند عرض الملفات احتفظ بمقارنة بين التاريخ والحجم والاسم؛ قد تكون نسخة من يوم سابق هي الأحدث المتاحة، لا النسخة الأخيرة التي تتذكرها العميلة. يمكن استخدام Open All حيث تسمح الواجهة بذلك، ثم حفظ النسخة الصحيحة خارج مجلد النسخ الاحتياطي. تجنّب نسخ أي مسار قديم من الإنترنت باعتباره ثابتًا لكل نسخ Kingsoft: مواقع تخزين WPS تتغير بحسب الإصدار ونظام التشغيل وإعدادات الحساب. إن لم تظهر نسخ أصلًا، سجّل النتيجة وانتقل للمسار التالي بدل تثبيت برنامج تنظيف أو تعديل ملفات النظام. وفي حالة عدم حفظ المصنف أبدًا، قد لا توجد نسخة قابلة للاسترداد.",
        "sourceUrl": "https://help.wps.com/articles/find-auto-save-backup"
      },
      {
        "title": "تحقق من WPS Cloud Recycle Bin إذا كان الملف متزامنًا",
        "detail": "عندما كانت العميلة تحفظ الملف على WPS Cloud، فالسلة السحابية هي المكان الأصح للبحث، وليس سلة Windows فقط. سجّل الدخول بحساب WPS الذي كان مستخدمًا وقت حفظ المصنف، ثم من WPS Office افتح Home > Open > Recycle Bin، وابحث عن الملف واضغط Recover عند ظهوره. ارجع إلى My Cloud Files أو ابحث عن الاسم وافتحه. هذه هي الخطوات التي يسردها مركز مساعدة WPS لاسترجاع الملفات السحابية المحذوفة بالخطأ. إن كانت تستخدم أكثر من حساب، فاختبر الحساب الأصلي فقط ولا تنشئ حسابًا جديدًا ظنًا أنه سيجلب الملفات. إذا لم تكن المزامنة السحابية مفعّلة من قبل، لن تنشئ هذه الطريقة نسخة مفقودة على القرص المحلي.",
        "sourceUrl": "https://help.wps.com/articles/how-to-recover-files-deleted-by-mistake-and-unsaved-files-and-view-backup-files/"
      },
      {
        "title": "ابحث عن نسخة موجودة في الكمبيوتر باسم مختلف أو في مجلد آخر",
        "detail": "افتح File Explorer باختصار Windows + E، ثم اختر This PC واكتب في مربع البحث ‎*.xlsx‎، وكرّر البحث عن ‎*.xls‎. انتظر اكتمال الفهرسة والبحث خاصة إذا كان القرص يحتوي ملفات كثيرة، ثم رتّب النتائج بـ Date modified. افحص Documents وDesktop وDownloads والمجلد الذي كانت تحفظ فيه أعمال العملاء، وتأكد من الأقراص الخارجية المتصلة أصلًا من دون إجراء عمليات كتابة عليها. قد تجد نسخًا باسم يشمل «Copy» أو رقمًا مضافًا، أو ملفًا أرسلته بالبريد أو حفظته من WhatsApp أو مجلد تنزيلات. لا تفتح ملفات تنفيذية مجهولة تشبه أسماء Excel. إذا وجدت الملف، انسخه إلى مجلد آمن وجرّب فتح النسخة قبل إعادة تسمية الأصل. انتبه إلى أن WPS يستطيع فتح ملفات Excel حتى لو لم يكن Microsoft Excel مثبتًا.",
        "relatedLink": {
          "href": "/articles/windows-zip",
          "label": "كيف تتعامل مع الملفات والمجلدات في Windows"
        },
        "sourceUrl": "https://support.microsoft.com/ar-sa/windows/experience/backup-recovery/windows-file-recovery"
      },
      {
        "title": "استعد إصدارًا سابقًا من المجلد باستخدام File History",
        "detail": "إذا لم تجد الملف وكان الكمبيوتر يُجري نسخًا احتياطية سابقة باستخدام File History، افتح المجلد الذي كان يحوي الملف، ثم اضغط بزر الفأرة الأيمن واختر Properties > Previous Versions أو Restore previous versions حسب نسخة Windows. تصفّح الإصدارات التي تسبق تاريخ الحذف وافتح النسخة التي تحتوي المصنف. الأفضل استرجاع الملف إلى موقع آخر عندما يتاح Restore to، حتى لا تكتب فوق إصدار آخر. هذه الميزة لا تُرجع ملفات من العدم؛ إذا لم يكن سجل الملفات أو نسخة احتياطية مناسبة قد لا يظهر أي إصدار. لا تخلط بين File History وSystem Restore: استعادة النظام ليست بديلًا موثوقًا لاسترداد ملفات Excel الشخصية.",
        "sourceUrl": "https://support.microsoft.com/ar-sa/windows/experience/backup-recovery/backup-and-restore-with-file-history"
      },
      {
        "title": "افحص OneDrive Recycle Bin وتاريخ الإصدارات",
        "detail": "إذا كانت مجلدات Desktop أو Documents متزامنة مع Microsoft OneDrive، افتح الموقع الرسمي onedrive.com وسجّل الدخول بحساب العميلة الصحيح، ثم افتح Recycle bin وابحث عن الملف واستعده. إن كان الملف ما زال موجودًا لكن محتواه ناقص أو تم استبداله بإصدار غير صحيح، فراجع Version History للملف بدل افتراض أنه حُذف. عادة تحتفظ OneDrive الشخصية بالعناصر المحذوفة لمدة تصل إلى 30 يومًا، وحسابات العمل أو المدرسة غالبًا حتى 93 يومًا ما لم تتغير سياسة المؤسسة؛ المدة ليست ضمانًا لوجود كل ملف. لا تفعّل مزامنة عشوائية أو تبدّل حسابات الكمبيوتر خلال التشخيص؛ احفظ أي نسخة تعثر عليها أولًا وأكّد فتحها قبل إعادة نقلها.",
        "sourceUrl": "https://support.microsoft.com/ar-sa/onedrive/restore-deleted-files-or-folders-in-onedrive",
        "relatedLink": {
          "href": "/articles/drive-file-restore",
          "label": "استعادة ملف محذوف من Google Drive إذا كانت النسخة محفوظة هناك"
        }
      },
      {
        "title": "للحذف النهائي: استخدم Windows File Recovery بحذر",
        "detail": "إذا كان الملف حُذف نهائيًا من قرص محلي ولم تكن له نسخة احتياطية، فجرّب أداة Microsoft الرسمية Windows File Recovery على Windows 10 أو 11. ضع قرصًا خارجيًا مثل E: لاستقبال النتائج، وتأكد أن حرف القرص الأصلي C: صحيح قبل التنفيذ؛ يجب أن يختلف المصدر عن الوجهة. افتح Windows File Recovery بصلاحية المسؤول ونفّذ: winfr C: E: /regular /n *.xlsx /n *.xls . وافق بالحرف Y إذا طلب التأكيد، ثم افحص مجلد Recovery_التاريخ الذي تنشئه الأداة على E:. إذا كان الحذف قديمًا أو لم ينجح وضع regular على NTFS، جرّب: winfr C: E: /extensive /n *.xlsx /n *.xls . حسب Microsoft يُستخدم وضع extensive أيضًا لأنظمة FAT/exFAT؛ لا تدّعِ أن الأداة تسترجع كل الملفات، وخصوصًا من SSD بعد الكتابة فوق المساحة أو تنفيذ TRIM. لا تثبت أداة الاسترجاع أو تضع النتيجة على القرص المراد فحصه.",
        "sourceUrl": "https://support.microsoft.com/ar-sa/windows/experience/backup-recovery/windows-file-recovery"
      },
      {
        "title": "افحص سلامة المصنف بعد الاسترجاع ولا تستبدل الأصل قبل المقارنة",
        "detail": "بعد العثور على أي نسخة، افتحها في WPS Spreadsheets وتأكد من عدد أوراق العمل وأسماء علامات التبويب وأحدث إدخالات العميلة والصيغ والتنسيقات المهمة. لا يكفي أن يظهر ملف .xlsx في المجلد؛ ربما يكون تالفًا أو لا يحتوي إلا نسخة قديمة. احفظ نسخة جديدة باسم واضح يتضمن التاريخ، مثل «المبيعات-مستعاد-2026-11-04.xlsx»، في موقع آمن مختلف عن القرص الذي تعرّض للحذف. قارن أهم السجلات بمصدر موثوق إن وجد، خصوصًا ملفات الحسابات والفواتير. إذا كان الملف يفتح برسالة تلف، جرّب أولًا نسخة احتياطية أخرى بدل تطبيق إصلاح عشوائي على النسخة الوحيدة. وثّق من أين جاءت النسخة، وما إذا كانت كل التعديلات الأخيرة موجودة.",
        "sourceUrl": "https://help.wps.com/articles/how-to-recover-files-deleted-by-mistake-and-unsaved-files-and-view-backup-files/"
      },
      {
        "title": "إذا فشلت الطرق السابقة: صعّد الحالة واحمِ البيانات مستقبلًا",
        "detail": "إذا كان المصنف شديد الأهمية وفشلت جميع النسخ والسلال، فالأكثر أمانًا تقليل أو إيقاف استخدام القرص الأصلي والتواصل مع مختص استعادة بيانات، خصوصًا عند صدور أصوات غير مألوفة من قرص HDD أو ظهور أخطاء قراءة. لا تكرر الفحص العنيف لقرص يحتمل عطله المادي. للوقاية في المستقبل، فعّل نسخًا احتياطية منتظمة وتحقّق فعلًا من القدرة على استعادتها؛ احتفظ بنسخة محلية وبنسخة أخرى على وسيط مستقل أو سحابة وفق سياسة خصوصية البيانات. لا تعتمد على Auto Backup في WPS وحده، لأنه ليس أرشيفًا مضمونًا لكل ملف. اطلب من العميلة معرفة موضع الحفظ الحقيقي: المجلد المحلي أم WPS Cloud أم OneDrive، ثم اختبر الاسترجاع باستخدام ملف تجريبي غير حساس.",
        "sourceUrl": "https://support.microsoft.com/ar-sa/windows/experience/backup-recovery/windows-file-recovery"
      }
    ],
    "commonMistakes": [
      "الخلط بين إزالة الملف من قائمة Recent وحذف الملف من القرص: ابدأ بالبحث في This PC.",
      "تفريغ Recycle Bin أو تشغيل برامج التنظيف قبل فحصها.",
      "حفظ الملفات الجديدة أو تثبيت أدوات الاسترجاع على القرص الذي فُقد منه الملف.",
      "اعتبار Auto Backup ضمانًا لوجود نسخة من ملف محذوف؛ النسخة قد لا تكون موجودة.",
      "الدخول إلى حساب WPS أو OneDrive مختلف عن الحساب الذي حفظ الملف.",
      "استرجاع نسخة قديمة ثم الكتابة فوق النسخة الوحيدة دون مقارنة محتوياتها.",
      "تشغيل winfr بمصدر ووجهة على القرص نفسه؛ توصي Microsoft بأن يكونا مختلفين.",
      "الاعتقاد أن System Restore يعيد كل ملفات Excel الشخصية.",
      "استخدام صور مواقع الشرح باعتبارها مطابقة لإصدار البرنامج عند العميلة؛ تختلف الواجهات."
    ],
    "faqs": [
      {
        "question": "هل يمكن استرجاع ملف Excel محذوف من Kingsoft مجانًا؟",
        "answer": "نعم أحيانًا؛ سلة Windows وسلة WPS Cloud والنسخ الاحتياطية المتاحة وWindows File Recovery الرسمي طرق يمكن تجربتها دون شراء برنامج استرجاع. النتيجة تعتمد على وجود نسخة أو بقاء البيانات دون كتابة فوقها."
      },
      {
        "question": "هل Kingsoft Office هو نفسه WPS Office؟",
        "answer": "Kingsoft هو الاسم المرتبط ببرنامج المكتب الذي أصبح يُعرف تجاريًا بـ WPS Office. قد تختلف القوائم بين الإصدارات القديمة والحديثة؛ ابحث عن WPS Spreadsheets أو Kingsoft Spreadsheets."
      },
      {
        "question": "حذفت الملف من قائمة Recent فقط، هل ضاع نهائيًا؟",
        "answer": "ليس بالضرورة. Recent قائمة اختصارات للملفات المفتوحة مؤخرًا، وحذف إدخال منها لا يثبت حذف الملف الأصلي. ابحث في This PC وبالمجلدات المعتادة."
      },
      {
        "question": "أين أجد Auto Backup في WPS Office؟",
        "answer": "في بعض الإصدارات: Menu > Backup and Recovery > Auto Backup ثم View Details. قد تظهر تسمية Backup Management أو View Other Backups في إصدار آخر. استعد نسخة وحفظها باسم جديد."
      },
      {
        "question": "هل يمكن استرجاع ملف بعد Shift + Delete؟",
        "answer": "قد يكون ممكنًا إذا وُجدت نسخة احتياطية أو سحابية، أو لم تُكتب بيانات جديدة فوق الملف. يمكن تجربة Windows File Recovery على قرص محلي مع حفظ النتائج على قرص آخر، لكن النجاح غير مضمون."
      },
      {
        "question": "لماذا لا يظهر الملف في سلة المحذوفات؟",
        "answer": "ربما حُذف نهائيًا، أو من خدمة سحابية، أو من قرص خارجي، أو أن ما اختفى هو إدخال Recent لا الملف الأصلي. راجع مكان الحفظ والحساب قبل أي محاولة تقنية متقدمة."
      },
      {
        "question": "هل استعادة النظام System Restore ترجع ملف Excel المحذوف؟",
        "answer": "لا ينبغي الاعتماد عليها لاستعادة الملفات الشخصية. استخدم File History أو النسخ الاحتياطية أو سلال الملفات بدلًا منها."
      },
      {
        "question": "هل Windows File Recovery يصلح لملفات WPS؟",
        "answer": "يمكنه البحث عن ملفات Excel ذات امتداد .xlsx و.xls على وسائط محلية مدعومة. لا يستعيد البيانات مباشرة من مخازن WPS Cloud أو OneDrive؛ استخدم أدوات السحابة الخاصة بهما."
      },
      {
        "question": "ماذا لو فتح الملف المستعاد لكنه لا يحتوي آخر تعديل؟",
        "answer": "قارن توقيت النسخة ومحتواها، وابحث في WPS Auto Backup وتاريخ الإصدارات السحابية عن نسخة أحدث. لا تكتب فوق النسخة المستعادة الحالية."
      },
      {
        "question": "كيف أمنع ضياع ملفات Excel مرة أخرى؟",
        "answer": "فعّل نسخًا احتياطية مستقلة، وتحقق من عمل المزامنة، واحتفظ بنسخة خارج جهاز الكمبيوتر، وحدد مجلد حفظ واضحًا، واختبر استرجاع ملف تجريبي."
      }
    ],
    "sources": [
      {
        "label": "WPS Help Center: استعادة الملفات غير المحفوظة والملفات المحذوفة من السحابة",
        "url": "https://help.wps.com/articles/how-to-recover-files-deleted-by-mistake-and-unsaved-files-and-view-backup-files/",
        "checkedAt": "2026-11-04"
      },
      {
        "label": "WPS Help Center: العثور على النسخ التلقائية في Backup Management",
        "url": "https://help.wps.com/articles/find-auto-save-backup",
        "checkedAt": "2026-11-04"
      },
      {
        "label": "Microsoft Support: استرداد الملفات عبر Windows File Recovery",
        "url": "https://support.microsoft.com/ar-sa/windows/experience/backup-recovery/windows-file-recovery",
        "checkedAt": "2026-11-04"
      },
      {
        "label": "Microsoft Support: النسخ الاحتياطي والاستعادة باستخدام File History",
        "url": "https://support.microsoft.com/ar-sa/windows/experience/backup-recovery/backup-and-restore-with-file-history",
        "checkedAt": "2026-11-04"
      },
      {
        "label": "Microsoft Support: استعادة الملفات المحذوفة من OneDrive",
        "url": "https://support.microsoft.com/ar-sa/onedrive/restore-deleted-files-or-folders-in-onedrive",
        "checkedAt": "2026-11-04"
      }
    ]
  }
];
