import React from 'react';

interface AvatarProps {
  className?: string;
}

// Elon Musk - Angular jaw, transplant hairline, smirk, Tesla/SpaceX/X
export const ElonMusk: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Angular face shape - distinctive long face with strong jaw */}
    <path d="M 40 75 Q 38 50 55 35 Q 70 28 80 27 Q 90 28 105 35 Q 122 50 120 75 L 118 105 Q 115 125 105 135 L 95 145 Q 80 150 65 145 L 55 135 Q 45 125 42 105 Z" fill="#F5D4A8"/>

    {/* Hair - distinctive receding hairline with transplant look */}
    <path d="M 42 72 Q 42 48 58 34 Q 72 26 80 25 Q 88 26 102 34 Q 118 48 118 72" fill="none"/>
    <path d="M 55 34 Q 70 26 80 25 Q 90 26 105 34 Q 115 42 118 55 L 115 40 Q 105 30 80 25 Q 55 30 45 40 L 42 55 Q 45 42 55 34 Z" fill="#3A2A1A"/>
    {/* Hair volume on top */}
    <path d="M 50 38 Q 65 20 80 18 Q 95 20 110 38 Q 100 25 80 22 Q 60 25 50 38 Z" fill="#3A2A1A"/>
    {/* Side hair */}
    <path d="M 38 55 L 38 80 Q 40 68 44 55 Z" fill="#3A2A1A"/>
    <path d="M 122 55 L 122 80 Q 120 68 116 55 Z" fill="#3A2A1A"/>

    {/* Ears - slightly prominent */}
    <ellipse cx="36" cy="82" rx="8" ry="14" fill="#F5D4A8"/>
    <ellipse cx="124" cy="82" rx="8" ry="14" fill="#F5D4A8"/>
    <ellipse cx="36" cy="82" rx="4" ry="8" fill="#E8C090" opacity="0.5"/>
    <ellipse cx="124" cy="82" rx="4" ry="8" fill="#E8C090" opacity="0.5"/>

    {/* Brow ridge - prominent */}
    <path d="M 50 68 Q 65 62 80 65 Q 95 62 110 68" fill="#E8C090" opacity="0.3"/>

    {/* Eyes - intense, slightly narrow */}
    <ellipse cx="62" cy="78" rx="10" ry="8" fill="#FFFFFF"/>
    <ellipse cx="98" cy="78" rx="10" ry="8" fill="#FFFFFF"/>
    <circle cx="64" cy="79" r="5.5" fill="#5A8AAD"/>
    <circle cx="100" cy="79" r="5.5" fill="#5A8AAD"/>
    <circle cx="65" cy="78" r="2.5" fill="#1A1A1A"/>
    <circle cx="101" cy="78" r="2.5" fill="#1A1A1A"/>
    <circle cx="66" cy="77" r="1" fill="#FFFFFF"/>
    <circle cx="102" cy="77" r="1" fill="#FFFFFF"/>
    {/* Upper eyelids - slightly hooded */}
    <path d="M 52 75 Q 62 70 72 75" fill="#E8C090" opacity="0.4"/>
    <path d="M 88 75 Q 98 70 108 75" fill="#E8C090" opacity="0.4"/>

    {/* Strong angular eyebrows */}
    <path d="M 50 66 Q 56 61 63 63 Q 68 64 72 67" stroke="#3A2A1A" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M 110 66 Q 104 61 97 63 Q 92 64 88 67" stroke="#3A2A1A" strokeWidth="3" fill="none" strokeLinecap="round"/>

    {/* Nose - slightly pointed, long */}
    <path d="M 80 75 L 80 98" stroke="#E0B888" strokeWidth="2.5"/>
    <path d="M 73 100 Q 76 104 80 105 Q 84 104 87 100" fill="#E8BE90"/>

    {/* Nasolabial folds */}
    <path d="M 65 100 Q 62 110 60 118" stroke="#E0B888" strokeWidth="1" opacity="0.5"/>
    <path d="M 95 100 Q 98 110 100 118" stroke="#E0B888" strokeWidth="1" opacity="0.5"/>

    {/* Characteristic SMIRK - asymmetric, left side up */}
    <path d="M 62 120 Q 72 126 80 125 Q 92 123 100 118" stroke="#B06060" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M 100 117 Q 105 114 108 112" stroke="#B06060" strokeWidth="2" fill="none" strokeLinecap="round"/>

    {/* Slight stubble shadow on jaw */}
    <path d="M 50 130 Q 65 142 80 145 Q 95 142 110 130" fill="#E0C5A0" opacity="0.3"/>

    {/* Chin dimple */}
    <ellipse cx="80" cy="140" rx="3" ry="2" fill="#E0B888" opacity="0.4"/>

    {/* Neck */}
    <rect x="66" y="148" width="28" height="25" fill="#F5D4A8" rx="3"/>

    {/* Black turtleneck / T-shirt */}
    <path d="M 40 170 Q 50 162 66 165 L 80 160 L 94 165 Q 110 162 120 170 L 120 220 L 40 220 Z" fill="#1A1A1A"/>
    {/* Collar */}
    <path d="M 66 165 Q 73 158 80 157 Q 87 158 94 165" fill="#222222"/>

    {/* X logo on chest */}
    <circle cx="80" cy="192" r="12" fill="#000000" stroke="#333" strokeWidth="1"/>
    <text x="80" y="199" fontSize="16" fill="#FFFFFF" textAnchor="middle" fontWeight="bold" fontFamily="Arial">X</text>

    {/* Small Tesla T */}
    <text x="55" y="188" fontSize="10" fill="#E82127" textAnchor="middle" fontWeight="bold" fontFamily="Arial">T</text>

    {/* Small rocket */}
    <path d="M 108 180 L 112 172 L 116 180 Z" fill="#C0C0C0"/>
    <path d="M 109 180 L 112 184 L 115 180" fill="#E74C3C"/>
    <circle cx="112" cy="176" r="1.5" fill="#3498DB"/>
  </svg>
);

