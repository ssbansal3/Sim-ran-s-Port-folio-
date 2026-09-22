import Footer from "../components/Footer";

const RESUME_PDF = "/resumes/Resume(Jan_2026).pdf";

export const metadata = {
  title: "Resume | Simran Bansal",
  description:
    "View or download Simran Bansal's resume — Computer Engineering, automotive manufacturing, and software engineering experience.",
  alternates: {
    canonical: "/resume",
  },
  openGraph: {
    title: "Resume | Simran Bansal",
    description:
      "View or download Simran Bansal's resume — Computer Engineering, automotive manufacturing, and software engineering experience.",
    url: "/resume",
  },
  twitter: {
    title: "Resume | Simran Bansal",
    description:
      "View or download Simran Bansal's resume — Computer Engineering, automotive manufacturing, and software engineering experience.",
  },
};

export default function ResumePage() {
  return (
    <>
      <main className="min-h-[100dvh] bg-[var(--bg)]">
        <iframe
          src={RESUME_PDF}
          title="Simran Bansal — Resume (January 2026)"
          className="h-[100dvh] w-full border-0"
        />
      </main>
      <Footer />
    </>
  );
}
