"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getService, statuses, type OrderStatus, type ServiceOrder } from "@/lib/service-orders";
import s from "../../services/orders.module.css";

const endpoint = "/api/admin/service-orders";
const dateFormat = new Intl.DateTimeFormat("ar-QA", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Qatar" });

export function OrdersPanel() {
  const [orders, setOrders] = useState<ServiceOrder[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  async function load(index: number, signal?: AbortSignal) {
    try {
      const res = await fetch(`${endpoint}?page=${index}`, { cache: "no-store", signal });
      if (res.status === 401) {
        setOrders(null);
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrders(data.orders);
      setHasNext(data.hasNext);
      setPage(index);
    } catch (err) {
      if (!signal?.aborted) setError(err instanceof Error ? err.message : "تعذّر تحميل الطلبات.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  function goToPage(index: number) {
    setLoading(true);
    setError("");
    void load(index);
  }

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(() => load(0, controller.signal));
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
      await load(0);
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
      setError("");
    } catch {
      setError("تعذّر تسجيل الخروج. حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  }

  return <>
    {error && <p className={s.error} role="alert">{error}</p>}
    {loading && <p role="status">جارٍ تحميل الطلبات…</p>}
    {!loading && orders === null && <form className={s.panel} onSubmit={login}>
      <h2>دخول الإدارة</h2>
      <p>استخدم حساب إدارة لوسيل الحالي.</p>
      <label>البريد الإلكتروني<input name="email" type="email" autoComplete="username" required dir="ltr" /></label>
      <label>كلمة المرور<input name="password" type="password" autoComplete="current-password" required dir="ltr" /></label>
      <button className={s.primary} disabled={busy}>دخول</button>
    </form>}
    {orders !== null && <>
      <div className={s.actions}>
        <button className={s.secondary} disabled={busy || loading} onClick={() => goToPage(0)}>تحديث الطلبات</button>
        <button className={s.secondary} disabled={busy || loading} onClick={logout}>تسجيل الخروج</button>
      </div>
      {!orders.length && !loading && <p className={s.panel}>لا توجد طلبات في هذه الصفحة.</p>}
      <div className={s.orders}>{orders.map(order => <details className={s.panel} key={order.id}>
        <summary><strong>{getService(order.service)?.name ?? order.service}</strong><span>{order.name}</span><span>{statuses[order.status]}</span></summary>
        <p><bdi className={s.reference}>{order.id}</bdi> · {dateFormat.format(new Date(order.created_at))}</p>
        <p>البريد الإلكتروني <bdi>{order.email}</bdi></p>
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
