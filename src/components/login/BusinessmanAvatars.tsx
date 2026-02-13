import React from 'react';

interface AvatarProps {
  className?: string;
}

// Elon Musk - X logo, raketa, tmavé vlasy, charakteristický úsměv
export const ElonMusk: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* HEAD - ENLARGED */}
    <ellipse cx="80" cy="80" rx="50" ry="60" fill="#FFDAB3"/>

    {/* Dark hair with receding hairline */}
    <path d="M 35 45 Q 50 25 80 22 Q 110 25 125 45 Q 118 33 80 28 Q 42 33 35 45 Z" fill="#2D1F1A"/>
    <path d="M 32 42 L 32 70 Q 35 55 40 42 Z" fill="#2D1F1A"/>
    <path d="M 128 42 L 128 70 Q 125 55 120 42 Z" fill="#2D1F1A"/>

    {/* Ears - larger */}
    <ellipse cx="30" cy="80" rx="11" ry="17" fill="#FFDAB3"/>
    <ellipse cx="130" cy="80" rx="11" ry="17" fill="#FFDAB3"/>

    {/* Eyes - intense, BIGGER */}
    <ellipse cx="60" cy="75" rx="9" ry="11" fill="#FFFFFF"/>
    <ellipse cx="100" cy="75" rx="9" ry="11" fill="#FFFFFF"/>
    <circle cx="61" cy="77" r="6" fill="#4A7A9D"/>
    <circle cx="101" cy="77" r="6" fill="#4A7A9D"/>
    <circle cx="62" cy="76" r="2.5" fill="#000"/>
    <circle cx="102" cy="76" r="2.5" fill="#000"/>

    {/* Strong eyebrows - THICKER */}
    <path d="M 50 64 Q 60 59 70 64" stroke="#2D1F1A" strokeWidth="4" fill="none"/>
    <path d="M 90 64 Q 100 59 110 64" stroke="#2D1F1A" strokeWidth="4" fill="none"/>

    {/* Nose - BIGGER */}
    <path d="M 80 80 L 76 95 L 84 95 Z" fill="#FFBB88"/>

    {/* Characteristic smirk */}
    <path d="M 60 110 Q 80 120 100 110" stroke="#B85A5A" strokeWidth="4" fill="none"/>
    <path d="M 102 109 L 108 106" stroke="#B85A5A" strokeWidth="3" fill="none"/>

    {/* Neck - proportional */}
    <rect x="68" y="135" width="24" height="25" fill="#FFDAB3"/>

    {/* Black turtleneck */}
    <ellipse cx="80" cy="160" rx="40" ry="22" fill="#1A1A1A"/>
    <rect x="40" y="160" width="80" height="40" fill="#1A1A1A"/>

    {/* X logo (Twitter/X) - PROMINENT */}
    <circle cx="80" cy="177" r="14" fill="#000000"/>
    <text x="80" y="186" fontSize="20" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">𝕏</text>

    {/* Small rocket icon */}
    <path d="M 110 165 L 114 158 L 118 165 L 114 172 Z" fill="#E74C3C"/>
    <circle cx="114" cy="162" r="2" fill="#F39C12"/>
  </svg>
);

