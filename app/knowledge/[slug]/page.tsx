import MathArticleLab from "@/components/math-article-lab";
import { getMathArticleLab } from "@/lib/math-article-labs";
import type { Metadata } from "next";
import Link from "next/link";
import { parseInlineLinks } from "@/lib/inline-markdown-links";
import { EditorialCover } from "@/components/editorial-cover";
import Image from "next/image";
import { editorialImagePath } from "@/lib/editorial-image-url";
import { notFound } from "next/navigation";
import { pageAlternates } from "@/lib/page-alternates";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { knowledgeTopics, getKnowledgeTopic } from "@/lib/knowledge-expansion-data";
import { KnowledgeInteractiveTool } from "@/components/knowledge-interactive-tools";
import { isKnowledgeSearchReady, isMedicalKnowledgeTopic } from "@/lib/editorial-indexing";

export const dynamicParams = false;
export const revalidate = 86400;
export function generateStaticParams() {
  return knowledgeTopics.filter(t=>Boolean(t.directAnswer?.trim()) && t.sections.length>0).map(t=>({slug:t.slug}));
}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;const topic=getKnowledgeTopic(slug);
  if(!topic || !topic.directAnswer?.trim() || !topic.sections.length)return {robots:{index:false,follow:false}};
  const path="/knowledge/"+topic.slug;
  const cover = editorialImagePath("knowledge", topic.slug);
  return {title:topic.title,description:topic.description,alternates:pageAlternates(path),
    robots:{index:isKnowledgeSearchReady(topic),follow:true},
    openGraph:{title:topic.title,description:topic.description,url:path,type:"article",publishedTime:topic.publishedAt,
      images:[{url:cover,alt:"غلاف تحريري: "+topic.title,width:1200,height:630}]},
    twitter:{card:"summary_large_image",title:topic.title,description:topic.description,images:[cover]}};
}
const knowledgeIllustrations = [
  {
    "slug": "ai-vs-machine-learning-vs-deep-learning",
    "section": "section-1",
    "src": "https://upload.wikimedia.org/wikipedia/commons/b/bb/AI-ML-DL.svg",
    "width": 748,
    "height": 826,
    "maxWidth": 480,
    "alt": "ثلاث مساحات متداخلة: الذكاء الاصطناعي يضم تعلم الآلة، وتعلم الآلة يضم التعلم العميق",
    "caption": "يمثل الرسم العلاقة بين المجالات الثلاثة: التعلم العميق جزء من تعلم الآلة، وتعلم الآلة جزء من الذكاء الاصطناعي.",
    "credit": "Avimanyu786 وTukijaaliwa",
    "source": "https://commons.wikimedia.org/wiki/File:AI-ML-DL.svg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "ai-vs-machine-learning-vs-deep-learning",
    "section": "section-2",
    "src": "https://upload.wikimedia.org/wikipedia/commons/9/91/Multi-Layer_Neural_Network-Vector.svg",
    "width": 957,
    "height": 567,
    "maxWidth": 620,
    "alt": "عقد مترابطة مرتبة في طبقات تبدأ بالمدخلات وتنتهي بالمخرجات",
    "caption": "رسم مبسّط لشبكة عصبية متعددة الطبقات. تمثل الدوائر عقدًا تُمرّر القيم من طبقة إلى التالية؛ ولا يوضح الرسم بنية نموذج فرز بعينه.",
    "credit": "Offnfopt",
    "source": "https://commons.wikimedia.org/wiki/File:Multi-Layer_Neural_Network-Vector.svg",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "types-of-artificial-intelligence",
    "section": "section-1",
    "src": "https://upload.wikimedia.org/wikipedia/commons/b/be/Deep_Blue.jpg",
    "width": 400,
    "height": 601,
    "maxWidth": 360,
    "alt": "خزانة حاسوب Deep Blue من آي بي إم معروضة في متحف تاريخ الحاسوب",
    "caption": "حاسوب Deep Blue من آي بي إم في متحف تاريخ الحاسوب. تفوّق حاسوب من هذا النوع على غاري كاسباروف في مباراة عام 1997، وهو مثال على الأداء المتخصص في الشطرنج.",
    "credit": "James the photographer",
    "source": "https://commons.wikimedia.org/wiki/File:Deep_Blue.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    "slug": "what-is-an-algorithm",
    "section": "inputs-and-steps",
    "src": "https://upload.wikimedia.org/wikipedia/commons/d/da/If_Flowchart-ar.svg",
    "width": 855,
    "height": 1682,
    "maxWidth": 315,
    "alt": "مخطط انسيابي بالعربية يوضح تفرع خطوات التنفيذ بحسب تحقق شرط",
    "caption": "يوضح المخطط كيف يتغير مسار التنفيذ تبعًا لنتيجة الشرط. في مثال الطلبات، يحدد التطابق هل ينتهي البحث أم يستمر.",
    "credit": "Michel Bakni",
    "source": "https://commons.wikimedia.org/wiki/File:If_Flowchart-ar.svg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "what-is-an-algorithm",
    "section": "binary-search",
    "src": "https://upload.wikimedia.org/wikipedia/commons/6/64/Binary_search_into_array_-_example.svg",
    "width": 382,
    "height": 244,
    "maxWidth": 490,
    "alt": "رسم يوضح تقلص نطاق البحث الثنائي في مصفوفة مرتبة",
    "caption": "مثال مستقل على البحث الثنائي. تضيق المقارنات المتتابعة نطاق البحث في القائمة المرتبة حتى الوصول إلى العنصر المطلوب.",
    "credit": "LoStrangolatore",
    "source": "https://commons.wikimedia.org/wiki/File:Binary_search_into_array_-_example.svg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "big-data-and-artificial-intelligence",
    "section": "volume-velocity-variety",
    "src": "https://upload.wikimedia.org/wikipedia/commons/e/ee/Big_Data.png",
    "width": 612,
    "height": 422,
    "maxWidth": 612,
    "alt": "رسم يوضح تراكم بيانات من مصادر مختلفة وزيادة حجمها وسرعة تدفقها وتنوعها",
    "caption": "تتجمع البيانات من مصادر متعددة. يوضح الرسم الخصائص الثلاث التي تؤثر في طريقة جمع السجلات ومعالجتها.",
    "credit": "Ender005",
    "source": "https://commons.wikimedia.org/wiki/File:Big_Data.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "big-data-and-artificial-intelligence",
    "section": "prepare-training-data",
    "src": "https://upload.wikimedia.org/wikipedia/commons/b/bb/ML_dataset_training_validation_test_sets.png",
    "width": 1280,
    "height": 558,
    "maxWidth": 780,
    "alt": "مخطط يقارن تقسيم البيانات إلى مجموعتي تدريب واختبار بتقسيمها إلى تدريب وتحقق واختبار",
    "caption": "طريقتان لتقسيم البيانات. في مثال توقع المبيعات، يُطبَّق التقسيم حسب ترتيب الأسابيع، ويُحجز الاختبار لتقييم النموذج بعد اختيار إعداداته.",
    "credit": "Km121220",
    "source": "https://commons.wikimedia.org/wiki/File:ML_dataset_training_validation_test_sets.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "what-is-labeled-data",
    "section": "meaning",
    "src": "https://upload.wikimedia.org/wikipedia/commons/f/f4/Image-segmentation-example.jpg",
    "width": 1200,
    "height": 900,
    "maxWidth": 520,
    "alt": "الصورة الأصلية لحاسوب محمول وكأس على طاولة خشبية",
    "caption": "الصورة الأصلية. هي المدخل الذي تظهر فيه أجسام مختلفة قبل إسناد وسوم إلى مناطقها.",
    "credit": "MartinThoma",
    "source": "https://commons.wikimedia.org/wiki/File:Image-segmentation-example.jpg",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "what-is-labeled-data",
    "section": "meaning",
    "src": "https://upload.wikimedia.org/wikipedia/commons/1/19/Image-segmentation-example-segmented.png",
    "width": 1200,
    "height": 900,
    "maxWidth": 520,
    "alt": "تمثيل ملون للمشهد نفسه يفصل مناطق الحاسوب والكأس والطاولة",
    "caption": "نسخة مقسمة من المشهد نفسه. تمثل الألوان مناطق مختلفة، وتوضح كيف يمتد وسم الصورة إلى مناطق بداخلها.",
    "credit": "MartinThoma",
    "source": "https://commons.wikimedia.org/wiki/File:Image-segmentation-example-segmented.png",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "supervised-learning-explained",
    "section": "classification-and-regression",
    "src": "https://upload.wikimedia.org/wikipedia/commons/4/46/Linear-svm-scatterplot.svg",
    "width": 720,
    "height": 540,
    "maxWidth": 540,
    "alt": "نقاط بلونين تمثل فئتين وخط قرار يفصل بينهما",
    "caption": "مثال على التصنيف الثنائي ببيانات اصطناعية. يفصل الخط بين منطقتين للتصنيف وفق خصائص النقاط.",
    "credit": "Qwertyus وOjan",
    "source": "https://commons.wikimedia.org/wiki/File:Linear-svm-scatterplot.svg",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "supervised-learning-explained",
    "section": "classification-and-regression",
    "src": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Linear_regression.svg",
    "width": 438,
    "height": 289,
    "maxWidth": 500,
    "alt": "نقاط زرقاء مرصودة وخط أحمر يمثل توقعات الانحدار الخطي",
    "caption": "مثال على الانحدار الخطي. يقدّر الخط قيمة عددية، ويبيّن البعد الرأسي عن النقطة مقدار خطأ التقدير في ذلك المثال.",
    "credit": "Sewaqu وRaphaelQS",
    "source": "https://commons.wikimedia.org/wiki/File:Linear_regression.svg",
    "license": "الملكية العامة",
    "licenseUrl": "https://commons.wikimedia.org/wiki/File:Linear_regression.svg#Licensing"
  },
  {
    "src": "https://upload.wikimedia.org/wikipedia/commons/c/c0/Good_clustering.png",
    "width": 2238,
    "height": 1572,
    "alt": "أربع نقاط موزعة إلى مجموعتين متقاربتين لكل منهما مركز",
    "caption": "تجميع توضيحي يعطي مجموعتين تقاربت النقاط داخل كل منهما.",
    "source": "https://commons.wikimedia.org/wiki/File:Good_clustering.png",
    "slug": "unsupervised-learning-customer-segmentation",
    "section": "clusters",
    "maxWidth": 570,
    "credit": "MaoucheMounir",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "src": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Bad_K-Means_clustering.png",
    "width": 2266,
    "height": 1503,
    "alt": "النقاط الأربع نفسها وقد جمعت في مجموعتين مختلفتين بسبب اختيار المراكز",
    "caption": "مثال على تجميع مختلف بعد اختيار مراكز أولية أخرى. تساعد مقارنة أكثر من تشغيل على اكتشاف حساسية النتيجة للبداية.",
    "source": "https://commons.wikimedia.org/wiki/File:Bad_K-Means_clustering.png",
    "slug": "unsupervised-learning-customer-segmentation",
    "section": "clusters",
    "maxWidth": 570,
    "credit": "MaoucheMounir",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "src": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Reinforcement_learning_diagram.svg",
    "width": 300,
    "height": 290,
    "alt": "رسم يوضح إرسال الوكيل فعلًا إلى البيئة وعودة الحالة والمكافأة إليه",
    "caption": "حلقة التعلم المعزز. يرسل الوكيل فعلًا إلى البيئة، وتعيد إليه حالة جديدة وإشارة مكافأة.",
    "source": "https://commons.wikimedia.org/wiki/File:Reinforcement_learning_diagram.svg",
    "credit": "Megajuice",
    "section": "agent-environment-reward",
    "slug": "reinforcement-learning-explained",
    "maxWidth": 390,
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "src": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Simple_maze_on_grid.svg",
    "width": 244,
    "height": 244,
    "alt": "متاهة من ممرات وجدران مرسومة على شبكة مربعات",
    "caption": "مثال مرئي على متاهة شبكية. يمكن تمثيل موقع الوكيل بإحداثيات خانة، وتمثيل الأفعال بالانتقال إلى الخانات المجاورة.",
    "source": "https://commons.wikimedia.org/wiki/File:Simple_maze_on_grid.svg",
    "credit": "Hunsvotti",
    "section": "exploration",
    "slug": "reinforcement-learning-explained",
    "maxWidth": 390,
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "predictive-models-explained",
    "section": "target-and-horizon",
    "src": "https://upload.wikimedia.org/wikipedia/commons/8/81/TimeSerie-4.png",
    "width": 1223,
    "height": 682,
    "maxWidth": 680,
    "alt": "رسم لسلسلة زمنية يوضح نمطًا موسميًا يتكرر عبر الزمن",
    "caption": "مثال على النمط الموسمي في سلسلة زمنية. يفيد توقع اليوم المناظر في فترة سابقة عندما يستمر النمط ويمكن التحقق منه.",
    "credit": "Cike",
    "source": "https://commons.wikimedia.org/wiki/File:TimeSerie-4.png",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "predictive-models-explained",
    "section": "decision",
    "src": "https://upload.wikimedia.org/wikipedia/commons/c/c7/CurveWeightHeight.png",
    "width": 1199,
    "height": 737,
    "maxWidth": 680,
    "alt": "نقاط مرصودة وخط تقدير ومنحنيات خارجية لنطاق توقع قياس جديد",
    "caption": "مثال مستقل من الانحدار يوضح الفرق بين إعطاء تقدير واحد وتمثيل نطاق لقيمة جديدة. تمثل المنحنيات الخارجية نطاق التنبؤ لقياس جديد.",
    "credit": "Mathieu ROUAUD",
    "source": "https://commons.wikimedia.org/wiki/File:CurveWeightHeight.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "regression-vs-classification",
    "section": "metrics",
    "src": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Linear_regression_residuals.svg",
    "width": 384,
    "height": 384,
    "maxWidth": 490,
    "alt": "رسم علوي لنقاط وخط انحدار ورسم سفلي للفروق بين النقاط والخط",
    "caption": "يعرض الرسم العلوي الملاءمة الخطية للنقاط، ويعرض السفلي البواقي حول الصفر.",
    "credit": "Justinkunimune",
    "source": "https://commons.wikimedia.org/wiki/File:Linear_regression_residuals.svg",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "regression-vs-classification",
    "section": "threshold",
    "src": "https://upload.wikimedia.org/wikipedia/commons/8/88/Logistic-curve.svg",
    "width": 600,
    "height": 400,
    "maxWidth": 560,
    "alt": "منحنى لوجستي على شكل حرف S يرتفع من قرب الصفر نحو الواحد",
    "caption": "تنتقل قيمة الدالة اللوجستية تدريجيًا بين الصفر والواحد. يختار فريق العمل عتبة تحويل التقدير إلى فئة.",
    "credit": "Qef وAflafla1",
    "source": "https://commons.wikimedia.org/wiki/File:Logistic-curve.svg",
    "license": "الملكية العامة",
    "licenseUrl": "https://commons.wikimedia.org/wiki/File:Logistic-curve.svg#Licensing"
  },
  {
    "slug": "decision-trees-vs-random-forests",
    "section": "tree-splits",
    "src": "https://upload.wikimedia.org/wikipedia/commons/5/50/ID3_algorithm_decision_tree.svg",
    "width": 621,
    "height": 332,
    "maxWidth": 600,
    "alt": "مثال لشجرة قرار يتفرع فيها كل شرط إلى مسار ينتهي بفئة",
    "caption": "مثال مستقل على شجرة قرار. تحدد نتيجة كل شرط الفرع التالي حتى الوصول إلى إحدى الأوراق.",
    "credit": "Acoggins38 وIxfd64",
    "source": "https://commons.wikimedia.org/wiki/File:ID3_algorithm_decision_tree.svg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "decision-trees-vs-random-forests",
    "section": "forest-aggregation",
    "src": "https://upload.wikimedia.org/wikipedia/commons/d/d8/Decision_Tree_vs._Random_Forest.png",
    "width": 1577,
    "height": 940,
    "maxWidth": 680,
    "alt": "مقارنة بصرية بين شجرة قرار واحدة ومجموعة أشجار داخل غابة عشوائية",
    "caption": "مقارنة توضح شجرة منفردة وغابة تضم عدة أشجار. يُجمع ناتج الأشجار عند إصدار التوقع.",
    "credit": "Jeremybeauchamp",
    "source": "https://commons.wikimedia.org/wiki/File:Decision_Tree_vs._Random_Forest.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "clustering-in-machine-learning-marketing",
    "section": "methods",
    "src": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Hierarchical_clustering_simple_diagram.svg",
    "width": 418,
    "height": 333,
    "maxWidth": 510,
    "alt": "رسم يوضح بناء مجموعات هرمية من خلال ربط العناصر والمجموعات",
    "caption": "يعرض الرسم التجميع الهرمي. تحدد درجة التفصيل التي نختارها أين نقطع الشجرة للحصول على مجموعات.",
    "credit": "Stathis Sideris وMhbrugman",
    "source": "https://commons.wikimedia.org/wiki/File:Hierarchical_clustering_simple_diagram.svg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "clustering-in-machine-learning-marketing",
    "section": "methods",
    "src": "https://upload.wikimedia.org/wikipedia/commons/0/05/DBSCAN-density-data.svg",
    "width": 320,
    "height": 322,
    "maxWidth": 470,
    "alt": "مخطط نقاط يوضح مجموعات اكتشفتها DBSCAN وأخرى بعيدة عنها",
    "caption": "تربط DBSCAN النقاط بحسب كثافة الجوار. يبيّن المثال أشكالًا غير دائرية ونقاطًا خارج المجموعات وفق الإعداد المستخدم.",
    "credit": "Chire",
    "source": "https://commons.wikimedia.org/wiki/File:DBSCAN-density-data.svg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "anomaly-detection-and-fraud",
    "section": "definition",
    "src": "https://upload.wikimedia.org/wikipedia/commons/5/5a/BivariateOutlier.svg",
    "width": 756,
    "height": 541,
    "maxWidth": 610,
    "alt": "نقاط تنتظم في اتجاه واضح ونقطة بعيدة عن اتجاهها على محورين",
    "caption": "قد يظهر الشذوذ في العلاقة بين متغيرين حتى إذا بدا كل منهما مقبولًا منفردًا.",
    "credit": "Sigbert وAndel",
    "source": "https://commons.wikimedia.org/wiki/File:BivariateOutlier.svg",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "anomaly-detection-and-fraud",
    "section": "false-alerts",
    "src": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Precision_recall.svg",
    "width": 1007,
    "height": 670,
    "maxWidth": 660,
    "alt": "رسم يوضح العلاقة بين النتائج ذات الصلة والنتائج المختارة لحساب الدقة والاسترجاع",
    "caption": "تختلف مقامات الدقة والاسترجاع. في مثال المدفوعات يُقاس الأول بالنسبة إلى التنبيهات والثاني بالنسبة إلى الحالات المرجعية.",
    "credit": "kindlychung",
    "source": "https://commons.wikimedia.org/wiki/File:Precision_recall.svg",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "recommendation-systems",
    "credit": "Metalicat",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "section": "ranking",
    "src": "https://upload.wikimedia.org/wikipedia/commons/3/36/Feed_comparison-2.svg",
    "width": 512,
    "height": 320,
    "maxWidth": 600,
    "alt": "رسم يبين مرور مجموعة محتوى بمرحلة انتقاء المرشحين ثم احتساب الدرجة لتكوين قائمة مرتبة",
    "caption": "يبسّط الرسم مرحلتي الانتقاء والتقييم، ويمكن أن تلحق بهما إعادة ترتيب قبل العرض.",
    "source": "https://commons.wikimedia.org/wiki/File:Feed_comparison-2.svg"
  },
  {
    "slug": "recommendation-systems",
    "credit": "Metalicat",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "section": "feedback",
    "src": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Recommender_feedback_loop.svg",
    "width": 800,
    "height": 319,
    "maxWidth": 720,
    "alt": "أسهم تصل التوصية المعروضة بتفاعل المستخدم ثم استخدام ذلك التفاعل في تحديث نموذج الترتيب",
    "caption": "التوصيات التي تظهر أمام المستخدم تحدد ما يستطيع التفاعل معه، ولذلك تؤثر في بعض بيانات التدريب اللاحقة.",
    "source": "https://commons.wikimedia.org/wiki/File:Recommender_feedback_loop.svg"
  },
  {
    "slug": "context-window-and-tokens",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "section": "window",
    "src": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Engenharia_de_contexto_fluxo.svg",
    "width": 1600,
    "height": 820,
    "maxWidth": 760,
    "alt": "مخطط برتغالي يبين اختيار مصادر السياق واختصارها قبل إرسال الطلب إلى نموذج اللغة",
    "caption": "مثال لمراحل إعداد السياق: يمكن جمع تعليمات وسجل ومقتطفات، ثم اختيار ما يتسع له الطلب.",
    "credit": "Rodrigo Padula، استنادًا إلى عمل BelgianWeditor",
    "source": "https://commons.wikimedia.org/wiki/File:Engenharia_de_contexto_fluxo.svg"
  },
  {
    "slug": "ai-model-parameters",
    "section": "weights",
    "src": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Linear_regression.svg",
    "width": 438,
    "height": 289,
    "maxWidth": 590,
    "alt": "نقاط زرقاء وخط انحدار أحمر يمر بين النقاط",
    "caption": "ميل الخط وقيمته عند تقاطع المحور يبرزان دور معاملين يمكن تعلمهما من البيانات.",
    "credit": "Sewaqu",
    "source": "https://commons.wikimedia.org/wiki/File:Linear_regression.svg",
    "license": "ملكية عامة",
    "licenseUrl": "https://commons.wikimedia.org/wiki/File:Linear_regression.svg#Licensing"
  },
  {
    "slug": "ai-model-parameters",
    "section": "training",
    "src": "https://upload.wikimedia.org/wikipedia/commons/3/37/Artificial_neuron.svg",
    "width": 401,
    "height": 251,
    "maxWidth": 620,
    "alt": "مخطط لوحدة عصبية اصطناعية تربط المدخلات بالأوزان وتجمعها لتوليد المخرج",
    "caption": "تدخل الأوزان في حساب الوحدة. والرسم يوضح وحدة واحدة من شبكة يمكن أن تضم وحدات عديدة.",
    "credit": "Branislav Gerazov",
    "source": "https://commons.wikimedia.org/wiki/File:Artificial_neuron.svg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "temperature-in-ai-models",
    "section": "example",
    "src": "https://upload.wikimedia.org/wikipedia/commons/6/6e/Destilacion_temperatura.png",
    "width": 3360,
    "height": 1320,
    "maxWidth": 800,
    "alt": "مخططات أعمدة تقارن احتمالات البدائل قبل تغيير الحرارة وبعده",
    "caption": "يوضح الرسم تغير توزيع الاحتمالات مع الحرارة في حساب سوفت ماكس. القيم في الرسم منفصلة عن المثال العددي في المقال.",
    "credit": "Juanciño",
    "source": "https://commons.wikimedia.org/wiki/File:Destilacion_temperatura.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "open-source-vs-closed-ai-models",
    "section": "components",
    "src": "https://upload.wikimedia.org/wikipedia/commons/1/16/Openmod_workflow_diagram_raster_version.png",
    "width": 6330,
    "height": 1238,
    "maxWidth": 790,
    "alt": "مخطط يربط البيانات المفتوحة بنموذج مفتوح المصدر ثم بنتائج متاحة بترخيص مفتوح",
    "caption": "مثال من مشروع نمذجة مفتوحة يبين كيف يمكن نشر البيانات والنموذج والنتائج كل على حدة.",
    "credit": "Stefen Pfenninger",
    "source": "https://commons.wikimedia.org/wiki/File:Openmod_workflow_diagram_raster_version.png",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "slug": "small-language-models-for-business",
    "section": "measurement",
    "src": "https://upload.wikimedia.org/wikipedia/commons/2/25/Multi_Category_Confusion_Matrix.png",
    "width": 331,
    "height": 341,
    "maxWidth": 490,
    "alt": "مصفوفة التباس لفئات متعددة تقارن التصنيفات المتوقعة بالفئات الفعلية",
    "caption": "تظهر المطابقات والأخطاء لكل فئة في مواضع منفصلة. الرسم مثال عام، والأعداد في نص لوسيل افتراضية.",
    "credit": "Hssiqueira",
    "source": "https://commons.wikimedia.org/wiki/File:Multi_Category_Confusion_Matrix.png",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "on-device-ai",
    "section": "locations",
    "src": "https://upload.wikimedia.org/wikipedia/commons/3/34/Edge_computing_paradigm%2C_2019-07-03.svg",
    "width": 675,
    "height": 540,
    "maxWidth": 630,
    "alt": "مخطط تظهر فيه الأجهزة أسفل شبكة من العقد الطرفية والسحابة",
    "caption": "توضح الطبقة الوسطى مكان المعالجة على عقدة طرفية منفصلة عن الجهاز والسحابة.",
    "credit": "NoMore201",
    "source": "https://commons.wikimedia.org/wiki/File:Edge_computing_paradigm,_2019-07-03.svg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "ai-reasoning-models",
    "section": "compute",
    "src": "https://upload.wikimedia.org/wikipedia/commons/c/cb/MCTS-diagram.svg",
    "width": 860,
    "height": 244,
    "maxWidth": 790,
    "alt": "أربع مراحل من البحث الشجري تعرض اختيار فرع وتوسيعه وتجربة نتيجة ثم تحديث المعلومات",
    "caption": "مثال لخوارزمية بحث تفحص بدائل متفرعة. لا يمثل الرسم البنية الداخلية لكل نموذج استدلال.",
    "credit": "Rmoss92",
    "source": "https://commons.wikimedia.org/wiki/File:MCTS-diagram.svg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "vector-databases",
    "section": "distance",
    "src": "https://upload.wikimedia.org/wikipedia/commons/e/e7/KnnClassification.svg",
    "width": 279,
    "height": 252,
    "maxWidth": 460,
    "alt": "نقطة وسط مجموعتين من النقاط توضح كيف يعثر البحث على النقاط الأقرب",
    "caption": "يوضح الرسم فكرة العثور على الجيران في بعدين. وقد تُستخدم هذه الجيرة للتصنيف في مثال الرسم، أو لترتيب نتائج البحث في قاعدة متجهية.",
    "credit": "Natana Jadri (AnAj)",
    "source": "https://commons.wikimedia.org/wiki/File:KnnClassification.svg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "synthetic-data",
    "section": "methods",
    "src": "https://upload.wikimedia.org/wikipedia/commons/4/46/Linear-svm-scatterplot.svg",
    "width": 720,
    "height": 540,
    "maxWidth": 660,
    "alt": "نقاط اصطناعية لفئتين مع خط يرسم حد فصلهما في نموذج تصنيف",
    "caption": "بيانات مولّدة لفئتين، مع حد فصل محسوب لمثال تعليمي. الرسم لا يمثل بيانات أشخاص أو طلبات حقيقية.",
    "credit": "Qwertyus؛ تعديل الألوان Ojan",
    "source": "https://commons.wikimedia.org/wiki/File:Linear-svm-scatterplot.svg",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "explainable-ai",
    "section": "methods",
    "src": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Randomforest.png",
    "width": 2379,
    "height": 1380,
    "maxWidth": 740,
    "alt": "رسم يظهر ترتيب أهمية عشرة متغيرات محاكاة في نموذج غابة عشوائية",
    "caption": "مثال لأهمية المتغيرات في نموذج انحدار مبني على بيانات محاكاة. يصف الترتيب النموذج في التجربة عمومًا.",
    "credit": "Chamaemelum",
    "source": "https://commons.wikimedia.org/wiki/File:Randomforest.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "diffusion-models-for-image-generation",
    "section": "training",
    "src": "https://upload.wikimedia.org/wikipedia/commons/7/76/Image_diffusion_process.png",
    "width": 2374,
    "height": 855,
    "maxWidth": 800,
    "alt": "مخطط تدريبي يقارن صورة واضحة بمراحل يزداد فيها التشويش وبتقدير النموذج له",
    "caption": "يوضح الرسم صلة إضافة الضوضاء أثناء التدريب بتعلّم النموذج تقديرها أو إزالة أثرها.",
    "credit": "Dragweb",
    "source": "https://commons.wikimedia.org/wiki/File:Image_diffusion_process.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "speech-recognition-vs-text-to-speech",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "section": "recognition",
    "src": "https://upload.wikimedia.org/wikipedia/commons/f/f0/Scheme_of_speech_recognition_system.png",
    "width": 1120,
    "height": 912,
    "maxWidth": 640,
    "alt": "مخطط نظام يبدأ بإشارة الكلام ويمر بمراحل استخراج خصائص الإشارة والتعرف",
    "caption": "مثال لبنية نظام للتعرف على الكلام. قد تختلف المراحل وطريقة دمجها حسب النموذج.",
    "credit": "IHEARu",
    "source": "https://commons.wikimedia.org/wiki/File:Scheme_of_speech_recognition_system.png"
  },
  {
    "slug": "speech-recognition-vs-text-to-speech",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "section": "synthesis",
    "src": "https://upload.wikimedia.org/wikipedia/commons/5/59/Component_interaction_for_TTS.svg",
    "width": 512,
    "height": 543,
    "maxWidth": 480,
    "alt": "رسم يوضح تبادل المعلومات بين مكونات نظام لتحويل النص إلى صوت",
    "caption": "يوضح مثال Wikispeech كيف تتعاون المكونات الخاصة بالنص والنطق لتكوين مخرج صوتي.",
    "credit": "Sebastian Berlin (WMSE)",
    "source": "https://commons.wikimedia.org/wiki/File:Component_interaction_for_TTS.svg"
  },
  {
    "slug": "arabic-ocr",
    "section": "arabic",
    "src": "https://upload.wikimedia.org/wikipedia/commons/e/e5/Example_of_Arabic_text_Wellcome_L0040181.jpg",
    "width": 2526,
    "height": 4013,
    "maxWidth": 450,
    "alt": "صفحة من الخط العربي التاريخي يظهر فيها نص مع زخارف",
    "caption": "صفحة من مجموعة ويلكوم توضح نوعًا من الخط يختلف عن الفاتورة المطبوعة. لم يُستخدم الرسم لقياس دقة أي نظام.",
    "credit": "Wellcome Library, London",
    "source": "https://commons.wikimedia.org/wiki/File:Example_of_Arabic_text_Wellcome_L0040181.jpg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "slug": "model-context-protocol",
    "section": "parts",
    "src": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Modelo_Cliente-Servidor.png",
    "width": 542,
    "height": 262,
    "maxWidth": 580,
    "alt": "رسم يوضح اتصال عملاء بخادم يتلقى الطلبات ويرسل الردود",
    "caption": "نموذج عام لعلاقة العميل بالخادم. يوضح المخطط العربي المجاور موقع تطبيق المضيف في مثال MCP.",
    "credit": "YurikaH",
    "source": "https://commons.wikimedia.org/wiki/File:Modelo_Cliente-Servidor.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "llm-function-calling",
    "section": "example",
    "src": "https://upload.wikimedia.org/wikipedia/commons/3/37/Web_API_diagram.svg",
    "width": 1062,
    "height": 1004,
    "maxWidth": 500,
    "alt": "مخطط يبين تبادل طلب بيانات ورد منظم بين تطبيق وخادم",
    "caption": "مثال عام لطلب بيانات من واجهة ويب. يوضح المخطط العربي في المقال موقع استدعاء الدالة قبل طلب البيانات.",
    "credit": "I.hate.spam.mail.here",
    "source": "https://commons.wikimedia.org/wiki/File:Web_API_diagram.svg",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "evaluating-ai-models",
    "section": "set",
    "src": "https://upload.wikimedia.org/wikipedia/commons/b/bb/ML_dataset_training_validation_test_sets.png",
    "width": 1280,
    "height": 558,
    "maxWidth": 730,
    "alt": "رسم يبين فصل أمثلة التدريب والتحقق والاختبار إلى مجموعات",
    "caption": "يوضح الرسم توزيع البيانات بين التدريب والتحقق والاختبار النهائي. ويمكن استخدام المبدأ نفسه عند تطوير تعليمات تطبيق جاهز.",
    "credit": "Km121220",
    "source": "https://commons.wikimedia.org/wiki/File:ML_dataset_training_validation_test_sets.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "does-ai-understand-language",
    "section": "context",
    "src": "https://upload.wikimedia.org/wikipedia/commons/a/ac/Old_man_garden-path_%28right%29.svg",
    "width": 372,
    "height": 407,
    "maxWidth": 450,
    "alt": "شجرة نحوية تبيّن أدوار كلمات جملة إنجليزية يمكن إساءة تحليلها في القراءة الأولى",
    "caption": "مثال لتحليل جملة إنجليزية بعد زوال اللبس في وظيفة إحدى كلماتها.",
    "credit": "Jochen Burghardt",
    "source": "https://commons.wikimedia.org/wiki/File:Old_man_garden-path_(right).svg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "ai-information-sources",
    "section": "tools",
    "src": "https://upload.wikimedia.org/wikipedia/commons/4/4f/Rag-scheme.png",
    "width": 766,
    "height": 328,
    "maxWidth": 720,
    "alt": "مخطط يوضح استرجاع معلومات من مستندات ثم إدراجها في مدخلات نموذج اللغة",
    "caption": "يوضح الرسم كيف يضيف التطبيق مقاطع مسترجعة إلى المدخلات المتاحة للنموذج عند توليد الرد.",
    "credit": "Numiri",
    "source": "https://commons.wikimedia.org/wiki/File:Rag-scheme.png",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "slug": "common-ai-myths",
    "section": "models",
    "src": "https://upload.wikimedia.org/wikipedia/commons/4/49/Machine_learning_nutshell_--_Test_the_machine_learning_model.svg",
    "width": 512,
    "height": 102,
    "maxWidth": 740,
    "alt": "رسم يوضح تمرير بيانات الاختبار إلى نموذج مدرّب ومراجعة مخرجاته",
    "caption": "يعرض الرسم خطوة اختبار نموذج مدرّب على بيانات مخصصة للفحص.",
    "credit": "EpochFail",
    "source": "https://commons.wikimedia.org/wiki/File:Machine_learning_nutshell_--_Test_the_machine_learning_model.svg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "turing-test",
    "section": "setup",
    "src": "https://upload.wikimedia.org/wikipedia/commons/5/55/Turing_test_diagram.png",
    "width": 661,
    "height": 504,
    "maxWidth": 650,
    "alt": "رسم لمحكّم يتواصل مع إنسان وحاسوب في اختبار تورينج",
    "caption": "يوضح الرسم صيغة تقارن بين إنسان وآلة عبر تواصل لا يكشف هوية الطرفين للمحكّم.",
    "credit": "Juan Alberto Sánchez Margallo",
    "source": "https://commons.wikimedia.org/wiki/File:Turing_test_diagram.png",
    "license": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5/"
  },
  {
    "slug": "history-of-artificial-intelligence",
    "section": "learning",
    "src": "https://upload.wikimedia.org/wikipedia/commons/e/ee/IBM_Deep_Blue_at_Computer_History_Museum_%289361685537%29.jpg",
    "width": 1067,
    "height": 1600,
    "maxWidth": 480,
    "alt": "حاسوب ديب بلو المعروض في متحف تاريخ الحاسوب",
    "caption": "حاسوب ديب بلو في متحف تاريخ الحاسوب. توثق الصورة الجهاز المعروض، ويسجل أرشيف IBM نتيجة المباراة.",
    "credit": "Anton Chiang",
    "source": "https://commons.wikimedia.org/wiki/File:IBM_Deep_Blue_at_Computer_History_Museum_(9361685537).jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    "slug": "how-to-write-an-ai-prompt",
    "section": "context",
    "src": "https://upload.wikimedia.org/wikipedia/commons/5/58/Engenharia_de_contexto.svg",
    "width": 1280,
    "height": 920,
    "maxWidth": 660,
    "alt": "مخطط برتغالي يبين عناصر السياق ومنها التعليمات والمخرجات المنظمة",
    "caption": "يعرض الرسم عناصر تُستخدم عند تجهيز سياق النماذج اللغوية، ومنها التعليمات وصيغة المخرج.",
    "credit": "Rodrigo Padula، استنادًا إلى عمل BelgianWeditor",
    "source": "https://commons.wikimedia.org/wiki/File:Engenharia_de_contexto.svg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "few-shot-prompting-in-arabic",
    "section": "limits",
    "src": "https://upload.wikimedia.org/wikipedia/commons/0/04/Prompting_LLMs_to_respond_with_quotes_directly_from_pre-training_data_%28Figure_1_from_Weller_et_al._2023%29.png",
    "width": 2048,
    "height": 2470,
    "maxWidth": 580,
    "alt": "شكل من دراسة ويلر يعرض أثر صياغة الطلب في إجابات تحاول الاقتباس من مصادر",
    "caption": "يعرض الشكل تجربة منفصلة عن تصنيف الرسائل، ويبين إحدى طرق دراسة أثر التعليمات على مخرجات نموذج اللغة.",
    "credit": "Orion Weller, Marc Marone, Nathaniel Weir, Dawn Lawrie, Daniel Khashabi وBenjamin Van Durme",
    "source": "https://commons.wikimedia.org/wiki/File:Prompting_LLMs_to_respond_with_quotes_directly_from_pre-training_data_(Figure_1_from_Weller_et_al._2023).png",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "slug": "chain-of-thought-prompting",
    "section": "limits",
    "src": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Problem-Solving.svg",
    "width": 809,
    "height": 559,
    "maxWidth": 700,
    "alt": "مخطط يتتبع مراحل حل مشكلة وتقييم الحل",
    "caption": "رسم لخطوات حل المشكلة يوضح موضع المراجعة بعد اقتراح حل.",
    "credit": "KEBman",
    "source": "https://commons.wikimedia.org/wiki/File:Problem-Solving.svg",
    "license": "ملكية عامة",
    "licenseUrl": "https://commons.wikimedia.org/wiki/File:Problem-Solving.svg#Licensing"
  },
  {
    "slug": "prompt-table-or-json",
    "section": "json",
    "src": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Example_json_code.png",
    "width": 1822,
    "height": 1045,
    "maxWidth": 750,
    "alt": "صورة لمثال تعرض مفاتيح وقيمًا في بنية JSON",
    "caption": "يوضح الشكل كيف تظهر المفاتيح والقيم في بنية JSON. الصورة مقتطعة من عمل يقارن بين JSON وXML.",
    "credit": "Dcbmariano؛ اقتصاص Very Polite Person",
    "source": "https://commons.wikimedia.org/wiki/File:Example_json_code.png",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "slug": "ai-system-prompts-for-business",
    "section": "security",
    "src": "https://upload.wikimedia.org/wikipedia/commons/9/91/Prompt_injection.svg",
    "width": 2068,
    "height": 864,
    "maxWidth": 770,
    "alt": "مخطط يوضح اختلاط تعليمات التطبيق مع تعليمات داخل مدخل يعالجه نموذج اللغة",
    "caption": "يوضح الرسم مشكلة حقن الأوامر عندما يتضمن المدخل تعليمات تؤثر في التنفيذ.",
    "credit": "Gknor",
    "source": "https://commons.wikimedia.org/wiki/File:Prompt_injection.svg",
    "license": "ملكية عامة (CC0)",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "prompt-engineering-mistakes",
    "section": "verify",
    "src": "https://upload.wikimedia.org/wikipedia/commons/0/0b/PDCA-Loop.png",
    "width": 450,
    "height": 450,
    "maxWidth": 470,
    "alt": "رسم دائري يربط التخطيط والتنفيذ والفحص وتعديل الخطة",
    "caption": "توضح الدورة كيف يقود فحص نتيجة التجربة إلى تعديل جديد.",
    "credit": "Christoph Roser at AllAboutLean.com",
    "source": "https://commons.wikimedia.org/wiki/File:PDCA-Loop.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "arabic-vs-english-ai-prompts",
    "section": "question",
    "src": "https://upload.wikimedia.org/wikipedia/commons/7/78/Grand_Circus_Park_English_and_Arabic_sign.jpg",
    "width": 2048,
    "height": 1356,
    "maxWidth": 690,
    "alt": "لافتة تعرض معلومات بالعربية والإنجليزية",
    "caption": "تعرض اللافتة نصًا بلغتين. وفي اختبار لغة الأمر نحرص على نقل المطلوب نفسه عند تغيير لغة التعليمات.",
    "credit": "Boots in the Oven",
    "source": "https://commons.wikimedia.org/wiki/File:Grand_Circus_Park_English_and_Arabic_sign.jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/"
  },
  {
    "slug": "formal-email-prompt",
    "section": "verify",
    "src": "https://upload.wikimedia.org/wikipedia/commons/5/56/Anatomy_of_an_Email_message.JPG",
    "width": 731,
    "height": 544,
    "maxWidth": 700,
    "alt": "مخطط لأجزاء رسالة بريد إلكتروني يتضمن الترويسة والمتن",
    "caption": "صورة لعناصر رسالة البريد الإلكتروني تساعد على التمييز بين العنوان ومحتوى الرسالة.",
    "credit": "Chedni",
    "source": "https://commons.wikimedia.org/wiki/File:Anatomy_of_an_Email_message.JPG",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "long-report-summary-prompt",
    "section": "long",
    "src": "https://upload.wikimedia.org/wikipedia/commons/d/d3/An%C3%A1lisis_Documental.svg",
    "width": 1031,
    "height": 662,
    "maxWidth": 760,
    "alt": "مخطط باللغة الإسبانية لتحليل المستندات واستخلاص مواد منها",
    "caption": "يوضح الرسم مراحل تحليل الوثائق في سياق عام. يستخدم المثال هنا معالجة كل قسم ثم دمج نتائجه.",
    "credit": "JescuderoBUS",
    "source": "https://commons.wikimedia.org/wiki/File:An%C3%A1lisis_Documental.svg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "meeting-minutes-prompt",
    "section": "check",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/Business_professional_engages_in_note-taking_during_a_meeting_at_a_modern_office_desk.jpg/1280px-Business_professional_engages_in_note-taking_during_a_meeting_at_a_modern_office_desk.jpg",
    "width": 1280,
    "height": 854,
    "maxWidth": 720,
    "alt": "شخص يدوّن ملاحظات بالقلم قرب حاسوب مفتوح",
    "caption": "ملاحظات الاجتماع مادة تُراجع عند تحويل النقاش إلى قرارات وتكليفات.",
    "credit": "Shixart1985",
    "source": "https://commons.wikimedia.org/wiki/File:Business_professional_engages_in_note-taking_during_a_meeting_at_a_modern_office_desk.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    "slug": "competitor-analysis-prompt",
    "section": "review",
    "src": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Comparison_table_different_services.png",
    "width": 1280,
    "height": 720,
    "maxWidth": 740,
    "alt": "جدول بصري يقارن خيارات مختلفة وفق أعمدة مشتركة",
    "caption": "مصفوفة مقارنة لخيار تجاري مختلف توضح وضع المعايير نفسها أمام كل خيار.",
    "credit": "Everscale",
    "source": "https://commons.wikimedia.org/wiki/File:Comparison_table_different_services.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "facebook-ad-copy-prompt",
    "section": "review",
    "src": "https://upload.wikimedia.org/wikipedia/commons/d/d3/Newcomer_experience_marketing_pilot_-_Facebook_ad_example.jpg",
    "width": 426,
    "height": 441,
    "maxWidth": 465,
    "alt": "لقطة لإعلان في فيسبوك يجمع كتابة وصورة ضمن تجربة ويكيميديا عام 2022",
    "caption": "إعلان تجريبي لويكيميديا من عام 2022 يوضح اجتماع نص الإعلان والصورة في موضع عرض واحد.",
    "credit": "Wikimedia Foundation، والصورة الداخلية anibal amaro",
    "source": "https://commons.wikimedia.org/wiki/File:Newcomer_experience_marketing_pilot_-_Facebook_ad_example.jpg",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/"
  },
  {
    "slug": "linkedin-post-prompt",
    "section": "example",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Writing_notes_while_using_a_laptop_at_a_desk.jpg/960px-Writing_notes_while_using_a_laptop_at_a_desk.jpg",
    "width": 960,
    "height": 640,
    "maxWidth": 720,
    "alt": "يد تكتب ملاحظات في دفتر بجانب حاسوب محمول على مكتب خشبي",
    "caption": "يمكن البدء بملاحظات من العمل قبل ترتيبها في منشور.",
    "credit": "Nenad Stojković (Shixart1985)",
    "source": "https://commons.wikimedia.org/wiki/File:Writing_notes_while_using_a_laptop_at_a_desk.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    "slug": "monthly-marketing-plan-prompt",
    "section": "example",
    "src": "https://upload.wikimedia.org/wikipedia/commons/c/c0/Monthly-planners-printable-planners.jpg",
    "width": 1117,
    "height": 709,
    "maxWidth": 720,
    "alt": "تقويم شهري فيه خانات للأيام ومساحة للملاحظات",
    "caption": "تقويم شهري يساعد في توزيع تواريخ الإطلاق والمتابعة؛ وتُسجّل التفاصيل في خطة العمل.",
    "credit": "Mervin Simpao",
    "source": "https://commons.wikimedia.org/wiki/File:Monthly-planners-printable-planners.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "company-policy-prompt",
    "section": "example",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Collection_of_colorful_binders_on_a_shelf_for_storing_documents_in_an_office_setting.jpg/960px-Collection_of_colorful_binders_on_a_shelf_for_storing_documents_in_an_office_setting.jpg",
    "width": 960,
    "height": 641,
    "maxWidth": 720,
    "alt": "حافظات برتقالية وخضراء تحمل ملصقات تعريف على رف مكتبي",
    "caption": "تمييز الملفات بملصقات يساعد على العثور عليها. وفي المجلد المشترك تؤدي التسمية المتسقة وظيفة مشابهة.",
    "credit": "Nenad Stojković (Shixart1985)",
    "source": "https://commons.wikimedia.org/wiki/File:Collection_of_colorful_binders_on_a_shelf_for_storing_documents_in_an_office_setting.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    "slug": "customer-feedback-analysis-prompt",
    "section": "group",
    "src": "https://upload.wikimedia.org/wikipedia/commons/6/66/WMFUI-Affinity_horiz.jpg",
    "width": 2304,
    "height": 1116,
    "maxWidth": 760,
    "alt": "ملاحظات ورقية ملونة مرتبة في مجموعات على جدار",
    "caption": "تجميع ورقي من مبادرة قابلية الاستخدام في ويكيميديا. يساعد وضع الملاحظات المتشابهة معًا على اقتراح موضوعات للمراجعة.",
    "credit": "Parul Vora",
    "source": "https://commons.wikimedia.org/wiki/File:WMFUI-Affinity_horiz.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "initial-contract-review-prompt",
    "section": "check",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Legal_Contract_%26_Signature_-_Warm_Tones.jpg/960px-Legal_Contract_%26_Signature_-_Warm_Tones.jpg",
    "width": 960,
    "height": 720,
    "maxWidth": 720,
    "alt": "قلم موضوع فوق أوراق اتفاق مطبوعة",
    "caption": "مراجعة النص تشمل التحقق من الإحالات والملاحق قبل اتخاذ القرار.",
    "credit": "Blogtrepreneur",
    "source": "https://howtostartablogonline.net/legal/",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    "slug": "teacher-lesson-and-assessment-prompt",
    "section": "example",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/30/PieChartFractionBreakFourths.svg/960px-PieChartFractionBreakFourths.svg.png",
    "width": 960,
    "height": 480,
    "maxWidth": 760,
    "alt": "رسم يوضح تقسيم دائرة إلى أربعة أرباع منفصلة",
    "caption": "يمكن توظيف تقسيم الدائرة في سؤال يطلب تفسير معنى الربع وتساوي الأجزاء.",
    "credit": "Ezra Katz",
    "source": "https://commons.wikimedia.org/wiki/File:PieChartFractionBreakFourths.svg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "project-management-prompts",
    "section": "plan",
    "src": "https://upload.wikimedia.org/wikipedia/commons/8/87/Gantt_Graph.png",
    "width": 1024,
    "height": 768,
    "maxWidth": 760,
    "alt": "مخطط زمني بأشرطة ملونة موزعة على صفوف بين عامي 2024 و2025",
    "caption": "مثال على عرض مدد مختلفة بأشرطة أفقية. عند تطبيقه على المشروع، تُربط الأشرطة بأنشطته واعتمادياته.",
    "credit": "Bare Knuckles HC",
    "source": "https://commons.wikimedia.org/wiki/File:Gantt_Graph.png",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "recruitment-and-interview-prompts",
    "section": "questions",
    "src": "https://upload.wikimedia.org/wikipedia/commons/9/91/Job_interview.jpg",
    "width": 1500,
    "height": 1000,
    "maxWidth": 760,
    "alt": "ثلاثة أشخاص يجلسون حول طاولة ويُراجع أحدهم أوراقًا مطبوعة",
    "caption": "تساعد الأسئلة المرتبطة بمهام الدور في توجيه الحديث إلى أمثلة يمكن للفريق مراجعتها.",
    "credit": "Alan Cleaver",
    "source": "https://commons.wikimedia.org/wiki/File:Job_interview.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    "slug": "short-video-script-prompt",
    "section": "template",
    "src": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Storyboard_example.jpg",
    "width": 600,
    "height": 497,
    "maxWidth": 650,
    "alt": "لوحة قصة أحادية اللون تضم ست عشرة لقطة مرتبة في شبكة",
    "caption": "تساعد لوحة القصة على تحويل التسلسل المكتوب إلى تصور يمكن مناقشته قبل التصوير.",
    "credit": "Rodrigo Ferrusca",
    "source": "https://commons.wikimedia.org/wiki/File:Storyboard_example.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "cv-improvement-prompt",
    "section": "format",
    "src": "https://upload.wikimedia.org/wikipedia/commons/5/53/CV_example_with_centered_title.png",
    "width": 1231,
    "height": 633,
    "maxWidth": 800,
    "alt": "مثال لتنسيق سيرة ذاتية بعنوان في منتصف الصفحة",
    "caption": "مثال بصري لترتيب عنوان السيرة وأقسامها. يُراجع التنسيق وفق البيانات الفعلية وتعليمات جهة التقديم.",
    "credit": "Johannes Bo",
    "source": "https://commons.wikimedia.org/wiki/File:CV_example_with_centered_title.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "learn-a-new-skill-prompt",
    "section": "example",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Working_on_a_planning_session_with_stationery_items%2C_notebook%2C_and_colorful_pencils_on_a_wooden_desk.jpg/960px-Working_on_a_planning_session_with_stationery_items%2C_notebook%2C_and_colorful_pencils_on_a_wooden_desk.jpg",
    "width": 960,
    "height": 641,
    "maxWidth": 760,
    "alt": "دفتر تخطيط مفتوح على مكتب بجانب أقلام ملونة ونظارة",
    "caption": "يمكن استخدام سجل للجلسات لتدوين المحاولات والأخطاء وما يحتاج إلى مراجعة.",
    "credit": "Nenad Stojković (Shixart1985)",
    "source": "https://commons.wikimedia.org/wiki/File:Working_on_a_planning_session_with_stationery_items%2C_notebook%2C_and_colorful_pencils_on_a_wooden_desk.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    "slug": "product-image-generation-prompt",
    "section": "example",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/White_cup_filled_with_coffee.jpg/960px-White_cup_filled_with_coffee.jpg",
    "width": 960,
    "height": 720,
    "maxWidth": 720,
    "alt": "فنجان أبيض مملوء بالقهوة فوق طبق أبيض على سطح رمادي",
    "caption": "صورة فوتوغرافية توضح تفاصيل يمكن مراجعتها في فنجان وطبق، مثل الحافة والمقبض ونسبة الحجم بين القطعتين.",
    "credit": "Douglas P Perkins",
    "source": "https://commons.wikimedia.org/wiki/File:White_cup_filled_with_coffee.jpg",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0/"
  },
  {
    "slug": "shared-team-prompt-library",
    "section": "card",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Card_catalog.jpg/960px-Card_catalog.jpg",
    "width": 960,
    "height": 720,
    "maxWidth": 760,
    "alt": "أدراج فهرسة مفتوحة تضم صناديق وبطاقات معنونة على سطح خشبي",
    "caption": "فهرس بطاقات معروض في Stony Island Arts Bank. توضح الصورة فكرة تنظيم مدخلات يمكن العثور عليها؛ وليست واجهة لمكتبة أوامر رقمية.",
    "credit": "Grings1",
    "source": "https://commons.wikimedia.org/wiki/File:Card_catalog.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "create-custom-ai-assistant",
    "section": "instructions",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Writing_notes_while_using_a_laptop_at_a_desk.jpg/960px-Writing_notes_while_using_a_laptop_at_a_desk.jpg",
    "width": 960,
    "height": 640,
    "maxWidth": 760,
    "alt": "شخص يكتب ملاحظات في دفتر بجانب حاسوب محمول على مكتب",
    "caption": "تدوين المهمة ومعايير المراجعة يساعد على تجهيز التعليمات قبل إدخالها في الأداة. صورة توضيحية وليست لقطة لواجهة أي منتج.",
    "credit": "Nenad Stojković (Shixart1985)",
    "source": "https://commons.wikimedia.org/wiki/File:Writing_notes_while_using_a_laptop_at_a_desk.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    "slug": "notebooklm-source-research-summary",
    "section": "sources",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Stack_of_papers.svg/960px-Stack_of_papers.svg.png",
    "width": 960,
    "height": 564,
    "maxWidth": 640,
    "alt": "رسم لحزمة أوراق متراكبة بحواف غير متساوية",
    "caption": "رسم توضيحي لمجموعة أوراق. تنظيم المراجع وتسميتها يسهّل تتبع المعلومة عند مقارنة الملخص بالأصل.",
    "credit": "Glitch (video game)",
    "source": "https://commons.wikimedia.org/wiki/File:Stack_of_papers.svg",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "perplexity-professional-research",
    "section": "review",
    "src": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Magnifying_glass_on_the_page_of_a_book.jpg",
    "width": 640,
    "height": 480,
    "maxWidth": 640,
    "alt": "عدسة مكبرة فوق نص في صفحة كتاب ومقبضها يمتد إلى اليمين",
    "caption": "مراجعة العبارة الأصلية وسياقها جزء من التحقق من الخلاصة. صورة توضيحية وليست لقطة لواجهة Perplexity.",
    "credit": "Karbyn",
    "source": "https://commons.wikimedia.org/wiki/File:Magnifying_glass_on_the_page_of_a_book.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "create-agent-with-copilot-studio",
    "section": "test",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/LampFlowchart.svg/500px-LampFlowchart.svg.png",
    "width": 500,
    "height": 682,
    "maxWidth": 500,
    "alt": "مخطط انسيابي بالإنجليزية يربط أسئلة عن مصباح بفروع نعم ولا ونتائج مختلفة",
    "caption": "مثال لمخطط قرار يوضح تفرع الخطوات وفق الإجابة. يفيد هذا المبدأ عند فحص مسارات الحوار، والصورة لا تمثل واجهة Copilot Studio.",
    "credit": "Booyabazooka، عن الأصل من Wapcaplet",
    "source": "https://commons.wikimedia.org/wiki/File:LampFlowchart.svg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "google-ai-studio-beginners",
    "section": "prompt",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/Keyboard_close-up.jpg/960px-Keyboard_close-up.jpg",
    "width": 960,
    "height": 720,
    "maxWidth": 720,
    "alt": "لقطة قريبة لمفاتيح لوحة حاسوب",
    "caption": "كتابة طلب واضح وحالات اختبار قصيرة هي بداية التجربة. صورة توضيحية للوحة مفاتيح، وليست لقطة لواجهة Google AI Studio.",
    "credit": "Jiafei Slay Queen",
    "source": "https://commons.wikimedia.org/wiki/File:Keyboard_close-up.jpg",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "arabic-audio-transcription-tools",
    "section": "test",
    "src": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Audio_Waveform_and_Close-up.jpg",
    "width": 911,
    "height": 667,
    "maxWidth": 760,
    "alt": "شكل موجة صوتية كاملة في الأعلى وتكبير لجزء منها في الأسفل",
    "caption": "تساعد العودة إلى موضع محدد من التسجيل على مراجعة كلمة أو حد فاصل بين متحدثين. صورة توضيحية لموجة صوتية، وليست نتيجة اختبار لأداة تفريغ.",
    "credit": "Ktmartin",
    "source": "https://commons.wikimedia.org/wiki/File:Audio_Waveform_and_Close-up.jpg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "slug": "ai-translation-to-arabic",
    "section": "terms",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Sign_of_Tunis%2C_Tunisia.jpg/960px-Sign_of_Tunis%2C_Tunisia.jpg",
    "width": 960,
    "height": 720,
    "maxWidth": 760,
    "alt": "لافتة طريق تحمل اسم تونس بالعربية وبالحروف اللاتينية",
    "caption": "كتابة اسم المكان بالعربية وبالحروف اللاتينية تذكر بأهمية تثبيت الأسماء في الترجمة. صورة توضيحية، وليست نتيجة من أداة ترجمة.",
    "credit": "Rusty Clark",
    "source": "https://commons.wikimedia.org/wiki/File:Sign_of_Tunis,_Tunisia.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    "slug": "arabic-ai-content-writing-tools",
    "section": "review",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/English_proofreading_marks_example_%28ISO_5776%29.svg/960px-English_proofreading_marks_example_%28ISO_5776%29.svg.png",
    "width": 960,
    "height": 443,
    "maxWidth": 900,
    "alt": "أمثلة إنجليزية لعلامات تصحيح وإضافة وحذف في نص",
    "caption": "تحديد موضع التعديل ونوعه يجعل المراجعة قابلة للمتابعة. أمثلة لعلامات تدقيق نص إنجليزي، وليست واجهة لأداة ذكاء اصطناعي أو قواعد خاصة بالعربية.",
    "credit": "Isochrone",
    "source": "https://commons.wikimedia.org/wiki/File:English_proofreading_marks_example_(ISO_5776).svg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "ai-presentation-tools",
    "section": "brief",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Mastering_Tool_Documentation_Building_User-Friendly_Guides_for_Wikimedia_Tools.pdf/page1-960px-Mastering_Tool_Documentation_Building_User-Friendly_Guides_for_Wikimedia_Tools.pdf.jpg",
    "width": 960,
    "height": 540,
    "maxWidth": 900,
    "alt": "شريحة افتتاحية بعنوان بناء أدلة سهلة الاستخدام لأدوات ويكيميديا، مع زخرفة هندسية وشعارات ويكي إندابا",
    "caption": "مثال حقيقي لشريحة افتتاحية تبرز عنوان العرض وأسماء مقدميه. من عرض توثيق أدوات ويكيميديا في ويكي إندابا 2023؛ لا تمثل مخرجات أداة ذكاء اصطناعي. يتضمن الأصل شعارات أصحابها.",
    "credit": "Joris Darlington Quarshie؛ تظهر في الشريحة أيضًا AfiMaame ضمن مقدمي العرض",
    "source": "https://commons.wikimedia.org/wiki/File:Mastering_Tool_Documentation_Building_User-Friendly_Guides_for_Wikimedia_Tools.pdf",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "ai-logo-brand-identity-tools",
    "section": "consistency",
    "src": "https://upload.wikimedia.org/wikipedia/commons/d/db/CMYK-color_model.png",
    "width": 800,
    "height": 726,
    "maxWidth": 600,
    "alt": "ثلاث دوائر سماوية وأرجوانية وصفراء متداخلة تنتج مناطق زرقاء وخضراء وحمراء ومركزًا أسود",
    "caption": "رسم تعليمي لتداخل الألوان الطرحية يساعد على مناقشة تجهيز الهوية للطباعة. لا يمثل عينة مطبوعة أو مواصفة لمطابقة لون علامة معينة.",
    "credit": "Jipre، مع نسخة لاحقة رفعها Pandakekok9",
    "source": "https://commons.wikimedia.org/wiki/File:CMYK-color_model.png",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "ai-photo-editing-background-removal",
    "section": "alpha",
    "src": "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",
    "width": 800,
    "height": 600,
    "maxWidth": 800,
    "alt": "أربعة أحجار نرد ملونة ذات أسطح شبه شفافة توضح شفافية صورة PNG",
    "caption": "صورة مولدة بتقنية تتبع الأشعة لتوضيح شفافية PNG؛ ليست مثالًا لنتيجة إزالة خلفية بأداة من المقارنة. تعرض كما في الأصل دون تعديل.",
    "credit": "Daniel G. وEd g2s وCyberShadow، مع تحسين ضغط لاحق من مساهمي كومنز",
    "source": "https://commons.wikimedia.org/wiki/File:PNG_transparency_demonstration_1.png",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "arabic-ai-dubbing-voice-cloning",
    "section": "arabic",
    "src": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Audio_Waveform_and_Close-up.jpg",
    "width": 911,
    "height": 667,
    "maxWidth": 760,
    "alt": "شكل موجة صوتية كاملة في الأعلى وتكبير لجزء منها في الأسفل",
    "caption": "موجة صوتية مع تكبير جزء منها لتوضيح الرجوع إلى مقطع أثناء مراجعة التوقيت. لا تكشف الصورة جودة العربية أو هوية الصوت، وليست نتيجة دبلجة لأي أداة. دون تعديل.",
    "credit": "Ktmartin",
    "source": "https://commons.wikimedia.org/wiki/File:Audio_Waveform_and_Close-up.jpg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "slug": "ai-avatar-virtual-presenter-tools",
    "section": "image",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Unplugged_real-time_animated_short.png/960px-Unplugged_real-time_animated_short.png",
    "width": 960,
    "height": 581,
    "maxWidth": 900,
    "alt": "شخصية فضائية مرسومة ثلاثية الأبعاد بوجه معبّر وعينين زرقاوين ودرع أحمر في لقطة مقربة",
    "caption": "لقطة من «Unplugged» لتحريك وجه شخصية رقمية باستخدام التقاط الحركة. مثال توضيحي من 2013، وليس مخرجًا من الأدوات المقارنة أو اختبارًا لها. الصورة دون تعديل.",
    "credit": "Mixamo",
    "source": "https://commons.wikimedia.org/wiki/File:Unplugged_real-time_animated_short.png",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "ai-youtube-video-summary-tools",
    "section": "captions",
    "src": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Subtitle-Example.png",
    "width": 800,
    "height": 600,
    "maxWidth": 800,
    "alt": "رسم شخصين رماديين مع حوار إنجليزي أصفر: دعني أساعدك، وشكرًا لك",
    "caption": "مثال مرسوم للنص المصاحب للحوار؛ يساعد على تمييز الكلمات المكتوبة عن تفاصيل المشهد. ليس واجهة يوتيوب أو نتيجة تلخيص أداة، والنص في الأصل إنجليزي. دون تعديل.",
    "credit": "Henrique (Ikescs)",
    "source": "https://commons.wikimedia.org/wiki/File:Subtitle-Example.png",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "ai-coding-tools-copilot-cursor-claude-code",
    "section": "review",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/File_diff.svg/960px-File_diff.svg.png",
    "width": 960,
    "height": 483,
    "maxWidth": 900,
    "alt": "مقارنة نصية بين نسخة قديمة وأخرى جديدة، مع كلمات محذوفة بالأحمر ومضافة بالأخضر",
    "caption": "مقارنة نصية توضح مراجعة المحذوف والمضاف بين نسختين. ليست واجهة Copilot أو Cursor أو Claude Code ولا نتيجة تجربة لها. الصورة دون تعديل.",
    "credit": "Retraza، مشتق من عمل User:X! ‏(Nubio Diff Screenshot3)",
    "source": "https://commons.wikimedia.org/wiki/File:File_diff.svg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "ai-website-builder-tools",
    "section": "arabic",
    "src": "https://upload.wikimedia.org/wikipedia/commons/1/1f/Responsive-web-design-devices.jpg",
    "width": 1200,
    "height": 630,
    "maxWidth": 1000,
    "alt": "رسم شاشات حاسوب مكتبي وحاسوب صغير وجهاز لوحي وهاتف بأحجام مختلفة",
    "caption": "أحجام شاشات مختلفة لتوضيح الحاجة إلى فحص تصميم الموقع عبر الأجهزة. رسم توضيحي، وليس نتيجة اختبار موقع أنشأته الأدوات المقارنة. دون تعديل.",
    "credit": "Muhammad Rafizeldi (MRafizeldi)",
    "source": "https://commons.wikimedia.org/wiki/File:Responsive-web-design-devices.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "ai-data-analysis-tools",
    "section": "charts",
    "src": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Julia-anscombe-plot-1.png",
    "width": 600,
    "height": 400,
    "maxWidth": 800,
    "alt": "أربعة رسوم تشتت بنقاط زرقاء وخطوط حمراء، تختلف أنماطها رغم تقارب ملخصاتها الإحصائية",
    "caption": "رباعية أنسكومب: مراجعة شكل البيانات تكشف ما لا يكفي الملخص الرقمي لإظهاره. رسم لمجموعات بيانات معروفة، وليس ناتج اختبار للأدوات المقارنة أو بيانات طلبات الدعم التعليمية. دون تعديل.",
    "credit": "Cormullion",
    "source": "https://commons.wikimedia.org/wiki/File:Julia-anscombe-plot-1.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "ai-smart-note-taking-tools",
    "section": "structure",
    "src": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Cornell_note_system.jpg",
    "width": 1668,
    "height": 2157,
    "maxWidth": 520,
    "alt": "قالب كورنيل بعمود ضيق للتلميحات والأسئلة وعمود أوسع للملاحظات ومساحة ملخص في الأسفل، بعناوين إنجليزية",
    "caption": "تقسيم الصفحة إلى ملاحظات وأسئلة وملخص يساعد على فصل أنواع المحتوى عند المراجعة. قالب توضيحي، وليس واجهة Notion أو OneNote أو نتيجة اختبار لهما. النص في الأصل إنجليزي والصورة دون تعديل.",
    "credit": "WikiLinuz",
    "source": "https://commons.wikimedia.org/wiki/File:Cornell_note_system.jpg",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "ai-scheduling-personal-assistants",
    "section": "example",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Schedule_gantt.png/1280px-Schedule_gantt.png",
    "width": 1280,
    "height": 640,
    "maxWidth": 900,
    "alt": "مخطط جانت لآلات من M1 إلى M4 بأشرطة زرقاء وبرتقالية وخضراء على محور الزمن",
    "caption": "توضح الأشرطة امتداد الأعمال والفجوات بينها. الصورة لجدولة صناعية؛ ليست واجهة Reclaim أو Motion ولا نتيجة المثال الافتراضي. دون تعديل للمحتوى، مع عرضها بحجم أصغر.",
    "credit": "Larissa255",
    "source": "https://commons.wikimedia.org/wiki/File:Schedule_gantt.png",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "ai-academic-research-tools",
    "section": "flow",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/PRISMA_2020_flow_diagram_for_new_systematic_reviews_with_databases%2C_registers_and_other_sources.svg/1280px-PRISMA_2020_flow_diagram_for_new_systematic_reviews_with_databases%2C_registers_and_other_sources.svg.png",
    "width": 1280,
    "height": 929,
    "maxWidth": 1000,
    "alt": "مخطط PRISMA 2020 فارغ بمسارين للمصادر ومربعات للفرز واسترجاع النصوص والاستبعاد والإدراج",
    "caption": "قالب فارغ يوضح انتقال السجلات والنصوص وأسباب خروجها. الحقول غير معبأة؛ ليست أرقام التمرين ولا نتيجة أداة. إعادة رسم للقالب، تُعرض هنا دون تعديل للمحتوى.",
    "credit": "Derek Jansen، Grad Coach، عن قالب Page MJ وMcKenzie JE وBossuyt PM وآخرين",
    "source": "https://commons.wikimedia.org/wiki/File:PRISMA_2020_flow_diagram_for_new_systematic_reviews_with_databases,_registers_and_other_sources.svg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "slug": "ai-text-detection-tools-reliability",
    "section": "metrics",
    "src": "https://upload.wikimedia.org/wikipedia/commons/6/6f/ConfusionMatrix.png",
    "width": 623,
    "height": 382,
    "maxWidth": 623,
    "alt": "مصفوفة التباس من أربع خلايا تقارن التوقع في الصفوف بالحقيقة في الأعمدة برموز TP وFP وFN وTN",
    "caption": "مخطط عام بلا أعداد يميز الإصابة الصحيحة والإنذار الخاطئ والفوات والاستبعاد الصحيح. نعرّف الإيجابي في مثال المقال بأنه نص مولد؛ ليست الصورة نتيجة Turnitin أو Copyleaks. دون تعديل.",
    "credit": "Jackverr",
    "source": "https://commons.wikimedia.org/wiki/File:ConfusionMatrix.png",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "free-ai-tools-for-business",
    "section": "sample",
    "src": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Basic-kanban-board.png",
    "width": 900,
    "height": 271,
    "maxWidth": 900,
    "alt": "لوحة كانبان بثلاثة أعمدة للمهام المطلوبة والجارية والمنجزة وبطاقات ملونة",
    "caption": "توضح اللوحة فصل حالات العمل. في المثال تبقى المسودة قيد المراجعة إلى أن تطابق بطاقة الوقائع ثم تنتقل إلى التسليم؛ الصورة لا تعرض حسابات الأدوات المقارنة أو نتيجة تجربتها. دون تعديل.",
    "credit": "Bossarro",
    "source": "https://commons.wikimedia.org/wiki/File:Basic-kanban-board.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "chatgpt-free-vs-plus",
    "section": "value",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Break-even-point_vector.svg/960px-Break-even-point_vector.svg.png",
    "width": 960,
    "height": 514,
    "maxWidth": 850,
    "alt": "رسم تعادل بمحور للوحدات وخط أخضر للإيرادات وخط أحمر للتكاليف يتقاطعان عند نقطة واحدة",
    "caption": "رسم عام للإيرادات والتكاليف بعناوين هولندية. نستخدم فكرة التعادل لتفسير مقارنة قيمة الوقت بالاشتراك؛ لا يعرض أسعار ChatGPT أو بيانات أداء ولا يطابق أرقام المثال. دون تعديل.",
    "credit": "Empro2، مع مساهمات Ahellwig وJurgenNL",
    "source": "https://commons.wikimedia.org/wiki/File:Break-even-point_vector.svg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "chatgpt-claude-gemini-privacy-settings",
    "section": "example",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Data_lifecycle.svg/960px-Data_lifecycle.svg.png",
    "width": 960,
    "height": 371,
    "maxWidth": 960,
    "alt": "مخطط دورة بيانات يبدأ بالجمع ثم التحليل والتصور وينتهي بمسارات للمشاركة والأرشفة والإتلاف",
    "caption": "يفصل الرسم التخزين والعمل والمشاركة والأرشفة والإتلاف؛ تغيير استخدام البيانات لا يساوي حذفها. الرسم لدورة بيانات بحثية، وليس لخوادم الأدوات الثلاث أو لقطة إعدادات. دون تعديل.",
    "credit": "Thomas Shafee؛ أيقونات Clément Payot وBen Davis وAdrien Coquet وProSymbols وDeemak Daksina وSumit Saengthong عبر Noun Project",
    "source": "https://commons.wikimedia.org/wiki/File:Data_lifecycle.svg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "slug": "ai-team-enterprise-plans",
    "section": "sample",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Role-based_access_control.svg/960px-Role-based_access_control.svg.png",
    "width": 960,
    "height": 452,
    "maxWidth": 960,
    "alt": "مخطط صلاحيات يربط المؤسسة والأدوار بالمستخدمين والأذونات والعمليات والجلسات",
    "caption": "يوضح الرسم ارتباط المستخدم بدور، وارتباط الدور بأذونات وعمليات وقيود. يستخدم لشرح فصل المسؤوليات؛ ليس خريطة أدوار ChatGPT أو Claude ولا إثباتًا لتوفر كل عنصر فيهما. دون تعديل.",
    "credit": "Babbage، استنادًا إلى رسم fuzzyBSc",
    "source": "https://commons.wikimedia.org/wiki/File:Role-based_access_control.svg",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "ai-on-whatsapp",
    "section": "sample",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Client-server_model.svg/960px-Client-server_model.svg.png",
    "width": 960,
    "height": 379,
    "maxWidth": 850,
    "alt": "مخطط بسيط بجهاز عميل وجهاز خادم وسهم للطلب وآخر للرد بينهما",
    "caption": "يوضح الرسم فكرة إرسال طلب واستقبال رد. يشرح بصورة عامة ما يدخل في المهمة التي يعالجها المساعد؛ ليس رسمًا لبنية WhatsApp أو حماية وضع معين أو لقطة محادثة منفذة. دون تعديل.",
    "credit": "Lubaochuan",
    "source": "https://commons.wikimedia.org/wiki/File:Client-server_model.svg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "ai-in-google-sheets",
    "section": "prepare",
    "src": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Pivottable-Flatdata.png",
    "width": 475,
    "height": 222,
    "maxWidth": 700,
    "alt": "جدول بيانات بأعمدة للمنطقة والنوع والصنف وتاريخ الشحن والوحدات والسعر والتكلفة",
    "caption": "أسماء الأعمدة ونطاق الصفوف يجعلان الطلب قابلًا للتحديد والمراجعة. هذه لقطة جدول قديم من Excel للتوضيح، وليست واجهة Gemini أو نتيجة تجربتنا.",
    "credit": "Wikidan829، مع نسخة لاحقة رفعها I Love Pi؛ ملكية عامة وفق صفحة الملف. دون تعديل.",
    "source": "https://commons.wikimedia.org/wiki/File:Pivottable-Flatdata.png",
    "license": "ملكية عامة",
    "licenseUrl": "https://commons.wikimedia.org/wiki/File:Pivottable-Flatdata.png#Summary"
  },
  {
    "slug": "ai-in-powerpoint",
    "section": "brief",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Storyboard_template_example.svg/960px-Storyboard_template_example.svg.png",
    "width": 960,
    "height": 742,
    "maxWidth": 760,
    "alt": "قالب تخطيط بصري فارغ بلوحتين متجاورتين، وفي كل منهما مساحات للصورة والفعل والحوار والتوقيت",
    "caption": "يساعد التخطيط قبل التوليد على فصل ما يظهر في الشريحة عما يقوله المتحدث ومدة عرضه. القالب لوحة قصة عامة، وليس لقطة PowerPoint أو مخرج Copilot.",
    "credit": "Whisternefet، CC BY-SA 3.0، دون تعديل.",
    "source": "https://commons.wikimedia.org/wiki/File:Storyboard_template_example.svg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "ai-in-canva",
    "section": "brief",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/Gestalt_proximity.svg/960px-Gestalt_proximity.svg.png",
    "width": 960,
    "height": 402,
    "maxWidth": 850,
    "alt": "مجموعتان من الدوائر الرمادية المتكررة تفصل بينهما مسافة أوسع من المسافات داخل كل مجموعة",
    "caption": "تجميع العناصر المتصلة وترك مسافة بينها وبين المجموعة التالية يساعد على تنظيم القراءة. المخطط عام، وليس لقطة Canva أو نتيجة لتوليد تصميم.",
    "credit": "Kasufcgslfguhvsne؛ تبسيط SVG: Cmglee. ملكية عامة وفق صفحة الملف، دون تعديل.",
    "source": "https://commons.wikimedia.org/wiki/File:Gestalt_proximity.svg",
    "license": "ملكية عامة",
    "licenseUrl": "https://commons.wikimedia.org/wiki/File:Gestalt_proximity.svg#Licensing"
  },
  {
    "slug": "ai-voice-mode-for-work",
    "section": "start",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/Microphone.JPG/960px-Microphone.JPG",
    "width": 960,
    "height": 720,
    "maxWidth": 850,
    "alt": "ميكروفون على حامل أمام خلفية داكنة بإضاءة زرقاء وانعكاسات حمراء وأرجوانية",
    "caption": "الميكروفون مدخل الصوت؛ يحتاج المستخدم إلى التحقق مما فُهم وإلى إنهاء الجلسة عندما تنتهي المهمة. الصورة عامة ولا تعرض واجهة مساعد أو تسجيلًا للمثال.",
    "credit": "Jan Mehlich (Lestat)، CC BY-SA 2.5، دون تعديل.",
    "source": "https://commons.wikimedia.org/wiki/File:Microphone.JPG",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5/"
  },
  {
    "slug": "ai-deep-research",
    "section": "sample",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Creative_commons_license_spectrum.svg/960px-Creative_commons_license_spectrum.svg.png",
    "width": 960,
    "height": 1553,
    "maxWidth": 450,
    "alt": "مخطط رأسي ملون يرتب صيغ المشاع الإبداعي من الملكية العامة في الأعلى إلى جميع الحقوق محفوظة في الأسفل",
    "caption": "تختلف شروط إعادة الاستخدام بين صيغ الترخيص. يستعمل المثال هذه الفروق لتوضيح ضرورة ربط كل استنتاج بنص مصدره، مع مراجعة شروط الملف نفسه.",
    "credit": "Shaddim؛ الرموز الأصلية من Creative Commons، CC BY 4.0، دون تعديل.",
    "source": "https://commons.wikimedia.org/wiki/File:Creative_commons_license_spectrum.svg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "slug": "ai-browsers-comparison",
    "section": "sample",
    "src": "https://upload.wikimedia.org/wikipedia/commons/7/72/Firefox_3_tabs.jpg",
    "width": 298,
    "height": 61,
    "maxWidth": 420,
    "alt": "تفصيل قديم لواجهة Firefox يظهر شريط العنوان وعدة تبويبات بأسماء مقتطعة",
    "caption": "تساعد معرفة التبويبات الداخلة في الطلب على مراجعة سياق المساعد. هذه لقطة تاريخية من 2008 لتوضيح الفكرة، وليست واجهة Comet أو Edge الحالية أو نتيجة اختبارهما.",
    "credit": "Deb Richardson، CC BY-SA 2.0؛ نسخة ويكيميديا دون تعديل إضافي.",
    "source": "https://www.flickr.com/photos/deb-richardson/2571842204/",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/"
  },
  {
    "slug": "ai-pdf-analysis",
    "section": "file-type",
    "src": "https://upload.wikimedia.org/wikipedia/commons/5/58/Ocr_conversion.png",
    "width": 494,
    "height": 501,
    "maxWidth": 494,
    "alt": "رسم يكبّر حروف كلمة Original المصوّرة ثم يصلها بسهم إلى حروف وقيم رقمية",
    "caption": "يوضح الرسم الانتقال من شكل الحروف في الصورة إلى تمثيل نصي؛ وهو شرح للمفهوم، وليس لقطة لتجربتنا أو قياسًا لدقة العربية. الصورة دون تعديل.",
    "credit": "AerodyneSr",
    "source": "https://commons.wikimedia.org/wiki/File:Ocr_conversion.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "ai-chart-creation",
    "section": "chart-choice",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Truncated_Bar_Graph.svg/960px-Truncated_Bar_Graph.svg.png",
    "width": 960,
    "height": 487,
    "maxWidth": 864,
    "alt": "رسم أعمدة للفئات A إلى E ومحور رأسي يبدأ عند 9100 بدل الصفر",
    "caption": "مثال تعليمي على محور أعمدة مبتور يبدأ عند 9100؛ قد يوحي فرق الأطوال بفروق نسبية أكبر مما تدل عليه القيم. صورة مستقلة عن عينة الأشهر وعن أي أداة AI، معروضة دون تعديل للمحتوى.",
    "credit": "Smallman12q",
    "source": "https://commons.wikimedia.org/wiki/File:Truncated_Bar_Graph.svg",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    "slug": "ai-chrome-extensions",
    "section": "permissions",
    "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Font_Awesome_5_solid_puzzle-piece.svg/330px-Font_Awesome_5_solid_puzzle-piece.svg.png",
    "width": 330,
    "height": 293,
    "maxWidth": 220,
    "alt": "أيقونة سوداء لقطعة أحجية ذات بروزين وتجويفين متقابلين",
    "caption": "تستخدم قطعة الأحجية رمزًا لوظيفة تضاف إلى المتصفح؛ ليست شعارًا لأحد الخيارات أو لقطة لأذوناته أو دليلًا على قدراته. الصورة دون تعديل للمحتوى.",
    "credit": "Font Awesome Free 5.2.0 by @fontawesome",
    "source": "https://commons.wikimedia.org/wiki/File:Font_Awesome_5_solid_puzzle-piece.svg",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "slug": "ai-product-descriptions",
    "section": "inputs",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Spiral_notebook_%282565673891%29.jpg/960px-Spiral_notebook_%282565673891%29.jpg",
    "width": 960,
    "height": 720,
    "maxWidth": 720,
    "alt": "لقطة قريبة لدفتر سلك تظهر حلقاته المعدنية وصفحات بيضاء مسطرة بالأزرق",
    "caption": "توضح الصورة شكل التجليد والسطور، لكنها لا تثبت مقاس A5 أو وزن الورق في مثالنا. صورة مستقلة، وليست صورة المنتج الافتراضي أو إثباتًا لمواصفاته، دون تعديل للمحتوى.",
    "credit": "frankieleon",
    "source": "https://commons.wikimedia.org/wiki/File:Spiral_notebook_(2565673891).jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    "slug": "ai-social-media-management",
    "section": "calendar",
    "src": "https://upload.wikimedia.org/wikipedia/commons/3/36/Kanban_board.png",
    "width": 930,
    "height": 300,
    "maxWidth": 930,
    "alt": "لوحة مهام تعرض بطاقات ملونة موزعة بين الإدخال والعمل الجاري والاختبار والقبول والمخرجات",
    "caption": "توضح هذه الصورة التاريخية من 2014 فكرة انتقال بطاقات العمل بين حالات. هي لوحة لمشروع برمجي، وليست واجهة Buffer الحالية أو سجل نشر حسابات لوسيل، ومعروضة دون تعديل.",
    "credit": "Garbanea",
    "source": "https://commons.wikimedia.org/wiki/File:Kanban_board.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "ai-market-research",
    "section": "workflow",
    "src": "https://upload.wikimedia.org/wikipedia/commons/7/70/The_Research_Cycle.jpg",
    "width": 612,
    "height": 792,
    "maxWidth": 500,
    "alt": "مخطط دائري بست مراحل للبحث، يبدأ بسؤال وتحديد ما نعرفه، ثم إيجاد المصادر وتحليلها وصياغة الاستنتاج وأسئلة جديدة",
    "caption": "توضح دورة البحث كيف يقود السؤال إلى مصادر واستنتاج يحتاج بدوره إلى فحص. المخطط عام، وليس نتيجة بحث سوق أو وصفًا لواجهة أداة ذكاء اصطناعي؛ معروض دون تعديل.",
    "credit": "Shonnmharen",
    "source": "https://commons.wikimedia.org/wiki/File:The_Research_Cycle.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "ai-search-engine-optimization",
    "section": "rewrite",
    "src": "https://upload.wikimedia.org/wikipedia/commons/4/4d/Search_Engine_Results_Page_%28SERP%29_Graphic_Illustration.png",
    "width": 1920,
    "height": 1080,
    "maxWidth": 900,
    "alt": "رسم لصفحة نتائج بحث فيه شريط بحث وعدسة وثلاث نتائج تمثلها شرائط عناوين زرقاء وأوصاف رمادية",
    "caption": "يوضح الرسم موضع العنوان والوصف في نتيجة بحث مبسطة. هو عمل توضيحي من 2021، وليس لقطة Google الحالية أو إثباتًا لظهور صفحة لوسيل؛ معروض دون تعديل.",
    "credit": "Muhammad Rafizeldi",
    "source": "https://commons.wikimedia.org/wiki/File:Search_Engine_Results_Page_(SERP)_Graphic_Illustration.png",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    "slug": "generative-engine-optimization",
    "section": "evidence",
    "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Hyperlinks_scheme.svg/500px-Hyperlinks_scheme.svg.png",
    "width": 500,
    "height": 350,
    "maxWidth": 500,
    "alt": "مخطط لست وثائق مترابطة بأسهم حمراء، مع وثيقة رئيسية داخل شكل برتقالي يحمل كلمة Home",
    "caption": "يوضح المخطط فكرة الانتقال بين وثائق عبر روابط. يساعد الرابط القارئ على الوصول إلى المصدر، لكنه لا يثبت أن نص المصدر يدعم كل ادعاء؛ الرسم عام وليس شبكة استشهادات فعلية للوسيل، وعُرض دون تعديل.",
    "credit": "MarsJson",
    "source": "https://commons.wikimedia.org/wiki/File:Hyperlinks_scheme.svg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "ai-email-marketing",
    "section": "review",
    "src": "https://upload.wikimedia.org/wikipedia/commons/a/af/Schema_of_e-mail_delivery.png",
    "width": 720,
    "height": 480,
    "maxWidth": 720,
    "alt": "مخطط يربط برنامج بريد المرسل وخادمه بخادم المستلم وبرنامج بريده، مع أسهم SMTP وIMAP أو POP",
    "caption": "يوضح الرسم انتقال البريد بين برنامج المرسل وخدمات الإرسال والتسليم والاسترجاع. يشرح مسارًا تقنيًا عامًا، ولا يمثل حملة المتجر أو يثبت وصول رسالة إلى البريد الوارد. عُرض دون تعديل.",
    "credit": "144p",
    "source": "https://commons.wikimedia.org/wiki/File:Schema_of_e-mail_delivery.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "ai-customer-segmentation",
    "section": "profiles",
    "src": "https://upload.wikimedia.org/wikipedia/commons/e/ea/K-means_convergence.gif",
    "width": 637,
    "height": 619,
    "maxWidth": 637,
    "alt": "رسم متحرك لنقاط ملونة وثلاثة مراكز وحدود سوداء تتغير عبر تكرارات خوارزمية K-means",
    "caption": "يعرض الرسم تغير التجميع عبر التكرارات لبيانات توضيحية مختلفة عن عملاء المثال. يذكر مؤلفه أن الحدود السوداء تُرسم بعد تحديث المراكز بينما تظل ألوان النقاط من التعيين السابق خلال الحركة؛ تتوافق عند التقارب. الألوان ليست شرائح حقيقية للوسيل. عُرض دون تعديل.",
    "credit": "Chire",
    "source": "https://commons.wikimedia.org/wiki/File:K-means_convergence.gif",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "ai-dynamic-pricing",
    "section": "review",
    "src": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Electronic_Shelf_Labels_2.jpg",
    "width": 1000,
    "height": 1068,
    "maxWidth": 650,
    "alt": "مخطط متجر برفوف زرقاء ومحطة اتصال ترسل إشارات حمراء إلى ملصقات إلكترونية بمقاسات مختلفة",
    "caption": "يوضح المخطط اتصال ملصقات الرفوف الإلكترونية بمحطة مركزية لعرض معلومات المنتجات. القدرة على تحديث الملصق تختلف عن اتخاذ قرار السعر؛ الصورة لا تثبت استخدام ذكاء اصطناعي أو تسعير ديناميكي في متجر بعينه، وليست نتيجة تطبيق لوسيل. عُرضت دون تعديل.",
    "credit": "Thienhuy17",
    "source": "https://commons.wikimedia.org/wiki/File:Electronic_Shelf_Labels_2.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    "slug": "ai-lead-scoring",
    "section": "metrics",
    "src": "https://upload.wikimedia.org/wikipedia/commons/6/6f/ConfusionMatrix.png",
    "width": 623,
    "height": 382,
    "maxWidth": 623,
    "alt": "مصفوفة زرقاء من أربع خانات تقارن التوقع في الصفوف بالنتيجة الفعلية في الأعمدة، وتحمل رموزTP وFP وFN وTN",
    "caption": "يوضح الرسم مواضع التوقع الصحيح والخطأ في تصنيف ثنائي؛ الصفوف للقيم المتوقعة والأعمدة للفعلية. يمكنك مطابقة الحالات الأربع مع جدول المثال، لكن الصورة لا تعرض بيانات عملاء أو نتائج نموذج لوسيل. عُرضت دون تعديل.",
    "credit": "Jackverr",
    "source": "https://commons.wikimedia.org/wiki/File:ConfusionMatrix.png",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    "slug": "ai-price-quotes-proposals",
    "section": "review",
    "src": "https://upload.wikimedia.org/wikipedia/commons/a/aa/Documentation_review_life_cycle.png",
    "width": 2236,
    "height": 1564,
    "maxWidth": 900,
    "alt": "مخطط دائري بأسهم يمر من إنشاء وثيقة أو تحديثها إلى طلب مراجعة فنية ثم مراجعة غير فنية وحالة تمت مراجعتها",
    "caption": "يعرض الرسم دورة مراجعة توثيق في سياق ويكيميديا، ويستخدم مهامPhabricator ومراجعتين فنية وغير فنية. نستعين به لتوضيح فصل إعداد المستند عن تدقيقه؛ ليس مخططًا خاصًا بعرض السعر ولا لقطة منHubSpot أوDynamics365 أو تجربة نفذتها لوسيل. عُرض دون تعديل.",
    "credit": "Gbadebo (Gbahdeyboh)",
    "source": "https://commons.wikimedia.org/wiki/File:Documentation_review_life_cycle.png",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
  }
];

