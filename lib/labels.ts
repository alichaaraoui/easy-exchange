import type { CategoryValue, ConditionGrade, JacketGrade } from "@/lib/validation";

export const CATEGORY_LABELS: Record<CategoryValue, string> = {
  ARCHITECTURE_MONOGRAPH: "Architecture Monograph",
  ARCHITECTURAL_THEORY: "Architectural Theory",
  ART_HISTORY: "Art History",
  EXHIBITION_CATALOGUE: "Exhibition Catalogue",
  PHOTOGRAPHY: "Photography",
  DESIGN: "Design",
  ARTIST_BOOK_ZINE: "Artist Book / Zine",
};

export const CONDITION_LABELS: Record<ConditionGrade, string> = {
  NEW: "New",
  LIKE_NEW: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
};

export const JACKET_LABELS: Record<JacketGrade, string> = {
  NONE: "None (no jacket)",
  POOR: "Poor",
  FAIR: "Fair",
  GOOD: "Good",
  FINE: "Fine",
};

export function categoryLabel(value: string) {
  return CATEGORY_LABELS[value as CategoryValue] ?? value;
}

export function conditionLabel(value: string) {
  return CONDITION_LABELS[value as ConditionGrade] ?? value;
}

export function jacketLabel(value: string) {
  return JACKET_LABELS[value as JacketGrade] ?? value;
}
