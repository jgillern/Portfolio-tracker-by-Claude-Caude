import React from 'react';

interface AvatarProps {
  className?: string;
}

// Elon Musk - Very angular/blocky jaw, long rectangular face, transplant hairline, smirk
export const ElonMusk: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* VERY angular rectangular face - long, blocky jaw with sharp angles */}
    <path d="M 42 70 L 40 55 Q 42 38 58 30 Q 70 25 80 24 Q 90 25 102 30 Q 118 38 120 55 L 122 70 L 122 100 L 118 120 L 108 138 L 98 148 L 80 152 L 62 148 L 52 138 L 42 120 L 42 100 Z" fill="#F5D4A8"/>
    {/* Sharp cheekbone highlights */}
    <path d="M 42 90 L 50 85 L 48 95" fill="#FDDCB5" opacity="0.6"/>
    <path d="M 122 90 L 114 85 L 116 95" fill="#FDDCB5" opacity="0.6"/>

    {/* Hair - transplant hairline, dark, swept back */}
    <path d="M 58 30 Q 70 24 80 23 Q 90 24 102 30 Q 112 36 118 48 L 114 38 Q 102 28 80 23 Q 58 28 46 38 L 42 48 Q 48 36 58 30 Z" fill="#3A2A1A"/>
    {/* Volume on top - swept back */}
    <path d="M 48 34 Q 64 16 80 14 Q 96 16 112 34 Q 100 20 80 17 Q 60 20 48 34 Z" fill="#3A2A1A"/>
    {/* Side hair */}
    <path d="M 38 52 L 38 78 Q 40 65 44 52 Z" fill="#3A2A1A"/>
    <path d="M 122 52 L 122 78 Q 120 65 118 52 Z" fill="#3A2A1A"/>

    {/* Ears */}
    <ellipse cx="36" cy="82" rx="8" ry="14" fill="#F5D4A8"/>
    <ellipse cx="126" cy="82" rx="8" ry="14" fill="#F5D4A8"/>
    <ellipse cx="36" cy="82" rx="4" ry="8" fill="#E8C090" opacity="0.4"/>
    <ellipse cx="126" cy="82" rx="4" ry="8" fill="#E8C090" opacity="0.4"/>

    {/* Heavy brow ridge */}
    <path d="M 48 68 Q 65 60 80 63 Q 95 60 114 68" fill="#E8C090" opacity="0.4"/>

    {/* Eyes - small, intense, deep-set under heavy brow */}
    <ellipse cx="62" cy="78" rx="9" ry="6" fill="#FFFFFF"/>
    <ellipse cx="100" cy="78" rx="9" ry="6" fill="#FFFFFF"/>
    <circle cx="64" cy="78" r="4.5" fill="#5A8AAD"/>
    <circle cx="102" cy="78" r="4.5" fill="#5A8AAD"/>
    <circle cx="65" cy="77" r="2.2" fill="#1A1A1A"/>
    <circle cx="103" cy="77" r="2.2" fill="#1A1A1A"/>
    <circle cx="66" cy="76" r="0.8" fill="#FFFFFF"/>
    <circle cx="104" cy="76" r="0.8" fill="#FFFFFF"/>
    {/* Heavy hooded lids */}
    <path d="M 52 76 Q 62 70 72 76" fill="#E8C090" opacity="0.5"/>
    <path d="M 90 76 Q 100 70 110 76" fill="#E8C090" opacity="0.5"/>

    {/* Flat, straight angular brows */}
    <path d="M 48 66 L 60 63 L 72 66" stroke="#3A2A1A" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    <path d="M 112 66 L 102 63 L 90 66" stroke="#3A2A1A" strokeWidth="3.5" fill="none" strokeLinecap="round"/>

    {/* Nose - long, slightly pointed */}
    <path d="M 80 72 L 80 100" stroke="#E0B888" strokeWidth="2.5"/>
    <path d="M 73 102 Q 77 106 80 107 Q 83 106 87 102" fill="#E8BE90"/>

    {/* Deep nasolabial folds */}
    <path d="M 64 100 Q 60 112 58 122" stroke="#E0B888" strokeWidth="1.2" opacity="0.5"/>
    <path d="M 98 100 Q 102 112 104 122" stroke="#E0B888" strokeWidth="1.2" opacity="0.5"/>

    {/* Characteristic asymmetric SMIRK - right side up more */}
    <path d="M 60 122 Q 70 128 80 127 Q 94 125 102 120" stroke="#B06060" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M 102 119 Q 108 115 112 112" stroke="#B06060" strokeWidth="2" fill="none" strokeLinecap="round"/>

    {/* Visible jaw muscle bulges */}
    <path d="M 42 100 Q 44 115 52 132" stroke="#E0C5A0" strokeWidth="2" opacity="0.35"/>
    <path d="M 122 100 Q 120 115 112 132" stroke="#E0C5A0" strokeWidth="2" opacity="0.35"/>

    {/* Angular chin */}
    <path d="M 62 148 L 72 152 L 80 154 L 88 152 L 98 148" stroke="#E0B888" strokeWidth="1" opacity="0.3"/>
    <ellipse cx="80" cy="148" rx="3" ry="2" fill="#E0B888" opacity="0.4"/>

    {/* Thick neck */}
    <rect x="64" y="152" width="32" height="22" fill="#F5D4A8" rx="3"/>

    {/* Black turtleneck / T-shirt */}
    <path d="M 38 172 Q 50 162 64 167 L 80 160 L 96 167 Q 110 162 122 172 L 122 220 L 38 220 Z" fill="#1A1A1A"/>
    <path d="M 64 167 Q 73 158 80 157 Q 87 158 96 167" fill="#222222"/>

    {/* X logo on chest */}
    <circle cx="80" cy="194" r="12" fill="#000000" stroke="#333" strokeWidth="1"/>
    <text x="80" y="201" fontSize="16" fill="#FFFFFF" textAnchor="middle" fontWeight="bold" fontFamily="Arial">X</text>

    {/* Small Tesla T */}
    <text x="55" y="190" fontSize="10" fill="#E82127" textAnchor="middle" fontWeight="bold" fontFamily="Arial">T</text>

    {/* Small rocket */}
    <path d="M 108 182 L 112 174 L 116 182 Z" fill="#C0C0C0"/>
    <path d="M 109 182 L 112 186 L 115 182" fill="#E74C3C"/>
    <circle cx="112" cy="178" r="1.5" fill="#3498DB"/>
  </svg>
);

