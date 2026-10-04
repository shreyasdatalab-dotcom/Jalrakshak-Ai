import React from 'react';

interface JalrakshakLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  lightText?: boolean;
}

export const JalrakshakLogo: React.FC<JalrakshakLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  showTagline = true,
  lightText = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-9',
    md: 'w-9 h-11',
    lg: 'w-12 h-15',
    xl: 'w-20 h-24',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const taglineSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision SVG recreating the JalRakshak AI water-drop + neural circuit tree */}
      <div className={`relative shrink-0 ${iconSizes[size]} flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 130"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(22,184,196,0.35)]"
        >
          <defs>
            {/* Water droplet gradient */}
            <linearGradient id="dropGradient" x1="50" y1="52" x2="50" y2="122" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#0284C7" />
              <stop offset="75%" stopColor="#1E40AF" />
              <stop offset="100%" stopColor="#0B1A30" />
            </linearGradient>

            {/* Inner fluid wave gradient */}
            <linearGradient id="waveGradient" x1="20" y1="85" x2="80" y2="115" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0284C7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.7" />
            </linearGradient>

            {/* Circuit glow gradient */}
            <linearGradient id="circuitGlow" x1="15" y1="5" x2="85" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#A5F3FC" />
              <stop offset="50%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#00E5FF" />
            </linearGradient>

            {/* Droplet glass highlight */}
            <linearGradient id="glassReflection" x1="30" y1="65" x2="45" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Circuit filter glow */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ================= CIRCUIT TREE (Rising out of drop) ================= */}
          <g stroke="url(#circuitGlow)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)">
            {/* Central trunk going into droplet */}
            <line x1="50" y1="58" x2="50" y2="38" />
            <line x1="50" y1="38" x2="50" y2="12" />

            {/* Left side branches */}
            <path d="M50 48 H42 V34 H32 V24" />
            <path d="M42 34 H36 V16" />
            <path d="M50 38 H44 V20 H38 V10" />
            <path d="M50 28 H38 V22 H24 V14" />
            <path d="M32 24 H22 V18" />
            <path d="M42 42 H30 V32 H20 V26" />

            {/* Right side branches */}
            <path d="M50 48 H58 V34 H68 V24" />
            <path d="M58 34 H64 V16" />
            <path d="M50 38 H56 V20 H62 V10" />
            <path d="M50 28 H62 V22 H76 V14" />
            <path d="M68 24 H78 V18" />
            <path d="M58 42 H70 V32 H80 V26" />
          </g>

          {/* Circuit terminal nodes (dots) */}
          <g fill="#A5F3FC">
            <circle cx="50" cy="10" r="2.8" />
            <circle cx="38" cy="8" r="2.4" />
            <circle cx="62" cy="8" r="2.4" />
            <circle cx="36" cy="14" r="2.2" />
            <circle cx="64" cy="14" r="2.2" />
            <circle cx="24" cy="12" r="2.5" />
            <circle cx="76" cy="12" r="2.5" />
            <circle cx="22" cy="16" r="2" />
            <circle cx="78" cy="16" r="2" />
            <circle cx="20" cy="24" r="2.2" />
            <circle cx="80" cy="24" r="2.2" />
            {/* Trunk node anchors */}
            <circle cx="46" cy="55" r="2" />
            <circle cx="54" cy="55" r="2" />
            <circle cx="50" cy="48" r="2" />
          </g>

          {/* ================= WATER DROPLET ================= */}
          {/* Main droplet body */}
          <path
            d="M50 50 C44 58 22 82 22 98 C22 113 34.5 124 50 124 C65.5 124 78 113 78 98 C78 82 56 58 50 50 Z"
            fill="url(#dropGradient)"
            stroke="#38BDF8"
            strokeWidth="1.2"
          />

          {/* Internal liquid wave */}
          <path
            d="M23 99 C30 92 40 106 52 101 C64 96 72 105 77 99 C78 107 72 122 50 122 C28 122 23 107 23 99 Z"
            fill="url(#waveGradient)"
          />

          {/* Light reflection glass arc on left */}
          <path
            d="M30 76 C26 84 26 96 30 104 C31 106 29 107 28 105 C24 96 24 83 28 74 C29 72 31 74 30 76 Z"
            fill="url(#glassReflection)"
          />

          {/* Ambient bright apex spec */}
          <ellipse cx="46" cy="68" rx="2.5" ry="5" transform="rotate(-25 46 68)" fill="#FFFFFF" fillOpacity="0.65" />
        </svg>
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span
              className={`font-extrabold tracking-tight ${textSizes[size]} ${
                lightText ? 'text-white' : 'text-[#0B1A30]'
              }`}
            >
              JalRakshak
            </span>
            <span
              className={`font-black tracking-tight ${textSizes[size]} text-[#16B8C4]`}
            >
              AI
            </span>
          </div>
          {showTagline && (
            <span
              className={`font-medium tracking-wide ${taglineSizes[size]} ${
                lightText ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              Detect. Dispatch. Save Water.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
