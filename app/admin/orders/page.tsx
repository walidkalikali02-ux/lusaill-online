import type { Metadata } from "next";
import { OrdersPanel } from "./orders-panel";
import s from "../../services/orders.module.css";

export const metadata: Metadata = { title: "إدارة طلبات الخدمات", alternates: { canonical: "/admin/orders" }, robots: { index: false, follow: false } };

export default function OrdersAdminPage() {
  return <main id="main-content" className={s.page}>
    <div className={s.wrap}>
      <h1>طلبات خدمات لوسيل</h1>
      <OrdersPanel />
    </div>
  </main>;
}
