import React from 'react';

interface AvatarProps {
  className?: string;
}

// Elon Musk - charakteristické rysy: krátké vlasy, úzká tvář, mírný úsměv
export const ElonMusk: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <ellipse cx="60" cy="70" rx="35" ry="45" fill="#FFD4A3"/>
    {/* Hair */}
    <path d="M 30 45 Q 60 25 90 45 Q 85 35 60 30 Q 35 35 30 45 Z" fill="#2D1F1A"/>
    {/* Ears */}
    <ellipse cx="25" cy="70" rx="8" ry="12" fill="#FFD4A3"/>
    <ellipse cx="95" cy="70" rx="8" ry="12" fill="#FFD4A3"/>
    {/* Eyes */}
    <ellipse cx="48" cy="65" rx="5" ry="7" fill="#FFFFFF"/>
    <ellipse cx="72" cy="65" rx="5" ry="7" fill="#FFFFFF"/>
    <circle cx="49" cy="66" r="3" fill="#2D5F8D"/>
    <circle cx="73" cy="66" r="3" fill="#2D5F8D"/>
    <circle cx="50" cy="65" r="1.5" fill="#000"/>
    <circle cx="74" cy="65" r="1.5" fill="#000"/>
    {/* Eyebrows */}
    <path d="M 42 58 Q 48 55 54 58" stroke="#4A3A2A" strokeWidth="2" fill="none"/>
    <path d="M 66 58 Q 72 55 78 58" stroke="#4A3A2A" strokeWidth="2" fill="none"/>
    {/* Nose */}
    <path d="M 60 70 L 58 82 L 62 82 Z" fill="#FFB380"/>
    {/* Mouth - slight smirk */}
    <path d="M 48 92 Q 60 98 72 92" stroke="#8B4A4A" strokeWidth="2" fill="none"/>
    {/* Neck */}
    <rect x="50" y="110" width="20" height="25" fill="#FFD4A3"/>
    {/* Collar */}
    <path d="M 45 130 L 50 135 L 60 130 L 70 135 L 75 130 L 60 145 Z" fill="#1A1A2E"/>
    {/* Tesla logo on shirt */}
    <text x="60" y="145" fontSize="8" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">T</text>
  </svg>
);

// Jeff Bezos - charakteristické rysy: lysá hlava, široký úsměv, svalnatá postava
export const JeffBezos: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head - bald */}
    <ellipse cx="60" cy="65" rx="38" ry="42" fill="#FFD4A3"/>
    {/* Shine on bald head */}
    <ellipse cx="55" cy="40" rx="15" ry="12" fill="#FFFFFF" opacity="0.4"/>
    {/* Ears */}
    <ellipse cx="22" cy="70" rx="9" ry="14" fill="#FFD4A3"/>
    <ellipse cx="98" cy="70" rx="9" ry="14" fill="#FFD4A3"/>
    {/* Eyes */}
    <ellipse cx="46" cy="60" rx="6" ry="8" fill="#FFFFFF"/>
    <ellipse cx="74" cy="60" rx="6" ry="8" fill="#FFFFFF"/>
    <circle cx="47" cy="62" r="4" fill="#3A2A1A"/>
    <circle cx="75" cy="62" r="4" fill="#3A2A1A"/>
    <circle cx="48" cy="61" r="2" fill="#000"/>
    <circle cx="76" cy="61" r="2" fill="#000"/>
    {/* Eyebrows */}
    <path d="M 38 50 Q 46 48 54 50" stroke="#5A4A3A" strokeWidth="2.5" fill="none"/>
    <path d="M 66 50 Q 74 48 82 50" stroke="#5A4A3A" strokeWidth="2.5" fill="none"/>
    {/* Nose */}
    <path d="M 60 65 L 57 78 L 63 78 Z" fill="#FFB380"/>
    {/* Big smile */}
    <path d="M 40 85 Q 60 98 80 85" stroke="#8B4A4A" strokeWidth="2.5" fill="none"/>
    <path d="M 42 85 Q 60 95 78 85" fill="#FFA0A0"/>
    {/* Neck - muscular */}
    <rect x="48" y="102" width="24" height="28" fill="#FFD4A3"/>
    {/* Blue shirt */}
    <rect x="35" y="125" width="50" height="25" rx="3" fill="#2C5AA0"/>
    {/* Amazon smile arrow */}
    <path d="M 45 137 Q 60 142 75 137 L 73 140 L 75 143" stroke="#FF9900" strokeWidth="2" fill="none"/>
  </svg>
);

