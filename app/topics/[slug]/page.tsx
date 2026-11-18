import type { Metadata } from "next";
import { encyclopediaCategories } from "@/lib/encyclopedia-taxonomy";
import { TopicHub, topicMetadata } from "@/components/topic-hub";

export const dynamicParams = false;
export const revalidate = 3600;
export function generateStaticParams() { return encyclopediaCategories.map(category => ({ slug: category.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return topicMetadata(slug, 1);
}
export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <TopicHub slug={slug} currentPage={1} />;
}