// Jeff Bezos - Smooth bald head, light skin, narrow face, friendly warm smile, suit & tie
export const JeffBezos: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Narrow, elongated bald head — smooth, elegant shape */}
    <path d="M 36 78 Q 34 45 52 30 Q 66 20 80 19 Q 94 20 108 30 Q 126 45 124 78 L 122 105 Q 118 125 108 135 Q 94 145 80 146 Q 66 145 52 135 Q 42 125 38 105 Z" fill="#F5D0A8"/>

    {/* Smooth bald dome shine — clean, polished */}
    <ellipse cx="74" cy="32" rx="28" ry="14" fill="#FFFFFF" opacity="0.35"/>
    <ellipse cx="70" cy="28" rx="16" ry="10" fill="#FFFFFF" opacity="0.5"/>
    <ellipse cx="67" cy="25" rx="7" ry="5" fill="#FFFFFF" opacity="0.7"/>

    {/* Ears — proportional, not too big */}
    <ellipse cx="32" cy="84" rx="9" ry="15" fill="#F5D0A8"/>
    <ellipse cx="128" cy="84" rx="9" ry="15" fill="#F5D0A8"/>
    <ellipse cx="32" cy="84" rx="4" ry="8" fill="#E0B888" opacity="0.3"/>
    <ellipse cx="128" cy="84" rx="4" ry="8" fill="#E0B888" opacity="0.3"/>

    {/* Eyes — friendly, warm, open */}
    <ellipse cx="62" cy="78" rx="9" ry="7" fill="#FFFFFF"/>
    <ellipse cx="98" cy="78" rx="9" ry="7" fill="#FFFFFF"/>
    <circle cx="63" cy="79" r="5" fill="#4A3520"/>
    <circle cx="99" cy="79" r="5" fill="#4A3520"/>
    <circle cx="64" cy="78" r="2.5" fill="#1A1A1A"/>
    <circle cx="100" cy="78" r="2.5" fill="#1A1A1A"/>
    <circle cx="65" cy="77" r="0.8" fill="#FFFFFF"/>
    <circle cx="101" cy="77" r="0.8" fill="#FFFFFF"/>
    {/* Light crow's feet — friendly wrinkles */}
    <path d="M 50 76 Q 48 78 49 81" stroke="#D8B888" strokeWidth="1" fill="none" opacity="0.4"/>
    <path d="M 110 76 Q 112 78 111 81" stroke="#D8B888" strokeWidth="1" fill="none" opacity="0.4"/>

    {/* Thin, neat eyebrows */}
    <path d="M 50 68 Q 57 64 64 66 Q 70 67 73 70" stroke="#8A7A6A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M 110 68 Q 103 64 96 66 Q 90 67 87 70" stroke="#8A7A6A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

    {/* Nose — refined, straight */}
    <path d="M 80 76 L 80 96" stroke="#D8B888" strokeWidth="2"/>
    <path d="M 74 98 Q 77 102 80 103 Q 83 102 86 98" fill="#E0B888"/>

    {/* Nasolabial folds — subtle */}
    <path d="M 66 98 Q 62 108 60 116" stroke="#D8B888" strokeWidth="1" opacity="0.4"/>
    <path d="M 94 98 Q 98 108 100 116" stroke="#D8B888" strokeWidth="1" opacity="0.4"/>

    {/* Warm, friendly closed-mouth smile — slight smirk */}
    <path d="M 58 115 Q 68 122 80 122 Q 92 122 102 115" stroke="#A06060" strokeWidth="3" fill="none" strokeLinecap="round"/>
    {/* Slight smile dimples */}
    <circle cx="56" cy="116" r="2" fill="#D8B888" opacity="0.3"/>
    <circle cx="104" cy="116" r="2" fill="#D8B888" opacity="0.3"/>

    {/* Clean chin */}
    <path d="M 60 138 Q 70 146 80 147 Q 90 146 100 138" stroke="#D8B888" strokeWidth="1" fill="none" opacity="0.2"/>

    {/* Neck */}
    <rect x="66" y="145" width="28" height="22" fill="#F5D0A8" rx="3"/>

    {/* Blue-gray suit with lapels */}
    <path d="M 34 165 Q 48 156 66 162 L 80 154 L 94 162 Q 112 156 126 165 L 126 220 L 34 220 Z" fill="#3A4A5E"/>
    {/* Suit lapels */}
    <path d="M 66 162 L 73 173 L 80 154 L 87 173 L 94 162" fill="#334458"/>
    {/* White shirt */}
    <path d="M 73 173 L 80 154 L 87 173 L 84 182 L 80 192 L 76 182 Z" fill="#FFFFFF"/>

    {/* Patterned tie — dark blue */}
    <path d="M 78 168 L 80 164 L 82 168 L 80 198 Z" fill="#1A2A5E"/>
    <path d="M 77 172 L 80 168 L 83 172" fill="#243470"/>
    {/* Tie pattern dots */}
    <circle cx="80" cy="178" r="0.8" fill="#5A7ABE" opacity="0.6"/>
    <circle cx="80" cy="184" r="0.8" fill="#5A7ABE" opacity="0.6"/>
    <circle cx="80" cy="190" r="0.8" fill="#5A7ABE" opacity="0.6"/>

    {/* Amazon smile arrow */}
    <path d="M 48 205 Q 80 218 112 205" stroke="#FF9900" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M 106 203 L 112 205 L 109 211" stroke="#FF9900" strokeWidth="3" fill="none" strokeLinecap="round"/>
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

