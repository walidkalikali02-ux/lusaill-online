import type { ReactNode } from "react";
import Link from "next/link";

const encyclopedia = {
  name: "موسوعة لوسيل", home: "/knowledge", label: "المعرفة العربية",
  links: [["/topics", "فئات الموسوعة"], ["/food-safety", "سلامة الغذاء"], ["/search", "بحث الموسوعة"], ["/editorial-policy", "منهج التحرير"]],
};
const services = {
  name: "خدمات لوسيل", home: "/services", label: "الحلول الرقمية",
  links: [["/services/website-design", "تصميم المواقع"], ["/services#available-services", "الخدمات المتاحة"]],
};
const caricatures = {
  name: "كاريكاتير لوسيل", home: "/caricatures", label: "المحتوى البصري",
  links: [["/caricatures#gallery", "معرض الأعمال"]],
};
const guides = {
  name: "أدلة لوسيل العملية", home: "/articles", label: "الأدلة ومسارات المهام",
  links: [["/guides", "مسارات المهام"], ["/categories", "تصنيفات الأدلة"], ["/entities", "الجهات والإجراءات"]],
};

const isWithin = (pathname: string, root: string) => pathname === root || pathname.startsWith(root + "/");

export function getProject(pathname: string) {
  if (["/knowledge", "/topics", "/food-safety", "/search", "/editorial-policy", "/authors", "/team"].some(root => isWithin(pathname, root)) ||
    ["/articles/solar-system", "/articles/weather-climate"].includes(pathname)) return encyclopedia;
  if (isWithin(pathname, "/services")) return services;
  if (isWithin(pathname, "/caricatures")) return caricatures;
  if (["/articles", "/guides", "/categories", "/entities"].some(root => isWithin(pathname, root))) return guides;
  return null;
}

export function ProjectFrame({ pathname, project, children }: { pathname: string; project: NonNullable<ReturnType<typeof getProject>>; children: ReactNode }) {
  return <>
    <header className="project-masthead" data-project={project.home}>
      <div className="shell project-masthead-inner">
        <Link className="project-brand" href={project.home}><strong>{project.name}</strong><small>{project.label}</small></Link>
        <nav aria-label={`تنقل ${project.name}`}>
          {project.links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
        </nav>
        <Link className="project-company-link" href="/#projects">مشاريع شركة لوسيل <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
    {children}
    <footer className="project-footer"><div className="shell project-masthead-inner">
      <Link className="project-brand" href={project.home}><strong>{project.name}</strong><small>أحد مشاريع شركة لوسيل</small></Link>
      <nav aria-label={`روابط ${project.name}`}>
        {project.links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        <Link href="/privacy">الخصوصية</Link>
      </nav>
      <Link className="project-company-link" href="/">شركة لوسيل <span aria-hidden="true">↗</span></Link>
    </div></footer>
  </>;
}
