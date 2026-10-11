import React, { useState, useRef } from 'react';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onStartFullMock?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onStartFullMock }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const highlights = [
    'All Chapters Covered',
    'Latest Pattern MCQs',
    'Detailed Explanation',
    'Timed Tests (10/20/30 Min)',
    'Performance Analysis',
    'Hindi + English',
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle gentle tilt (-8 deg to +8 deg) without any zoom/scale
    const rx = -((y - centerY) / centerY) * 8;
    const ry = ((x - centerX) / centerX) * 8;

    setRotateX(rx);
    setRotateY(ry);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1d0b36] via-[#2c124d] to-[#140624] text-white p-5 sm:p-6 lg:p-7 shadow-xl border border-purple-900/40">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
        
        {/* Left Side: 3D Book Mockup with Pure Movement Animation (NO ZOOM) */}
        <div 
          className="relative shrink-0 select-none cursor-pointer group py-1"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1000 }}
        >
          {/* Subtle warm glow behind book */}
          <div 
            className={`absolute -inset-4 rounded-3xl bg-gradient-to-tr from-rose-600 via-pink-600 to-purple-600 blur-2xl transition-opacity duration-300 pointer-events-none ${
              isHovered ? 'opacity-50' : 'opacity-25'
            }`} 
          />

          {/* 3D Moving Container (Fixed Scale 1, Pure Tilt) */}
          <div 
            className="relative w-44 sm:w-52 md:w-56 lg:w-60 transform-gpu"
            style={{
              transform: isHovered
                ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
                : 'rotateX(0deg) rotateY(-4deg) translateY(0px)',
              transition: isHovered 
                ? 'transform 0.12s ease-out' 
                : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Real 3D Book Cover Image (No Zoom, Crisp & Natural) */}
            <img
              src="/src/assets/images/fatman_book_cover_1791546423682.jpg"
              alt="FATMAN GK/GS Theory Book 2nd Edition by Parmar Sir"
              referrerPolicy="no-referrer"
              className="w-full h-auto rounded-2xl shadow-2xl shadow-black/80 drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] object-contain"
            />
          </div>
        </div>

        {/* Center: Title & Subtitle */}
        <div className="flex-1 text-center lg:text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-bold tracking-wider">
            <span>PARMAR SSC</span>
            <span className="w-1 h-1 rounded-full bg-pink-400" />
            <span className="text-yellow-400">2ND EDITION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
            FATMAN
          </h1>

          <div className="text-2xl sm:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-purple-300">
            GK/GS TEST SERIES
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
            Subject Wise <span className="text-pink-400 mx-1">|</span> Chapter Wise <span className="text-pink-400 mx-1">|</span> Previous Year <span className="text-pink-400 mx-1">|</span> Full Syllabus
          </p>

          <div className="pt-2 flex items-center justify-center lg:justify-start gap-3">
            <span className="font-['Caveat',cursive] text-2xl sm:text-3xl text-pink-300 font-bold tracking-wide">
              Better Practice = Higher Score
            </span>
            <svg className="w-8 h-8 text-pink-400 -rotate-12 hidden sm:block" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>

        {/* Right Side: Features Checkmarks */}
        <div className="w-full lg:w-72 bg-black/25 backdrop-blur-sm rounded-2xl p-5 border border-purple-500/20 space-y-3">
          {highlights.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
              <span>{item}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