// Jeff Bezos - Egg-shaped bald head, massive shine, huge laugh, muscular
export const JeffBezos: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Egg-shaped bald head - wider at top, narrower jaw */}
    <path d="M 30 80 Q 28 45 50 28 Q 65 18 80 17 Q 95 18 110 28 Q 132 45 130 80 L 128 105 Q 124 125 110 135 Q 95 145 80 146 Q 65 145 50 135 Q 36 125 32 105 Z" fill="#F0C890"/>

    {/* MASSIVE SHINE on bald dome */}
    <ellipse cx="72" cy="35" rx="30" ry="18" fill="#FFFFFF" opacity="0.5"/>
    <ellipse cx="68" cy="30" rx="18" ry="12" fill="#FFFFFF" opacity="0.7"/>
    <ellipse cx="65" cy="27" rx="8" ry="6" fill="#FFFFFF" opacity="0.9"/>

    {/* Large ears - sticking out */}
    <ellipse cx="26" cy="85" rx="12" ry="18" fill="#F0C890"/>
    <ellipse cx="134" cy="85" rx="12" ry="18" fill="#F0C890"/>
    <ellipse cx="26" cy="85" rx="6" ry="10" fill="#E0B078" opacity="0.4"/>
    <ellipse cx="134" cy="85" rx="6" ry="10" fill="#E0B078" opacity="0.4"/>

    {/* Eyes - confident, laughing, squinted */}
    <ellipse cx="60" cy="75" rx="10" ry="7" fill="#FFFFFF"/>
    <ellipse cx="100" cy="75" rx="10" ry="7" fill="#FFFFFF"/>
    <circle cx="62" cy="76" r="5" fill="#3A2A1A"/>
    <circle cx="102" cy="76" r="5" fill="#3A2A1A"/>
    <circle cx="63" cy="75" r="2.5" fill="#000"/>
    <circle cx="103" cy="75" r="2.5" fill="#000"/>
    <circle cx="64" cy="74" r="1" fill="#FFFFFF"/>
    <circle cx="104" cy="74" r="1" fill="#FFFFFF"/>
    {/* Laugh lines around eyes */}
    <path d="M 48 72 Q 46 75 47 78" stroke="#D0A870" strokeWidth="1" fill="none"/>
    <path d="M 46 73 Q 44 76 45 79" stroke="#D0A870" strokeWidth="1" fill="none"/>
    <path d="M 112 72 Q 114 75 113 78" stroke="#D0A870" strokeWidth="1" fill="none"/>
    <path d="M 114 73 Q 116 76 115 79" stroke="#D0A870" strokeWidth="1" fill="none"/>

    {/* Thick arched eyebrows */}
    <path d="M 48 63 Q 55 57 62 59 Q 68 60 72 64" stroke="#5A4A3A" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    <path d="M 112 63 Q 105 57 98 59 Q 92 60 88 64" stroke="#5A4A3A" strokeWidth="3.5" fill="none" strokeLinecap="round"/>

    {/* Nose - broad */}
    <path d="M 80 75 L 80 95" stroke="#D0A870" strokeWidth="2"/>
    <path d="M 72 98 Q 76 102 80 103 Q 84 102 88 98" fill="#E0B880"/>
    <circle cx="74" cy="97" r="3" fill="#E0B880"/>
    <circle cx="86" cy="97" r="3" fill="#E0B880"/>

    {/* HUGE trademark Bezos LAUGH - wide open mouth */}
    <path d="M 48 110 Q 80 140 112 110" fill="#8B3030"/>
    <path d="M 48 110 Q 80 135 112 110" fill="#4A1515"/>
    {/* Teeth - top row */}
    <path d="M 55 112 L 55 118 L 62 118 L 62 112" fill="#FFFFFF"/>
    <path d="M 63 111 L 63 119 L 72 119 L 72 111" fill="#FFFFFF"/>
    <path d="M 73 110 L 73 120 L 80 120 L 80 110" fill="#FFFFFF"/>
    <path d="M 81 110 L 81 120 L 88 120 L 88 110" fill="#FFFFFF"/>
    <path d="M 89 111 L 89 119 L 98 119 L 98 111" fill="#FFFFFF"/>
    <path d="M 99 112 L 99 118 L 106 118 L 106 112" fill="#FFFFFF"/>
    {/* Tongue hint */}
    <ellipse cx="80" cy="130" rx="15" ry="8" fill="#D44040"/>

    {/* Strong jaw and chin */}
    <path d="M 50 132 Q 65 148 80 150 Q 95 148 110 132" stroke="#D0A870" strokeWidth="1" fill="none" opacity="0.3"/>

    {/* MUSCULAR neck */}
    <path d="M 58 148 L 55 172 Q 55 172 80 178 Q 105 172 105 172 L 102 148" fill="#F0C890"/>
    {/* Neck tendons */}
    <path d="M 66 150 L 64 170" stroke="#D0A870" strokeWidth="1" opacity="0.3"/>
    <path d="M 94 150 L 96 170" stroke="#D0A870" strokeWidth="1" opacity="0.3"/>

    {/* Blue Origin / casual blue shirt */}
    <path d="M 35 172 Q 48 163 58 168 L 80 160 L 102 168 Q 112 163 125 172 L 125 220 L 35 220 Z" fill="#2C5AA0"/>
    {/* Collar */}
    <path d="M 64 168 Q 72 160 80 158 Q 88 160 96 168" fill="#2468B8"/>

    {/* Amazon smile arrow - VERY PROMINENT */}
    <path d="M 48 195 Q 80 212 112 195" stroke="#FF9900" strokeWidth="5" fill="none" strokeLinecap="round"/>
    <path d="M 105 193 L 112 195 L 108 202" stroke="#FF9900" strokeWidth="4" fill="none" strokeLinecap="round"/>
  </svg>
);

