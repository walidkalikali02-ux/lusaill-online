import type { ArticleStatus } from "@/lib/content";

const labels: Record<ArticleStatus, string> = {
  not_started: "لم يبدأ",
  drafting: "قيد الكتابة",
  needs_verification: "بانتظار تحقق",
  published: "منشور",
};

export function StatusBadge({ status }: { status: ArticleStatus }) {
  return <span className={`status-badge status-${status}`}>{labels[status]}</span>;
}
