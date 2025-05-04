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
    <div className="w-full">
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[300px] rounded-xl border-2 border-dashed transition-smooth",
          "bg-secondary/50 hover:bg-secondary/70",
          isDragging ? "border-primary scale-[1.02] bg-secondary/70" : "border-muted-foreground/25",
          disabled && "opacity-60 cursor-not-allowed"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
          disabled={disabled}
        />
        
        {currentImage ? (
          <div className="relative group w-full h-full min-h-[300px]">
            <Image
              src={currentImage}
              alt="Uploaded food"
              fill
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center rounded-lg">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-background/90 hover:bg-background/100 transition-smooth"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                Change Image
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center gap-4 p-6 cursor-pointer text-center"
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <div className="rounded-full bg-primary/10 p-4 transition-smooth group-hover:scale-110">
              <UploadCloud className="h-10 w-10 text-primary transition-smooth" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Drop your image here</h3>
              <p className="text-muted-foreground text-sm">
                Supports JPG, PNG and WEBP
              </p>
            </div>
            <Button 
              variant="outline" 
              disabled={disabled}
              className="mt-2 transition-smooth hover:scale-105"
            >
              Choose File
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