// Michael Saylor - Bitcoin maximalist, strong jaw, laser eyes, dark curly hair
export const MichaelSaylor: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Strong square face */}
    <path d="M 38 78 Q 36 52 50 38 Q 65 28 80 27 Q 95 28 110 38 Q 124 52 122 78 L 120 105 Q 118 120 112 130 L 105 140 Q 90 148 80 148 Q 70 148 55 140 L 48 130 Q 42 120 40 105 Z" fill="#F0C898"/>

    {/* Dark curly hair with gray at temples */}
    <path d="M 48 38 Q 65 18 80 16 Q 95 18 112 38 Q 105 22 80 18 Q 55 22 48 38 Z" fill="#2A1A0A"/>
    {/* Volume/curls */}
    <path d="M 45 35 Q 55 22 65 20 Q 70 19 75 20" stroke="#2A1A0A" strokeWidth="6" fill="none"/>
    <path d="M 85 20 Q 90 19 95 20 Q 105 22 115 35" stroke="#2A1A0A" strokeWidth="6" fill="none"/>
    <path d="M 42 42 Q 50 28 60 22" stroke="#2A1A0A" strokeWidth="5" fill="none"/>
    <path d="M 118 42 Q 110 28 100 22" stroke="#2A1A0A" strokeWidth="5" fill="none"/>
    {/* Gray at temples */}
    <path d="M 36 55 L 36 78 Q 38 65 42 55 Z" fill="#8A8A8A"/>
    <path d="M 124 55 L 124 78 Q 122 65 118 55 Z" fill="#8A8A8A"/>
    <path d="M 38 48 Q 42 42 48 38" stroke="#8A8A8A" strokeWidth="4" fill="none"/>
    <path d="M 122 48 Q 118 42 112 38" stroke="#8A8A8A" strokeWidth="4" fill="none"/>

    {/* Ears */}
    <ellipse cx="34" cy="82" rx="8" ry="14" fill="#F0C898"/>
    <ellipse cx="126" cy="82" rx="8" ry="14" fill="#F0C898"/>

    {/* Rectangular glasses - modern */}
    <rect x="46" y="70" width="27" height="20" rx="3" fill="none" stroke="#1A1A1A" strokeWidth="3"/>
    <rect x="87" y="70" width="27" height="20" rx="3" fill="none" stroke="#1A1A1A" strokeWidth="3"/>
    <line x1="73" y1="80" x2="87" y2="80" stroke="#1A1A1A" strokeWidth="3"/>
    <line x1="46" y1="80" x2="34" y2="77" stroke="#1A1A1A" strokeWidth="2"/>
    <line x1="114" y1="80" x2="126" y2="77" stroke="#1A1A1A" strokeWidth="2"/>

    {/* BITCOIN LASER EYES!!! */}
    <circle cx="60" cy="80" r="8" fill="#F7931A"/>
    <circle cx="100" cy="80" r="8" fill="#F7931A"/>
    {/* Inner glow */}
    <circle cx="60" cy="80" r="4" fill="#FFCC00"/>
    <circle cx="100" cy="80" r="4" fill="#FFCC00"/>
    <circle cx="60" cy="80" r="2" fill="#FFFFFF"/>
    <circle cx="100" cy="80" r="2" fill="#FFFFFF"/>
    {/* Laser beams shooting outward */}
    <line x1="52" y1="80" x2="10" y2="78" stroke="#F7931A" strokeWidth="3" opacity="0.8"/>
    <line x1="52" y1="80" x2="10" y2="82" stroke="#F7931A" strokeWidth="2" opacity="0.5"/>
    <line x1="108" y1="80" x2="150" y2="78" stroke="#F7931A" strokeWidth="3" opacity="0.8"/>
    <line x1="108" y1="80" x2="150" y2="82" stroke="#F7931A" strokeWidth="2" opacity="0.5"/>
    {/* Glow halos */}
    <circle cx="60" cy="80" r="12" fill="none" stroke="#F7931A" strokeWidth="1.5" opacity="0.4"/>
    <circle cx="100" cy="80" r="12" fill="none" stroke="#F7931A" strokeWidth="1.5" opacity="0.4"/>

    {/* Strong eyebrows above glasses */}
    <path d="M 47 65 Q 55 60 64 62 Q 70 63 73 66" stroke="#2A1A0A" strokeWidth="3.5" fill="none"/>
    <path d="M 113 65 Q 105 60 96 62 Q 90 63 87 66" stroke="#2A1A0A" strokeWidth="3.5" fill="none"/>

    {/* Nose - strong */}
    <path d="M 80 80 L 80 100" stroke="#D0A870" strokeWidth="2.5"/>
    <path d="M 74 102 Q 77 106 80 107 Q 83 106 86 102" fill="#E0B880"/>

    {/* Determined, tight-lipped mouth */}
    <path d="M 62 118 Q 72 122 80 122 Q 88 122 98 118" stroke="#8B5050" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* Jaw muscles */}
    <path d="M 42 115 Q 48 128 55 138" stroke="#D0A870" strokeWidth="1" opacity="0.3"/>
    <path d="M 118 115 Q 112 128 105 138" stroke="#D0A870" strokeWidth="1" opacity="0.3"/>

    {/* Strong square chin */}
    <path d="M 60 140 Q 70 148 80 149 Q 90 148 100 140" fill="#E8C090" opacity="0.2"/>

    {/* Neck */}
    <rect x="66" y="148" width="28" height="22" fill="#F0C898" rx="3"/>

    {/* Dark suit with open collar */}
    <path d="M 38 168 Q 50 160 66 165 L 80 158 L 94 165 Q 110 160 122 168 L 122 220 L 38 220 Z" fill="#1A1A2E"/>
    {/* White shirt peek */}
    <path d="M 70 165 Q 75 158 80 156 Q 85 158 90 165" fill="#FFFFFF"/>

    {/* HUGE Bitcoin emblem on chest */}
    <circle cx="80" cy="192" r="16" fill="#F7931A"/>
    <circle cx="80" cy="192" r="13" fill="none" stroke="#FFFFFF" strokeWidth="1.5"/>
    <text x="80" y="200" fontSize="20" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">&#x20BF;</text>

    {/* Floating BTC symbols */}
    <text x="50" y="182" fontSize="10" fill="#F7931A" opacity="0.7" textAnchor="middle" fontWeight="bold">&#x20BF;</text>
    <text x="110" y="182" fontSize="10" fill="#F7931A" opacity="0.7" textAnchor="middle" fontWeight="bold">&#x20BF;</text>
  </svg>
);