// Michael Saylor - charakteristické rysy: šedivé vlasy, úzká tvář, brýle
export const MichaelSaylor: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <ellipse cx="60" cy="68" rx="33" ry="44" fill="#FFD4A3"/>
    {/* Gray hair */}
    <path d="M 32 50 Q 60 30 88 50 L 85 45 Q 60 28 35 45 Z" fill="#8A8A8A"/>
    <path d="M 30 48 L 30 65 Q 32 52 35 48 Z" fill="#8A8A8A"/>
    <path d="M 90 48 L 90 65 Q 88 52 85 48 Z" fill="#8A8A8A"/>
    {/* Ears */}
    <ellipse cx="27" cy="72" rx="7" ry="11" fill="#FFD4A3"/>
    <ellipse cx="93" cy="72" rx="7" ry="11" fill="#FFD4A3"/>
    {/* Glasses */}
    <rect x="38" y="60" width="18" height="15" rx="2" fill="none" stroke="#2A2A2A" strokeWidth="2"/>
    <rect x="64" y="60" width="18" height="15" rx="2" fill="none" stroke="#2A2A2A" strokeWidth="2"/>
    <line x1="56" y1="67" x2="64" y2="67" stroke="#2A2A2A" strokeWidth="2"/>
    {/* Eyes behind glasses */}
    <circle cx="47" cy="67" r="3.5" fill="#4A5A6A"/>
    <circle cx="73" cy="67" r="3.5" fill="#4A5A6A"/>
    <circle cx="48" cy="66" r="1.5" fill="#000"/>
    <circle cx="74" cy="66" r="1.5" fill="#000"/>
    {/* Eyebrows */}
    <path d="M 40 56 Q 47 54 54 56" stroke="#6A6A6A" strokeWidth="2" fill="none"/>
    <path d="M 66 56 Q 73 54 80 56" stroke="#6A6A6A" strokeWidth="2" fill="none"/>
    {/* Nose */}
    <path d="M 60 72 L 58 84 L 62 84 Z" fill="#FFB380"/>
    {/* Mouth - serious expression */}
    <line x1="48" y1="94" x2="72" y2="94" stroke="#8B4A4A" strokeWidth="2"/>
    {/* Neck */}
    <rect x="50" y="108" width="20" height="25" fill="#FFD4A3"/>
    {/* Suit and Bitcoin tie */}
    <path d="M 40 128 L 50 133 L 60 128 L 70 133 L 80 128 L 60 148 Z" fill="#1A1A2E"/>
    <path d="M 58 133 L 60 128 L 62 133 Z" fill="#F7931A"/>
    <text x="60" y="141" fontSize="6" fill="#F7931A" textAnchor="middle" fontWeight="bold">₿</text>
  </svg>
);

