import Image from "next/image";

type EditorialCoverProps = {
  title: string;
  category: string;
  image?: string;
  imageAlt?: string;
  imageUrl?: string;
  priority?: boolean;
  description?: string;
};

/** Uses the completed 1200×630 article image, rather than reconstructing a
 * second split cover with the old artwork. This keeps previews, cards, and the
 * hero visually consistent for every published article. */
export function EditorialCover({
  title, image, imageAlt, imageUrl, priority = false,
}: EditorialCoverProps) {
  const cover = imageUrl || image;
  if (!cover) return null;
  return (
    <figure className="editorial-cover editorial-cover--raster">
      <Image
        className="editorial-cover__raster-image"
        src={cover}
        alt={imageUrl ? `غلاف لوسيل التحريري لمقال: ${title}` : (imageAlt ?? title)}
        width={1200}
        height={630}
        priority={priority}
        unoptimized={cover.startsWith("https://") || cover.startsWith("/api/")}
        sizes="(max-width: 768px) calc(100vw - 32px), (max-width: 1248px) calc(100vw - 48px), 1200px"
      />
      <figcaption className="editorial-cover__caption">
        غلاف توضيحي من لوسيل، وليس صورة لوثيقة رسمية أو إثباتًا لتنفيذ خدمة.
        {imageUrl ? <> · <a href={imageUrl} target="_blank" rel="noopener noreferrer">عرض صورة الغلاف PNG</a></> : null}
      </figcaption>
    </figure>
  );
}
