/**
 * ==============================================================================
 * OUTERGAZERS — OUR WORKS CONTENT CONFIGURATION
 * ==============================================================================
 *
 * This is the SINGLE file to add, remove, and edit everything in the "Our Works" section.
 * ==============================================================================
 */

export interface WorkItem {
  title: string;
  description?: string;
  tag?: string;
  link: string;
  thumbnail: string;
  mediaType?: "image" | "video";
}

export const FEATURED_WORKS: WorkItem[] = [
  {
    title: "Fake It Till You Sink",
    description: "A co-op management-chaos game about running a cruise ship with friends, feeding passengers, keeping systems online, and surviving escalating disasters.",
    tag: "Co-op Simulation",
    link: "https://sudosidd.dev/#projects",
    thumbnail: "/videos/fake-it-till-you-sink.mp4",
    mediaType: "video"
  },
  {
    title: "Retro PC",
    description: "High-poly hard-surface vintage computer terminal asset with retro CRT monitor curvature and modular cabling.",
    tag: "3D Prop Art",
    link: "#",
    thumbnail: "/images/RetroPc.png",
    mediaType: "image"
  },
  {
    title: "BumperBlitz",
    description: "Fast-paced browser arena bumper car combat with custom physics-driven collisions and destructive powerups.",
    tag: "Web Game",
    link: "https://sudo-sidd.itch.io/bumperblitz",
    thumbnail: "/images/bumperblitz.png",
    mediaType: "image"
  },
  {
    title: "Urban Alley",
    description: "Atmospheric cyberpunk city alleyway with volumetric lighting, neon reflections, and high-fidelity environment detailing.",
    tag: "Environment Art",
    link: "#",
    thumbnail: "/videos/urban_alley.mp4",
    mediaType: "video"
  },
  {
    title: "VR Chem Lab",
    description: "Interactive spatial VR educational simulation empowering students to conduct safe, repeatable chemistry experiments in a digital laboratory on Meta Quest.",
    tag: "EdTech VR",
    link: "#",
    thumbnail: "/images/ChemLab.jpg",
    mediaType: "image"
  },
  {
    title: "The Secret Place",
    description: "Photorealistic natural sanctuary environment featuring dense cinematic foliage, real-time lighting, and atmospheric depth.",
    tag: "Environment Art",
    link: "#",
    thumbnail: "/videos/secret_place.mp4",
    mediaType: "video"
  },
  {
    title: "Render Test",
    description: "Real-time volumetric render pipeline test built with chromatic aberration, glitch artifacts, and audio-reactive scanlines.",
    tag: "Technical Art",
    link: "#",
    thumbnail: "/images/HologramShader.png",
    mediaType: "image"
  }
];

