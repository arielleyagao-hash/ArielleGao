import React from 'react';

export const BirthdayCake: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 overflow-hidden relative selection:bg-pink-500/30">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 animate-in fade-in zoom-in duration-1000 ease-out">
        {/* SVG Cake */}
        <div className="relative w-80 h-96 mx-auto animate-float drop-shadow-2xl">
          <svg viewBox="0 0 200 240" className="w-full h-full overflow-visible">
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="cakeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fbcfe8" />
                <stop offset="50%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
               <linearGradient id="icingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff1f2" />
                <stop offset="100%" stopColor="#fda4af" />
              </linearGradient>
            </defs>

            {/* Plate */}
            <ellipse cx="100" cy="220" rx="90" ry="15" fill="#e5e7eb" opacity="0.5" />
            <ellipse cx="100" cy="218" rx="85" ry="12" fill="#f3f4f6" />

            {/* Bottom Tier */}
            <path d="M40 170 L40 200 Q100 220 160 200 L160 170" fill="url(#cakeGradient)" />
            <ellipse cx="100" cy="170" rx="60" ry="15" fill="#fce7f3" />
            <path d="M40 170 Q50 185 60 170 T80 170 T100 170 T120 170 T140 170 T160 170" stroke="#fff1f2" strokeWidth="6" fill="none" strokeLinecap="round" />

            {/* Middle Tier */}
            <path d="M55 125 L55 170 Q100 185 145 170 L145 125" fill="url(#cakeGradient)" />
            <ellipse cx="100" cy="125" rx="45" ry="12" fill="#fce7f3" />
            <path d="M55 125 Q65 140 75 125 T95 125 T115 125 T135 125" stroke="#fff1f2" strokeWidth="6" fill="none" strokeLinecap="round" />

            {/* Top Tier */}
            <path d="M70 80 L70 125 Q100 135 130 125 L130 80" fill="url(#cakeGradient)" />
            <ellipse cx="100" cy="80" rx="30" ry="8" fill="#fff1f2" />
            {/* Drip Icing Top */}
            <path d="M70 80 Q75 95 80 80 T90 80 T100 90 T110 80 T120 80 T130 80" fill="#fff1f2" />

            {/* Candle */}
            <rect x="96" y="50" width="8" height="30" fill="#60a5fa" rx="1" />
            <path d="M96 55 L104 52 L96 58 L104 61" stroke="#93c5fd" strokeWidth="1" opacity="0.5"/>
            
            {/* Flame */}
            <g className="candle-flame">
               <path d="M100 50 Q105 40 100 30 Q95 40 100 50" fill="#fbbf24" filter="url(#glow)" />
               <path d="M100 48 Q103 42 100 36 Q97 42 100 48" fill="#f59e0b" />
            </g>

            {/* Sparkles */}
            <circle cx="20" cy="50" r="2" fill="white" className="animate-pulse" style={{animationDelay: '0.1s'}} />
            <circle cx="180" cy="80" r="3" fill="yellow" className="animate-pulse" style={{animationDelay: '0.5s'}} />
            <circle cx="150" cy="20" r="2" fill="white" className="animate-pulse" style={{animationDelay: '0.8s'}} />
          </svg>
        </div>

        <div className="text-center mt-8 relative z-20">
            <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)] mb-4 tracking-tight">
                Happy Birthday!
            </h1>
            <div className="inline-block px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-xl md:text-2xl text-pink-100 font-light tracking-[0.3em] font-mono">
                    25.12.2025
                </p>
            </div>
        </div>
      </div>
      
      {/* Dynamic Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
            <div 
                key={i}
                className="absolute w-2 h-2 md:w-3 md:h-3 rounded-sm opacity-80"
                style={{
                    backgroundColor: ['#F472B6', '#FBBF24', '#60A5FA', '#A78BFA', '#34D399'][i % 5],
                    left: `${Math.random() * 100}%`,
                    top: `-10%`,
                    animation: `fall ${3 + Math.random() * 4}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                    transform: `rotate(${Math.random() * 360}deg)`
                }}
            ></div>
        ))}
      </div>
      
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};