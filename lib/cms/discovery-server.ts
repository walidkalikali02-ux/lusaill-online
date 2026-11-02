import "server-only";
import { cache } from "react";
import { articles } from "../content";
import { publishedCmsDocuments } from "./public";
import { mergePublicArticles } from "./discovery";
export const discoverableArticles = cache(async () => mergePublicArticles(articles, await publishedCmsDocuments()));
