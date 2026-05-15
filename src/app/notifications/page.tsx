"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Bell, Check, Trash2 } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useSession } from "@/lib/session";
import { FullPageLoading } from "@/components/loading-animation";

export default function Notifications() {
  const { session, loading: sessionLoading } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionLoading && session) {
      fetch("/api/notifications")
        .then((r) => r.json())
        .then((d) => setNotifications(d.notifications || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [session, sessionLoading]);

  const markRead = async (id: string) => {
    await fetch("/api/notifications", { method: "PATCH", body: JSON.stringify({ id }) });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PATCH", body: JSON.stringify({ readAll: true }) });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  if (sessionLoading || loading) return <FullPageLoading />;
  if (!session) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-white/50" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-400" /> Notifications
            </h1>
            <p className="text-white/40 text-sm mt-0.5">{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-emerald-400 hover:bg-white/[0.06] rounded-lg transition-colors">
              <Check className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <div key={n.id} className={`p-4 rounded-xl border transition-colors ${n.read ? "bg-white/[0.02] border-white/[0.04]" : "bg-white/[0.04] border-white/[0.06]"}`}>
                <div className="flex items-start justify-between gap-3">
                  <Link href={n.link || "#"} className="flex-1 min-w-0" onClick={() => !n.read && markRead(n.id)}>
                    <div className="font-medium text-sm">{n.title}</div>
                    <div className="text-white/40 text-sm mt-1 line-clamp-2">{n.message}</div>
                    <div className="text-white/20 text-xs mt-2">{new Date(n.createdAt).toLocaleDateString()}</div>
                  </Link>
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} className="p-1.5 hover:bg-white/[0.06] rounded-lg shrink-0" title="Mark as read">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}