export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center font-extrabold text-dark-900 text-xs">
                P
              </div>
              <span className="text-lg font-bold gradient-text">Prediq</span>
            </div>
            <p className="text-sm text-slate-500">
              The Social Prediction Network
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-neon-cyan transition-colors">
              Privacy Policy
            </a>
            <span className="text-slate-700">·</span>
            <a href="#" className="text-sm text-slate-500 hover:text-neon-cyan transition-colors">
              Terms
            </a>
            <span className="text-slate-700">·</span>
            <a href="#" className="text-sm text-slate-500 hover:text-neon-cyan transition-colors">
              Contact
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-slate-600">
            © {currentYear} Prediq. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
