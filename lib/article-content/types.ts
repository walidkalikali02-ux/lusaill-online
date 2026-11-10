import type { ArticleStatus, FactRow, Step, FaqItem, SourceRef } from "../content";
import type { PracticalSection } from "../article-audit-updates";

export type ArticleContentOverride = {
  id: number;
  slug?: string;
  title?: string;
  metaDescription?: string;
  status?: ArticleStatus;
  publishedAt?: string;
  updatedAt?: string;
  coverImage?: string;
  coverImageAlt?: string;
  quickAnswer?: string;
  summaryTable?: FactRow[];
  steps?: Step[];
  commonMistakes?: string[];
  sources?: SourceRef[];
  faqs?: FaqItem[];
  practicalSections?: PracticalSection[];
};
