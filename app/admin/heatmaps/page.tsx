import type {Metadata} from "next";
import {redirect} from "next/navigation";
import {requireAdmin} from "@/lib/cms/server";
import {HeatmapWorkspace} from "@/components/heatmap/workspace";
import "./heatmaps.css";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"الخرائط الحرارية",description:"تحليل مجمّع للنقرات والتمرير ووقت ظهور المناطق على صفحات لوسيل.",alternates:{canonical:"/admin/heatmaps"},robots:{index:false,follow:false}};
export default async function HeatmapsPage(){try{await requireAdmin();}catch{redirect("/admin/login");}return <HeatmapWorkspace today={new Date().toISOString().slice(0,10)}/>;}
