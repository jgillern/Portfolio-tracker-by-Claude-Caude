import React from 'react';

interface AvatarProps {
  className?: string;
}

// Elon Musk - X logo, raketa, tmavé vlasy, charakteristický úsměv
export const ElonMusk: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <ellipse cx="70" cy="75" rx="40" ry="50" fill="#FFDAB3"/>

    {/* Dark hair with receding hairline */}
    <path d="M 35 50 Q 45 35 70 32 Q 95 35 105 50 Q 100 40 70 35 Q 40 40 35 50 Z" fill="#2D1F1A"/>
    <path d="M 33 48 L 33 68 Q 35 55 38 48 Z" fill="#2D1F1A"/>
    <path d="M 107 48 L 107 68 Q 105 55 102 48 Z" fill="#2D1F1A"/>

    {/* Ears */}
    <ellipse cx="30" cy="75" rx="9" ry="14" fill="#FFDAB3"/>
    <ellipse cx="110" cy="75" rx="9" ry="14" fill="#FFDAB3"/>

    {/* Eyes - intense */}
    <ellipse cx="55" cy="70" rx="7" ry="9" fill="#FFFFFF"/>
    <ellipse cx="85" cy="70" rx="7" ry="9" fill="#FFFFFF"/>
    <circle cx="56" cy="72" r="4.5" fill="#4A7A9D"/>
    <circle cx="86" cy="72" r="4.5" fill="#4A7A9D"/>
    <circle cx="57" cy="71" r="2" fill="#000"/>
    <circle cx="87" cy="71" r="2" fill="#000"/>

    {/* Strong eyebrows */}
    <path d="M 47 62 Q 55 58 63 62" stroke="#2D1F1A" strokeWidth="3" fill="none"/>
    <path d="M 77 62 Q 85 58 93 62" stroke="#2D1F1A" strokeWidth="3" fill="none"/>

    {/* Nose */}
    <path d="M 70 75 L 67 88 L 73 88 Z" fill="#FFBB88"/>

    {/* Characteristic smirk */}
    <path d="M 55 100 Q 70 107 85 100" stroke="#B85A5A" strokeWidth="3" fill="none"/>
    <path d="M 86 99 L 90 97" stroke="#B85A5A" strokeWidth="2" fill="none"/>

    {/* Neck - strong */}
    <rect x="57" y="118" width="26" height="32" fill="#FFDAB3"/>

    {/* Black turtleneck */}
    <ellipse cx="70" cy="145" rx="35" ry="20" fill="#1A1A1A"/>
    <rect x="35" y="145" width="70" height="35" fill="#1A1A1A"/>

    {/* X logo (Twitter/X) - prominent */}
    <circle cx="70" cy="162" r="12" fill="#000000"/>
    <text x="70" y="169" fontSize="16" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">𝕏</text>

    {/* Small rocket icon */}
    <path d="M 95 150 L 98 145 L 101 150 L 98 155 Z" fill="#E74C3C"/>
    <circle cx="98" cy="148" r="1.5" fill="#F39C12"/>
  </svg>
);

