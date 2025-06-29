'use client';

import { useState } from 'react';
import { UserRound, Camera, Upload } from 'lucide-react';

interface ProfileImageUploaderProps {
  currentImage?: string;
  onImageChange: (file: File | null, preview: string | null) => void;
  className?: string;
}

export default function ProfileImageUploader({ 
  currentImage, 
  onImageChange, 
  className = '' 
}: ProfileImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onImageChange(file, result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      onImageChange(null, null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div
        className={`relative w-32 h-32 rounded-full border-2 border-dashed transition-all duration-200 ${
          isDragging 
            ? 'border-red-500 bg-red-500/10' 
            : 'border-gray-600 hover:border-red-500'
        } ${preview ? 'border-solid border-red-500' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile preview"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-full">
            <UserRound className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        <label className="absolute inset-0 cursor-pointer rounded-full">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </label>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-400 mb-2">
          Drag & drop or click to upload
        </p>
        <p className="text-xs text-gray-500">
          Supports: JPG, PNG, GIF (Max 5MB)
        </p>
      </div>

      {preview && (
        <button
          onClick={() => handleFileChange(null)}
          className="text-sm text-red-500 hover:text-red-400 transition-colors"
        >
          Remove Image
        </button>
      )}
    </div>
  );
}
