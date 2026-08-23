"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Star } from "lucide-react";
import Image from "next/image";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap";
import { SectionReveal } from "@/components/ui/SectionReveal";

export const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What services do you offer?",
      answer: "I specialize in AI video synthesis, professional video editing (Premiere Pro/After Effects), graphic design, and cinematic brand storytelling tailored for digital platforms."
    },
    {
      question: "How do I start working with you?",
      answer: "Simply fill out the contact form or send an email. We'll schedule a quick consultation to discuss your project goals, timelines, and visual requirements."
    },
    {
      question: "What AI tools do you use?",
      answer: "I leverage cutting-edge tools like Veo 3, Nano Banana, Higgsfield AI, and Runway ML for synthesis, combined with industry-standard Adobe Creative Cloud for final polish."
    },
    {
      question: "How long does a project take?",
      answer: "Timelines depend on complexity, but most AI-driven ad campaigns and cinematic edits are delivered within 7 to 14 business days."
    },
    {
      question: "Do you provide revisions?",
      answer: "Absolutely. I offer a structured revision process to ensure the final output perfectly matches your brand's vision and performance goals."
    }
  ];

  return (
    <section id="faq" className="py-32 bg-[#0c0c0c]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Left Side: Info & Testimonial */}
          <SectionReveal variant="fade-up" delay={0.1} className="lg:col-span-5 flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 flex items-center gap-2 w-fit">
                <span className="text-[10px] text-white">⊙</span>
                <span className="text-xs font-medium uppercase tracking-widest text-white/80">FAQ Section</span>
              </div>
              <h2 className="text-6xl font-serif text-white flex flex-wrap gap-x-4">
                <RandomLetterSwapPingPong label="Questions," />
                <RandomLetterSwapPingPong label="Answers" className="text-white/40 italic" />
              </h2>
              <p className="text-white/40 text-lg">
                Get quick answers to your most pressing questions.
              </p>
            </div>

            {/* Featured Testimonial Card */}
            <div className="p-8 rounded-[2rem] border border-white/10 bg-white/[0.02] relative group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden relative border border-white/10">
                  <div className="absolute inset-0 bg-[#333] flex items-center justify-center text-white/20 font-bold">RJ</div>
                </div>
                <div>
                  <h4 className="text-white font-serif text-xl">Ryan Harper</h4>
                  <p className="text-white/40 text-sm">Harper Education</p>
                </div>
              </div>
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-white text-white" />
                ))}
                <span className="text-white text-sm ml-2">5.0</span>
              </div>
              <p className="text-white/60 leading-relaxed italic">
                "Exceptional creativity and attention to detail! The final product not only looks great but also enhances user engagement significantly."
              </p>
            </div>

            <div className="flex gap-4">
              <LiquidButton 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg"
              >
                See All Projects
              </LiquidButton>
              <LiquidButton 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg"
              >
                Contact Now
              </LiquidButton>
            </div>
          </SectionReveal>

          {/* Right Side: Accordion */}
          <SectionReveal variant="fade-up" delay={0.2} className="lg:col-span-7 flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <div 
                key={i}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-500"
              >
                <button
                  onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <span className={`text-xl font-serif transition-colors duration-500 ${activeIndex === i ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-500 ${activeIndex === i ? 'bg-white text-black border-white' : 'text-white/40 group-hover:text-white'}`}>
                    {activeIndex === i ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>

                <AnimatePresence>
                  {activeIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <div className="px-8 pb-8 text-white/40 leading-relaxed max-w-2xl">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </SectionReveal>

        </div>
      </div>
    </section>
  );
};