// Jeff Bezos - VELMI lysá hlava s masivním shinem, široký úsměv
export const JeffBezos: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* HEAD - COMPLETELY BALD AND HUGE */}
    <ellipse cx="80" cy="75" rx="55" ry="58" fill="#FFD4A3"/>

    {/* MASSIVE ICONIC SHINE on bald head */}
    <ellipse cx="70" cy="42" rx="28" ry="22" fill="#FFFFFF" opacity="0.7"/>
    <ellipse cx="67" cy="37" rx="16" ry="13" fill="#FFFFFF" opacity="0.9"/>

    {/* Large ears */}
    <ellipse cx="25" cy="82" rx="13" ry="19" fill="#FFD4A3"/>
    <ellipse cx="135" cy="82" rx="13" ry="19" fill="#FFD4A3"/>

    {/* Eyes - confident, BIGGER */}
    <ellipse cx="58" cy="70" rx="9" ry="11" fill="#FFFFFF"/>
    <ellipse cx="102" cy="70" rx="9" ry="11" fill="#FFFFFF"/>
    <circle cx="59" cy="73" r="6.5" fill="#3A2A1A"/>
    <circle cx="103" cy="73" r="6.5" fill="#3A2A1A"/>
    <circle cx="60" cy="72" r="3" fill="#000"/>
    <circle cx="104" cy="72" r="3" fill="#000"/>

    {/* Thick eyebrows */}
    <path d="M 47 58 Q 58 54 69 58" stroke="#5A4A3A" strokeWidth="4.5" fill="none"/>
    <path d="M 91 58 Q 102 54 113 58" stroke="#5A4A3A" strokeWidth="4.5" fill="none"/>

    {/* Nose */}
    <path d="M 80 76 L 75 92 L 85 92 Z" fill="#FFB380"/>

    {/* HUGE trademark smile/laugh - VERY WIDE */}
    <path d="M 45 105 Q 80 128 115 105" stroke="#B85A5A" strokeWidth="4.5" fill="none"/>
    <path d="M 48 105 Q 80 123 112 105" fill="#FFB0B0"/>
    {/* Teeth - BIGGER */}
    <rect x="70" y="110" width="6" height="8" fill="#FFFFFF"/>
    <rect x="78" y="110" width="6" height="8" fill="#FFFFFF"/>
    <rect x="86" y="110" width="6" height="8" fill="#FFFFFF"/>

    {/* Muscular neck */}
    <path d="M 60 130 L 60 160 Q 60 160 80 166 Q 100 160 100 160 L 100 130" fill="#FFD4A3"/>

    {/* Blue casual shirt */}
    <rect x="40" y="155" width="80" height="45" rx="5" fill="#3A7BC8"/>

    {/* Amazon smile arrow - VERY PROMINENT */}
    <path d="M 50 172 Q 80 184 110 172 L 106 177 L 110 182" stroke="#FF9900" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
  </svg>
);

// Michael Saylor - Bitcoin Maximalist - LASER EYES
export const MichaelSaylor: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* HEAD - ENLARGED */}
    <ellipse cx="80" cy="80" rx="48" ry="58" fill="#FFD4A3"/>

    {/* Gray hair - sophisticated */}
    <path d="M 38 55 Q 80 32 122 55 L 118 48 Q 80 30 42 48 Z" fill="#9A9A9A"/>
    <path d="M 35 52 L 35 75 Q 38 62 42 52 Z" fill="#9A9A9A"/>
    <path d="M 125 52 L 125 75 Q 122 62 118 52 Z" fill="#9A9A9A"/>

    {/* Ears */}
    <ellipse cx="32" cy="83" rx="10" ry="16" fill="#FFD4A3"/>
    <ellipse cx="128" cy="83" rx="10" ry="16" fill="#FFD4A3"/>

    {/* Rectangular glasses - modern, BIGGER */}
    <rect x="48" y="70" width="25" height="20" rx="2" fill="none" stroke="#1A1A1A" strokeWidth="3.5"/>
    <rect x="87" y="70" width="25" height="20" rx="2" fill="none" stroke="#1A1A1A" strokeWidth="3.5"/>
    <line x1="73" y1="80" x2="87" y2="80" stroke="#1A1A1A" strokeWidth="3.5"/>

    {/* LASER EYES - Bitcoin orange! GLOWING */}
    <circle cx="60" cy="80" r="7" fill="#F7931A"/>
    <circle cx="99" cy="80" r="7" fill="#F7931A"/>
    {/* Laser beams - INTENSE */}
    <line x1="60" y1="80" x2="15" y2="80" stroke="#F7931A" strokeWidth="4" opacity="0.8"/>
    <line x1="99" y1="80" x2="145" y2="80" stroke="#F7931A" strokeWidth="4" opacity="0.8"/>
    <circle cx="60" cy="80" r="3" fill="#FFFFFF"/>
    <circle cx="99" cy="80" r="3" fill="#FFFFFF"/>
    {/* Extra glow */}
    <circle cx="60" cy="80" r="10" fill="none" stroke="#F7931A" strokeWidth="1" opacity="0.5"/>
    <circle cx="99" cy="80" r="10" fill="none" stroke="#F7931A" strokeWidth="1" opacity="0.5"/>

    {/* Eyebrows - above glasses */}
    <path d="M 50 64 Q 60 60 70 64" stroke="#7A7A7A" strokeWidth="3.5" fill="none"/>
    <path d="M 90 64 Q 100 60 110 64" stroke="#7A7A7A" strokeWidth="3.5" fill="none"/>

    {/* Nose */}
    <path d="M 80 84 L 76 100 L 84 100 Z" fill="#FFB380"/>

    {/* Serious mouth - laser focused */}
    <line x1="62" y1="115" x2="98" y2="115" stroke="#8B4A4A" strokeWidth="3.5"/>

    {/* Neck */}
    <rect x="68" y="133" width="24" height="27" fill="#FFD4A3"/>

    {/* Dark suit */}
    <path d="M 50 155 L 68 163 L 80 155 L 92 163 L 110 155 L 80 190 Z" fill="#1A1A1A"/>

    {/* Bitcoin symbols everywhere! BIGGER */}
    <circle cx="80" cy="172" r="13" fill="#F7931A"/>
    <text x="80" y="180" fontSize="16" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">₿</text>

    {/* More Bitcoin symbols floating */}
    <text x="52" y="165" fontSize="11" fill="#F7931A" textAnchor="middle" fontWeight="bold">₿</text>
    <text x="108" y="165" fontSize="11" fill="#F7931A" textAnchor="middle" fontWeight="bold">₿</text>
  </svg>
);

