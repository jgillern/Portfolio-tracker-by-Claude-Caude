import React from 'react';
import type { AvatarId } from '@/config/constants';

interface Props {
  className?: string;
}

const Ninja: React.FC<Props> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#2D2D2D"/>
    <rect x="4" y="14" width="32" height="8" rx="2" fill="#1A1A1A"/>
    <ellipse cx="14" cy="18" rx="3.5" ry="2.5" fill="#FFFFFF"/>
    <ellipse cx="26" cy="18" rx="3.5" ry="2.5" fill="#FFFFFF"/>
    <circle cx="14.5" cy="18" r="1.5" fill="#1A1A1A"/>
    <circle cx="26.5" cy="18" r="1.5" fill="#1A1A1A"/>
    <path d="M 32 16 L 38 12" stroke="#C0C0C0" strokeWidth="1.5"/>
    <path d="M 32 20 L 38 22" stroke="#C0C0C0" strokeWidth="1.5"/>
    <circle cx="20" cy="20" r="18" fill="none" stroke="#E74C3C" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.6"/>
  </svg>
);

const Astronaut: React.FC<Props> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="17" fill="#E0E0E0"/>
    <circle cx="20" cy="20" r="14" fill="#4A90D9"/>
    <circle cx="20" cy="20" r="14" fill="none" stroke="#B0B0B0" strokeWidth="2"/>
    <ellipse cx="20" cy="18" rx="10" ry="9" fill="#87CEEB" opacity="0.3"/>
    <ellipse cx="14" cy="17" rx="3" ry="2.5" fill="#FFFFFF"/>
    <ellipse cx="26" cy="17" rx="3" ry="2.5" fill="#FFFFFF"/>
    <circle cx="14" cy="17" r="1.5" fill="#3A2A1A"/>
    <circle cx="26" cy="17" r="1.5" fill="#3A2A1A"/>
    <path d="M 15 23 Q 20 26 25 23" stroke="#FFB8B8" strokeWidth="1.5" fill="none"/>
    <rect x="6" y="10" width="3" height="6" rx="1.5" fill="#D0D0D0"/>
    <rect x="31" y="10" width="3" height="6" rx="1.5" fill="#D0D0D0"/>
    <circle cx="16" cy="11" r="2" fill="#E74C3C" opacity="0.5"/>
  </svg>
);

const Robot: React.FC<Props> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="28" height="24" rx="4" fill="#95A5A6"/>
    <rect x="6" y="8" width="28" height="24" rx="4" fill="none" stroke="#7F8C8D" strokeWidth="1.5"/>
    <rect x="10" y="13" width="8" height="6" rx="1" fill="#2ECC71"/>
    <rect x="22" y="13" width="8" height="6" rx="1" fill="#2ECC71"/>
    <circle cx="14" cy="16" r="2" fill="#FFFFFF"/>
    <circle cx="26" cy="16" r="2" fill="#FFFFFF"/>
    <rect x="15" y="24" width="10" height="3" rx="1" fill="#7F8C8D"/>
    <rect x="16" y="25" width="2" height="1" fill="#FFFFFF"/>
    <rect x="19" y="25" width="2" height="1" fill="#FFFFFF"/>
    <rect x="22" y="25" width="2" height="1" fill="#FFFFFF"/>
    <line x1="20" y1="2" x2="20" y2="8" stroke="#BDC3C7" strokeWidth="2"/>
    <circle cx="20" cy="3" r="2" fill="#E74C3C"/>
    <rect x="2" y="16" width="4" height="8" rx="2" fill="#BDC3C7"/>
    <rect x="34" y="16" width="4" height="8" rx="2" fill="#BDC3C7"/>
  </svg>
);

