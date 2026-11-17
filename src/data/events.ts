/**
 * ==============================================================================
 * OUTERGAZERS — EVENTS & GAME JAMS CONTENT CONFIGURATION
 * ==============================================================================
 *
 * This is the SINGLE file to add, remove, and edit everything in the Events section.
 * Every event listing follows the unified template below.
 * ==============================================================================
 */

import { GameJamEvent } from "../types";

export interface EventTrack {
  name: string;
  description: string;
  icon: string;
  hardwareNotes: string;
}

export interface EventSchedulePhase {
  phase: string;
  time: string;
  description: string;
}

export interface EventPrize {
  place: string;
  reward: string;
  perks: string[];
  gradient: string;
}

export interface EventEsportsPrize {
  game: string;
  platform: string;
  format: string;
  prize: string;
}

export interface EventHospitalityItem {
  day: string;
  items: string[];
}

export interface EventFaq {
  question: string;
  answer: string;
}

export interface EventItem extends GameJamEvent {
  featured?: boolean;
  countdownTarget?: string;
  countdownLabel?: string;
  registrationType: "modal" | "external";
  registrationUrl?: string;
  discordInviteUrl?: string;
  whatsappGroupUrl?: string;
  venue: string;
  inPersonDates: string;
  targetAudience: string;
  inclusions: string[];
  esportsPrizes?: EventEsportsPrize[];
  hospitality?: EventHospitalityItem[];
}

