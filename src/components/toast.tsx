"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { XCircle, X } from "lucide-react";
import { LottieAnimation } from "@/components/lottie-animation";

type Toast = {
  id: number;
  message: string;
  type: "success" | "error";
};

type ToastContextType = {
  toast: (message: string, type?: "success" | "error") => void;
};

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const remove = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-xl ${
              t.type === "success"
                ? "bg-emerald-950/80 border-emerald-500/20 text-emerald-200"
                : "bg-red-950/80 border-red-500/20 text-red-200"
            }`}
          >
            {t.type === "success" ? (
              <div className="w-5 h-5 shrink-0 mt-0.5">
                <LottieAnimation src="/animations/success-check.json" loop={false} className="w-full h-full" />
              </div>
            ) : (
              <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <p className="text-sm flex-1">{t.message}</p>
            <button onClick={() => remove(t.id)} className="shrink-0 opacity-50 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
