import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ChallengesProvider } from "@/app/lib/ChallengesContext";
import { FoundationProvider } from "@/app/lib/FoundationContext";
import { ProgramsProvider } from "@/app/lib/ProgramsContext";
import { AuthProvider } from "@/app/lib/AuthContext";
import { MediaProvider } from "@/app/lib/MediaContext";
import { ExerciseContentProvider } from "@/app/lib/ExerciseContentContext";
import { EventsProvider } from "@/app/lib/EventsContext";
import { DealsProvider } from "@/app/lib/DealsContext";
import { ThemeProvider } from "@/app/lib/ThemeContext";
import "./globals.css";

// Applies a saved explicit light/dark choice to <html> before first paint. Without this, a
// returning visitor whose choice diverges from their OS preference would see one frame (or more,
// on a slow connection) of the wrong theme before ThemeProvider's client-side effect catches up
// -- `next/script`'s beforeInteractive strategy (see the <Script> below) is Next's supported way
// to run something this early. Reads the same localStorage key as ThemeContext.js.
const NO_FLASH_THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("rival_theme_v1");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;

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
  // Native browser/OS chrome (e.g. Android's status bar) follows the system preference here —
  // it can't see the in-app Settings override, since that's applied via JS after the fact.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      // The beforeInteractive script above sets data-theme on this element before React
      // hydrates, based on localStorage the server can't see — that's an intentional mismatch
      // (the whole point of the script is to avoid a flash), not a bug, so it's suppressed here
      // rather than "fixed" the way a real SSR/client divergence should be.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background">
        <Script id="no-flash-theme" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
        <ThemeProvider>
          <AuthProvider>
            <ChallengesProvider>
              <FoundationProvider>
                <ProgramsProvider>
                  <MediaProvider>
                    <ExerciseContentProvider>
                      <EventsProvider>
                        <DealsProvider>{children}</DealsProvider>
                      </EventsProvider>
                    </ExerciseContentProvider>
                  </MediaProvider>
                </ProgramsProvider>
              </FoundationProvider>
            </ChallengesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