// Aleš Michl - ČNB governor, stocky build, wide round face, buzzcut, full thick beard, no glasses, serious
export const AlesMichl: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Wide, round face — stocky guy */}
    <path d="M 34 78 Q 32 48 50 34 Q 64 24 80 23 Q 96 24 110 34 Q 128 48 126 78 L 124 106 Q 122 124 112 134 Q 98 146 80 147 Q 62 146 48 134 Q 38 124 36 106 Z" fill="#F0C8A0"/>

    {/* Short buzzcut hair — fade on sides, slightly longer on top */}
    <path d="M 50 34 Q 64 20 80 18 Q 96 20 110 34 Q 100 22 80 20 Q 60 22 50 34 Z" fill="#3A2A1A"/>
    {/* Very short top — texture lines */}
    <path d="M 52 32 Q 66 18 80 16 Q 94 18 108 32 Q 96 20 80 18 Q 64 20 52 32 Z" fill="#3A2A1A"/>
    <path d="M 58 26 Q 68 20 80 19" stroke="#2A1A0A" strokeWidth="2" fill="none" opacity="0.5"/>
    <path d="M 102 26 Q 92 20 80 19" stroke="#2A1A0A" strokeWidth="2" fill="none" opacity="0.5"/>
    {/* Fade on sides — very short, skin showing through */}
    <path d="M 32 52 Q 34 42 40 36" fill="#3A2A1A" opacity="0.3"/>
    <path d="M 128 52 Q 126 42 120 36" fill="#3A2A1A" opacity="0.3"/>

    {/* Ears — not too big */}
    <ellipse cx="30" cy="82" rx="8" ry="14" fill="#F0C8A0"/>
    <ellipse cx="130" cy="82" rx="8" ry="14" fill="#F0C8A0"/>
    <ellipse cx="30" cy="82" rx="4" ry="8" fill="#D8B080" opacity="0.3"/>
    <ellipse cx="130" cy="82" rx="4" ry="8" fill="#D8B080" opacity="0.3"/>

    {/* Eyes — serious, slightly narrowed, NO glasses */}
    <ellipse cx="62" cy="78" rx="9" ry="6.5" fill="#FFFFFF"/>
    <ellipse cx="98" cy="78" rx="9" ry="6.5" fill="#FFFFFF"/>
    <circle cx="63" cy="78" r="5" fill="#5A7A6A"/>
    <circle cx="99" cy="78" r="5" fill="#5A7A6A"/>
    <circle cx="64" cy="77" r="2.5" fill="#1A1A1A"/>
    <circle cx="100" cy="77" r="2.5" fill="#1A1A1A"/>
    <circle cx="65" cy="76" r="0.8" fill="#FFFFFF"/>
    <circle cx="101" cy="76" r="0.8" fill="#FFFFFF"/>
    {/* Slightly heavy lids — serious expression */}
    <path d="M 52 76 Q 62 72 72 76" fill="#E0B888" opacity="0.4"/>
    <path d="M 88 76 Q 98 72 108 76" fill="#E0B888" opacity="0.4"/>

    {/* Thick, dark, straight eyebrows — stern */}
    <path d="M 48 67 Q 56 63 64 65 Q 70 66 74 69" stroke="#2A1A0A" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    <path d="M 112 67 Q 104 63 96 65 Q 90 66 86 69" stroke="#2A1A0A" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    {/* Slight furrow between brows */}
    <path d="M 76 66 L 75 72" stroke="#D0B080" strokeWidth="1" opacity="0.4"/>
    <path d="M 84 66 L 85 72" stroke="#D0B080" strokeWidth="1" opacity="0.4"/>

    {/* Nose — broad, strong */}
    <path d="M 80 76 L 80 97" stroke="#D8B080" strokeWidth="2.5"/>
    <path d="M 73 99 Q 77 103 80 104 Q 83 103 87 99" fill="#E0B888"/>
    <circle cx="75" cy="98" r="3" fill="#E0B888"/>
    <circle cx="85" cy="98" r="3" fill="#E0B888"/>

    {/* FULL THICK BEARD — his most distinctive feature */}
    {/* Beard mass — covers lower cheeks, jaw and chin */}
    <path d="M 40 95 Q 38 108 42 122 Q 48 138 60 148 Q 70 154 80 155 Q 90 154 100 148 Q 112 138 118 122 Q 122 108 120 95" fill="#2A1A0A" opacity="0.7"/>
    {/* Beard texture — thick, somewhat unkempt */}
    <path d="M 44 100 Q 42 112 46 126" stroke="#1A0A00" strokeWidth="1" opacity="0.3"/>
    <path d="M 52 102 Q 50 115 52 130" stroke="#1A0A00" strokeWidth="1" opacity="0.3"/>
    <path d="M 60 104 Q 58 118 60 138" stroke="#1A0A00" strokeWidth="1" opacity="0.3"/>
    <path d="M 70 106 Q 68 120 70 145" stroke="#1A0A00" strokeWidth="1" opacity="0.3"/>
    <path d="M 80 106 Q 80 122 80 150" stroke="#1A0A00" strokeWidth="1" opacity="0.3"/>
    <path d="M 90 106 Q 92 120 90 145" stroke="#1A0A00" strokeWidth="1" opacity="0.3"/>
    <path d="M 100 104 Q 102 118 100 138" stroke="#1A0A00" strokeWidth="1" opacity="0.3"/>
    <path d="M 108 102 Q 110 115 108 130" stroke="#1A0A00" strokeWidth="1" opacity="0.3"/>
    <path d="M 116 100 Q 118 112 114 126" stroke="#1A0A00" strokeWidth="1" opacity="0.3"/>
    {/* Beard edge — slightly wavy */}
    <path d="M 42 122 Q 50 140 60 148 Q 70 154 80 155 Q 90 154 100 148 Q 110 140 118 122" stroke="#2A1A0A" strokeWidth="2" fill="none" opacity="0.4"/>
    {/* Thick mustache */}
    <path d="M 62 102 Q 70 108 80 109 Q 90 108 98 102" fill="#2A1A0A" opacity="0.8"/>
    <path d="M 64 103 Q 72 107 80 108 Q 88 107 96 103" fill="#1A0A00" opacity="0.5"/>

    {/* Stern, tight-lipped mouth — barely visible through beard */}
    <path d="M 65 114 Q 73 118 80 118 Q 87 118 95 114" stroke="#7A4040" strokeWidth="2" fill="none" strokeLinecap="round"/>

    {/* Slight double chin hint below beard */}
    <path d="M 60 148 Q 70 156 80 157 Q 90 156 100 148" stroke="#D8B080" strokeWidth="1" fill="none" opacity="0.15"/>

    {/* Thick, stocky neck */}
    <path d="M 58 150 L 56 170 Q 56 170 80 175 Q 104 170 104 170 L 102 150" fill="#F0C8A0"/>
    {/* Neck width shows stocky build */}
    <path d="M 62 152 L 60 168" stroke="#D8B080" strokeWidth="1" opacity="0.2"/>
    <path d="M 98 152 L 100 168" stroke="#D8B080" strokeWidth="1" opacity="0.2"/>

    {/* Dark suit — serious, formal */}
    <path d="M 32 168 Q 46 158 58 164 L 80 155 L 102 164 Q 114 158 128 168 L 128 220 L 32 220 Z" fill="#1A1A2E"/>
    {/* Suit lapels */}
    <path d="M 58 164 L 68 175 L 80 155 L 92 175 L 102 164" fill="#141428"/>
    {/* White shirt */}
    <path d="M 68 175 L 80 155 L 92 175 L 88 184 L 80 194 L 72 184 Z" fill="#FFFFFF"/>

    {/* Dark tie */}
    <path d="M 78 170 L 80 166 L 82 170 L 80 200 Z" fill="#1A1A3E"/>
    <path d="M 77 174 L 80 170 L 83 174" fill="#222248"/>

    {/* ČNB badge */}
    <circle cx="52" cy="185" r="9" fill="#11457E" stroke="#C0A050" strokeWidth="1"/>
    <text x="52" y="188" fontSize="7" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">ČNB</text>

    {/* Czech flag pin — correct: white top, red bottom, blue triangle left */}
    <rect x="108" y="180" width="12" height="4" fill="#FFFFFF"/>
    <rect x="108" y="184" width="12" height="4" fill="#D7141A"/>
    <polygon points="108,180 108,188 114,184" fill="#11457E"/>
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

