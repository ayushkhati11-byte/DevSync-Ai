"use client";

import { useState } from "react";
import { Menu, X, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/session";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/ideas", label: "Ideas" },
  { href: "/forum", label: "Forum" },
];

export function Navbar() {
  const { session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 via-cyan-400 to-purple-400 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-gradient">DevSync</span>
              <span className="text-white/60"> AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-white/50 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="w-px h-6 bg-white/[0.06] mx-2" />
            {session ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-all group">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" className="w-6 h-6 rounded-full ring-2 ring-white/[0.06]" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-black">
                      {session.user?.name?.[0] || "U"}
                    </div>
                  )}
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">{session.user?.name || "Dashboard"}</span>
                </Link>
                <button onClick={handleSignOut} className="p-2 text-white/30 hover:text-white/70 rounded-lg hover:bg-white/[0.06] transition-all" title="Sign out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/signin"
                className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-white/90 transition-all shadow-lg shadow-white/10"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/[0.06]"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#050505]">
          <div className="px-4 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-sm text-white/50 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-all"
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-white/[0.06] my-2" />
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.06] transition-all">
                  {session.user?.image ? <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" /> : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-sm font-bold text-black">
                      {session.user?.name?.[0] || "U"}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium">{session.user?.name}</div>
                    <div className="text-xs text-white/30">Dashboard</div>
                  </div>
                </Link>
                <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-white/40 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/[0.06] w-full transition-all">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </>
            ) : (
              <Link href="/signin" onClick={() => setOpen(false)} className="block px-4 py-2.5 bg-white text-black text-sm font-semibold rounded-lg text-center hover:bg-white/90 transition-all">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
