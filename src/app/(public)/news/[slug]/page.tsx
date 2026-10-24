import { getAllEvents, getEventBySlug, FLAGSHIP_GAME_JAM } from "@/constants";
import EventDescriptionClient from "../../events/[slug]/EventDescriptionClient";

export function generateStaticParams() {
  return getAllEvents().map((e) => ({ slug: e.slug }));
}

export default function NewsEventSlugPage({ params }: { params?: { slug?: string } }) {
  const event = (params?.slug && getEventBySlug(params.slug)) || FLAGSHIP_GAME_JAM;
  return <EventDescriptionClient event={event} />;
}
