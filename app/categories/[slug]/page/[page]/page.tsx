import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, clusters, isArticleIndexable } from "@/lib/content";
import { CategoryHub, categoryMetadata, ARTICLES_PER_PAGE } from "@/components/category-hub";

export const dynamicParams = false;
export const revalidate = 3600;
const parsed = (value: string) => /^[1-9]\\d*$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) >= 2 ? Number(value) : null;
export function generateStaticParams() {
  return clusters.flatMap(cluster => {
    const count = articles.filter(article => article.clusterCode === cluster.code && isArticleIndexable(article)).length;
    return Array.from({ length: Math.max(0, Math.ceil(count / ARTICLES_PER_PAGE) - 1) },
      (_, index) => ({ slug: cluster.slug, page: String(index + 2) }));
  });
}
type Props = { params: Promise<{ slug: string; page: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, page } = await params;
  const number = parsed(page);
  return number === null ? { robots: { index: false, follow: true } } : categoryMetadata(slug, number);
}
export default async function CategoryPaginationPage({ params }: Props) {
  const { slug, page } = await params;
  const number = parsed(page);
  if (number === null) notFound();
  return <CategoryHub slug={slug} currentPage={number} />;
}
