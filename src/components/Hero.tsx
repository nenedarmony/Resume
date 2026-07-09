import { motion } from "motion/react";
import { Sparkles, Briefcase, ChevronRight, FileSpreadsheet, Server, ShieldCheck, Compass } from "lucide-react";
import { resumeData } from "../data/resumeData";

interface HeroProps {
  onNavigate: (tab: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <div className="space-y-16">
      {/* Bio / Heading Block */}
      <section id="hero-landing" className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center pt-4 sm:pt-8">
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/60 text-slate-700 text-xs font-semibold tracking-wider uppercase font-mono"
          >
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            <span>Senior Full Stack Engineer</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="space-y-3 sm:space-y-4"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-tight">
              {resumeData.name}
            </h1>
            <p className="text-base sm:text-xl font-semibold text-slate-700">
              {resumeData.subtitle}
            </p>
            <p className="text-slate-500 leading-relaxed text-sm sm:text-lg max-w-xl font-medium">
              {resumeData.description}
            </p>
          </motion.div>

          {/* Core CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-3 pt-2"
          >
            <button
              id="cta-match-job"
              onClick={() => onNavigate("match")}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-sm font-semibold shadow-sm transition duration-150 flex items-center justify-center gap-2 cursor-pointer border border-slate-950"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Match Me To Your Job</span>
            </button>
            <button
              id="cta-explore"
              onClick={() => onNavigate("experience")}
              className="w-full sm:w-auto px-6 py-3 bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-semibold transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore My Experience</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </motion.div>
        </div>

        {/* Visual Architectural Dashboard mockup (Vercel/Linear-inspired) */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border border-slate-200/85 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-6 font-mono text-xs text-slate-600"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold bg-slate-100/80 px-2 py-0.5 rounded uppercase tracking-wider">
                ICL Stack Configuration
              </span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-12 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100 gap-2">
                <span className="col-span-5 sm:col-span-4 font-semibold text-slate-900">Framework</span>
                <span className="col-span-7 sm:col-span-8 text-indigo-600 font-bold text-right">Angular v16/17</span>
              </div>
              <div className="grid grid-cols-12 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100 gap-2">
                <span className="col-span-5 sm:col-span-4 font-semibold text-slate-900">Backend Server</span>
                <span className="col-span-7 sm:col-span-8 text-violet-600 font-bold text-right">NestJS & Node.js</span>
              </div>
              <div className="grid grid-cols-12 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100 gap-2">
                <span className="col-span-5 sm:col-span-4 font-semibold text-slate-900">Infrastructure</span>
                <span className="col-span-7 sm:col-span-8 text-emerald-600 font-bold text-right">AWS (Serverless, S3, Cognito)</span>
              </div>
              <div className="grid grid-cols-12 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100 gap-2">
                <span className="col-span-5 sm:col-span-4 font-semibold text-slate-900">Main Database</span>
                <span className="col-span-7 sm:col-span-8 text-slate-800 font-bold text-right">MongoDB / PostgreSQL</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100/80 text-center">
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Total Experience</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">4+ Years</p>
              </div>
              <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100/80 text-center">
                <p className="text-[10px] uppercase text-slate-400 font-semibold">Cloud Platform</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">AWS Certified</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Banner */}
      <section id="professional-philosophy" className="border-t border-slate-200/80 pt-12">
        <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-4 sm:p-8 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-slate-800" />
            <h3 className="font-extrabold text-slate-950 uppercase tracking-wider text-xs font-mono">
              Professional Philosophy
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resumeData.philosophy.map((phi, idx) => (
              <div key={idx} className="p-4 sm:p-5 bg-white border border-slate-200/70 rounded-xl space-y-3 shadow-3xs hover:border-slate-300 transition duration-150">
                <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center font-mono">
                  0{idx + 1}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed font-sans">
                  {phi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