// Jerome Powell - Fed Chairman, silver hair, tired eyes, money printer
export const JeromePowell: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Broad, slightly heavy face */}
    <path d="M 35 78 Q 33 50 50 36 Q 65 26 80 25 Q 95 26 110 36 Q 127 50 125 78 L 124 108 Q 120 128 108 138 Q 95 148 80 149 Q 65 148 52 138 Q 40 128 36 108 Z" fill="#F5D0A8"/>

    {/* Distinguished silver/gray hair - parted, full */}
    <path d="M 46 36 Q 65 18 80 16 Q 95 18 114 36" fill="none"/>
    <path d="M 43 40 Q 60 16 80 14 Q 100 16 117 40 Q 108 22 80 17 Q 52 22 43 40 Z" fill="#C0C0C0"/>
    {/* Hair volume */}
    <path d="M 40 45 Q 48 25 65 18 Q 72 16 80 15" stroke="#B0B0B0" strokeWidth="5" fill="none"/>
    <path d="M 120 45 Q 112 25 95 18 Q 88 16 80 15" stroke="#B0B0B0" strokeWidth="5" fill="none"/>
    {/* Part line */}
    <path d="M 72 16 Q 75 20 76 30" stroke="#A0A0A0" strokeWidth="1"/>
    {/* Side hair */}
    <path d="M 33 52 L 33 82 Q 35 67 40 52 Z" fill="#B8B8B8"/>
    <path d="M 127 52 L 127 82 Q 125 67 120 52 Z" fill="#B8B8B8"/>

    {/* Ears */}
    <ellipse cx="31" cy="85" rx="9" ry="15" fill="#F5D0A8"/>
    <ellipse cx="129" cy="85" rx="9" ry="15" fill="#F5D0A8"/>

    {/* Eyes - serious, tired, worried */}
    <ellipse cx="60" cy="80" rx="9" ry="8" fill="#FFFFFF"/>
    <ellipse cx="100" cy="80" rx="9" ry="8" fill="#FFFFFF"/>
    <circle cx="61" cy="81" r="5.5" fill="#5A6A5A"/>
    <circle cx="101" cy="81" r="5.5" fill="#5A6A5A"/>
    <circle cx="62" cy="80" r="2.5" fill="#1A1A1A"/>
    <circle cx="102" cy="80" r="2.5" fill="#1A1A1A"/>
    {/* Heavy eyelids */}
    <path d="M 50 77 Q 60 73 70 77" fill="#E8C090" opacity="0.5"/>
    <path d="M 90 77 Q 100 73 110 77" fill="#E8C090" opacity="0.5"/>
    {/* Prominent bags under eyes */}
    <path d="M 52 88 Q 60 92 68 88" fill="#D8B890" opacity="0.4"/>
    <path d="M 92 88 Q 100 92 108 88" fill="#D8B890" opacity="0.4"/>

    {/* Worried/serious eyebrows - slightly furrowed */}
    <path d="M 48 68 Q 55 63 62 65 Q 68 67 72 70" stroke="#A0A0A0" strokeWidth="3.5" fill="none"/>
    <path d="M 112 68 Q 105 63 98 65 Q 92 67 88 70" stroke="#A0A0A0" strokeWidth="3.5" fill="none"/>
    {/* Worry line between brows */}
    <path d="M 76 66 L 74 72" stroke="#D0B090" strokeWidth="1.5" opacity="0.5"/>
    <path d="M 84 66 L 86 72" stroke="#D0B090" strokeWidth="1.5" opacity="0.5"/>

    {/* Nose - broad, slightly bulbous */}
    <path d="M 80 78 L 80 100" stroke="#D8B888" strokeWidth="2.5"/>
    <path d="M 72 102 Q 76 107 80 108 Q 84 107 88 102" fill="#E0B888"/>
    <circle cx="74" cy="101" r="3.5" fill="#E0B888"/>
    <circle cx="86" cy="101" r="3.5" fill="#E0B888"/>

    {/* Forehead wrinkles */}
    <path d="M 52 52 Q 66 49 80 50 Q 94 49 108 52" stroke="#D8B888" strokeWidth="1" opacity="0.4"/>
    <path d="M 54 58 Q 67 55 80 56 Q 93 55 106 58" stroke="#D8B888" strokeWidth="1" opacity="0.4"/>

    {/* Mouth - tight, neutral, slightly downturned */}
    <path d="M 60 120 Q 70 123 80 123 Q 90 123 100 120" stroke="#906060" strokeWidth="3" fill="none"/>
    <path d="M 58 120 Q 55 122 53 125" stroke="#906060" strokeWidth="1.5" fill="none" opacity="0.5"/>
    <path d="M 102 120 Q 105 122 107 125" stroke="#906060" strokeWidth="1.5" fill="none" opacity="0.5"/>

    {/* Jowls hint */}
    <path d="M 42 118 Q 48 135 55 142" stroke="#D8B888" strokeWidth="1.5" opacity="0.3"/>
    <path d="M 118 118 Q 112 135 105 142" stroke="#D8B888" strokeWidth="1.5" opacity="0.3"/>

    {/* Neck */}
    <rect x="64" y="148" width="32" height="22" fill="#F5D0A8" rx="3"/>

    {/* Expensive dark suit with lapels */}
    <path d="M 32 168 Q 46 158 64 164 L 80 155 L 96 164 Q 114 158 128 168 L 128 220 L 32 220 Z" fill="#1A1A2E"/>
    {/* Suit lapels */}
    <path d="M 64 164 L 72 175 L 80 155 L 88 175 L 96 164" fill="#14142A"/>
    {/* White shirt */}
    <path d="M 72 175 L 80 155 L 88 175 L 84 185 L 80 195 L 76 185 Z" fill="#FFFFFF"/>

    {/* Dark red POWER tie */}
    <path d="M 78 168 L 80 165 L 82 168 L 80 200 Z" fill="#8B0000"/>
    <path d="M 77 172 L 80 168 L 83 172" fill="#A00000"/>

    {/* FED seal */}
    <circle cx="80" cy="210" r="8" fill="#1A4D2E" stroke="#C0A050" strokeWidth="1"/>
    <text x="80" y="213" fontSize="8" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">FED</text>
  </svg>
);

