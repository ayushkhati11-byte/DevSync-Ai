"use client";

import { useState, useEffect, useTransition } from "react";
import { Search, LayoutGrid, List, Users, Star } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { GradeBadge } from "@/components/grade-badge";
import { TechStack } from "@/components/tech-stack";
import { EmptyState } from "@/components/empty-state";
import { ListSkeleton } from "@/components/skeleton";

const SCORE_RANGES = [
  { label: "All", min: 0, max: 100 },
  { label: "90+", min: 90, max: 100 },
  { label: "80+", min: 80, max: 89 },
  { label: "70+", min: 70, max: 79 },
  { label: "60+", min: 60, max: 69 },
  { label: "< 60", min: 0, max: 59 },
];

export default function Explore() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [scoreRange, setScoreRange] = useState("All");
  const [techFilter, setTechFilter] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [, startTransition] = useTransition();

  useEffect(() => { fetchProjects(); }, [scoreRange, techFilter]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const range = SCORE_RANGES.find((r) => r.label === scoreRange);
      if (range && scoreRange !== "All") params.set("minScore", String(range.min));
      if (techFilter) params.set("tech", techFilter);
      const res = await fetch(`/api/projects?${params.toString()}`);
      const pdata = await res.json(); setProjects(Array.isArray(pdata) ? pdata : []);
    } catch { setProjects([]); }
    finally { setLoading(false); }
  };

  const filtered = projects.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold">Explore Projects</h1>
          <p className="text-white/40 mt-1">Discover student-built projects and their AI-powered audits</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="text" value={search} onChange={(e) => startTransition(() => setSearch(e.target.value))}
              placeholder="Search projects..." className="w-full pl-9 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-sm focus:border-emerald-500/50 focus:outline-none" />
          </div>
          <select value={scoreRange} onChange={(e) => setScoreRange(e.target.value)}
            className="px-3 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-sm focus:border-emerald-500/50 focus:outline-none appearance-none">
            {SCORE_RANGES.map((r) => <option key={r.label} value={r.label}>{r.label === "All" ? "All Scores" : r.label}</option>)}
          </select>
          <input type="text" value={techFilter} onChange={(e) => startTransition(() => setTechFilter(e.target.value))}
            placeholder="Filter tech..." className="w-28 sm:w-36 px-3 py-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-sm focus:border-emerald-500/50 focus:outline-none" />
          <div className="flex bg-white/[0.04] border border-white/[0.06] rounded-lg overflow-hidden">
            <button onClick={() => setView("grid")} className={`p-2.5 ${view === "grid" ? "bg-white/[0.06] text-white" : "text-white/40"}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setView("list")} className={`p-2.5 ${view === "list" ? "bg-white/[0.06] text-white" : "text-white/40"}`}><List className="w-4 h-4" /></button>
          </div>
        </div>

        {loading ? <ListSkeleton count={6} /> : filtered.length === 0 ? (
          <EmptyState icon={Search} title="No projects found" description={projects.length === 0 ? "No projects imported yet." : "Try adjusting filters."} />
        ) : view === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="group p-5 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.08] transition-all block">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold group-hover:text-emerald-400 transition-colors truncate">{project.name}</h3>
                  {project.overallScore != null && <GradeBadge score={project.overallScore} size="sm" />}
                </div>
                {project.description && <p className="text-sm text-white/40 line-clamp-2 mb-3">{project.description}</p>}
                {Array.isArray(project.techStack) && project.techStack.length > 0 && <div className="mb-3"><TechStack techs={project.techStack} limit={4} /></div>}
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{project._count?.members || 0}</span>
                  {project.overallScore != null && <span>Score: {project.overallScore}/100</span>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.08] transition-all group">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold group-hover:text-emerald-400 transition-colors truncate">{project.name}</h3>
                    {Array.isArray(project.techStack) && project.techStack.length > 0 && <span className="text-xs text-white/40 truncate hidden sm:inline">{project.techStack.join(", ")}</span>}
                  </div>
                  {project.description && <p className="text-sm text-white/40 truncate mt-0.5">{project.description}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {project.overallScore != null && <span className="text-xs text-white/40 hidden sm:inline">{project.overallScore}/100</span>}
                  {project.overallScore != null && <GradeBadge score={project.overallScore} size="sm" />}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
