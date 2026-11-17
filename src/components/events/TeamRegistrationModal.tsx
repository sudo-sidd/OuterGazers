"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Utensils,
  Gamepad2,
  MessageCircle,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Upload,
  FileImage,
  Trash2,
  Smartphone,
  QrCode,
  Sparkles,
  Trophy,
  GraduationCap
} from "lucide-react";
import { GameJamEvent, TeamRegistrationPayload, TeamMember } from "@/types";
import { DISCORD_INVITE_URL, WHATSAPP_GROUP_INVITE_URL, UPI_PAYMENT_CONFIG } from "@/constants";
import { generateUpiPaymentUrl, generateUpiQrCodeUrl, compressImageToBase64 } from "@/lib/upi";
import { submitTeamRegistration } from "@/lib/sheets";

interface ModalProps {
  event: GameJamEvent;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamRegistrationModal({ event, isOpen, onClose }: ModalProps) {
  // Steps: 
  // 1: Team & College Info
  // 2: Squad Roster (WhatsApp numbers + Student Roll / IDs + Discord)
  // 3: Review & Confirmation (Free Pass Confirmation or UPI QR Pay)
  // 4: Success Confirmation & Pass
  // 5: Failed / Retry
  const isFreeEvent = event.pricePerPerson === 0;
  const isSietIntraEvent = event.id === "siet-intra-gamejam-2026";

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [teamSize, setTeamSize] = useState<3 | 4>(3);
  const [teamName, setTeamName] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("LIMITED SPACE");
  const [collegeName, setCollegeName] = useState(
    isSietIntraEvent ? "Sri Shakthi Institute of Engineering and Technology (SIET), Coimbatore" : ""
  );
  const [department, setDepartment] = useState("");

  // Leader Contact Info
  const [leaderName, setLeaderName] = useState("");
  const [leaderRollNo, setLeaderRollNo] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [leaderDiscord, setLeaderDiscord] = useState("");

  // Member 2
  const [member2Name, setMember2Name] = useState("");
  const [member2RollNo, setMember2RollNo] = useState("");
  const [member2Phone, setMember2Phone] = useState("");
  const [member2Discord, setMember2Discord] = useState("");

  // Member 3
  const [member3Name, setMember3Name] = useState("");
  const [member3RollNo, setMember3RollNo] = useState("");
  const [member3Phone, setMember3Phone] = useState("");
  const [member3Discord, setMember3Discord] = useState("");

  // Member 4
  const [member4Name, setMember4Name] = useState("");
  const [member4RollNo, setMember4RollNo] = useState("");
  const [member4Phone, setMember4Phone] = useState("");
  const [member4Discord, setMember4Discord] = useState("");

  // UPI Payment Proof & Verification States (Used for paid events)
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotSizeKb, setScreenshotSizeKb] = useState<number | null>(null);
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [transactionUtr, setTransactionUtr] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedRegId, setConfirmedRegId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Per-event overrides with fallback to studio defaults
  const eventUpiId = event.upiId || UPI_PAYMENT_CONFIG.upiId;
  const eventPayeeName = event.upiPayeeName || UPI_PAYMENT_CONFIG.payeeName;
  const eventSheetUrl = event.googleSheetScriptUrl || undefined;
  const eventDiscordUrl = (event as any).discordInviteUrl || DISCORD_INVITE_URL;
  const eventWhatsappUrl = (event as any).whatsappGroupUrl || WHATSAPP_GROUP_INVITE_URL;

  const totalAmount = isFreeEvent ? 0 : teamSize * event.pricePerPerson;
  const upiPaymentUrl = generateUpiPaymentUrl(totalAmount, teamName || "OuterGazer", eventUpiId, eventPayeeName);
  const upiQrCodeUrl = generateUpiQrCodeUrl(upiPaymentUrl, 280);