// Jerome Powell - charakteristické rysy: šedivé vlasy, vážný výraz
export const JeromePowell: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <ellipse cx="60" cy="70" rx="36" ry="43" fill="#FFD4A3"/>
    {/* Gray hair - distinguished */}
    <path d="M 28 52 Q 60 32 92 52 Q 90 42 60 35 Q 30 42 28 52 Z" fill="#B0B0B0"/>
    <path d="M 26 50 L 26 68 Q 28 55 30 50 Z" fill="#B0B0B0"/>
    <path d="M 94 50 L 94 68 Q 92 55 90 50 Z" fill="#B0B0B0"/>
    {/* Ears */}
    <ellipse cx="24" cy="72" rx="8" ry="12" fill="#FFD4A3"/>
    <ellipse cx="96" cy="72" rx="8" ry="12" fill="#FFD4A3"/>
    {/* Eyes - serious look */}
    <ellipse cx="46" cy="66" rx="5" ry="7" fill="#FFFFFF"/>
    <ellipse cx="74" cy="66" rx="5" ry="7" fill="#FFFFFF"/>
    <circle cx="47" cy="67" r="3.5" fill="#5A4A3A"/>
    <circle cx="75" cy="67" r="3.5" fill="#5A4A3A"/>
    <circle cx="48" cy="66" r="1.5" fill="#000"/>
    <circle cx="76" cy="66" r="1.5" fill="#000"/>
    {/* Eyebrows - serious */}
    <path d="M 40 58 Q 46 56 52 58" stroke="#8A8A8A" strokeWidth="2.5" fill="none"/>
    <path d="M 68 58 Q 74 56 80 58" stroke="#8A8A8A" strokeWidth="2.5" fill="none"/>
    {/* Nose */}
    <path d="M 60 72 L 57 83 L 63 83 Z" fill="#FFB380"/>
    {/* Mouth - neutral/serious */}
    <path d="M 48 93 Q 60 91 72 93" stroke="#8B4A4A" strokeWidth="2" fill="none"/>
    {/* Neck */}
    <rect x="49" y="108" width="22" height="26" fill="#FFD4A3"/>
    {/* Formal suit */}
    <path d="M 38 128 L 48 135 L 60 128 L 72 135 L 82 128 L 60 148 Z" fill="#1A1A2E"/>
    {/* Red tie - FED */}
    <path d="M 58 128 L 60 133 L 62 128 L 60 145 Z" fill="#8B0000"/>
    <text x="60" y="143" fontSize="5" fill="#FFFFFF" textAnchor="middle">FED</text>
  </svg>
);

// Aleš Michl - charakteristické rysy: brýle, vlasy, český centralista
export const AlesMichl: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <ellipse cx="60" cy="69" rx="34" ry="42" fill="#FFD4A3"/>
    {/* Hair - dark */}
    <path d="M 30 48 Q 60 28 90 48 Q 88 38 60 32 Q 32 38 30 48 Z" fill="#3A2A1A"/>
    <path d="M 28 46 L 28 64 Q 30 52 32 46 Z" fill="#3A2A1A"/>
    <path d="M 92 46 L 92 64 Q 90 52 88 46 Z" fill="#3A2A1A"/>
    {/* Ears */}
    <ellipse cx="26" cy="70" rx="7" ry="11" fill="#FFD4A3"/>
    <ellipse cx="94" cy="70" rx="7" ry="11" fill="#FFD4A3"/>
    {/* Glasses - modern frames */}
    <rect x="39" y="61" width="17" height="14" rx="2" fill="none" stroke="#2A2A2A" strokeWidth="2.5"/>
    <rect x="64" y="61" width="17" height="14" rx="2" fill="none" stroke="#2A2A2A" strokeWidth="2.5"/>
    <line x1="56" y1="68" x2="64" y2="68" stroke="#2A2A2A" strokeWidth="2.5"/>
    {/* Eyes behind glasses */}
    <circle cx="47" cy="68" r="3" fill="#4A5A6A"/>
    <circle cx="72" cy="68" r="3" fill="#4A5A6A"/>
    <circle cx="48" cy="67" r="1.5" fill="#000"/>
    <circle cx="73" cy="67" r="1.5" fill="#000"/>
    {/* Eyebrows */}
    <path d="M 40 57 Q 47 55 54 57" stroke="#3A2A1A" strokeWidth="2" fill="none"/>
    <path d="M 66 57 Q 73 55 80 57" stroke="#3A2A1A" strokeWidth="2" fill="none"/>
    {/* Nose */}
    <path d="M 60 73 L 58 83 L 62 83 Z" fill="#FFB380"/>
    {/* Mouth - slight smile */}
    <path d="M 48 93 Q 60 96 72 93" stroke="#8B4A4A" strokeWidth="2" fill="none"/>
    {/* Neck */}
    <rect x="50" y="107" width="20" height="25" fill="#FFD4A3"/>
    {/* Suit - ČNB colors */}
    <path d="M 40 127 L 50 133 L 60 127 L 70 133 L 80 127 L 60 147 Z" fill="#1A1A2E"/>
    {/* Czech flag colors on tie */}
    <path d="M 58 127 L 60 132 L 62 127 Z" fill="#D7141A"/>
    <path d="M 58 132 L 60 137 L 62 132 Z" fill="#FFFFFF"/>
    <path d="M 58 137 L 60 142 L 62 137 Z" fill="#11457E"/>
    <text x="60" y="147" fontSize="5" fill="#FFFFFF" textAnchor="middle">ČNB</text>
  </svg>
);