// Jeff Bezos - VELMI lysá hlava s masivním shinem, široký úsměv, svalnaté ramena
export const JeffBezos: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head - completely bald and round */}
    <ellipse cx="70" cy="70" rx="44" ry="48" fill="#FFD4A3"/>

    {/* MASSIVE shine on bald head - iconic */}
    <ellipse cx="62" cy="42" rx="22" ry="18" fill="#FFFFFF" opacity="0.6"/>
    <ellipse cx="60" cy="38" rx="12" ry="10" fill="#FFFFFF" opacity="0.8"/>

    {/* Large ears */}
    <ellipse cx="26" cy="75" rx="11" ry="16" fill="#FFD4A3"/>
    <ellipse cx="114" cy="75" rx="11" ry="16" fill="#FFD4A3"/>

    {/* Eyes - confident */}
    <ellipse cx="52" cy="65" rx="7" ry="9" fill="#FFFFFF"/>
    <ellipse cx="88" cy="65" rx="7" ry="9" fill="#FFFFFF"/>
    <circle cx="53" cy="67" r="5" fill="#3A2A1A"/>
    <circle cx="89" cy="67" r="5" fill="#3A2A1A"/>
    <circle cx="54" cy="66" r="2.5" fill="#000"/>
    <circle cx="90" cy="66" r="2.5" fill="#000"/>

    {/* Thick eyebrows */}
    <path d="M 43 55 Q 52 52 61 55" stroke="#5A4A3A" strokeWidth="3.5" fill="none"/>
    <path d="M 79 55 Q 88 52 97 55" stroke="#5A4A3A" strokeWidth="3.5" fill="none"/>

    {/* Nose */}
    <path d="M 70 70 L 66 84 L 74 84 Z" fill="#FFB380"/>

    {/* HUGE trademark smile/laugh */}
    <path d="M 42 92 Q 70 110 98 92" stroke="#B85A5A" strokeWidth="3.5" fill="none"/>
    <path d="M 45 92 Q 70 106 95 92" fill="#FFB0B0"/>
    {/* Teeth */}
    <rect x="62" y="96" width="5" height="6" fill="#FFFFFF"/>
    <rect x="68" y="96" width="5" height="6" fill="#FFFFFF"/>
    <rect x="74" y="96" width="5" height="6" fill="#FFFFFF"/>

    {/* Muscular neck */}
    <path d="M 52 112 L 52 145 Q 52 145 70 150 Q 88 145 88 145 L 88 112" fill="#FFD4A3"/>

    {/* Blue casual shirt */}
    <rect x="35" y="140" width="70" height="40" rx="5" fill="#3A7BC8"/>

    {/* Amazon smile arrow - PROMINENT */}
    <path d="M 45 158 Q 70 167 95 158 L 92 162 L 95 166" stroke="#FF9900" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
  </svg>
);

// Michael Saylor - Bitcoin Maximalist - laser eyes, Bitcoin symboly všude
export const MichaelSaylor: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <ellipse cx="70" cy="75" rx="38" ry="48" fill="#FFD4A3"/>

    {/* Gray hair - sophisticated */}
    <path d="M 36 52 Q 70 32 104 52 L 101 47 Q 70 30 39 47 Z" fill="#9A9A9A"/>
    <path d="M 34 50 L 34 70 Q 36 58 39 50 Z" fill="#9A9A9A"/>
    <path d="M 106 50 L 106 70 Q 104 58 101 50 Z" fill="#9A9A9A"/>

    {/* Ears */}
    <ellipse cx="32" cy="78" rx="8" ry="13" fill="#FFD4A3"/>
    <ellipse cx="108" cy="78" rx="8" ry="13" fill="#FFD4A3"/>

    {/* Rectangular glasses - modern */}
    <rect x="44" y="66" width="20" height="16" rx="2" fill="none" stroke="#1A1A1A" strokeWidth="2.5"/>
    <rect x="76" y="66" width="20" height="16" rx="2" fill="none" stroke="#1A1A1A" strokeWidth="2.5"/>
    <line x1="64" y1="74" x2="76" y2="74" stroke="#1A1A1A" strokeWidth="2.5"/>

    {/* LASER EYES - Bitcoin orange! */}
    <circle cx="54" cy="74" r="5" fill="#F7931A"/>
    <circle cx="86" cy="74" r="5" fill="#F7931A"/>
    {/* Laser beams */}
    <line x1="54" y1="74" x2="20" y2="74" stroke="#F7931A" strokeWidth="3" opacity="0.7"/>
    <line x1="86" y1="74" x2="120" y2="74" stroke="#F7931A" strokeWidth="3" opacity="0.7"/>
    <circle cx="54" cy="74" r="2" fill="#FFFFFF"/>
    <circle cx="86" cy="74" r="2" fill="#FFFFFF"/>

    {/* Eyebrows */}
    <path d="M 46 62 Q 54 59 62 62" stroke="#7A7A7A" strokeWidth="2.5" fill="none"/>
    <path d="M 78 62 Q 86 59 94 62" stroke="#7A7A7A" strokeWidth="2.5" fill="none"/>

    {/* Nose */}
    <path d="M 70 78 L 67 91 L 73 91 Z" fill="#FFB380"/>

    {/* Serious mouth - laser focused */}
    <line x1="56" y1="103" x2="84" y2="103" stroke="#8B4A4A" strokeWidth="2.5"/>

    {/* Neck */}
    <rect x="58" y="118" width="24" height="30" fill="#FFD4A3"/>

    {/* Dark suit */}
    <path d="M 45 142 L 58 148 L 70 142 L 82 148 L 95 142 L 70 170 Z" fill="#1A1A1A"/>

    {/* Bitcoin symbols everywhere! */}
    <circle cx="70" cy="157" r="10" fill="#F7931A"/>
    <text x="70" y="163" fontSize="12" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">₿</text>

    {/* More Bitcoin symbols floating */}
    <text x="48" y="152" fontSize="8" fill="#F7931A" textAnchor="middle" fontWeight="bold">₿</text>
    <text x="92" y="152" fontSize="8" fill="#F7931A" textAnchor="middle" fontWeight="bold">₿</text>
  </svg>
);

