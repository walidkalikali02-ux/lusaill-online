import type {Metadata} from "next";
import {redirect} from "next/navigation";
import {requireOps} from "@/lib/content-ops/server";
import {SeoWorkspace} from "@/components/seo/workspace";
import "./seo.css";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"مهام المقالات وSEO",description:"قوائم مهام التحرير وSEO ومراجعات المقالات والموقع في لوسيل.",alternates:{canonical:"/admin/seo"},robots:{index:false,follow:false}};
export default async function SeoPage({searchParams}:{searchParams:Promise<{target?:string}>}){try{await requireOps();}catch{redirect("/admin/login");}const {target}=await searchParams;return <SeoWorkspace initialTarget={target??""}/>;}
