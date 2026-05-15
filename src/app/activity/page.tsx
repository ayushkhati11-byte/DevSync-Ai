"use client";

import { useState, useEffect } from "react";
import { Activity, FolderOpen, Lightbulb, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { FullPageLoading } from "@/components/loading-animation";

const typeIcons = { project: FolderOpen, idea: Lightbulb, discussion: MessageSquare };
const typeColors = { project: "text-emerald-400", idea: "text-amber-400", discussion: "text-cyan-400" };

export default function ActivityPage() {
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activity").then(r => r.json()).then(d => setActivity(d.activity || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <FullPageLoading />;

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-white/50" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" /> Activity Feed
          </h1>
        </div>

        {activity.length === 0 ? (
          <div className="text-center py-16 text-white/40">No recent activity</div>
        ) : (
          <div className="space-y-3">
            {activity.map((item, i) => {
              const Icon = typeIcons[item.type as keyof typeof typeIcons] || Activity;
              const color = typeColors[item.type as keyof typeof typeColors] || "text-white/40";
              const href = item.type === "project" ? `/projects/${item.id}` : item.type === "idea" ? `/ideas/${item.id}` : `/forum/${item.id}`;
              const timeAgo = getTimeAgo(new Date(item.createdAt));
              
              return (
                <Link key={i} href={href} className="flex items-start gap-4 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.08] transition-all">
                  <div className={`p-2 rounded-lg bg-white/[0.04] ${color}`}><Icon className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm"><span className="font-medium">{item.user?.name || "Someone"}</span> created <span className="text-emerald-400">{item.type}</span></div>
                    <div className="font-medium truncate mt-0.5">{item.name}</div>
                    {item.category && <span className="text-xs text-white/40 capitalize">in {item.category}</span>}
                  </div>
                  <span className="text-xs text-white/30 shrink-0">{timeAgo}</span>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function getTimeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}