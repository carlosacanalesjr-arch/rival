import ProfileScreen from "@/app/components/ProfileScreen";

export default async function ProfilePage({ params }) {
  const { id } = await params;
  return <ProfileScreen id={id} />;
}
