import { useState, useEffect } from 'react';

export default function ProofCam() {
  const [currentDay, setCurrentDay] = useState(7);
  const totalDays = 14;
  const [verified, setVerified] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const handleCapture = () => {
    setCapturing(true);
    setTimeout(() => {
      setCapturing(false);
      setVerified(true);
      setTimeout(() => setVerified(false), 3000);
    }, 1500);
  };

  // Simulate time
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (d) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <section id="proofcam" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="blob-purple top-0 left-1/4 opacity-30" />
      <div className="blob-cyan -bottom-20 right-0 opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left — Description */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-sm">
              <span className="text-lg">📸</span>
              <span className="text-slate-400">ProofCam™</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6">
              <span className="text-white">Prove It.</span>
              <br />
              <span className="gradient-text">Don't Just Say It.</span>
            </h2>

            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Upload timestamped photos and videos as proof for your challenges. 
              ProofCam verifies your achievements so your reputation stays authentic.
            </p>

            <div className="space-y-4 max-w-md mx-auto lg:mx-0">
              {[
                { icon: '📷', text: 'Live selfie & video capture' },
                { icon: '⏰', text: 'Automatic timestamp verification' },
                { icon: '🔥', text: 'Streak progress tracking' },
                { icon: '✅', text: 'Community-verified proofs' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm text-slate-300 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Phone Mockup */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-[280px] sm:w-[300px]">
              {/* Phone Frame */}
              <div className="glass rounded-[2.5rem] p-3 border border-white/10 shadow-2xl shadow-neon-purple/10">
                <div className="bg-dark-900 rounded-[2rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between px-6 py-2 text-xs text-slate-500">
                    <span>{formatTime(time)}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 rounded-sm border border-slate-600 relative">
                        <div className="absolute inset-0.5 bg-green-400 rounded-sm" style={{ width: '75%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Camera Viewfinder */}
                  <div className="relative aspect-[3/4] bg-gradient-to-b from-dark-700 to-dark-800 mx-3 rounded-2xl overflow-hidden mb-3">
                    {/* Grid overlay */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                      {Array(9).fill(0).map((_, i) => (
                        <div key={i} className="border border-white/5" />
                      ))}
                    </div>

                    {/* Center reticle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 rounded-full border-2 border-neon-cyan/40 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-neon-cyan" />
                      </div>
                    </div>

                    {/* Top bar */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                      <span className="text-xs text-neon-cyan font-mono bg-dark-900/60 px-2 py-1 rounded-lg">
                        LIVE
                      </span>
                      <span className="text-xs text-slate-400 bg-dark-900/60 px-2 py-1 rounded-lg font-mono">
                        {formatTime(time)}
                      </span>
                    </div>

                    {/* Verified badge overlay */}
                    {verified && (
                      <div className="absolute inset-0 flex items-center justify-center bg-dark-900/70 animate-fade-in-up">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center mx-auto mb-2">
                            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-green-400 font-bold text-sm">Verified!</p>
                        </div>
                      </div>
                    )}

                    {/* Capturing animation */}
                    {capturing && (
                      <div className="absolute inset-0 border-4 border-neon-cyan rounded-2xl animate-pulse" />
                    )}
                  </div>

                  {/* Challenge Card */}
                  <div className="mx-3 mb-3 glass-light rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-neon-cyan">Active Challenge</span>
                      <span className="text-xs text-slate-500">Day {currentDay}/{totalDays}</span>
                    </div>
                    <p className="text-sm font-semibold text-white mb-3">
                      🔥 Wake up at 5 AM for 14 days
                    </p>

                    {/* Progress Dots */}
                    <div className="flex gap-1.5 mb-2">
                      {Array(totalDays).fill(0).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-1.5 rounded-full transition-all ${
                            i < currentDay
                              ? 'bg-gradient-to-r from-neon-cyan to-neon-purple'
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">{Math.round((currentDay / totalDays) * 100)}% complete</p>
                  </div>

                  {/* Capture Button */}
                  <div className="flex justify-center pb-4">
                    <button
                      onClick={handleCapture}
                      disabled={capturing}
                      className={`w-16 h-16 rounded-full border-4 border-neon-cyan/50 flex items-center justify-center transition-all ${
                        capturing
                          ? 'bg-neon-cyan/20 scale-90'
                          : 'bg-transparent hover:bg-neon-cyan/10 hover:scale-105'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full transition-all ${
                        capturing ? 'bg-red-500 rounded-lg w-8 h-8' : 'bg-neon-cyan'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Glow behind phone */}
              <div className="absolute -inset-8 bg-gradient-to-b from-neon-cyan/5 to-neon-purple/5 rounded-[3rem] blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
