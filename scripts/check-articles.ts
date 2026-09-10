import { articles } from "../lib/content";

const empty = articles.filter(a => !a.quickAnswer && !a.summaryTable && !a.steps && !a.commonMistakes && !a.sources && !a.faqs);
console.log("مقالات بدون محتوى (" + empty.length + " من " + articles.length + "):");
empty.forEach(a => console.log("  #" + a.id + " | " + a.title + " | " + a.status));

const published = articles.filter(a => a.status === "published");
console.log("\nمقالات منشورة (" + published.length + "):");
published.forEach(a => console.log("  #" + a.id + " | " + a.title));
