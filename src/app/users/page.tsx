"use client";

import { useState, useEffect } from "react";
import { Search, User as UserIcon, FolderOpen } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { ListSkeleton } from "@/components/skeleton";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.length >= 2) {
        fetch(`/api/users?q=${encodeURIComponent(search)}`).then(r => r.json()).then(d => setUsers(d.users || [])).finally(() => setLoading(false));
      } else { setUsers([]); setLoading(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold">Find Collaborators</h1>
          <p className="text-white/40 mt-1">Connect with other developers</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or bio..." className="w-full pl-9 pr-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-lg text-sm focus:border-emerald-500/50 focus:outline-none" />
        </div>

        {loading ? <ListSkeleton count={4} /> : search.length < 2 ? (
          <div className="text-center py-12 text-white/40">Type at least 2 characters to search</div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-white/40">No users found</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {users.map((user) => (
              <Link key={user.id} href={`/profile/${user.id}`} className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.08] transition-all">
                {user.image ? <img src={user.image} alt="" className="w-12 h-12 rounded-full" /> : <div className="w-12 h-12 bg-white/[0.06] rounded-full flex items-center justify-center"><UserIcon className="w-5 h-5 text-white/30" /></div>}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{user.name || "Anonymous"}</div>
                  {user.bio && <div className="text-xs text-white/40 truncate mt-0.5">{user.bio}</div>}
                  <div className="flex items-center gap-1 text-xs text-white/30 mt-1"><FolderOpen className="w-3 h-3" />{user._count?.ownedProjects || 0} projects</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}