// Aleš Michl - ČNB governor, young, hipster glasses, sharp features
export const AlesMichl: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Lean, angular face - younger looking */}
    <path d="M 42 75 Q 40 50 55 36 Q 68 27 80 26 Q 92 27 105 36 Q 120 50 118 75 L 116 100 Q 114 118 106 128 L 98 138 Q 88 144 80 144 Q 72 144 62 138 L 54 128 Q 46 118 44 100 Z" fill="#F5D4B0"/>

    {/* Dark neat hair - modern cut */}
    <path d="M 50 36 Q 68 16 80 15 Q 92 16 110 36 Q 100 20 80 17 Q 60 20 50 36 Z" fill="#2A1A0A"/>
    {/* Volume on top - neat, modern */}
    <path d="M 46 40 Q 55 18 70 14 Q 76 13 80 13 Q 84 13 90 14 Q 105 18 114 40 Q 105 24 80 18 Q 55 24 46 40 Z" fill="#2A1A0A"/>
    {/* Clean sides */}
    <path d="M 38 50 L 38 78 Q 40 62 44 50 Z" fill="#2A1A0A"/>
    <path d="M 122 50 L 122 78 Q 120 62 116 50 Z" fill="#2A1A0A"/>
    {/* Slightly textured top */}
    <path d="M 56 22 Q 68 14 80 13 Q 92 14 104 22" stroke="#1A0A00" strokeWidth="3" fill="none"/>

    {/* Ears */}
    <ellipse cx="36" cy="80" rx="8" ry="13" fill="#F5D4B0"/>
    <ellipse cx="124" cy="80" rx="8" ry="13" fill="#F5D4B0"/>

    {/* THICK-RIMMED HIPSTER GLASSES - his most distinctive feature */}
    <rect x="44" y="70" width="28" height="22" rx="4" fill="none" stroke="#1A1A1A" strokeWidth="5"/>
    <rect x="88" y="70" width="28" height="22" rx="4" fill="none" stroke="#1A1A1A" strokeWidth="5"/>
    <path d="M 72 81 Q 80 85 88 81" stroke="#1A1A1A" strokeWidth="4" fill="none"/>
    <line x1="44" y1="80" x2="36" y2="78" stroke="#1A1A1A" strokeWidth="3"/>
    <line x1="116" y1="80" x2="124" y2="78" stroke="#1A1A1A" strokeWidth="3"/>

    {/* Eyes behind glasses - sharp, intelligent */}
    <ellipse cx="58" cy="81" rx="8" ry="7" fill="#FFFFFF"/>
    <ellipse cx="102" cy="81" rx="8" ry="7" fill="#FFFFFF"/>
    <circle cx="59" cy="82" r="5" fill="#4A6A7A"/>
    <circle cx="103" cy="82" r="5" fill="#4A6A7A"/>
    <circle cx="60" cy="81" r="2.5" fill="#1A1A1A"/>
    <circle cx="104" cy="81" r="2.5" fill="#1A1A1A"/>
    <circle cx="61" cy="80" r="1" fill="#FFFFFF"/>
    <circle cx="105" cy="80" r="1" fill="#FFFFFF"/>

    {/* Clean eyebrows */}
    <path d="M 47 65 Q 55 60 63 62" stroke="#2A1A0A" strokeWidth="3" fill="none"/>
    <path d="M 113 65 Q 105 60 97 62" stroke="#2A1A0A" strokeWidth="3" fill="none"/>

    {/* Nose - refined */}
    <path d="M 80 78 L 80 98" stroke="#D8B890" strokeWidth="2"/>
    <path d="M 74 100 Q 77 103 80 104 Q 83 103 86 100" fill="#E0BE90"/>

    {/* Professional, slight smile */}
    <path d="M 64 115 Q 72 120 80 120 Q 88 120 96 115" stroke="#906060" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

    {/* Clean-shaven, sharp jawline */}
    <path d="M 54 128 Q 67 142 80 144 Q 93 142 106 128" fill="#E8C8A0" opacity="0.15"/>

    {/* Neck */}
    <rect x="68" y="144" width="24" height="22" fill="#F5D4B0" rx="3"/>

    {/* Dark modern suit */}
    <path d="M 38 164 Q 50 156 68 162 L 80 154 L 92 162 Q 110 156 122 164 L 122 220 L 38 220 Z" fill="#1A1A2E"/>
    {/* Lapels */}
    <path d="M 68 162 L 74 172 L 80 154 L 86 172 L 92 162" fill="#141428"/>
    {/* White shirt */}
    <path d="M 74 172 L 80 154 L 86 172 L 83 180 L 80 190 L 77 180 Z" fill="#FFFFFF"/>

    {/* Czech flag tie - red, white, blue */}
    <path d="M 78 168 L 80 164 L 82 168 L 80 198 Z" fill="#D7141A"/>
    <rect x="78.5" y="178" width="3" height="8" fill="#FFFFFF"/>
    <rect x="78.5" y="186" width="3" height="8" fill="#11457E"/>

    {/* ČNB badge */}
    <circle cx="55" cy="180" r="9" fill="#11457E" stroke="#C0A050" strokeWidth="1"/>
    <text x="55" y="183" fontSize="7" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">ČNB</text>

    {/* Czech lion hint */}
    <circle cx="105" cy="180" r="8" fill="#D7141A" opacity="0.6"/>
    <text x="105" y="184" fontSize="9" fill="#FFFFFF" textAnchor="middle">CZ</text>
  </svg>
);

