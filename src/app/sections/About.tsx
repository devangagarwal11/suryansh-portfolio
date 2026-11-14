"use client";

import { motion } from "framer-motion";
import { Instagram, Linkedin } from "lucide-react";
import { XLogo as Twitter } from "@/components/ui/Icons";
import Image from "next/image";
import { GlowCard } from "@/components/ui/spotlight-card";
import { RandomLetterSwapForward, RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap";
import { TextScramble } from "@/components/ui/text-scramble";
import { TextEffect } from "@/components/ui/text-effect";
import { SectionReveal } from "@/components/ui/SectionReveal";

export const About = () => {
  const skillGroups = [
    {
      title: "Tools",
      skills: [
        { name: "Adobe After Effects", desc: "Motion graphics, visual effects, and dynamic brand content" },
        { name: "Adobe Premiere Pro", desc: "Primary editor for cinematic commercial and video editing" },
        { name: "Adobe Photoshop", desc: "Compositing, retouching, and visual asset creation" },
        { name: "Canva", desc: "Quick social media assets and layout design" },
      ]
    },
    {
      title: "AI Tools",
      skills: [
        { name: "Suno AI", desc: "AI music generation for custom soundtracks and jingles" },
        { name: "HeyGen", desc: "AI avatars and talking-head video generation" },
        { name: "Claude", desc: "AI scripting, hooks and creative direction" },
        { name: "Higgsfield AI", desc: "High-fidelity AI video generation for brand storytelling" },
        { name: "Descript & Runway ML", desc: "AI-powered editing and text-to-video synthesis" },
        { name: "ChatGPT & Sora & ElevenLabs", desc: "AI writing, video generation, and voice synthesis" },
      ]
    },
    {
      title: "Creative Skills",
      skills: [
        { name: "Storytelling", desc: "Narrative-driven visual content and brand films" },
        { name: "Color Grading", desc: "Applying professional cinematic colour to raw footages" },
        { name: "Typography & Design", desc: "Kinetic typography and minimalist layout design" },
        { name: "Speed Ramping", desc: "Dynamic temporal effects for high-impact editing" },
      ]
    },
    {
      title: "Editing",
      skills: [
        { name: "3D Camera", desc: "Complex virtual camera movements and scene tracking" },
        { name: "Motion Graphics", desc: "Animated titles and dynamic ad pieces" },
        { name: "Audio Mixing", desc: "Cinematic sound design and audio engineering" },
        { name: "Rotoscoping", desc: "Precise subject isolation and masking" }
      ]
    }
  ];

  // Official company marks (from each company's own site), shown beside role + location.
  //  - wordmark: the brand's own wordmark on its brand colour (Smooche's official share-card look)
  //  - fill: app-style icon that already has its own background
  //  - plate: transparent mark that needs a light plate to read on the dark card
  type Logo = { src: string; alt: string; kind: "wordmark" | "fill" | "plate"; bg?: string };
  const experience: { role: string; company: string; loaction: string; desc: string; logo?: Logo }[] = [
    {
      role: "Video Editor Lead",
      company: "Smooche",
      loaction: "United States",
      desc: "Video Editor Lead managing multiple editing pods. I rolled out my Claude-powered AI workflow across the team, lifting both the speed and the quality of every ad, and the pod editors improved significantly. I work closely with strategists on creative briefs, cracking the customer psychology behind winning concepts, and keep researching advanced tools that push our output and win rate further.",
      logo: { src: "/images/logos/company-smooche.svg", alt: "Smooche", kind: "wordmark", bg: "#df8096" },
    },
    {
      role: "AI Ad Creator",
      company: "Mida Theory",
      loaction: "United States",
      desc: "Joined this brand-new startup in its launch month to build its AI video ads and statics. Within two weeks of joining, sales doubled (2x), turning a fresh launch into a brand that's already scaling.",
      logo: { src: "/images/logos/company-mida.webp", alt: "Mida Theory", kind: "fill" },
    },
    { 
      role: "Video Editor", 
      company: "Advanced Agent Mrketing", 
      loaction: "Greensboro, USA",
      logo: { src: "/images/logos/company-aam.webp", alt: "Advanced Agent Marketing", kind: "fill" },
      desc: "Created performance-driven video ads that generated qualified client appointments and achieved high CTRs through conversion-focused editing, compelling storytelling, and continuous creative optimization."
    },
    { 
      role: "Video Editor", 
      company: "Remotestar",
      loaction: "United Kingdom",
      logo: { src: "/images/logos/company-remotestar.webp", alt: "Remotestar", kind: "plate" },
      desc: "Edited engaging digital video content with strong storytelling, pacing, sound design, transitions, and platform-focused visual optimization."
    },
    { 
      role: "Video Editor", 
      company: "Pocket FM",
      loaction: "Banglore, India",
      logo: { src: "/images/logos/company-pocketfm.webp", alt: "Pocket FM", kind: "fill" },
      desc: "Part of the French content team, producing AI-assisted video episodes across multiple shows while maintaining narrative consistency, visual quality, and high-volume content production."
    },
    { 
      role: "Lead Video Editor", 
      company: "FRND app",
      loaction: "Banglore India",
      logo: { src: "/images/logos/company-frnd.svg", alt: "FRND", kind: "fill" },
      desc: "Led the PlayChat POD as Lead Video Editor, delivering expert-level DTC ad creatives and AI-powered video content; produced top-performing winning ads on Meta through performance-driven creative strategy, rapid testing, and conversion-focused editing."
    },
    { 
      role: "Video Editor & Designer", 
      company: "Freelancing",
      loaction: "", 
      desc: "Billion dollar brands. The United Nations. A screen in Times Square. My edits have driven $100 million plus in sales, and that is the number I cut for. Retention and conversion first, polish second."
    },
  ];

  return (
    <section id="about" className="relative pt-32 pb-24">
      {/* Transparent on purpose: the site-wide animated background (stars,
          streaks, smoke) continues from the hero through this section. The
          gradient at the bottom fades it into the solid All Work section
          so there is no hard edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#080808]"
      />
      <div className="relative max-w-[1300px] mx-auto px-6">
        {/* Section Header */}
        <SectionReveal variant="fade-up" className="flex justify-center mb-10">
          <p className="text-white/40 text-center max-w-md text-base font-medium">
            Brief initial presentation of myself and my core expertise.
          </p>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column — Profile Card */}
          <SectionReveal variant="fade-up" delay={0.1} className="lg:col-span-5">
            <div 
              className="p-8 rounded-[2rem] border border-white/10 bg-[#111] h-full flex flex-col"
            >
              <div className="relative aspect-[1/1] rounded-[1.5rem] overflow-hidden bg-[#1a1a1a] mb-10 group">
                {/* Profile Image */}
                <Image 
                  src="/images/suryansh/Profile.jpeg"
                  alt="Suryansh Srivastava"
                  fill
                  className="object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                
                {/* Available Badge */}
                <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c0c0c]/80 backdrop-blur-md border border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <span className="text-[9px] uppercase tracking-widest text-white/90 font-bold">Available for work</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-8">
                <h3 className="text-4xl font-serif text-white flex flex-wrap gap-x-3">
                  <span className="text-white">Hello I am</span>
                  <RandomLetterSwapForward
                    label="Suryansh"
                    className="text-white"
                  />
                  <RandomLetterSwapForward
                    label="Srivastava"
                    className="text-white/40"
                  />
                </h3>
                <p className="text-white/40 text-base">AI Visual Creator & Motion Artist Based in India.</p>
              </div>

              {/* Categorized Skills Grid */}
              <div className="flex flex-col gap-8 mb-12">
                {skillGroups.map((group) => (
                  <div key={group.title} className="flex flex-col gap-3">
                    <TextScramble 
                      className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold px-1"
                      duration={1}
                      characterSet="01"
                    >
                      {group.title}
                    </TextScramble>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <div key={skill.name} className="relative group/skill">
                          <span 
                            className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-white/60 text-[11px] font-medium hover:bg-white/10 hover:text-white transition-all cursor-help block"
                          >
                            {skill.name}
                          </span>
                          {/* Tooltip on Hover */}
                          <div className="absolute bottom-full left-0 mb-2 w-48 p-2 rounded-lg bg-[#1a1a1a] border border-white/10 text-[10px] text-white/60 opacity-0 invisible group-hover/skill:opacity-100 group-hover/skill:visible transition-all z-50 shadow-2xl pointer-events-none">
                            {skill.desc}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto flex items-center gap-6">
                {[
                  { Icon: Instagram, href: "https://www.instagram.com/maxx_editzdb?igsh=YXVnZXh6aHFkcmd5" },
                  { Icon: Linkedin, href: "https://www.linkedin.com/in/suryansh-srivastava0x2" },
                  { Icon: Twitter, href: "https://x.com/SuryanshSr38263" }
                ].map(({Icon, href}, i) => (
                  <motion.a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, color: "#fff" }}
                    className="text-white/20 transition-all"
                  >
                    <Icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </div>
          </SectionReveal>

          {/* Right Column — Detailed Bio */}
          <SectionReveal variant="fade-up" delay={0.25} className="lg:col-span-7 flex flex-col gap-6">
            <div 
              className="p-10 rounded-[2rem] border border-white/10 bg-[#111] flex flex-col gap-10 h-full justify-center"
            >
              {/* Bio */}
              <div className="flex flex-col gap-8">
                <h3 className="text-3xl md:text-5xl font-serif text-white tracking-tight flex flex-wrap items-center gap-x-2 md:gap-x-3 gap-y-1 md:gap-y-2">
                  <RandomLetterSwapPingPong label="Scroll-Stopping" />
                  <span>Creative.</span>
                  <span>Lower CAC.</span>
                  <span className="text-white/40 italic">Higher ROAS.</span>
                </h3>
                <div className="flex flex-col gap-6">
                  <TextEffect preset="blur" className="text-xl md:text-2xl text-white/80 leading-relaxed font-serif">
                    I direct AI video and motion design for YC startups and 8 and 9 figure DTC brands. 
                  </TextEffect>
                </div>

                <div className="h-px w-full bg-white/5" />

                {/* Experience List */}
                <div className="flex flex-col gap-6">
                  {experience.map((exp, i) => (
                    <div 
                      key={i}
                      className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 w-full text-white/80 group py-4 border-b border-white/5 last:border-0"
                    >
                      {/* Left: Company & Description */}
                      <div className="md:col-span-7 flex flex-col gap-1 md:gap-2">
                        <span className="text-lg font-medium group-hover:text-white transition-colors">
                          {exp.company}
                        </span>
                        <p className="text-sm text-white/30 leading-relaxed">
                          {exp.desc}
                        </p>
                      </div>
                      {/* Right: Role & Location, with the company's logo beside them */}
                      <div className="md:col-span-5 flex flex-row-reverse md:flex-row items-start justify-end gap-4 mt-2 md:mt-0">
                        <div className="flex flex-col gap-1 md:text-right md:items-end">
                          <span className="text-base text-white/40 group-hover:text-white/60 transition-colors whitespace-nowrap">
                            {exp.role}
                          </span>
                          <span className="text-sm font-mono text-white/10 group-hover:text-white/30 transition-colors uppercase whitespace-nowrap">
                            {exp.loaction}
                          </span>
                        </div>
                        {exp.logo && (
                          <div
                            className={
                              exp.logo.kind === "wordmark"
                                ? "flex h-10 shrink-0 items-center rounded-xl px-3 opacity-80 transition-opacity group-hover:opacity-100"
                                : exp.logo.kind === "plate"
                                ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 opacity-80 transition-opacity group-hover:opacity-100"
                                : "h-10 w-10 shrink-0 overflow-hidden rounded-xl opacity-80 transition-opacity group-hover:opacity-100"
                            }
                            style={exp.logo.bg ? { background: exp.logo.bg } : undefined}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={exp.logo.src}
                              alt={`${exp.logo.alt} logo`}
                              loading="lazy"
                              decoding="async"
                              className={exp.logo.kind === "wordmark" ? "h-2.5 w-auto" : "h-full w-full object-contain"}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionReveal>

        </div>
      </div>
    </section>
  );
};