// Jerome Powell - Money printer chairman
export const JeromePowell: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* HEAD - ENLARGED */}
    <ellipse cx="80" cy="82" rx="51" ry="58" fill="#FFD4A3"/>

    {/* Distinguished gray hair - PROMINENT */}
    <path d="M 34 58 Q 80 34 126 58 Q 122 46 80 38 Q 38 46 34 58 Z" fill="#B8B8B8"/>
    <path d="M 32 55 L 32 80 Q 34 66 38 55 Z" fill="#B8B8B8"/>
    <path d="M 128 55 L 128 80 Q 126 66 122 55 Z" fill="#B8B8B8"/>

    {/* Ears */}
    <ellipse cx="29" cy="84" rx="11" ry="17" fill="#FFD4A3"/>
    <ellipse cx="131" cy="84" rx="11" ry="17" fill="#FFD4A3"/>

    {/* Eyes - serious, tired, BIGGER */}
    <ellipse cx="59" cy="77" rx="8" ry="10" fill="#FFFFFF"/>
    <ellipse cx="101" cy="77" rx="8" ry="10" fill="#FFFFFF"/>
    <circle cx="60" cy="80" r="6" fill="#5A4A3A"/>
    <circle cx="102" cy="80" r="6" fill="#5A4A3A"/>
    <circle cx="61" cy="79" r="2.5" fill="#000"/>
    <circle cx="103" cy="79" r="2.5" fill="#000"/>
    {/* Bags under eyes - MORE PROMINENT */}
    <ellipse cx="59" cy="87" rx="9" ry="3" fill="#D0B090" opacity="0.5"/>
    <ellipse cx="101" cy="87" rx="9" ry="3" fill="#D0B090" opacity="0.5"/>

    {/* Serious eyebrows - THICKER */}
    <path d="M 49 67 Q 59 63 69 67" stroke="#9A9A9A" strokeWidth="4" fill="none"/>
    <path d="M 91 67 Q 101 63 111 67" stroke="#9A9A9A" strokeWidth="4" fill="none"/>

    {/* Nose */}
    <path d="M 80 83 L 75 98 L 85 98 Z" fill="#FFB380"/>

    {/* Neutral/serious mouth */}
    <path d="M 61 112 Q 80 110 99 112" stroke="#8B4A4A" strokeWidth="3.5" fill="none"/>

    {/* Neck */}
    <rect x="66" y="134" width="28" height="28" fill="#FFD4A3"/>

    {/* Expensive dark suit */}
    <path d="M 48 157 L 66 167 L 80 157 L 94 167 L 112 157 L 80 192 Z" fill="#1A1A2E"/>

    {/* Dark red power tie */}
    <path d="M 76 157 L 80 164 L 84 157 L 80 182 Z" fill="#8B0000"/>

    {/* FED logo - LARGE AND PROMINENT */}
    <rect x="66" y="170" width="28" height="14" rx="2" fill="#1A4D2E"/>
    <text x="80" y="181" fontSize="10" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">FED</text>
  </svg>
);