// Warren Buffett - VERY old, massive round glasses, warm smile, Coca-Cola
export const WarrenBuffett: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Round, friendly face with jowls */}
    <path d="M 32 82 Q 30 52 48 36 Q 62 25 80 24 Q 98 25 112 36 Q 130 52 128 82 L 126 108 Q 124 125 115 136 Q 108 144 100 148 L 92 150 Q 80 152 68 150 L 60 148 Q 52 144 45 136 Q 36 125 34 108 Z" fill="#F5D0A8"/>

    {/* Sparse white/silver hair */}
    <path d="M 50 36 Q 68 22 80 20 Q 92 22 110 36" fill="none"/>
    <path d="M 48 38 Q 62 20 80 18 Q 98 20 112 38 Q 100 24 80 20 Q 60 24 48 38 Z" fill="#E8E8E8"/>
    {/* Thinning on top */}
    <path d="M 55 32 Q 68 22 80 21" stroke="#E0E0E0" strokeWidth="3" fill="none" opacity="0.7"/>
    <path d="M 105 32 Q 92 22 80 21" stroke="#E0E0E0" strokeWidth="3" fill="none" opacity="0.7"/>
    {/* Side hair - sparse */}
    <path d="M 30 55 L 30 85 Q 32 68 36 55 Z" fill="#E0E0E0"/>
    <path d="M 130 55 L 130 85 Q 128 68 124 55 Z" fill="#E0E0E0"/>

    {/* Large old-man ears */}
    <ellipse cx="28" cy="88" rx="11" ry="18" fill="#F5D0A8"/>
    <ellipse cx="132" cy="88" rx="11" ry="18" fill="#F5D0A8"/>
    <ellipse cx="28" cy="88" rx="5" ry="10" fill="#E0B888" opacity="0.3"/>
    <ellipse cx="132" cy="88" rx="5" ry="10" fill="#E0B888" opacity="0.3"/>

    {/* ICONIC MASSIVE ROUND GLASSES - his most recognizable feature */}
    <circle cx="58" cy="82" r="18" fill="none" stroke="#5A4A3A" strokeWidth="5"/>
    <circle cx="102" cy="82" r="18" fill="none" stroke="#5A4A3A" strokeWidth="5"/>
    {/* Lens reflection */}
    <circle cx="58" cy="82" r="16" fill="#FFFFFF" opacity="0.08"/>
    <circle cx="102" cy="82" r="16" fill="#FFFFFF" opacity="0.08"/>
    {/* Bridge */}
    <path d="M 76 82 Q 80 86 84 82" stroke="#5A4A3A" strokeWidth="4" fill="none"/>
    {/* Arms */}
    <line x1="40" y1="80" x2="28" y2="78" stroke="#5A4A3A" strokeWidth="3"/>
    <line x1="120" y1="80" x2="132" y2="78" stroke="#5A4A3A" strokeWidth="3"/>

    {/* Friendly twinkly eyes behind giant glasses */}
    <ellipse cx="58" cy="82" rx="7" ry="6" fill="#FFFFFF"/>
    <ellipse cx="102" cy="82" rx="7" ry="6" fill="#FFFFFF"/>
    <circle cx="59" cy="83" r="4.5" fill="#6A9ABD"/>
    <circle cx="103" cy="83" r="4.5" fill="#6A9ABD"/>
    <circle cx="60" cy="82" r="2" fill="#1A1A1A"/>
    <circle cx="104" cy="82" r="2" fill="#1A1A1A"/>
    <circle cx="61" cy="81" r="0.8" fill="#FFFFFF"/>
    <circle cx="105" cy="81" r="0.8" fill="#FFFFFF"/>

    {/* Wispy eyebrows */}
    <path d="M 42 66 Q 50 62 58 63 Q 65 64 72 67" stroke="#C8C8C8" strokeWidth="2.5" fill="none"/>
    <path d="M 118 66 Q 110 62 102 63 Q 95 64 88 67" stroke="#C8C8C8" strokeWidth="2.5" fill="none"/>

    {/* Nose - bulbous, old */}
    <path d="M 80 80 L 80 100" stroke="#D8B888" strokeWidth="3"/>
    <path d="M 72 103 Q 76 108 80 109 Q 84 108 88 103" fill="#E0B888"/>
    <circle cx="74" cy="102" r="4" fill="#E0B888"/>
    <circle cx="86" cy="102" r="4" fill="#E0B888"/>

    {/* Deep wrinkles */}
    <path d="M 50 55 Q 65 52 80 53 Q 95 52 110 55" stroke="#D8B888" strokeWidth="1" opacity="0.5"/>
    <path d="M 52 60 Q 66 57 80 58 Q 94 57 108 60" stroke="#D8B888" strokeWidth="1" opacity="0.4"/>
    {/* Crow's feet */}
    <path d="M 38 78 Q 36 80 35 83" stroke="#D8B888" strokeWidth="1" opacity="0.4"/>
    <path d="M 37 79 Q 34 81 33 84" stroke="#D8B888" strokeWidth="1" opacity="0.4"/>
    <path d="M 122 78 Q 124 80 125 83" stroke="#D8B888" strokeWidth="1" opacity="0.4"/>
    <path d="M 123 79 Q 126 81 127 84" stroke="#D8B888" strokeWidth="1" opacity="0.4"/>

    {/* Big warm grandfatherly SMILE */}
    <path d="M 52 115 Q 66 130 80 131 Q 94 130 108 115" stroke="#A05050" strokeWidth="3.5" fill="none"/>
    <path d="M 55 116 Q 67 128 80 129 Q 93 128 105 116" fill="#FFB8B8"/>

    {/* Nasolabial folds - deep */}
    <path d="M 62 100 Q 56 112 52 118" stroke="#D8B888" strokeWidth="1.5" opacity="0.5"/>
    <path d="M 98 100 Q 104 112 108 118" stroke="#D8B888" strokeWidth="1.5" opacity="0.5"/>

    {/* Jowls */}
    <path d="M 42 118 Q 50 140 60 148" stroke="#D8B888" strokeWidth="1.5" opacity="0.3"/>
    <path d="M 118 118 Q 110 140 100 148" stroke="#D8B888" strokeWidth="1.5" opacity="0.3"/>

    {/* Neck - older */}
    <rect x="62" y="150" width="36" height="20" fill="#F5D0A8" rx="3"/>

    {/* Conservative dark suit */}
    <path d="M 30 168 Q 44 158 62 164 L 80 155 L 98 164 Q 116 158 130 168 L 130 220 L 30 220 Z" fill="#2A2A4E"/>
    {/* Lapels */}
    <path d="M 62 164 L 70 175 L 80 155 L 90 175 L 98 164" fill="#22224A"/>
    {/* White shirt */}
    <path d="M 70 175 L 80 155 L 90 175 L 86 185 L 80 195 L 74 185 Z" fill="#FFFFFF"/>

    {/* Classic red tie */}
    <path d="M 78 168 L 80 164 L 82 168 L 80 198 Z" fill="#C03030"/>

    {/* Cherry Coke can - his trademark! */}
    <rect x="112" y="170" width="16" height="28" rx="3" fill="#F40009"/>
    <ellipse cx="120" cy="170" rx="8" ry="3" fill="#C00007"/>
    <ellipse cx="120" cy="198" rx="8" ry="3" fill="#C00007"/>
    <text x="120" y="187" fontSize="6" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">Cherry</text>
    <text x="120" y="193" fontSize="6" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">Coke</text>

    {/* BRK.A text */}
    <text x="45" y="190" fontSize="8" fill="#C0A050" textAnchor="middle" fontWeight="bold">BRK.A</text>
  </svg>
);

