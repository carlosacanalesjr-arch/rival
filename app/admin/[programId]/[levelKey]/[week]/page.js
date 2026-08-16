import AdminDayList from "@/app/components/admin/AdminDayList";

export default async function AdminWeekPage({ params }) {
  const { programId, levelKey, week } = await params;
  return <AdminDayList programId={programId} levelKey={levelKey} week={Number(week)} />;
}