  // Lock body scroll and pause heavy background canvases when modal is open
  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add("modal-open");
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("outergazers:modal-open", { detail: { open: true } }));
    }
    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = prevOverflow;
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("outergazers:modal-open", { detail: { open: false } }));
      }
    };
  }, [isOpen]);

  // Handle screenshot image selection (for paid events)
  const handleScreenshotChange = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    setErrorMessage(null);
    setIsCompressingImage(true);
    try {
      const { dataUrl, sizeKb } = await compressImageToBase64(file, 1200, 0.82);
      setScreenshotFile(file);
      setScreenshotBase64(dataUrl);
      setScreenshotSizeKb(sizeKb);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to process image.");
    } finally {
      setIsCompressingImage(false);
    }
  };

  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotBase64(null);
    setScreenshotSizeKb(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(eventUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Validate Step 1 (Team Name & Team Count)
  const handleProceedToRoster = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!teamName.trim()) {
      setErrorMessage("Please enter a Team Name.");
      return;
    }

    setStep(2);
  };

  // Validate Step 2 (all participants need contact details; SIET roll numbers are intra-event only)
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Leader Validation
    if (!leaderName.trim() || !leaderEmail.trim() || !leaderPhone.trim()) {
      setErrorMessage("Please complete all Team Leader required fields (Full Name, Email, WhatsApp Number).");
      return;
    }
    if (isSietIntraEvent && !leaderRollNo.trim()) {
      setErrorMessage("Please enter the Team Leader's SIET Roll Number.");
      return;
    }

    // Member 02 Validation
    if (!member2Name.trim() || !member2Phone.trim()) {
      setErrorMessage("Please enter Full Name and WhatsApp Number for Member 02.");
      return;
    }
    if (isSietIntraEvent && !member2RollNo.trim()) {
      setErrorMessage("Please enter Member 02's SIET Roll Number.");
      return;
    }

    // Member 03 Validation
    if (!member3Name.trim() || !member3Phone.trim()) {
      setErrorMessage("Please enter Full Name and WhatsApp Number for Member 03.");
      return;
    }
    if (isSietIntraEvent && !member3RollNo.trim()) {
      setErrorMessage("Please enter Member 03's SIET Roll Number.");
      return;
    }

    // Member 04 Validation (if 4-member squad)
    if (teamSize === 4) {
      if (!member4Name.trim() || !member4Phone.trim()) {
        setErrorMessage("Please enter Full Name and WhatsApp Number for Member 04.");
        return;
      }
      if (isSietIntraEvent && !member4RollNo.trim()) {
        setErrorMessage("Please enter Member 04's SIET Roll Number.");
        return;
      }
    }

    setStep(3);
  };

  // Submit Registration (handles free and paid team registrations)
  const handleSubmitRegistration = async () => {
    setErrorMessage(null);

    if (!isFreeEvent && !screenshotBase64) {
      setErrorMessage("Please upload your payment confirmation screenshot before submitting registration.");
      return;
    }

    setIsProcessing(true);

    const generatedRegId =
      confirmedRegId ||
      `${isSietIntraEvent ? "SIET-INTRA" : "OG-INTER"}-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedRegId(generatedRegId);

    const leader: TeamMember = {
      name: isSietIntraEvent
        ? `${leaderName.trim()} [Roll No: ${leaderRollNo.trim()}]`
        : leaderName.trim(),
      email: leaderEmail.trim(),
      phone: leaderPhone.trim(),
      discordTag: leaderDiscord.trim() || undefined,
      college: collegeName.trim(),
    };

    const membersList: TeamMember[] = [];
    if (member2Name.trim()) {
      membersList.push({
        name: isSietIntraEvent
          ? `${member2Name.trim()} [Roll No: ${member2RollNo.trim()}]`
          : member2Name.trim(),
        phone: member2Phone.trim(),
        discordTag: member2Discord.trim() || undefined,
        college: collegeName.trim(),
      });
    }
    if (member3Name.trim()) {
      membersList.push({
        name: isSietIntraEvent
          ? `${member3Name.trim()} [Roll No: ${member3RollNo.trim()}]`
          : member3Name.trim(),
        phone: member3Phone.trim(),
        discordTag: member3Discord.trim() || undefined,
        college: collegeName.trim(),
      });
    }
    if (teamSize === 4 && member4Name.trim()) {
      membersList.push({
        name: isSietIntraEvent
          ? `${member4Name.trim()} [Roll No: ${member4RollNo.trim()}]`
          : member4Name.trim(),
        phone: member4Phone.trim(),
        discordTag: member4Discord.trim() || undefined,
        college: collegeName.trim(),
      });
    }

    const teamSafe = teamName.trim().replace(/[^a-zA-Z0-9_-]/g, "_");
    const payload: TeamRegistrationPayload = {
      registrationId: generatedRegId,
      eventId: event.id,
      eventTitle: event.title,
      teamName: teamName.trim(),
      collegeName: `${collegeName.trim()} ${department.trim() ? `(${department.trim()})` : ""}`,
      teamSize,
      totalAmount,
      theme: isSietIntraEvent ? selectedTheme : undefined,
      leader,
      members: membersList,
      paymentStatus: isFreeEvent ? "FREE" : "PENDING_VERIFICATION",
      transactionUtr: isFreeEvent ? "SIET_FREE_ENTRY" : transactionUtr.trim() || undefined,
      screenshotBase64: isFreeEvent ? undefined : screenshotBase64 || undefined,
      screenshotFileName: isFreeEvent ? undefined : `${generatedRegId}_${teamSafe}_payment.jpg`,
      notes: isSietIntraEvent
        ? `SIET Intra Jam | Theme: ${selectedTheme} | Leader Roll: ${leaderRollNo.trim()} | Dept: ${department.trim() || "N/A"}`
        : `Inter-College Game Jam | College: ${collegeName.trim()} | Theme announced at event`,
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await submitTeamRegistration(payload, eventSheetUrl);
      if (res.success) {
        setIsProcessing(false);
        setStep(4); // Advance to Success Screen
      } else {
        setIsProcessing(false);
        setErrorMessage(res.message || "Failed to log registration to Google Sheets. Please retry.");
        setStep(5);
      }
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage(err instanceof Error ? err.message : "Failed to connect to registration server. Please retry.");
      setStep(5);
    }
  };

  const copyRegId = () => {
    if (confirmedRegId) {
      navigator.clipboard.writeText(confirmedRegId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden"
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Backdrop (solid high-opacity on mobile to eliminate costly gaussian blur) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/95 md:bg-black/85 md:backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#0d0d0d] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-10 font-sans"
          >
            {/* Top Fixed Header & Accents */}
            <div className="shrink-0">
              {/* Top Accent Bar */}
              <div className="h-1 w-full bg-gradient-to-r from-[#00b4d8] via-[#10b981] to-[#00b4d8]" />

              {/* Header */}
              <div className="p-5 md:p-6 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#00b4d8]/10 border border-[#00b4d8]/30 text-[#00b4d8] text-[10px] font-bold uppercase tracking-wider mb-1.5 font-sans">
                    <ShieldCheck size={12} />
                    {isSietIntraEvent ? "SIET Coimbatore" : "OuterGazers"} · Official Registration Portal
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-white">
                    {event.title}
                  </h3>
                  {isFreeEvent ? (
                    <p className="text-xs text-emerald-400 font-sans tracking-wider font-semibold">
                      100% Free Entry (₹0) · Exclusively for SIET Students · Closes Nov 29 (11:59 PM)
                    </p>
                  ) : (
                    <p className="text-xs text-zinc-400 font-sans tracking-wider">
                      ₹{event.pricePerPerson} / person · All Inclusive
                    </p>
                  )}
                </div>

                <button
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="text-zinc-400 hover:text-white p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  aria-label="Close registration modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Inclusions Pill Ribbon */}
              <div className="px-5 md:px-6 py-2 bg-zinc-950/80 border-b border-zinc-900 flex flex-wrap items-center gap-4 text-[11px] text-zinc-400 font-sans">
                <span className={`flex items-center gap-1.5 font-medium ${isFreeEvent ? "text-emerald-400" : "text-[#00b4d8]"}`}>
                  <ShieldCheck size={13} />
                  {isFreeEvent ? "No Entry Fee (100% Free)" : `₹${event.pricePerPerson} per person`}
                </span>
                <span className="text-zinc-700">•</span>
                <span className="flex items-center gap-1.5 text-[#00b4d8] font-medium">
                  <Trophy size={13} className="text-[#00b4d8]" />
                  {isSietIntraEvent ? "Qualify for Dec Inter-College Jam" : `${event.minTeamSize}–${event.maxTeamSize} members per team`}
                </span>
                <span className="text-zinc-700">•</span>
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Gamepad2 size={13} className="text-[#7c3aed]" />
                  {isSietIntraEvent ? "XR Lab Mentorship & Itch.io" : "Onsite 24-hour jam"}
                </span>
              </div>

              {/* Step 1, 2 & 3 Indicator */}
              {step <= 3 && (
                <div className="px-5 md:px-6 py-2.5 bg-zinc-950/40 border-b border-zinc-900 flex items-center justify-between text-xs font-sans">
                  <span className={step === 1 ? "text-[#00b4d8] font-bold" : "text-zinc-500"}>
                    01. {isSietIntraEvent ? "Squad & Theme" : "Team Details"}
                  </span>
                  <span className="text-zinc-700">───</span>
                  <span className={step === 2 ? "text-[#00b4d8] font-bold" : "text-zinc-500"}>
                    02. Squad Roster
                  </span>
                  <span className="text-zinc-700">───</span>
                  <span className={step === 3 ? "text-[#00b4d8] font-bold" : "text-zinc-600"}>
                    {isFreeEvent ? "03. Review & Confirm" : "03. UPI Pay & Screenshot"}
                  </span>
                </div>
              )}

              {/* General Error Banner */}
              {errorMessage && step !== 5 && (
                <div className="mx-5 md:mx-6 mt-3 p-3 rounded-lg bg-red-950/30 border border-red-800/50 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Scrollable Step Body */}
            <div 
              className="flex-1 overflow-y-auto overscroll-contain p-5 md:p-8 touch-pan-y"
              style={{ WebkitOverflowScrolling: "touch" }}
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
            >
              {/* ══════════════════════════════════════════════════════════════
                  STEP 1: Team Name & Team Count
              ══════════════════════════════════════════════════════════════ */}
              {step === 1 && (
                <form onSubmit={handleProceedToRoster} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 font-sans">
                      Team Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. CyberVanguard, PixelShifters, VoidWalkers"
                      className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#00b4d8] rounded-lg px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none transition-colors text-sm"
                    />
                  </div>

                  {!isSietIntraEvent && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 font-sans">
                        College / Institution *
                      </label>
                      <input
                        type="text"
                        required
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        placeholder="Enter your college or institution"
                        className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#00b4d8] rounded-lg px-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none transition-colors text-sm"
                      />
                    </div>
                  )}

                  {/* Team Count Selector (3 or 4 Members) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 font-sans">
                      Team Count ({event.minTeamSize}–{event.maxTeamSize} Members) *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {[
                        { size: 3 as const, title: "3 Members Squad", desc: "Leader + 2 Squad Gazers" },
                        { size: 4 as const, title: "4 Members Squad", desc: "Leader + 3 Squad Gazers" },
                      ].map((item) => (
                        <button
                          key={item.size}
                          type="button"
                          onClick={() => setTeamSize(item.size)}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            teamSize === item.size
                              ? "bg-[#00b4d8]/10 border-[#00b4d8] text-white shadow-md shadow-[#00b4d8]/10"
                              : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-sm text-white">{item.title}</span>
                            <Users size={16} className={teamSize === item.size ? "text-[#00b4d8]" : "text-zinc-600"} />
                          </div>
                          <p className="text-xs text-zinc-400 font-sans">{item.desc}</p>
                          <span className="text-[10px] text-emerald-400 font-bold block mt-1.5">
                            {isFreeEvent ? "100% Free Entry (₹0)" : `₹${item.size * event.pricePerPerson} total`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* The intra-college event has pre-announced themes; the inter-college themes are revealed at kickoff. */}
                  {isSietIntraEvent ? <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 font-sans">
                        Selected Theme (Mandatory) *
                      </label>
                      <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded font-sans">
                        Themes Not Optional
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: "LIMITED SPACE" as const, title: "LIMITED SPACE", desc: "Bounds, single-screens & micro spaces", color: "text-[#00b4d8]" },
                        { id: "LOOPS" as const, title: "LOOPS", desc: "Time loops, cycles & recursive mechanics", color: "text-[#d946ef]" },
                        { id: "HYBRID (BOTH)" as const, title: "HYBRID (BOTH)", desc: "Combine both themes into one game", color: "text-emerald-400" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedTheme(item.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all ${
                            selectedTheme === item.id
                              ? "bg-[#00b4d8]/10 border-[#00b4d8] text-white shadow-md shadow-[#00b4d8]/10"
                              : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-bold text-xs ${item.color}`}>{item.title}</span>
                            {selectedTheme === item.id && <CheckCircle2 size={14} className="text-[#00b4d8]" />}
                          </div>
                          <p className="text-[11px] text-zinc-400 font-sans leading-tight">{item.desc}</p>
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-2 font-sans">
                      Themes are mandatory for all SIET squads. Choose Theme 1, Theme 2, or combine both into a hybrid mechanic.
                    </p>
                  </div> : (
                    <div className="rounded-lg border border-[#00b4d8]/30 bg-[#00b4d8]/5 p-4 text-sm text-zinc-300">
                      Five official themes will be announced at 9:00 AM on December 15. Teams will choose their theme(s) at the onsite kickoff.
                    </div>
                  )}

                  {/* Free Notice Box */}
                  {isSietIntraEvent && <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
                    <Sparkles size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-200 leading-relaxed font-sans">
                      <span className="font-bold text-white">SIET Intra-College Game Jam</span> is exclusive for SIET students with zero registration fees.
                    </p>
                  </div>}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#00b4d8] hover:bg-white text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
                    >
                      Next: Squad Roster
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </form>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  STEP 2: Squad Roster (WhatsApp, Student IDs & Discord)
              ══════════════════════════════════════════════════════════════ */}
              {step === 2 && (
                <form onSubmit={handleProceedToReview} className="space-y-5">
                  <div className="flex items-center justify-between pb-1 border-b border-zinc-900">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-sans">
                      Squad Roster ({teamSize} Members)
                    </span>
                    <span className="text-[11px] text-emerald-400 font-sans">
                      {isSietIntraEvent ? "SIET Student Verification" : "Student team details"}
                    </span>
                  </div>

                  {/* Team Leader Details */}
                  <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#00b4d8] font-sans flex items-center gap-1.5">
                        <ShieldCheck size={14} />
                        Team Leader (Primary Contact)
                      </span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Required</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-sans">
                          Leader Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Leader Full Name"
                          value={leaderName}
                          onChange={(e) => setLeaderName(e.target.value)}
                          className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none"
                        />
                      </div>

                      {isSietIntraEvent && <div>
                        <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-sans">
                          SIET Roll Number *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 714022104001 or 22AD045"
                          value={leaderRollNo}
                          onChange={(e) => setLeaderRollNo(e.target.value)}
                          className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
                        />
                      </div>}

                      <div>
                        <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-sans">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="name@siet.ac.in or personal email"
                          value={leaderEmail}
                          onChange={(e) => setLeaderEmail(e.target.value)}
                          className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-sans">
                          WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="10-digit WhatsApp Number"
                          value={leaderPhone}
                          onChange={(e) => setLeaderPhone(e.target.value)}
                          className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-sans">
                          Discord Username <span className="text-zinc-600 text-[10px] lowercase">(optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Discord username or handle"
                          value={leaderDiscord}
                          onChange={(e) => setLeaderDiscord(e.target.value)}
                          className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Member 02 Details */}
                  <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-sans">
                        Squad Member 02
                      </span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Required</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-sans">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={member2Name}
                          onChange={(e) => setMember2Name(e.target.value)}
                          className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none"
                        />
                      </div>

                      {isSietIntraEvent && <div>
                        <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-sans">
                          SIET Roll Number *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Roll Number"
                          value={member2RollNo}
                          onChange={(e) => setMember2RollNo(e.target.value)}
                          className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
                        />
                      </div>}

                      <div>
                        <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-sans">
                          WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="10-digit WhatsApp"
                          value={member2Phone}
                          onChange={(e) => setMember2Phone(e.target.value)}
                          className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-sans">
                          Discord Username <span className="text-zinc-600 text-[10px] lowercase">(optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Discord username"
                          value={member2Discord}
                          onChange={(e) => setMember2Discord(e.target.value)}
                          className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Member 03 Details */}
                  <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-sans">
                        Squad Member 03
                      </span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Required</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-sans">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={member3Name}
                          onChange={(e) => setMember3Name(e.target.value)}
                          className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none"
                        />
                      </div>

                      {isSietIntraEvent && <div>
                        <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-sans">
                          SIET Roll Number *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Roll Number"
                          value={member3RollNo}
                          onChange={(e) => setMember3RollNo(e.target.value)}
                          className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
                        />
                      </div>}

                      <div>
                        <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-sans">
                          WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="10-digit WhatsApp"
                          value={member3Phone}
                          onChange={(e) => setMember3Phone(e.target.value)}
                          className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-sans">
                          Discord Username <span className="text-zinc-600 text-[10px] lowercase">(optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Discord username"
                          value={member3Discord}
                          onChange={(e) => setMember3Discord(e.target.value)}
                          className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Member 04 Details */}
                  {teamSize === 4 && (
                    <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-3 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-sans">
                          Squad Member 04
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Required</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-sans">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={member4Name}
                            onChange={(e) => setMember4Name(e.target.value)}
                            className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none"
                          />
                        </div>

                        {isSietIntraEvent && <div>
                          <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-sans">
                            SIET Roll Number *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Roll Number"
                            value={member4RollNo}
                            onChange={(e) => setMember4RollNo(e.target.value)}
                            className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
                          />
                        </div>}

                        <div>
                          <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-sans">
                            WhatsApp Number *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="10-digit WhatsApp"
                            value={member4Phone}
                            onChange={(e) => setMember4Phone(e.target.value)}
                            className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-sans">
                            Discord Username <span className="text-zinc-600 text-[10px] lowercase">(optional)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Discord username"
                            value={member4Discord}
                            onChange={(e) => setMember4Discord(e.target.value)}
                            className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-bold uppercase tracking-wider"
                    >
                      <ArrowLeft size={14} /> Back to Team Info
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#00b4d8] hover:bg-white text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
                    >
                      {isFreeEvent ? "Review & Confirm (Free)" : "Proceed to UPI Pay"}
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </form>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  STEP 3: Review & Confirmation (Free Pass or Paid UPI)
              ══════════════════════════════════════════════════════════════ */}
              {step === 3 && (
                <div className="space-y-6 text-left">
                  {/* Summary Overview */}
                  <div className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-4 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <span className="text-xs text-zinc-400 font-sans">Team Name</span>
                      <span className="text-sm font-bold text-white text-right">
                        {teamName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <span className="text-xs text-zinc-400 font-sans">
                        {isSietIntraEvent ? "Leader & Roll Number" : "Team Leader"}
                      </span>
                      <span className="text-xs text-zinc-300 text-right">
                        <span className="text-white font-semibold">{leaderName}</span>
                        {isSietIntraEvent && <> · <span className="font-mono text-[#00b4d8]">{leaderRollNo}</span></>}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <span className="text-xs text-zinc-400 font-sans">Squad Size</span>
                      <span className="text-xs text-zinc-300">
                        {teamSize} Members · Contact: {leaderPhone}
                      </span>
                    </div>

                    {isSietIntraEvent && (
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                        <span className="text-xs text-zinc-400 font-sans">Mandatory Theme</span>
                        <span className="text-xs font-bold text-[#00b4d8] text-right">
                          {selectedTheme}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-bold uppercase tracking-wider text-white">Registration Fee</span>
                      <span className="text-2xl font-bold font-sans text-emerald-400">
                        {isFreeEvent ? "₹0 · FREE ENTRY" : `₹${totalAmount}`}
                      </span>
                    </div>
                  </div>

                  {isFreeEvent ? (
                    /* ─── 100% FREE SIET EVENT CONFIRMATION BOX ─── */
                    <div className="p-5 rounded-xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-emerald-500/40 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={18} className="text-emerald-400" />
                          <span className="font-bold text-white text-sm uppercase tracking-wide font-sans">
                            SIET Student Verification Guaranteed
                          </span>
                        </div>
                        <span className="text-[10px] font-bold font-sans bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">
                          Zero Registration Fee
                        </span>
                      </div>

                      <div className="space-y-3 text-xs text-zinc-300 font-sans">
                        <p className="leading-relaxed">
                          Your squad details and SIET student identification have been entered. No payment or transaction screenshot is required for this event.
                        </p>

                        <div className="p-3.5 bg-zinc-950/80 rounded-lg border border-zinc-800 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#00b4d8] block">
                            Included Intra-College Privileges
                          </span>
                          <ul className="space-y-1.5 text-zinc-300 text-[11px]">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                              <span>Top team wins guaranteed 100% Free Entry into December Inter-College GameJam</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                              <span>Ranked teams receive tiered ticket discounts for the Inter-College Jam</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                              <span>SIET XR Lab workstation access &amp; 1-on-1 development mentorship</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                              <span>Mentoring to package and publish your game on itch.io</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ─── UPI QR PAYMENT BOX (PAID EVENTS) ─── */
                    <div className="p-5 rounded-xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-[#00b4d8]/40 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <div className="flex items-center gap-2">
                          <QrCode size={18} className="text-[#00b4d8]" />
                          <span className="font-bold text-white text-sm uppercase tracking-wide font-sans">
                            Scan &amp; Pay via UPI
                          </span>
                        </div>
                        <span className="text-[10px] font-bold font-sans bg-[#00b4d8]/10 text-[#00b4d8] border border-[#00b4d8]/30 px-2 py-0.5 rounded uppercase">
                          Instant UPI Transfer
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="shrink-0 p-3 bg-white rounded-xl shadow-lg shadow-black/60 flex flex-col items-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={event.upiQrImageUrl || upiQrCodeUrl}
                            alt={`UPI payment QR code for ${eventUpiId}`}
                            width={190}
                            height={190}
                            className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                          />
                          <span className="text-[10px] font-bold text-zinc-800 mt-1 uppercase tracking-wider">
                            Pay ₹{totalAmount}
                          </span>
                        </div>

                        <div className="flex-1 space-y-3 w-full">
                          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                            Scan using Google Pay, PhonePe, Paytm, BHIM, or any banking app.
                          </p>

                          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-500 font-mono text-[11px]">UPI ID:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-mono font-bold">{eventUpiId}</span>
                                <button
                                  type="button"
                                  onClick={copyUpiId}
                                  className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors"
                                  title="Copy UPI ID"
                                >
                                  {copiedUpi ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-zinc-500 font-mono text-[11px]">Exact Amount:</span>
                              <span className="text-emerald-400 font-bold font-mono">₹{totalAmount}</span>
                            </div>
                          </div>

                          <div className="pt-1">
                            <a
                              href={upiPaymentUrl}
                              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border border-zinc-700"
                            >
                              <Smartphone size={14} className="text-[#00b4d8]" />
                              Tap to Open in UPI App
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Upload Box for Paid Events */}
                      <div className="pt-2">
                        {!screenshotBase64 ? (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="p-4 border-2 border-dashed rounded-xl border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-center cursor-pointer"
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/webp"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleScreenshotChange(e.target.files[0]);
                                }
                              }}
                            />
                            <p className="text-xs font-bold text-white">Click to upload payment screenshot *</p>
                          </div>
                        ) : (
                          <div className="p-3 bg-zinc-900/70 border border-emerald-500/40 rounded-xl flex items-center justify-between">
                            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                              <CheckCircle2 size={14} /> Screenshot Attached
                            </span>
                            <button
                              type="button"
                              onClick={handleRemoveScreenshot}
                              className="text-zinc-400 hover:text-red-400 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation & Submit Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => setStep(2)}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-bold uppercase tracking-wider disabled:opacity-50"
                    >
                      <ArrowLeft size={14} /> Back to Squad Roster
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing || isCompressingImage}
                      onClick={handleSubmitRegistration}
                      className="px-8 py-3.5 bg-gradient-to-r from-[#00b4d8] to-[#10b981] hover:from-white hover:to-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-[#00b4d8]/20 flex items-center gap-2 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Logging Registration...
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={16} />
                          {isFreeEvent ? "Confirm & Register Squad (Free)" : "Submit Registration & Proof"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  STEP 4: Registration SUCCESS Confirmation Pass
              ══════════════════════════════════════════════════════════════ */}
              {step === 4 && (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 size={36} />
                  </div>

                  <div>
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
                      Registration Submitted · {event.title}
                    </span>
                    <h3 className="font-sans text-3xl font-bold text-white mt-1">
                      {teamName}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="text-xs text-zinc-400">Pass ID:</span>
                      <span className="text-white font-mono font-bold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                        {confirmedRegId}
                      </span>
                      <button
                        onClick={copyRegId}
                        className="text-xs text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 transition-colors"
                        title="Copy Pass ID"
                      >
                        {copiedId ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Official Registration Pass Card */}
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-left space-y-2.5 font-sans text-xs">
                    <div className="flex justify-between border-b border-zinc-900 pb-2">
                      <span className="text-zinc-500 uppercase">Team Name</span>
                      <span className="text-white font-bold">{teamName}</span>
                    </div>

                    <div className="flex justify-between border-b border-zinc-900 pb-2">
                      <span className="text-zinc-500 uppercase">Team Leader</span>
                      <span className="text-white font-bold">
                        {leaderName}{isSietIntraEvent ? ` (${leaderRollNo})` : ""}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-zinc-900 pb-2">
                      <span className="text-zinc-500 uppercase">Institution</span>
                      <span className="text-zinc-300 font-medium text-right">
                        {collegeName}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-zinc-900 pb-2">
                      <span className="text-zinc-500 uppercase">Squad Size</span>
                      <span className="text-zinc-300 font-medium">
                        {teamSize} Members
                      </span>
                    </div>

                    {isSietIntraEvent && (
                      <div className="flex justify-between border-b border-zinc-900 pb-2">
                        <span className="text-zinc-500 uppercase">Selected Theme</span>
                        <span className="text-[#00b4d8] font-bold">{selectedTheme}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-0.5">
                      <span className="text-zinc-400 uppercase font-bold">Registration Fee</span>
                      <span className="text-emerald-400 font-bold text-sm">
                        {isFreeEvent ? "₹0 · 100% FREE" : `₹${totalAmount} · PAYMENT PENDING VERIFICATION`}
                      </span>
                    </div>
                  </div>

                  {/* Mandatory Community Notice */}
                  <div className="p-5 rounded-xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-emerald-500/40 text-left space-y-3.5 shadow-lg shadow-black/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-sans">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      {isSietIntraEvent ? "Next Action: Join Jam Community" : "Next Action: Payment Verification"}
                      </div>
                      <span className="text-[10px] bg-emerald-400/10 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded font-bold font-sans uppercase">
                      {isSietIntraEvent ? "Themes Mandatory" : "Themes Revealed on Day 1"}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans">
                      {isSietIntraEvent ? (
                        <>
                          Make sure to <span className="text-[#00b4d8] font-bold">join our Discord and WhatsApp groups</span>. The official jam themes are live and mandatory: <span className="text-[#00b4d8] font-bold">LIMITED SPACE</span> and <span className="text-[#d946ef] font-bold">LOOPS</span> (pick either theme or combine both!). Build for Windows, Web, or Android. Both registrations and submissions close on <span className="text-white font-bold">November 29, 2026 (11:59 PM IST)</span>. The official Google Drive folder link for submitting your squad&apos;s .ZIP (game build + readme with AI disclosure &amp; credits) will be shared in the final week before the deadline!
                        </>
                      ) : (
                        <>
                          Your team registration has been submitted. Payment is pending verification. Organizers will share event updates and participant community invite links using the contact details provided. Five themes will be announced at 9:00 AM on December 15.
                        </>
                      )}
                    </p>

                    {isSietIntraEvent && <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <a
                        href={eventWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-md shadow-emerald-950/40"
                      >
                        <MessageCircle size={15} />
                        <span>Join WhatsApp Group</span>
                        <ExternalLink size={13} className="opacity-80" />
                      </a>

                      <a
                        href={eventDiscordUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-md shadow-[#5865F2]/20"
                      >
                        <ShieldCheck size={15} />
                        <span>Join Discord Server</span>
                        <ExternalLink size={13} className="opacity-80" />
                      </a>
                    </div>}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleClose}
                      className="px-8 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
                    >
                      Close Pass
                    </button>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════════════════
                  STEP 5: Registration FAILED or NETWORK ERROR
              ══════════════════════════════════════════════════════════════ */}
              {step === 5 && (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                    <AlertCircle size={36} />
                  </div>

                  <div>
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-red-400">
                      Submission Unsuccessful
                    </span>
                    <h3 className="font-sans text-2xl font-bold text-white mt-1">
                      Registration Pending Submission
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
                      {errorMessage || "The submission could not be verified by the server. Your squad details have been retained so you do not have to re-enter them."}
                    </p>
                  </div>

                  {/* Saved Details Box */}
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-left space-y-2 font-sans text-xs">
                    <div className="flex justify-between border-b border-zinc-900 pb-2">
                      <span className="text-zinc-500">SAVED TEAM</span>
                      <span className="text-white font-bold">{teamName} ({collegeName})</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-900 pb-2">
                      <span className="text-zinc-500">ROSTER</span>
                      <span className="text-zinc-300">{teamSize} Gazers · Leader: {leaderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">ENTRY STATUS</span>
                      <span className="text-emerald-400 font-bold">
                        {isFreeEvent ? "100% Free Entry (₹0)" : `Payment pending · ₹${totalAmount}`}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={handleSubmitRegistration}
                      disabled={isProcessing}
                      className="px-6 py-3 bg-[#00b4d8] hover:bg-white text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                    >
                      <RefreshCw size={14} className={isProcessing ? "animate-spin" : ""} />
                      {isProcessing ? "Retrying Submission..." : "Retry Submission Now"}
                    </button>

                    <button
                      onClick={() => setStep(3)}
                      className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                    >
                      Review Registration
                    </button>

                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                    >
                      Edit Squad Roster
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