// Christine Lagarde - Elegant ECB president, silver bob, statement jewelry
export const ChristineLagarde: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Elegant oval face - refined bone structure */}
    <path d="M 42 78 Q 40 52 54 38 Q 66 28 80 27 Q 94 28 106 38 Q 120 52 118 78 L 116 102 Q 114 118 106 128 L 98 136 Q 88 142 80 142 Q 72 142 62 136 L 54 128 Q 46 118 44 102 Z" fill="#F5D4B0"/>

    {/* SIGNATURE silver/white bob haircut - her most iconic feature */}
    <path d="M 50 38 Q 66 18 80 16 Q 94 18 110 38" fill="none"/>
    {/* Full bob shape */}
    <path d="M 30 58 Q 32 30 55 18 Q 68 13 80 12 Q 92 13 105 18 Q 128 30 130 58 L 132 80 Q 132 98 125 108 L 118 90 Q 120 70 118 55 Q 116 35 80 20 Q 44 35 42 55 Q 40 70 42 90 L 35 108 Q 28 98 28 80 Z" fill="#E8E8F0"/>
    {/* Hair texture/layers */}
    <path d="M 35 65 Q 38 45 55 30 Q 68 22 80 20" stroke="#D8D8E0" strokeWidth="2" fill="none"/>
    <path d="M 125 65 Q 122 45 105 30 Q 92 22 80 20" stroke="#D8D8E0" strokeWidth="2" fill="none"/>
    {/* Volume on sides */}
    <path d="M 30 60 Q 28 75 30 90 Q 32 100 38 108" stroke="#D8D8E0" strokeWidth="3" fill="none"/>
    <path d="M 130 60 Q 132 75 130 90 Q 128 100 122 108" stroke="#D8D8E0" strokeWidth="3" fill="none"/>
    {/* Elegant bangs */}
    <path d="M 48 42 Q 60 28 72 25 Q 76 24 80 24" stroke="#E0E0E8" strokeWidth="4" fill="none"/>
    <path d="M 112 42 Q 100 28 88 25 Q 84 24 80 24" stroke="#E0E0E8" strokeWidth="4" fill="none"/>

    {/* Elegant gold STATEMENT earrings - her signature */}
    <circle cx="34" cy="90" r="4" fill="#FFD700"/>
    <ellipse cx="34" cy="100" rx="3.5" ry="7" fill="#FFD700"/>
    <ellipse cx="34" cy="100" rx="2" ry="5" fill="#FFF0C0"/>
    <circle cx="126" cy="90" r="4" fill="#FFD700"/>
    <ellipse cx="126" cy="100" rx="3.5" ry="7" fill="#FFD700"/>
    <ellipse cx="126" cy="100" rx="2" ry="5" fill="#FFF0C0"/>

    {/* Eyes - confident, elegant, slightly almond-shaped */}
    <ellipse cx="62" cy="76" rx="9" ry="7" fill="#FFFFFF"/>
    <ellipse cx="98" cy="76" rx="9" ry="7" fill="#FFFFFF"/>
    <circle cx="63" cy="77" r="5" fill="#4A7A9A"/>
    <circle cx="99" cy="77" r="5" fill="#4A7A9A"/>
    <circle cx="64" cy="76" r="2.5" fill="#1A1A1A"/>
    <circle cx="100" cy="76" r="2.5" fill="#1A1A1A"/>
    <circle cx="65" cy="75" r="0.8" fill="#FFFFFF"/>
    <circle cx="101" cy="75" r="0.8" fill="#FFFFFF"/>
    {/* Elegant eyeliner effect */}
    <path d="M 52 75 Q 62 70 72 74" stroke="#4A3A3A" strokeWidth="1.5" fill="none"/>
    <path d="M 108 75 Q 98 70 88 74" stroke="#4A3A3A" strokeWidth="1.5" fill="none"/>

    {/* Refined arched eyebrows */}
    <path d="M 52 67 Q 58 62 64 63 Q 70 64 73 67" stroke="#B0A0A0" strokeWidth="2" fill="none"/>
    <path d="M 108 67 Q 102 62 96 63 Q 90 64 87 67" stroke="#B0A0A0" strokeWidth="2" fill="none"/>

    {/* Nose - refined, elegant */}
    <path d="M 80 76 L 80 94" stroke="#D8B890" strokeWidth="1.5"/>
    <path d="M 75 96 Q 78 100 80 100 Q 82 100 85 96" fill="#E0BE90"/>

    {/* Professional, composed smile */}
    <path d="M 63 108 Q 72 114 80 114 Q 88 114 97 108" stroke="#A05050" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Subtle lipstick */}
    <path d="M 65 108 Q 72 112 80 112 Q 88 112 95 108" fill="#D06070" opacity="0.5"/>

    {/* High cheekbones - blush */}
    <ellipse cx="48" cy="96" rx="8" ry="4" fill="#E8A0A0" opacity="0.2"/>
    <ellipse cx="112" cy="96" rx="8" ry="4" fill="#E8A0A0" opacity="0.2"/>

    {/* Elegant neck */}
    <rect x="68" y="140" width="24" height="25" fill="#F5D4B0" rx="3"/>

    {/* Gold necklace with large pendant */}
    <path d="M 55 148 Q 68 140 80 138 Q 92 140 105 148" fill="none" stroke="#FFD700" strokeWidth="2"/>
    <circle cx="80" cy="140" r="5" fill="#FFD700"/>
    <circle cx="80" cy="140" r="3" fill="#4A7ADA"/>

    {/* Elegant blazer */}
    <path d="M 35 168 Q 48 158 68 163 L 80 155 L 92 163 Q 112 158 125 168 L 125 220 L 35 220 Z" fill="#1A1A3E"/>
    {/* Lapels */}
    <path d="M 68 163 L 74 174 L 80 155 L 86 174 L 92 163" fill="#141435"/>

    {/* EU/Hermès scarf - blue with gold stars */}
    <path d="M 60 163 Q 70 155 80 153 Q 90 155 100 163" fill="#003399"/>
    <path d="M 58 167 Q 68 158 80 156 Q 92 158 102 167" fill="#003399"/>
    {/* Gold EU stars on scarf */}
    <circle cx="68" cy="162" r="2" fill="#FFCC00"/>
    <circle cx="74" cy="159" r="2" fill="#FFCC00"/>
    <circle cx="80" cy="158" r="2" fill="#FFCC00"/>
    <circle cx="86" cy="159" r="2" fill="#FFCC00"/>
    <circle cx="92" cy="162" r="2" fill="#FFCC00"/>

    {/* ECB logo */}
    <circle cx="80" cy="200" r="10" fill="#003399" stroke="#FFD700" strokeWidth="1.5"/>
    <text x="80" y="204" fontSize="9" fill="#FFD700" textAnchor="middle" fontWeight="bold">ECB</text>

    {/* Euro symbol */}
    <text x="55" y="195" fontSize="14" fill="#FFD700" textAnchor="middle" opacity="0.5" fontWeight="bold">&euro;</text>
  </svg>
);