// Satya Nadella - Bald, neat beard, round glasses, warm smile, Microsoft CEO
export const SatyaNadella: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Oval face — warm, friendly */}
    <path d="M 38 78 Q 36 50 52 36 Q 66 26 80 25 Q 94 26 108 36 Q 124 50 122 78 L 120 105 Q 118 122 108 132 Q 96 142 80 143 Q 64 142 52 132 Q 42 122 40 105 Z" fill="#C68642"/>

    {/* Bald dome — closely shaved, subtle shine */}
    <ellipse cx="74" cy="34" rx="26" ry="14" fill="#FFFFFF" opacity="0.2"/>
    <ellipse cx="70" cy="30" rx="14" ry="9" fill="#FFFFFF" opacity="0.35"/>
    <ellipse cx="67" cy="27" rx="6" ry="4" fill="#FFFFFF" opacity="0.5"/>
    {/* Very short stubble hair on sides */}
    <path d="M 36 60 Q 38 50 44 42 Q 50 36 58 32" fill="#3A2A1A" opacity="0.25"/>
    <path d="M 124 60 Q 122 50 116 42 Q 110 36 102 32" fill="#3A2A1A" opacity="0.25"/>

    {/* Ears */}
    <ellipse cx="34" cy="82" rx="8" ry="14" fill="#C68642"/>
    <ellipse cx="126" cy="82" rx="8" ry="14" fill="#C68642"/>
    <ellipse cx="34" cy="82" rx="4" ry="8" fill="#A06830" opacity="0.3"/>
    <ellipse cx="126" cy="82" rx="4" ry="8" fill="#A06830" opacity="0.3"/>

    {/* Round glasses — modern, thin-rimmed */}
    <circle cx="60" cy="78" r="15" fill="none" stroke="#4A4A4A" strokeWidth="3"/>
    <circle cx="100" cy="78" r="15" fill="none" stroke="#4A4A4A" strokeWidth="3"/>
    {/* Lens shine */}
    <circle cx="60" cy="78" r="13" fill="#FFFFFF" opacity="0.06"/>
    <circle cx="100" cy="78" r="13" fill="#FFFFFF" opacity="0.06"/>
    {/* Bridge */}
    <path d="M 75 78 Q 80 82 85 78" stroke="#4A4A4A" strokeWidth="2.5" fill="none"/>
    {/* Arms */}
    <line x1="45" y1="76" x2="34" y2="74" stroke="#4A4A4A" strokeWidth="2"/>
    <line x1="115" y1="76" x2="126" y2="74" stroke="#4A4A4A" strokeWidth="2"/>

    {/* Friendly eyes — warm, approachable */}
    <ellipse cx="60" cy="78" rx="7" ry="6" fill="#FFFFFF"/>
    <ellipse cx="100" cy="78" rx="7" ry="6" fill="#FFFFFF"/>
    <circle cx="61" cy="79" r="4.5" fill="#2A1A0A"/>
    <circle cx="101" cy="79" r="4.5" fill="#2A1A0A"/>
    <circle cx="62" cy="78" r="2" fill="#000000"/>
    <circle cx="102" cy="78" r="2" fill="#000000"/>
    <circle cx="63" cy="77" r="0.8" fill="#FFFFFF"/>
    <circle cx="103" cy="77" r="0.8" fill="#FFFFFF"/>

    {/* Gentle brows */}
    <path d="M 47 66 Q 54 62 61 63 Q 67 64 72 67" stroke="#2A1A0A" strokeWidth="2.5" fill="none"/>
    <path d="M 113 66 Q 106 62 99 63 Q 93 64 88 67" stroke="#2A1A0A" strokeWidth="2.5" fill="none"/>

    {/* Nose — well-proportioned */}
    <path d="M 80 76 L 80 96" stroke="#A06830" strokeWidth="2"/>
    <path d="M 74 98 Q 77 102 80 103 Q 83 102 86 98" fill="#B07840"/>

    {/* NEAT TRIMMED BEARD — his signature look */}
    {/* Beard shadow on cheeks */}
    <path d="M 46 105 Q 44 115 48 128 Q 55 140 66 143 Q 74 145 80 145 Q 86 145 94 143 Q 105 140 112 128 Q 116 115 114 105" fill="#2A1A0A" opacity="0.55"/>
    {/* Beard texture — short trimmed */}
    <path d="M 50 108 Q 48 118 52 130" stroke="#1A0A00" strokeWidth="0.8" opacity="0.3"/>
    <path d="M 58 110 Q 56 120 58 132" stroke="#1A0A00" strokeWidth="0.8" opacity="0.3"/>
    <path d="M 66 112 Q 65 122 66 136" stroke="#1A0A00" strokeWidth="0.8" opacity="0.3"/>
    <path d="M 80 108 Q 80 120 80 140" stroke="#1A0A00" strokeWidth="0.8" opacity="0.3"/>
    <path d="M 94 112 Q 95 122 94 136" stroke="#1A0A00" strokeWidth="0.8" opacity="0.3"/>
    <path d="M 102 110 Q 104 120 102 132" stroke="#1A0A00" strokeWidth="0.8" opacity="0.3"/>
    <path d="M 110 108 Q 112 118 108 130" stroke="#1A0A00" strokeWidth="0.8" opacity="0.3"/>
    {/* Mustache */}
    <path d="M 66 104 Q 72 108 80 109 Q 88 108 94 104" fill="#2A1A0A" opacity="0.6"/>

    {/* Warm, genuine smile — visible through beard */}
    <path d="M 62 116 Q 72 124 80 124 Q 88 124 98 116" stroke="#904040" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    {/* Slight teeth showing */}
    <path d="M 68 117 Q 74 122 80 122 Q 86 122 92 117" fill="#FFFFFF" opacity="0.7"/>

    {/* Smile crinkles at eyes */}
    <path d="M 46 74 Q 44 77 45 80" stroke="#A06830" strokeWidth="0.8" fill="none" opacity="0.5"/>
    <path d="M 114 74 Q 116 77 115 80" stroke="#A06830" strokeWidth="0.8" fill="none" opacity="0.5"/>

    {/* Neck */}
    <rect x="66" y="143" width="28" height="24" fill="#C68642" rx="3"/>

    {/* Casual button-up shirt — tech CEO style */}
    <path d="M 38 165 Q 50 157 66 162 L 80 155 L 94 162 Q 110 157 122 165 L 122 220 L 38 220 Z" fill="#2B2B2B"/>
    {/* Collar */}
    <path d="M 66 162 L 72 168 L 80 155 L 88 168 L 94 162" fill="#222222"/>
    {/* Shirt inner */}
    <path d="M 72 168 L 80 155 L 88 168 L 85 176 L 80 185 L 75 176 Z" fill="#333333"/>
    {/* Button line */}
    <circle cx="80" cy="172" r="1.5" fill="#555"/>
    <circle cx="80" cy="182" r="1.5" fill="#555"/>
    <circle cx="80" cy="192" r="1.5" fill="#555"/>

    {/* Microsoft logo — four colored squares */}
    <rect x="56" y="186" width="7" height="7" fill="#F25022"/>
    <rect x="64" y="186" width="7" height="7" fill="#7FBA00"/>
    <rect x="56" y="194" width="7" height="7" fill="#00A4EF"/>
    <rect x="64" y="194" width="7" height="7" fill="#FFB900"/>

    {/* Azure cloud hint */}
    <path d="M 100 188 Q 102 183 107 183 Q 112 183 113 186 Q 116 185 118 187 Q 120 190 118 192 L 100 192 Q 98 190 100 188 Z" fill="#00A4EF" opacity="0.5"/>
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

    {/* GLOWING orange eyes - mysterious */}
    <circle cx="62" cy="83" r="10" fill="#FF8C00" opacity="0.9"/>
    <circle cx="98" cy="83" r="10" fill="#FF8C00" opacity="0.9"/>
    {/* Inner eye */}
    <circle cx="62" cy="83" r="6" fill="#FF6600"/>
    <circle cx="98" cy="83" r="6" fill="#FF6600"/>
    {/* Pupil */}
    <circle cx="62" cy="83" r="3" fill="#FFFFFF"/>
    <circle cx="98" cy="83" r="3" fill="#FFFFFF"/>
    {/* Glow effect - pulsating rings */}
    <circle cx="62" cy="83" r="14" fill="none" stroke="#FF8C00" strokeWidth="1.5" opacity="0.4"/>
    <circle cx="98" cy="83" r="14" fill="none" stroke="#FF8C00" strokeWidth="1.5" opacity="0.4"/>
    <circle cx="62" cy="83" r="18" fill="none" stroke="#FF8C00" strokeWidth="1" opacity="0.2"/>
    <circle cx="98" cy="83" r="18" fill="none" stroke="#FF8C00" strokeWidth="1" opacity="0.2"/>

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

