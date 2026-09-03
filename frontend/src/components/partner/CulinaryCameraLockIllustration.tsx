import React from 'react';

interface CulinaryCameraLockIllustrationProps {
  className?: string;
  size?: number | string;
}

export const CulinaryCameraLockIllustration: React.FC<CulinaryCameraLockIllustrationProps> = ({
  className = 'w-44 h-40 sm:w-52 sm:h-44',
  size
}) => {
  const inlineStyle = size ? { width: size, height: size } : undefined;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 340"
      fill="none"
      className={className}
      style={inlineStyle}
      role="img"
      aria-label="Culinary Camera Lock Illustration"
    >
      <defs>
        {/* Ambient Glow Backdrop with Terracotta, Saffron, and Dark Blue Midnight undertones */}
        <radialGradient id="culinaryGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EA580C" stopOpacity="0.45" />
          <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.2" />
          <stop offset="75%" stopColor="#1E3A8A" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0B1329" stopOpacity="0" />
        </radialGradient>

        {/* Fiery Terracotta to Deep Saffron */}
        <linearGradient id="terracottaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="45%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>

        {/* Saffron Amber Flame */}
        <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Midnight Blue & Metal Squircle */}
        <linearGradient id="darkMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="40%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#090D16" />
        </linearGradient>

        {/* Subtle Cyan-Blue Accent Line */}
        <linearGradient id="blueGlowAccent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#818CF8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9" />
        </linearGradient>

        {/* Glassmorphic Drop Shadow */}
        <filter id="cameraDropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#EA580C" floodOpacity="0.3" />
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#0F172A" floodOpacity="0.6" />
        </filter>

        <filter id="subtleChefShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Ambient Glow Backdrop */}
      <circle cx="200" cy="170" r="150" fill="url(#culinaryGlow)" />

      {/* Decorative Orbit / Dashed Frame Rings */}
      <circle
        cx="200"
        cy="170"
        r="125"
        stroke="#EA580C"
        strokeOpacity="0.22"
        strokeWidth="1.5"
        strokeDasharray="6 6"
      />
      <circle
        cx="200"
        cy="170"
        r="98"
        stroke="#38BDF8"
        strokeOpacity="0.2"
        strokeWidth="1"
        strokeDasharray="3 5"
      />
      <circle
        cx="200"
        cy="170"
        r="75"
        stroke="#F59E0B"
        strokeOpacity="0.15"
        strokeWidth="1"
      />

      {/* Floating Sparkles & Culinary Stars */}
      <circle cx="100" cy="85" r="3" fill="#F59E0B" />
      <path
        d="M100 73 L102 83 L112 85 L102 87 L100 97 L98 87 L88 85 L98 83 Z"
        fill="#FEF08A"
        opacity="0.9"
      />
      <circle cx="300" cy="95" r="2.5" fill="#38BDF8" />
      <path
        d="M300 85 L301.5 93 L310 95 L301.5 97 L300 105 L298.5 97 L290 95 L298.5 93 Z"
        fill="#F59E0B"
        opacity="0.9"
      />
      <circle cx="80" cy="225" r="2.5" fill="#38BDF8" opacity="0.7" />
      <circle cx="320" cy="215" r="3" fill="#EA580C" opacity="0.8" />

      {/* Main Camera Body Container (Rounded Modern Squircle) */}
      <g filter="url(#cameraDropShadow)">
        {/* Base dark midnight/slate chassis */}
        <rect
          x="110"
          y="105"
          width="180"
          height="135"
          rx="34"
          fill="url(#darkMetal)"
          stroke="#334155"
          strokeWidth="2"
        />
        {/* Inner high-heat & cyan rim glow */}
        <rect
          x="112"
          y="107"
          width="176"
          height="131"
          rx="32"
          stroke="url(#blueGlowAccent)"
          strokeWidth="1.2"
          strokeOpacity="0.75"
        />
      </g>

      {/* Video Camera Lens Assembly */}
      <circle cx="178" cy="172" r="46" fill="#0A0F1D" stroke="#334155" strokeWidth="2" />
      <circle
        cx="178"
        cy="172"
        r="38"
        fill="#111827"
        stroke="#EA580C"
        strokeWidth="1.5"
        strokeOpacity="0.7"
      />
      {/* Inner Glass Aperture with Terracotta / Blue Refraction */}
      <circle cx="178" cy="172" r="28" fill="url(#terracottaGrad)" opacity="0.3" />
      <circle cx="178" cy="172" r="20" fill="#050811" />
      <circle cx="173" cy="167" r="7" fill="#FFFFFF" opacity="0.45" />

      {/* Recording / REC Indicator in Camera Corner */}
      <circle cx="138" cy="132" r="5" fill="#EF4444">
        <animate attributeName="opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <rect x="148" y="128" width="22" height="8" rx="4" fill="#334155" opacity="0.8" />

      {/* Chef Toque (Hat) Crown on Top of the Camera */}
      <g filter="url(#subtleChefShadow)">
        {/* Base golden band of chef hat resting elegantly on the camera */}
        <path d="M152 98 C152 93, 208 93, 208 98 L206 108 L154 108 Z" fill="url(#amberGrad)" />
        {/* Chef Hat Puffs */}
        <path
          d="M142 98 C134 90, 138 72, 155 70 C155 60, 172 49, 185 51 C198 48, 215 56, 218 68 C232 72, 235 90, 226 98 Z"
          fill="#FFFFFF"
        />
        {/* Hat folds / shadow contours */}
        <path
          d="M165 72 C168 82, 169 94, 168 98"
          stroke="#E2E8F0"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M185 54 C186 68, 186 86, 186 98"
          stroke="#CBD5E1"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M205 70 C203 80, 201 92, 199 98"
          stroke="#E2E8F0"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* Partner Lock Security Badge Overlay (Front Right) */}
      <g filter="url(#cameraDropShadow)">
        {/* Shield / Badge Base */}
        <rect x="232" y="160" width="62" height="66" rx="18" fill="url(#terracottaGrad)" />
        <rect
          x="234"
          y="162"
          width="58"
          height="62"
          rx="16"
          stroke="#FEF08A"
          strokeWidth="1.5"
          strokeOpacity="0.8"
        />

        {/* Padlock Shackle */}
        <path
          d="M253 180 V173 C253 167.5 257.5 163 263 163 C268.5 163 273 167.5 273 173 V180"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Padlock Body */}
        <rect x="249" y="180" width="28" height="22" rx="6" fill="#FFFFFF" />
        {/* Keyhole / Star */}
        <circle cx="263" cy="189" r="3" fill="#C2410C" />
        <path d="M263 190 L263 195" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Food Steam / Savor Whiffs */}
      <path
        d="M255 125 C260 115, 252 108, 258 98"
        stroke="url(#amberGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M268 132 C273 122, 266 116, 272 106"
        stroke="url(#terracottaGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
};

export default CulinaryCameraLockIllustration;

