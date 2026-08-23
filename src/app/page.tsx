"use client";

import dynamic from "next/dynamic";
import { Navigation } from "@/components/ui/Navigation";
import { Hero } from "./sections/Hero";

// Below-the-fold sections: lazy-loaded to keep initial bundle lean
const About = dynamic(() => import("./sections/About").then(m => ({ default: m.About })), { ssr: true });
const AllWork = dynamic(() => import("./sections/AllWork"), { ssr: true });
const Process = dynamic(() => import("./sections/Process").then(m => ({ default: m.Process })), { ssr: true });
const Testimonials = dynamic(() => import("./sections/Testimonials").then(m => ({ default: m.Testimonials })), { ssr: true });
const FAQ = dynamic(() => import("./sections/FAQ").then(m => ({ default: m.FAQ })), { ssr: true });
const Contact = dynamic(() => import("./sections/Contact").then(m => ({ default: m.Contact })), { ssr: true });
const ResumeSection = dynamic(() => import("./sections/ResumeSection").then(m => ({ default: m.ResumeSection })), { ssr: true });
const Footer = dynamic(() => import("./sections/Footer").then(m => ({ default: m.Footer })), { ssr: true });

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="overflow-hidden">
        <Hero />
        <About />
        <AllWork />
        <Process />
        <ResumeSection />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
