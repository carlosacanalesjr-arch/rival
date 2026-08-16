import AdminWeekList from "@/app/components/admin/AdminWeekList";

export default async function AdminLevelPage({ params }) {
  const { programId, levelKey } = await params;
  return <AdminWeekList programId={programId} levelKey={levelKey} />;
}