// Jerome Powell - Money printer go brrr
export const JeromePowell: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <ellipse cx="70" cy="76" rx="41" ry="48" fill="#FFD4A3"/>

    {/* Distinguished gray hair */}
    <path d="M 32 56 Q 70 35 108 56 Q 105 45 70 38 Q 35 45 32 56 Z" fill="#B8B8B8"/>
    <path d="M 30 54 L 30 74 Q 32 62 35 54 Z" fill="#B8B8B8"/>
    <path d="M 110 54 L 110 74 Q 108 62 105 54 Z" fill="#B8B8B8"/>

    {/* Ears */}
    <ellipse cx="29" cy="78" rx="9" ry="14" fill="#FFD4A3"/>
    <ellipse cx="111" cy="78" rx="9" ry="14" fill="#FFD4A3"/>

    {/* Eyes - serious, tired from printing money */}
    <ellipse cx="53" cy="72" rx="6" ry="8" fill="#FFFFFF"/>
    <ellipse cx="87" cy="72" rx="6" ry="8" fill="#FFFFFF"/>
    <circle cx="54" cy="74" r="4.5" fill="#5A4A3A"/>
    <circle cx="88" cy="74" r="4.5" fill="#5A4A3A"/>
    <circle cx="55" cy="73" r="2" fill="#000"/>
    <circle cx="89" cy="73" r="2" fill="#000"/>
    {/* Bags under eyes */}
    <ellipse cx="53" cy="80" rx="7" ry="2" fill="#D0B090" opacity="0.4"/>
    <ellipse cx="87" cy="80" rx="7" ry="2" fill="#D0B090" opacity="0.4"/>

    {/* Serious eyebrows */}
    <path d="M 45 64 Q 53 61 61 64" stroke="#9A9A9A" strokeWidth="3" fill="none"/>
    <path d="M 79 64 Q 87 61 95 64" stroke="#9A9A9A" strokeWidth="3" fill="none"/>

    {/* Nose */}
    <path d="M 70 78 L 66 91 L 74 91 Z" fill="#FFB380"/>

    {/* Neutral/serious mouth */}
    <path d="M 54 102 Q 70 100 86 102" stroke="#8B4A4A" strokeWidth="2.5" fill="none"/>

    {/* Neck */}
    <rect x="56" y="118" width="28" height="32" fill="#FFD4A3"/>

    {/* Expensive dark suit */}
    <path d="M 42 142 L 56 150 L 70 142 L 84 150 L 98 142 L 70 172 Z" fill="#1A1A2E"/>

    {/* Dark red power tie */}
    <path d="M 67 142 L 70 148 L 73 142 L 70 165 Z" fill="#8B0000"/>

    {/* FED logo prominent */}
    <rect x="58" y="155" width="24" height="12" rx="2" fill="#1A4D2E"/>
    <text x="70" y="164" fontSize="8" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">FED</text>
  </svg>
);