const Pirate: React.FC<Props> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="22" r="14" fill="#FFDAB3"/>
    <path d="M 8 14 Q 20 4 32 14 L 34 10 Q 20 -2 6 10 Z" fill="#1A1A1A"/>
    <path d="M 6 10 L 6 14 Q 7 12 8 14" fill="#1A1A1A"/>
    <path d="M 34 10 L 34 14 Q 33 12 32 14" fill="#1A1A1A"/>
    <ellipse cx="14" cy="20" rx="3" ry="2.5" fill="#FFFFFF"/>
    <circle cx="14" cy="20" r="1.5" fill="#3A7BC8"/>
    <ellipse cx="24" cy="18" rx="5" ry="4" fill="#1A1A1A"/>
    <line x1="19" y1="16" x2="29" y2="16" stroke="#1A1A1A" strokeWidth="2"/>
    <line x1="19" y1="20" x2="29" y2="20" stroke="#1A1A1A" strokeWidth="2"/>
    <path d="M 15 28 Q 20 32 25 28" stroke="#B05050" strokeWidth="2" fill="none"/>
    <rect x="24" y="28" width="3" height="4" fill="#FFD700"/>
    <path d="M 6 14 Q 20 8 34 14" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
    <text x="20" y="12" fontSize="6" fill="#FFFFFF" textAnchor="middle">&#x2620;</text>
  </svg>
);

const Wizard: React.FC<Props> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="24" r="13" fill="#FFDAB3"/>
    <path d="M 6 18 L 20 -2 L 34 18 Z" fill="#4A2D8E"/>
    <path d="M 6 18 L 34 18" stroke="#FFD700" strokeWidth="2"/>
    <circle cx="17" cy="10" r="1.5" fill="#FFD700"/>
    <circle cx="23" cy="6" r="1" fill="#FFD700"/>
    <circle cx="20" cy="3" r="1.5" fill="#FFD700"/>
    <ellipse cx="14" cy="22" rx="3" ry="2.5" fill="#FFFFFF"/>
    <ellipse cx="26" cy="22" rx="3" ry="2.5" fill="#FFFFFF"/>
    <circle cx="14.5" cy="22" r="1.5" fill="#6A3EC8"/>
    <circle cx="26.5" cy="22" r="1.5" fill="#6A3EC8"/>
    <path d="M 13 31 Q 20 35 27 31" stroke="#B05050" strokeWidth="1.5" fill="none"/>
    <path d="M 12 32 Q 10 38 14 37 Q 12 36 13 34" fill="#E0E0E0"/>
    <path d="M 28 32 Q 30 38 26 37 Q 28 36 27 34" fill="#E0E0E0"/>
    <path d="M 16 33 Q 20 36 24 33" fill="#E0E0E0" opacity="0.5"/>
  </svg>
);

const Alien: React.FC<Props> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="20" cy="22" rx="14" ry="16" fill="#A8E6CF"/>
    <path d="M 8 14 Q 20 4 32 14 Q 28 8 20 6 Q 12 8 8 14 Z" fill="#8DD6B8"/>
    <ellipse cx="13" cy="20" rx="5" ry="7" fill="#1A1A1A"/>
    <ellipse cx="27" cy="20" rx="5" ry="7" fill="#1A1A1A"/>
    <ellipse cx="13" cy="19" rx="3" ry="4" fill="#00FF88"/>
    <ellipse cx="27" cy="19" rx="3" ry="4" fill="#00FF88"/>
    <circle cx="14" cy="18" r="1.5" fill="#FFFFFF"/>
    <circle cx="28" cy="18" r="1.5" fill="#FFFFFF"/>
    <ellipse cx="20" cy="30" rx="3" ry="1.5" fill="#7DD6B0"/>
    <circle cx="20" cy="30" r="0.8" fill="#5AC09A"/>
    <circle cx="20" cy="30" r="0.4" fill="#3A8A6A"/>
    <circle cx="13" cy="20" r="6" fill="none" stroke="#00FF88" strokeWidth="0.5" opacity="0.3"/>
    <circle cx="27" cy="20" r="6" fill="none" stroke="#00FF88" strokeWidth="0.5" opacity="0.3"/>
  </svg>
);