// Aleš Michl - ČNB guvernér
export const AlesMichl: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* HEAD - ENLARGED */}
    <ellipse cx="80" cy="80" rx="49" ry="57" fill="#FFD4A3"/>

    {/* Dark hair */}
    <path d="M 37 55 Q 80 30 123 55 Q 120 42 80 35 Q 40 42 37 55 Z" fill="#3A2A1A"/>
    <path d="M 34 52 L 34 75 Q 37 62 41 52 Z" fill="#3A2A1A"/>
    <path d="M 126 52 L 126 75 Q 123 62 119 52 Z" fill="#3A2A1A"/>

    {/* Ears */}
    <ellipse cx="31" cy="82" rx="10" ry="15" fill="#FFD4A3"/>
    <ellipse cx="129" cy="82" rx="10" ry="15" fill="#FFD4A3"/>

    {/* Modern THICK-rimmed glasses - VERY PROMINENT */}
    <rect x="48" y="72" width="26" height="21" rx="2" fill="none" stroke="#1A1A1A" strokeWidth="4.5"/>
    <rect x="86" y="72" width="26" height="21" rx="2" fill="none" stroke="#1A1A1A" strokeWidth="4.5"/>
    <line x1="74" y1="82" x2="86" y2="82" stroke="#1A1A1A" strokeWidth="4.5"/>

    {/* Eyes behind glasses - BIGGER */}
    <circle cx="61" cy="82" r="5" fill="#4A5A6A"/>
    <circle cx="99" cy="82" r="5" fill="#4A5A6A"/>
    <circle cx="62" cy="81" r="2.5" fill="#000"/>
    <circle cx="100" cy="81" r="2.5" fill="#000"/>

    {/* Eyebrows */}
    <path d="M 50 67 Q 61 63 72 67" stroke="#3A2A1A" strokeWidth="3.5" fill="none"/>
    <path d="M 88 67 Q 99 63 110 67" stroke="#3A2A1A" strokeWidth="3.5" fill="none"/>

    {/* Nose */}
    <path d="M 80 86 L 76 100 L 84 100 Z" fill="#FFB380"/>

    {/* Professional smile */}
    <path d="M 62 113 Q 80 120 98 113" stroke="#8B4A4A" strokeWidth="3.5" fill="none"/>

    {/* Neck */}
    <rect x="68" y="132" width="24" height="28" fill="#FFD4A3"/>

    {/* Dark suit */}
    <path d="M 50 155 L 68 163 L 80 155 L 92 163 L 110 155 L 80 190 Z" fill="#1A1A2E"/>

    {/* Czech flag tie - VERY PROMINENT */}
    <path d="M 76 155 L 80 161 L 84 155 Z" fill="#D7141A"/>
    <path d="M 76 161 L 80 167 L 84 161 Z" fill="#FFFFFF"/>
    <path d="M 76 167 L 80 173 L 84 167 Z" fill="#11457E"/>
    <path d="M 68 155 L 80 167 L 92 155" fill="#11457E" opacity="0.3"/>

    {/* ČNB logo - PROMINENT */}
    <rect x="66" y="175" width="28" height="12" rx="2" fill="#11457E"/>
    <text x="80" y="184" fontSize="9" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">ČNB</text>
  </svg>
);

