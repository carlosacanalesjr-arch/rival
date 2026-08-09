import ChallengeDetail from "@/app/components/ChallengeDetail";

export default async function ChallengePage({ params }) {
  const { id } = await params;
  return <ChallengeDetail id={id} />;
}
