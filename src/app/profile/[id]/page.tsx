"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Code2, FolderOpen, Award, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { GradeBadge } from "@/components/grade-badge";
import { TechStack } from "@/components/tech-stack";
import { EmptyState } from "@/components/empty-state";
import { ListSkeleton } from "@/components/skeleton";
import { FullPageLoading } from "@/components/loading-animation";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; setLoading(true);
    fetch("/api/projects").then((r) => r.json()).then((data) => {
      const list = Array.isArray(data) ? data : [];
      const userProjects = list.filter((p: any) => p.owner?.id === id);
      setProjects(userProjects); setUser(userProjects.length > 0 ? userProjects[0].owner : { id });
      setLoading(false);
    }).catch(() => { setError("Failed to load"); setLoading(false); });
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#050505]"><Navbar /><div className="max-w-4xl mx-auto px-4 py-12"><div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 sm:p-8 mb-8 animate-pulse"><div className="flex items-center gap-4"><div className="w-16 h-16 rounded-full bg-white/[0.06]" /><div className="space-y-2 flex-1"><div className="h-6 w-40 bg-white/[0.06] rounded" /><div className="h-4 w-24 bg-white/[0.06] rounded" /></div></div></div><ListSkeleton count={3} /></div></div>;
  if (error) return <div className="min-h-screen bg-[#050505]"><Navbar /><div className="max-w-3xl mx-auto px-4 py-20 text-center"><AlertCircle className="w-12 h-12 text-white/10 mx-auto mb-4" /><h1 className="text-xl font-bold mb-2">{error}</h1><Link href="/explore" className="text-emerald-400 hover:underline text-sm">Back</Link></div></div>;

  return (
    <div className="min-h-screen bg-[#050505]"><Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 sm:p-8 mb-8">
          <div className="flex items-start gap-4 sm:gap-6">
            {user?.image ? <img src={user.image} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-2 ring-white/[0.06]" /> :
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/[0.06] rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white/30">{user?.name?.[0] || "?"}</div>}
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold truncate">{user?.name || "Developer"}</h1>
              {user?.bio && <p className="text-white/40 text-sm mt-1">{user.bio}</p>}
              <div className="flex items-center gap-4 text-sm text-white/40 mt-3">
                <span className="flex items-center gap-1.5"><FolderOpen className="w-4 h-4" />{projects.length} project{projects.length !== 1 ? "s" : ""}</span>
                {user && <span className="flex items-center gap-1.5"><Award className="w-4 h-4" />{user.reputationPoints || 0} rep</span>}
              </div>
            </div>
          </div>
        </div>
        <h2 className="font-semibold mb-4">Projects ({projects.length})</h2>
        {projects.length === 0 ? <EmptyState icon={Code2} title="No projects yet" /> : (
          <div className="grid sm:grid-cols-2 gap-4">{projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="group p-5 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.08] transition-all block">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold group-hover:text-emerald-400 transition-colors truncate">{project.name}</h3>
                {project.overallScore != null && <GradeBadge score={project.overallScore} size="sm" />}
              </div>
              {project.description && <p className="text-sm text-white/40 line-clamp-1 mb-3">{project.description}</p>}
              {Array.isArray(project.techStack) && project.techStack.length > 0 && <TechStack techs={project.techStack} limit={3} />}
            </Link>
          ))}</div>
        )}
      </main>
    </div>
  );
}
