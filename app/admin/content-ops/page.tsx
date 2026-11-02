import type {Metadata} from "next";
import {redirect} from "next/navigation";
import {requireOps} from "@/lib/content-ops/server";
import {ContentOperations} from "@/components/content-ops/workspace";
import "./operations.css";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"عمليات المحتوى",description:"الأفكار والموجز ومراحل الإنتاج والجودة في لوسيل.",alternates:{canonical:"/admin/content-ops"},robots:{index:false,follow:false}};
export default async function ContentOpsPage(){try{await requireOps();}catch{redirect("/admin/login");}return <ContentOperations/>;}
