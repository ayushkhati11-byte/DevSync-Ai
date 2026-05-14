"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, MessageSquare, Send, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useSession } from "@/lib/session";
import { FullPageLoading } from "@/components/loading-animation";

const colors: Record<string, string> = { general: "bg-white/[0.06] text-white/50", help: "bg-amber-500/20 text-amber-400", showcase: "bg-emerald-500/20 text-emerald-400", feedback: "bg-cyan-500/20 text-cyan-400", collaboration: "bg-purple-500/20 text-purple-400" };

export default function Thread() {
  const { id } = useParams<{ id: string }>();
  const { session } = useSession();
  const [discussion, setDiscussion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/discussions/${id}`).then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => { setDiscussion(data); setLoading(false); }).catch(() => { setError("Not found"); setLoading(false); });
  }, [id]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault(); if (!comment.trim()) return; setSubmitting(true);
    try {
      const res = await fetch(`/api/discussions/${id}/comments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: comment }) });
      if (!res.ok) return;
      const newComment = await res.json();
      setDiscussion((prev: any) => ({ ...prev, comments: [...(prev.comments || []), newComment] }));
      setComment("");
    } catch {}
    finally { setSubmitting(false); }
  };

  if (loading) return <FullPageLoading />;
  if (error || !discussion) return (
    <div className="min-h-screen bg-[#050505]"><Navbar /><div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <AlertCircle className="w-12 h-12 text-white/10 mx-auto mb-4" /><h1 className="text-xl font-bold mb-2">{error || "Not found"}</h1>
      <Link href="/forum" className="text-emerald-400 hover:underline text-sm">Back to forum</Link></div></div>
  );

  return (
    <div className="min-h-screen bg-[#050505]"><Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link href="/forum" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to forum</Link>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 sm:p-8 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2.5 py-0.5 rounded-lg text-xs capitalize ${colors[discussion.category] || "bg-white/[0.06] text-white/50"}`}>{discussion.category}</span>
            {discussion.project && <Link href={`/projects/${discussion.project.id}`} className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/20 transition-colors">{discussion.project.name}</Link>}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-4">{discussion.title}</h1>
          <div className="flex items-center gap-3 mb-5">
            {discussion.author?.image ? <img src={discussion.author.image} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center text-xs">{discussion.author?.name?.[0] || "U"}</div>}
            <div><Link href={`/profile/${discussion.author?.id}`} className="text-sm font-medium hover:text-emerald-400 transition-colors">{discussion.author?.name || "Anonymous"}</Link><div className="text-xs text-white/40">{new Date(discussion.createdAt).toLocaleDateString()}</div></div>
          </div>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed whitespace-pre-wrap">{discussion.content}</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4"><MessageSquare className="w-5 h-5 text-emerald-400" /><h2 className="font-semibold">Comments ({discussion.comments?.length || 0})</h2></div>
          {discussion.comments?.length === 0 ? (
            <div className="text-center py-8 text-white/40 text-sm border border-white/[0.06] rounded-xl bg-white/[0.02]">No comments yet.</div>
          ) : (
            <div className="space-y-3">{discussion.comments.map((c: any) => (
              <div key={c.id} className="p-4 sm:p-5 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  {c.author?.image ? <img src={c.author.image} alt="" className="w-7 h-7 rounded-full" /> : <div className="w-7 h-7 bg-white/[0.06] rounded-full flex items-center justify-center text-xs">{c.author?.name?.[0] || "U"}</div>}
                  <div><Link href={`/profile/${c.author?.id}`} className="text-sm font-medium hover:text-emerald-400 transition-colors">{c.author?.name || "Anonymous"}</Link><div className="text-xs text-white/40">{new Date(c.createdAt).toLocaleDateString()}</div></div>
                </div>
                <p className="text-sm text-white/70 whitespace-pre-wrap">{c.content}</p>
              </div>
            ))}</div>
          )}
        </div>

        {session ? (
          <form onSubmit={handleComment} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2">Add a comment</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} required maxLength={5000}
              className="w-full px-4 py-2.5 bg-[#050505] border border-white/[0.06] rounded-lg focus:border-emerald-500/50 focus:outline-none text-sm mb-3" placeholder="Share your thoughts..." />
            <button type="submit" disabled={submitting || !comment.trim()} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-all disabled:opacity-50 shadow-lg shadow-white/10 text-sm">
              <Send className="w-4 h-4" />{submitting ? "Posting..." : "Post Comment"}</button>
          </form>
        ) : (
          <div className="text-center py-6 text-sm text-white/40 border border-white/[0.06] rounded-xl bg-white/[0.02]">
            <Link href="/signin" className="text-emerald-400 hover:underline font-medium">Sign in</Link> to join the discussion</div>
        )}
      </main>
    </div>
  );
}
