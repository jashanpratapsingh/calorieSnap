"use client";

import React, { useState, useRef, useCallback, type ChangeEvent, type DragEvent } from 'react';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageUpload: (dataUri: string) => void;
  currentImage: string | null;
  disabled?: boolean;
}

export function ImageUploader({ onImageUpload, currentImage, disabled = false }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
      // Clear the file input value if the same file is dropped again
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled) {
       setIsDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
     // Check if the leave target is outside the drop zone
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
       setIsDragging(false);
    }
  };

  const processFile = (file: File) => {
     if (!file.type.startsWith('image/')) {
       // TODO: Add proper error handling/toast notification
       console.error("Invalid file type. Please upload an image.");
       return;
     }
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageUpload(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
     if (!disabled) {
        fileInputRef.current?.click();
     }
  };

  const clearImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent triggering the drop zone click
    onImageUpload(''); // Signal to parent to clear state
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ease-in-out",
        isDragging ? "border-primary bg-accent" : "border-border hover:border-primary/50",
        disabled ? "cursor-not-allowed opacity-50 bg-secondary" : "",
        currentImage ? "border-solid" : ""
      )}
      onClick={triggerFileInput}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      aria-disabled={disabled}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') triggerFileInput(); }}
    >
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      {currentImage ? (
        <div className="relative group">
          <Image
            src={currentImage}
            alt="Uploaded food"
            width={300}
            height={200}
            className="mx-auto rounded-md object-contain max-h-48"
          />
           {!disabled && (
             <Button
               variant="destructive"
               size="icon"
               className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
               onClick={clearImage}
               aria-label="Remove image"
             >
               <X className="h-4 w-4" />
             </Button>
           )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
          <UploadCloud className="h-12 w-12" />
          <p className="font-semibold">Drag & drop an image here</p>
          <p className="text-sm">or click to browse</p>
        </div>
      )}
    </div>
  );
}