export const WORKS_DATA: WorkItem[] = [
  // ── ROW 1 (Moves Right) ───────────────────────────────────────────────────
  // Midway visible slots: Render Test (Col 1), VR Chem Lab (Col 2), Urban Alley (Col 3), The Secret Place (Col 4)
  {
    title: "Fake It Till You Sink",
    description: "A co-op management-chaos game about running a cruise ship with friends, feeding passengers, keeping systems online, and surviving escalating disasters.",
    tag: "Co-op Simulation",
    link: "https://sudosidd.dev/#projects",
    thumbnail: "/videos/fake-it-till-you-sink.mp4",
    mediaType: "video"
  },
  {
    title: "The Secret Place",
    description: "Photorealistic natural sanctuary environment featuring dense cinematic foliage, real-time lighting, and atmospheric depth.",
    tag: "Environment Art",
    link: "#",
    thumbnail: "/videos/secret_place.mp4",
    mediaType: "video"
  },
  {
    title: "Urban Alley",
    description: "Atmospheric cyberpunk city alleyway with volumetric lighting, neon reflections, and high-fidelity environment detailing.",
    tag: "Environment Art",
    link: "#",
    thumbnail: "/videos/urban_alley.mp4",
    mediaType: "video"
  },
  {
    title: "VR Chem Lab",
    description: "Interactive spatial VR educational simulation empowering students to conduct safe, repeatable chemistry experiments in a digital laboratory on Meta Quest.",
    tag: "EdTech VR",
    link: "#",
    thumbnail: "/images/ChemLab.jpg",
    mediaType: "image"
  },
  {
    title: "Render Test",
    description: "Real-time volumetric render pipeline test built with chromatic aberration, glitch artifacts, and audio-reactive scanlines.",
    tag: "Technical Art",
    link: "#",
    thumbnail: "/images/HologramShader.png",
    mediaType: "image"
  },
  {
    title: "Retro PC",
    description: "High-poly hard-surface vintage computer terminal asset with retro CRT monitor curvature and modular cabling.",
    tag: "3D Prop Art",
    link: "#",
    thumbnail: "/images/RetroPc.png",
    mediaType: "image"
  },
  {
    title: "BumperBlitz",
    description: "Fast-paced browser arena bumper car combat with custom physics-driven collisions and destructive powerups.",
    tag: "Web Game",
    link: "https://sudo-sidd.itch.io/bumperblitz",
    thumbnail: "/images/bumperblitz.png",
    mediaType: "image"
  },

  // ── ROW 2 (Moves Left) ────────────────────────────────────────────────────
  // Midway visible slots: The Secret Place (Col 1), Fake It (Col 2), Retro PC (Col 3), BumperBlitz (Col 4)
  {
    title: "VR Chem Lab",
    description: "Interactive spatial VR educational simulation empowering students to conduct safe, repeatable chemistry experiments in a digital laboratory on Meta Quest.",
    tag: "EdTech VR",
    link: "#",
    thumbnail: "/images/ChemLab.jpg",
    mediaType: "image"
  },
  {
    title: "The Secret Place",
    description: "Photorealistic natural sanctuary environment featuring dense cinematic foliage, real-time lighting, and atmospheric depth.",
    tag: "Environment Art",
    link: "#",
    thumbnail: "/videos/secret_place.mp4",
    mediaType: "video"
  },
  {
    title: "Fake It Till You Sink",
    description: "A co-op management-chaos game about running a cruise ship with friends, feeding passengers, keeping systems online, and surviving escalating disasters.",
    tag: "Co-op Simulation",
    link: "https://sudosidd.dev/#projects",
    thumbnail: "/videos/fake-it-till-you-sink.mp4",
    mediaType: "video"
  },
  {
    title: "Retro PC",
    description: "High-poly hard-surface vintage computer terminal asset with retro CRT monitor curvature and modular cabling.",
    tag: "3D Prop Art",
    link: "#",
    thumbnail: "/images/RetroPc.png",
    mediaType: "image"
  },
  {
    title: "BumperBlitz",
    description: "Fast-paced browser arena bumper car combat with custom physics-driven collisions and destructive powerups.",
    tag: "Web Game",
    link: "https://sudo-sidd.itch.io/bumperblitz",
    thumbnail: "/images/bumperblitz.png",
    mediaType: "image"
  },
  {
    title: "Render Test",
    description: "Real-time volumetric render pipeline test built with chromatic aberration, glitch artifacts, and audio-reactive scanlines.",
    tag: "Technical Art",
    link: "#",
    thumbnail: "/images/HologramShader.png",
    mediaType: "image"
  },
  {
    title: "Urban Alley",
    description: "Atmospheric cyberpunk city alleyway with volumetric lighting, neon reflections, and high-fidelity environment detailing.",
    tag: "Environment Art",
    link: "#",
    thumbnail: "/videos/urban_alley.mp4",
    mediaType: "video"
  },

  // ── ROW 3 (Moves Right) ───────────────────────────────────────────────────
  // Midway visible slots: VR Chem Lab (Col 1), BumperBlitz (Col 2), Render Test (Col 3), Urban Alley (Col 4)
  {
    title: "The Secret Place",
    description: "Photorealistic natural sanctuary environment featuring dense cinematic foliage, real-time lighting, and atmospheric depth.",
    tag: "Environment Art",
    link: "#",
    thumbnail: "/videos/secret_place.mp4",
    mediaType: "video"
  },
  {
    title: "Urban Alley",
    description: "Atmospheric cyberpunk city alleyway with volumetric lighting, neon reflections, and high-fidelity environment detailing.",
    tag: "Environment Art",
    link: "#",
    thumbnail: "/videos/urban_alley.mp4",
    mediaType: "video"
  },
  {
    title: "Render Test",
    description: "Real-time volumetric render pipeline test built with chromatic aberration, glitch artifacts, and audio-reactive scanlines.",
    tag: "Technical Art",
    link: "#",
    thumbnail: "/images/HologramShader.png",
    mediaType: "image"
  },
  {
    title: "BumperBlitz",
    description: "Fast-paced browser arena bumper car combat with custom physics-driven collisions and destructive powerups.",
    tag: "Web Game",
    link: "https://sudo-sidd.itch.io/bumperblitz",
    thumbnail: "/images/bumperblitz.png",
    mediaType: "image"
  },
  {
    title: "VR Chem Lab",
    description: "Interactive spatial VR educational simulation empowering students to conduct safe, repeatable chemistry experiments in a digital laboratory on Meta Quest.",
    tag: "EdTech VR",
    link: "#",
    thumbnail: "/images/ChemLab.jpg",
    mediaType: "image"
  },
  {
    title: "Fake It Till You Sink",
    description: "A co-op management-chaos game about running a cruise ship with friends, feeding passengers, keeping systems online, and surviving escalating disasters.",
    tag: "Co-op Simulation",
    link: "https://sudosidd.dev/#projects",
    thumbnail: "/videos/fake-it-till-you-sink.mp4",
    mediaType: "video"
  },
  {
    title: "Retro PC",
    description: "High-poly hard-surface vintage computer terminal asset with retro CRT monitor curvature and modular cabling.",
    tag: "3D Prop Art",
    link: "#",
    thumbnail: "/images/RetroPc.png",
    mediaType: "image"
  }
];
