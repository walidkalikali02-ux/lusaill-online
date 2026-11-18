import type { Metadata } from "next";
import { clusters } from "@/lib/content";
import { CategoryHub, categoryMetadata } from "@/components/category-hub";

export const dynamicParams = false;
export const revalidate = 3600;
export function generateStaticParams() {
  return clusters.map(cluster => ({ slug: cluster.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return categoryMetadata(slug, 1);
}
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CategoryHub slug={slug} currentPage={1} />;
}
