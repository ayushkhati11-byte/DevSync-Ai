"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, GitBranch, Lightbulb, MessageSquare, ArrowRight, Check, X, ChevronLeft, Eye } from "lucide-react";

const TOUR_KEY = "devsync_tour_completed";

const steps = [
  {
    icon: Sparkles,
    title: "Welcome to DevSync AI!",
    description: "Your all-in-one platform to showcase projects, get AI code audits, and find teammates. This quick tour will show you around.",
    target: "hero",
  },
  {
    icon: GitBranch,
    title: "Import Your Projects",
    description: "Click here to import any GitHub repository. We'll analyze your code with AI and give you a grade, complexity score, and improvement suggestions.",
    target: "add-project",
  },
  {
    icon: Eye,
    title: "Explore Projects",
    description: "Browse projects from other developers, filter by tech stack or AI grade, and see detailed audit reports. Get inspired by what others are building.",
    target: "explore-link",
  },
  {
    icon: Lightbulb,
    title: "Post & Join Ideas",
    description: "Have a project idea but need teammates? Post it in the Idea Hub. Other developers can join, and we auto-create a GitHub repo for your team.",
    target: "ideas-link",
  },
  {
    icon: MessageSquare,
    title: "Discuss & Collaborate",
    description: "Every project gets its own discussion thread. Use the forum to ask questions, share feedback, and collaborate with the community.",
    target: "forum-link",
  },
];

export function TourProvider({ children, show }: { children: React.ReactNode; show: boolean }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [targetEl, setTargetEl] = useState<Element | null>(null);

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_KEY);
    if (show && !completed) {
      setTimeout(() => setVisible(true), 600);
      setDismissed(false);
    }
  }, [show]);

  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => {
      const el = document.querySelector(`[data-tour="${steps[step].target}"]`);
      setTargetEl(el);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
    return () => clearTimeout(id);
  }, [step, visible]);

  const next = useCallback(() => {
    if (step < steps.length - 1) setStep(step + 1);
  }, [step]);

  const prev = useCallback(() => {
    if (step > 0) setStep(step - 1);
  }, [step]);

  const finish = useCallback(() => {
    localStorage.setItem(TOUR_KEY, "true");
    setVisible(false);
    setDismissed(true);
  }, []);

  const skip = useCallback(() => {
    finish();
  }, [finish]);

  if (dismissed) return <>{children}</>;

  const s = steps[step];

  return (
    <>
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] pointer-events-none"
          >
            {/* Target highlight ring */}
            {targetEl && (
              <motion.div
                layoutId="tour-highlight"
                className="absolute rounded-xl border-2 border-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,0.2)] pointer-events-none"
                style={{
                  top: targetEl.getBoundingClientRect().top - 8,
                  left: targetEl.getBoundingClientRect().left - 8,
                  width: targetEl.getBoundingClientRect().width + 16,
                  height: targetEl.getBoundingClientRect().height + 16,
                }}
              />
            )}

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-5 shadow-2xl shadow-black/50">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                    <s.icon className="w-5 h-5 text-black" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm">{s.title}</h3>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">{s.description}</p>
                  </div>
                  <button onClick={skip} className="shrink-0 p-1 text-white/30 hover:text-white/60 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress dots */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === step
                            ? "w-6 bg-emerald-400"
                            : i < step
                              ? "w-1.5 bg-emerald-400/40"
                              : "w-1.5 bg-white/[0.08]"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {step > 0 && (
                      <button onClick={prev} className="p-1.5 text-white/40 hover:text-white/70 rounded-lg hover:bg-white/[0.06] transition-all">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                    {step < steps.length - 1 ? (
                      <button onClick={next} className="px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-lg hover:bg-white/90 transition-all flex items-center gap-1">
                        Next <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button onClick={finish} className="px-3 py-1.5 bg-emerald-500 text-black text-xs font-semibold rounded-lg hover:bg-emerald-400 transition-all flex items-center gap-1">
                        <Check className="w-3 h-3" /> Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function resetTour() {
  localStorage.removeItem(TOUR_KEY);
}
