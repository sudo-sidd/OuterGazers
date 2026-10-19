"use client";

import { useState, useRef, DragEvent, ChangeEvent, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  subLabel?: string;
  icon?: ReactNode;
  error?: string | null;
  isLoading?: boolean;
  progress?: number;
  className?: string;
}

export default function FileDropzone({
  onFileSelect,
  accept = "*/*",
  label = "Drop Asset Here",
  subLabel = "or click to browse local files",
  icon = (
    <svg className="w-8 h-8 text-zinc-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
  error,
  isLoading = false,
  progress,
  className = "",
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
      
      // Reset the input value so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative w-full border-2 border-dashed p-10 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden rounded-lg group
          ${isDragging
            ? "border-white bg-zinc-900/80 scale-[0.99]"
            : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-500 hover:bg-zinc-900/50"
          }
          ${isLoading ? "pointer-events-none" : ""}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={accept}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-xs flex flex-col items-center z-10"
            >
              <span className="text-xs font-bold text-white uppercase tracking-widest mb-4">
                {progress !== undefined ? `Processing... ${progress}%` : "Processing..."}
              </span>
              <div className="w-full h-1 bg-zinc-800 rounded overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: progress !== undefined ? `${progress}%` : "100%" }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center z-10 flex flex-col items-center pointer-events-none"
            >
              <motion.div
                animate={isDragging ? { y: -10, scale: 1.1, color: "#fff" } : { y: 0, scale: 1, color: "#71717a" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {icon}
              </motion.div>
              <p className={`text-sm font-bold uppercase tracking-widest mb-2 transition-colors duration-300 ${isDragging ? "text-white" : "text-zinc-300 group-hover:text-white"}`}>
                {label}
              </p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                {subLabel}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cinematic Hover Background FX */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            className="overflow-hidden"
          >
            <p className="text-red-500 text-xs font-bold uppercase tracking-widest mt-3">
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}