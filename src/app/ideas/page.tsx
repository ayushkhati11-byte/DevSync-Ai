"use client";

import { useState, useEffect } from "react";
import { Lightbulb, Users, Plus, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useSession } from "@/lib/session";
import { EmptyState } from "@/components/empty-state";
import { ListSkeleton } from "@/components/skeleton";
import { useToast } from "@/components/toast";
import { LoadingSpinner, FullPageLoading } from "@/components/loading-animation";

const STATUSES = ["all", "open", "in-progress", "completed"];

export default function Ideas() {
  const { session } = useSession();
  const { toast } = useToast();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", vision: "", requiredRoles: "", maxMembers: 4 });

  useEffect(() => { fetchIdeas(); }, [statusFilter]);

  const fetchIdeas = async () => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/ideas?${params.toString()}`);
      if (!res.ok) { setError("Failed to load ideas"); return; }
      const idata = await res.json(); setIdeas(Array.isArray(idata) ? idata : []);
    } catch { setError("Failed to load ideas"); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const res = await fetch("/api/ideas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        title: form.title, vision: form.vision,
        requiredRoles: form.requiredRoles.split(",").map((s) => s.trim()).filter(Boolean),
        maxMembers: form.maxMembers,
      }) });
      if (!res.ok) { toast((await res.json()).error || "Failed to create idea", "error"); return; }
      setShowForm(false); setForm({ title: "", vision: "", requiredRoles: "", maxMembers: 4 });
      toast("Idea posted!", "success"); fetchIdeas();
    } catch { toast("Failed to create idea", "error"); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold">Idea Hub</h1>
            <p className="text-white/40 mt-1">Find teammates or post your own project idea</p>
          </div>
          {session && <button onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-all shrink-0 shadow-lg shadow-white/10">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-5 h-5" />} {showForm ? "Cancel" : "Post Idea"}
          </button>}
        </div>

        {showForm && (
          <div className="mb-6 sm:mb-8 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1.5">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={200}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-white/[0.06] rounded-lg focus:border-emerald-500/50 focus:outline-none text-sm" placeholder="e.g., AI Study Buddy App" /></div>
              <div><label className="block text-sm font-medium mb-1.5">Vision</label>
                <textarea value={form.vision} onChange={(e) => setForm({ ...form, vision: e.target.value })} required rows={3} maxLength={5000}
                  className="w-full px-4 py-2.5 bg-[#050505] border border-white/[0.06] rounded-lg focus:border-emerald-500/50 focus:outline-none text-sm" /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1.5">Required Roles</label>
                  <input type="text" value={form.requiredRoles} onChange={(e) => setForm({ ...form, requiredRoles: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#050505] border border-white/[0.06] rounded-lg focus:border-emerald-500/50 focus:outline-none text-sm" placeholder="Frontend, Backend, Designer" /></div>
                <div><label className="block text-sm font-medium mb-1.5">Max Team Size</label>
                  <input type="number" value={form.maxMembers} onChange={(e) => setForm({ ...form, maxMembers: parseInt(e.target.value) || 4 })} min={2} max={10}
                    className="w-full px-4 py-2.5 bg-[#050505] border border-white/[0.06] rounded-lg focus:border-emerald-500/50 focus:outline-none text-sm" /></div>
              </div>
              <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-all disabled:opacity-50 shadow-lg shadow-white/10 text-sm">
                {submitting ? "Publishing..." : "Publish Idea"}</button>
            </form>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm capitalize transition-colors ${statusFilter === s ? "bg-white text-black font-semibold" : "bg-white/[0.04] text-white/40 hover:text-white border border-white/[0.06]"}`}>
              {s === "all" ? "All" : s}</button>
          ))}
        </div>

        {loading ? <ListSkeleton count={4} /> : error ? (
          <div className="flex items-center gap-2 justify-center py-16 text-red-400"><AlertCircle className="w-5 h-5" />{error}</div>
        ) : ideas.length === 0 ? (
          <EmptyState icon={Lightbulb} title="No ideas yet" description={session ? "Be the first to post an idea!" : "Sign in to post an idea."} />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {ideas.map((idea) => (
              <Link key={idea.id} href={`/ideas/${idea.id}`} className="group p-5 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.08] transition-all block">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold group-hover:text-emerald-400 transition-colors">{idea.title}</h3>
                  <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${idea.status === "open" ? "bg-emerald-500/20 text-emerald-400" : idea.status === "in-progress" ? "bg-cyan-500/20 text-cyan-400" : "bg-white/[0.06] text-white/40"}`}>{idea.status}</span>
                </div>
                <p className="text-sm text-white/40 line-clamp-2 mb-4">{idea.vision}</p>
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{idea._count?.members || 0}/{idea.maxMembers}</span>
                  {Array.isArray(idea.requiredRoles) && idea.requiredRoles.length > 0 && <span className="truncate">Looking for: {idea.requiredRoles.join(", ")}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
