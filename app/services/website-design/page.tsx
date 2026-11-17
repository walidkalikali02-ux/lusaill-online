import type { Metadata } from "next";
import { pageAlternates } from "@/lib/page-alternates";
import { siteSocialImage } from "@/lib/site-config";
import { ServiceDetail } from "../service-detail";
import { serviceDetails } from "../service-detail-data";

const slug = "website-design";
const path = `/services/${slug}`;
const { title } = serviceDetails[slug];
const description = serviceDetails[slug].description;

export const metadata: Metadata = {
  title,
  description,
  alternates: pageAlternates(path),
  openGraph: { title, description, url: path, type: "website", images: [siteSocialImage] },
  twitter: { card: "summary_large_image", title, description, images: [siteSocialImage.url] },
};

export default function WebsiteDesignPage() {
  return <ServiceDetail slug={slug} />;
}
