"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, Check, ExternalLink, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useSession } from "@/lib/session";
import { LoadingSpinner, FullPageLoading } from "@/components/loading-animation";

export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>();
  const { session } = useSession();
  const router = useRouter();
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/ideas/${id}`).then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => { setIdea(data); setLoading(false); }).catch(() => { setError("Not found"); setLoading(false); });
  }, [id]);

  const handleJoin = async () => {
    if (!session) { router.push("/signin"); return; }
    setJoining(true);
    try {
      const res = await fetch(`/api/ideas/${id}/join`, { method: "POST" });
      if (!res.ok) { alert((await res.json()).error || "Failed to join"); return; }
      setIdea(await res.json());
    } catch { alert("Failed to join"); }
    finally { setJoining(false); }
  };

  if (loading) return <FullPageLoading />;
  if (error || !idea) return (
    <div className="min-h-screen bg-[#050505]"><Navbar /><div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <AlertCircle className="w-12 h-12 text-white/10 mx-auto mb-4" /><h1 className="text-xl font-bold mb-2">{error || "Not found"}</h1>
      <Link href="/ideas" className="text-emerald-400 hover:underline text-sm">Back to ideas</Link></div></div>
  );

  const hasJoined = idea?.members?.some((m: any) => m.userId === session?.user?.id);
  const isFull = idea && (idea._count?.members || 0) >= idea.maxMembers;
  const isOwner = idea?.ownerId === session?.user?.id;
  const isOpen = idea?.status === "open";

  return (
    <div className="min-h-screen bg-[#050505]"><Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link href="/ideas" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to ideas</Link>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 sm:p-8 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl sm:text-3xl font-bold">{idea.title}</h1>
                <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${idea.status === "open" ? "bg-emerald-500/20 text-emerald-400" : idea.status === "in-progress" ? "bg-cyan-500/20 text-cyan-400" : "bg-white/[0.06] text-white/40"}`}>{idea.status}</span>
              </div>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed whitespace-pre-wrap">{idea.vision}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/40 mb-5"><span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{idea._count?.members || 0}/{idea.maxMembers} members</span></div>

          {Array.isArray(idea.requiredRoles) && idea.requiredRoles.length > 0 && (
            <div className="mb-6"><div className="text-xs text-white/40 uppercase tracking-wider mb-2">Looking for</div>
              <div className="flex flex-wrap gap-2">{idea.requiredRoles.map((role: string) => <span key={role} className="px-3 py-1 bg-white/[0.06] rounded-lg text-sm border border-white/[0.06]">{role}</span>)}</div></div>
          )}

          {isOpen && !isOwner && (
            <button onClick={handleJoin} disabled={joining || hasJoined || isFull}
              className={`w-full py-3 rounded-xl font-medium transition-all text-sm ${hasJoined ? "bg-emerald-500/20 text-emerald-400 cursor-default border border-emerald-500/30" : isFull ? "bg-white/[0.06] text-white/40 cursor-not-allowed" : "bg-white text-black hover:bg-white/90 disabled:opacity-50 shadow-lg shadow-white/10"}`}>
              {joining ? <LoadingSpinner size={20} /> : hasJoined ? <span className="flex items-center justify-center gap-2"><Check className="w-4 h-4" /> Joined</span> : isFull ? "Team is full" : "Join This Idea"}
            </button>
          )}
          {isOwner && <div className="w-full py-3 rounded-xl bg-white/[0.04] text-white/40 text-center text-sm border border-white/[0.06]">You own this idea</div>}

          {idea.repoUrl && <a href={idea.repoUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full mt-3 py-3 bg-white/[0.06] rounded-xl text-sm hover:bg-white/[0.08] transition-colors border border-white/[0.06]"><ExternalLink className="w-4 h-4" /> View Repository</a>}
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4"><Users className="w-5 h-5 text-cyan-400" /><h2 className="font-semibold">Team ({idea.members?.length || 0})</h2></div>
          {idea.members?.length > 0 ? (
            <div className="space-y-3">{idea.members.map((m: any) => (
              <div key={m.id} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                {m.user.image ? <img src={m.user.image} alt="" className="w-9 h-9 rounded-full" /> : <div className="w-9 h-9 bg-white/[0.06] rounded-full flex items-center justify-center text-sm">{m.user.name?.[0] || "U"}</div>}
                <div><Link href={`/profile/${m.user.id}`} className="text-sm font-medium hover:text-emerald-400 transition-colors">{m.user.name || "Anonymous"}</Link><div className="text-xs text-white/40 capitalize">{m.role}</div></div>
              </div>
            ))}</div>
          ) : <p className="text-sm text-white/40">No members yet</p>}
        </div>
      </main>
    </div>
  );
}
