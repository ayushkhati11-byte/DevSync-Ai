"use client";

import { motion } from "framer-motion";

export function LoadingSpinner({ size = 40, text }: { size?: number; text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 border-r-cyan-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full bg-emerald-500/20 blur-sm"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-[40%] rounded-full bg-emerald-400" />
      </div>
      {text && <p className="text-sm text-white/40">{text}</p>}
    </div>
  );
}

export function FullPageLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <LoadingSpinner size={48} text={text} />
    </div>
  );
}

export function SuccessCheck() {
  return (
    <motion.div
      className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center"
      initial={{ scale: 0 }} animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <motion.svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <motion.path d="M5 13l4 4L19 7" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
      </motion.svg>
    </motion.div>
  );
}

export function BouncingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400"
          animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }} />
      ))}
    </div>
  );
}
