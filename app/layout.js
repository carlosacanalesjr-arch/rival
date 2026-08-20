import { Geist, Geist_Mono } from "next/font/google";
import { ChallengesProvider } from "@/app/lib/ChallengesContext";
import { ProgramsProvider } from "@/app/lib/ProgramsContext";
import { AuthProvider } from "@/app/lib/AuthContext";
import { MediaProvider } from "@/app/lib/MediaContext";
import { ExerciseContentProvider } from "@/app/lib/ExerciseContentContext";
import { EventsProvider } from "@/app/lib/EventsContext";
import { DealsProvider } from "@/app/lib/DealsContext";
import { ReportsProvider } from "@/app/lib/ReportsContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kairos",
  description: "Train. Compete. Conquer.",
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black">
        <AuthProvider>
          <ChallengesProvider>
            <ProgramsProvider>
              <MediaProvider>
                <ExerciseContentProvider>
                  <EventsProvider>
                    <DealsProvider>
                      <ReportsProvider>{children}</ReportsProvider>
                    </DealsProvider>
                  </EventsProvider>
                </ExerciseContentProvider>
              </MediaProvider>
            </ProgramsProvider>
          </ChallengesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
