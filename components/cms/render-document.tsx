import NextImage from "next/image";
import { ElectricityInquiryDetail } from "@/components/electricity-inquiry-detail";
import { ElectricityCalculator } from "@/components/electricity-calculator";
import { GuideChecklist } from "@/components/guide-checklist";
import type { CmsDocument } from "@/lib/cms/model";
import type { ReactNode } from "react";
type Node = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: Node[];
  marks?: { type: string; attrs?: Record<string, unknown> }[];
};
function safeLink(s: unknown) {
  return typeof s === "string" &&
    (/^(https:\/\/)/.test(s) || /^\/(?!\/)/.test(s))
    ? s
    : undefined;
}
function render(node: Node, index = 0, depth = 0): ReactNode {
  if (depth > 25) return null;
  const children = node.content?.map((n, i) => render(n, i, depth + 1));
  if (node.type === "text") {
    let text: ReactNode = node.text ?? "";
    for (const m of node.marks ?? []) {
      if (m.type === "bold") text = <strong>{text}</strong>;
      if (m.type === "italic") text = <em>{text}</em>;
      if (m.type === "link")
        text = (
          <a href={safeLink(m.attrs?.href)} rel="noopener noreferrer">
            {text}
          </a>
        );
    }
    return <span key={index}>{text}</span>;
  }
  switch (node.type) {
    case "doc":
      return <div key={index}>{children}</div>;
    case "paragraph":
      return <p key={index}>{children}</p>;
    case "heading": {
      const level = Number(node.attrs?.level);
      const Tag = `h${Math.max(1, Math.min(6, level || 2))}` as "h1";
      return <Tag key={index}>{children}</Tag>;
    }
    case "bulletList":
      return <ul key={index}>{children}</ul>;
    case "orderedList":
      return <ol key={index}>{children}</ol>;
    case "listItem":
      return <li key={index}>{children}</li>;
    case "blockquote":
      return <blockquote key={index}>{children}</blockquote>;
    case "hardBreak":
      return <br key={index} />;
    case "table":
      return (
        <table key={index}>
          <tbody>{children}</tbody>
        </table>
      );
    case "tableRow":
      return <tr key={index}>{children}</tr>;
    case "tableHeader":
      return <th key={index}>{children}</th>;
    case "tableCell":
      return <td key={index}>{children}</td>;
    case "image": {
      const src = safeLink(node.attrs?.src);
      return src ? (
        <figure key={index}>
          <NextImage
            unoptimized
            src={src}
            alt={String(node.attrs?.alt ?? "")}
            loading="lazy"
            width={Number(node.attrs?.width) || 800}
            height={Number(node.attrs?.height) || 450}
          />
          <figcaption>{String(node.attrs?.title ?? "")}</figcaption>
        </figure>
      ) : null;
    }
    default:
      return <div key={index}>{children}</div>;
  }
}
export function CmsPreview({ document: d }: { document: CmsDocument }) {
  return (
    <article className="cms-article">
      <p className="cms-eyebrow">
        {d.category} / {d.author}
      </p>
      <h1>{d.title}</h1>
      <p>آخر مراجعة: {d.reviewedAt || "لم تُراجع بعد"}</p>
      <section className="cms-answer">
        <h2>الإجابة المباشرة</h2>
        <p>{d.answer}</p>
      </section>
      {d.summary.length > 0 && (
        <table>
          <tbody>
            {d.summary.map((s, i) => (
              <tr key={i}>
                <th>{s.label}</th>
                <td>{s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {render(d.body as Node)}
      {d.blocks.map((b) => (
        <section
          id={
            b.kind === "step"
              ? `step-${d.blocks.filter((x) => x.kind === "step").findIndex((x) => x.id === b.id) + 1}`
              : undefined
          }
          key={b.id}
          className={`cms-block cms-block-${b.kind}`}
        >
          <h2>{b.title}</h2>
          <p>{b.text}</p>
          {b.kind === "component" &&
            (b.component === "electricity-details" ? (
              <ElectricityInquiryDetail />
            ) : b.component === "electricity" ? (
              <ElectricityCalculator />
            ) : (
              <GuideChecklist
                steps={d.blocks
                  .filter((x) => x.kind === "step")
                  .map((x) => x.title)}
              />
            ))}
          {b.mediaUrl && (
            <a
              href={safeLink(b.mediaUrl)}
              rel="noopener noreferrer"
              target="_blank"
            >
              وسائط توضيحية للخطوة
            </a>
          )}
          {b.sourceUrl && (
            <a href={safeLink(b.sourceUrl)}>المصدر الموثق لهذه الخطوة</a>
          )}
        </section>
      ))}
      <section>
        <h2>المصادر الرسمية</h2>
        {d.sources.map((s, i) => (
          <p key={i}>
            <a href={safeLink(s.url)}>{s.label}</a> — تحقق:{" "}
            {s.checkedAt || "مطلوب"}
          </p>
        ))}
      </section>
    </article>
  );
}
