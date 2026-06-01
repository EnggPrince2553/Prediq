import { features } from '../data/mockData';

export default function Features() {
  return (
    <section id="features" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="blob-cyan -bottom-40 -left-20 opacity-30" />
      <div className="blob-purple top-20 right-0 opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            <span className="gradient-text">Why Prediq?</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need to build, track, and prove your prediction reputation.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="glass rounded-3xl p-7 card-hover glow-border group cursor-default"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 border border-white/5 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors duration-300">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative line */}
              <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent group-hover:via-neon-cyan/40 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
