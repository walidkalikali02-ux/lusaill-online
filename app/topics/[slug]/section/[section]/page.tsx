import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { encyclopediaCategories } from "@/lib/encyclopedia-taxonomy";
import { getEncyclopediaSubtopicItems } from "@/lib/encyclopedia-catalog";
import { TopicHub, topicMetadata } from "@/components/topic-hub";

export const dynamicParams = false;
export const revalidate = 3600;
export function generateStaticParams() {
  return encyclopediaCategories.flatMap(category =>
    category.subtopics.filter(section => getEncyclopediaSubtopicItems(category, section).length > 0)
      .map(section => ({ slug: category.slug, section })));
}
type Props = { params: Promise<{ slug: string; section: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, section } = await params;
  return topicMetadata(slug, 1, section);
}
export default async function TopicSectionPage({ params }: Props) {
  const { slug, section } = await params;
  if (!section) notFound();
  return <TopicHub slug={slug} section={section} currentPage={1} />;
}
