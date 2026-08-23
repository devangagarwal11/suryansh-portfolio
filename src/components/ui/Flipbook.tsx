"use client";

import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from "@/lib/utils";

interface FlipbookProps {
  items: {
    id: string;
    title: string;
    tag: string;
    src?: string;
  }[];
}

export function Flipbook({ items }: FlipbookProps) {
  const [currentSheet, setCurrentSheet] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Group pages into sheets (each sheet has a front page and a back page)
  const totalSheets = Math.ceil(items.length / 2);

  const next = () => {
    if (currentSheet < totalSheets) {
      setCurrentSheet(prev => prev + 1);
    }
  };

  const prev = () => {
    if (currentSheet > 0) {
      setCurrentSheet(prev => prev - 1);
    }
  };

  const reset = () => {
    setCurrentSheet(0);
  };

  // Touch Swipe Handlers
  const [startX, setStartX] = useState(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full select-none py-8">
      {/* 3D Perspective Area */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-[900px] aspect-[1.1/1] sm:aspect-[1.4/1] flex items-center justify-center"
        style={{ perspective: '1800px' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Desk Shadow */}
        <div 
          className="absolute -bottom-6 left-[5%] right-[5%] h-8 bg-black/45 blur-2xl rounded-full pointer-events-none transition-all duration-1000" 
          style={{ 
            transform: currentSheet === 0 || currentSheet === totalSheets
              ? 'scaleX(0.5)' 
              : 'scaleX(0.95)' 
          }} 
        />

        {/* 3D Book Container (Two pages wide) */}
        <div 
          className="relative w-[90%] sm:w-[94%] h-[85%] sm:h-[90%] transition-transform duration-1000"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: currentSheet === 0 
              ? 'translateX(-25%)' 
              : currentSheet === totalSheets 
                ? 'translateX(25%)' 
                : 'translateX(0)'
          }}
        >
          {/* Leather Backing Board Base (Transitions dynamically from closed cover to open book to closed back) */}
          <div 
            className="absolute transition-all duration-1000 bg-gradient-to-br from-[#1c1c1c] via-[#0f0f0f] to-[#080808] border-neutral-950 shadow-[0_30px_60px_rgba(0,0,0,0.85)] pointer-events-none z-0"
            style={{
              top: '-12px',
              bottom: '-12px',
              left: currentSheet === 0 ? '50%' : '-12px',
              right: currentSheet === totalSheets ? '50%' : '-12px',
              borderRadius: currentSheet === 0 
                ? '0 1.8rem 1.8rem 0' 
                : currentSheet === totalSheets 
                  ? '1.8rem 0 0 1.8rem' 
                  : '1.8rem',
              borderWidth: '6px',
              borderLeftWidth: currentSheet === 0 ? '0' : '6px',
              borderRightWidth: currentSheet === totalSheets ? '0' : '6px',
            }}
          >
            {/* Stitched Seam Seam Line Detail */}
            <div 
              className="absolute transition-all duration-1000 border border-dashed border-neutral-800"
              style={{
                top: '6px',
                bottom: '6px',
                left: currentSheet === 0 ? '0' : '6px',
                right: currentSheet === totalSheets ? '0' : '6px',
                borderRadius: currentSheet === 0 
                  ? '0 1.3rem 1.3rem 0' 
                  : currentSheet === totalSheets 
                    ? '1.3rem 0 0 1.3rem' 
                    : '1.3rem',
              }}
            />
          </div>

          {/* Wire binder spiral rings (12 tilted chrome spiral coils, visible when open) */}
          {currentSheet > 0 && currentSheet < totalSheets && (
            <div className="absolute left-1/2 top-[3%] bottom-[3%] w-[18px] -translate-x-1/2 z-[100] flex flex-col justify-between py-4 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-[34px] h-[5px] -ml-[8px] bg-gradient-to-b from-neutral-400 via-neutral-100 to-neutral-500 rounded-full shadow-[0_3px_5px_rgba(0,0,0,0.6)] border-t border-b border-black/40" 
                  style={{ transform: 'rotate(-8deg)' }}
                />
              ))}
            </div>
          )}

          {/* Render Sheets */}
          {[...Array(totalSheets)].map((_, idx) => {
            const sheetNum = idx + 1; // 1-indexed
            const isFlipped = sheetNum <= currentSheet;
            
            // Front page is at index idx * 2 (Page 1, 3, 5, 7, 9, 11)
            const frontPage = items[idx * 2];
            // Back page is at index idx * 2 + 1 (Page 2, 4, 6, 8, 10, 12)
            const backPage = items[idx * 2 + 1];

            // Stacking depths
            const zIndex = isFlipped ? sheetNum : totalSheets - sheetNum;

            return (
              <div
                key={idx}
                className="absolute left-1/2 top-0 w-1/2 h-full transition-transform duration-1000 ease-out select-none"
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'left center',
                  transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                  zIndex: zIndex,
                }}
              >
                {/* FRONT FACE (Visible when unflipped on the right side) */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-r-[1.5rem] overflow-hidden border border-white/10 bg-[#141414] flex flex-col shadow-[20px_15px_35px_rgba(0,0,0,0.6)]"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    zIndex: 2 
                  }}
                >
                  {/* Subtle inner page gutter shadow */}
                  <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/40 to-transparent pointer-events-none z-30" />
                  
                  {/* Spine punched holes along left gutter of the page */}
                  {currentSheet > 0 && (
                    <div className="absolute left-2.5 top-[3%] bottom-[3%] w-2 flex flex-col justify-between py-4 z-30 pointer-events-none">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-black border border-white/5 shadow-inner" />
                      ))}
                    </div>
                  )}

                  {frontPage ? (
                    <div className="relative w-full h-full flex flex-col p-1.5 xs:p-2 sm:p-2.5">
                      <div className="relative w-full flex-1 rounded-[0.8rem] sm:rounded-[1.2rem] overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-inner">
                        <img 
                          src={frontPage.src || ""} 
                          alt={frontPage.title}
                          className="w-full h-full object-contain pointer-events-none"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-3 sm:p-5 opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-1 sm:mb-1.5">{frontPage.tag}</span>
                          <h4 className="text-white text-xs sm:text-lg font-serif font-semibold">{frontPage.title}</h4>
                        </div>
                      </div>
                      
                      {/* Pagination Footnote */}
                      <div className="flex justify-between items-center px-3 sm:px-6 py-1.5 sm:py-2 text-[8px] sm:text-[10px] text-white/30 font-mono">
                        {/* Margins padded to avoid punching holes overlaying text */}
                        <span className="pl-4">{frontPage.tag}</span>
                        <span>{idx * 2 + 1}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-[#111] flex items-center justify-center text-white/20 font-serif">
                      End of Portfolio
                    </div>
                  )}

                  {/* Inner spine line highlight */}
                  <div className="absolute inset-y-0 left-0 w-[1px] bg-white/10 z-40" />
                </div>

                {/* BACK FACE (Visible when flipped to the left side) */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-l-[1.5rem] overflow-hidden border border-white/10 bg-[#141414] flex flex-col shadow-[-20px_15px_35px_rgba(0,0,0,0.6)]"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    zIndex: 1 
                  }}
                >
                  {/* Subtle inner page gutter shadow */}
                  <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/40 to-transparent pointer-events-none z-30" />

                  {/* Spine punched holes along right gutter of the page */}
                  <div className="absolute right-2.5 top-[3%] bottom-[3%] w-2 flex flex-col justify-between py-4 z-30 pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-black border border-white/5 shadow-inner" />
                    ))}
                  </div>

                  {backPage ? (
                    <div className="relative w-full h-full flex flex-col p-1.5 xs:p-2 sm:p-2.5">
                      <div className="relative w-full flex-1 rounded-[0.8rem] sm:rounded-[1.2rem] overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-inner">
                        <img 
                          src={backPage.src || ""} 
                          alt={backPage.title}
                          className="w-full h-full object-contain pointer-events-none"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-3 sm:p-5 opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-1 sm:mb-1.5">{backPage.tag}</span>
                          <h4 className="text-white text-xs sm:text-lg font-serif font-semibold">{backPage.title}</h4>
                        </div>
                      </div>
                      
                      {/* Pagination Footnote */}
                      <div className="flex justify-between items-center px-3 sm:px-6 py-1.5 sm:py-2 text-[8px] sm:text-[10px] text-white/30 font-mono">
                        <span>{idx * 2 + 2}</span>
                        <span className="pr-4">{backPage.tag}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-[#111] flex items-center justify-center text-white/20 font-serif">
                      End of Portfolio
                    </div>
                  )}

                  {/* Inner spine line highlight */}
                  <div className="absolute inset-y-0 right-0 w-[1px] bg-white/10 z-40" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic page clicking zones (transparent overlays over Left & Right pages) */}
        {/* Left click backward zone */}
        {currentSheet > 0 && (
          <div 
            onClick={prev} 
            className="absolute left-[3%] top-[5%] w-[44%] h-[90%] z-[95] cursor-w-resize rounded-l-[2rem] hover:bg-white/[0.01] transition-colors"
            title="Previous Page"
          />
        )}
        {/* Right click forward zone */}
        {currentSheet < totalSheets && (
          <div 
            onClick={next} 
            className="absolute right-[3%] top-[5%] w-[44%] h-[90%] z-[95] cursor-e-resize rounded-r-[2rem] hover:bg-white/[0.01] transition-colors"
            title="Next Page"
          />
        )}
      </div>

      {/* Book Control Panel */}
      <div className="flex flex-col items-center gap-5 sm:gap-6 mt-6 sm:mt-8 w-full max-w-[500px]">
        {/* Pagination spread bubbles */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap px-4">
          {/* Cover Bubble */}
          <button 
            onClick={() => setCurrentSheet(0)}
            className={cn(
              "px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[10px] font-mono tracking-widest uppercase rounded-full border transition-all duration-300",
              currentSheet === 0 
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold scale-105" 
                : "bg-white/5 text-white/30 border-white/5 hover:border-white/10 hover:text-white/60"
            )}
          >
            Cover
          </button>
          
          {/* Inside spreads */}
          {[...Array(totalSheets - 1)].map((_, idx) => {
            const spreadIdx = idx + 1; 
            const isCurrent = currentSheet === spreadIdx;
            const pageStart = spreadIdx * 2;
            const pageEnd = spreadIdx * 2 + 1;

            return (
              <button 
                key={spreadIdx}
                onClick={() => setCurrentSheet(spreadIdx)}
                className={cn(
                  "px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[10px] font-mono rounded-full border transition-all duration-300",
                  isCurrent 
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold scale-105" 
                    : "bg-white/5 text-white/30 border-white/5 hover:border-white/10 hover:text-white/60"
                )}
              >
                {pageStart}-{pageEnd}
              </button>
            );
          })}

          {/* Back Cover Bubble */}
          <button 
            onClick={() => setCurrentSheet(totalSheets)}
            className={cn(
              "px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[10px] font-mono tracking-widest uppercase rounded-full border transition-all duration-300",
              currentSheet === totalSheets 
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold scale-105" 
                : "bg-white/5 text-white/30 border-white/5 hover:border-white/10 hover:text-white/60"
            )}
          >
            End
          </button>
        </div>

        {/* Navigation panel */}
        <div className="flex items-center gap-3 sm:gap-8 bg-neutral-900/60 border border-white/5 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full backdrop-blur-md shadow-2xl mx-4">
          <button
            onClick={prev}
            disabled={currentSheet === 0}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-all"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <div className="flex flex-col items-center gap-0.5 min-w-[90px] sm:min-w-[120px] text-center">
            <span className="text-[8px] sm:text-[10px] uppercase font-mono tracking-widest text-white/30">
              {currentSheet === 0 ? "Front Cover" : currentSheet === totalSheets ? "Back Cover" : `Spread ${currentSheet} of ${totalSheets}`}
            </span>
            <span className="text-[10px] sm:text-xs font-serif italic text-white/70 font-semibold">
              {currentSheet === 0 ? "Page 1" : currentSheet === totalSheets ? `Page ${items.length}` : `Pages ${currentSheet * 2} - ${currentSheet * 2 + 1}`}
            </span>
          </div>

          <button
            onClick={next}
            disabled={currentSheet === totalSheets}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-all"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {currentSheet > 0 && (
            <div className="w-px h-6 bg-white/10" />
          )}

          {currentSheet > 0 && (
            <button
              onClick={reset}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-white/60 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all"
              title="Return to Cover"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
