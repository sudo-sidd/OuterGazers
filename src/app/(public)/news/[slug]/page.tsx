import { FLAGSHIP_GAME_JAM } from "@/constants";
import EventDescriptionClient from "../../events/[slug]/EventDescriptionClient";

export function generateStaticParams() {
  return [{ slug: FLAGSHIP_GAME_JAM.slug }];
}

export default function NewsEventSlugPage() {
  return <EventDescriptionClient />;
}
