"use client";

import { useState } from "react";
import Link from "next/link";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="لوسيل - الرئيسية">
          <span className="brand-mark" aria-hidden="true">ل</span>
          <span>
            <strong>لوسيل</strong>
            <small>دليل عربي موثوق للحياة اليومية</small>
          </span>
        </Link>

        <nav className="header-nav" aria-label="التنقل الرئيسي">
          <Link href="/">الرئيسية</Link>
          <Link href="/articles">الأدلة</Link>
          <Link href="/categories">التصنيفات</Link>
          <Link href="/editorial-policy">منهج التحرير</Link>
          <Link href="/about">عن لوسيل</Link>
        </nav>

        <div className="header-actions">
          <Link href="/articles" className="header-search-btn" aria-label="بحث">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </Link>
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="القائمة">
            {menuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="القائمة الرئيسية">
          <div className="shell">
            <Link href="/" onClick={() => setMenuOpen(false)}>الرئيسية</Link>
            <Link href="/articles" onClick={() => setMenuOpen(false)}>الأدلة</Link>
            <Link href="/categories" onClick={() => setMenuOpen(false)}>التصنيفات</Link>
            <Link href="/editorial-policy" onClick={() => setMenuOpen(false)}>منهج التحرير</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>عن لوسيل</Link>
          </div>
        </nav>
      )}

      <style>{`
        .mobile-nav { border-top: 1px solid var(--border-light); background: var(--surface); }
        .mobile-nav .shell { display: flex; flex-direction: column; padding: 16px 0; }
        .mobile-nav a { display: flex; align-items: center; min-height: 48px; padding: 0 4px; font-size: 16px; font-weight: 500; color: var(--ink-secondary); border-bottom: 1px solid var(--border-light); }
        .mobile-nav a:last-child { border-bottom: none; }
        .mobile-nav a:hover { color: var(--ink); }
      `}</style>
    </header>
  );
}
