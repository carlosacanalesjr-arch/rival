import AdminDayEditor from "@/app/components/admin/AdminDayEditor";

export default async function AdminDayPage({ params }) {
  const { programId, levelKey, week, day } = await params;
  return <AdminDayEditor programId={programId} levelKey={levelKey} week={Number(week)} day={Number(day)} />;
}
