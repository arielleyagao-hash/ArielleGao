import React, { useEffect, useState } from 'react';

export const BirthdayCake: React.FC = () => {
  const [stage, setStage] = useState(0);

  // Animation Sequence Controller
  useEffect(() => {
    // Stage 1: Tiers Rise (Start immediately)
    const t1 = setTimeout(() => setStage(1), 100);
    
    // Stage 2: Candles Appear (After tiers finish: ~1.5s)
    const t2 = setTimeout(() => setStage(2), 2000);
    
    // Stage 3: Candles Ignite (Sequential lighting starts)
    const t3 = setTimeout(() => setStage(3), 3000);
    
    // Stage 4: Banner Unfurls (After candles lit: ~4.5s)
    const t4 = setTimeout(() => setStage(4), 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a0b2e] overflow-hidden relative selection:bg-pink-500/30 font-sans">
      
      {/* Background Ambient Light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] transition-opacity duration-1000 ${stage >= 3 ? 'opacity-100' : 'opacity-50'}`}></div>
        <div className={`absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[80px] transition-all duration-1000 ${stage >= 3 ? 'opacity-80 scale-110' : 'opacity-30 scale-100'}`}></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl h-[600px] flex items-center justify-center">
        <svg viewBox="0 0 800 600" className="w-full h-full overflow-visible">
          <defs>
            {/* Gradients */}
            <linearGradient id="tier1Grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#831843" /> {/* Dark Pink */}
              <stop offset="50%" stopColor="#be185d" />
              <stop offset="100%" stopColor="#831843" />
            </linearGradient>
            <linearGradient id="tier2Grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#db2777" /> {/* Medium Pink */}
              <stop offset="50%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
            <linearGradient id="tier3Grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fce7f3" /> {/* Light Cream */}
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fce7f3" />
            </linearGradient>
            
            <linearGradient id="silkBanner" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bfdbfe" />
              <stop offset="30%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="70%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            
            <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Patterns */}
            <pattern id="stripes" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="10" height="20" fill="white" fillOpacity="0.1" />
            </pattern>
            <pattern id="dots" width="15" height="15" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#ec4899" fillOpacity="0.4" />
            </pattern>
            
            {/* Banner Path */}
            <path id="bannerCurve" d="M 200,100 Q 400,180 600,100" fill="none" />
          </defs>

          {/* === BANNER LAYER (Behind Cake) === */}
          <g 
            className={`transition-all duration-[2000ms] ease-out origin-center ${stage >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
            style={{ transformBox: 'fill-box' }}
          >
             {/* Left Banner Tail */}
             <path d="M 180,100 Q 150,120 180,140 L 220,120 Z" fill="#1e40af" 
                  className={`transition-all duration-1000 delay-500 ${stage >= 4 ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`} />
             {/* Right Banner Tail */}
             <path d="M 620,100 Q 650,120 620,140 L 580,120 Z" fill="#1e40af" 
                  className={`transition-all duration-1000 delay-500 ${stage >= 4 ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`} />

             {/* Main Banner Body */}
             <path 
                d="M 200,100 Q 400,180 600,100 L 600,150 Q 400,230 200,150 Z" 
                fill="url(#silkBanner)"
                stroke="#93c5fd"
                strokeWidth="2"
                style={{ filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.5))' }}
             />
             
             {/* Text on Path */}
             <text className="font-bold text-2xl tracking-widest" fill="white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                <textPath href="#bannerCurve" startOffset="50%" textAnchor="middle" alignmentBaseline="middle">
                   🎂 生日快乐 HAPPY BIRTHDAY 🎂
                </textPath>
             </text>
          </g>


          {/* === CAKE LAYER === */}
          <g transform="translate(400, 450)">
            
            {/* Bottom Tier (Tier 1) */}
            <g className={`transition-transform duration-1000 ease-out ${stage >= 1 ? 'translate-y-0' : 'translate-y-[400px]'}`}>
              {/* Main Body */}
              <path d="M -150,0 L -150,-80 Q 0,-60 150,-80 L 150,0 Q 0,40 -150,0" fill="url(#tier1Grad)" />
              <path d="M -150,0 L -150,-80 Q 0,-60 150,-80 L 150,0 Q 0,40 -150,0" fill="url(#stripes)" opacity="0.3" />
              {/* Top Surface */}
              <ellipse cx="0" cy="-80" rx="150" ry="25" fill="#9d174d" />
            </g>

            {/* Middle Tier (Tier 2) */}
            <g className={`transition-transform duration-1000 ease-out delay-500 ${stage >= 1 ? 'translate-y-0' : 'translate-y-[400px]'}`}>
               {/* Main Body */}
              <path d="M -100,-80 L -100,-150 Q 0,-130 100,-150 L 100,-80 Q 0,-60 -100,-80" fill="url(#tier2Grad)" />
              {/* Wave Decoration */}
              <path d="M -100,-120 Q -50,-100 0,-120 T 100,-120" fill="none" stroke="white" strokeWidth="3" opacity="0.5" />
               {/* Top Surface */}
              <ellipse cx="0" cy="-150" rx="100" ry="20" fill="#be185d" />
            </g>

            {/* Top Tier (Tier 3) */}
            <g className={`transition-transform duration-1000 ease-out delay-1000 ${stage >= 1 ? 'translate-y-0' : 'translate-y-[400px]'}`}>
              {/* Main Body */}
              <path d="M -60,-150 L -60,-200 Q 0,-190 60,-200 L 60,-150 Q 0,-130 -60,-150" fill="url(#tier3Grad)" />
              <path d="M -60,-150 L -60,-200 Q 0,-190 60,-200 L 60,-150 Q 0,-130 -60,-150" fill="url(#dots)" />
              {/* Top Surface */}
              <ellipse cx="0" cy="-200" rx="60" ry="12" fill="#fff1f2" />
              
              {/* Drip Icing */}
              <path d="M -60,-200 Q -50,-180 -40,-200 T -20,-200 T 0,-190 T 20,-200 T 40,-200 T 60,-200" 
                    fill="none" stroke="#fff1f2" strokeWidth="8" strokeLinecap="round" />
            </g>

            {/* === CANDLES === */}
            {/* 8 Candles distributed along the top arc */}
            {/* Arc: x = 50 * cos(a), y = -200 + 10 * sin(a) */}
            {[...Array(8)].map((_, i) => {
              const angle = Math.PI + (Math.PI / 9) * (i + 1); // Spread across back arc
              const x = 50 * Math.cos(angle);
              const y = -205 + 8 * Math.sin(angle);
              const delay = i * 200; // Sequential stagger

              return (
                <g key={i} transform={`translate(${x}, ${y})`}>
                  {/* Candle Stick */}
                  <g className={`transition-transform duration-500 ease-back-out`} 
                     style={{ 
                       transform: stage >= 2 ? 'scaleY(1)' : 'scaleY(0)', 
                       transformOrigin: 'bottom center',
                       transitionDelay: `${1500 + delay}ms` 
                     }}>
                    <rect x="-3" y="-25" width="6" height="25" rx="1" fill={`hsl(${i * 45}, 70%, 60%)`} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"/>
                    <line x1="0" y1="-25" x2="0" y2="-29" stroke="#666" strokeWidth="1" />
                  </g>

                  {/* Flame */}
                  <g className={`transition-opacity duration-300`} 
                     style={{ 
                       opacity: stage >= 3 ? 1 : 0, 
                       transitionDelay: `${3000 + delay}ms`
                     }}>
                    {/* Core Flame */}
                    <path d="M 0,-29 Q -3,-35 0,-42 Q 3,-35 0,-29" fill="#fbbf24" filter="url(#flameGlow)" className="animate-flicker" style={{ animationDelay: `${Math.random()}s` }} />
                    <path d="M 0,-30 Q -1,-34 0,-38 Q 1,-34 0,-30" fill="#fff" opacity="0.8" />
                    
                    {/* Particle Sparks */}
                    <circle cx="0" cy="-35" r="8" fill="url(#flameGlow)" opacity="0.2" className="animate-pulse" />
                  </g>
                </g>
              );
            })}

          </g>
        </svg>
      </div>

      <style>{`
        @keyframes flicker {
          0%, 100% { transform: scale(1) rotate(-2deg); opacity: 0.9; }
          50% { transform: scale(1.1) rotate(2deg); opacity: 1; }
        }
        .animate-flicker {
          animation: flicker 0.15s infinite alternate ease-in-out;
          transform-origin: center bottom;
        }
        .ease-back-out {
          transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
};
