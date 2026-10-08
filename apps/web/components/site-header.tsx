import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-indigo-600 hover:text-indigo-700 transition">
          THOTH
        </Link>
        <nav className="flex gap-6">
          <Link href="/" className="text-slate-600 hover:text-indigo-600 transition font-semibold">
            Home
          </Link>
          <Link href="/projects" className="text-slate-600 hover:text-indigo-600 transition font-semibold">
            Projects
          </Link>
        </nav>
      </div>
    </header>
  );
}
