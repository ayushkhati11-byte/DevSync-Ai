"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useSession } from "@/lib/session";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const { session, loading: sessionLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!sessionLoading && session?.user) router.replace("/dashboard");
  }, [router, session, sessionLoading]);

  const handleGitHubSignIn = async () => {
    setLoading(true);
    try { await authClient.signIn.social({ provider: "github", callbackURL: "/dashboard", scopes: ["repo"] }); }
    catch { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-400 via-cyan-400 to-purple-400 rounded-2xl mb-4 shadow-lg shadow-emerald-500/25">
            <Sparkles className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Welcome to DevSync</h1>
          <p className="text-sm text-white/40">Sign in to start building and collaborating</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
          <button onClick={handleGitHubSignIn} disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all disabled:opacity-50 shadow-lg shadow-white/10">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            {loading ? "Signing in..." : "Continue with GitHub"}
          </button>
          <div className="mt-5 text-center text-xs text-white/30">By signing in, you agree to our Terms of Service</div>
        </div>
        <p className="text-center text-white/30 text-xs mt-6">
          <Link href="/" className="hover:text-white/60 transition-colors">Back to home</Link>
        </p>
      </div>
    </div>
  );
}
