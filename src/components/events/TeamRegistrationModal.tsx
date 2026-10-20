"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, ShieldCheck, Sparkles, ChevronRight, ArrowLeft, CheckCircle2, AlertCircle, Loader2, Utensils, Gamepad2 } from "lucide-react";
import { GameJamEvent, TeamRegistrationPayload, TeamMember } from "@/types";
import { DISCORD_INVITE_URL } from "@/constants";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { submitTeamRegistration } from "@/lib/sheets";

interface ModalProps {
  event: GameJamEvent;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamRegistrationModal({ event, isOpen, onClose }: ModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [teamSize, setTeamSize] = useState<3 | 4>(3);
  const [teamName, setTeamName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [selectedTrack, setSelectedTrack] = useState(event.tracks[0]?.name || "PC Interactive Vanguard");
  const [projectNotes, setProjectNotes] = useState("");

  // Roster state
  const [leader, setLeader] = useState<TeamMember>({ name: "", email: "", phone: "", discordTag: "" });
  const [member2, setMember2] = useState<TeamMember>({ name: "", email: "", discordTag: "" });
  const [member3, setMember3] = useState<TeamMember>({ name: "", email: "", discordTag: "" });
  const [member4, setMember4] = useState<TeamMember>({ name: "", email: "", discordTag: "" });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedRegId, setConfirmedRegId] = useState<string | null>(null);
  const [confirmedPaymentId, setConfirmedPaymentId] = useState<string | null>(null);

  const totalAmount = teamSize * event.pricePerPerson;

  // Validate step 1
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      setErrorMessage("Please enter a valid Team Name.");
      return;
    }
    if (!collegeName.trim()) {
      setErrorMessage("Please enter your College / Institution Name.");
      return;
    }
    setErrorMessage(null);
    setStep(2);
  };

  // Validate step 2
  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leader.name || !leader.email || !leader.phone || !leader.discordTag) {
      setErrorMessage("Please complete all Team Leader fields including Discord tag.");
      return;
    }
    if (!member2.name || !member2.email || !member2.discordTag) {
      setErrorMessage("Please complete all Member 2 fields.");
      return;
    }
    if (!member3.name || !member3.email || !member3.discordTag) {
      setErrorMessage("Please complete all Member 3 fields.");
      return;
    }
    if (teamSize === 4 && (!member4.name || !member4.email || !member4.discordTag)) {
      setErrorMessage("Please complete all Member 4 fields.");
      return;
    }

    setErrorMessage(null);
    setStep(3);
  };

  // Trigger Payment & Submission
  const handleInitiatePayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    const generatedRegId = `SIET-JAM-${Math.floor(100000 + Math.random() * 900000)}`;

    const membersList: TeamMember[] = [member2, member3];
    if (teamSize === 4) {
      membersList.push(member4);
    }

    const payload: TeamRegistrationPayload = {
      registrationId: generatedRegId,
      eventId: event.id,
      eventTitle: event.title,
      teamName,
      collegeName,
      teamSize,
      totalAmount,
      track: selectedTrack,
      leader,
      members: membersList,
      paymentStatus: "PENDING",
      notes: projectNotes,
      submittedAt: new Date().toISOString(),
    };

    // 1. Initial log to Google Sheet
    await submitTeamRegistration(payload);

    // 2. Open Razorpay Checkout Modal
    try {
      await openRazorpayCheckout({
        amountInINR: totalAmount,
        teamName,
        teamSize,
        eventTitle: event.title,
        leaderName: leader.name,
        leaderEmail: leader.email,
        leaderPhone: leader.phone || "",
        onSuccess: async (paymentId) => {
          // Update sheet record with PAID status & paymentId
          await submitTeamRegistration({
            ...payload,
            paymentStatus: "PAID",
            razorpayPaymentId: paymentId,
          });

          setConfirmedRegId(generatedRegId);
          setConfirmedPaymentId(paymentId);
          setIsProcessing(false);
          setStep(4);
        },
        onDismiss: () => {
          setIsProcessing(false);
          setErrorMessage("Payment was canceled. You can re-attempt when ready.");
        },
        onError: (err) => {
          setIsProcessing(false);
          setErrorMessage(err.message || "Payment gateway encountered an error.");
        },
      });
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage(err instanceof Error ? err.message : "Failed to open payment gateway.");
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-2xl bg-[#0d0d0d] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-10 my-8 font-[family-name:var(--font-anta)]"
          >
            {/* Top Accent Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[#00b4d8] via-[#7c3aed] to-[#00b4d8]" />

            {/* Header */}
            <div className="p-6 md:p-8 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#00b4d8]/10 border border-[#00b4d8]/30 text-[#00b4d8] text-[10px] font-bold uppercase tracking-widest mb-2 font-[family-name:var(--font-kode)]">
                  <ShieldCheck size={12} />
                  XR Lab, SIET Coimbatore · Team Event (3–4 Members)
                </div>
                <h3 className="text-xl md:text-2xl font-bold font-[family-name:var(--font-tech)] tracking-tight text-white">
                  {event.title}
                </h3>
                <p className="text-xs text-zinc-400 font-[family-name:var(--font-kode)] tracking-wider">
                  ₹{event.pricePerPerson} / Member · Meals, XR Lab Access & Esports Included
                </p>
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
            <div className="px-6 md:px-8 py-2.5 bg-zinc-950/80 border-b border-zinc-900 flex flex-wrap items-center gap-4 text-[11px] text-zinc-400 font-[family-name:var(--font-kode)]">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Utensils size={13} className="text-[#00b4d8]" />
                Full Hospitality (All Meals & Snacks)
              </span>
              <span className="text-zinc-700">•</span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Gamepad2 size={13} className="text-[#7c3aed]" />
                Free Valorant & FC 26 Esports Entry
              </span>
            </div>

            {/* Step Indicator */}
            {step < 4 && (
              <div className="px-6 md:px-8 pt-4 pb-2 bg-zinc-950/40 border-b border-zinc-900 flex items-center justify-between text-xs font-[family-name:var(--font-kode)]">
                <span className={step >= 1 ? "text-[#00b4d8] font-bold" : "text-zinc-600"}>
                  01. Squad & College
                </span>
                <span className="text-zinc-700">───</span>
                <span className={step >= 2 ? "text-[#00b4d8] font-bold" : "text-zinc-600"}>
                  02. Roster Details
                </span>
                <span className="text-zinc-700">───</span>
                <span className={step >= 3 ? "text-[#00b4d8] font-bold" : "text-zinc-600"}>
                  03. Secure Checkout
                </span>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="mx-6 md:mx-8 mt-4 p-3 rounded-lg bg-red-950/30 border border-red-800/50 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1: Squad Configuration & College */}
            {step === 1 && (
              <form onSubmit={handleNextStep1} className="p-6 md:p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-[family-name:var(--font-kode)]">
                      Team Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. CyberDrifters, NeuralNexus"
                      className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#00b4d8] rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-[family-name:var(--font-kode)]">
                      College / Institution Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="e.g. SIET Coimbatore, PSG Tech"
                      className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#00b4d8] rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 font-[family-name:var(--font-kode)]">
                    Team Squad Size *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setTeamSize(3)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        teamSize === 3
                          ? "bg-[#00b4d8]/10 border-[#00b4d8] text-white shadow-md shadow-[#00b4d8]/10"
                          : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">3 Members Squad</span>
                        <Users size={16} className={teamSize === 3 ? "text-[#00b4d8]" : "text-zinc-600"} />
                      </div>
                      <p className="text-xs text-white font-bold">Total Entry: ₹2,400</p>
                      <span className="text-[10px] text-[#00b4d8] font-[family-name:var(--font-kode)]">
                        (₹800 × 3 Members · All-Inclusive)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTeamSize(4)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        teamSize === 4
                          ? "bg-[#00b4d8]/10 border-[#00b4d8] text-white shadow-md shadow-[#00b4d8]/10"
                          : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">4 Members Squad</span>
                        <Users size={16} className={teamSize === 4 ? "text-[#00b4d8]" : "text-zinc-600"} />
                      </div>
                      <p className="text-xs text-white font-bold">Total Entry: ₹3,200</p>
                      <span className="text-[10px] text-[#00b4d8] font-[family-name:var(--font-kode)]">
                        (₹800 × 4 Members · All-Inclusive)
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-[family-name:var(--font-kode)]">
                    Primary Target Track *
                  </label>
                  <select
                    value={selectedTrack}
                    onChange={(e) => setSelectedTrack(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#00b4d8] rounded-lg px-4 py-3 text-white focus:outline-none transition-colors text-sm"
                  >
                    {event.tracks.map((track) => (
                      <option key={track.name} value={track.name} className="bg-zinc-950 text-white">
                        {track.name} ({track.hardwareNotes})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-[family-name:var(--font-kode)]">
                    Engine / Tech Stack & Game Jam Pitch (Optional)
                  </label>
                  <input
                    type="text"
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                    placeholder="e.g. Unity / Unreal Engine / Godot; interested in Valorant Esports"
                    className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#00b4d8] rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none transition-colors text-sm"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#00b4d8] hover:bg-white text-black font-bold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2"
                  >
                    Proceed to Roster
                    <ChevronRight size={16} />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Member Details */}
            {step === 2 && (
              <form onSubmit={handleNextStep2} className="p-6 md:p-8 space-y-5 max-h-[65vh] overflow-y-auto">
                <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00b4d8] font-[family-name:var(--font-kode)]">
                      Team Leader (Primary Contact)
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Required</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Leader Full Name *"
                      value={leader.name}
                      onChange={(e) => setLeader({ ...leader, name: e.target.value })}
                      className="bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Leader College Email *"
                      value={leader.email}
                      onChange={(e) => setLeader({ ...leader, email: e.target.value })}
                      className="bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp / Phone Number *"
                      value={leader.phone}
                      onChange={(e) => setLeader({ ...leader, phone: e.target.value })}
                      className="bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Discord Tag (e.g. gazer#1234 or @gazer) *"
                      value={leader.discordTag}
                      onChange={(e) => setLeader({ ...leader, discordTag: e.target.value })}
                      className="bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Member 2 */}
                <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-lg space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-[family-name:var(--font-kode)]">
                    Team Member 02
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Full Name *"
                      value={member2.name}
                      onChange={(e) => setMember2({ ...member2, name: e.target.value })}
                      className="bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={member2.email}
                      onChange={(e) => setMember2({ ...member2, email: e.target.value })}
                      className="bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Discord Tag *"
                      value={member2.discordTag}
                      onChange={(e) => setMember2({ ...member2, discordTag: e.target.value })}
                      className="bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Member 3 */}
                <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-lg space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-[family-name:var(--font-kode)]">
                    Team Member 03
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Full Name *"
                      value={member3.name}
                      onChange={(e) => setMember3({ ...member3, name: e.target.value })}
                      className="bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={member3.email}
                      onChange={(e) => setMember3({ ...member3, email: e.target.value })}
                      className="bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Discord Tag *"
                      value={member3.discordTag}
                      onChange={(e) => setMember3({ ...member3, discordTag: e.target.value })}
                      className="bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Member 4 (Conditional) */}
                {teamSize === 4 && (
                  <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-lg space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-[family-name:var(--font-kode)]">
                      Team Member 04
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Full Name *"
                        value={member4.name}
                        onChange={(e) => setMember4({ ...member4, name: e.target.value })}
                        className="bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Email Address *"
                        value={member4.email}
                        onChange={(e) => setMember4({ ...member4, email: e.target.value })}
                        className="bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Discord Tag *"
                        value={member4.discordTag}
                        onChange={(e) => setMember4({ ...member4, discordTag: e.target.value })}
                        className="bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-bold uppercase tracking-wider"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#00b4d8] hover:bg-white text-black font-bold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2"
                  >
                    Summary & Checkout
                    <ChevronRight size={16} />
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Checkout & Summary */}
            {step === 3 && (
              <div className="p-6 md:p-8 space-y-6">
                <div className="bg-zinc-950/80 border border-zinc-800 rounded-lg p-5 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                    <span className="text-xs text-zinc-400 font-[family-name:var(--font-kode)]">Team Name</span>
                    <span className="text-sm font-bold text-white">{teamName}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                    <span className="text-xs text-zinc-400 font-[family-name:var(--font-kode)]">College / Institution</span>
                    <span className="text-sm text-zinc-200">{collegeName}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                    <span className="text-xs text-zinc-400 font-[family-name:var(--font-kode)]">Selected Track</span>
                    <span className="text-sm font-bold text-[#00b4d8]">{selectedTrack}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                    <span className="text-xs text-zinc-400 font-[family-name:var(--font-kode)]">Team Squad Size</span>
                    <span className="text-sm font-bold text-white">{teamSize} Gazers</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                    <span className="text-xs text-zinc-400 font-[family-name:var(--font-kode)]">Rate Per Person</span>
                    <span className="text-sm text-zinc-300">₹{event.pricePerPerson}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-bold uppercase tracking-wider text-white">Total Amount Due</span>
                    <span className="text-2xl font-bold font-[family-name:var(--font-tech)] text-[#00b4d8]">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <ShieldCheck size={16} className="text-[#00b4d8]" />
                    Razorpay Secure Checkout
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Supports UPI (Google Pay, PhonePe, Paytm, BHIM), Cards, and NetBanking.
                    Covers 2-day XR Lab SIET entry, all meals & refreshments, plus entry to the Day 2 Valorant & FC 26 tournaments.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => setStep(2)}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleInitiatePayment}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#00b4d8] to-[#0096c7] hover:from-white hover:to-zinc-200 text-black font-extrabold text-xs uppercase tracking-widest rounded-lg transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Connecting Gateway...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Pay ₹{totalAmount} & Confirm Roster
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Holographic Confirmation Pass */}
            {step === 4 && (
              <div className="p-6 md:p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 size={36} />
                </div>

                <div>
                  <span className="font-[family-name:var(--font-kode)] text-xs font-bold uppercase tracking-[0.3em] text-[#00b4d8]">
                    Transmission Confirmed · Squad Registered
                  </span>
                  <h3 className="font-[family-name:var(--font-tech)] text-3xl font-bold text-white mt-1">
                    {teamName}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Pass ID: <span className="text-white font-mono font-bold">{confirmedRegId}</span>
                  </p>
                  {confirmedPaymentId && (
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                      Payment Ref: {confirmedPaymentId}
                    </p>
                  )}
                </div>

                <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-lg text-left space-y-2.5 font-[family-name:var(--font-kode)] text-xs">
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500">EVENT</span>
                    <span className="text-zinc-300 font-bold">{event.title}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500">VENUE</span>
                    <span className="text-zinc-300 font-bold">XR Lab, SIET Coimbatore</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500">TRACK</span>
                    <span className="text-[#00b4d8] font-bold">{selectedTrack}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500">ROSTER</span>
                    <span className="text-zinc-300 font-bold">{teamSize} Gazers ({collegeName})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">PAYMENT STATUS</span>
                    <span className="text-emerald-400 font-bold">VERIFIED (₹{totalAmount})</span>
                  </div>
                </div>

                {/* Important Discord Step */}
                <div className="p-4 rounded-lg bg-[#5865F2]/10 border border-[#5865F2]/30 text-left space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-[#5865F2] animate-ping" />
                    Mandatory Step: Join OuterGazers Discord
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Have your squad join our Discord server. Post your Pass ID{" "}
                    <span className="text-[#00b4d8] font-mono font-bold">{confirmedRegId}</span> in{" "}
                    <span className="text-white font-semibold">#jam-verify</span> to receive your Team Leader & Participant roles and access the jam channels!
                  </p>
                  <a
                    href={DISCORD_INVITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full mt-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs uppercase tracking-widest rounded transition-colors"
                  >
                    Enter OuterGazers Discord (discord.gg/N4w7gGfdq)
                    <ChevronRight size={14} />
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleClose}
                    className="px-8 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-widest rounded transition-colors"
                  >
                    Close Pass
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
