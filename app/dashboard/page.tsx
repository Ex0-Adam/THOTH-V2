'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  totalProducts: number;
  totalProjects: number;
  totalStaff: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalProducts: 0, totalProjects: 0, totalStaff: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, projectsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/projects'),
        ]);

        const products = productsRes.ok ? await productsRes.json() : [];
        const projects = projectsRes.ok ? await projectsRes.json() : [];

        setStats({
          totalProducts: Array.isArray(products) ? products.length : 0,
          totalProjects: Array.isArray(projects) ? projects.length : 0,
          totalStaff: 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black text-indigo-600 hover:text-indigo-700 transition">
            Micro CMS
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-slate-600 hover:text-indigo-600 transition font-semibold">Home</Link>
            <Link href="/products" className="text-slate-600 hover:text-indigo-600 transition font-semibold">Products</Link>
            <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 transition font-semibold font-bold">Dashboard</Link>
            <Link href="/login" className="text-slate-600 hover:text-indigo-600 transition font-semibold">Admin</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="px-6 py-16 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-slate-200">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-5xl font-black text-slate-900 mb-4">Dashboard</h1>
          <p className="text-xl text-slate-600">
            Overview of your content and platform statistics.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Products Stat */}
            <div className="rounded-xl border-2 border-slate-200 bg-white p-8 text-center hover:border-indigo-600 hover:shadow-lg transition">
              <div className="text-5xl font-black text-indigo-600 mb-2">
                {loading ? '...' : stats.totalProducts}
              </div>
              <p className="text-slate-900 font-bold text-lg">Products</p>
              <p className="text-slate-600 text-sm mt-1">Total in catalog</p>
            </div>

            {/* Projects Stat */}
            <div className="rounded-xl border-2 border-slate-200 bg-white p-8 text-center hover:border-indigo-600 hover:shadow-lg transition">
              <div className="text-5xl font-black text-indigo-600 mb-2">
                {loading ? '...' : stats.totalProjects}
              </div>
              <p className="text-slate-900 font-bold text-lg">Projects</p>
              <p className="text-slate-600 text-sm mt-1">Completed works</p>
            </div>

            {/* Team Stat */}
            <div className="rounded-xl border-2 border-slate-200 bg-white p-8 text-center hover:border-indigo-600 hover:shadow-lg transition">
              <div className="text-5xl font-black text-indigo-600 mb-2">
                {loading ? '...' : stats.totalStaff}
              </div>
              <p className="text-slate-900 font-bold text-lg">Team Members</p>
              <p className="text-slate-600 text-sm mt-1">On staff</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border-2 border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/products"
                className="rounded-lg border-2 border-slate-200 bg-white px-6 py-4 hover:border-indigo-600 hover:bg-indigo-50 transition flex items-center justify-between group"
              >
                <span className="text-slate-900 font-semibold">Browse Products</span>
                <span className="text-slate-600 group-hover:text-indigo-600 transition text-lg">→</span>
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-indigo-600 px-6 py-4 hover:bg-indigo-700 transition text-white font-semibold flex items-center justify-between"
              >
                <span>Go to Admin Panel</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Info Cards */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-8">
              <h3 className="font-black text-slate-900 mb-3 text-lg">📊 About the Dashboard</h3>
              <p className="text-slate-700">
                This dashboard shows real-time statistics from your content management system. All data is synced from the admin panel.
              </p>
            </div>
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-8">
              <h3 className="font-black text-slate-900 mb-3 text-lg">🔐 Admin Access</h3>
              <p className="text-slate-700">
                To create or modify products, projects, and content, please log in to the secure admin panel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 px-6 py-8 mt-12">
        <div className="mx-auto max-w-6xl text-center text-slate-400">
          <p>Powered by Micro Headless CMS — API-First Content Platform</p>
        </div>
      </footer>
    </main>
  );
}
