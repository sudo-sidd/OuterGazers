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

export const WORKS_DATA: WorkItem[] = [
  // --- ROW 1 (Moves Right) : Alternating Video & Stills ---
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
    title: "Medieval Market",
    description: "Medieval market merchant trading simulation built for Android. Manage your stall, craft items, calculate change, and serve town patrons.",
    tag: "Android Simulation",
    link: "https://raghul-gem.itch.io/medival-market-simdemo",
    thumbnail: "/videos/market_sim.mp4",
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
    title: "The Secret Place",
    description: "Photorealistic natural sanctuary environment featuring dense cinematic foliage, real-time lighting, and atmospheric depth.",
    tag: "Environment Art",
    link: "#",
    thumbnail: "/videos/secret_place.mp4",
    mediaType: "video"
  },

  // --- ROW 2 (Moves Left in reverse) : Alternating Stills & Video ---
  {
    title: "MR Zombie Shooter",
    description: "Mixed reality survival shooter leveraging Meta Quest 3 room mesh mapping, passthrough, and spatial audio.",
    tag: "MR Game",
    link: "#",
    thumbnail: "/images/mr_zombie_shooter.jpg",
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
    title: "Hologram Shader",
    description: "Custom real-time volumetric scanline hologram shader built with chromatic aberration, glitch artifacts, and audio reactivity.",
    tag: "Technical Art",
    link: "#",
    thumbnail: "/images/HologramShader.png",
    mediaType: "image"
  },

  // --- ROW 3 (Moves Right) : Alternating Video & Stills ---
  {
    title: "Medieval Market",
    description: "Medieval market merchant trading simulation built for Android. Manage your stall, craft items, calculate change, and serve town patrons.",
    tag: "Android Simulation",
    link: "https://raghul-gem.itch.io/medival-market-simdemo",
    thumbnail: "/videos/market_sim.mp4",
    mediaType: "video"
  },
  {
    title: "MR Zombie Shooter",
    description: "Mixed reality survival shooter leveraging Meta Quest 3 room mesh mapping, passthrough, and spatial audio.",
    tag: "MR Game",
    link: "#",
    thumbnail: "/images/mr_zombie_shooter.jpg",
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
  }
];
