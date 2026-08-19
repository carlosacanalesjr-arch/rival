import EventDetailScreen from "@/app/components/explore/EventDetailScreen";

export default async function EventDetailPage({ params }) {
  const { id } = await params;
  return <EventDetailScreen id={id} />;
}
