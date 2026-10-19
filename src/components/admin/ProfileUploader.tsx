"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileUploaderProps {
  label?: string;
  currentPhotoUrl?: string | null;
  onUploadSuccess: (url: string) => void;
}

export default function ProfileUploader({ 
  label = "Profile Portrait (4:5 Ratio Recommended)", 
  currentPhotoUrl, 
  onUploadSuccess 
}: ProfileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Invalid file type. Please upload an image (JPG, PNG).");
      return;
    }

    setIsUploading(true);
    setError("");
    setProgress(0);

    try {
      const authRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder: "founders",
        }),
      });

      if (!authRes.ok) {
        throw new Error("Failed to secure upload channel.");
      }

      const { presignedUrl, publicUrl } = await authRes.json();

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", presignedUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setIsUploading(false);
          setProgress(100);
          onUploadSuccess(publicUrl);
        } else {
          throw new Error("Storage server rejected the file.");
        }
      };

      xhr.onerror = () => {
        throw new Error("Transmission error during upload.");
      };

      xhr.send(file);

    } catch (err: any) {
      setIsUploading(false);
      setError(err.message || "An unexpected error occurred.");
      setProgress(0);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">
          {label}
        </label>
      </div>

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative w-full max-w-[280px] aspect-[4/5] border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden group ${
          isDragging 
            ? "border-white bg-zinc-900/80" 
            : "border-zinc-700 bg-black hover:border-zinc-500 hover:bg-zinc-900/50"
        } ${isUploading ? "pointer-events-none" : ""}`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="image/*" 
          className="hidden" 
        />

        {/* Existing Image Preview */}
        <AnimatePresence>
          {currentPhotoUrl && !isUploading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500 z-0"
              style={{ backgroundImage: `url(${currentPhotoUrl})` }}
            />
          )}
        </AnimatePresence>

        {/* Upload Overlay */}
        <div className={`relative z-10 flex flex-col items-center p-6 text-center transition-opacity duration-300 ${currentPhotoUrl && !isUploading && !isDragging ? "opacity-0 group-hover:opacity-100 bg-black/70 w-full h-full justify-center" : ""}`}>
          {isUploading ? (
            <div className="w-full flex flex-col items-center">
              <span className="text-xs font-bold text-white uppercase tracking-widest mb-4">
                Uploading {progress}%
              </span>
              <div className="w-full h-1 bg-zinc-800 rounded overflow-hidden">
                <motion.div 
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          ) : (
            <>
              <span className="text-3xl mb-3 text-white shadow-black drop-shadow-lg">
                📸
              </span>
              <p className="text-sm font-bold text-white uppercase tracking-widest mb-1 shadow-black drop-shadow-md">
                {currentPhotoUrl ? "Replace Portrait" : "Upload Portrait"}
              </p>
              <p className="text-[10px] text-zinc-300 uppercase tracking-widest shadow-black drop-shadow-md">
                Drag & Drop or Click
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs font-bold uppercase tracking-widest mt-2 max-w-[280px]"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}