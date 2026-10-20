import { Work, Founder, GameJamEvent, StudioTransmission } from "./types";

// ─── Studio Integrations & Config ─────────────────────────────────────────────
export const DISCORD_INVITE_URL = "https://discord.gg/N4w7gGfdq";

// Google Apps Script Web App URL for Sheets logging
export const GOOGLE_SHEET_SCRIPT_URL =
  process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || "";

// Razorpay Public Key ID (Safe for static client-side checkout)
export const RAZORPAY_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag";

// ─── Flagship Game Jam & Esports Showdown ──────────────────────────────────────
export const FLAGSHIP_GAME_JAM: GameJamEvent & {
  venue: string;
  inPersonDates: string;
  targetAudience: string;
  inclusions: string[];
  esportsPrizes: { game: string; platform: string; format: string; prize: string }[];
  hospitality: { day: string; items: string[] }[];
} = {
  id: "jam-esports-siet-2026",
  slug: "gamejam-esports-siet-2026",
  title: "Game Jam & Esports Showdown",
  subtitle: "Collegiate 72H Hybrid Jam & In-Person Finale at XR Lab, SIET",
  status: "Upcoming",
  badgeText: "Registrations Open",
  venue: "XR Lab, Sri Shakthi Institute of Engineering and Technology (SIET), Coimbatore",
  dates: "Nov 1 – Dec 18, 2026 (In-Person: Dec 17 – 18)",
  inPersonDates: "December 17 (10:00 AM) – December 18 (12:00 PM)",
  duration: "7-Day Hybrid (Remote Jam + 2-Day In-Person Finale)",
  format: "Hybrid: Online Remote Build + In-Person Finale & Esports",
  pricePerPerson: 800, // ₹800 per person
  minTeamSize: 3,
  maxTeamSize: 4,
  theme: "Secret Theme Announced on Dec 11, 2026",
  themeDescription:
    "The official Jam Theme is kept strictly confidential until Dec 11, 2026. Teams will have 6 days of remote development to build, followed by in-person check-in, polishing, and live showcase at the XR Lab.",
  totalPrizePool: "₹16,000",
  targetAudience: "Undergraduate / Bachelor's Degree College Students",
  inclusions: [
    "Full access to the 2-day in-person XR Lab event at SIET Coimbatore",
    "Complete Hospitality Package: Day 1 Lunch & Dinner, Day 2 Breakfast, high-tea & continuous refreshments",
    "Free direct entry into Day 2 Bonus Esports Tournaments (Valorant PC & EA Sports FC 26 PS5)",
    "Official participation certificates & OuterGazers Studio recognition",
  ],
  tracks: [
    {
      name: "PC Interactive Vanguard",
      description:
        "Desktop gameplay experiences built in Unreal Engine, Unity, Godot, or custom engines. Focusing on innovative gameplay loops, physics, and atmospheric polish.",
      icon: "Monitor",
      hardwareNotes: "Windows PC Build Target",
    },
    {
      name: "Meta Quest Spatial VR / XR",
      description:
        "Immersive 6DOF virtual and mixed reality experiences utilizing the SIET XR Lab headset pipeline and spatial interaction design.",
      icon: "Glasses",
      hardwareNotes: "Meta Quest Standalone APK or PCVR",
    },
    {
      name: "Augmented Reality (AR)",
      description:
        "Mobile AR and spatial passthrough experiences that augment physical surroundings with interactive digital layers.",
      icon: "Smartphone",
      hardwareNotes: "Android ARCore / iOS ARKit",
    },
    {
      name: "Android Mobile Vanguard",
      description:
        "Fast-paced responsive mobile games optimized for touch gestures, mobile GPUs, and tight game feel.",
      icon: "Cpu",
      hardwareNotes: "Android APK Build Target",
    },
  ],
  schedule: [
    {
      phase: "Phase 1: Registration Window",
      time: "Nov 1 – Dec 11, 2026",
      description: "Online portal open. Student verification, team formation (3-4 members), fee collection (₹800/head).",
    },
    {
      phase: "Phase 2: Theme Announcement",
      time: "Dec 11, 2026",
      description: "Official jam theme broadcast live on Discord. Submission portal opens.",
    },
    {
      phase: "Phase 3: Remote Jam Phase",
      time: "Dec 11 – Dec 17, 2026",
      description: "Teams conceptualize, prototype, and build their games remotely with mentor support.",
    },
    {
      phase: "Phase 4: In-Person Finale (Day 1)",
      time: "Dec 17, 2026 · 10:00 AM",
      description: "Check-in at XR Lab SIET, final packaging sprint, hard submission lock (1:00 PM), team pitches, and peer playtesting.",
    },
    {
      phase: "Phase 5: Awards & Esports (Day 2)",
      time: "Dec 18, 2026 · 09:00 AM",
      description: "Breakfast, Game Jam awards ceremony, followed by 1v1 Valorant (PC) & FC 26 (PS5) tournament showdowns.",
    },
  ],
  prizes: [
    {
      place: "Overall Game Jam Winner",
      reward: "₹8,000",
      perks: [
        "Highest combined score from Official Judges (70%) and Peer Voting (30%)",
        "Evaluated on cohesiveness, theme adherence, polish, loop completeness, and overall experience",
        "Featured showcase on outergazer.in & OuterGazers Studio incubation consideration",
      ],
      gradient: "from-[#00b4d8] to-[#7c3aed]",
    },
    {
      place: "Best Art & Visual Identity",
      reward: "₹2,000",
      perks: [
        "Awarded for visual identity, 2D/3D asset quality, shaders, lighting, UI layout, and artistic direction",
        "OuterGazers Art Department spotlight and technical review",
        "Official Certificate of Artistic Excellence",
      ],
      gradient: "from-[#7c3aed] to-[#d946ef]",
    },
    {
      place: "Best Game Mechanic & Innovation",
      reward: "₹2,000",
      perks: [
        "Awarded for core gameplay innovation, programming execution, physics/controls feel, and clever system design",
        "Direct code & gameplay mechanics review with founders",
        "Official Certificate of Technical Innovation",
      ],
      gradient: "from-[#06b6d4] to-[#3b82f6]",
    },
  ],
  esportsPrizes: [
    {
      game: "Valorant",
      platform: "PC (Lab Gaming Rig)",
      format: "1v1 Single / Double Elimination Bracket (Skirmish / Aim Map)",
      prize: "₹2,000 (Winner Takes All)",
    },
    {
      game: "EA Sports FC 26",
      platform: "PlayStation 5",
      format: "1v1 Knockout Bracket (4-min halves, 90-rated club teams)",
      prize: "₹2,000 (Winner Takes All)",
    },
  ],
  hospitality: [
    {
      day: "Day 1 (Dec 17)",
      items: [
        "11:30 AM: Beverage Station (Tea, Coffee, Biscuits, Hydration)",
        "01:00 PM: Full Lunch Service for all participants & crew",
        "05:00 PM: High-tea & hot snacks during showcase arcade transition",
        "08:30 PM: Full Dinner Service",
        "11:30 PM: Energy drinks, coffee, and late-night snacks",
      ],
    },
    {
      day: "Day 2 (Dec 18)",
      items: [
        "08:00 AM: Hot Breakfast & Tea/Coffee",
        "11:00 AM: Hydration & refreshments during Esports tournament matches",
      ],
    },
  ],
  rules: [
    "Target demographic: Undergraduate / Bachelor's Degree college students with valid college ID.",
    "Participation format is strictly a Team Event with exactly 3 to 4 members per team.",
    "Registration fee is ₹800 per individual member (₹2,400 for 3 members / ₹3,200 for 4 members) including all meals, XR Lab access, and Esports tournament entry.",
    "All game code, assets, and design built during the remote phase must respect the Dec 11 secret theme.",
    "Hard submission deadline is strictly 1:00 PM SHARP on Day 1 (Dec 17) at the XR Lab.",
    "Teams retain 100% intellectual property rights of their submitted games.",
    "Evaluation: 70% weight Official Judges + 30% weight Participant Peer Voting (teams must playtest at least 5 other games; cannot vote for own game).",
    "All registered participants get free entry into the Day 2 1v1 Valorant (PC) and EA Sports FC 26 (PS5) tournaments.",
  ],
  faqs: [
    {
      question: "Who is eligible to participate?",
      answer:
        "Any undergraduate or bachelor's degree college student with a valid student ID card. Inter-college teams are fully permitted!",
    },
    {
      question: "What is the team size and fee structure?",
      answer:
        "Registration is strictly team-based: 3 or 4 members per team. The entry fee is ₹800 per member (₹2,400 for a 3-person team, ₹3,200 for a 4-person team), which covers both days at the XR Lab, complete food/catering, and Esports entry.",
    },
    {
      question: "What hospitality and food is included?",
      answer:
        "Every registered participant receives Day 1 Lunch, Evening High-Tea & Snacks, Day 1 Dinner, Late-Night Refreshments, Day 2 Breakfast, and continuous coffee/tea hydration stations.",
    },
    {
      question: "How do the Bonus Esports Tournaments work?",
      answer:
        "Registered game jam participants get free entry into the Day 2 Esports Showdown featuring 1v1 Valorant on PC and 1v1 EA Sports FC 26 on PlayStation 5. Each game has a ₹2,000 Winner-Takes-All cash prize!",
    },
    {
      question: "Where is the in-person event located?",
      answer:
        "The XR Lab at Sri Shakthi Institute of Engineering and Technology (SIET), L&T Bypass, Chinniyampalayam, Coimbatore, Tamil Nadu.",
    },
    {
      question: "How does the hybrid timeline work?",
      answer:
        "Nov 1 to Dec 11: Register your squad online. Dec 11: Theme drops on Discord and remote hacking begins. Dec 17: Arrive at SIET XR Lab by 10:00 AM for packaging, pitching, and judging. Dec 18: Awards & Esports showdown until 12:00 PM.",
    },
  ],
};

