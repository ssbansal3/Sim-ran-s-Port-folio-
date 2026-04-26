import { Bebas_Neue, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";
import IntroAnimation from "./components/IntroAnimation";
import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle";
import { PageTransitionProvider } from "./components/PageTransition";

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata = {
  title: "Simran Bansal",
  description: "Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${bebasNeue.variable} ${dmSans.variable} ${caveat.variable}`}>
        <PageTransitionProvider>
          <IntroAnimation>
            <Navbar />
            <main id="page-content" style={{ opacity: 0 }}>
              {children}
            </main>
            <ThemeToggle />
          </IntroAnimation>
        </PageTransitionProvider>
      </body>
    </html>
  );
}
