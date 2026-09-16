"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from "@/lib/utils";
import { GlowCard } from '@/components/ui/spotlight-card';
import { RandomLetterSwapPingPong } from '@/components/ui/random-letter-swap';
import { Flipbook } from '@/components/ui/Flipbook';
import { SectionReveal } from '@/components/ui/SectionReveal';
import { MacbookShowcase } from '@/components/ui/MacbookShowcase';
import { TextScramble } from '@/components/ui/text-scramble';
interface WorkItem {
  id: string;
  title: string;
  tag: string;
  type: 'youtube' | 'cloudinary' | 'image';
  videoId?: string;
  src?: string;
  isVertical?: boolean;
  isSquare?: boolean;
}

const MediaContent = React.memo(({ item, isUnmuted, setUnmutedId }: { item: any, isUnmuted: boolean, setUnmutedId: (id: string | null) => void }) => {
  const [hasBeenSeen, setHasBeenSeen] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (hasBeenSeen) return; // Already loaded, no need to observe
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenSeen(true);
          observer.disconnect(); // Stop observing once loaded
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasBeenSeen]);

  // Handle Play/Pause logic
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newPlaying = !isPlaying;
    setIsPlaying(newPlaying);
    
    if (item.type === 'youtube') {
      const command = newPlaying ? 'playVideo' : 'pauseVideo';
      iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: command }), '*');
    } else if (videoRef.current) {
      newPlaying ? videoRef.current.play() : videoRef.current.pause();
    }
  };

  // Restart video helper
  const restartVideo = () => {
    if (item.type === 'youtube') {
      iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }), '*');
      iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
    } else if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
    setIsPlaying(true);
  };

  // Handle Mute/Unmute logic
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnmuted) {
      setUnmutedId(null);
    } else {
      setUnmutedId(item.id);
      restartVideo(); // Restart when manually unmuted
    }
  };

  // Sync mute state with global unmutedId
  React.useEffect(() => {
    if (item.type === 'youtube') {
      const command = isUnmuted ? 'unMute' : 'mute';
      iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: command }), '*');
    } else if (videoRef.current) {
      videoRef.current.muted = !isUnmuted;
    }
  }, [isUnmuted, item.type]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full overflow-hidden bg-[#0a0a0a] group/media cursor-pointer"
      onClick={() => {
        setUnmutedId(item.id);
        restartVideo();
      }}
    >
      {hasBeenSeen ? (
        <div className="absolute inset-0 w-full h-full">
          {item.type === 'youtube' ? (
            <div className={cn(
              "absolute w-[100%] h-[155%] -top-[27.5%] left-0 transform-gpu",
              item.isVertical ? "scale-[1.35]" : item.isSquare ? "scale-[1.45]" : "scale-[1.3]"
            )}>
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3&playlist=${item.videoId}&enablejsapi=1&playsinline=1`}
                className="w-full h-full border-none pointer-events-none"
                allow="autoplay; encrypted-media"
                title={item.title}
                loading="lazy"
              />
            </div>
          ) : (item.type === 'video' || (item.type === 'cloudinary' && item.src?.endsWith('.mp4'))) ? (
            <video
              ref={videoRef}
              src={item.src}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${item.src})` }}
            />
          )}

          {/* Overlay Controls */}
          {(item.type === 'youtube' || item.type === 'video' || (item.type === 'cloudinary' && item.src?.endsWith('.mp4'))) && (
            <>
              {/* Play/Pause Center Button */}
              <div 
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-300 z-10",
                  isPlaying ? "opacity-0 group-hover/media:opacity-100 group-hover/media:bg-black/20" : "opacity-100 bg-black/40"
                )}
              >
                <button 
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
                >
                  {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-1" fill="currentColor" />}
                </button>
              </div>

              {/* Mute Toggle Bottom Corner */}
              <div className="absolute bottom-4 right-4 z-20">
                <button 
                  onClick={toggleMute}
                  className={cn(
                    "w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300",
                    isUnmuted 
                      ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                      : "bg-black/40 text-white border-white/20 backdrop-blur-md hover:bg-white/10"
                  )}
                >
                  {isUnmuted ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div 
          className="w-full h-full bg-[#0a0a0a] bg-cover bg-center"
          style={{ 
            backgroundImage: item.type === 'youtube' 
              ? `url(https://img.youtube.com/vi/${item.videoId}/maxresdefault.jpg)` 
              : `url(${item.src})` 
          }}
        />
      )}
    </div>
  );
});

