import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { encyclopediaCategories, getEncyclopediaCategory } from "@/lib/encyclopedia-taxonomy";
import { TOPIC_PAGE_SIZE, getEncyclopediaSubtopicItems } from "@/lib/encyclopedia-catalog";
import { topicSectionSlug, topicSectionFromSlug } from "@/lib/topic-section-slugs";
import { TopicHub, topicMetadata } from "@/components/topic-hub";

export const dynamicParams = false;
export const revalidate = 3600;
const parse = (value: string) => /^[1-9][0-9]*$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) >= 2 ? Number(value) : null;
export function generateStaticParams() {
  return encyclopediaCategories.flatMap(category => category.subtopics.flatMap(label => {
    const count = getEncyclopediaSubtopicItems(category, label).length;
    return Array.from({ length: Math.max(0, Math.ceil(count / TOPIC_PAGE_SIZE) - 1) },
      (_, index) => ({ slug: category.slug, section: topicSectionSlug(label), page: String(index + 2) }));
  }));
}
type Props = { params: Promise<{ slug: string; section: string; page: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, section, page } = await params;
  const category = getEncyclopediaCategory(slug);
  const label = category && topicSectionFromSlug(category.subtopics, section);
  const number = parse(page);
  return label && number ? topicMetadata(slug, number, label) : { robots: { index: false, follow: true } };
}
export default async function TopicSectionPaginationPage({ params }: Props) {
  const { slug, section, page } = await params;
  const category = getEncyclopediaCategory(slug);
  const label = category && topicSectionFromSlug(category.subtopics, section);
  const number = parse(page);
  if (!label || !number) notFound();
  return <TopicHub slug={slug} section={label} currentPage={number} />;
}