// Warren Buffett - charakteristické rysy: brýle, šedivé vlasy, friendly smile
export const WarrenBuffett: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <ellipse cx="60" cy="70" rx="37" ry="44" fill="#FFD4A3"/>
    {/* Gray/white hair */}
    <path d="M 27 52 Q 60 33 93 52 Q 90 42 60 36 Q 30 42 27 52 Z" fill="#D0D0D0"/>
    <path d="M 25 50 L 25 68 Q 27 56 30 50 Z" fill="#D0D0D0"/>
    <path d="M 95 50 L 95 68 Q 93 56 90 50 Z" fill="#D0D0D0"/>
    {/* Ears */}
    <ellipse cx="23" cy="72" rx="9" ry="13" fill="#FFD4A3"/>
    <ellipse cx="97" cy="72" rx="9" ry="13" fill="#FFD4A3"/>
    {/* Large glasses - iconic */}
    <rect x="36" y="59" width="20" height="17" rx="2" fill="none" stroke="#5A4A3A" strokeWidth="3"/>
    <rect x="64" y="59" width="20" height="17" rx="2" fill="none" stroke="#5A4A3A" strokeWidth="3"/>
    <line x1="56" y1="67" x2="64" y2="67" stroke="#5A4A3A" strokeWidth="3"/>
    {/* Eyes - friendly */}
    <circle cx="46" cy="67" r="4" fill="#5A8ABD"/>
    <circle cx="74" cy="67" r="4" fill="#5A8ABD"/>
    <circle cx="47" cy="66" r="2" fill="#000"/>
    <circle cx="75" cy="66" r="2" fill="#000"/>
    {/* Eyebrows */}
    <path d="M 38 55 Q 46 53 54 55" stroke="#B0B0B0" strokeWidth="2" fill="none"/>
    <path d="M 66 55 Q 74 53 82 55" stroke="#B0B0B0" strokeWidth="2" fill="none"/>
    {/* Nose */}
    <path d="M 60 72 L 57 84 L 63 84 Z" fill="#FFB380"/>
    {/* Warm smile */}
    <path d="M 43 92 Q 60 100 77 92" stroke="#8B4A4A" strokeWidth="2.5" fill="none"/>
    {/* Neck */}
    <rect x="48" y="109" width="24" height="26" fill="#FFD4A3"/>
    {/* Suit - conservative */}
    <path d="M 38 130 L 48 136 L 60 130 L 72 136 L 82 130 L 60 148 Z" fill="#2A2A3E"/>
    {/* Red tie */}
    <path d="M 58 130 L 60 135 L 62 130 L 60 145 Z" fill="#A02020"/>
    <text x="60" y="146" fontSize="5" fill="#FFFFFF" textAnchor="middle">BRK</text>
  </svg>
);