const CoolCat: React.FC<Props> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="22" r="14" fill="#F5A623"/>
    <path d="M 6 16 L 4 4 L 14 12 Z" fill="#F5A623"/>
    <path d="M 34 16 L 36 4 L 26 12 Z" fill="#F5A623"/>
    <path d="M 6 16 L 4 4 L 14 12" fill="none" stroke="#E09020" strokeWidth="1"/>
    <path d="M 34 16 L 36 4 L 26 12" fill="none" stroke="#E09020" strokeWidth="1"/>
    <path d="M 5 5 L 12 12" stroke="#FFB8B8" strokeWidth="2"/>
    <path d="M 35 5 L 28 12" stroke="#FFB8B8" strokeWidth="2"/>
    <rect x="8" y="18" width="10" height="5" rx="2" fill="#1A1A1A"/>
    <rect x="22" y="18" width="10" height="5" rx="2" fill="#1A1A1A"/>
    <line x1="8" y1="20" x2="18" y2="20" stroke="#FFFFFF" strokeWidth="1"/>
    <line x1="22" y1="20" x2="32" y2="20" stroke="#FFFFFF" strokeWidth="1"/>
    <ellipse cx="20" cy="27" rx="2" ry="1.5" fill="#FF9999"/>
    <path d="M 18 29 Q 20 31 22 29" stroke="#8B5050" strokeWidth="1" fill="none"/>
    <line x1="2" y1="22" x2="8" y2="24" stroke="#E09020" strokeWidth="0.8"/>
    <line x1="2" y1="25" x2="8" y2="25" stroke="#E09020" strokeWidth="0.8"/>
    <line x1="2" y1="28" x2="8" y2="26" stroke="#E09020" strokeWidth="0.8"/>
    <line x1="38" y1="22" x2="32" y2="24" stroke="#E09020" strokeWidth="0.8"/>
    <line x1="38" y1="25" x2="32" y2="25" stroke="#E09020" strokeWidth="0.8"/>
    <line x1="38" y1="28" x2="32" y2="26" stroke="#E09020" strokeWidth="0.8"/>
  </svg>
);

const Bear: React.FC<Props> = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="6" fill="#8B6914"/>
    <circle cx="30" cy="10" r="6" fill="#8B6914"/>
    <circle cx="10" cy="10" r="3" fill="#C09030"/>
    <circle cx="30" cy="10" r="3" fill="#C09030"/>
    <circle cx="20" cy="22" r="15" fill="#A07820"/>
    <ellipse cx="20" cy="26" rx="9" ry="7" fill="#C09030"/>
    <ellipse cx="14" cy="20" rx="3" ry="2.5" fill="#FFFFFF"/>
    <ellipse cx="26" cy="20" rx="3" ry="2.5" fill="#FFFFFF"/>
    <circle cx="14.5" cy="20" r="1.8" fill="#1A1A1A"/>
    <circle cx="26.5" cy="20" r="1.8" fill="#1A1A1A"/>
    <ellipse cx="20" cy="25" rx="3" ry="2" fill="#1A1A1A"/>
    <path d="M 17 29 Q 20 32 23 29" stroke="#8B5050" strokeWidth="1.5" fill="none"/>
    <text x="20" y="38" fontSize="5" fill="#E74C3C" textAnchor="middle" fontWeight="bold">BEAR</text>
  </svg>
);

const AVATAR_COMPONENTS: Record<AvatarId, React.FC<Props>> = {
  ninja: Ninja,
  astronaut: Astronaut,
  robot: Robot,
  pirate: Pirate,
  wizard: Wizard,
  alien: Alien,
  cat: CoolCat,
  bear: Bear,
};

export function FunAvatar({ avatarId, className = '' }: { avatarId: AvatarId; className?: string }) {
  const Component = AVATAR_COMPONENTS[avatarId];
  return <Component className={className} />;
}

export function getDefaultAvatarId(): AvatarId {
  return 'ninja';
}