export const EMPTY_EVENT_TEMPLATE: EventItem = {
  "id": "siet-intra-gamejam-2026",
  "slug": "intracollege-gamejam-2026",
  "title": "IntraCollege - GameJam",
  "subtitle": "Collegiate Online Game Jam Exclusively for SIET Students",
  "status": "Upcoming",
  "badgeText": "Registrations Open · SIET Only",
  "featured": true,
  "venue": "Primarily Online, and optionally XR Lab, Sri Shakthi Institute of Engineering and Technology (SIET), Coimbatore",
  "dates": "Oct 29 – Nov 29, 2026",
  "inPersonDates": "Oct 29 – Nov 29, 2026",
  "duration": "Online Game Jam (Oct 29 – Nov 29, 2026)",
  "format": "Primarily Online Game Jam + Optional XR Lab Access",
  "pricePerPerson": 0,
  "minTeamSize": 3,
  "maxTeamSize": 4,
  "theme": "LIMITED SPACE · LOOPS",
  "themeDescription": "Official themes announced! Themes are mandatory for all SIET squads: choose 'LIMITED SPACE', 'LOOPS', or combine them both into a hybrid concept. Games must incorporate at least one of the official themes to qualify for judging and prizes.",
  "totalPrizePool": "Inter-College Passes + XR Lab Mentorship",
  "targetAudience": "Exclusively for Students of Sri Shakthi Institute of Engineering and Technology (SIET)",
  "countdownTarget": "2026-11-29T23:59:59+05:30",
  "countdownLabel": "Registrations & Submissions Close In",
  "registrationType": "modal",
  "registrationUrl": "",
  "googleSheetScriptUrl": "",
  "discordInviteUrl": "https://discord.gg/N4w7gGfdq",
  "whatsappGroupUrl": "https://chat.whatsapp.com/invite/temp-outergazers-siet-jam",
  "upiId": "outergazers@oksbi",
  "upiPayeeName": "OuterGazers Studio",
  "inclusions": [
    "100% Free Entry — Zero Registration Fee for SIET students",
    "Top Team qualifies with 100% Free Direct Entry into the December Inter-College Game Jam",
    "Ranked Runner-Up Teams receive exclusive ticket discounts for the Inter-College Jam",
    "Open Platform Freedom: Build for Windows PC, Web, or Android under a single unified category",
    "Hands-on XR Lab access at SIET with workstations and testing pipeline",
    "1-on-1 Mentorship from OuterGazers founders for game development & packaging",
    "Official OuterGazers Studio Certificate of Participation & Excellence"
  ],
  "tracks": [],
  "schedule": [
    {
      "phase": "Phase 1: Registration Window",
      "time": "Oct 29 – Nov 29, 2026 · Online",
      "description": "Open online registration portal. Verify SIET student roll numbers and form squads of 3 to 4 members. 100% Free Entry. Registrations strictly close on November 29, 2026 (11:59 PM IST)."
    },
    {
      "phase": "Phase 2: Remote Jam Phase",
      "time": "Oct 29 – Nov 29, 2026 · Online",
      "description": "Themes are live and mandatory: 'LIMITED SPACE' and 'LOOPS' (pick either theme or combine both). Teams conceptualize and build their games (Windows, Web, or Android) with mentor check-ins and optional XR Lab testing. Submissions close November 29, 2026 (11:59 PM IST)."
    },
    {
      "phase": "Phase 3: Submissions & Evaluation",
      "time": "Nov 29, 2026 (11:59 PM IST) · Online",
      "description": "Hard submission lockdown. Squads upload their executable builds (.ZIP package + readme) to Google Drive. Jury evaluation begins online with results announced via Discord."
    }
  ],
  "prizes": [
    {
      "place": "1st Place Winner (Top Team)",
      "reward": "100% Free Inter-College Entry",
      "perks": [
        "Guaranteed 100% Free Direct Entry into the flagship Inter-College Game Jam (December 2026)",
        "Priority workstation access to the state-of-the-art SIET XR Lab facilities",
        "Dedicated 1-on-1 development and production mentoring with OuterGazers leads",
        "End-to-end guidance for packaging, polishing, and showcasing your game",
        "Featured spotlight on OuterGazers platform and Official Winner Trophy & Certificate"
      ],
      "gradient": "from-[#00b4d8] to-[#7c3aed]"
    },
    {
      "place": "Top Ranked Finalists (Rank 2 & 3)",
      "reward": "Inter-College Entry Discounts",
      "perks": [
        "Exclusive ranked entry discounts for the December 2026 Inter-College Game Jam",
        "XR Lab access and device testing pipeline at SIET",
        "Technical review, shader and code polish sessions with studio mentors",
        "Full assistance to deploy, package, and showcase your game",
        "Official Certificate of Excellence & Finalist Honors"
      ],
      "gradient": "from-[#7c3aed] to-[#d946ef]"
    },
    {
      "place": "All Valid Submissions",
      "reward": "XR Lab Access & Mentorship",
      "perks": [
        "Official OuterGazers Studio Certificate of Participation",
        "Hands-on mentorship on portfolio creation and game distribution",
        "Optional hardware playtesting at SIET XR Lab",
        "Networking with fellow SIET student game developers"
      ],
      "gradient": "from-[#06b6d4] to-[#3b82f6]"
    }
  ],
  "rules": [
    "Eligibility: Exclusively for students currently enrolled at Sri Shakthi Institute of Engineering and Technology (SIET), Coimbatore. Valid student ID / roll number verification required.",
    "Zero Registration Fee: 100% Free Participation for all SIET students.",
    "Team Composition: Strictly a team event with 3 to 4 members per squad. All members must be currently enrolled SIET students.",
    "Unified Competition: No separate tracks or segregated divisions. All games compete under a single unified category. Supported platforms: Windows PC (.exe), Web (HTML5/WebGL), and Android (.apk).",
    "Mandatory Jam Themes: The official themes are 'LIMITED SPACE' and 'LOOPS'. Themes are mandatory—squads must choose either 'LIMITED SPACE', 'LOOPS', or combine both into a hybrid game mechanic. Games must incorporate at least one of the official themes to be eligible for judging, scoring, and prizes.",
    "AI Disclosure (Mandatory in Readme): Generative AI tools are permitted during development (for coding, art, music, voiceover, etc.). However, full disclosure is mandatory: you MUST state in your submission's Readme file what AI tools were used and for which parts of the game (e.g. AI used for code debugging, 2D art generation, background music, etc.).",
    "Pre-Made Assets & Creator Credits: You are allowed to use pre-made 3D/2D models, audio, and open-source assets from other creators, provided you give clear attribution and credit to the original creators in your Readme file.",
    "Code & Asset Reuse from Previous Projects: You are fully allowed to reuse scripts, frameworks, shaders, and assets from your own previous projects to accelerate development.",
    "Remote Jamming: Development takes place online from Oct 29 until Nov 29, 2026. Teams may optionally request XR Lab access for testing.",
    "Submission Package & Drive: Teams must submit a single .ZIP file containing (1) the executable game build and (2) a Readme file/doc with game instructions, controls, squad roll numbers, chosen theme, third-party asset credits, previous project assets noted, and mandatory AI disclosure. An official Google Drive submission link will be provided during the last week of the jam.",
    "Registration & Submission Deadline: November 29, 2026 (11:59 PM IST). Both registrations and final .ZIP submissions strictly close at deadline lock.",
    "Intellectual Property: Developers retain 100% copyright and IP ownership of their creations.",
    "Advancement to Inter-College Event: Top team wins free direct entry to the December Inter-College Game Jam; top runner-up teams earn tiered registration discounts."
  ],
  "faqs": [
    {
      "question": "What are the official themes, and do we have to follow them?",
      "answer": "Yes, following the themes is mandatory! The official themes are 'LIMITED SPACE' and 'LOOPS'. Squads must choose 'LIMITED SPACE', 'LOOPS', or combine both into a hybrid mechanic. Incorporating at least one official theme is required for judging and scoring."
    },
    {
      "question": "When do registrations and project submissions close?",
      "answer": "Both registrations and project submissions close on November 29, 2026 (11:59 PM IST). Teams must complete their squad registration and upload their playable game .ZIP before the deadline."
    },
    {
      "question": "Can we use AI tools, and what is the AI Disclosure rule?",
      "answer": "Yes, AI tools are permitted! However, if AI was used at any part of the development (such as for coding, generating 2D/3D art, music, voiceovers, or writing), you MUST mention it in your submission's Readme file. Clearly specify which AI tools were used and what they were used for (e.g. ChatGPT/Claude for coding logic, Midjourney for concept art, Suno for music, etc.). Full transparency is required."
    },
    {
      "question": "Can we use pre-made assets or scripts/assets from previous projects?",
      "answer": "Yes, absolutely! You are allowed to use pre-made assets (models, sprites, sound effects, music) from other creators—just remember to give proper credit to the original creators in your Readme. You are also fully allowed to reuse your own scripts, frameworks, shaders, and assets from previous projects."
    },
    {
      "question": "Are there separate tracks or disciplines?",
      "answer": "No! There are NO separate tracks or divisions. All squads compete together under the unified game jam themes. Teams are free to develop their game for Windows PC, Web, or Android."
    },
    {
      "question": "What platforms can we develop for?",
      "answer": "You can develop games for Windows PC (standalone .exe), Web (HTML5/WebGL), or Android (.apk) using engines like Unity, Unreal Engine, Godot, GameMaker, Blender, or custom web frameworks."
    },
    {
      "question": "How do we submit our game?",
      "answer": "During the final week of the jam, an official Google Drive folder link will be shared with all registered squads via WhatsApp and Discord. Teams will upload a single .ZIP package containing: (1) the playable game executable build, and (2) a Readme file/document explaining the game, controls, team roll numbers, chosen theme, AI disclosure, and asset credits before the deadline on November 29, 2026 (11:59 PM IST)."
    },
    {
      "question": "Who can participate in this Game Jam?",
      "answer": "This game jam is exclusively open to all students of Sri Shakthi Institute of Engineering and Technology (SIET), Coimbatore across all departments and academic years. Valid student IDs will be verified during registration."
    },
    {
      "question": "Is there any registration fee?",
      "answer": "No! There is absolutely NO entry fee. It is a 100% free intra-college event proudly supported by OuterGazers Studio and SIET XR Lab."
    },
    {
      "question": "What is the team size requirement?",
      "answer": "Participation is strictly team-based with 3 to 4 students per squad. Form a squad with fellow SIET students across any department or academic year."
    },
    {
      "question": "Where will the event take place?",
      "answer": "The game jam is primarily ONLINE. You can brainstorm and build from home or hostel between Oct 29 and Nov 29. Registrations and submissions both end on November 29, 2026 (11:59 PM IST). Optional access to the SIET XR Lab is available for testing. Results will be announced on November 30, 2026 (~12:00 PM) at the XR Lab, SIET."
    },
    {
      "question": "What are the prizes and perks?",
      "answer": "Top-performing teams earn qualification spots for the upcoming December Inter-College Game Jam. The 1st place team receives 100% Free Entry, and other top-ranking teams get exclusive entry discounts based on rank. In addition, all qualifying teams get XR Lab access and mentorship."
    }
  ]
};

