'use client';

import React from 'react';

interface Props {
  id: string;
  isDragged: boolean;
  isDragOver: boolean;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDragEnd: () => void;
  children: React.ReactNode;
}

export function DraggableSection({
  id,
  isDragged,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragEnd,
  children,
}: Props) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(id);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        onDragOver(id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDragEnd();
      }}
      onDragEnd={onDragEnd}
      className={`relative transition-all duration-200 ${
        isDragged ? 'opacity-40 scale-[0.98]' : ''
      } ${isDragOver && !isDragged ? 'ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-gray-900 rounded-xl' : ''}`}
    >
      {/* Drag handle indicator */}
      <div className="absolute top-2 right-2 z-10 cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="9" cy="5" r="1.5" />
          <circle cx="15" cy="5" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="19" r="1.5" />
          <circle cx="15" cy="19" r="1.5" />
        </svg>
      </div>
      {children}
    </div>
  );
}
