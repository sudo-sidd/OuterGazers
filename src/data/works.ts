/**
 * ==============================================================================
 * OUTERGAZERS — OUR WORKS CONTENT CONFIGURATION
 * ==============================================================================
 *
 * This is the SINGLE file to add, remove, and edit everything in the "Our Works" section.
 *
 * Each project entry supports:
 * - title:       Display title of the project (string)
 * - description: Brief description or tagline (string)
 * - tag:         Category or sector badge (e.g., "MR Game", "Co-Op", "Visual Arts")
 * - link:        External or internal URL (e.g., "https://itch.io/...", "#")
 * - thumbnail:   Path to image (/images/...) OR video (/videos/...)
 * - mediaType:   (Optional) "image" or "video". If omitted, auto-detected from file extension (.mp4, .webm, .mov)
 *
 * HOW TO ADD A NEW ITEM:
 * Just add an object to the WORKS_DATA array below:
 * {
 *   title: "My New Game",
 *   description: "A short summary of what makes this game special.",
 *   tag: "PC / VR",
 *   link: "https://your-link.com",
 *   thumbnail: "/images/your-image.jpg", // or "/videos/your-video.mp4"
 * }
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
  // ── Flagship Games & Interactive Experiences ────────────────────────────────
  {
    title: "Virtual Chemistry Lab",
    description: "Spatial training simulation transforming science education with repeatable, hazard-free digital experiments on Meta Quest.",
    tag: "Next-Gen EdTech",
    link: "#",
    thumbnail: "/images/ChemLab.jpg",
    mediaType: "image",
  },
  {
    title: "Fake It Till You Sink",
    description: "Chaotic co-op multiplayer party game. Work with friends to steer the yacht, fix leaks, and survive before the ship sinks.",
    tag: "Chaotic Co-Op",
    link: "#",
    thumbnail: "/videos/fake-it-till-you-sink.mp4",
    mediaType: "video",
  },
  {
    title: "BumperBlitz Arena",
    description: "Fast-paced browser arena bumper car combat with custom physics-driven collisions and destructive powerups.",
    tag: "Web Game",
    link: "https://sudo-sidd.itch.io/bumperblitz",
    thumbnail: "/images/bumperblitz.png",
    mediaType: "image",
  },
  {
    title: "MR Zombie Survival",
    description: "Mixed reality survival shooter leveraging Meta Quest 3 room mesh mapping, passthrough, and spatial audio.",
    tag: "MR Game",
    link: "#",
    thumbnail: "/videos/MR_Game.mp4",
    mediaType: "video",
  },
  {
    title: "Echoes of Reality",
    description: "Immersive mobile vanguard experience exploring alternative realities, responsive touch controls, and high-fidelity visuals.",
    tag: "Android Mobile",
    link: "#",
    thumbnail: "/videos/MobileGame.mp4",
    mediaType: "video",
  },
  {
    title: "Insta360 XR Spatial Lab",
    description: "Photogrammetry and 360-degree spatial environment capture pipeline for real-time 6DOF virtual inspection.",
    tag: "Spatial Capture",
    link: "#",
    thumbnail: "/images/insta360.jpg",
    mediaType: "image",
  },
  {
    title: "Urban Alley Environment",
    description: "Atmospheric cyberpunk environment showcase built with custom volumetric shaders, neon reflections, and real-time audio.",
    tag: "Environment Art",
    link: "#",
    thumbnail: "/videos/urban_alley.mov",
    mediaType: "video",
  },

  // ── 3D Environments & Visual Art Showcases ──────────────────────────────────
  {
    title: "Woodwalker Environment",
    description: "Dark fantasy wilderness environment featuring hand-crafted procedural foliage, atmospheric mist, and moody lighting.",
    tag: "Visual Arts",
    link: "#",
    thumbnail: "/images/woodwalker_bg_1789918462618.jpg",
    mediaType: "image",
  },
  {
    title: "Medieval Citadel XR",
    description: "Historical fortification reconstruction optimized for real-time spatial walkthroughs and dynamic daylight cycles.",
    tag: "Environment",
    link: "#",
    thumbnail: "/images/medieval_bg_1789918514585.jpg",
    mediaType: "image",
  },
  {
    title: "Chemistry VR Spatial",
    description: "Accurate physical molecular interactions and dynamic liquid simulation in a virtual chemistry workspace.",
    tag: "Simulation",
    link: "#",
    thumbnail: "/images/ChemLab.jpg",
    mediaType: "image",
  },
  {
    title: "Bumper Combat Arena",
    description: "Neon-drenched cyberpunk arena design with dynamic lighting, kinetic obstacles, and destructible barriers.",
    tag: "Arena Combat",
    link: "https://sudo-sidd.itch.io/bumperblitz",
    thumbnail: "/images/bumper_bg_1789918482955.jpg",
    mediaType: "image",
  },
  {
    title: "Visual Demo Showcase",
    description: "High-octane in-engine gameplay capture highlighting fluid combat, tight controller feedback, and Particle VFX.",
    tag: "Gameplay Demo",
    link: "#",
    thumbnail: "/videos/screen_recording.mp4",
    mediaType: "video",
  },
  {
    title: "BumperBlitz Concept Art",
    description: "Vehicle concept designs and aerodynamic styling studies for future high-speed bumper arena combatants.",
    tag: "Concept Art",
    link: "https://sudo-sidd.itch.io/bumperblitz",
    thumbnail: "/images/bumperblitz.png",
    mediaType: "image",
  },
  {
    title: "Vanguard Studio Engine",
    description: "Our unified C# gameplay architecture and custom Vulkan compute shader pipeline spanning PC, VR, AR, and Android.",
    tag: "Tech Architecture",
    link: "#",
    thumbnail: "/images/base1.jpg",
    mediaType: "image",
  },

  // ── Simulations, Shaders & Frontier Experiments ─────────────────────────────
  {
    title: "Action Showcase Trailer",
    description: "Cinematic reel capturing our flagship interactive combat mechanics, particle systems, and sound design.",
    tag: "Trailer",
    link: "#",
    thumbnail: "/videos/videoplayback.webm",
    mediaType: "video",
  },
  {
    title: "Woodwalker Nightmare",
    description: "Psychological horror prototype focusing on dynamic shadow stealth, adaptive AI behaviour, and claustrophobic spaces.",
    tag: "Horror Prototype",
    link: "#",
    thumbnail: "/images/woodwalker_bg_1789918462618.jpg",
    mediaType: "image",
  },
  {
    title: "Quest 3 Passthrough Rig",
    description: "Low-latency occlusion shaders allowing physical hands and real-world furniture to seamlessly occlude digital holograms.",
    tag: "MR Passthrough",
    link: "#",
    thumbnail: "/images/ChemLab.jpg",
    mediaType: "image",
  },
  {
    title: "Spatial 6DOF Environment",
    description: "Full six-degrees-of-freedom untethered roomscale virtual environment calibrated for precision interaction.",
    tag: "6DOF VR",
    link: "#",
    thumbnail: "/images/insta360.jpg",
    mediaType: "image",
  },
  {
    title: "Chaotic Co-Op Odyssey",
    description: "Low-latency client-side prediction and state synchronization ensuring lag-free boat handling across multi-user lobbies.",
    tag: "Multiplayer Netcode",
    link: "#",
    thumbnail: "/images/bumperblitz.png",
    mediaType: "image",
  },
  {
    title: "Arena Combat BumperBlitz",
    description: "Arena collision physics engine with customized impulse reaction curves and arcade torque simulation.",
    tag: "Physics Engine",
    link: "https://sudo-sidd.itch.io/bumperblitz",
    thumbnail: "/images/bumper_bg_1789918482955.jpg",
    mediaType: "image",
  },
  {
    title: "OuterGazers Vanguard Realities",
    description: "Pioneering the next generation of interactive worlds across PC, Android, Augmented Reality, and Meta Quest VR.",
    tag: "Studio Flagship",
    link: "#",
    thumbnail: "/images/logo_v2.png",
    mediaType: "image",
  },
];

export default WORKS_DATA;
