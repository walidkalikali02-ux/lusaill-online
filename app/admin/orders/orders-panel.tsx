"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getService, services, statuses, type OrderStatus, type ServiceOrder } from "@/lib/service-orders";
import s from "../../services/orders.module.css";

type Filters = { q: string; service: string; status: string; sort: string };
const defaultFilters: Filters = { q: "", service: "", status: "", sort: "newest" };
const statusEntries = Object.entries(statuses) as [OrderStatus, string][];

const endpoint = "/api/admin/service-orders";
const dateFormat = new Intl.DateTimeFormat("ar-QA", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Qatar" });

export function OrdersPanel() {
  const [orders, setOrders] = useState<ServiceOrder[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [draft, setDraft] = useState(defaultFilters);
  const [counts, setCounts] = useState<Partial<Record<OrderStatus, number | null>>>({});
  const [total, setTotal] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const disabled = loading || busy;

  async function load(index: number, selected: Filters, signal?: AbortSignal) {
    try {
      const params = new URLSearchParams({ ...selected, page: String(index) });
      const res = await fetch(`${endpoint}?${params}`, { cache: "no-store", signal });
      if (res.status === 401) {
        setOrders(null);
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrders(data.orders);
      setHasNext(data.hasNext);
      setPage(index);
      setFilters(selected);
      setTotal(data.total);
      setCounts(data.counts);
    } catch (err) {
      if (!signal?.aborted) setError(err instanceof Error ? err.message : "تعذّر تحميل الطلبات.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  function goToPage(index: number, selected = filters) {
    setLoading(true);
    setError("");
    setNotice("");
    void load(index, selected);
  }

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(() => load(0, defaultFilters, controller.signal));
    return () => controller.abort();
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      const res = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fields.get("email"), password: fields.get("password") }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await load(0, defaultFilters);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر تسجيل الدخول.");
    } finally {
      setBusy(false);
    }
  }

  async function update(id: string, status: OrderStatus) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(endpoint, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }),
      });
      if (res.status === 401) setOrders(null);
      if (!res.ok) throw new Error((await res.json()).error);
      setOrders(current => current?.map(order => order.id === id ? { ...order, status } : order) ?? null);
      setNotice("تم تحديث حالة الطلب.");
      await load(filters.status ? 0 : page, filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر تحديث الحالة.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setOrders(null);
      setDraft(defaultFilters);
      setFilters(defaultFilters);
      setNotice("");
      setError("");
    } catch {
      setError("تعذّر تسجيل الخروج. حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  }

  function apply(selected: Filters) {
    setDraft(selected);
    goToPage(0, selected);
  }

  async function copyBrief(order: ServiceOrder) {
    const service = getService(order.service)?.name ?? order.service;
    const summary = [
      service,
      `رقم الطلب: ${order.id}`,
      `الحالة: ${statuses[order.status]}`,
      `العميل: ${order.name} — ${order.email}`,
      ...order.answers.filter(item => item.answer).map(item => `${item.question}\n${item.answer}`),
    ].join("\n\n");
    try {
      await navigator.clipboard.writeText(summary);
      setNotice("نُسخ ملخص التنفيذ.");
    } catch {
      setError("تعذّر نسخ الملخص. يمكنك تحديد النص ونسخه من تفاصيل الطلب.");
    }
  }

  return <>
    {error && <p className={s.error} role="alert">{error}</p>}
    <p className={s.orderNotice} role="status">{loading ? "جارٍ تحميل الطلبات…" : notice}</p>
    {!loading && orders === null && <form className={s.panel} onSubmit={login}>
      <h2>دخول الإدارة</h2>
      <p>استخدم حساب إدارة لوسيل الحالي.</p>
      <label>البريد الإلكتروني<input name="email" type="email" autoComplete="username" required dir="ltr" /></label>
      <label>كلمة المرور<input name="password" type="password" autoComplete="current-password" required dir="ltr" /></label>
      <button className={s.primary} disabled={busy}>دخول</button>
    </form>}
    {orders !== null && <>
      <nav className={s.orderMetrics} aria-label="الطلبات حسب الحالة">
        {statusEntries.map(([key, label]) => <button key={key} type="button"
          disabled={disabled} aria-pressed={filters.status === key}
          onClick={() => apply({ ...filters, status: filters.status === key ? "" : key })}>
          <span>{label}</span><strong>{counts[key] ?? "—"}</strong>
        </button>)}
      </nav>
      <form className={`${s.panel} ${s.orderFilters}`} onSubmit={event => {
        event.preventDefault();
        apply({ ...draft, q: draft.q.trim() });
      }}>
        <label>البحث
          <input type="search" maxLength={100} placeholder="اسم العميل، البريد أو رقم الطلب"
            value={draft.q} onChange={event => setDraft({ ...draft, q: event.target.value })} />
        </label>
        <label>الخدمة
          <select value={draft.service} onChange={event => setDraft({ ...draft, service: event.target.value })}>
            <option value="">جميع الخدمات</option>
            {services.map(service => <option key={service.slug} value={service.slug}>{service.name}</option>)}
          </select>
        </label>
        <label>الحالة
          <select value={draft.status} onChange={event => setDraft({ ...draft, status: event.target.value })}>
            <option value="">جميع الحالات</option>
            {statusEntries.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </label>
        <label>الترتيب
          <select value={draft.sort} onChange={event => setDraft({ ...draft, sort: event.target.value })}>
            <option value="newest">الأحدث أولًا</option><option value="oldest">الأقدم أولًا</option>
          </select>
        </label>
        <div className={s.actions}>
          <button className={s.primary} disabled={disabled}>بحث</button>
          <button className={s.secondary} type="button" disabled={disabled} onClick={() => apply(defaultFilters)}>مسح الفلاتر</button>
        </div>
      </form>
      <div className={s.actions}>
        <button className={s.secondary} disabled={busy || loading} onClick={() => goToPage(0)}>تحديث الطلبات</button>
        <button className={s.secondary} disabled={busy || loading} onClick={logout}>تسجيل الخروج</button>
      </div>
      <p aria-live="polite">{total !== null ? `الطلبات المطابقة: ${total}` : `الطلبات في هذه الصفحة: ${orders.length}`}</p>
      {!orders.length && !loading && <p className={s.panel}>لا توجد طلبات مطابقة.</p>}
      <div className={s.orders}>{orders.map(order => <details className={s.panel} key={order.id}>
        <summary><strong>{getService(order.service)?.name ?? order.service}</strong><span>{order.name}</span><span className={s.orderBadge} data-status={order.status}>{statuses[order.status]}</span></summary>
        <p><bdi className={s.reference}>{order.id}</bdi> · {dateFormat.format(new Date(order.created_at))}</p>
        <p>البريد الإلكتروني <bdi>{order.email}</bdi></p>
        <button className={s.secondary} type="button" onClick={() => copyBrief(order)}>نسخ ملخص التنفيذ</button>
        <label>حالة الطلب
          <select value={order.status} disabled={busy || loading} onChange={event => update(order.id, event.target.value as OrderStatus)}>
            {Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <dl className={s.review}>{order.answers.map(item => <div key={item.id}>
          <dt>{item.question}</dt><dd>{item.answer || "تم التخطي"}</dd>
        </div>)}</dl>
      </details>)}</div>
      <div className={s.actions} aria-label="صفحات الطلبات">
        <button className={s.secondary} disabled={page === 0 || busy || loading} onClick={() => goToPage(page - 1)}>السابق</button>
        <span>صفحة {page + 1}</span>
        <button className={s.secondary} disabled={!hasNext || busy || loading} onClick={() => goToPage(page + 1)}>التالي</button>
      </div>
    </>}
  </>;
}
