"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Plus, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useSession } from "@/lib/session";
import { EmptyState } from "@/components/empty-state";
import { ListSkeleton } from "@/components/skeleton";
import { useToast } from "@/components/toast";

const CATEGORIES = ["all", "general", "help", "showcase", "feedback", "collaboration"];
const meta: Record<string, string> = { general: "General", help: "Help", showcase: "Showcase", feedback: "Feedback", collaboration: "Collab" };
const colors: Record<string, string> = { general: "bg-white/[0.06] text-white/50", help: "bg-amber-500/20 text-amber-400", showcase: "bg-emerald-500/20 text-emerald-400", feedback: "bg-cyan-500/20 text-cyan-400", collaboration: "bg-purple-500/20 text-purple-400" };

export default function Forum() {
  const { session } = useSession();
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category: "general" });

  useEffect(() => { fetchDiscussions(); }, [category]);

  const fetchDiscussions = async () => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      const res = await fetch(`/api/discussions?${params.toString()}`);
      if (!res.ok) { setError("Failed to load"); return; }
      const ddata = await res.json(); setDiscussions(Array.isArray(ddata) ? ddata : []);
    } catch { setError("Failed to load"); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await fetch("/api/discussions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { toast((await res.json()).error || "Failed", "error"); return; }
      setShowForm(false); setForm({ title: "", content: "", category: "general" });
      toast("Discussion created!", "success"); fetchDiscussions();
    } catch { toast("Failed", "error"); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505]"><Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-8">
          <div><h1 className="text-2xl sm:text-4xl font-bold">Forum</h1><p className="text-white/40 mt-1">Discuss projects, share knowledge, and get help</p></div>
          {session && <button onClick={() => setShowForm(!showForm)} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-all shrink-0 shadow-lg shadow-white/10">{showForm ? <X className="w-4 h-4" /> : <Plus className="w-5 h-5" />}{showForm ? "Cancel" : "New Post"}</button>}
        </div>

        {showForm && (
          <div className="mb-6 sm:mb-8 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1.5">Title</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={300} className="w-full px-4 py-2.5 bg-[#050505] border border-white/[0.06] rounded-lg focus:border-emerald-500/50 focus:outline-none text-sm" /></div>
              <div><label className="block text-sm font-medium mb-1.5">Content</label><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={4} maxLength={10000} className="w-full px-4 py-2.5 bg-[#050505] border border-white/[0.06] rounded-lg focus:border-emerald-500/50 focus:outline-none text-sm" /></div>
              <div className="sm:w-64"><label className="block text-sm font-medium mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 bg-[#050505] border border-white/[0.06] rounded-lg focus:border-emerald-500/50 focus:outline-none text-sm">
                  {CATEGORIES.filter((c) => c !== "all").map((c) => <option key={c} value={c}>{meta[c] || c}</option>)}</select></div>
              <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-all disabled:opacity-50 shadow-lg shadow-white/10 text-sm">{submitting ? "Publishing..." : "Publish"}</button>
            </form>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((c) => <button key={c} onClick={() => setCategory(c)} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm capitalize transition-colors ${category === c ? "bg-white text-black font-semibold" : "bg-white/[0.04] text-white/40 hover:text-white border border-white/[0.06]"}`}>{c === "all" ? "All" : (meta[c] || c)}</button>)}
        </div>

        {loading ? <ListSkeleton count={5} /> : error ? <div className="flex items-center gap-2 justify-center py-16 text-red-400"><AlertCircle className="w-5 h-5" />{error}</div> : discussions.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No discussions yet" description="Start the first conversation!" action={session ? { label: "New Discussion", onClick: () => setShowForm(true) } : undefined} />
        ) : (
          <div className="space-y-2">
            {discussions.map((d) => (
              <Link key={d.id} href={`/forum/${d.id}`} className="flex items-start gap-4 p-4 sm:p-5 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.08] transition-all group">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-semibold group-hover:text-emerald-400 transition-colors truncate">{d.title}</h3>
                    <span className={`shrink-0 px-2 py-0.5 rounded text-xs ${colors[d.category] || "bg-white/[0.06] text-white/50"}`}>{meta[d.category] || d.category}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40">
                    <span>{d.author?.name || "Anonymous"}</span><span>{new Date(d.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{d._count?.comments || 0}</span>
                    {d.project && <span className="text-emerald-400">in {d.project.name}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