// Warren Buffett - Oracle of Omaha with HUGE iconic glasses
export const WarrenBuffett: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* HEAD - ENLARGED */}
    <ellipse cx="80" cy="82" rx="52" ry="60" fill="#FFD4A3"/>

    {/* White/silver hair */}
    <path d="M 33 62 Q 80 38 127 62 Q 123 50 80 42 Q 37 50 33 62 Z" fill="#E0E0E0"/>
    <path d="M 30 59 L 30 82 Q 33 68 37 59 Z" fill="#E0E0E0"/>
    <path d="M 130 59 L 130 82 Q 127 68 123 59 Z" fill="#E0E0E0"/>

    {/* Ears - large */}
    <ellipse cx="28" cy="84" rx="12" ry="18" fill="#FFD4A3"/>
    <ellipse cx="132" cy="84" rx="12" ry="18" fill="#FFD4A3"/>

    {/* ICONIC HUGE GLASSES - MASSIVE! */}
    <rect x="42" y="68" width="30" height="25" rx="3" fill="none" stroke="#5A4A3A" strokeWidth="5"/>
    <rect x="88" y="68" width="30" height="25" rx="3" fill="none" stroke="#5A4A3A" strokeWidth="5"/>
    <line x1="72" y1="80" x2="88" y2="80" stroke="#5A4A3A" strokeWidth="5"/>

    {/* Friendly eyes - BIGGER */}
    <circle cx="57" cy="80" r="6.5" fill="#6A9ABD"/>
    <circle cx="103" cy="80" r="6.5" fill="#6A9ABD"/>
    <circle cx="58" cy="79" r="3" fill="#000"/>
    <circle cx="104" cy="79" r="3" fill="#000"/>

    {/* Friendly eyebrows */}
    <path d="M 44 63 Q 57 59 70 63" stroke="#C0C0C0" strokeWidth="3.5" fill="none"/>
    <path d="M 90 63 Q 103 59 116 63" stroke="#C0C0C0" strokeWidth="3.5" fill="none"/>

    {/* Nose */}
    <path d="M 80 85 L 75 100 L 85 100 Z" fill="#FFB380"/>

    {/* Warm grandfatherly smile - BIG */}
    <path d="M 52 112 Q 80 127 108 112" stroke="#B85A5A" strokeWidth="4" fill="none"/>
    <path d="M 54 112 Q 80 124 106 112" fill="#FFB0B0"/>

    {/* Neck */}
    <rect x="66" y="134" width="28" height="28" fill="#FFD4A3"/>

    {/* Conservative suit */}
    <path d="M 48 157 L 66 167 L 80 157 L 94 167 L 112 157 L 80 192 Z" fill="#2A2A4E"/>

    {/* Classic red tie */}
    <path d="M 76 157 L 80 164 L 84 157 L 80 180 Z" fill="#C03030"/>

    {/* Coca-Cola can - BIGGER! */}
    <rect x="108" y="162" width="15" height="25" rx="2" fill="#F40009"/>
    <ellipse cx="115.5" cy="162" rx="7.5" ry="2.5" fill="#C00007"/>
    <text x="115.5" y="177" fontSize="7" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">Coke</text>

    {/* BRK logo */}    <text x="80" y="184" fontSize="9" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">BRK.A</text>
  </svg>
);

// Christine Lagarde - Elegant ECB President
export const ChristineLagarde: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* HEAD - ENLARGED */}
    <ellipse cx="80" cy="79" rx="47" ry="56" fill="#FFD4A3"/>

    {/* Elegant silver/white pixie cut */}
    <path d="M 39 55 Q 80 28 121 55 Q 118 40 80 33 Q 42 40 39 55 Z" fill="#F0F0F0"/>
    <path d="M 36 52 L 36 70 Q 39 59 43 52 Z" fill="#F0F0F0"/>
    <path d="M 124 52 L 124 70 Q 121 59 117 52 Z" fill="#F0F0F0"/>
    {/* Stylish hair texture */}
    <path d="M 44 52 Q 57 45 70 52" stroke="#E0E0E0" strokeWidth="2.5" fill="none"/>
    <path d="M 90 52 Q 103 45 116 52" stroke="#E0E0E0" strokeWidth="2.5" fill="none"/>

    {/* Ears */}
    <ellipse cx="33" cy="79" rx="10" ry="14" fill="#FFD4A3"/>
    <ellipse cx="127" cy="79" rx="10" ry="14" fill="#FFD4A3"/>

    {/* Elegant STATEMENT earrings - gold, BIGGER */}
    <circle cx="33" cy="86" r="5" fill="#FFD700"/>
    <ellipse cx="33" cy="95" rx="4" ry="6" fill="#FFD700"/>
    <circle cx="127" cy="86" r="5" fill="#FFD700"/>
    <ellipse cx="127" cy="95" rx="4" ry="6" fill="#FFD700"/>

    {/* Eyes - confident, elegant, BIGGER */}
    <ellipse cx="61" cy="75" rx="8" ry="9" fill="#FFFFFF"/>
    <ellipse cx="99" cy="75" rx="8" ry="9" fill="#FFFFFF"/>
    <circle cx="62" cy="76" r="5" fill="#4A7A9A"/>
    <circle cx="100" cy="76" r="5" fill="#4A7A9A"/>
    <circle cx="63" cy="75" r="2.5" fill="#000"/>
    <circle cx="101" cy="75" r="2.5" fill="#000"/>

    {/* Refined eyebrows */}
    <path d="M 53 68 Q 61 64 69 68" stroke="#C0C0C0" strokeWidth="2.5" fill="none"/>
    <path d="M 91 68 Q 99 64 107 68" stroke="#C0C0C0" strokeWidth="2.5" fill="none"/>

    {/* Nose - refined */}
    <path d="M 80 79 L 76 92 L 84 92 Z" fill="#FFB380"/>

    {/* Professional smile */}
    <path d="M 61 105 Q 80 113 99 105" stroke="#B04A4A" strokeWidth="3.5" fill="none"/>

    {/* Elegant neck with necklace */}
    <rect x="69" y="130" width="22" height="30" fill="#FFD4A3"/>
    <ellipse cx="80" cy="133" rx="18" ry="4" fill="none" stroke="#FFD700" strokeWidth="2.5"/>
    <circle cx="80" cy="133" r="4" fill="#4A7ADA"/>

    {/* Elegant suit with EU colors */}
    <path d="M 50 153 L 69 162 L 80 153 L 91 162 L 110 153 L 80 188 Z" fill="#1A1A3E"/>

    {/* EU scarf - blue with gold stars - PROMINENT */}
    <rect x="60" y="153" width="40" height="10" rx="2" fill="#003399"/>
    <circle cx="67" cy="158" r="2" fill="#FFCC00"/>
    <circle cx="73" cy="158" r="2" fill="#FFCC00"/>
    <circle cx="80" cy="158" r="2" fill="#FFCC00"/>
    <circle cx="87" cy="158" r="2" fill="#FFCC00"/>
    <circle cx="93" cy="158" r="2" fill="#FFCC00"/>

    {/* ECB logo - PROMINENT */}
    <rect x="66" y="170" width="28" height="12" rx="2" fill="#003399"/>
    <text x="80" y="179" fontSize="9" fill="#FFD700" textAnchor="middle" fontWeight="bold">ECB</text>
  </svg>
);