// Satoshi Nakamoto - mysterious figure with question mark
export const SatoshiNakamoto: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head - in shadow */}
    <ellipse cx="60" cy="70" rx="35" ry="43" fill="#4A4A4A"/>
    {/* Hood */}
    <path d="M 25 50 Q 60 20 95 50 L 90 70 Q 60 50 30 70 Z" fill="#2A2A2A"/>
    {/* Mystery - glowing eyes */}
    <circle cx="46" cy="68" r="5" fill="#00FF88" opacity="0.8"/>
    <circle cx="74" cy="68" r="5" fill="#00FF88" opacity="0.8"/>
    <circle cx="47" cy="68" r="3" fill="#FFFFFF"/>
    <circle cx="75" cy="68" r="3" fill="#FFFFFF"/>
    {/* Mysterious aura */}
    <circle cx="60" cy="70" r="50" fill="none" stroke="#00FF88" strokeWidth="1" opacity="0.3"/>
    <circle cx="60" cy="70" r="55" fill="none" stroke="#F7931A" strokeWidth="1" opacity="0.2"/>
    {/* Lower face in shadow */}
    <ellipse cx="60" cy="95" rx="25" ry="15" fill="#3A3A3A"/>
    {/* Neck */}
    <rect x="50" y="110" width="20" height="24" fill="#3A3A3A"/>
    {/* Dark clothing */}
    <path d="M 40 128 L 50 134 L 60 128 L 70 134 L 80 128 L 60 148 Z" fill="#1A1A1A"/>
    {/* Bitcoin symbol glowing */}
    <circle cx="60" cy="138" r="8" fill="#F7931A"/>
    <text x="60" y="143" fontSize="10" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">₿</text>
    {/* Question mark above head */}
    <text x="60" y="30" fontSize="20" fill="#F7931A" textAnchor="middle" fontWeight="bold">?</text>
  </svg>
);

// Jamie Dimon - CEO JPMorgan
export const JamieDimon: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <ellipse cx="60" cy="69" rx="35" ry="43" fill="#FFD4A3"/>
    {/* Hair - gray/dark */}
    <path d="M 29 50 Q 60 30 91 50 Q 88 40 60 34 Q 32 40 29 50 Z" fill="#6A6A6A"/>
    <path d="M 27 48 L 27 66 Q 29 54 31 48 Z" fill="#6A6A6A"/>
    <path d="M 93 48 L 93 66 Q 91 54 89 48 Z" fill="#6A6A6A"/>
    {/* Ears */}
    <ellipse cx="25" cy="71" rx="8" ry="12" fill="#FFD4A3"/>
    <ellipse cx="95" cy="71" rx="8" ry="12" fill="#FFD4A3"/>
    {/* Eyes - intense */}
    <ellipse cx="46" cy="65" rx="5" ry="7" fill="#FFFFFF"/>
    <ellipse cx="74" cy="65" rx="5" ry="7" fill="#FFFFFF"/>
    <circle cx="47" cy="66" r="3.5" fill="#3A5A4A"/>
    <circle cx="75" cy="66" r="3.5" fill="#3A5A4A"/>
    <circle cx="48" cy="65" r="1.5" fill="#000"/>
    <circle cx="76" cy="65" r="1.5" fill="#000"/>
    {/* Eyebrows - strong */}
    <path d="M 40 58 Q 46 55 52 58" stroke="#5A5A5A" strokeWidth="2.5" fill="none"/>
    <path d="M 68 58 Q 74 55 80 58" stroke="#5A5A5A" strokeWidth="2.5" fill="none"/>
    {/* Nose */}
    <path d="M 60 71 L 57 82 L 63 82 Z" fill="#FFB380"/>
    {/* Mouth - confident */}
    <path d="M 46 92 Q 60 95 74 92" stroke="#8B4A4A" strokeWidth="2" fill="none"/>
    {/* Neck */}
    <rect x="49" y="107" width="22" height="26" fill="#FFD4A3"/>
    {/* Expensive suit */}
    <path d="M 38 128 L 48 135 L 60 128 L 72 135 L 82 128 L 60 148 Z" fill="#1A1A3E"/>
    {/* Blue tie - JPM colors */}
    <path d="M 58 128 L 60 133 L 62 128 L 60 145 Z" fill="#003366"/>
    <text x="60" y="144" fontSize="5" fill="#FFFFFF" textAnchor="middle">JPM</text>
  </svg>
);

