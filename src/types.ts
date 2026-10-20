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

export interface TeamMember {
  name: string;
  email: string;
  phone?: string;
  discordTag: string;
  college?: string;
}

export interface GameJamEvent {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  badgeText: string;
  venue?: string;
  dates: string;
  inPersonDates?: string;
  duration: string;
  format: string;
  pricePerPerson: number;
  minTeamSize: number;
  maxTeamSize: number;
  theme: string;
  themeDescription: string;
  totalPrizePool: string;
  targetAudience?: string;
  inclusions?: string[];
  tracks: {
    name: string;
    description: string;
    icon: string;
    hardwareNotes: string;
  }[];
  schedule: {
    phase: string;
    time: string;
    description: string;
  }[];
  prizes: {
    place: string;
    reward: string;
    perks: string[];
    gradient: string;
  }[];
  esportsPrizes?: {
    game: string;
    platform: string;
    format: string;
    prize: string;
  }[];
  hospitality?: {
    day: string;
    items: string[];
  }[];
  rules: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface StudioTransmission {
  id: number;
  date: string;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
}

export interface TeamRegistrationPayload {
  registrationId: string;
  eventId: string;
  eventTitle: string;
  teamName: string;
  collegeName?: string;
  teamSize: number;
  totalAmount: number;
  track: string;
  leader: TeamMember;
  members: TeamMember[];
  paymentStatus: "PENDING" | "PAID" | "FREE";
  razorpayPaymentId?: string;
  notes?: string;
  submittedAt: string;
}
