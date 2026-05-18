"use client";

import { motion } from "framer-motion";
import { LottieAnimation } from "@/components/lottie-animation";

export function LoadingSpinner({ size = 40, text }: { size?: number; text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div style={{ width: size, height: size }}>
        <LottieAnimation src="/animations/loadinghand.json" className="w-full h-full" />
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
    <div className="w-16 h-16">
      <LottieAnimation src="/animations/success-check.json" loop={false} className="w-full h-full" />
    </div>
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

export function LottieLoading({ src, size = 48, text }: { src: string; size?: number; text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div style={{ width: size, height: size }}>
        <LottieAnimation src={src} className="w-full h-full" />
      </div>
      {text && <p className="text-sm text-white/40">{text}</p>}
    </div>
  );
}
