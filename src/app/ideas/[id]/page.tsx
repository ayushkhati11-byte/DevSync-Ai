"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, Check, ExternalLink, AlertCircle, Sparkles, X, GitBranch } from "lucide-react";
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
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [creating, setCreating] = useState(false);
  const [creatingRepo, setCreatingRepo] = useState(false);
  const [useExistingRepo, setUseExistingRepo] = useState(true);
  const [projectForm, setProjectForm] = useState({ repoUrl: "", name: "" });

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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name) return;
    setCreating(true);
    try {
      let repoUrl = projectForm.repoUrl;
      if (!useExistingRepo && projectForm.name) {
        setCreatingRepo(true);
        const createRes = await fetch("/api/github/create-repo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: projectForm.name, description: idea.vision.slice(0, 200) }),
        });
        setCreatingRepo(false);
        if (!createRes.ok) { alert((await createRes.json()).error || "Failed to create repo"); setCreating(false); return; }
        const repoData = await createRes.json();
        repoUrl = `https://github.com/${repoData.fullName}`;
      }
      if (!repoUrl) { alert("Repository URL is required"); setCreating(false); return; }
      const res = await fetch(`/api/ideas/${id}/project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectForm.name, repoUrl }),
      });
      if (!res.ok) { alert((await res.json()).error || "Failed to create project"); return; }
      const project = await res.json();
      router.push(`/workspace/${project.id}`);
    } catch { alert("Failed to create project"); }
    finally { setCreating(false); setCreatingRepo(false); }
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
          {isOwner && (
            <div className="space-y-3">
              <div className="w-full py-3 rounded-xl bg-white/[0.04] text-white/40 text-center text-sm border border-white/[0.06]">You own this idea</div>
              <button onClick={() => setShowCreateProject(true)} disabled={idea.status === "completed"}
                className="w-full py-3 rounded-xl font-medium transition-all text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />{idea.status === "completed" ? "Project Created" : "Create Project & Workspace"}
              </button>
            </div>
          )}

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

        {showCreateProject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-emerald-400" /><h2 className="text-lg font-bold">Create Project</h2></div>
                <button onClick={() => setShowCreateProject(false)} className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors"><X className="w-5 h-5 text-white/40" /></button>
              </div>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div><label className="block text-sm font-medium mb-1.5">Project Name</label>
                  <input type="text" value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} required maxLength={100}
                    className="w-full px-4 py-2.5 bg-[#050505] border border-white/[0.06] rounded-lg focus:border-emerald-500/50 focus:outline-none text-sm" placeholder={idea.title} /></div>
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <button type="button" onClick={() => setUseExistingRepo(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${useExistingRepo ? "bg-white text-black" : "bg-white/[0.06] text-white/50"}`}>Use existing</button>
                    <button type="button" onClick={() => setUseExistingRepo(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!useExistingRepo ? "bg-white text-black" : "bg-white/[0.06] text-white/50"}`}>Create new</button>
                  </div>
                  {useExistingRepo ? (
                    <div className="relative"><GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type="url" value={projectForm.repoUrl} onChange={(e) => setProjectForm({ ...projectForm, repoUrl: e.target.value })}
                        className="w-full pl-9 pr-4 py-2.5 bg-[#050505] border border-white/[0.06] rounded-lg focus:border-emerald-500/50 focus:outline-none text-sm" placeholder="https://github.com/user/repo" /></div>
                  ) : (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                      <p className="text-xs text-emerald-400">A new GitHub repository will be created under your account with the project name.</p>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-white/40">All {idea.members?.length || 0} team members will be added to the project workspace.</div>
                <button type="submit" disabled={creating} className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {creating ? <LoadingSpinner size={18} /> : <Sparkles className="w-4 h-4" />}{creatingRepo ? "Creating repo..." : creating ? "Creating..." : useExistingRepo ? "Create Project" : "Create Project & Repo"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
