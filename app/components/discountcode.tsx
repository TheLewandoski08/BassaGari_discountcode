"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Sparkles, ArrowRight } from "lucide-react";

const LOADING_MESSAGES = [
  "Assembling your surprise...",
  "Unlocking your welcome reward...",
  "Generating your exclusive code...",
  "Ready!",
];

const DISCOUNT_CODE = "CURIOUS10";
const SHOP_URL = "https://bassagari.com";

// slower, more deliberate reveal — a quick spinner reads as trivial,
// a longer unhurried build reads as something worth waiting for
const LOAD_DURATION_MS = 5200;

const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function BassaGariReward() {
  const [phase, setPhase] = useState("loading"); // "loading" | "reveal"
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function tick(timestamp: number) {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      // ease-out curve so it settles in gently near the end rather than
      // stopping abruptly — reads as more considered, less mechanical
      const linear = Math.min(1, elapsed / LOAD_DURATION_MS);
      const eased = 1 - Math.pow(1 - linear, 2);
      setProgress(eased * 100);

      if (linear < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100 && phase === "loading") {
      const t = setTimeout(() => setPhase("reveal"), 550);
      return () => clearTimeout(t);
    }
  }, [progress, phase]);

  const messageIndex = Math.min(
    LOADING_MESSAGES.length - 1,
    Math.floor((progress / 100) * LOADING_MESSAGES.length)
  );
  const isComplete = progress >= 100;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress / 100);

  function handleCopy() {
    navigator.clipboard.writeText(DISCOUNT_CODE).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-orange-50 relative overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-200 opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-amber-200 opacity-50 blur-3xl" />

      <AnimatePresence mode="wait">
        {phase === "loading" ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.4 } }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-orange-100 px-8 py-11 flex flex-col items-center text-center"
          >
            <div className="relative mb-7 w-32 h-32 flex items-center justify-center">
              {/* soft ambient pulse behind the ring, restrained */}
              <motion.div
                animate={{ opacity: [0.25, 0.45, 0.25], scale: [1, 1.06, 1] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-orange-200 blur-xl"
              />

              <svg
                width="128"
                height="128"
                viewBox="0 0 128 128"
                className="-rotate-90 relative"
              >
                <circle
                  cx="64"
                  cy="64"
                  r={RING_RADIUS}
                  fill="none"
                  stroke="#FDE8D2"
                  strokeWidth="7"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={RING_RADIUS}
                  fill="none"
                  stroke="url(#ringGradient)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={dashOffset}
                />
                <defs>
                  <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#C2410C" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {isComplete ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center"
                    >
                      <Check className="w-5 h-5 text-white" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="percent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-2xl font-semibold text-orange-800 tabular-nums tracking-tight"
                    >
                      {Math.round(progress)}%
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="text-stone-700 font-medium text-base min-h-6"
              >
                {LOADING_MESSAGES[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-orange-100 px-8 py-10 flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 16 }}
              className="mb-5 flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-amber-400 to-orange-600 shadow-lg shadow-orange-200"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.35 }}
              className="text-2xl sm:text-[1.7rem] font-bold text-stone-900 leading-tight mb-2"
            >
              Thank You for Completing the Form!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.35 }}
              className="text-stone-500 text-sm mb-7"
            >
              Your exclusive Bassa Gari welcome discount is ready.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.35 }}
              className="w-full rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 px-6 py-6 flex flex-col items-center gap-3 mb-7"
            >
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-white bg-amber-500 px-3 py-1 rounded-full">
                10% Off Your Entire Order
              </span>

              <span className="font-mono text-2xl sm:text-3xl font-bold tracking-widest text-orange-800">
                {DISCOUNT_CODE}
              </span>

              <motion.button
                type="button"
                onClick={handleCopy}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  copied
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-white border-orange-300 text-orange-800 hover:bg-orange-100"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied! ✓
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Code
                  </>
                )}
              </motion.button>
            </motion.div>

            <motion.a
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.35 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-orange-600 to-orange-700 text-white font-semibold text-[15px] px-6 py-4 shadow-lg shadow-orange-200 hover:shadow-xl transition-shadow"
            >
              Shop Bassa Gari Now <ArrowRight className="w-4 h-4" />
            </motion.a>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.35 }}
              className="text-xs text-stone-400 mt-5"
            >
              Use this code at checkout to claim your 10% discount.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}