// Babiš & Trump scheming together — leaning in, sly smirks, plotting
export const BabisAndTrump: React.FC<AvatarProps> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 340 210" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* === ANDREJ BABIŠ — left side, leaning right === */}
    <g transform="rotate(5, 90, 100)">
      {/* Wide, square, heavy face — broad jaw, fleshy */}
      <path d="M 46 58 Q 42 34 54 24 Q 64 16 82 15 Q 100 16 110 24 Q 122 34 118 58 L 116 88 Q 114 106 106 116 L 100 122 Q 92 128 82 128 Q 72 128 64 122 L 58 116 Q 50 106 48 88 Z" fill="#E8C0A0"/>

      {/* Very thin gray hair — scalp visible through, combover */}
      {/* Scalp showing through on top */}
      <ellipse cx="82" cy="20" rx="28" ry="10" fill="#E0B898" opacity="0.4"/>
      {/* Thin wispy hair strands combed back over scalp */}
      <path d="M 54 30 Q 62 12 82 9 Q 102 12 110 30" fill="none"/>
      <path d="M 56 28 Q 66 14 82 11 Q 98 14 108 28" stroke="#B0B0B0" strokeWidth="2" fill="none" opacity="0.7"/>
      <path d="M 58 26 Q 68 14 82 12" stroke="#B8B8B8" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <path d="M 62 24 Q 72 14 82 12" stroke="#C0C0C0" strokeWidth="1" fill="none" opacity="0.4"/>
      <path d="M 106 26 Q 96 14 82 12" stroke="#B8B8B8" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <path d="M 102 24 Q 92 14 82 12" stroke="#C0C0C0" strokeWidth="1" fill="none" opacity="0.4"/>
      {/* Very thin coverage on crown — barely there */}
      <path d="M 58 30 Q 70 10 82 8 Q 94 10 106 30 Q 96 16 82 13 Q 68 16 58 30 Z" fill="#B0B0B0" opacity="0.45"/>
      {/* Side hair — short, gray, more visible */}
      <path d="M 44 38 L 42 60 Q 46 50 50 38 Z" fill="#A0A0A0"/>
      <path d="M 120 38 L 122 60 Q 118 50 114 38 Z" fill="#A0A0A0"/>
      {/* Above-ear hair patches */}
      <path d="M 44 42 Q 46 34 54 28" fill="#A8A8A8" opacity="0.6"/>
      <path d="M 120 42 Q 118 34 110 28" fill="#A8A8A8" opacity="0.6"/>

      {/* Large prominent ears */}
      <ellipse cx="42" cy="72" rx="9" ry="14" fill="#E8C0A0"/>
      <ellipse cx="122" cy="72" rx="9" ry="14" fill="#E8C0A0"/>
      <ellipse cx="42" cy="72" rx="5" ry="9" fill="#D8A888" opacity="0.25"/>
      <ellipse cx="122" cy="72" rx="5" ry="9" fill="#D8A888" opacity="0.25"/>

      {/* BIG forehead — prominent, high, with DEEP wrinkles */}
      <path d="M 56 38 Q 68 35 82 35 Q 96 35 108 38" stroke="#D0A070" strokeWidth="1.2" opacity="0.5"/>
      <path d="M 58 42 Q 70 39 82 39 Q 94 39 106 42" stroke="#D0A070" strokeWidth="1.1" opacity="0.45"/>
      <path d="M 60 46 Q 72 43 82 43 Q 92 43 104 46" stroke="#D0A070" strokeWidth="1" opacity="0.4"/>
      <path d="M 62 50 Q 72 47 82 47 Q 92 47 102 50" stroke="#D0A070" strokeWidth="0.8" opacity="0.3"/>

      {/* Eyes — small, deep-set under MASSIVE brows, intense stare */}
      <ellipse cx="70" cy="66" rx="6.5" ry="4" fill="#FFFFFF"/>
      <ellipse cx="94" cy="66" rx="6.5" ry="4" fill="#FFFFFF"/>
      <circle cx="71" cy="66" r="3.2" fill="#6A7868"/>
      <circle cx="95" cy="66" r="3.2" fill="#6A7868"/>
      <circle cx="72" cy="65.5" r="1.6" fill="#1A1A1A"/>
      <circle cx="96" cy="65.5" r="1.6" fill="#1A1A1A"/>
      <circle cx="73" cy="64.5" r="0.5" fill="#FFFFFF"/>
      <circle cx="97" cy="64.5" r="0.5" fill="#FFFFFF"/>
      {/* Heavy drooping lids — stern, intense */}
      <path d="M 62 64 Q 70 60 78 64" fill="#D8B088" opacity="0.7"/>
      <path d="M 86 64 Q 94 60 102 64" fill="#D8B088" opacity="0.7"/>
      {/* Deep under-eye bags */}
      <path d="M 63 70 Q 70 73 77 70" stroke="#C89868" strokeWidth="1" fill="none" opacity="0.4"/>
      <path d="M 87 70 Q 94 73 101 70" stroke="#C89868" strokeWidth="1" fill="none" opacity="0.4"/>

      {/* ★ MASSIVE bushy dark gray eyebrows — THE iconic feature ★ */}
      {/* Left brow — thick, dark, furrowed/angry */}
      <path d="M 58 56 Q 64 50 70 52 Q 74 53 78 56" stroke="#5A5A5A" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <path d="M 59 55 Q 65 50 71 51.5" stroke="#686868" strokeWidth="2" fill="none" opacity="0.5"/>
      {/* Right brow — matching */}
      <path d="M 106 56 Q 100 50 94 52 Q 90 53 86 56" stroke="#5A5A5A" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
      <path d="M 105 55 Q 99 50 93 51.5" stroke="#686868" strokeWidth="2" fill="none" opacity="0.5"/>
      {/* Brow furrow lines between them — frowning crease */}
      <path d="M 78 54 Q 82 50 86 54" stroke="#C09060" strokeWidth="1" fill="none" opacity="0.4"/>
      <path d="M 79 56 Q 82 52 85 56" stroke="#C09060" strokeWidth="0.8" fill="none" opacity="0.3"/>

      {/* Nose — wide, broad, bulbous tip */}
      <path d="M 82 60 L 81 80" stroke="#D0A070" strokeWidth="3"/>
      <path d="M 72 84 Q 77 90 82 92 Q 87 90 92 84" fill="#D8A878"/>
      <ellipse cx="76" cy="84" rx="3.5" ry="2.5" fill="#D0A070" opacity="0.5"/>
      <ellipse cx="88" cy="84" rx="3.5" ry="2.5" fill="#D0A070" opacity="0.5"/>
      {/* Nostrils */}
      <ellipse cx="77" cy="86" rx="2" ry="1.2" fill="#B08060" opacity="0.3"/>
      <ellipse cx="87" cy="86" rx="2" ry="1.2" fill="#B08060" opacity="0.3"/>

      {/* Very deep nasolabial folds */}
      <path d="M 70 86 Q 62 98 60 108" stroke="#C89060" strokeWidth="1.8" opacity="0.5"/>
      <path d="M 94 86 Q 102 98 104 108" stroke="#C89060" strokeWidth="1.8" opacity="0.5"/>

      {/* Stern, downturned mouth — grimace/frown, scheming version */}
      <path d="M 66 108 Q 74 112 82 111 Q 92 110 100 106" stroke="#906060" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* One corner slightly up — the scheming smirk */}
      <path d="M 100 105 Q 104 102 106 98" stroke="#906060" strokeWidth="1.2" fill="none" strokeLinecap="round"/>

      {/* Heavy jowls — sagging cheeks */}
      <path d="M 48 100 Q 52 114 62 122" stroke="#D0A070" strokeWidth="1.2" opacity="0.35"/>
      <path d="M 116 100 Q 112 114 102 122" stroke="#D0A070" strokeWidth="1.2" opacity="0.35"/>
      <ellipse cx="56" cy="108" rx="6" ry="4" fill="#E0B898" opacity="0.15"/>
      <ellipse cx="108" cy="108" rx="6" ry="4" fill="#E0B898" opacity="0.15"/>

      {/* Chin — wide, squared */}
      <ellipse cx="82" cy="124" rx="10" ry="4" fill="#D8B090" opacity="0.15"/>

      {/* Thick neck */}
      <rect x="68" y="128" width="28" height="14" fill="#E8C0A0" rx="2"/>

      {/* Dark suit jacket */}
      <path d="M 38 140 Q 52 132 68 138 L 82 130 L 96 138 Q 112 132 126 140 L 126 200 L 38 200 Z" fill="#2A2A2A"/>
      {/* Lapels — wider */}
      <path d="M 68 138 L 73 148 L 82 130 L 91 148 L 96 138" fill="#222222"/>

      {/* White shirt — OPEN COLLAR, no tie */}
      <path d="M 73 148 L 82 130 L 91 148 L 89 158 L 82 166 L 75 158 Z" fill="#FFFFFF"/>
      {/* Open collar V-shape */}
      <path d="M 76 140 L 82 134 L 88 140" stroke="#E8E8E8" strokeWidth="1" fill="none"/>
      {/* Visible chest/skin in collar opening */}
      <path d="M 78 142 L 82 136 L 86 142 L 84 148 L 82 150 L 80 148 Z" fill="#E0B898" opacity="0.5"/>

      {/* Czech flag pin on lapel */}
      <rect x="100" y="146" width="8" height="4" fill="#FFFFFF" rx="0.3"/>
      <rect x="100" y="150" width="8" height="4" fill="#D7141A" rx="0.3"/>
      <polygon points="100,146 100,154 104,150" fill="#11457E"/>

      {/* AGROFERT badge */}
      <text x="54" y="162" fontSize="5" fill="#8AB040" textAnchor="middle" fontWeight="bold" opacity="0.5">AGF</text>
    </g>

    {/* === DONALD TRUMP — right side, leaning left === */}
    <g transform="rotate(-5, 250, 100)">
      {/* Wide, round face — orange/tan tone */}
      <path d="M 210 62 Q 208 38 220 28 Q 232 20 244 19 Q 256 20 268 28 Q 280 38 278 62 L 276 88 Q 274 106 266 114 Q 258 122 250 124 L 244 125 Q 238 124 232 122 Q 222 116 218 106 L 214 88 Z" fill="#F0B070"/>

      {/* ICONIC blonde/orange hair — voluminous, swept over */}
      <path d="M 218 30 Q 228 8 244 6 Q 260 8 270 30" fill="none"/>
      {/* Main hair mass — tall, dramatic, swept to the right */}
      <path d="M 206 38 Q 210 10 230 4 Q 244 2 258 4 Q 282 10 284 38 Q 280 18 258 8 Q 244 6 230 8 Q 212 18 206 38 Z" fill="#E8C040"/>
      {/* Extra volume on top — the signature poof */}
      <path d="M 210 34 Q 220 8 240 3 Q 250 2 260 4 Q 278 10 282 34" fill="#DDB838"/>
      {/* Swept back texture */}
      <path d="M 216 28 Q 228 10 244 6" stroke="#D0A828" strokeWidth="2" fill="none"/>
      <path d="M 220 32 Q 232 14 244 8" stroke="#D0A828" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <path d="M 272 28 Q 260 10 244 6" stroke="#D0A828" strokeWidth="2" fill="none"/>
      {/* Side hair — covering ears partially */}
      <path d="M 206 38 L 204 58 Q 208 48 212 38 Z" fill="#DDB838"/>
      <path d="M 282 38 L 284 58 Q 280 48 276 38 Z" fill="#DDB838"/>
      {/* Front wave/swoop */}
      <path d="M 212 36 Q 218 24 232 18 Q 240 16 244 16" stroke="#F0D050" strokeWidth="3" fill="none"/>

      {/* Ears — partially hidden by hair */}
      <ellipse cx="208" cy="68" rx="6" ry="11" fill="#F0B070"/>
      <ellipse cx="280" cy="68" rx="6" ry="11" fill="#F0B070"/>

      {/* Eyes — small, squinting, under heavy orange brow */}
      <ellipse cx="232" cy="62" rx="7" ry="5" fill="#FFFFFF"/>
      <ellipse cx="256" cy="62" rx="7" ry="5" fill="#FFFFFF"/>
      <circle cx="233" cy="62" r="4" fill="#5A8AB0"/>
      <circle cx="257" cy="62" r="4" fill="#5A8AB0"/>
      <circle cx="234" cy="61" r="2" fill="#1A1A1A"/>
      <circle cx="258" cy="61" r="2" fill="#1A1A1A"/>
      <circle cx="235" cy="60" r="0.7" fill="#FFFFFF"/>
      <circle cx="259" cy="60" r="0.7" fill="#FFFFFF"/>
      {/* White under-eye area — pale around eyes */}
      <ellipse cx="232" cy="62" rx="10" ry="8" fill="#FCE8D0" opacity="0.25"/>
      <ellipse cx="256" cy="62" rx="10" ry="8" fill="#FCE8D0" opacity="0.25"/>
      {/* Heavy lids */}
      <path d="M 224 60 Q 232 55 240 60" fill="#E0A060" opacity="0.5"/>
      <path d="M 248 60 Q 256 55 264 60" fill="#E0A060" opacity="0.5"/>

      {/* Blonde/light eyebrows */}
      <path d="M 222 54 Q 228 50 234 52 Q 238 53 240 55" stroke="#D0A828" strokeWidth="2.5" fill="none"/>
      <path d="M 266 54 Q 260 50 254 52 Q 250 53 248 55" stroke="#D0A828" strokeWidth="2.5" fill="none"/>

      {/* Nose — wide, slightly upturned */}
      <path d="M 244 60 L 244 80" stroke="#D09858" strokeWidth="2"/>
      <path d="M 238 82 Q 241 86 244 87 Q 247 86 250 82" fill="#D8A060"/>
      <circle cx="239" cy="81" r="2.5" fill="#D8A060"/>
      <circle cx="249" cy="81" r="2.5" fill="#D8A060"/>

      {/* Pursed/pouty lips — classic Trump expression */}
      <ellipse cx="244" cy="98" rx="12" ry="4" fill="#D08060"/>
      <path d="M 234 98 Q 244 104 254 98" fill="#C07050"/>
      <path d="M 236 97 Q 244 93 252 97" fill="#D88868"/>

      {/* Double chin */}
      <path d="M 226 118 Q 236 126 244 127 Q 252 126 262 118" fill="#E8A868" opacity="0.25"/>
      <path d="M 228 120 Q 238 128 244 128 Q 250 128 260 120" stroke="#D09050" strokeWidth="0.8" fill="none" opacity="0.3"/>

      {/* Jowls */}
      <path d="M 214 100 Q 218 112 224 118" stroke="#D09858" strokeWidth="1" opacity="0.3"/>
      <path d="M 274 100 Q 270 112 264 118" stroke="#D09858" strokeWidth="1" opacity="0.3"/>

      {/* Neck — thick */}
      <rect x="232" y="124" width="24" height="16" fill="#F0B070" rx="2"/>

      {/* Blue suit */}
      <path d="M 204 138 Q 216 130 232 136 L 244 128 L 256 136 Q 272 130 284 138 L 284 200 L 204 200 Z" fill="#1A3A6E"/>
      {/* Lapels */}
      <path d="M 232 136 L 237 144 L 244 128 L 251 144 L 256 136" fill="#163060"/>
      {/* White shirt */}
      <path d="M 237 144 L 244 128 L 251 144 L 248 152 L 244 160 L 240 152 Z" fill="#FFFFFF"/>

      {/* RED power tie — signature */}
      <path d="M 242 140 L 244 136 L 246 140 L 244 170 Z" fill="#CC2020"/>
      <path d="M 241 144 L 244 140 L 247 144" fill="#DD3030"/>

      {/* American flag pin */}
      <rect x="260" y="142" width="8" height="5" rx="0.5" fill="#B22234"/>
      <rect x="260" y="142" width="3" height="3" fill="#3C3B6E"/>
      <line x1="260" y1="143.5" x2="268" y2="143.5" stroke="#FFFFFF" strokeWidth="0.5"/>
      <line x1="260" y1="145" x2="268" y2="145" stroke="#FFFFFF" strokeWidth="0.5"/>
      <circle cx="261.5" cy="143" r="0.3" fill="#FFFFFF"/>
    </g>

    {/* === SCHEMING ELEMENTS between them === */}
    {/* Shared devious thought bubble */}
    <ellipse cx="170" cy="30" rx="30" ry="16" fill="#FFFFFF" opacity="0.85"/>
    <ellipse cx="170" cy="30" rx="28" ry="14" fill="#FFFFFF" opacity="0.95"/>
    <circle cx="155" cy="48" r="5" fill="#FFFFFF" opacity="0.7"/>
    <circle cx="148" cy="56" r="3" fill="#FFFFFF" opacity="0.5"/>
    <circle cx="185" cy="48" r="5" fill="#FFFFFF" opacity="0.7"/>
    <circle cx="192" cy="56" r="3" fill="#FFFFFF" opacity="0.5"/>
    {/* Dollar and money signs in thought bubble */}
    <text x="158" y="35" fontSize="14" fill="#2A8A2A" textAnchor="middle" fontWeight="bold" opacity="0.8">$</text>
    <text x="170" y="35" fontSize="14" fill="#2A8A2A" textAnchor="middle" fontWeight="bold" opacity="0.8">$</text>
    <text x="182" y="35" fontSize="14" fill="#2A8A2A" textAnchor="middle" fontWeight="bold" opacity="0.8">$</text>

    {/* === DISINTEGRATING CZECH FLAG — left/Babiš side === */}
    {/* Main flag body — cracking, pieces falling away */}
    <g opacity="0.75">
      {/* Main flag piece — tilted, damaged */}
      <g transform="rotate(-12, 30, 180)">
        <rect x="10" y="172" width="28" height="8" fill="#FFFFFF"/>
        <rect x="10" y="180" width="28" height="8" fill="#D7141A"/>
        <polygon points="10,172 10,188 20,180" fill="#11457E"/>
        {/* Crack across flag */}
        <path d="M 18 172 L 22 177 L 19 182 L 24 188" stroke="#1A1A1A" strokeWidth="0.6" fill="none" opacity="0.5"/>
      </g>
      {/* Broken-off piece floating away — top right */}
      <g transform="rotate(25, 50, 168)">
        <polygon points="44,164 54,164 54,170 48,170" fill="#FFFFFF" opacity="0.6"/>
        <polygon points="48,170 54,170 54,172 44,172" fill="#D7141A" opacity="0.6"/>
      </g>
      {/* Small shard falling */}
      <rect x="22" y="194" width="5" height="4" fill="#D7141A" opacity="0.4" transform="rotate(35, 24, 196)"/>
      {/* Another shard */}
      <polygon points="38,190 44,188 42,194" fill="#11457E" opacity="0.35" transform="rotate(-20, 40, 191)"/>
      {/* Tiny debris */}
      <rect x="16" y="200" width="3" height="2" fill="#FFFFFF" opacity="0.3" transform="rotate(50, 17, 201)"/>
      <rect x="34" y="198" width="2" height="3" fill="#D7141A" opacity="0.25" transform="rotate(-15, 35, 199)"/>
    </g>

    {/* === DISINTEGRATING AMERICAN FLAG — right/Trump side === */}
    {/* Main flag body — cracking, pieces falling apart */}
    <g opacity="0.75">
      {/* Main flag piece — tilted, damaged */}
      <g transform="rotate(12, 310, 180)">
        <rect x="296" y="170" width="30" height="18" fill="#B22234"/>
        {/* Stripes */}
        <rect x="296" y="172.5" width="30" height="2.5" fill="#FFFFFF"/>
        <rect x="296" y="177.5" width="30" height="2.5" fill="#FFFFFF"/>
        <rect x="296" y="182.5" width="30" height="2.5" fill="#FFFFFF"/>
        {/* Blue canton */}
        <rect x="296" y="170" width="12" height="10" fill="#3C3B6E"/>
        {/* Stars hint */}
        <circle cx="299" cy="173" r="0.6" fill="#FFFFFF"/>
        <circle cx="302" cy="173" r="0.6" fill="#FFFFFF"/>
        <circle cx="305" cy="173" r="0.6" fill="#FFFFFF"/>
        <circle cx="300" cy="176" r="0.6" fill="#FFFFFF"/>
        <circle cx="304" cy="176" r="0.6" fill="#FFFFFF"/>
        {/* Crack across flag */}
        <path d="M 308 170 L 312 175 L 308 180 L 314 188" stroke="#1A1A1A" strokeWidth="0.6" fill="none" opacity="0.5"/>
      </g>
      {/* Broken-off piece floating away */}
      <g transform="rotate(-30, 298, 168)">
        <polygon points="290,162 300,162 298,168 288,168" fill="#B22234" opacity="0.6"/>
        <line x1="290" y1="165" x2="300" y2="165" stroke="#FFFFFF" strokeWidth="1" opacity="0.5"/>
      </g>
      {/* Shard of blue canton falling */}
      <rect x="316" y="194" width="6" height="5" fill="#3C3B6E" opacity="0.4" transform="rotate(-40, 319, 196)"/>
      <circle cx="318" cy="196" r="0.4" fill="#FFFFFF" opacity="0.3"/>
      {/* Red stripe shard */}
      <polygon points="304,196 312,194 310,200" fill="#B22234" opacity="0.35" transform="rotate(25, 308, 197)"/>
      {/* Tiny debris */}
      <rect x="320" y="202" width="3" height="2" fill="#FFFFFF" opacity="0.3" transform="rotate(-55, 321, 203)"/>
      <rect x="300" y="200" width="2" height="3" fill="#B22234" opacity="0.25" transform="rotate(20, 301, 201)"/>
    </g>

    {/* Sneaky hand gesture lines between them */}
    <path d="M 120 140 Q 135 135 145 140" stroke="#F0C8A0" strokeWidth="1.5" opacity="0.4"/>
    <path d="M 195 140 Q 210 135 220 140" stroke="#F0B070" strokeWidth="1.5" opacity="0.4"/>
  </svg>
);
