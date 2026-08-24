"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Copy, Check, Sparkles, ArrowRight } from "lucide-react";

const LOADING_MESSAGES = [
  "Assembling your surprise...",
  "Unlocking your welcome reward...",
  "Generating your exclusive code...",
  "Ready!",
];

const DISCOUNT_CODE = "CURIOUS10";
const SHOP_URL = "https://bassagari.com";

export default function BassaGariReward() {
  const [phase, setPhase] = useState("loading"); // "loading" | "reveal"
  const [messageIndex, setMessageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((i) => (i < LOADING_MESSAGES.length - 1 ? i + 1 : i));
    }, 750);

    const phaseTimer = setTimeout(() => setPhase("reveal"), 3000);

    return () => {
      clearInterval(messageTimer);
      clearTimeout(phaseTimer);
    };
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(DISCOUNT_CODE).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-orange-50 relative overflow-hidden px-4 py-10">
      {/* ambient background blobs, echoes the lead-form brand */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-200 opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-amber-200 opacity-50 blur-3xl" />

      <AnimatePresence mode="wait">
        {phase === "loading" ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.35 } }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-orange-100 px-8 py-10 flex flex-col items-center text-center"
          >
            <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-full bg-orange-100">
              <Loader2 className="w-7 h-7 text-orange-700 animate-spin" />
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-stone-700 font-medium text-base mb-6 min-h-6"
              >
                {LOADING_MESSAGES[messageIndex]}
              </motion.p>
            </AnimatePresence>

            <div className="w-full h-2 rounded-full bg-orange-100 overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
                className="h-full rounded-full bg-linear-to-r from-amber-400 to-orange-600"
              />
            </div>
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