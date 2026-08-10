import ProgramDetail from "@/app/components/ProgramDetail";

export default async function ProgramPage({ params }) {
  const { id } = await params;
  return <ProgramDetail id={id} />;
}
