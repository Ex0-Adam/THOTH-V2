import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="px-6 py-32 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-600 mb-4">Premium CMS Platform</p>
          <h1 className="text-6xl font-black tracking-tight text-slate-900 mb-6">
            Discover Our Content
          </h1>
          <p className="text-xl text-slate-800 mb-8 leading-relaxed">
            Explore projects and content managed through our intelligent, headless CMS platform. Built for modern businesses.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/projects" className="rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl transition transform hover:scale-105">
              Browse Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-black text-center text-slate-900 mb-4">Why Choose Us</h2>
          <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">Everything you need to manage and distribute content across multiple platforms</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-8 hover:border-indigo-600 hover:bg-indigo-50 transition">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Content Management</h3>
              <p className="text-slate-600 leading-relaxed">Manage projects and all your content in one centralized dashboard</p>
            </div>

            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-8 hover:border-indigo-600 hover:bg-indigo-50 transition">
              <div className="text-4xl mb-4">🔌</div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Rest API</h3>
              <p className="text-slate-600 leading-relaxed">Access all content through powerful REST APIs for any frontend or application</p>
            </div>

            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-8 hover:border-indigo-600 hover:bg-indigo-50 transition">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Scalable &amp; Fast</h3>
              <p className="text-slate-600 leading-relaxed">Deploy anywhere - Vercel, Docker, VPS, or self-hosted with zero hassle</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Modules Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-indigo-600 to-blue-600">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-black text-white text-center mb-4">Core Features</h2>
          <p className="text-center text-indigo-100 mb-16 max-w-2xl mx-auto">Built-in modules for every content management need</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🎨", title: "Design System", desc: "Customize colors, fonts, and layout" },
              { icon: "👥", title: "Team Management", desc: "Manage staff and portfolio links" },
              { icon: "📄", title: "Pages & Content", desc: "Create dynamic pages and content" },
              { icon: "🗂️", title: "Categories", desc: "Organize content hierarchically" },
              { icon: "📱", title: "Media Library", desc: "Upload and manage all assets" },
              { icon: "🔗", title: "Navigation", desc: "Build dynamic menu systems" },
            ].map((feature) => (
              <div key={feature.title} className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 hover:bg-white/20 transition">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                <p className="text-indigo-100 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Ready to Explore?</h2>
          <p className="text-lg text-slate-600 mb-8">Browse the portfolio of projects managed through THOTH</p>
          <div className="flex gap-4 justify-center">
            <Link href="/projects" className="rounded-xl bg-indigo-600 px-8 py-4 font-bold text-white hover:bg-indigo-700 shadow-lg transition">
              Browse Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
