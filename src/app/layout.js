import { Bebas_Neue, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";
import IntroAnimation from "./components/IntroAnimation";
import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle";
import { PageTransitionProvider } from "./components/PageTransition";

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

const SITE_URL = "https://bansalsimran.com";
const OG_IMAGE = "/images/Personal_picture.jpg";

const HOME_TITLE = "Simran Bansal | Computer Engineering, Automotive & Software";
const HOME_DESCRIPTION =
  "Computer Engineering student and General Motors Continuous Improvement engineer. Pursuing automotive/manufacturing and software internships across Michigan, Canada & the US.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: "%s",
  },
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: SITE_URL,
    siteName: "Simran Bansal",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 1600,
        alt: "Simran Bansal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Simran Bansal",
  url: SITE_URL,
  jobTitle: "Continuous Improvement Engineer, General Motors",
  worksFor: {
    "@type": "Organization",
    name: "General Motors",
    url: "https://www.gm.com",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Alberta",
    url: "https://www.ualberta.ca",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Oshawa",
    addressRegion: "ON",
    addressCountry: "CA",
  },
  sameAs: [
    "https://www.linkedin.com/in/simransb",
    "https://github.com/ssbansal3",
  ],
  knowsAbout: [
    "Automotive Manufacturing",
    "Continuous Improvement",
    "Root Cause Analysis",
    "Full-Stack Development",
    "Data Engineering",
    "Power BI",
    "Databricks",
    "React",
    "Next.js",
  ],
  description:
    "Computer Engineering student pursuing automotive/manufacturing and software engineering internships, based in Ontario, open to opportunities in Michigan and across North America.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${bebasNeue.variable} ${dmSans.variable} ${caveat.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
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
