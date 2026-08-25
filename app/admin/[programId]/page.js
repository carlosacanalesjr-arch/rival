import AdminProgramRouter from "@/app/components/admin/AdminProgramRouter";

export default async function AdminProgramPage({ params }) {
  const { programId } = await params;
  return <AdminProgramRouter programId={programId} />;
}
