export interface Work {
  id: string;
  title: string;
  slug: string;
  description: string;
  sector: "AR" | "VR_QUEST" | "PC" | "ANDROID";
  coverImageUrl: string | null;
  videoUrl: string | null;
  isPublished?: boolean;
}

export interface Founder {
  id: string;
  name: string;
  role: string;
  domain: string;
  qualification: string;
  cvUrl: string | null;
  portfolioUrl: string | null;
  profilePhotoUrl: string | null;
}
