export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            Powered by Microtronic{" "}
            <a
              href="https://microtronic.biz/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition"
            >
              © 2026 Microtronic Co., Ltd.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
