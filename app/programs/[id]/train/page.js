import TrainingFlow from "@/app/components/TrainingFlow";

export default async function TrainPage({ params }) {
  const { id } = await params;
  return <TrainingFlow id={id} />;
}
