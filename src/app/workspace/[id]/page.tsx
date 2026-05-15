"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GitBranch, Copy, Check, ExternalLink, Users, MessageSquare, AlertCircle, X, Plus, AlertTriangle, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useSession } from "@/lib/session";
import { FullPageLoading, LoadingSpinner } from "@/components/loading-animation";

export default function Workspace() {
  const { id } = useParams<{ id: string }>();
  const { session } = useSession();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [handlingReq, setHandlingReq] = useState<string | null>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [newIssue, setNewIssue] = useState({ title: "", description: "", priority: "medium" });
  const [creatingIssue, setCreatingIssue] = useState(false);

  const userId = session?.user?.id;
  const isOwner = userId && project?.ownerId === userId;

  useEffect(() => { if (!id) return; fetchProject(); }, [id]);
  useEffect(() => { if (isOwner && project) fetchRequests(); }, [isOwner, project]);
  useEffect(() => { if (project) fetchIssues(); }, [project]);

  const fetchIssues = async () => { try { const r = await fetch(`/api/projects/${id}/issues`); if (r.ok) setIssues(await r.json()); } catch {} };
  const handleCreateIssue = async (e: React.FormEvent) => { e.preventDefault(); if (!newIssue.title) return; setCreatingIssue(true);
    try { const r = await fetch(`/api/projects/${id}/issues`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newIssue) });
      if (r.ok) { setShowIssueForm(false); setNewIssue({ title: "", description: "", priority: "medium" }); fetchIssues(); }
    } catch {} finally { setCreatingIssue(false); }
  };
  const handleStatusChange = async (issueId: string, status: string) => { await fetch(`/api/projects/${id}/issues/${issueId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); fetchIssues(); };

  const fetchProject = async () => {
    try { const r = await fetch(`/api/projects/${id}`); if (!r.ok) throw new Error(); setProject(await r.json()); }
    catch { setError("Workspace not found"); } finally { setLoading(false); }
  };
  const fetchRequests = async () => { try { const r = await fetch(`/api/projects/${id}/requests`); if (r.ok) setPendingRequests(await r.json()); } catch {} };
  const handleAccept = async (reqId: string) => { setHandlingReq(reqId); await fetch(`/api/projects/${id}/requests/${reqId}/accept`, { method: "POST" }); await Promise.all([fetchProject(), fetchRequests()]); setHandlingReq(null); };
  const handleReject = async (reqId: string) => { setHandlingReq(reqId); await fetch(`/api/projects/${id}/requests/${reqId}/reject`, { method: "POST" }); await fetchRequests(); setHandlingReq(null); };

  if (loading) return <FullPageLoading />;
  if (error || !project) return <div className="min-h-screen bg-[#050505]"><Navbar /><div className="max-w-3xl mx-auto px-4 py-20 text-center"><AlertCircle className="w-12 h-12 text-white/10 mx-auto mb-4" /><h1 className="text-xl font-bold mb-2">{error || "Not found"}</h1><Link href="/dashboard" className="text-emerald-400 hover:underline text-sm">Back</Link></div></div>;

  return (
    <div className="min-h-screen bg-[#050505]"><Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <div><h1 className="text-2xl sm:text-3xl font-bold">{project.name} <span className="text-sm text-white/40 font-normal">Workspace</span></h1><p className="text-white/40 text-sm mt-1">Command center for your team</p></div>
          <a href={project.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/[0.06] rounded-lg text-sm hover:bg-white/[0.08] transition-colors border border-white/[0.08] self-start"><ExternalLink className="w-4 h-4" /> GitHub</a>
        </div>

        {isOwner && pendingRequests.filter(r => r.status === "pending").length > 0 && (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 sm:p-5 mb-6">
            <div className="flex items-center gap-2 mb-3"><Users className="w-4 h-4 text-amber-400" /><h2 className="font-semibold text-sm">Pending Requests ({pendingRequests.filter(r => r.status === "pending").length})</h2></div>
            <div className="space-y-2">{pendingRequests.filter(r => r.status === "pending").map((req: any) => (
              <div key={req.id} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg border border-white/[0.06]">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {req.user?.image ? <img src={req.user.image} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center text-xs">{req.user?.name?.[0] || "U"}</div>}
                  <div className="min-w-0"><div className="text-sm font-medium truncate">{req.user?.name || "Anonymous"}</div>{req.message && <div className="text-xs text-white/40 truncate">{req.message}</div>}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button onClick={() => handleAccept(req.id)} disabled={handlingReq === req.id} className="px-3 py-1.5 bg-emerald-500 text-black text-xs font-semibold rounded-lg hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center gap-1">{handlingReq === req.id ? "..." : <><Check className="w-3 h-3" />Accept</>}</button>
                  <button onClick={() => handleReject(req.id)} disabled={handlingReq === req.id} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"><X className="w-4 h-4" /></button>
                </div>
              </div>
            ))}</div>
          </div>
)}

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-400" /><h2 className="font-semibold">Tasks & Issues</h2>
              <span className="text-xs text-white/40">({issues.length})</span></div>
            <button onClick={() => setShowIssueForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black rounded-lg text-xs font-semibold hover:bg-white/90 transition-all">
              <Plus className="w-3.5 h-3.5" /> Add</button>
          </div>
          
          {showIssueForm && (
            <form onSubmit={handleCreateIssue} className="mb-4 p-4 bg-white/[0.04] rounded-lg border border-white/[0.06]">
              <input type="text" value={newIssue.title} onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })} placeholder="Issue title" required maxLength={200}
                className="w-full px-3 py-2 bg-[#050505] border border-white/[0.06] rounded-lg text-sm mb-2" />
              <textarea value={newIssue.description} onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })} placeholder="Description (optional)" rows={2}
                className="w-full px-3 py-2 bg-[#050505] border border-white/[0.06] rounded-lg text-sm mb-2" />
              <div className="flex items-center gap-2 mb-2">
                <select value={newIssue.priority} onChange={(e) => setNewIssue({ ...newIssue, priority: e.target.value })}
                  className="px-2 py-1 bg-[#050505] border border-white/[0.06] rounded text-xs">
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={creatingIssue} className="px-3 py-1.5 bg-white text-black rounded-lg text-xs font-semibold disabled:opacity-50">{creatingIssue ? "Creating..." : "Create"}</button>
                <button type="button" onClick={() => setShowIssueForm(false)} className="px-3 py-1.5 text-white/40 hover:text-white text-xs">Cancel</button>
              </div>
            </form>
          )}

          {issues.length === 0 ? <p className="text-sm text-white/40">No issues yet</p> : (
            <div className="space-y-2">{issues.map((issue) => (
              <div key={issue.id} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg">
                <button onClick={() => handleStatusChange(issue.id, issue.status === "resolved" ? "open" : "resolved")} className="shrink-0">
                  {issue.status === "resolved" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5 text-white/30" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm ${issue.status === "resolved" ? "text-white/40 line-through" : ""}`}>{issue.title}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-1.5 py-0.5 rounded ${issue.priority === "urgent" ? "bg-red-500/20 text-red-400" : issue.priority === "high" ? "bg-orange-500/20 text-orange-400" : issue.priority === "medium" ? "bg-amber-500/20 text-amber-400" : "bg-white/[0.06] text-white/40"}`}>{issue.priority}</span>
                  </div>
                </div>
              </div>
            ))}</div>
          )}
        </div>
      </main>
    </div>
  );
}
