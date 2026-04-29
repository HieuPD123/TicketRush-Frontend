export type Category =
  | "LIVE_MUSIC"
  | "PERFORMING_ARTS"
  | "SPORTS"
  | "SEMINARS_AND_WORKSHOPS"
  | "TOURS_AND_EXPERIENCES"
  | "OTHERS";

export const CATEGORY_LABELS: Record<Category, string> = {
  LIVE_MUSIC: "Nhạc sống",
  PERFORMING_ARTS: "Nghệ thuật biểu diễn",
  SPORTS: "Thể thao",
  SEMINARS_AND_WORKSHOPS: "Hội thảo & Workshop",
  TOURS_AND_EXPERIENCES: "Tour & Trải nghiệm",
  OTHERS: "Khác",
};
