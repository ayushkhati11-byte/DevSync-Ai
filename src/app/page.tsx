"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Shield, GitBranch, Palette, Globe, Star, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

const features = [
  { icon: Zap, title: "AI Code Audits", desc: "Get a real grade (A+ through F), complexity score, and actionable suggestions.", gradient: "from-emerald-400 to-cyan-400" },
  { icon: GitBranch, title: "One-Click Import", desc: "Pick any repo and we pull README, topics, and stats instantly.", gradient: "from-cyan-400 to-sky-400" },
  { icon: Palette, title: "Idea Hub", desc: "Post a project vision, find teammates, auto-create repos.", gradient: "from-purple-400 to-pink-400" },
  { icon: Globe, title: "Community Forum", desc: "Discuss projects, ask for help, share feedback.", gradient: "from-amber-400 to-orange-400" },
  { icon: Shield, title: "Smart Fallbacks", desc: "AI down? We pull language, topics, and stats from GitHub.", gradient: "from-emerald-400 to-teal-400" },
  { icon: Star, title: "Team Workspace", desc: "Command center with clone URLs, setup scripts, and quick links.", gradient: "from-rose-400 to-red-400" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      <section className="relative px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto pt-20 sm:pt-32 pb-16 sm:pb-24 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-white/50">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> AI-Powered Code Audits
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1]">
            Build, <span className="text-gradient">Audit</span>, <span className="text-gradient">Collaborate</span><br />
            <span className="text-white/30">All in one place</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-white/40 max-w-xl mx-auto mb-10 leading-relaxed">
            The platform for student developers to showcase projects, get AI-powered code reviews, and find teammates.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/explore"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg shadow-white/10">
              Explore Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/ideas"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.04] border border-white/[0.08] text-white/70 font-medium rounded-xl hover:bg-white/[0.06] hover:text-white transition-all">
              Post an Idea
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-16 sm:py-24 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-black mb-3">Why DevSync?</h2>
            <p className="text-white/40 max-w-lg mx-auto">Everything you need to build, showcase, and grow as a developer.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="group relative p-5 sm:p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-3 shadow-lg`}>
                  <f.icon className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-sm font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-16 sm:py-24 border-t border-white/[0.06] bg-gradient-to-b from-transparent to-emerald-500/[0.02]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-4xl font-black mb-3">Ready to build?</h2>
            <p className="text-white/40 mb-8">Join the community and start showcasing your work.</p>
            <Link href="/signin"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg shadow-white/10">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="px-4 sm:px-6 py-6 border-t border-white/[0.06] text-center text-sm text-white/20">
        <p>&copy; 2026 DevSync AI. Built for student developers.</p>
      </footer>
    </div>
  );
}