// Satoshi Nakamoto - mysterious hooded figure, glowing eyes, unknown identity
export const SatoshiNakamoto: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Dark silhouette head */}
    <ellipse cx="80" cy="85" rx="48" ry="55" fill="#2A2A2A"/>

    {/* Deep hood */}
    <path d="M 28 70 Q 35 18 80 10 Q 125 18 132 70 L 128 95 Q 120 65 80 50 Q 40 65 32 95 Z" fill="#0A0A0A"/>
    <path d="M 30 72 Q 36 20 80 12 Q 124 20 130 72" stroke="#1A1A1A" strokeWidth="3" fill="none"/>
    {/* Hood folds */}
    <path d="M 38 80 Q 50 60 80 52 Q 110 60 122 80" stroke="#181818" strokeWidth="2" fill="none"/>

    {/* GLOWING green eyes - mysterious */}
    <circle cx="62" cy="83" r="10" fill="#00FF88" opacity="0.9"/>
    <circle cx="98" cy="83" r="10" fill="#00FF88" opacity="0.9"/>
    {/* Inner eye */}
    <circle cx="62" cy="83" r="6" fill="#00CC66"/>
    <circle cx="98" cy="83" r="6" fill="#00CC66"/>
    {/* Pupil */}
    <circle cx="62" cy="83" r="3" fill="#FFFFFF"/>
    <circle cx="98" cy="83" r="3" fill="#FFFFFF"/>
    {/* Glow effect - pulsating rings */}
    <circle cx="62" cy="83" r="14" fill="none" stroke="#00FF88" strokeWidth="1.5" opacity="0.4"/>
    <circle cx="98" cy="83" r="14" fill="none" stroke="#00FF88" strokeWidth="1.5" opacity="0.4"/>
    <circle cx="62" cy="83" r="18" fill="none" stroke="#00FF88" strokeWidth="1" opacity="0.2"/>
    <circle cx="98" cy="83" r="18" fill="none" stroke="#00FF88" strokeWidth="1" opacity="0.2"/>

    {/* Mysterious aura rings */}
    <circle cx="80" cy="85" r="65" fill="none" stroke="#00FF88" strokeWidth="1" opacity="0.25"/>
    <circle cx="80" cy="85" r="72" fill="none" stroke="#F7931A" strokeWidth="1" opacity="0.2"/>
    <circle cx="80" cy="85" r="80" fill="none" stroke="#00FF88" strokeWidth="0.5" opacity="0.15"/>

    {/* Lower face completely in shadow */}
    <ellipse cx="80" cy="110" rx="30" ry="18" fill="#1A1A1A"/>

    {/* Neck in shadow */}
    <rect x="68" y="135" width="24" height="22" fill="#1A1A1A"/>

    {/* Dark cloak/clothing */}
    <path d="M 38 155 L 68 162 L 80 155 L 92 162 L 122 155 L 122 220 L 38 220 Z" fill="#050505"/>
    {/* Cloak folds */}
    <path d="M 55 165 L 55 220" stroke="#0A0A0A" strokeWidth="1"/>
    <path d="M 105 165 L 105 220" stroke="#0A0A0A" strokeWidth="1"/>

    {/* GLOWING Bitcoin symbol on chest */}
    <circle cx="80" cy="185" r="16" fill="#F7931A"/>
    <circle cx="80" cy="185" r="20" fill="none" stroke="#F7931A" strokeWidth="1.5" opacity="0.5"/>
    <circle cx="80" cy="185" r="24" fill="none" stroke="#F7931A" strokeWidth="1" opacity="0.3"/>
    <text x="80" y="193" fontSize="20" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">&#x20BF;</text>

    {/* Binary code floating around */}
    <text x="35" y="170" fontSize="6" fill="#00FF88" opacity="0.3" fontFamily="monospace">01001</text>
    <text x="110" y="170" fontSize="6" fill="#00FF88" opacity="0.3" fontFamily="monospace">10110</text>
    <text x="30" y="200" fontSize="5" fill="#00FF88" opacity="0.2" fontFamily="monospace">11010</text>
    <text x="115" y="200" fontSize="5" fill="#00FF88" opacity="0.2" fontFamily="monospace">01101</text>

    {/* HUGE question mark above - WHO IS SATOSHI? */}
    <text x="80" y="30" fontSize="28" fill="#F7931A" textAnchor="middle" fontWeight="bold" opacity="0.9">?</text>
    <text x="80" y="30" fontSize="28" fill="#00FF88" textAnchor="middle" fontWeight="bold" opacity="0.3">?</text>
  </svg>
);
