"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Users, MessageSquare, Star, AlertCircle, GitBranch, Send, Check, X, Lightbulb, ThumbsUp, Target, BrainCircuit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { GradeBadge } from "@/components/grade-badge";
import { ScoreRadar } from "@/components/score-radar";
import { TechStack } from "@/components/tech-stack";
import { useSession } from "@/lib/session";
import { FullPageLoading } from "@/components/loading-animation";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { session } = useSession();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestSent, setRequestSent] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [handlingReq, setHandlingReq] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const userId = session?.user?.id;
  const isOwner = userId && project?.ownerId === userId;
  const isMember = userId && project?.members?.some((m: any) => m.userId === userId);
  const canRequest = userId && !isOwner && !isMember;

  useEffect(() => { if (!id) return; fetchProject(); }, [id]);
  useEffect(() => { if (isOwner && project) fetchRequests(); }, [isOwner, project]);

  const fetchProject = async () => {
    try { const r = await fetch(`/api/projects/${id}`); if (!r.ok) throw new Error(); setProject(await r.json()); }
    catch { setError("Not found"); } finally { setLoading(false); }
  };
  const fetchRequests = async () => { try { const r = await fetch(`/api/projects/${id}/requests`); if (r.ok) setPendingRequests(await r.json()); } catch {} };

  const handleRequest = async () => {
    setRequestSent("sending");
    try { const r = await fetch(`/api/projects/${id}/requests`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: requestMessage }) }); if (!r.ok) { setRequestSent("error"); return; } setRequestSent("sent"); } catch { setRequestSent("error"); }
  };
  const handleAccept = async (reqId: string) => { setHandlingReq(reqId); await fetch(`/api/projects/${id}/requests/${reqId}/accept`, { method: "POST" }); await Promise.all([fetchProject(), fetchRequests()]); setHandlingReq(null); };
  const handleReject = async (reqId: string) => { setHandlingReq(reqId); await fetch(`/api/projects/${id}/requests/${reqId}/reject`, { method: "POST" }); await fetchRequests(); setHandlingReq(null); };
  const handleDelete = async () => { if (!confirm("Delete this project? This cannot be undone.")) return; setDeleting(true); try { const r = await fetch(`/api/projects/${id}`, { method: "DELETE" }); if (r.ok) router.push("/explore"); else alert("Failed to delete"); } catch { alert("Failed to delete"); } finally { setDeleting(false); } };

  if (loading) return <FullPageLoading />;
  if (error || !project) return <div className="min-h-screen bg-[#050505]"><Navbar /><div className="max-w-3xl mx-auto px-4 py-20 text-center"><AlertCircle className="w-12 h-12 text-white/10 mx-auto mb-4" /><h1 className="text-xl font-bold mb-2">{error || "Not found"}</h1><Link href="/explore" className="text-emerald-400 hover:underline text-sm">Back</Link></div></div>;

  return (
    <div className="min-h-screen bg-[#050505]"><Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link href="/explore" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white mb-6 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to explore</Link>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 sm:p-8 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0 flex-1"><h1 className="text-2xl sm:text-3xl font-bold mb-1">{project.name}</h1>{project.description && <p className="text-white/40">{project.description}</p>}</div>
            {project.overallScore != null && <GradeBadge score={project.overallScore} size="lg" />}
          </div>
          <div className="flex flex-wrap gap-3 mb-6">
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.06] rounded-lg text-sm hover:bg-white/[0.08] transition-colors"><GitBranch className="w-4 h-4" /> View on GitHub</a>
            {project.deploymentUrl && <a href={project.deploymentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.06] rounded-lg text-sm hover:bg-white/[0.08] transition-colors"><ExternalLink className="w-4 h-4" /> Live Demo</a>}
            <Link href={`/workspace/${project.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/20 transition-colors border border-emerald-500/30"><Users className="w-4 h-4" /> Workspace</Link>
            {isOwner && <button onClick={handleDelete} disabled={deleting} className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm hover:bg-red-500/20 transition-colors border border-red-500/30 ml-auto disabled:opacity-50"><Trash2 className="w-4 h-4" />{deleting ? "Deleting..." : "Delete"}</button>}
          </div>
          <div className="flex items-center gap-4 text-sm text-white/40 mb-6">
            <span className="flex items-center gap-1"><Users className="w-4 h-4" />{project.members?.length || 0} member{(project.members?.length || 0) !== 1 ? "s" : ""}</span>
            {project.overallScore != null && <span>Score: {project.overallScore}/100</span>}
          </div>
          {Array.isArray(project.techStack) && project.techStack.length > 0 && <div className="mb-6"><div className="text-xs text-white/40 uppercase tracking-wider mb-2">Tech Stack</div><TechStack techs={project.techStack} size="md" /></div>}
          {project.owner && (
            <div className="flex items-center gap-3 pt-5 border-t border-white/[0.06]">
              {project.owner.image ? <img src={project.owner.image} alt="" className="w-10 h-10 rounded-full" /> : <div className="w-10 h-10 bg-white/[0.06] rounded-full flex items-center justify-center text-sm">{project.owner.name?.[0] || "U"}</div>}
              <div><Link href={`/profile/${project.owner.id}`} className="text-sm font-medium hover:text-emerald-400 transition-colors">{project.owner.name || "Anonymous"}</Link><div className="text-xs text-white/40">Owner</div></div>
            </div>
          )}
          {/* Request to Collaborate */}
          {canRequest && requestSent !== "sent" && (
            <div className="mt-5 pt-5 border-t border-white/[0.06]">
              {requestSent === "error" && <p className="text-xs text-red-400 mb-2">Failed to send request.</p>}
              <textarea value={requestMessage} onChange={(e) => setRequestMessage(e.target.value)} placeholder="Why collaborate? (optional)" className="w-full px-3 py-2 bg-[#050505] border border-white/[0.06] rounded-lg text-sm focus:border-emerald-500/50 focus:outline-none text-white/70 placeholder:text-white/20 mb-2" rows={2} maxLength={500} />
              <button onClick={handleRequest} disabled={requestSent === "sending"} className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 shadow-lg shadow-white/10"><Send className="w-4 h-4" />Request to Collaborate</button>
            </div>
          )}
          {canRequest && requestSent === "sent" && <div className="mt-5 pt-5 border-t border-white/[0.06] flex items-center gap-2 text-emerald-400 text-sm"><Check className="w-4 h-4" /> Request sent</div>}
          {/* Owner: Pending requests */}
          {isOwner && pendingRequests.length > 0 && (
            <div className="mt-5 pt-5 border-t border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3"><Users className="w-4 h-4 text-amber-400" /><h3 className="font-semibold text-sm">Pending Requests ({pendingRequests.length})</h3></div>
              <div className="space-y-2">{pendingRequests.map((req: any) => (
                <div key={req.id} className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg border border-white/[0.06]">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {req.user.image ? <img src={req.user.image} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center text-xs">{req.user.name?.[0] || "U"}</div>}
                    <div className="min-w-0"><div className="text-sm font-medium truncate">{req.user.name || "Anonymous"}</div>{req.message && <div className="text-xs text-white/40 truncate">{req.message}</div>}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <button onClick={() => handleAccept(req.id)} disabled={handlingReq === req.id} className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50">{handlingReq === req.id ? "..." : <Check className="w-4 h-4" />}</button>
                    <button onClick={() => handleReject(req.id)} disabled={handlingReq === req.id} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"><X className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}</div>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4"><BrainCircuit className="w-5 h-5 text-emerald-400" /><h2 className="font-semibold">AI Analysis</h2></div>
            {project.overallScore != null && (
              <ScoreRadar
                overallScore={project.overallScore}
                codeQuality={project.codeQuality ?? 0}
                documentation={project.documentation ?? 0}
                bestPractices={project.bestPractices ?? 0}
                performance={project.performance ?? 0}
              />
            )}
            {project.summary && <p className="text-sm text-white/60 leading-relaxed mt-4 pt-4 border-t border-white/[0.06]">{project.summary}</p>}
          </div>
          <div className="space-y-4">
            {project.strengths && Array.isArray(project.strengths) && project.strengths.length > 0 && (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3"><ThumbsUp className="w-4 h-4 text-emerald-400" /><h3 className="font-semibold text-sm">Strengths</h3></div>
                <ul className="space-y-2">{project.strengths.map((s: string, i: number) => <li key={i} className="flex items-start gap-2 text-sm text-white/60"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />{s}</li>)}</ul>
              </div>
            )}
            {project.suggestions && Array.isArray(project.suggestions) && project.suggestions.length > 0 && (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3"><Target className="w-4 h-4 text-amber-400" /><h3 className="font-semibold text-sm">Suggestions</h3></div>
                <ul className="space-y-2">{project.suggestions.map((s: string, i: number) => <li key={i} className="flex items-start gap-2 text-sm text-white/60"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />{s}</li>)}</ul>
              </div>
            )}
          </div>
          {project.members && project.members.length > 0 && (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-3"><Users className="w-5 h-5 text-cyan-400" /><h2 className="font-semibold">Team</h2></div>
              <div className="space-y-3">{project.members.map((m: any) => (
                <div key={m.id} className="flex items-center gap-3">{m.user.image ? <img src={m.user.image} alt="" className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center text-xs">{m.user.name?.[0] || "U"}</div>}
                  <div><Link href={`/profile/${m.user.id}`} className="text-sm font-medium hover:text-emerald-400 transition-colors">{m.user.name || "Anonymous"}</Link><div className="text-xs text-white/40 capitalize">{m.role}</div></div></div>
              ))}</div>
            </div>
          )}
        </div>
        {project.discussions?.length > 0 && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4"><MessageSquare className="w-5 h-5 text-emerald-400" /><h2 className="font-semibold">Discussions</h2></div>
            <div className="space-y-3">{project.discussions.map((d: any) => (
              <Link key={d.id} href={`/forum/${d.id}`} className="flex items-center justify-between p-3 bg-white/[0.06]/30 rounded-lg hover:bg-white/[0.06]/50 transition-colors">
                <span className="font-medium text-sm">{d.title}</span><span className="text-xs text-white/40">{d._count?.comments || 0} comments</span></Link>
            ))}</div>
          </div>
        )}
      </main>
    </div>
  );
}
