"use client";

import { useSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, FolderOpen, Lightbulb, MessageSquare, ArrowRight, ExternalLink, Activity } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { GradeBadge } from "@/components/grade-badge";
import { TechStack } from "@/components/tech-stack";
import { CardSkeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/empty-state";
import { TourProvider } from "@/components/tour";
import { FullPageLoading } from "@/components/loading-animation";
import { LottieAnimation } from "@/components/lottie-animation";

export default function Dashboard() {
  const { session, loading: sessionLoading } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!sessionLoading && !session) router.replace("/signin");
  }, [session, sessionLoading, router]);

  useEffect(() => {
    if (!session) return;
    Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/ideas").then((r) => r.json()),
      fetch("/api/projects/requests/pending").then((r) => r.json()).catch(() => ({ count: 0 })),
    ]).then(([p, i, r]) => {
      setProjects(Array.isArray(p.projects) ? p.projects : Array.isArray(p) ? p : []);
      setIdeas(Array.isArray(i.ideas) ? i.ideas : Array.isArray(i) ? i : []);
      setPendingRequests(r?.count || 0);
    }).catch(() => {}).finally(() => setLoadingData(false));
  }, [session]);

  if (sessionLoading) return <FullPageLoading />;
  if (!session) return null;

  const yourProjects = projects.filter((p: any) => p.owner?.id === session.user?.id);
  const yourIdeas = ideas.filter((i: any) => i.owner?.id === session.user?.id);
  const showTour = !loadingData && yourProjects.length === 0;

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      <TourProvider show={showTour}>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {session.user?.name || "Developer"}</h1>
            <p className="text-white/40 mt-1">Manage your projects and collaborations</p>
          </div>
          <div className="hidden sm:block w-28 h-28 opacity-60">
            <LottieAnimation src="/animations/lottie-lego.json" className="w-full h-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <Link href="/projects/new" data-tour="add-project"
            className="p-4 sm:p-5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15 transition-colors block">
            <Plus className="w-6 h-6 sm:w-7 sm:h-7 mb-2.5 text-emerald-400" />
            <div className="font-semibold text-sm sm:text-base">Add Project</div>
            <div className="text-xs sm:text-sm text-white/40">Import from GitHub</div>
          </Link>
          <div className="p-4 sm:p-5 rounded-xl border bg-white/[0.03] border-white/[0.06] relative">
            {pendingRequests > 0 && (
              <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-amber-500 text-black text-[10px] font-bold rounded-full">{pendingRequests}</span>
            )}
            <FolderOpen className="w-6 h-6 sm:w-7 sm:h-7 mb-2.5 text-white/50" />
            <div className="font-semibold text-sm sm:text-base">Your Projects</div>
            <div className="text-xs sm:text-sm text-white/40">
              {pendingRequests > 0 ? `${yourProjects.length} project${yourProjects.length !== 1 ? "s" : ""} \u00B7 ${pendingRequests} pending` : `${yourProjects.length} project${yourProjects.length !== 1 ? "s" : ""}`}
            </div>
          </div>
          <Link href="/ideas" data-tour="ideas-link"
            className="p-4 sm:p-5 rounded-xl border bg-white/[0.03] border-white/[0.06] hover:border-white/[0.08] transition-colors block">
            <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 mb-2.5 text-white/50" />
            <div className="font-semibold text-sm sm:text-base">Your Ideas</div>
            <div className="text-xs sm:text-sm text-white/40">{yourIdeas.length} idea{yourIdeas.length !== 1 ? "s" : ""}</div>
          </Link>
          <Link href="/forum" data-tour="forum-link"
            className="p-4 sm:p-5 rounded-xl border bg-white/[0.03] border-white/[0.06] hover:border-white/[0.08] transition-colors block">
            <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 mb-2.5 text-white/50" />
            <div className="font-semibold text-sm sm:text-base">Forum</div>
            <div className="text-xs sm:text-sm text-white/40">Join discussions</div>
          </Link>
          <Link href="/activity"
            className="p-4 sm:p-5 rounded-xl border bg-white/[0.03] border-white/[0.06] hover:border-white/[0.08] transition-colors block">
            <Activity className="w-6 h-6 sm:w-7 sm:h-7 mb-2.5 text-white/50" />
            <div className="font-semibold text-sm sm:text-base">Activity</div>
            <div className="text-xs sm:text-sm text-white/40">Recent updates</div>
          </Link>
        </div>

        {loadingData ? (
          <div className="space-y-3"><CardSkeleton /><CardSkeleton /></div>
        ) : yourProjects.length === 0 ? (
          <EmptyState icon={FolderOpen} title="No projects yet" lottie="/animations/empty-box.json"
            description="Import your first project from GitHub to get an AI-powered audit."
            action={{ label: "Import Project", onClick: () => router.push("/projects/new") }} />
        ) : (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Your Projects</h2>
              <Link href="/explore" className="text-sm text-emerald-400 hover:underline flex items-center gap-1">All projects <ArrowRight className="w-3.5 h-3.5" /></Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {yourProjects.map((project: any) => (
                <div key={project.id} className="group p-4 sm:p-5 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.08] transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1 mr-3">
                      <Link href={`/projects/${project.id}`} className="font-semibold hover:text-emerald-400 transition-colors truncate block">{project.name}</Link>
                      {project.description && <p className="text-sm text-white/40 truncate mt-0.5">{project.description}</p>}
                    </div>
                    {project.overallScore != null && <GradeBadge score={project.overallScore} size="sm" />}
                  </div>
                  {Array.isArray(project.techStack) && project.techStack.length > 0 && <div className="mb-3"><TechStack techs={project.techStack} limit={3} /></div>}
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <Link href={`/workspace/${project.id}`} className="flex items-center gap-1 hover:text-emerald-400 transition-colors"><ExternalLink className="w-3 h-3" /> Workspace</Link>
                    <div className="flex items-center gap-3">
                      {project.overallScore != null && <span>Score: {project.overallScore}/100</span>}
                      <span>{project._count?.members || 0} member{(project._count?.members || 0) !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      </TourProvider>
    </div>
  );
}
