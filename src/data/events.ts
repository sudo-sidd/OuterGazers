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
  googleSheetScriptUrl?: string;
  discordInviteUrl?: string;
  whatsappGroupUrl?: string;
  upiId?: string;
  upiPayeeName?: string;
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
  "dates": "Oct 27 – Nov 30, 2026",
  "inPersonDates": "November 30, 2026 (~12:00 PM at XR Lab, SIET)",
  "duration": "Online Jam + XR Lab Finale (Oct 27 – Nov 30)",
  "format": "Primarily Online Game Jam + Optional XR Lab Access",
  "pricePerPerson": 0,
  "minTeamSize": 3,
  "maxTeamSize": 4,
  "theme": "LIMITED SPACE · DEATH IS JUST A BEGINNING",
  "themeDescription": "Official themes announced! Choose 'LIMITED SPACE', 'DEATH IS JUST A BEGINNING', combine them both into a hybrid concept, or completely ignore them and build your dream game. 100% creative freedom for all SIET squads with zero penalty.",
  "totalPrizePool": "Inter-College Passes + XR Lab Mentorship",
  "targetAudience": "Exclusively for Students of Sri Shakthi Institute of Engineering and Technology (SIET)",
  "countdownTarget": "2026-11-27T11:00:00+05:30",
  "countdownLabel": "Jam Submission Closes In",
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
      "time": "Oct 27 – Nov 27, 2026 · Online",
      "description": "Open online registration portal. Verify SIET student roll numbers and form squads of 3 to 4 members. 100% Free Entry."
    },
    {
      "phase": "Phase 2: Remote Jam Phase",
      "time": "Oct 27 – Nov 27, 2026 · Online",
      "description": "Themes are live: 'LIMITED SPACE' and 'DEATH IS JUST A BEGINNING' (pick one, combine both, or completely ignore them). Teams conceptualize and build their games (Windows, Web, or Android) with mentor check-ins and optional XR Lab testing. Google Drive submission link provided in the final week."
    },
    {
      "phase": "Phase 3: Result Announcement",
      "time": "Nov 30, 2026 (~12:00 PM) · XR Lab, SIET",
      "description": "Official results and rankings announcement at XR Lab, SIET. Winner felicitations, certificates, and instructions for the December Inter-College event."
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
    "Theme Freedom & Creative Choice: The official themes are 'LIMITED SPACE' and 'DEATH IS JUST A BEGINNING'. Squads have complete creative freedom—you may choose one theme, combine both into a hybrid mechanic, or completely ignore them without penalty to build whatever game concept excites you.",
    "AI Disclosure (Mandatory in Readme): Generative AI tools are permitted during development (for coding, art, music, voiceover, etc.). However, full disclosure is mandatory: you MUST state in your submission's Readme file what AI tools were used and for which parts of the game (e.g. AI used for code debugging, 2D art generation, background music, etc.).",
    "Pre-Made Assets & Creator Credits: You are allowed to use pre-made 3D/2D models, audio, and open-source assets from other creators, provided you give clear attribution and credit to the original creators in your Readme file.",
    "Code & Asset Reuse from Previous Projects: You are fully allowed to reuse scripts, frameworks, shaders, and assets from your own previous projects to accelerate development.",
    "Remote Jamming: Development takes place online from Oct 27 until Nov 27, 2026. Teams may optionally request XR Lab access for testing.",
    "Submission Package & Drive: Teams must submit a single .ZIP file containing (1) the executable game build and (2) a Readme file/doc with game instructions, controls, squad roll numbers, third-party asset credits, previous project assets noted, and mandatory AI disclosure. An official Google Drive submission link will be provided during the last week of the jam.",
    "Submission Deadline: November 27, 2026 (11:00 AM IST). Final .ZIP package must be uploaded before deadline lock.",
    "Intellectual Property: Developers retain 100% copyright and IP ownership of their creations.",
    "Advancement to Inter-College Event: Top team wins free direct entry to the December Inter-College Game Jam; top runner-up teams earn tiered registration discounts."
  ],
  "faqs": [
    {
      "question": "What are the official themes, and do we have to follow them?",
      "answer": "The official themes are 'LIMITED SPACE' and 'DEATH IS JUST A BEGINNING'. You have total creative freedom: pick one theme, combine them both into a hybrid game, or completely ignore them! There are no point deductions or penalties if you choose not to use the themes."
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
      "answer": "No! There are NO separate tracks or divisions. All squads compete together under a unified game jam theme. Teams are free to develop their game for Windows PC, Web, or Android."
    },
    {
      "question": "What platforms can we develop for?",
      "answer": "You can develop games for Windows PC (standalone .exe), Web (HTML5/WebGL), or Android (.apk) using engines like Unity, Unreal Engine, Godot, GameMaker, Blender, or custom web frameworks."
    },
    {
      "question": "How do we submit our game?",
      "answer": "During the final week of the jam, an official Google Drive folder link will be shared with all registered squads via WhatsApp and Discord. Teams will upload a single .ZIP package containing: (1) the playable game executable build, and (2) a Readme file/document explaining the game, controls, team roll numbers, AI disclosure, and asset credits before the deadline on November 27, 2026 (11:00 AM IST)."
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
      "answer": "The game jam is primarily ONLINE. You can brainstorm and build from home or hostel between Oct 27 and Nov 27. Optional access to the SIET XR Lab is available for testing. Results will be announced on November 30, 2026 (~12:00 PM) at the XR Lab, SIET."
    },
    {
      "question": "What are the prizes and perks?",
      "answer": "Top-performing teams earn qualification spots for the upcoming December Inter-College Game Jam. The 1st place team receives 100% Free Entry, and other top-ranking teams get exclusive entry discounts based on rank. In addition, all qualifying teams get XR Lab access and mentorship."
    }
  ]
};

export const EVENTS_DATA: EventItem[] = [
  EMPTY_EVENT_TEMPLATE
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
