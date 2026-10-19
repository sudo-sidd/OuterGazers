"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";

interface MediaUploaderProps {
  label: string;
  accept: "image/*" | "video/*";
  onUploadSuccess: (url: string) => void;
  currentMediaUrl?: string | null;
}

export default function MediaUploader({ 
  label, 
  accept, 
  onUploadSuccess,
  currentMediaUrl 
}: MediaUploaderProps) {
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
    // Basic validation based on accepted types
    if (accept === "image/*" && !file.type.startsWith("image/")) {
      setError("Invalid file type. Images only.");
      return;
    }
    if (accept === "video/*" && !file.type.startsWith("video/")) {
      setError("Invalid file type. Videos only.");
      return;
    }

    setIsUploading(true);
    setError("");
    setProgress(0);

    try {
      // 1. Get the Presigned URL from our backend
      const authRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder: accept === "video/*" ? "videos" : "images",
        }),
      });

      if (!authRes.ok) {
        throw new Error("Failed to initialize upload link.");
      }

      const { presignedUrl, publicUrl } = await authRes.json();

      // 2. Upload directly to AWS S3 using XMLHttpRequest for progress tracking
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
          throw new Error("Cloud storage rejected the file.");
        }
      };

      xhr.onerror = () => {
        throw new Error("Network error during transmission.");
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
        {currentMediaUrl && !isUploading && (
          <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">
            Asset Linked
          </span>
        )}
      </div>

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative w-full border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden ${
          isDragging 
            ? "border-white bg-zinc-900/80" 
            : "border-zinc-700 bg-black hover:border-zinc-500 hover:bg-zinc-900/50"
        } ${isUploading ? "pointer-events-none" : ""}`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept={accept} 
          className="hidden" 
        />

        {isUploading ? (
          <div className="w-full max-w-xs flex flex-col items-center z-10">
            <span className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Transmitting... {progress}%
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
          <div className="text-center z-10 flex flex-col items-center">
            <span className="text-2xl mb-3 text-zinc-500">
              {accept === "video/*" ? "🎞️" : "🖼️"}
            </span>
            <p className="text-sm font-bold text-white uppercase tracking-widest mb-1">
              Drag & Drop Asset
            </p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest">
              or click to browse local files
            </p>
          </div>
        )}

        {/* Background Preview if asset exists */}
        {currentMediaUrl && accept === "image/*" && !isUploading && (
          <div 
            className="absolute inset-0 z-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentMediaUrl})` }}
          />
        )}
      </div>

      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs font-bold uppercase tracking-widest mt-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}