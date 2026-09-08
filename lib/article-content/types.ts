import type { ArticleStatus, FactRow, Step, FaqItem, SourceRef } from "../content";

export type ArticleContentOverride = {
  id: number;
  status: ArticleStatus;
  publishedAt?: string;
  updatedAt?: string;
  quickAnswer?: string;
  summaryTable?: FactRow[];
  steps?: Step[];
  commonMistakes?: string[];
  sources?: SourceRef[];
  faqs?: FaqItem[];
};
