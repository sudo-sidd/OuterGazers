import { Work, Founder } from "./types";

export const WORKS: Work[] = [
  {
    id: "work-1",
    title: "Project Alpha",
    slug: "project-alpha",
    description: "An innovative AR experience.",
    sector: "AR",
    coverImageUrl: null,
    videoUrl: null,
    isPublished: true,
  },
  {
    id: "work-2",
    title: "Virtual Realm",
    slug: "virtual-realm",
    description: "Immersive VR environment for Quest.",
    sector: "VR_QUEST",
    coverImageUrl: null,
    videoUrl: null,
    isPublished: true,
  }
];

export const FOUNDERS: Founder[] = [
  {
    id: "p1",
    name: "Siddharth T",
    role: "Gameplay Programmer | Technical Artist",
    domain: "Game AI, Physics, Tooling & Shader Work",
    qualification: "B.Tech (Artificial Intelligence & Machine Learning)",
    cvUrl: null,
    portfolioUrl: "https://sudosidd.dev",
    profilePhotoUrl: "/images/base1.jpg",
  },
  {
    id: "p2",
    name: "Pranavan K R",
    role: "Environment / 3D Artist",
    domain: "Environment Art & Real-Time 3D Pipeline",
    qualification: "BE Mechanical Engineering",
    cvUrl: null,
    portfolioUrl: "https://ArtStation.com/pranav016",
    profilePhotoUrl: "/images/pranav.jpg",
  },
  {
    id: "p3",
    name: "Raghul PK",
    role: "Technical Artist & Gameplay Programmer",
    domain: "VR/MR Development, Game Mechanics, Technical Art",
    qualification: "B.Tech (Artificial Intelligence and Machine Learning)",
    cvUrl: null,
    portfolioUrl: "https://raghul-gem.netlify.app",
    profilePhotoUrl: "/images/raghul.jpg",
  }
];
