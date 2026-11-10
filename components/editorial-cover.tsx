import Image from "next/image";

type EditorialCoverProps = {
  title: string;
  category: string;
  image?: string;
  imageAlt?: string;
  priority?: boolean;
  /** A short identifying label, not a claim that the illustration documents an actual procedure. */
  description?: string;
};

function coverTheme(category: string) {
  if (/كهرباء|طاقة|منزل|سكن|مرافق/u.test(category)) return "energy";
  if (/طب|صحة|غذاء|تغذية|سلامة/u.test(category)) return "health";
  if (/علوم|رياضيات|فيزياء|كيمياء|بحث/u.test(category)) return "science";
  if (/حكومة|جواز|سفر|مرور|جنسية|خدمات|وثائق|قانون/u.test(category)) return "civic";
  if (/تكنولوجيا|تقنية|رقمية|حاسوب|إنترنت|كمبيوتر/u.test(category)) return "technology";
  return "knowledge";
}

/**
 * Topic-led cover: a stable Lusaill signature, but the article's own picture,
 * domain color and layout determine its visual. Never reuse the reference brand
 * or imply that a conceptual illustration is an official screenshot.
 */
export function EditorialCover({
  title,
  category,
  image,
  imageAlt,
  priority = false,
  description = "دليل مبسط بمراجع واضحة",
}: EditorialCoverProps) {
  const hash = Array.from(title).reduce((value, char) => (value * 33 + (char.codePointAt(0) ?? 0)) >>> 0, 5381);
  const layout = hash % 3;
  return (
    <figure className={`editorial-cover editorial-cover--${coverTheme(category)} editorial-cover--layout-${layout}`}>
      <div className="editorial-cover__visual">
        {image ? (
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            unoptimized={image.startsWith("https://")}
            priority={priority}
            sizes="(max-width: 700px) calc(100vw - 36px), (max-width: 1100px) 43vw, 560px"
            className="editorial-cover__art"
          />
        ) : (
          <div className="editorial-cover__placeholder" aria-hidden="true">
            <span className="editorial-cover__orbit editorial-cover__orbit--one" />
            <span className="editorial-cover__orbit editorial-cover__orbit--two" />
            <span className="editorial-cover__orbit editorial-cover__orbit--three" />
          </div>
        )}
        <div className="editorial-cover__visual-accent" aria-hidden="true" />
      </div>
      <div className="editorial-cover__copy" dir="rtl">
        <div className="editorial-cover__brand" aria-label="موسوعة لوسيل">
          <span className="editorial-cover__brand-mark" aria-hidden="true">ل</span>
          <span>لوسيل<span className="editorial-cover__brand-dot">.</span></span>
        </div>
        <div className="editorial-cover__headline-block">
          <span className="editorial-cover__category">{category}</span>
          <span className="editorial-cover__headline">{title}</span>
          <span className="editorial-cover__subtitle">{description}</span>
        </div>
        <span className="editorial-cover__url" dir="ltr">LUSAILL.ONLINE</span>
      </div>
      <figcaption className="editorial-cover__caption">
        غلاف تحريري من لوسيل. الصورة توضيحية للموضوع، وليست لقطة من بوابة رسمية أو إثباتًا لتنفيذ إجراء.
      </figcaption>
    </figure>
  );
}