// Aleš Michl - ČNB guvernér s výraznými brýlemi a českou vlajkou
export const AlesMichl: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <ellipse cx="70" cy="75" rx="39" ry="47" fill="#FFD4A3"/>

    {/* Dark hair */}
    <path d="M 35 52 Q 70 30 105 52 Q 103 40 70 34 Q 37 40 35 52 Z" fill="#3A2A1A"/>
    <path d="M 33 50 L 33 70 Q 35 58 38 50 Z" fill="#3A2A1A"/>
    <path d="M 107 50 L 107 70 Q 105 58 102 50 Z" fill="#3A2A1A"/>

    {/* Ears */}
    <ellipse cx="31" cy="77" rx="8" ry="12" fill="#FFD4A3"/>
    <ellipse cx="109" cy="77" rx="8" ry="12" fill="#FFD4A3"/>

    {/* Modern thick-rimmed glasses - PROMINENT */}
    <rect x="44" y="67" width="21" height="17" rx="2" fill="none" stroke="#1A1A1A" strokeWidth="3.5"/>
    <rect x="75" y="67" width="21" height="17" rx="2" fill="none" stroke="#1A1A1A" strokeWidth="3.5"/>
    <line x1="65" y1="75" x2="75" y2="75" stroke="#1A1A1A" strokeWidth="3.5"/>

    {/* Eyes behind glasses */}
    <circle cx="54" cy="75" r="4" fill="#4A5A6A"/>
    <circle cx="85" cy="75" r="4" fill="#4A5A6A"/>
    <circle cx="55" cy="74" r="2" fill="#000"/>
    <circle cx="86" cy="74" r="2" fill="#000"/>

    {/* Eyebrows */}
    <path d="M 46 63 Q 54 60 62 63" stroke="#3A2A1A" strokeWidth="2.5" fill="none"/>
    <path d="M 78 63 Q 86 60 94 63" stroke="#3A2A1A" strokeWidth="2.5" fill="none"/>

    {/* Nose */}
    <path d="M 70 79 L 67 91 L 73 91 Z" fill="#FFB380"/>

    {/* Professional smile */}
    <path d="M 55 102 Q 70 107 85 102" stroke="#8B4A4A" strokeWidth="2.5" fill="none"/>

    {/* Neck */}
    <rect x="58" y="117" width="24" height="30" fill="#FFD4A3"/>

    {/* Dark suit */}
    <path d="M 45 142 L 58 148 L 70 142 L 82 148 L 95 142 L 70 170 Z" fill="#1A1A2E"/>

    {/* Czech flag tie - PROMINENT */}
    <path d="M 67 142 L 70 147 L 73 142 Z" fill="#D7141A"/>
    <path d="M 67 147 L 70 152 L 73 147 Z" fill="#FFFFFF"/>
    <path d="M 67 152 L 70 157 L 73 152 Z" fill="#11457E"/>
    <path d="M 60 142 L 70 152 L 80 142" fill="#11457E" opacity="0.3"/>

    {/* ČNB logo */}
    <rect x="58" y="158" width="24" height="10" rx="2" fill="#11457E"/>
    <text x="70" y="166" fontSize="7" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">ČNB</text>
  </svg>
);

