"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  ShieldCheck,
  Sparkles,
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
} from "lucide-react";
import { GameJamEvent, TeamRegistrationPayload, TeamMember } from "@/types";
import { DISCORD_INVITE_URL, WHATSAPP_GROUP_INVITE_URL } from "@/constants";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { submitTeamRegistration } from "@/lib/sheets";

interface ModalProps {
  event: GameJamEvent;
  isOpen: boolean;
  onClose: () => void;
}

export default function TeamRegistrationModal({ event, isOpen, onClose }: ModalProps) {
  // Steps: 1: Details, 2: Review & Pay, 3: Success, 4: Failed / Cancelled
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [teamSize, setTeamSize] = useState<3 | 4>(3);
  const [teamName, setTeamName] = useState("");
  const [collegeName, setCollegeName] = useState("");

  // Roster: Leader contact info + Member names only
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [member2Name, setMember2Name] = useState("");
  const [member3Name, setMember3Name] = useState("");
  const [member4Name, setMember4Name] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedRegId, setConfirmedRegId] = useState<string | null>(null);
  const [confirmedPaymentId, setConfirmedPaymentId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const totalAmount = teamSize * event.pricePerPerson;

  // Validate Step 1
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!teamName.trim()) {
      setErrorMessage("Please enter a Team Name.");
      return;
    }
    if (!collegeName.trim()) {
      setErrorMessage("Please enter your College / Institution Name.");
      return;
    }
    if (!leaderName.trim() || !leaderEmail.trim() || !leaderPhone.trim()) {
      setErrorMessage("Please complete all Team Leader details (Name, Email, Phone).");
      return;
    }
    if (!member2Name.trim()) {
      setErrorMessage("Please enter the name of Member 02.");
      return;
    }
    if (!member3Name.trim()) {
      setErrorMessage("Please enter the name of Member 03.");
      return;
    }
    if (teamSize === 4 && !member4Name.trim()) {
      setErrorMessage("Please enter the name of Member 04.");
      return;
    }

    setStep(2);
  };

  // Trigger Razorpay Checkout
  const handleInitiatePayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    const generatedRegId = confirmedRegId || `SIET-JAM-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedRegId(generatedRegId);

    const leader: TeamMember = {
      name: leaderName.trim(),
      email: leaderEmail.trim(),
      phone: leaderPhone.trim(),
      college: collegeName.trim(),
    };

    const membersList: TeamMember[] = [
      { name: member2Name.trim() },
      { name: member3Name.trim() },
    ];
    if (teamSize === 4 && member4Name.trim()) {
      membersList.push({ name: member4Name.trim() });
    }

    const payload: TeamRegistrationPayload = {
      registrationId: generatedRegId,
      eventId: event.id,
      eventTitle: event.title,
      teamName: teamName.trim(),
      collegeName: collegeName.trim(),
      teamSize,
      totalAmount,
      leader,
      members: membersList,
      paymentStatus: "PENDING",
      submittedAt: new Date().toISOString(),
    };

    // Pre-log to Google Sheet (non-blocking)
    submitTeamRegistration(payload).catch((err) => console.warn("Pre-log error:", err));

    try {
      await openRazorpayCheckout({
        amountInINR: totalAmount,
        teamName: teamName.trim(),
        teamSize,
        eventTitle: event.title,
        leaderName: leader.name,
        leaderEmail: leader.email || "",
        leaderPhone: leader.phone || "",
        onSuccess: async (paymentId) => {
          // Log success to Google Sheet
          await submitTeamRegistration({
            ...payload,
            paymentStatus: "PAID",
            razorpayPaymentId: paymentId,
          });

          setConfirmedPaymentId(paymentId);
          setIsProcessing(false);
          setStep(3); // Go to Success Screen
        },
        onDismiss: () => {
          setIsProcessing(false);
          setErrorMessage("Payment checkout was canceled or dismissed.");
          setStep(4); // Go to Failure / Dismissed Screen
        },
        onError: (err) => {
          setIsProcessing(false);
          setErrorMessage(err.message || "Payment gateway encountered an error.");
          setStep(4); // Go to Failure / Dismissed Screen
        },
      });
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage(err instanceof Error ? err.message : "Failed to connect to payment gateway.");
      setStep(4);
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
                  XR Lab, SIET Coimbatore · Official Registration
                </div>
                <h3 className="text-xl md:text-2xl font-bold font-[family-name:var(--font-tech)] tracking-tight text-white">
                  {event.title}
                </h3>
                <p className="text-xs text-zinc-400 font-[family-name:var(--font-kode)] tracking-wider">
                  ₹{event.pricePerPerson} / Member · Includes All Meals, Refreshments & Esports Entry
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
                Full Hospitality (All Meals &amp; High-Tea)
              </span>
              <span className="text-zinc-700">•</span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Gamepad2 size={13} className="text-[#7c3aed]" />
                Free Valorant &amp; FC 26 Esports Entry
              </span>
            </div>

            {/* Step 1 & 2 Indicator */}
            {step <= 2 && (
              <div className="px-6 md:px-8 pt-4 pb-2 bg-zinc-950/40 border-b border-zinc-900 flex items-center justify-between text-xs font-[family-name:var(--font-kode)]">
                <span className={step === 1 ? "text-[#00b4d8] font-bold" : "text-zinc-500"}>
                  01. Team &amp; Roster Info
                </span>
                <span className="text-zinc-700">───</span>
                <span className={step === 2 ? "text-[#00b4d8] font-bold" : "text-zinc-600"}>
                  02. Review &amp; Secure Payment
                </span>
              </div>
            )}

            {/* General Error Banner */}
            {errorMessage && step !== 4 && (
              <div className="mx-6 md:mx-8 mt-4 p-3 rounded-lg bg-red-950/30 border border-red-800/50 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                STEP 1: Team & Roster Information
            ══════════════════════════════════════════════════════════════ */}
            {step === 1 && (
              <form onSubmit={handleProceedToReview} className="p-6 md:p-8 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Team Name & College Name */}
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

                {/* Team Size Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-[family-name:var(--font-kode)]">
                    Team Members Count *
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
                        (₹800 × 3 Members · Meals &amp; Esports Included)
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
                        (₹800 × 4 Members · Meals &amp; Esports Included)
                      </span>
                    </button>
                  </div>
                </div>

                {/* Team Leader Contact Details */}
                <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00b4d8] font-[family-name:var(--font-kode)]">
                      Team Leader (Primary Contact &amp; Payment Receipt)
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Required</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Leader Full Name *"
                        value={leaderName}
                        onChange={(e) => setLeaderName(e.target.value)}
                        className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Leader Email Address *"
                        value={leaderEmail}
                        onChange={(e) => setLeaderEmail(e.target.value)}
                        className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Phone / WhatsApp Number *"
                        value={leaderPhone}
                        onChange={(e) => setLeaderPhone(e.target.value)}
                        className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Squad Members: Just Names Needed */}
                <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-[family-name:var(--font-kode)]">
                      Squad Members (Names Only)
                    </span>
                    <span className="text-[10px] text-zinc-500 font-[family-name:var(--font-kode)]">
                      {teamSize - 1} Teammates
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-[family-name:var(--font-kode)]">
                        Member 02 Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Member 2 Full Name"
                        value={member2Name}
                        onChange={(e) => setMember2Name(e.target.value)}
                        className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-[family-name:var(--font-kode)]">
                        Member 03 Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Member 3 Full Name"
                        value={member3Name}
                        onChange={(e) => setMember3Name(e.target.value)}
                        className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {teamSize === 4 && (
                    <div className="pt-1">
                      <label className="block text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1 font-[family-name:var(--font-kode)]">
                        Member 04 Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Member 4 Full Name"
                        value={member4Name}
                        onChange={(e) => setMember4Name(e.target.value)}
                        className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-[#00b4d8] rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#00b4d8] hover:bg-white text-black font-bold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2"
                  >
                    Proceed to Review &amp; Pay
                    <ChevronRight size={16} />
                  </button>
                </div>
              </form>
            )}

            {/* ══════════════════════════════════════════════════════════════
                STEP 2: Summary & Checkout
            ══════════════════════════════════════════════════════════════ */}
            {step === 2 && (
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
                    <span className="text-xs text-zinc-400 font-[family-name:var(--font-kode)]">Team Leader</span>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">{leaderName}</div>
                      <div className="text-[11px] text-zinc-400">{leaderEmail} · {leaderPhone}</div>
                    </div>
                  </div>

                  <div className="border-b border-zinc-800 pb-2.5 space-y-1">
                    <span className="text-xs text-zinc-400 font-[family-name:var(--font-kode)]">Squad Members</span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-bold">
                        1. {leaderName} (Leader)
                      </span>
                      <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
                        2. {member2Name}
                      </span>
                      <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
                        3. {member3Name}
                      </span>
                      {teamSize === 4 && (
                        <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
                          4. {member4Name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                    <span className="text-xs text-zinc-400 font-[family-name:var(--font-kode)]">Squad Size &amp; Rate</span>
                    <span className="text-sm text-zinc-300">{teamSize} Gazers × ₹{event.pricePerPerson}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-bold uppercase tracking-wider text-white">Total Amount Due</span>
                    <span className="text-2xl font-bold font-[family-name:var(--font-tech)] text-[#00b4d8]">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400 space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <ShieldCheck size={16} className="text-[#00b4d8]" />
                    Razorpay Secure Checkout
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Supports UPI (Google Pay, PhonePe, Paytm, BHIM), Cards, and NetBanking.
                    Includes all 2 days of SIET XR Lab access, hospitality meals, and free Day 2 Valorant &amp; FC 26 tournaments.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => setStep(1)}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    <ArrowLeft size={14} /> Back to Edit
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
                        Pay ₹{totalAmount} &amp; Confirm Registration
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                STEP 3: Payment SUCCESS Confirmation & Groups
            ══════════════════════════════════════════════════════════════ */}
            {step === 3 && (
              <div className="p-6 md:p-8 text-center space-y-6 max-h-[75vh] overflow-y-auto">
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
                  {confirmedPaymentId && (
                    <p className="text-[10px] text-zinc-500 font-mono mt-1">
                      Payment Ref: {confirmedPaymentId}
                    </p>
                  )}
                </div>

                {/* Official Registration Bill / Summary Table */}
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-left space-y-2.5 font-[family-name:var(--font-kode)] text-xs">
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500 uppercase">Team Name</span>
                    <span className="text-white font-bold">{teamName}</span>
                  </div>

                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500 uppercase">Team Leader</span>
                    <span className="text-white font-bold">{leaderName}</span>
                  </div>

                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500 uppercase">Contact Info</span>
                    <span className="text-zinc-300 text-right">
                      <span className="block">{leaderEmail}</span>
                      <span className="text-zinc-400 text-[11px]">{leaderPhone}</span>
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500 uppercase">College / Institution</span>
                    <span className="text-zinc-300 font-bold">{collegeName}</span>
                  </div>

                  <div className="border-b border-zinc-900 pb-2 space-y-1">
                    <div className="flex justify-between text-zinc-500 uppercase">
                      <span>Squad Roster ({teamSize} Members)</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-bold">
                        1. {leaderName} (Leader)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                        2. {member2Name}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                        3. {member3Name}
                      </span>
                      {teamSize === 4 && member4Name && (
                        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                          4. {member4Name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500 uppercase">Event &amp; Venue</span>
                    <span className="text-zinc-300 text-right">
                      <span className="block font-bold">{event.title}</span>
                      <span className="text-zinc-400 text-[11px]">XR Lab, SIET Coimbatore</span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-zinc-400 uppercase font-bold">Total Amount Paid</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      VERIFIED ₹{totalAmount}
                    </span>
                  </div>
                </div>

                {/* Success Message Box: Next Steps & Community Links */}
                <div className="space-y-3 text-left">
                  {/* WhatsApp Group Link */}
                  <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-[family-name:var(--font-kode)]">
                        <MessageCircle size={15} />
                        Step 1: Join Official WhatsApp Squad Group
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                        Mandatory
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Connect with SIET XR Lab coordinators, receive on-campus reporting schedules, food coupons, and live updates.
                    </p>
                    <a
                      href={WHATSAPP_GROUP_INVITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full mt-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded transition-colors"
                    >
                      <span>Join WhatsApp Group (Invite Link)</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>

                  {/* Discord Server Link */}
                  <div className="p-4 rounded-lg bg-[#5865F2]/10 border border-[#5865F2]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#5865F2] font-bold text-xs uppercase tracking-wider font-[family-name:var(--font-kode)]">
                        <Sparkles size={15} />
                        Step 2: Join OuterGazers Discord
                      </div>
                      <span className="text-[10px] bg-[#5865F2]/20 text-[#5865F2] px-2 py-0.5 rounded font-bold">
                        Community
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Drop your Pass ID <span className="text-[#00b4d8] font-mono font-bold">{confirmedRegId}</span> in{" "}
                      <span className="text-white font-semibold">#jam-verify</span> to receive your Team Leader &amp; Participant roles.
                    </p>
                    <a
                      href={DISCORD_INVITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full mt-1 px-4 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-xs uppercase tracking-widest rounded transition-colors"
                    >
                      <span>Enter OuterGazers Discord</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
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

            {/* ══════════════════════════════════════════════════════════════
                STEP 4: Payment FAILED or CANCELED Message Box & Links
            ══════════════════════════════════════════════════════════════ */}
            {step === 4 && (
              <div className="p-6 md:p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                  <AlertCircle size={36} />
                </div>

                <div>
                  <span className="font-[family-name:var(--font-kode)] text-xs font-bold uppercase tracking-[0.3em] text-red-400">
                    Payment Incomplete or Canceled
                  </span>
                  <h3 className="font-[family-name:var(--font-tech)] text-2xl font-bold text-white mt-1">
                    Registration Pending Payment
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
                    {errorMessage || "The transaction was canceled before completion. Your squad details have been retained so you do not have to re-enter them."}
                  </p>
                </div>

                {/* Saved Details Box */}
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-left space-y-2 font-[family-name:var(--font-kode)] text-xs">
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500">SAVED TEAM</span>
                    <span className="text-white font-bold">{teamName} ({collegeName})</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-900 pb-2">
                    <span className="text-zinc-500">ROSTER</span>
                    <span className="text-zinc-300">{teamSize} Gazers · Leader: {leaderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">AMOUNT PENDING</span>
                    <span className="text-[#00b4d8] font-bold">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleInitiatePayment}
                    className="px-6 py-3 bg-[#00b4d8] hover:bg-white text-black font-bold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <RefreshCw size={14} />
                    Retry Payment Now
                  </button>

                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-colors"
                  >
                    Edit Registration Details
                  </button>
                </div>

                {/* Need Help / Support Links */}
                <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800 text-left space-y-2">
                  <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider font-[family-name:var(--font-kode)]">
                    Need Help Completing Registration?
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    If money was debited from your account or you need manual UPI verification, reach out to our team directly:
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <a
                      href={WHATSAPP_GROUP_INVITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 hover:text-white text-[11px] font-bold font-[family-name:var(--font-kode)] transition-colors"
                    >
                      <MessageCircle size={13} />
                      WhatsApp Support Group
                    </a>
                    <a
                      href={DISCORD_INVITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#5865F2]/20 border border-[#5865F2]/30 text-[#5865F2] hover:text-white text-[11px] font-bold font-[family-name:var(--font-kode)] transition-colors"
                    >
                      <Sparkles size={13} />
                      Discord #help Desk
                    </a>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
