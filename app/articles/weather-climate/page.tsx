import { restoredScienceGuides } from "@/lib/restored-science-guides";
import { metadataForRestoredScienceGuide, RestoredScienceArticle } from "@/components/restored-science-article";

const guide = restoredScienceGuides.weatherClimate;
export const metadata = metadataForRestoredScienceGuide(guide);
export default function Page() { return <RestoredScienceArticle guide={guide} />; }