// Warren Buffett - Oracle of Omaha - HUGE glasses, Coca-Cola, friendly grandpa
export const WarrenBuffett: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <ellipse cx="70" cy="76" rx="42" ry="49" fill="#FFD4A3"/>

    {/* White/silver hair */}
    <path d="M 31 58 Q 70 36 109 58 Q 106 47 70 40 Q 34 47 31 58 Z" fill="#E0E0E0"/>
    <path d="M 29 56 L 29 76 Q 31 64 34 56 Z" fill="#E0E0E0"/>
    <path d="M 111 56 L 111 76 Q 109 64 106 56 Z" fill="#E0E0E0"/>

    {/* Ears - large */}
    <ellipse cx="28" cy="78" rx="10" ry="15" fill="#FFD4A3"/>
    <ellipse cx="112" cy="78" rx="10" ry="15" fill="#FFD4A3"/>

    {/* ICONIC HUGE GLASSES */}
    <rect x="38" y="64" width="24" height="20" rx="3" fill="none" stroke="#5A4A3A" strokeWidth="4"/>
    <rect x="78" y="64" width="24" height="20" rx="3" fill="none" stroke="#5A4A3A" strokeWidth="4"/>
    <line x1="62" y1="74" x2="78" y2="74" stroke="#5A4A3A" strokeWidth="4"/>

    {/* Friendly eyes */}
    <circle cx="50" cy="74" r="5" fill="#6A9ABD"/>
    <circle cx="90" cy="74" r="5" fill="#6A9ABD"/>
    <circle cx="51" cy="73" r="2.5" fill="#000"/>
    <circle cx="91" cy="73" r="2.5" fill="#000"/>

    {/* Friendly eyebrows */}
    <path d="M 40 60 Q 50 57 60 60" stroke="#C0C0C0" strokeWidth="2.5" fill="none"/>
    <path d="M 80 60 Q 90 57 100 60" stroke="#C0C0C0" strokeWidth="2.5" fill="none"/>

    {/* Nose */}
    <path d="M 70 79 L 66 92 L 74 92 Z" fill="#FFB380"/>

    {/* Warm grandfatherly smile */}
    <path d="M 47 103 Q 70 114 93 103" stroke="#B85A5A" strokeWidth="3" fill="none"/>
    <path d="M 49 103 Q 70 111 91 103" fill="#FFB0B0"/>

    {/* Neck */}
    <rect x="56" y="119" width="28" height="30" fill="#FFD4A3"/>

    {/* Conservative suit */}
    <path d="M 42 142 L 56 150 L 70 142 L 84 150 L 98 142 L 70 172 Z" fill="#2A2A4E"/>

    {/* Classic red tie */}
    <path d="M 67 142 L 70 148 L 73 142 L 70 165 Z" fill="#C03030"/>

    {/* Coca-Cola can in corner - his favorite! */}
    <rect x="95" y="150" width="12" height="20" rx="2" fill="#F40009"/>
    <ellipse cx="101" cy="150" rx="6" ry="2" fill="#C00007"/>
    <text x="101" y="163" fontSize="6" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">Coke</text>

    {/* BRK logo */}
    <text x="70" y="168" fontSize="7" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">BRK.A</text>
  </svg>
);

// Christine Lagarde - Elegant ECB President - French sophistication, EU symbols
export const ChristineLagarde: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <ellipse cx="70" cy="74" rx="37" ry="46" fill="#FFD4A3"/>

    {/* Elegant silver/white pixie cut */}
    <path d="M 36 52 Q 70 28 104 52 Q 102 38 70 32 Q 38 38 36 52 Z" fill="#F0F0F0"/>
    <path d="M 34 50 L 34 66 Q 36 56 39 50 Z" fill="#F0F0F0"/>
    <path d="M 106 50 L 106 66 Q 104 56 101 50 Z" fill="#F0F0F0"/>
    {/* Stylish hair texture */}
    <path d="M 40 50 Q 50 44 60 50" stroke="#E0E0E0" strokeWidth="2" fill="none"/>
    <path d="M 80 50 Q 90 44 100 50" stroke="#E0E0E0" strokeWidth="2" fill="none"/>

    {/* Ears */}
    <ellipse cx="33" cy="74" rx="8" ry="11" fill="#FFD4A3"/>
    <ellipse cx="107" cy="74" rx="8" ry="11" fill="#FFD4A3"/>

    {/* Elegant statement earrings - gold */}
    <circle cx="33" cy="80" r="4" fill="#FFD700"/>
    <ellipse cx="33" cy="87" rx="3" ry="5" fill="#FFD700"/>
    <circle cx="107" cy="80" r="4" fill="#FFD700"/>
    <ellipse cx="107" cy="87" rx="3" ry="5" fill="#FFD700"/>

    {/* Eyes - confident, elegant */}
    <ellipse cx="54" cy="70" rx="6" ry="7" fill="#FFFFFF"/>
    <ellipse cx="86" cy="70" rx="6" ry="7" fill="#FFFFFF"/>
    <circle cx="55" cy="71" r="4" fill="#4A7A9A"/>
    <circle cx="87" cy="71" r="4" fill="#4A7A9A"/>
    <circle cx="56" cy="70" r="2" fill="#000"/>
    <circle cx="88" cy="70" r="2" fill="#000"/>

    {/* Refined eyebrows */}
    <path d="M 47 64 Q 54 61 61 64" stroke="#C0C0C0" strokeWidth="2" fill="none"/>
    <path d="M 79 64 Q 86 61 93 64" stroke="#C0C0C0" strokeWidth="2" fill="none"/>

    {/* Nose - refined */}
    <path d="M 70 74 L 67 85 L 73 85 Z" fill="#FFB380"/>

    {/* Professional smile */}
    <path d="M 54 96 Q 70 102 86 96" stroke="#B04A4A" strokeWidth="2.5" fill="none"/>

    {/* Elegant neck with necklace */}
    <rect x="59" y="115" width="22" height="28" fill="#FFD4A3"/>
    <ellipse cx="70" cy="118" rx="15" ry="3" fill="none" stroke="#FFD700" strokeWidth="2"/>
    <circle cx="70" cy="118" r="3" fill="#4A7ADA"/>

    {/* Elegant suit with EU colors */}
    <path d="M 45 138 L 59 145 L 70 138 L 81 145 L 95 138 L 70 168 Z" fill="#1A1A3E"/>

    {/* EU scarf - blue with gold stars */}
    <rect x="54" y="138" width="32" height="8" rx="2" fill="#003399"/>
    <circle cx="60" cy="142" r="1.5" fill="#FFCC00"/>
    <circle cx="65" cy="142" r="1.5" fill="#FFCC00"/>
    <circle cx="70" cy="142" r="1.5" fill="#FFCC00"/>
    <circle cx="75" cy="142" r="1.5" fill="#FFCC00"/>
    <circle cx="80" cy="142" r="1.5" fill="#FFCC00"/>

    {/* ECB logo prominent */}
    <rect x="58" y="154" width="24" height="10" rx="2" fill="#003399"/>
    <text x="70" y="162" fontSize="7" fill="#FFD700" textAnchor="middle" fontWeight="bold">ECB</text>
  </svg>
);