// ─── Studio Transmissions & Logs ──────────────────────────────────────────────
export const STUDIO_TRANSMISSIONS: StudioTransmission[] = [
  {
    id: 1,
    date: "OCT 20, 2026",
    tag: "FLAGSHIP EVENT",
    title: "Game Jam & Esports Showdown Announced at SIET XR Lab, Coimbatore",
    excerpt:
      "OuterGazers partners with SIET XR Lab for an epic 2-day collegiate showdown on Dec 17–18. ₹16,000 prize pool, all meals included, plus 1v1 Valorant & FC 26 tournaments.",
    readTime: "3 MIN READ",
  },
  {
    id: 2,
    date: "OCT 02, 2026",
    tag: "TECH LOG",
    title: "Optimizing Custom Vulkan Compute Shaders for Meta Quest Hardware",
    excerpt:
      "A deep dive into our proprietary volumetric fog and temporal reprojection pipeline running locked at 90fps on standalone mobile Snapdragon XR2 Gen 2 chipsets.",
    readTime: "6 MIN READ",
  },
  {
    id: 3,
    date: "SEP 19, 2026",
    tag: "STUDIO LOG",
    title: "Vanguard Architecture: Why OuterGazers Builds Across 4 Frontiers",
    excerpt:
      "Bridging the divide between high-end desktop gaming and untethered spatial computing. How our unified asset pipeline powers PC, VR, AR, and Android simultaneously.",
    readTime: "4 MIN READ",
  },
];

// ─── Existing Studio Data ─────────────────────────────────────────────────────
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
  },
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
  },
];
