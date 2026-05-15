"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut, Sparkles, Bell, Check, ArrowRight, XCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/session";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const links = [
  { href: "/explore", label: "Projects" },
  { href: "/ideas", label: "Ideas" },
  { href: "/users", label: "Users" },
  { href: "/forum", label: "Forum" },
];

export function Navbar() {
  const { session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchNotifs = async () => {
    if (!session) return;
    try { const r = await fetch("/api/notifications"); const d = await r.json(); setNotifs(d.notifications || []); setUnreadCount(d.unreadCount || 0); } catch {}
  };

  useEffect(() => { fetchNotifs(); const t = setInterval(fetchNotifs, 15000); return () => clearInterval(t); }, [session]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PATCH", body: JSON.stringify({ readAll: true }) });
    setNotifs((prev) => prev.map((n: any) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

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
                <div className="relative" ref={notifRef}>
                  <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 text-white/30 hover:text-white/70 rounded-lg hover:bg-white/[0.06] transition-all">
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-amber-500 text-black text-[10px] font-bold rounded-full px-1">{unreadCount > 99 ? "99+" : unreadCount}</span>}
                  </button>
                  {showNotifs && (
                    <div className="absolute right-0 mt-2 w-80 bg-white/[0.03] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                        <span className="font-semibold text-sm">Notifications</span>
                        {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-emerald-400 hover:underline">Mark all read</button>}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifs.length === 0 ? (
                          <div className="px-4 py-8 text-center text-white/40 text-sm">No notifications</div>
                        ) : (
                          notifs.slice(0, 5).map((n: any) => (
                            <Link key={n.id} href={n.link || "#"} onClick={() => { setShowNotifs(false); if (!n.read) fetch(`/api/notifications`, { method: "PATCH", body: JSON.stringify({ id: n.id }) }); }}
                              className={`block px-4 py-3 hover:bg-white/[0.03] transition-colors ${!n.read ? "bg-emerald-500/[0.04] border-l-2 border-emerald-500" : "border-l-2 border-transparent"}`}>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${n.type === "collab_request" ? "bg-amber-500/20 text-amber-400" : n.type === "collab_accepted" ? "bg-emerald-500/20 text-emerald-400" : n.type === "comment_reply" ? "bg-cyan-500/20 text-cyan-400" : "bg-white/[0.06] text-white/40"}`}>{n.type.replace("_", " ")}</span>
                                {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-auto shrink-0" />}
                              </div>
                              <div className="text-sm font-medium mt-1">{n.title}</div>
                              <div className="text-xs text-white/40 mt-0.5 truncate">{n.message}</div>
                            </Link>
                          ))
                        )}
                      </div>
                      {notifs.length > 0 && (
                        <Link href="/notifications" onClick={() => setShowNotifs(false)} className="flex items-center justify-center gap-1 px-4 py-3 border-t border-white/[0.06] text-xs text-emerald-400 hover:bg-white/[0.03]">
                          View all <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
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
                <Link href="/notifications" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm text-white/40 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/[0.06] w-full transition-all">
                  <div className="relative"><Bell className="w-4 h-4" />{unreadCount > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] flex items-center justify-center bg-amber-500 text-black text-[9px] font-bold rounded-full px-0.5">{unreadCount}</span>}</div>
                  Notifications{unreadCount > 0 && <span className="text-amber-400"> ({unreadCount} new)</span>}
                </Link>
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