const optimizeCloudinaryUrl = (url: string) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  if (url.includes('upload/')) {
    return url.replace('upload/', 'upload/q_auto,f_auto,w_800/');
  }
  return url;
};

const VideoFrameGrid = null; // Removed

const AllWork = () => {
  const [selectedVideo, setSelectedVideo] = useState<WorkItem | null>(null);
  const [unmutedId, setUnmutedId] = useState<string | null>(null);

  const categories = useMemo(() => [
    {
      index: "01",
      name: "AI Videos",
      badge: "Series",
      accent: "#f5a623",
      cardType: "card-amber",
      subcategories: [
        {
          name: "AI/DTC",
          items: [
            { id: "ai-adv-1", title: "Visual Storytelling", tag: "Visual", type: "youtube", videoId: "_-egdW6Ca5Y", isVertical: true },
            { id: "ai-adv-5", title: "Product Advertisement 01", tag: "Ad", type: "youtube", videoId: "sJhBE6H2PMY", isVertical: true },
            { id: "ai-adv-7", title: "Product Advertisement 01", tag: "Ad", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1789548674/UGC_26_Huevia_V2.mp4", isVertical: true },
            { id: "ai-adv-8", title: "Product Advertisement 01", tag: "Ad", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1789548709/HOOK_3_1.mp4", isVertical: true },
            { id: "ai-adv-9", title: "Product Advertisement 01", tag: "Ad", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1789548706/VIDEO-1_1.mp4", isVertical: true },
            { id: "ai-adv-10", title: "Product Advertisement 01", tag: "Ad", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1789548710/VIDEO-2_1.mp4", isVertical: true },
            { id: "ai-adv-11", title: "Product Advertisement 01", tag: "Ad", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1789548715/VIDEO-4_1.mp4", isVertical: true },
            { id: "ai-adv-12", title: "Product Advertisement 01", tag: "Ad", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1787501928/CLEANTRA_HOOK_1_BODY.mp4", isVertical: true },
          ]
        },
        {
          name: "AI FILM MAKING/MICRODRAMAS",
          items: [
            { id: "ai-land-1", title: "Nature Synthesis", tag: "Visual Art", type: "youtube", videoId: "d3HpHGpXFuE" },
            // { id: "ai-land-2", title: "Atmospheric Environment", tag: "Landscape", type: "youtube", videoId: "xC_v-LddSJI" },
            // { id: "ai-land-3", title: "Ethereal Worlds", tag: "Landscape", type: "youtube", videoId: "QGRvL-vvtBI" },
            // { id: "ai-land-4", title: "Island", tag: "Landscape", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1787478552/Island_1.mp4" },
            // { id: "ai-land-5", title: "Chase1", tag: "Landscape", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1787479307/CHASE_PART_1_1.mp4" },
            // { id: "ai-land-6", title: "Chase2", tag: "Landscape", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1787479281/Chase_part_22_1_1.mp4" },
            // { id: "ai-land-7", title: "Chase2", tag: "Landscape", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1787502776/dragon_2_1.mp4" },
            { id: "ai-story-1", title: "AI Visual Journey", tag: "Story", type: "youtube", videoId: "DuD_8TXKV_E", isSquare: true },
            { id: "ai-story-2", title: "Cyberpunk Narrative", tag: "Story", type: "youtube", videoId: "WJS5_laqbno", isSquare: true }
          ]
        },
        {
          name: "Cartoon Advertisements",
          items: [
            { id: "ai-cart-1", title: "Animated Cartoon Feature", tag: "Animation", type: "youtube", videoId: "B3Yjbh1rXqg", isVertical: true },
            { id: "ai-cart-2", title: "Chase2", tag: "Cartoon", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1789549177/HOOK_1.mp4", isVertical: true },
          ]
        },
        
      ]
    },
    {
      index: "02",
      name: "Motion Graphics",
      accent: "#ff6b4a",
      cardType: "card-coral",
      subcategories: [
        {
          name: "Talking head Videos",
          items: [
            { id: "adv-v-1", title: "High-Impact Social Ad", tag: "Advertising", type: "youtube", videoId: "-MhFhPmehbg", isVertical: true },
            // { id: "adv-v-2", title: "Performance Marketing", tag: "Performance", type: "youtube", videoId: "ICPDfLbCpSo" },
            { id: "adv-v-3", title: "Brand Story Concept", tag: "Social", type: "youtube", videoId: "2lg3x2LiC6E", isVertical: true },
            { id: "adv-v-4", title: "AI Storytelling 03", tag: "Story", type: "youtube", videoId: "rQwvy-Tbx1A", isSquare: true },
            { id: "adv-v-5", title: "Performance Marketing", tag: "Performance", type: "youtube", videoId: "mIf5Fmr8t2E" },
            { id: "adv-v-7", title: "Performance Marketing", tag: "Performance", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1787504561/coasty_ai_1_1.mp4"},
            { id: "adv-v-8", title: "Performance Marketing", tag: "Performance", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1787504413/coaching.mp4"},
            { id: "adv-v-9", title: "Performance Marketing", tag: "Performance", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1787504409/RAM.mp4"},
            // { id: "adv-v-10", title: "Performance Marketing", tag: "Performance", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1787504408/high_paying_skill_final.mp4"},
            // { id: "adv-v-11", title: "Performance Marketing", tag: "Performance", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1787504407/Dragon_Fruit_Extended_6-2.mp4"},
            { id: "adv-v-12", title: "Performance Marketing", tag: "Performance", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1787504407/watch.mp4"},
            { id: "adv-v-6", title: "Performance Marketing", tag: "Performance", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1787504559/modulate_V2_V2_1.mp4", isVertical: true},
          ]
        },
        {
          name: "Launch/SAAS Videos",
          items: [
            { id: "launch-1", title: "LAUNCH 1", tag: "LAUNCH", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1787476160/Launch_Video-1_1.mp4" },
            // { id: "launch-2", title: "LAUNCH 1", tag: "LAUNCH", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1787501421/VANCO_1.mp4" },
            { id: "saas-1", title: "SAAS 1", tag: "SAAS", type: "youtube", videoId: "pzTZtvfVRRA" },
            // { id: "saas-2", title: "SAAS 2", tag: "SAAS", type: "youtube", videoId: "JM_Oc76sc5s" },
            { id: "saas-3", title: "SAAS 3", tag: "SAAS", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1787474710/SAAS-1.mp4" },
            { id: "saas-4", title: "SAAS 4", tag: "SAAS", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1789549853/linzumi_with_sfx.mp4" },
            { id: "saas-5", title: "SAAS 5", tag: "SAAS", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1789549859/rev_bubble_lab_draft_2.mp4" },
            { id: "saas-6", title: "SAAS 6", tag: "SAAS", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1789549862/marble_draft_2.mp4" },
            // { id: "saas-7", title: "SAAS 7", tag: "SAAS", type: "video", src: "https://res.cloudinary.com/v79qntig/video/upload/v1787502237/nikeeeeeeeee.mp4", isSquare: true },
          ]
        },
      ]
    },
    {
      index: "03",
      name: "Carousel",
      badge: "Featured",
      accent: "#00c8a8",
      cardType: "card-teal",
      subcategories: [
        {
          name: "Motion Graphics",
          items: [
            { id: "car-1", title: "Future Aesthetics", tag: "Concept", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1777788557/skills/Carousel/A1.jpg" },
            { id: "car-2", title: "Neon Pulse", tag: "Motion", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1777788561/skills/Carousel/A2.jpg" },
            { id: "car-3", title: "Cyber Flow", tag: "VFX", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1777788576/skills/Carousel/AA-1.jpg" },
            { id: "car-4", title: "Glitch Dream", tag: "Art", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1777788591/skills/Carousel/AA-2.jpg" },
            { id: "car-5", title: "Visual Flow", tag: "VFX", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1778095643/skills/Carousel/AA-3.jpg" },
            { id: "car-6", title: "Digital Pulse", tag: "Motion", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1777788624/skills/Carousel/AA-4.jpg" }
          ]
        }
      ]
    },
    {
      index: "04",
      name: "Menu",
      accent: "#10b981",
      cardType: "card-emerald",
      subcategories: [
        {
          name: "Brand Menus",
          items: [
            { id: "menu-1", title: "Menu Page 1", tag: "Design", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1778437639/skills/Menus/PAGE_1.jpg" },
            { id: "menu-2", title: "Menu Page 2", tag: "Design", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1778437647/skills/Menus/PAGE_2.jpg" },
            { id: "menu-3", title: "Menu Page 3", tag: "Design", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1778437649/skills/Menus/PAGE_3.jpg" },
            { id: "menu-4", title: "Menu Page 4", tag: "Design", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1778437650/skills/Menus/PAGE_4.jpg" },
            { id: "menu-5", title: "Menu Page 5", tag: "Design", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1778437652/skills/Menus/PAGE_5.jpg" },
            { id: "menu-6", title: "Menu Page 6", tag: "Design", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1778437653/skills/Menus/PAGE_6.jpg" },
            { id: "menu-7", title: "Menu Page 7", tag: "Design", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1778437654/skills/Menus/PAGE_7.jpg" },
            { id: "menu-8", title: "Menu Page 8", tag: "Design", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1778437657/skills/Menus/PAGE_8.jpg" },
            { id: "menu-9", title: "Menu Page 9", tag: "Design", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1778437659/skills/Menus/PAGE_9.jpg" },
            { id: "menu-10", title: "Menu Page 10", tag: "Design", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1778437641/skills/Menus/PAGE_10.jpg" },
            { id: "menu-11", title: "Menu Page 11", tag: "Design", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1778437643/skills/Menus/PAGE_11.jpg" },
            { id: "menu-12", title: "Menu Page 12", tag: "Design", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1778437645/skills/Menus/PAGE_12.jpg" }
          ]
        }
      ]
    },
    {
      index: "05",
      name: "Post Designs",
      accent: "#f472b6",
      cardType: "card-rose",
      subcategories: [
        {
          name: "Social Media",
          items: [
            { id: "post-1", title: "Modern Minimalist 01", tag: "Graphic", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1777790980/skills/Post%20designs/1.jpg" },
            { id: "post-2", title: "Branding Concept 02", tag: "Branding", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1777790982/skills/Post%20designs/2.jpg" },
            { id: "post-3", title: "Typography Study 03", tag: "Design", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1777790985/skills/Post%20designs/3.jpg" },
            { id: "post-4", title: "Digital Masterpiece 04", tag: "Art", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1777790991/skills/Post%20designs/4.png" },
            { id: "post-5", title: "Visual Identity 05", tag: "Branding", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1777791040/skills/Post%20designs/5.png" },
            { id: "post-6", title: "Content Design 06", tag: "Social", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1777791043/skills/Post%20designs/6.jpg" },
            { id: "post-7", title: "Impactful Visual 07", tag: "Graphic", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1778092736/skills/Post%20designs/7.jpg" },
            { id: "post-8", title: "Creative Layout 08", tag: "Design", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1778092738/skills/Post%20designs/8.jpg" },
            { id: "post-9", title: "Style Exploration 09", tag: "Art", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1778092749/skills/Post%20designs/9.jpg" },
            { id: "post-10", title: "Merchandise Concept A", tag: "Merch", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1777791103/skills/Post%20designs/merch-1.png" },
            { id: "post-11", title: "Merchandise Concept B", tag: "Merch", type: "image", src: "https://res.cloudinary.com/daeio5gbf/image/upload/v1777791118/skills/Post%20designs/merch-2.png" }
          ]
        }
      ]
    }
  ], []);

  return (
    <section id="projects" className="projects-section pt-40 pb-32 bg-[#080808] relative overflow-hidden font-sans">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section header */}
        <SectionReveal variant="fade-up" className="flex flex-col items-center text-center gap-6 mb-24">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 w-fit">
            <span className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">Portfolio Archive</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-serif text-white tracking-tight flex items-center gap-x-4">
            <RandomLetterSwapPingPong label="All" />
            <RandomLetterSwapPingPong label="Work" className="text-white/40 italic" />
          </h2>
        </SectionReveal>

        {/* Featured Showreel — MacBook Showcase */}
        <SectionReveal variant="fade-up" className="flex flex-col items-center text-center gap-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-white/20" />
              <TextScramble
                className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30"
                duration={1.2}
                characterSet="⊹⊡⊞⊟◈◇◆"
              >
                Featured Showreel
              </TextScramble>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-white/20" />
            </div>
            <h3 className="text-2xl md:text-4xl font-serif text-white tracking-tight flex flex-wrap items-center justify-center gap-x-2 md:gap-x-3">
              <RandomLetterSwapPingPong label="Click" className="text-white/90" />
              <RandomLetterSwapPingPong label="to explore" className="text-white/40 italic" />
              <RandomLetterSwapPingPong label="my best work" className="text-white/90" />
            </h3>
            <p className="text-sm text-white/30 max-w-md">
              Handpicked highlights from every category — tap a side video to bring it center stage
            </p>
          </motion.div>
        </SectionReveal>

        <MacbookShowcase />

        {categories.map((category) => (
          <SectionReveal 
            key={category.index} 
            id={`work-${category.name.toLowerCase().replace(/\s+/g, '-')}`} 
            variant="fade-up"
            className="mb-32 relative"
          >
            {/* Category Header */}
            {category.name !== "Post Designs" && (
              <div className="flex flex-col gap-4 mb-12">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-white/20 tracking-widest uppercase">0{category.index}</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>
                <div className="flex items-baseline gap-4">
                  <h3 className="text-4xl md:text-6xl font-serif text-white tracking-tight flex items-center gap-x-3">
                    <RandomLetterSwapPingPong label={category.name.split(' ')[0]} />
                    {category.name.split(' ').length > 1 && (
                      <RandomLetterSwapPingPong 
                        label={category.name.split(' ').slice(1).join(' ')} 
                        className="text-white/40 italic" 
                      />
                    )}
                  </h3>
                </div>
              </div>
            )}

            {category.subcategories.map((sub, sIdx) => {
              const landscapeItems = sub.items.filter(item => !((item as any).isVertical) && !((item as any).isSquare));
              const portraitItems = sub.items.filter(item => (item as any).isVertical && !((item as any).isSquare));
              const squareItems = sub.items.filter(item => (item as any).isSquare);

              return (
                <div key={sub.name} className={sIdx === 0 ? "mt-0" : "mt-24"}>
                  {sub.name !== "Advertisements" && category.name !== "Carousel" && (
                    <div className="flex items-center gap-4 mb-8">
                      <h4 className="text-xl md:text-2xl font-serif text-white/60 tracking-tight italic">
                        <RandomLetterSwapPingPong label={sub.name} />
                      </h4>
                      <div className="h-[1px] w-12 bg-white/10" />
                    </div>
                  )}

                  {category.name === "Menu" ? (
                    <Flipbook items={sub.items as any} />
                  ) : category.name === "Carousel" || category.name === "Post Designs" ? (
                    <div className="flex flex-col gap-10 -mx-12 overflow-hidden py-4">
                      <div className="carousel-track scroll-left">
                        {[...sub.items, ...sub.items].map((item: any, idx) => (
                          <div 
                            key={`row1-${idx}`} 
                            className="w-[200px] h-[270px] md:w-[260px] md:h-[350px] rounded-[1.8rem] overflow-hidden relative group cursor-pointer shrink-0 p-0 border border-white/10 bg-[#111] shadow-2xl"
                          >
                            <div 
                              className="w-full h-full relative"
                              onClick={() => setSelectedVideo(item as any)}
                            >
                              <img 
                                src={optimizeCloudinaryUrl(item.src)} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                alt={item.title}
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="carousel-track scroll-right">
                        {[...sub.items, ...sub.items].map((item: any, idx) => (
                          <div 
                            key={`row2-${idx}`} 
                            className="w-[200px] h-[270px] md:w-[260px] md:h-[350px] rounded-[1.8rem] overflow-hidden relative group cursor-pointer shrink-0 p-0 border border-white/10 bg-[#111] shadow-2xl"
                          >
                            <div 
                              className="w-full h-full relative"
                              onClick={() => setSelectedVideo(item as any)}
                            >
                              <img 
                                src={optimizeCloudinaryUrl(item.src)} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                alt={item.title}
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-8">
                      {/* Landscape Row */}
                      {landscapeItems.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-6">
                          {landscapeItems.map((item: any, idx) => {
                            const widthClass = landscapeItems.length === 4
                              ? "w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                              : "w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)]";
                            return (
                              <div key={item.id} className={cn(widthClass, "max-w-[420px] transform-gpu will-change-transform")}>
                                <motion.div 
                                  className="aspect-video rounded-[1.8rem] overflow-hidden relative group cursor-pointer p-0 border border-white/5 bg-[#111]"
                                >
                                  <div className="w-full h-full" onClick={() => {
                                    setSelectedVideo(item);
                                    setUnmutedId(null); // Mute gallery when modal opens
                                  }}>
                                    <MediaContent item={item} isUnmuted={unmutedId === item.id} setUnmutedId={setUnmutedId} />

                                  </div>
                                </motion.div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* Portrait Row */}
                      {portraitItems.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-6">
                          {portraitItems.map((item: any, idx) => {
                            const widthClass = portraitItems.length === 5
                              ? "w-[calc(50%-12px)] sm:w-[calc(33.33%-16px)] lg:w-[calc(20%-20px)]"
                              : "w-[calc(50%-12px)] sm:w-[calc(33.33%-16px)] lg:w-[calc(25%-18px)]";
                            return (
                              <div key={item.id} className={cn(widthClass, "max-w-[280px] transform-gpu will-change-transform")}>
                                <motion.div 
                                  className="aspect-[9/16] rounded-[1.8rem] overflow-hidden relative group cursor-pointer p-0 border border-white/5 bg-[#111]"
                                >
                                  <div className="w-full h-full" onClick={() => {
                                    setSelectedVideo(item);
                                    setUnmutedId(null); // Mute gallery when modal opens
                                  }}>
                                    <MediaContent item={item} isUnmuted={unmutedId === item.id} setUnmutedId={setUnmutedId} />

                                  </div>
                                </motion.div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Square Row */}
                      {squareItems.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-6">
                          {squareItems.map((item: any, idx) => (
                            <div key={item.id} className="w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] max-w-[340px] transform-gpu will-change-transform">
                              <motion.div 
                                className="aspect-square rounded-[1.8rem] overflow-hidden relative group cursor-pointer p-0 border border-white/5 bg-[#111]"
                              >
                                <div className="w-full h-full" onClick={() => {
                                  setSelectedVideo(item);
                                  setUnmutedId(null); // Mute gallery when modal opens
                                }}>
                                  <MediaContent item={item} isUnmuted={unmutedId === item.id} setUnmutedId={setUnmutedId} />

                                </div>
                              </motion.div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </SectionReveal>
        ))}
      </div>

      {/* Cinema Mode Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-10"
          >
            <button
              onClick={() => {
                setSelectedVideo(null);
              }}
              className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-[120]"
            >
              <X size={24} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black"
            >
              {selectedVideo.type === 'youtube' ? (
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
                  className="w-full h-full border-none"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  title={selectedVideo.title}
                />
              ) : selectedVideo.type === 'image' ? (
                <img src={selectedVideo.src} className="w-full h-full object-contain" alt={selectedVideo.title} />
              ) : (
                <video
                  src={selectedVideo.src}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AllWork;
