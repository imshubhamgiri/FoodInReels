import React from 'react';

interface CulinaryCameraLockIllustrationProps {
  className?: string;
  size?: number | string;
}

/**
 * Minimalist Paper-Craft Culinary Camera & Partner Lock Illustration
 * High-performance vector graphic:
 * - Zero expensive SVG `<filter>` / `<feDropShadow>` matrices (GPU friendly)
 * - Zero continuous SMIL `<animate>` loops (prevents continuous repaints)
 * - Dual-theme support: pure paper white with subtle layered shadows in light mode,
 *   and sleek midnight dark with cool sky-blue / cyan accents in dark mode.
 */
export const CulinaryCameraLockIllustration: React.FC<CulinaryCameraLockIllustrationProps> = ({
  className = 'w-40 h-36 sm:w-48 sm:h-42',
  size
}) => {
  const inlineStyle = size ? { width: size, height: size } : undefined;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 260"
      fill="none"
      className={className}
      style={inlineStyle}
      role="img"
      aria-label="Culinary Camera Partner Access Illustration"
    >
      <defs>
        {/* Subtle Paper Drop Shadow for Light Mode */}
        <linearGradient id="paperLightBase" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F8FAFC" />
        </linearGradient>

        {/* Midnight Blue & Sky Gradient for Dark Mode */}
        <linearGradient id="paperDarkBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        {/* Sky-Blue to Cyan Gradient Accent */}
        <linearGradient id="skyCyanAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Soft Radial Ambient Glow (CSS-rendered, no heavy SVG filter) */}
        <radialGradient id="minimalGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.18" />
          <stop offset="70%" stopColor="#0284C7" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. Ambient Background Halo */}
      <circle cx="160" cy="135" r="95" fill="url(#minimalGlow)" />

      {/* 2. Concentric Minimal Orbit Rings (Paper Geometry) */}
      <circle
        cx="160"
        cy="135"
        r="105"
        stroke="currentColor"
        className="text-slate-200 dark:text-sky-500/20"
        strokeWidth="1.2"
        strokeDasharray="4 6"
      />
      <circle
        cx="160"
        cy="135"
        r="82"
        stroke="currentColor"
        className="text-slate-300 dark:text-sky-400/25"
        strokeWidth="1"
      />

      {/* 3. Floating Culinary Geometry Elements */}
      {/* Top Left Sparkle */}
      <path
        d="M75 58 L77 66 L85 68 L77 70 L75 78 L73 70 L65 68 L73 66 Z"
        className="fill-sky-400 dark:fill-sky-400 opacity-80"
      />
      {/* Top Right Mini Dot */}
      <circle cx="245" cy="62" r="3.5" className="fill-blue-500 dark:fill-sky-300 opacity-70" />
      {/* Bottom Left Dot */}
      <circle cx="62" cy="175" r="2.5" className="fill-slate-300 dark:fill-sky-500 opacity-60" />
      {/* Bottom Right Sparkle */}
      <path
        d="M255 180 L256.5 186 L262 187.5 L256.5 189 L255 195 L253.5 189 L248 187.5 L253.5 186 Z"
        className="fill-cyan-400 dark:fill-cyan-400 opacity-70"
      />

      {/* 4. Layered Paper Shadow (Offset bottom card) */}
      <rect
        x="73"
        y="83"
        width="174"
        height="124"
        rx="26"
        className="fill-slate-200/70 dark:fill-black/50"
      />

      {/* 5. Main Paper Camera Chassis */}
      <rect
        x="70"
        y="78"
        width="174"
        height="120"
        rx="24"
        className="fill-white dark:fill-[#111A2E] stroke-slate-200 dark:stroke-sky-500/30"
        strokeWidth="1.5"
      />

      {/* 6. Paper Flash / Top Viewfinder Bar */}
      <rect
        x="92"
        y="66"
        width="46"
        height="15"
        rx="6"
        className="fill-slate-100 dark:fill-[#162238] stroke-slate-200 dark:stroke-sky-500/30"
        strokeWidth="1.2"
      />
      <circle
        cx="115"
        cy="73.5"
        r="3"
        className="fill-sky-500 dark:fill-sky-400"
      />

      {/* 7. Minimalist Camera Lens (Concentric Layered Paper Rings) */}
      {/* Outer Lens Bezel */}
      <circle
        cx="145"
        cy="138"
        r="40"
        className="fill-slate-50 dark:fill-[#0E1526] stroke-slate-200 dark:stroke-sky-500/30"
        strokeWidth="1.5"
      />
      {/* Middle Ring */}
      <circle
        cx="145"
        cy="138"
        r="32"
        className="fill-white dark:fill-[#131E35] stroke-sky-500/30 dark:stroke-sky-400/40"
        strokeWidth="1.2"
      />
      {/* Inner Lens Core */}
      <circle
        cx="145"
        cy="138"
        r="22"
        className="fill-slate-100 dark:fill-[#0A101D]"
      />
      {/* Glass Glint Cutout */}
      <circle
        cx="145"
        cy="138"
        r="14"
        fill="url(#skyCyanAccent)"
        opacity="0.25"
      />
      <circle
        cx="139"
        cy="132"
        r="4.5"
        className="fill-white dark:fill-sky-200 opacity-90"
      />

      {/* 8. Chef Toque (Hat) Minimal Fold Line Art on Top */}
      <g className="text-slate-700 dark:text-sky-300">
        {/* Hat Base Band */}
        <rect
          x="152"
          y="68"
          width="48"
          height="7"
          rx="3"
          className="fill-slate-100 dark:fill-[#192742] stroke-slate-300 dark:stroke-sky-400/40"
          strokeWidth="1"
        />
        {/* Hat Puffs */}
        <path
          d="M156 68 C150 60, 153 46, 164 45 C165 38, 178 33, 186 36 C194 34, 204 40, 205 48 C213 52, 214 63, 200 68 Z"
          className="fill-white dark:fill-[#162238] stroke-slate-300 dark:stroke-sky-400/50"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Subtle Hat Crease lines */}
        <path
          d="M172 46 V66 M184 42 V66 M195 48 V66"
          className="stroke-slate-200 dark:stroke-sky-400/30"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>

      {/* 9. Minimalist Floating Security Lock Badge (Paper Card Layer) */}
      <g>
        {/* Badge Shadow Offset */}
        <rect
          x="197"
          y="127"
          width="50"
          height="54"
          rx="16"
          className="fill-slate-200/80 dark:fill-black/60"
        />
        {/* Badge Body */}
        <rect
          x="194"
          y="124"
          width="50"
          height="54"
          rx="15"
          fill="url(#skyCyanAccent)"
          className="stroke-white dark:stroke-sky-300/40"
          strokeWidth="1.5"
        />
        {/* Padlock Shackle */}
        <path
          d="M211 143 V136 C211 131.5, 215 128, 219 128 C223 128, 227 131.5, 227 136 V143"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Padlock Body */}
        <rect
          x="208"
          y="143"
          width="22"
          height="18"
          rx="5"
          fill="#FFFFFF"
        />
        {/* Padlock Keyhole */}
        <circle cx="219" cy="150" r="2.2" fill="#0284C7" />
        <path
          d="M219 151 L219 155"
          stroke="#0284C7"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>

      {/* 10. Clean Paper Corner Accent */}
      <line
        x1="82"
        y1="92"
        x2="94"
        y2="92"
        className="stroke-slate-300 dark:stroke-sky-500/40"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="82"
        y1="92"
        x2="82"
        y2="104"
        className="stroke-slate-300 dark:stroke-sky-500/40"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default CulinaryCameraLockIllustration;
