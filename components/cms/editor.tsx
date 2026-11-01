"use client";
import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { CmsPreview } from "./render-document";
import {
  normalizeTopic,
  statuses,
  statusLabels,
  warnings,
  type CmsDocument,
  type CmsBlock,
} from "@/lib/cms/model";
type Revision = {
  id: number;
  version: number;
  created_at: string;
  document: CmsDocument;
};
const blockLabels: Record<CmsBlock["kind"], string> = {
  requirements: "المتطلبات",
  fees: "الرسوم",
  deadline: "موعد نهائي",
  warning: "تنبيه مهم",
  troubleshooting: "حل مشكلة",
  step: "خطوة تنفيذ",
  faq: "سؤال شائع",
  error: "خطأ شائع",
  component: "مكوّن تفاعلي",
};
export function CmsEditor({
  initial,
  documents,
  onClose,
  onSaved,
}: {
  initial: CmsDocument;
  documents: CmsDocument[];
  onClose: () => void;
  onSaved: (d: CmsDocument) => void;
}) {
  const [doc, setDoc] = useState(initial),
    [message, setMessage] = useState(""),
    [saving, setSaving] = useState(false),
    [device, setDevice] = useState("desktop"),
    [revisions, setRevisions] = useState<Revision[]>([]),
    [tab, setTab] = useState("content");
  const generation = useRef(0),
    dirty = useRef(false),
    inFlight = useRef(false),
    saveRef = useRef<(manual: boolean) => Promise<void>>(async () => {}),
    lastSaved = useRef(initial);
  function change(p: Partial<CmsDocument>) {
    generation.current++;
    dirty.current = true;
    setDoc((prev) => ({ ...prev, ...p }));
  }
  const editor = useEditor({
    extensions: [
      StarterKit,
      TableKit,
      Image,
      Placeholder.configure({ placeholder: "ابدأ كتابة الدليل هنا…" }),
    ],
    content: initial.body,
    immediatelyRender: false,
    editorProps: { attributes: { dir: "rtl", "aria-label": "نص المقال" } },
    onUpdate: ({ editor }) => {
      generation.current++;
      dirty.current = true;
      setDoc((prev) => ({ ...prev, body: editor.getJSON() }));
    },
  });
  useEffect(() => {
    saveRef.current = async (manual) => {
      if (inFlight.current) return;
      if (!doc.slug.trim()) {
        setMessage("حدد رابط المقال لتفعيل الحفظ");
        return;
      }
      const savingGeneration = generation.current;
      inFlight.current = true;
      setSaving(true);
      const snapshot = {
        ...doc,
        status: manual
          ? doc.status
          : doc.status === "published" || doc.status === "scheduled"
            ? ("draft" as const)
            : doc.status,
      };
      try {
        const r = await fetch("/api/cms/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(snapshot),
        });
        const data = await r.json();
        if (!r.ok) throw Error(data.error ?? "تعذر الحفظ");
        lastSaved.current = data;
        setDoc((prev) => ({
          ...prev,
          version: data.version,
          updatedAt: data.updatedAt,
          status: manual ? data.status : prev.status,
        }));
        dirty.current = generation.current !== savingGeneration;
        onSaved(data);
        setMessage(
          `تم حفظ ${manual ? statusLabels[data.status] : "المسودة"} · مراجعة ${data.version}`,
        );
      } catch (e) {
        setMessage(
          e instanceof Error ? e.message : "فشل الحفظ؛ محتواك ما زال في المحرر",
        );
      } finally {
        inFlight.current = false;
        setSaving(false);
      }
    };
  }, [doc, onSaved]);
  useEffect(() => {
    if (!dirty.current) return;
    const timer = setTimeout(() => {
      void saveRef.current(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [doc]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);
  const similar = documents
    .filter(
      (d) =>
        d.id !== doc.id &&
        (d.slug === doc.slug ||
          (normalizeTopic(doc.title).length > 5 &&
            normalizeTopic(d.title).includes(normalizeTopic(doc.title)))),
    )
    .slice(0, 5);
  const suggestions = documents
    .filter(
      (d) =>
        d.id !== doc.id &&
        d.category === doc.category &&
        d.status === "published",
    )
    .slice(0, 5);
  async function history() {
    const r = await fetch(`/api/cms/revisions/${doc.id}`);
    if (!r.ok) {
      setMessage("تعذر تحميل سجل المراجعات");
      return;
    }
    setRevisions(await r.json());
    setTab("history");
  }
  function restore(r: Revision) {
    if (
      !confirm(
        "استعادة هذه المراجعة كمسودة جديدة؟ النسخة المنشورة لن تتغير حتى تنشرها.",
      )
    )
      return;
    const next = {
      ...r.document,
      version: doc.version,
      status: "draft" as const,
    };
    change(next);
    editor?.commands.setContent(next.body);
    setTab("content");
  }
  return (
    <main className="cms-editor-shell">
      <header className="cms-editor-top">
        <button
          className="cms-secondary"
          onClick={() => {
            if (
              !dirty.current ||
              confirm("هناك تغييرات غير محفوظة؛ هل تريد المغادرة؟")
            )
              onClose();
          }}
        >
          → المكتبة
        </button>
        <div>
          <span className="cms-eyebrow">المحرر العربي</span>
          <h1>{doc.title}</h1>
          <small role="status">
            {saving
              ? "جارٍ الحفظ…"
              : message || "التعديلات تُحفظ تلقائيًا كمسودة"}
          </small>
        </div>
        <select
          aria-label="حالة المقال"
          value={doc.status}
          onChange={(e) =>
            change({ status: e.target.value as CmsDocument["status"] })
          }
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
        <button disabled={saving} onClick={() => void saveRef.current(true)}>
          حفظ / تطبيق الحالة
        </button>
      </header>
      <div className="cms-editor-tabs">
        <button onClick={() => setTab("content")}>التحرير</button>
        <button onClick={() => setTab("metadata")}>المصادر والسيو</button>
        <button onClick={() => void history()}>سجل المراجعات</button>
        <a href={`/articles/${doc.slug}`} target="_blank" rel="noreferrer">
          الصفحة العامة ↗
        </a>
        <span>معاينة:</span>
        <button
          aria-pressed={device === "desktop"}
          onClick={() => setDevice("desktop")}
        >
          حاسوب
        </button>
        <button
          aria-pressed={device === "mobile"}
          onClick={() => setDevice("mobile")}
        >
          هاتف
        </button>
      </div>
      <div className="cms-editor-grid">
        <section className="cms-edit-pane">
          {tab === "history" ? (
            <>
              <h2>المراجعات المحفوظة</h2>
              <p>الاستعادة تنشئ مسودة؛ لا تمسح سجل الإصدارات.</p>
              {revisions.map((r) => (
                <div className="cms-row" key={r.id}>
                  <span>
                    مراجعة {r.version} ·{" "}
                    {new Date(r.created_at).toLocaleString("ar-EG")}
                  </span>
                  <button onClick={() => restore(r)}>استعادة كمسودة</button>
                </div>
              ))}
              {!revisions.length && <p>لم تُحفظ مراجعات بعد.</p>}
            </>
          ) : tab === "metadata" ? (
            <>
              <label>
                عنوان SEO
                <input
                  value={doc.title}
                  onChange={(e) => change({ title: e.target.value })}
                />
              </label>
              <label>
                رابط المقال
                <input
                  dir="ltr"
                  value={doc.slug}
                  onChange={(e) => change({ slug: e.target.value })}
                />
              </label>
              <label>
                الوصف التعريفي ({doc.description.length})
                <textarea
                  value={doc.description}
                  onChange={(e) => change({ description: e.target.value })}
                />
              </label>
              <label>
                الكاتب
                <input
                  value={doc.author}
                  onChange={(e) => change({ author: e.target.value })}
                />
              </label>
              <label>
                التصنيف
                <input
                  value={doc.category}
                  onChange={(e) => change({ category: e.target.value })}
                />
              </label>
              <label>
                آخر مراجعة
                <input
                  type="date"
                  value={doc.reviewedAt}
                  onChange={(e) => change({ reviewedAt: e.target.value })}
                />
              </label>
              <label>
                النشر المجدول (بتوقيت جهازك)
                <input
                  type="datetime-local"
                  value={
                    doc.scheduledAt
                      ? new Date(
                          Date.parse(doc.scheduledAt) -
                            new Date(doc.scheduledAt).getTimezoneOffset() *
                              60000,
                        )
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    change({
                      scheduledAt: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : "",
                    })
                  }
                />
              </label>
              <label>
                الموعد النهائي
                <input
                  type="date"
                  value={doc.deadline}
                  onChange={(e) => change({ deadline: e.target.value })}
                />
              </label>
              <h2>المصادر الرسمية</h2>
              {doc.sources.map((s, i) => (
                <fieldset key={i}>
                  <legend>مصدر {i + 1}</legend>
                  <input
                    aria-label="اسم المصدر"
                    placeholder="اسم الجهة أو الإعلان"
                    value={s.label}
                    onChange={(e) =>
                      change({
                        sources: doc.sources.map((x, n) =>
                          n === i ? { ...x, label: e.target.value } : x,
                        ),
                      })
                    }
                  />
                  <input
                    aria-label="رابط المصدر"
                    dir="ltr"
                    placeholder="https://"
                    value={s.url}
                    onChange={(e) =>
                      change({
                        sources: doc.sources.map((x, n) =>
                          n === i ? { ...x, url: e.target.value } : x,
                        ),
                      })
                    }
                  />
                  <label>
                    تاريخ التحقق
                    <input
                      type="date"
                      value={s.checkedAt.slice(0, 10)}
                      onChange={(e) =>
                        change({
                          sources: doc.sources.map((x, n) =>
                            n === i ? { ...x, checkedAt: e.target.value } : x,
                          ),
                        })
                      }
                    />
                  </label>
                  <label>
                    يحتاج مراجعة بحلول
                    <input
                      type="date"
                      value={s.expiresAt}
                      onChange={(e) =>
                        change({
                          sources: doc.sources.map((x, n) =>
                            n === i ? { ...x, expiresAt: e.target.value } : x,
                          ),
                        })
                      }
                    />
                  </label>
                  <button
                    onClick={() =>
                      change({ sources: doc.sources.filter((_, n) => i !== n) })
                    }
                  >
                    إزالة المصدر
                  </button>
                </fieldset>
              ))}
              <button
                onClick={() =>
                  change({
                    sources: [
                      ...doc.sources,
                      { label: "", url: "", checkedAt: "", expiresAt: "" },
                    ],
                  })
                }
              >
                ＋ مصدر
              </button>
            </>
          ) : (
            <>
              <label>
                عنوان المقال
                <input
                  className="cms-title-input"
                  value={doc.title}
                  onChange={(e) => change({ title: e.target.value })}
                />
              </label>
              <label>
                رابط المقال
                <input
                  dir="ltr"
                  value={doc.slug}
                  onChange={(e) => change({ slug: e.target.value })}
                />
              </label>
              <label>
                الإجابة المباشرة
                <textarea
                  value={doc.answer}
                  onChange={(e) => change({ answer: e.target.value })}
                />
              </label>
              <h2>الملخص السريع</h2>
              {doc.summary.map((s, i) => (
                <div className="cms-inline-fields" key={i}>
                  <input
                    aria-label="بند الملخص"
                    value={s.label}
                    onChange={(e) =>
                      change({
                        summary: doc.summary.map((x, n) =>
                          n === i ? { ...x, label: e.target.value } : x,
                        ),
                      })
                    }
                  />
                  <input
                    aria-label="قيمة الملخص"
                    value={s.value}
                    onChange={(e) =>
                      change({
                        summary: doc.summary.map((x, n) =>
                          n === i ? { ...x, value: e.target.value } : x,
                        ),
                      })
                    }
                  />
                  <button
                    onClick={() =>
                      change({ summary: doc.summary.filter((_, n) => n !== i) })
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                className="cms-secondary"
                onClick={() =>
                  change({
                    summary: [...doc.summary, { label: "", value: "" }],
                  })
                }
              >
                ＋ بند ملخص
              </button>
              <h2>نص المقال</h2>
              <div
                className="cms-toolbar"
                role="toolbar"
                aria-label="تنسيق النص"
              >
                <select
                  aria-label="مستوى العنوان"
                  onChange={(e) => {
                    const level = Number(e.target.value) as
                      1 | 2 | 3 | 4 | 5 | 6;
                    if (level)
                      editor?.chain().focus().toggleHeading({ level }).run();
                    else editor?.chain().focus().setParagraph().run();
                  }}
                >
                  <option value="0">فقرة</option>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option value={n} key={n}>
                      H{n}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                >
                  عريض
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                >
                  مائل
                </button>
                <button
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                >
                  • قائمة
                </button>
                <button
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                >
                  1. خطوات
                </button>
                <button
                  onClick={() =>
                    editor?.chain().focus().toggleBlockquote().run()
                  }
                >
                  اقتباس
                </button>
                <button
                  onClick={() =>
                    editor
                      ?.chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 2, withHeaderRow: true })
                      .run()
                  }
                >
                  جدول
                </button>
                <button
                  onClick={() => {
                    const href = prompt("رابط HTTPS أو مسار داخلي");
                    if (
                      href &&
                      (/^https:\/\//.test(href) || /^\/(?!\/)/.test(href))
                    )
                      editor?.chain().focus().setLink({ href }).run();
                  }}
                >
                  رابط
                </button>
                <button
                  onClick={() => {
                    const src = prompt("رابط الصورة HTTPS");
                    if (src?.startsWith("https://")) {
                      const alt = prompt("وصف بديل للصورة");
                      if (alt)
                        editor?.chain().focus().setImage({ src, alt }).run();
                    }
                  }}
                >
                  صورة
                </button>
                <button onClick={() => editor?.chain().focus().undo().run()}>
                  تراجع
                </button>
                <button onClick={() => editor?.chain().focus().redo().run()}>
                  إعادة
                </button>
              </div>
              <EditorContent editor={editor} />
              <h2>الكتل القابلة لإعادة الاستخدام</h2>
              {doc.blocks.map((b, i) => (
                <fieldset key={b.id}>
                  <legend>
                    {blockLabels[b.kind]} {i + 1}
                  </legend>
                  <input
                    aria-label="عنوان الكتلة"
                    value={b.title}
                    onChange={(e) =>
                      change({
                        blocks: doc.blocks.map((x) =>
                          x.id === b.id ? { ...x, title: e.target.value } : x,
                        ),
                      })
                    }
                  />
                  <textarea
                    aria-label="تفاصيل الكتلة"
                    value={b.text}
                    onChange={(e) =>
                      change({
                        blocks: doc.blocks.map((x) =>
                          x.id === b.id ? { ...x, text: e.target.value } : x,
                        ),
                      })
                    }
                  />
                  {b.kind === "component" && (
                    <select
                      aria-label="المكوّن المعتمد"
                      value={b.component ?? "checklist"}
                      onChange={(e) =>
                        change({
                          blocks: doc.blocks.map((x) =>
                            x.id === b.id
                              ? {
                                  ...x,
                                  component: e.target.value as
                                    | "checklist"
                                    | "electricity"
                                    | "electricity-details",
                                }
                              : x,
                          ),
                        })
                      }
                    >
                      <option value="checklist">قائمة تحقق</option>
                      <option value="electricity">حاسبة الكهرباء</option>
                      <option value="electricity-details">
                        تفاصيل الاستعلام عن الكهرباء
                      </option>
                    </select>
                  )}
                  <input
                    aria-label="مصدر الخطوة"
                    placeholder="رابط مصدر الخطوة"
                    value={b.sourceUrl}
                    onChange={(e) =>
                      change({
                        blocks: doc.blocks.map((x) =>
                          x.id === b.id
                            ? { ...x, sourceUrl: e.target.value }
                            : x,
                        ),
                      })
                    }
                  />
                  <input
                    aria-label="وسائط الخطوة"
                    placeholder="رابط صورة أو وسائط للخطوة"
                    value={b.mediaUrl}
                    onChange={(e) =>
                      change({
                        blocks: doc.blocks.map((x) =>
                          x.id === b.id
                            ? { ...x, mediaUrl: e.target.value }
                            : x,
                        ),
                      })
                    }
                  />
                  <button
                    className="cms-secondary"
                    onClick={() => {
                      if (i === 0) return;
                      const blocks = [...doc.blocks];
                      [blocks[i - 1], blocks[i]] = [blocks[i], blocks[i - 1]];
                      change({ blocks });
                    }}
                  >
                    ↑ نقل لأعلى
                  </button>
                  <button
                    className="cms-secondary"
                    onClick={() =>
                      change({
                        blocks: doc.blocks.filter((x) => x.id !== b.id),
                      })
                    }
                  >
                    حذف الكتلة
                  </button>
                </fieldset>
              ))}
              <select
                aria-label="إضافة كتلة"
                value=""
                onChange={(e) => {
                  if (!e.target.value) return;
                  const kind = e.target.value as CmsBlock["kind"];
                  change({
                    blocks: [
                      ...doc.blocks,
                      {
                        id: crypto.randomUUID(),
                        kind,
                        title: blockLabels[kind],
                        text: "",
                        sourceUrl: "",
                        mediaUrl: "",
                        ...(kind === "component"
                          ? { component: "checklist" as const }
                          : {}),
                      },
                    ],
                  });
                }}
              >
                <option value="">＋ إضافة كتلة…</option>
                {Object.entries(blockLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </>
          )}
          <aside className="cms-editor-alerts">
            <h2>فحص تحريري</h2>
            {warnings(doc).map((w) => (
              <p key={w}>◌ {w}</p>
            ))}
            {similar.length > 0 && (
              <div role="alert">
                <h3>موضوع أو رابط مشابه</h3>
                {similar.map((d) => (
                  <p key={d.id}>{d.title}</p>
                ))}
              </div>
            )}
            <h3>روابط داخلية مقترحة</h3>
            {suggestions.map((d) => (
              <button
                className="cms-row"
                key={d.id}
                onClick={() =>
                  editor
                    ?.chain()
                    .focus()
                    .insertContent({
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: d.title,
                          marks: [
                            {
                              type: "link",
                              attrs: { href: `/articles/${d.slug}` },
                            },
                          ],
                        },
                      ],
                    })
                    .run()
                }
              >
                {d.title} ＋
              </button>
            ))}
          </aside>
        </section>
        <section
          className={`cms-preview-pane cms-preview-${device}`}
          aria-label="معاينة المقال"
        >
          <div className="cms-preview-label">
            معاينة قبل النشر · {device === "mobile" ? "هاتف" : "حاسوب"}
          </div>
          <CmsPreview document={doc} />
        </section>
      </div>
    </main>
  );
}