// Satoshi Nakamoto - mysterious figure with question mark
export const SatoshiNakamoto: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head - in shadow */}
    <ellipse cx="70" cy="80" rx="40" ry="48" fill="#3A3A3A"/>

    {/* Dark hood */}
    <path d="M 30 58 Q 70 22 110 58 L 104 80 Q 70 55 36 80 Z" fill="#1A1A1A"/>
    <path d="M 28 60 Q 70 20 112 60" stroke="#2A2A2A" strokeWidth="2" fill="none"/>

    {/* Mystery - glowing eyes */}
    <circle cx="53" cy="78" r="7" fill="#00FF88" opacity="0.9"/>
    <circle cx="87" cy="78" r="7" fill="#00FF88" opacity="0.9"/>
    <circle cx="54" cy="78" r="4" fill="#FFFFFF"/>
    <circle cx="88" cy="78" r="4" fill="#FFFFFF"/>
    {/* Glow effect */}
    <circle cx="53" cy="78" r="10" fill="none" stroke="#00FF88" strokeWidth="1" opacity="0.3"/>
    <circle cx="87" cy="78" r="10" fill="none" stroke="#00FF88" strokeWidth="1" opacity="0.3"/>

    {/* Mysterious aura */}
    <circle cx="70" cy="80" r="58" fill="none" stroke="#00FF88" strokeWidth="1" opacity="0.3"/>
    <circle cx="70" cy="80" r="64" fill="none" stroke="#F7931A" strokeWidth="1" opacity="0.2"/>

    {/* Lower face in shadow */}
    <ellipse cx="70" cy="105" rx="28" ry="18" fill="#2A2A2A"/>

    {/* Neck */}
    <rect x="58" y="122" width="24" height="28" fill="#2A2A2A"/>

    {/* Dark clothing */}
    <path d="M 45 144 L 58 152 L 70 144 L 82 152 L 95 144 L 70 172 Z" fill="#0A0A0A"/>

    {/* Bitcoin symbol glowing - PROMINENT */}
    <circle cx="70" cy="160" r="11" fill="#F7931A"/>
    <circle cx="70" cy="160" r="15" fill="none" stroke="#F7931A" strokeWidth="1" opacity="0.4"/>
    <text x="70" y="167" fontSize="14" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">₿</text>

    {/* Question mark above head - WHO IS SATOSHI? */}
    <text x="70" y="35" fontSize="28" fill="#F7931A" textAnchor="middle" fontWeight="bold" opacity="0.9">?</text>
    <text x="70" y="35" fontSize="28" fill="#00FF88" textAnchor="middle" fontWeight="bold" opacity="0.3">?</text>
  </svg>
);
