"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { GitBranch, Copy, Check, ExternalLink, Users, MessageSquare, AlertCircle, X } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useSession } from "@/lib/session";
import { FullPageLoading } from "@/components/loading-animation";

export default function Workspace() {
  const { id } = useParams<{ id: string }>();
  const { session } = useSession();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [handlingReq, setHandlingReq] = useState<string | null>(null);

  const userId = session?.user?.id;
  const isOwner = userId && project?.ownerId === userId;

  useEffect(() => { if (!id) return; fetchProject(); }, [id]);
  useEffect(() => { if (isOwner && project) fetchRequests(); }, [isOwner, project]);

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

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4"><GitBranch className="w-5 h-5 text-emerald-400" /><h2 className="font-semibold">Clone Repository</h2></div>
          <div className="flex items-center gap-2 bg-[#050505] border border-white/[0.06] rounded-lg p-3 mb-4">
            <code className="flex-1 text-sm text-white/70 truncate">{project.repoUrl}</code>
            <button onClick={() => { navigator.clipboard.writeText(project.repoUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex items-center gap-1 px-3 py-1.5 bg-white/[0.06] rounded-md text-xs hover:bg-white/[0.08] transition-colors shrink-0">{copied ? <><Check className="w-3 h-3 text-emerald-400" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}</button>
          </div>
          <div className="text-sm text-white/40"><p className="mb-2 font-medium text-white/50">Quick start:</p>
            <pre className="bg-[#050505] border border-white/[0.06] rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-white/70 overflow-x-auto"><code>{`git clone ${project.repoUrl}\ncd ${project.name}\nnpm install\nnpm run dev`}</code></pre></div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4"><Users className="w-5 h-5 text-cyan-400" /><h2 className="font-semibold">Team ({project.members?.length || 0})</h2></div>
            {project.members?.length > 0 ? (
              <div className="space-y-3">{project.members.map((m: any) => (
                <div key={m.id} className="flex items-center gap-3">{m.user?.image ? <img src={m.user.image} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center text-xs">{m.user?.name?.[0] || "U"}</div>}
                  <div><Link href={`/profile/${m.user?.id}`} className="text-sm font-medium hover:text-emerald-400 transition-colors">{m.user?.name || "Anonymous"}</Link><div className="text-xs text-white/40 capitalize">{m.role}</div></div></div>
              ))}</div>
            ) : <p className="text-sm text-white/40">No team members</p>}
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4"><GitBranch className="w-5 h-5 text-emerald-400" /><h2 className="font-semibold">Quick Links</h2></div>
            <div className="space-y-2">
              {[{ href: `/projects/${project.id}`, label: "Project Details", sub: "View AI audit and README", icon: ExternalLink }, { href: `/forum?projectId=${project.id}`, label: "Discussions", sub: "Team chat and feedback", icon: MessageSquare }].map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center gap-3 p-3 bg-white/[0.06]/30 rounded-lg hover:bg-white/[0.06]/50 transition-colors">
                  <link.icon className="w-4 h-4 text-white/40 shrink-0" /><div className="min-w-0 flex-1"><div className="text-sm font-medium">{link.label}</div><div className="text-xs text-white/40">{link.sub}</div></div></Link>
              ))}
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-white/[0.06]/30 rounded-lg hover:bg-white/[0.06]/50 transition-colors">
                <GitBranch className="w-4 h-4 text-white/40 shrink-0" /><div className="min-w-0 flex-1"><div className="text-sm font-medium">GitHub Repository</div><div className="text-xs text-white/40">Issues, PRs, and code</div></div></a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
