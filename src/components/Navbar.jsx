import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'ProofCam', href: '#proofcam' },
  { label: 'Leaderboards', href: '#leaderboard' },
  { label: 'Communities', href: '#communities' },
];

export default function Navbar({ user, balance, openModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-dark-900/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 group">
              <img
                src={logo}
                alt="Prediq Logo"
                className="w-8 h-8 rounded-lg object-contain transition-transform duration-300 group-hover:scale-105 shadow-md shadow-emerald-500/20"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent">Prediq</span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm text-slate-400 hover:text-neon-cyan transition-colors duration-200 font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              {user?.loggedIn ? (
                <>
                  <div className="flex items-center gap-2 bg-dark-800/80 px-3.5 py-1.5 rounded-full border border-emerald-500/20 shadow-inner">
                    <span className="text-xs font-semibold text-emerald-400">@{user.username}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-dark-800/80 px-3.5 py-1.5 rounded-full border border-yellow-500/20 shadow-inner">
                    <span className="text-sm">🪙</span>
                    <span className="text-sm font-bold text-yellow-400">{balance.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={openModal}
                    className="btn-primary text-sm px-5 py-2 inline-block font-semibold"
                  >
                    🔮 New Predict
                  </button>
                </>
              ) : (
                <a
                  href="#waitlist"
                  onClick={(e) => handleNavClick(e, '#waitlist')}
                  className="btn-primary text-sm px-5 py-2.5 inline-block"
                >
                  Join Beta
                </a>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5">
                <span
                  className={`block w-6 h-0.5 bg-slate-300 transition-all duration-300 ${
                    mobileOpen ? 'rotate-45 translate-y-2' : ''
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-slate-300 transition-all duration-300 ${
                    mobileOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-slate-300 transition-all duration-300 ${
                    mobileOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileOpen ? 'open' : ''}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-2xl font-semibold text-slate-300 hover:text-neon-cyan transition-colors"
            >
              {link.label}
            </a>
          ))}
          {user?.loggedIn ? (
            <div className="flex flex-col items-center gap-4 mt-4">
              <div className="flex items-center gap-2 bg-dark-800/80 px-4 py-2 rounded-full border border-emerald-500/20 shadow-inner">
                <span className="text-sm font-semibold text-emerald-400">@{user.username}</span>
              </div>
              <div className="flex items-center gap-2 bg-dark-800/80 px-4 py-2 rounded-full border border-yellow-500/20 shadow-inner">
                <span className="text-base">🪙</span>
                <span className="text-base font-bold text-yellow-400">{balance.toLocaleString()} PCOIN</span>
              </div>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openModal();
                }}
                className="btn-primary text-lg px-8 py-3 mt-2 inline-block"
              >
                🔮 New Predict
              </button>
            </div>
          ) : (
            <a
              href="#waitlist"
              onClick={(e) => handleNavClick(e, '#waitlist')}
              className="btn-primary text-lg px-8 py-3 mt-4 inline-block"
            >
              Join Beta
            </a>
          )}
        </div>
      </div>
    </>
  );
}