function KnowledgeIllustrations({slug, section}: {slug: string; section: string}) {
  return knowledgeIllustrations.filter(item => item.slug === slug && item.section === section).map(item => (
    <figure className="guide-figure" data-sourced-illustration key={item.src} style={{marginBlock:24}}>
      <Image src={item.src} width={item.width} height={item.height} alt={item.alt}
        unoptimized loading="lazy" referrerPolicy="no-referrer"
        style={{display:"block", width:"100%", maxWidth:item.maxWidth, height:"auto", marginInline:"auto"}} />
      <figcaption style={{fontSize:15,lineHeight:1.7,textAlign:"center",marginTop:8}}>
        {item.caption}{" "}
        <a href={item.source} rel="noopener noreferrer" target="_blank">{item.credit} · ويكيميديا كومنز</a>
        {" · "}<a href={item.licenseUrl} rel="noopener noreferrer" target="_blank"><bdi>{item.license}</bdi></a>.
      </figcaption>
    </figure>
  ));
}

function InlineText({text}: {text: string}) {
  return parseInlineLinks(text).map((part,index) => part.kind === "text" ? part.text : <a key={index} href={part.href} style={{color:"#0d7490",textDecoration:"underline",overflowWrap:"anywhere"}}>{part.label}</a>);
}

