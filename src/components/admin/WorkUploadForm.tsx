"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MediaUploader from "./MediaUploader";

interface Work {
  id?: string;
  title: string;
  description: string;
  sector: "AR" | "VR_QUEST" | "PC" | "ANDROID";
  coverImageUrl: string | null;
  videoUrl: string | null;
  downloadLink: string | null;
  isPublished: boolean;
}

interface WorkUploadFormProps {
  work?: Work | null;
  onSuccess: () => void;
}

export default function WorkUploadForm({ work, onSuccess }: WorkUploadFormProps) {
  const isNew = !work;

  const [formData, setFormData] = useState<Work>({
    id: work?.id || "",
    title: work?.title || "",
    description: work?.description || "",
    sector: work?.sector || "PC",
    coverImageUrl: work?.coverImageUrl || "",
    videoUrl: work?.videoUrl || "",
    downloadLink: work?.downloadLink || "",
    isPublished: work !== undefined && work !== null ? work.isPublished : true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMediaUpload = (field: "coverImageUrl" | "videoUrl", url: string) => {
    setFormData({ ...formData, [field]: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/works", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus({
          type: "success",
          message: isNew ? "Project successfully deployed." : "Project configuration updated.",
        });
        setTimeout(() => onSuccess(), 1500);
      } else {
        const errorData = await res.json();
        setStatus({ type: "error", message: errorData.message || "Failed to sync project data." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Network error occurred during transmission." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {status.message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded text-sm font-bold tracking-widest uppercase ${
            status.type === "success" 
              ? "bg-green-950/30 border border-green-500/50 text-green-400" 
              : "bg-red-950/30 border border-red-500/50 text-red-400"
          }`}
        >
          {status.message}
        </motion.div>
      )}

      {/* Basic Text Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
            Project Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
            placeholder="e.g. Echoes of Reality"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
            Deployment Sector
          </label>
          <select
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:outline-none focus:border-white transition-colors appearance-none uppercase tracking-widest text-sm"
          >
            <option value="PC">PC Gaming</option>
            <option value="ANDROID">Android Mobile</option>
            <option value="VR_QUEST">Meta Quest VR</option>
            <option value="AR">Augmented Reality</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
          Project Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:outline-none focus:border-white transition-colors resize-none"
          placeholder="Briefly describe the mechanics, lore, or technical achievements..."
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
          External Download / Store Link (Optional)
        </label>
        <input
          type="url"
          name="downloadLink"
          value={formData.downloadLink || ""}
          onChange={handleChange}
          className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
          placeholder="e.g. https://yourstudio.itch.io/project"
        />
      </div>

      <div className="h-px w-full bg-zinc-800 my-6"></div>

      {/* Media Uploaders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MediaUploader 
          label="Cover Art (Thumbnail)" 
          accept="image/*" 
          currentMediaUrl={formData.coverImageUrl}
          onUploadSuccess={(url) => handleMediaUpload("coverImageUrl", url)} 
        />
        
        <MediaUploader 
          label="Gameplay Trailer / Video" 
          accept="video/*" 
          currentMediaUrl={formData.videoUrl}
          onUploadSuccess={(url) => handleMediaUpload("videoUrl", url)} 
        />
      </div>

      <div className="h-px w-full bg-zinc-800 my-6"></div>

      {/* Status Toggle & Submit */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <label className="flex items-center cursor-pointer group">
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            />
            <div className={`block w-14 h-8 rounded-full transition-colors ${formData.isPublished ? "bg-green-500" : "bg-zinc-700"}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.isPublished ? "transform translate-x-6" : ""}`}></div>
          </div>
          <div className="ml-4 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-white">
              {formData.isPublished ? "Publicly Visible" : "Draft Mode"}
            </span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
              {formData.isPublished ? "Live on portfolio" : "Hidden from public view"}
            </span>
          </div>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto px-10 bg-white text-black font-bold uppercase tracking-widest py-4 rounded hover:bg-zinc-200 transition-colors disabled:opacity-50 flex justify-center items-center"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
          ) : isNew ? (
            "Deploy Project"
          ) : (
            "Save Configuration"
          )}
        </button>
      </div>
    </form>
  );
}