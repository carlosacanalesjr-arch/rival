import DealDetailScreen from "@/app/components/explore/DealDetailScreen";

export default async function DealDetailPage({ params }) {
  const { id } = await params;
  return <DealDetailScreen id={id} />;
}
