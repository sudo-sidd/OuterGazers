"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Founder {
  id?: string;
  name: string;
  role: string;
  domain: string;
  qualification: string;
  cvUrl: string | null;
  portfolioUrl: string | null;
  profilePhotoUrl: string | null;
}

interface FounderUpdateFormProps {
  founder: Founder;
  onUpdate: () => void;
}

export default function FounderUpdateForm({ founder, onUpdate }: FounderUpdateFormProps) {
  const [formData, setFormData] = useState<Founder>({
    id: founder.id || "",
    name: founder.name || "",
    role: founder.role || "",
    domain: founder.domain || "",
    qualification: founder.qualification || "",
    cvUrl: founder.cvUrl || "",
    portfolioUrl: founder.portfolioUrl || "",
    profilePhotoUrl: founder.profilePhotoUrl || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const isNew = !founder.id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/founders", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus({
          type: "success",
          message: isNew ? "Founder profile initialized successfully." : "Profile data updated.",
        });
        setTimeout(() => {
          onUpdate(); // Refresh the parent page data
        }, 1500);
      } else {
        const errorData = await res.json();
        setStatus({ type: "error", message: errorData.message || "Failed to sync profile." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Network error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
            placeholder="e.g. John Doe"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
            Studio Role
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
            placeholder="e.g. Lead Engine Developer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
            Domain Focus
          </label>
          <input
            type="text"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            required
            className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
            placeholder="e.g. Unreal Engine 5 / AI"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
            Highest Qualification
          </label>
          <input
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            required
            className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
            placeholder="e.g. B.S. Computer Science"
          />
        </div>
      </div>

      <div className="h-px w-full bg-zinc-800 my-4"></div>

      {/* Media URL Links (These can be pasted from S3 after using the Uploader component) */}
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
            Profile Photo (S3 URL)
          </label>
          <input
            type="url"
            name="profilePhotoUrl"
            value={formData.profilePhotoUrl || ""}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
            placeholder="https://your-bucket.s3.amazonaws.com/photo.jpg"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
            Curriculum Vitae (PDF S3 URL)
          </label>
          <input
            type="url"
            name="cvUrl"
            value={formData.cvUrl || ""}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
            placeholder="https://your-bucket.s3.amazonaws.com/resume.pdf"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
            Personal Portfolio Link
          </label>
          <input
            type="url"
            name="portfolioUrl"
            value={formData.portfolioUrl || ""}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
            placeholder="https://your-portfolio.com"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded hover:bg-zinc-200 transition-colors mt-8 disabled:opacity-50 flex justify-center items-center"
      >
        {isSubmitting ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
        ) : isNew ? (
          "Initialize Profile"
        ) : (
          "Update Profile Data"
        )}
      </button>
    </form>
  );
}