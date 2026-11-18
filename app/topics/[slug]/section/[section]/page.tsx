import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { encyclopediaCategories, getEncyclopediaCategory } from "@/lib/encyclopedia-taxonomy";
import { getEncyclopediaSubtopicItems } from "@/lib/encyclopedia-catalog";
import { topicSectionSlug, topicSectionFromSlug } from "@/lib/topic-section-slugs";
import { TopicHub, topicMetadata } from "@/components/topic-hub";

export const dynamicParams = false;
export const revalidate = 3600;
export function generateStaticParams() {
  return encyclopediaCategories.flatMap(category =>
    category.subtopics.filter(label => getEncyclopediaSubtopicItems(category, label).length > 0)
      .map(label => ({ slug: category.slug, section: topicSectionSlug(label) })));
}
type Props = { params: Promise<{ slug: string; section: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, section } = await params;
  const category = getEncyclopediaCategory(slug);
  const label = category && topicSectionFromSlug(category.subtopics, section);
  return label ? topicMetadata(slug, 1, label) : { robots: { index: false, follow: true } };
}
export default async function TopicSectionPage({ params }: Props) {
  const { slug, section } = await params;
  const category = getEncyclopediaCategory(slug);
  const label = category && topicSectionFromSlug(category.subtopics, section);
  if (!label) notFound();
  return <TopicHub slug={slug} section={label} currentPage={1} />;
}