const tableCell={padding:"12px 14px",borderBottom:"1px solid #e2e8f0",verticalAlign:"top" as const};
export default async function KnowledgeTopicPage({params}:{params:Promise<{slug:string}>}){
const {slug}=await params;const topic=getKnowledgeTopic(slug);
if(!topic || !topic.directAnswer?.trim() || !topic.sections.length)notFound();
const lab=getMathArticleLab(topic.slug);
const path="/knowledge/"+topic.slug;const url=absoluteUrl(path);
const cover=editorialImagePath("knowledge",topic.slug);
const articleSchema={"@context":"https://schema.org","@type":"Article","@id":url+"#article",headline:topic.title,description:topic.description,url,inLanguage:"ar",articleSection:topic.category,datePublished:topic.publishedAt,dateModified:topic.publishedAt,
 author:{"@type":"Organization",name:siteConfig.publisher,url:absoluteUrl("/team")},publisher:{"@type":"Organization",name:siteConfig.name,url:absoluteUrl("/")},mainEntityOfPage:{"@type":"WebPage","@id":url},image:{"@type":"ImageObject",url:absoluteUrl(cover),width:1200,height:630}};
const breadcrumbSchema={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[
 {"@type":"ListItem",position:1,name:"الرئيسية",item:absoluteUrl("/")},
 {"@type":"ListItem",position:2,name:"معارف وأدوات",item:absoluteUrl("/knowledge")},
 {"@type":"ListItem",position:3,name:topic.title,item:url}
]};
return <main id="main-content" className="shell" style={{paddingBlock:45}}>
<nav aria-label="مسار التنقل" style={{color:"#64748b",marginBottom:18}}><Link href="/knowledge">رئيسية المشروع</Link> / <Link href="/knowledge">معارف وأدوات</Link> / {topic.category}</nav>
<article style={{maxWidth:990,margin:"auto",lineHeight:1.95,color:"#14273b"}}>
<header>
<p style={{color:"#0f766e",fontWeight:700}}>{topic.category} · دليل أصلي بمصادر واضحة</p>
<h1 style={{fontSize:"clamp(29px,4vw,43px)",fontWeight:800,lineHeight:1.5,marginBlock:14}}>{topic.title}</h1>
<p style={{fontSize:18}}>{<InlineText text={topic.intro}/>}</p>
<p style={{fontSize:13,color:"#64748b",marginBlock:13}}>إعداد: فريق لوسيل · تاريخ النشر: <time dateTime={topic.publishedAt}>{topic.publishedAt}</time></p>
{isMedicalKnowledgeTopic(topic) && <p role="note" style={{background:"#fff7ed",padding:12,borderRadius:8,fontSize:14}}>هذه معلومات عامة، ولم تُوثَّق لهذا المقال مراجعة تخصصية مستقلة حتى الآن. لا تستخدمه بدل التقييم الطبي أو تعليمات الجهات الصحية الرسمية.</p>}
</header>
<EditorialCover
  title={topic.title}
  category={topic.category}
  image={topic.image}
  imageAlt={topic.imageAlt}
  imageUrl={cover}
  priority
  description="مفهوم واضح · شرح متعمق · تطبيق عملي"
/>
{lab && <MathArticleLab lab={lab} />}
<section aria-labelledby="direct-answer" style={{background:"#eff8f6",border:"1px solid #9fd5c9",borderRadius:14,padding:23}}>
<h2 id="direct-answer" style={{fontSize:24,fontWeight:800,marginBottom:9}}>الإجابة المختصرة</h2><p style={{fontSize:17}}>{<InlineText text={topic.directAnswer}/>}</p>
</section>
{topic.sections.length >= 2 ? <figure className="guide-figure" style={{marginBlock:27}}>
  <Image
    src={editorialImagePath("knowledge",topic.slug,"map")}
    alt={"خريطة مرئية لعناوين محاور " + topic.title}
    width={1200}
    height={730}
    unoptimized
    sizes="(max-width: 768px) calc(100vw - 32px), 880px"
    loading="lazy"
    style={{width:"100%",height:"auto",borderRadius:14}}
  />
  <figcaption>خريطة تحريرية تلخص محاور المقال كما وردت في أقسامه؛ ليست نتيجة تجربة أو بيانات إحصائية.</figcaption>
</figure> : null}
<nav aria-label="محتويات الدليل" style={{marginBlock:23,padding:18,border:"1px solid #e2e8f0",borderRadius:14}}>
<strong>محتويات الدليل</strong><ul style={{paddingInlineStart:22,columns:2,columnWidth:"270px",marginTop:8}}>
{topic.sections.map(s=><li key={s.id}><a href={"#"+s.id} style={{color:"#0d7490",textDecoration:"underline"}}>{s.heading}</a></li>)}
{lab && <li><a href="#math-experiment" style={{color:"#0d7490",textDecoration:"underline"}}>توقّع وجرّب على الرسم</a></li>}
{topic.tool && <li><a href="#interactive-tool" style={{color:"#0d7490",textDecoration:"underline"}}>الأداة التفاعلية</a></li>}
</ul></nav>
{topic.sections.map(section=><section key={section.id} id={section.id} style={{marginBlock:30,scrollMarginTop:35}}>
<h2 style={{fontSize:26,fontWeight:800,lineHeight:1.55,marginBottom:13}}>{section.heading}</h2>
{!section.blocks && section.paragraphs?.map((p,i)=><p key={i} style={{marginBlock:13,fontSize:17}}>{<InlineText text={p}/>}</p>)}
{section.blocks?.map((block,i)=> {
 if(block.kind === "heading") return <h3 key={i} style={{fontSize:21,fontWeight:700,marginBlock:18}}>{block.text}</h3>;
 if(block.kind === "paragraph") return <p key={i} style={{marginBlock:13,fontSize:17}}><InlineText text={block.text}/></p>;
 if(block.kind === "diagram") return <pre key={i} style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere",padding:18,background:"#f1f5f9",borderRadius:12}}>{block.text}</pre>;
 if(block.kind === "list") return <ul key={i} style={{paddingInlineStart:27}}>{block.items.map((item,j)=><li key={j}>{<InlineText text={item}/>}</li>)}</ul>;
 if(block.kind === "table") return <div key={i} style={{overflowX:"auto",marginBlock:18}}><table style={{width:"100%",minWidth:600,borderCollapse:"collapse",textAlign:"start"}}><caption>{section.heading}</caption><thead><tr>{block.headers.map((h,j)=><th key={j} scope="col" style={tableCell}>{<InlineText text={h}/>}</th>)}</tr></thead><tbody>{block.rows.map((row,j)=><tr key={j}>{row.map((cell,k)=>k===0?<th scope="row" key={k} style={tableCell}>{<InlineText text={cell}/>}</th>:<td key={k} style={tableCell}>{<InlineText text={cell}/>}</td>)}</tr>)}</tbody></table></div>;
})}
{section.points?.length ? <ul style={{paddingInlineStart:27,marginBlock:12}}>{section.points.map((point,i)=><li key={i} style={{marginBottom:8}}>{<InlineText text={point}/>}</li>)}</ul> : null}
{section.table && <div style={{overflowX:"auto",border:"1px solid #e2e8f0",borderRadius:12,marginBlock:17}}>
<table style={{width:"100%",minWidth:600,borderCollapse:"collapse",textAlign:"start"}}>
<caption style={{padding:10,color:"#475569",fontSize:13}}>{section.table.caption}</caption>
<thead><tr style={{background:"#e6f0f4"}}>{section.table.headers.map(h=><th scope="col" key={h} style={tableCell}>{<InlineText text={h}/>}</th>)}</tr></thead>
<tbody>{section.table.rows.map((row,i)=><tr key={i} style={{background:i%2?"#f8fafc":"#fff"}}>{row.map((v,j)=>j===0?<th scope="row" key={j} style={tableCell}>{<InlineText text={v}/>}</th>:<td key={j} style={tableCell}>{<InlineText text={v}/>}</td>)}</tr>)}</tbody>
</table></div>}
{section.note && <aside style={{borderRight:"4px solid #f59e0b",background:"#fffbeb",padding:18,borderRadius:7,marginTop:14}}><strong>تنبيه</strong><p>{<InlineText text={section.note}/>}</p></aside>}
<KnowledgeIllustrations slug={topic.slug} section={section.id}/>
</section>)}
{topic.tool && <KnowledgeInteractiveTool kind={topic.tool} slug={topic.slug}/>}
{topic.faq.length > 0 && <section id="frequently-asked-questions" style={{marginBlock:32}}>
<h2 style={{fontSize:26,fontWeight:800,marginBottom:15}}>أسئلة شائعة</h2>
{topic.faq.map((faq,i)=><details key={i} style={{marginBlock:10,border:"1px solid #e2e8f0",padding:16,borderRadius:10}}>
<summary style={{fontWeight:700,cursor:"pointer"}}>{faq.question}</summary><p style={{marginTop:10}}>{<InlineText text={faq.answer}/>}</p></details>)}
</section>}
<section id="sources" style={{borderTop:"1px solid #e2e8f0",paddingTop:20,marginTop:24}}>
<h2 style={{fontSize:25,fontWeight:800,marginBottom:12}}>المراجع والمصادر</h2>
<p>هذه مراجع للاطلاع، لكن لم تُفحص صلاحية جميع روابطها في جولة التدقيق الحالية. تحقق من أحدث نسخة للمصدر قبل الاعتماد على معلومة متغيرة؛ والأمثلة والأدوات التعليمية لا تُعد نتائج تجارب ميدانية فعلية.</p>
<ul style={{paddingInlineStart:24,marginTop:10}}>
{topic.sources.map(item=><li key={item.url} style={{marginBottom:7}}><a href={item.url} target="_blank" rel="noopener noreferrer" style={{color:"#0d7490",textDecoration:"underline"}}>{item.label}</a></li>)}</ul>
</section>
<section aria-label="مقالات مرتبطة" style={{marginBlock:25,padding:18,background:"#f8fafc",borderRadius:13}}>
<h2 style={{fontSize:21,fontWeight:750,marginBottom:10}}>أكمل التعلم</h2>
<ul style={{paddingInlineStart:23}}>{topic.related.map(link=><li key={link.href}><Link href={link.href} style={{color:"#0d7490",textDecoration:"underline"}}>{link.label}</Link></li>)}</ul>
<p><Link href="/knowledge">العودة إلى جميع الأدلة والأدوات</Link></p></section>
</article>
<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(articleSchema).replace(/</g,"\\u003c")}}/>
<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumbSchema).replace(/</g,"\\u003c")}}/>
</main>;
}