// Satoshi Nakamoto - mysterious figure with glowing eyes
export const SatoshiNakamoto: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* HEAD - in shadow, ENLARGED */}
    <ellipse cx="80" cy="85" rx="50" ry="58" fill="#3A3A3A"/>

    {/* Dark hood - BIGGER */}
    <path d="M 32 62 Q 80 20 128 62 L 120 88 Q 80 58 40 88 Z" fill="#1A1A1A"/>
    <path d="M 30 64 Q 80 18 130 64" stroke="#2A2A2A" strokeWidth="2.5" fill="none"/>

    {/* Mystery - GLOWING eyes - BIGGER */}
    <circle cx="60" cy="83" r="9" fill="#00FF88" opacity="0.95"/>
    <circle cx="100" cy="83" r="9" fill="#00FF88" opacity="0.95"/>
    <circle cx="61" cy="83" r="5" fill="#FFFFFF"/>
    <circle cx="101" cy="83" r="5" fill="#FFFFFF"/>
    {/* Glow effect - STRONGER */}
    <circle cx="60" cy="83" r="13" fill="none" stroke="#00FF88" strokeWidth="2" opacity="0.4"/>
    <circle cx="100" cy="83" r="13" fill="none" stroke="#00FF88" strokeWidth="2" opacity="0.4"/>

    {/* Mysterious aura - ENHANCED */}
    <circle cx="80" cy="85" r="68" fill="none" stroke="#00FF88" strokeWidth="1.5" opacity="0.35"/>
    <circle cx="80" cy="85" r="75" fill="none" stroke="#F7931A" strokeWidth="1.5" opacity="0.25"/>

    {/* Lower face in shadow */}
    <ellipse cx="80" cy="112" rx="32" ry="20" fill="#2A2A2A"/>

    {/* Neck */}
    <rect x="68" y="137" width="24" height="23" fill="#2A2A2A"/>

    {/* Dark clothing */}
    <path d="M 50 155 L 68 165 L 80 155 L 92 165 L 110 155 L 80 192 Z" fill="#0A0A0A"/>

    {/* Bitcoin symbol glowing - VERY PROMINENT */}
    <circle cx="80" cy="175" r="14" fill="#F7931A"/>
    <circle cx="80" cy="175" r="19" fill="none" stroke="#F7931A" strokeWidth="1.5" opacity="0.5"/>
    <text x="80" y="184" fontSize="18" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">₿</text>

    {/* Question mark above head - WHO IS SATOSHI? - HUGE */}
    <text x="80" y="38" fontSize="36" fill="#F7931A" textAnchor="middle" fontWeight="bold" opacity="0.95">?</text>
    <text x="80" y="38" fontSize="36" fill="#00FF88" textAnchor="middle" fontWeight="bold" opacity="0.35">?</text>
  </svg>
);
