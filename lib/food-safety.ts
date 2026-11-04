import foods from "./food-safety-data/food-poisoning-risky-foods.json";
import rice from "./food-safety-data/rice-food-poisoning.json";
import prevention from "./food-safety-data/prevent-food-poisoning-at-home.json";
import symptoms from "./food-safety-data/food-poisoning-symptoms.json";

export type FoodSafetyArticle = {
  slug: string;
  title: string;
  description: string;
  bodyHtml: string;
  coverImage: string;
  coverImageAlt: string;
  images: { src: string; alt: string }[];
  publishedAt: string;
  updatedAt: string;
};

export const foodSafetyArticles: FoodSafetyArticle[] = [foods, rice, prevention, symptoms];

export function getFoodSafetyArticle(slug: string): FoodSafetyArticle | undefined {
  return foodSafetyArticles.find((article) => article.slug === slug);
}