export const INTERCOLLEGE_GAME_JAM: EventItem = {
  id: "intercollege-gamejam-2026",
  slug: "intercollege-gamejam-2026",
  title: "InterCollege - GameJam",
  subtitle: "A 24-hour onsite game jam for undergraduate students",
  status: "Upcoming",
  badgeText: "Registrations Open · Inter-College",
  venue: "XR Lab, Sri Shakthi Institute of Engineering and Technology (SIET), Coimbatore",
  dates: "December 15–16, 2026",
  inPersonDates: "December 15, 2026 (9:00 AM) – December 16, 2026 (12:00 PM)",
  duration: "24-hour onsite jam · December 15 (9:00 AM) – December 16 (9:00 AM)",
  format: "Two-day onsite game jam · 24-hour development window",
  pricePerPerson: 500,
  minTeamSize: 3,
  maxTeamSize: 4,
  theme: "5 themes announced at the jam",
  themeDescription:
    "All five official themes will be announced at 9:00 AM on Day 1. Teams create a small game within the 24-hour onsite jam window.",
  totalPrizePool: "₹18,000 estimated",
  targetAudience: "Undergraduate / bachelor's degree college students",
  countdownTarget: "2026-12-02T23:59:59+05:30",
  countdownLabel: "Registrations Close In",
  registrationType: "modal",
  googleSheetScriptUrl: "",
  discordInviteUrl: "https://discord.gg/N4w7gGfdq",
  whatsappGroupUrl: "https://chat.whatsapp.com/invite/temp-outergazers-siet-jam",
  upiId: "theprosidd@okicici",
  upiPayeeName: "The Prosidd",
  upiQrImageUrl: "/images/intercollege-upi-qr.png",
  inclusions: [
    "Full access to the two-day onsite XR Lab event",
    "Day 1 lunch and dinner; Day 2 breakfast",
    "Snacks, tea, coffee, and refreshments",
    "Official OuterGazers Studio certificate of participation",
  ],
  hospitality: [
    { day: "Day 1 · December 15", items: ["Lunch", "Dinner", "Snacks", "Tea, coffee, and refreshments"] },
    { day: "Day 2 · December 16", items: ["Breakfast", "Snacks", "Tea, coffee, and refreshments"] },
  ],
  tracks: [],
  schedule: [
    {
      phase: "Registration Window",
      time: "November 2 – December 2, 2026 · Online",
      description: "Register a team of 3 to 4 undergraduate students. The registration fee is ₹500 per participant.",
    },
    {
      phase: "Day 1 · Jam Kickoff & Theme Reveal",
      time: "December 15, 2026 · 9:00 AM",
      description: "Check in at the SIET XR Lab. Organizers announce all five themes and start the 24-hour onsite game jam.",
    },
    {
      phase: "Day 1 · Build & Hospitality",
      time: "December 15, 2026 · Onsite",
      description: "Teams design and build a small game at the venue. Lunch, dinner, snacks, tea, coffee, and refreshments are included.",
    },
    {
      phase: "Day 2 · Jam End & Submission",
      time: "December 16, 2026 · 9:00 AM – 10:00 AM",
      description: "The 24-hour development window ends at 9:00 AM. Final game submissions close at 10:00 AM.",
    },
    {
      phase: "Day 2 · Judging & Results",
      time: "December 16, 2026 · Results by 12:00 PM",
      description: "Judges evaluate the completed games and announce the results by noon.",
    },
  ],
  prizes: [
    {
      place: "Overall Winner",
      reward: "₹12,000",
      perks: ["Awarded to the team with the strongest overall game and player experience."],
      gradient: "from-[#00b4d8] to-[#7c3aed]",
    },
    {
      place: "Best Art",
      reward: "₹3,000",
      perks: ["Recognizes visual identity, asset quality, lighting, and cohesive artistic direction."],
      gradient: "from-[#7c3aed] to-[#d946ef]",
    },
    {
      place: "Best Game Mechanic",
      reward: "₹3,000",
      perks: ["Recognizes an inventive core mechanic and strong gameplay implementation."],
      gradient: "from-[#06b6d4] to-[#3b82f6]",
    },
  ],
  rules: [
    "Eligibility: Open to undergraduate / bachelor's degree college students. Participants may be asked to provide a valid student ID for verification.",
    "Team Composition: Participation is team-based, with 3 to 4 members per team.",
    "Registration Fee: ₹500 per participant. Each team member must be included in the team's registration and fee.",
    "Event Format: This is an onsite, 24-hour game jam at the SIET XR Lab. The jam starts at 9:00 AM on December 15, 2026. Participants must create their game during the jam window.",
    "Themes: Five official themes will be announced at 9:00 AM on Day 1. Teams must make a small game based on the announced themes within the jam timeframe.",
    "Submission Deadline: The 24-hour development period ends at 9:00 AM on December 16. Final submissions close at 10:00 AM on December 16, 2026. Late submissions may not be judged.",
    "AI Disclosure (Mandatory in Readme): Generative AI tools are permitted. Participants must disclose in their submission Readme which AI tools were used and for what (for example, coding, art, music, or voiceover).",
    "Pre-Made Assets & Creator Credits: Pre-made models, sprites, audio, and other third-party assets may be used if their original creators are clearly credited in the Readme.",
    "Code & Asset Reuse: Participants may reuse their own scripts, frameworks, shaders, and assets from previous projects. Any reused or third-party work must be identified and credited in the Readme.",
    "Submission Package: Submit a playable game build with a Readme containing the game description, controls, team members, theme(s), asset credits, and mandatory AI disclosure. Submission instructions will be provided to registered teams.",
    "Judging & Results: Games will be evaluated by the organizers/judges. Results will be announced by 12:00 PM on December 16, 2026.",
    "Intellectual Property: Participants retain copyright and intellectual-property ownership of their original creations.",
    "Conduct & Safety: Participants must follow venue instructions, respect other teams and equipment, and maintain a safe and inclusive environment throughout the onsite event.",
  ],
  faqs: [
    {
      question: "When and where is the event?",
      answer: "The onsite event is at the XR Lab, Sri Shakthi Institute of Engineering and Technology (SIET), Coimbatore, on December 15–16, 2026. The jam starts at 9:00 AM on December 15.",
    },
    {
      question: "How long is the game jam?",
      answer: "The development window is 24 hours, from 9:00 AM on December 15 until 9:00 AM on December 16. Teams have until 10:00 AM on Day 2 to submit their final build.",
    },
    {
      question: "What are the themes?",
      answer: "Five official themes will be announced at the 9:00 AM kickoff on Day 1. Teams create a small game based on the announced themes during the jam.",
    },
    {
      question: "Who can participate and how large can a team be?",
      answer: "The event is open to undergraduate / bachelor's degree college students. Teams must have 3 to 4 members.",
    },
    {
      question: "What is the registration fee?",
      answer: "Registration is ₹500 per person. The fee includes the two-day onsite event, meals, snacks, tea, coffee, and refreshments listed in the event brief.",
    },
    {
      question: "What should we include in our game submission?",
      answer: "Submit a playable game build and a Readme with the game description, controls, team members, selected theme(s), third-party asset credits, and any AI tools used. Submission instructions will be shared with registered teams.",
    },
    {
      question: "Can we use AI or pre-made assets?",
      answer: "AI tools and pre-made assets are permitted. Disclose AI use and credit third-party assets in the submission Readme.",
    },
    {
      question: "When will results be announced?",
      answer: "Results will be announced by 12:00 PM on December 16, 2026.",
    },
  ],
};

export const EVENTS_DATA: EventItem[] = [
  INTERCOLLEGE_GAME_JAM,
  EMPTY_EVENT_TEMPLATE,
];

export const FLAGSHIP_GAME_JAM: EventItem =
  EVENTS_DATA.find((e) => e.featured) || EVENTS_DATA[0];

export function getAllEvents(): EventItem[] {
  return EVENTS_DATA;
}

export function getActiveEvent(): EventItem {
  return EVENTS_DATA.find((e) => e.status !== "Completed") || EVENTS_DATA[0];
}

export function getEventBySlug(slug: string): EventItem | undefined {
  return EVENTS_DATA.find((e) => e.slug === slug);
}
