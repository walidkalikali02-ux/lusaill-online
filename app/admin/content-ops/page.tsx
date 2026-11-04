import type {Metadata} from "next";
import {redirect} from "next/navigation";
import {requireOps} from "@/lib/content-ops/server";
import {ContentManagement} from "@/components/content-ops/management-workspace";
import "./management.css";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"إدارة المحتوى والمتابعة",description:"إدارة المقالات والمسؤوليات والمواعيد والموافقات وسجل المتابعة في لوسيل.",alternates:{canonical:"/admin/content-ops"},robots:{index:false,follow:false}};
export default async function ContentOpsPage(){try{await requireOps();}catch{redirect("/admin/login");}return <ContentManagement/>;}
