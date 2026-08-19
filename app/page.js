import TopBar from "@/app/components/TopBar";
import StoriesRow from "@/app/components/StoriesRow";
import SponsoredBanner from "@/app/components/SponsoredBanner";
import ChallengeCards from "@/app/components/ChallengeCards";
import Leaderboard from "@/app/components/Leaderboard";
import ActivityFeed from "@/app/components/ActivityFeed";
import BottomNav from "@/app/components/BottomNav";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-black">
      <TopBar />
      <main className="mx-auto w-full max-w-md flex-1 pb-24">
        <StoriesRow />
        <SponsoredBanner />
        <ChallengeCards />
        <Leaderboard />
        <ActivityFeed />
      </main>
      <BottomNav />
    </div>
  );
}
