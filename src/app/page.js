"use client";
import Hero from "./components/Hero";
import WorksSection from "./components/WorksSection";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WorksSection />
      <AboutSection />
      <Footer />
    </>
  );
}
