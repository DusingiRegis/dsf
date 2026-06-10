'use client';

import { useState, useRef } from 'react';

interface ImageReorderGridProps {
  images: string[];
  onImagesChange: (newImages: string[]) => void;
}

export default function ImageReorderGrid({ images, onImagesChange }: ImageReorderGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    
    const newImages = [...images];
    const [draggedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(targetIndex, 0, draggedImage);
    onImagesChange(newImages);
    setDraggedIndex(null);
  };

  const deleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const [coverImage] = newImages.splice(index, 1);
    newImages.unshift(coverImage);
    onImagesChange(newImages);
  };

  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((url, index) => (
        <div
          key={index}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className={`relative group rounded-lg overflow-hidden transition-all ${
            draggedIndex === index ? 'opacity-50 scale-95 shadow-lg' : 'hover:shadow-md'
          }`}
        >
          <img
            src={url}
            alt={`Property image ${index + 1}`}
            className="w-full h-28 object-cover"
          />
          
          {/* Cover badge */}
          {index === 0 && (
            <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
              Cover
            </div>
          )}

          {/* Controls */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {index !== 0 && (
              <button
                type="button"
                onClick={() => setAsCover(index)}
                className="bg-white/90 hover:bg-white text-amber-600 p-1.5 rounded-full shadow-md"
                title="Set as cover"
              >
                ★
              </button>
            )}
            <button
              type="button"
              onClick={() => deleteImage(index)}
              className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md"
              title="Delete"
            >
              ×
            </button>
          </div>

          {/* Drag indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-slate-500 text-xs">
            Drag to reorder
          </div>
        </div>
      ))}
    </div>
  );
}
