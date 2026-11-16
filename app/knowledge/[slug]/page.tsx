import MathArticleLab from "@/components/math-article-lab";
import { getMathArticleLab } from "@/lib/math-article-labs";
import type { Metadata } from "next";
import Link from "next/link";
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
<p style={{fontSize:18}}>{topic.intro}</p>
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
<h2 id="direct-answer" style={{fontSize:24,fontWeight:800,marginBottom:9}}>الإجابة المختصرة</h2><p style={{fontSize:17}}>{topic.directAnswer}</p>
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
{!section.blocks && section.paragraphs?.map((p,i)=><p key={i} style={{marginBlock:13,fontSize:17}}>{p}</p>)}
{section.blocks?.map((block,i)=> {
 if(block.kind === "heading") return <h3 key={i} style={{fontSize:21,fontWeight:700,marginBlock:18}}>{block.text}</h3>;
 if(block.kind === "paragraph") return <p key={i} style={{marginBlock:13,fontSize:17}}>{block.text}</p>;
 if(block.kind === "diagram") return <pre key={i} style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere",padding:18,background:"#f1f5f9",borderRadius:12}}>{block.text}</pre>;
 if(block.kind === "list") return <ul key={i} style={{paddingInlineStart:27}}>{block.items.map((item,j)=><li key={j}>{item}</li>)}</ul>;
 if(block.kind === "table") return <div key={i} style={{overflowX:"auto",marginBlock:18}}><table style={{width:"100%",minWidth:600,borderCollapse:"collapse",textAlign:"start"}}><caption>{section.heading}</caption><thead><tr>{block.headers.map((h,j)=><th key={j} scope="col" style={tableCell}>{h}</th>)}</tr></thead><tbody>{block.rows.map((row,j)=><tr key={j}>{row.map((cell,k)=>k===0?<th scope="row" key={k} style={tableCell}>{cell}</th>:<td key={k} style={tableCell}>{cell}</td>)}</tr>)}</tbody></table></div>;
})}
{section.points?.length ? <ul style={{paddingInlineStart:27,marginBlock:12}}>{section.points.map((point,i)=><li key={i} style={{marginBottom:8}}>{point}</li>)}</ul> : null}
{section.table && <div style={{overflowX:"auto",border:"1px solid #e2e8f0",borderRadius:12,marginBlock:17}}>
<table style={{width:"100%",minWidth:600,borderCollapse:"collapse",textAlign:"start"}}>
<caption style={{padding:10,color:"#475569",fontSize:13}}>{section.table.caption}</caption>
<thead><tr style={{background:"#e6f0f4"}}>{section.table.headers.map(h=><th scope="col" key={h} style={tableCell}>{h}</th>)}</tr></thead>
<tbody>{section.table.rows.map((row,i)=><tr key={i} style={{background:i%2?"#f8fafc":"#fff"}}>{row.map((v,j)=>j===0?<th scope="row" key={j} style={tableCell}>{v}</th>:<td key={j} style={tableCell}>{v}</td>)}</tr>)}</tbody>
</table></div>}
{section.note && <aside style={{borderRight:"4px solid #f59e0b",background:"#fffbeb",padding:18,borderRadius:7,marginTop:14}}><strong>تنبيه</strong><p>{section.note}</p></aside>}
<KnowledgeIllustrations slug={topic.slug} section={section.id}/>
</section>)}
{topic.tool && <KnowledgeInteractiveTool kind={topic.tool} slug={topic.slug}/>}
<section id="frequently-asked-questions" style={{marginBlock:32}}>
<h2 style={{fontSize:26,fontWeight:800,marginBottom:15}}>أسئلة شائعة</h2>
{topic.faq.map((faq,i)=><details key={i} style={{marginBlock:10,border:"1px solid #e2e8f0",padding:16,borderRadius:10}}>
<summary style={{fontWeight:700,cursor:"pointer"}}>{faq.question}</summary><p style={{marginTop:10}}>{faq.answer}</p></details>)}
</section>
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