// Christine Lagarde - ECB President
export const ChristineLagarde: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <ellipse cx="60" cy="68" rx="33" ry="41" fill="#FFD4A3"/>
    {/* White/silver hair - short sophisticated style */}
    <path d="M 30 48 Q 60 25 90 48 Q 88 35 60 28 Q 32 35 30 48 Z" fill="#E8E8E8"/>
    <path d="M 28 46 L 28 62 Q 30 50 32 46 Z" fill="#E8E8E8"/>
    <path d="M 92 46 L 92 62 Q 90 50 88 46 Z" fill="#E8E8E8"/>
    {/* Short hair details */}
    <path d="M 32 48 Q 40 42 48 48" stroke="#D0D0D0" strokeWidth="1.5" fill="none"/>
    <path d="M 72 48 Q 80 42 88 48" stroke="#D0D0D0" strokeWidth="1.5" fill="none"/>
    {/* Ears */}
    <ellipse cx="27" cy="68" rx="7" ry="10" fill="#FFD4A3"/>
    <ellipse cx="93" cy="68" rx="7" ry="10" fill="#FFD4A3"/>
    {/* Elegant earrings */}
    <circle cx="27" cy="73" r="3" fill="#FFD700"/>
    <circle cx="93" cy="73" r="3" fill="#FFD700"/>
    {/* Eyes - elegant */}
    <ellipse cx="47" cy="64" rx="5" ry="6" fill="#FFFFFF"/>
    <ellipse cx="73" cy="64" rx="5" ry="6" fill="#FFFFFF"/>
    <circle cx="48" cy="65" r="3" fill="#4A7A9A"/>
    <circle cx="74" cy="65" r="3" fill="#4A7A9A"/>
    <circle cx="49" cy="64" r="1.5" fill="#000"/>
    <circle cx="75" cy="64" r="1.5" fill="#000"/>
    {/* Eyebrows - refined */}
    <path d="M 41 58 Q 47 56 53 58" stroke="#B0B0B0" strokeWidth="1.5" fill="none"/>
    <path d="M 67 58 Q 73 56 79 58" stroke="#B0B0B0" strokeWidth="1.5" fill="none"/>
    {/* Nose */}
    <path d="M 60 69 L 58 79 L 62 79 Z" fill="#FFB380"/>
    {/* Mouth - professional smile */}
    <path d="M 48 89 Q 60 93 72 89" stroke="#A04A4A" strokeWidth="2" fill="none"/>
    {/* Neck */}
    <rect x="51" y="105" width="18" height="24" fill="#FFD4A3"/>
    {/* Professional suit */}
    <path d="M 40 124 L 50 130 L 60 124 L 70 130 L 80 124 L 60 145 Z" fill="#1A1A3E"/>
    {/* EU scarf/accessory */}
    <ellipse cx="60" cy="128" rx="12" ry="4" fill="#003399"/>
    <circle cx="54" cy="128" r="1" fill="#FFCC00"/>
    <circle cx="58" cy="128" r="1" fill="#FFCC00"/>
    <circle cx="62" cy="128" r="1" fill="#FFCC00"/>
    <circle cx="66" cy="128" r="1" fill="#FFCC00"/>
    <text x="60" y="144" fontSize="5" fill="#FFFFFF" textAnchor="middle">ECB</text>
  </svg>
);
