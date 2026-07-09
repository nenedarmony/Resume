import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Code,
  Layers,
  Cpu,
  Cloud,
  Network,
  Smartphone,
  Award,
  ShieldAlert,
  FolderKanban,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Calendar
} from "lucide-react";
import { resumeData } from "../data/resumeData";

export default function ExperienceExplorer() {
  const [activeCategory, setActiveCategory] = useState<
    "projects" | "skills" | "cloud" | "architecture" | "mobile" | "leadership" | "security"
  >("projects");

  const renderContent = () => {
    switch (activeCategory) {
      case "projects":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resumeData.projects.map((proj, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs flex flex-col justify-between space-y-6 hover:shadow-xs transition duration-150"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <FolderKanban className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">
                      Enterprise Project
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-base">{proj.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {proj.description}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-md text-[10px] font-mono font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Deliverables</p>
                  <ul className="space-y-1.5">
                    {proj.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex gap-2 items-start text-xs text-slate-600 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="font-medium">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        );

      case "skills":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-500" />
                Frontend Core
              </h4>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.frontend.map((s, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-50 border border-slate-150 text-slate-700 rounded-lg text-xs font-semibold font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-violet-500" />
                Backend Core
              </h4>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.backend.map((s, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-50 border border-slate-150 text-slate-700 rounded-lg text-xs font-semibold font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                <Network className="w-4 h-4 text-emerald-500" />
                Database Engines
              </h4>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.databases.map((s, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-50 border border-slate-150 text-slate-700 rounded-lg text-xs font-semibold font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                AI Engineering tools
              </h4>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.ai.map((s, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-slate-50 border border-slate-150 text-slate-700 rounded-lg text-xs font-semibold font-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case "cloud":
        return (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                <Cloud className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-950 text-base">AWS Cloud Infrastructure</h4>
                <p className="text-xs text-slate-500 font-medium">Experienced in constructing fully automated, serverless, and robust hosting environments on Amazon Web Services.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {resumeData.skills.cloud.map((service, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-center space-y-1">
                  <span className="text-xs font-bold text-slate-800 font-mono">{service}</span>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">AWS Platform</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border border-slate-250/50 rounded-xl space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Featured Cloud Integration:</span>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Designed secure WhatsApp Meta receptors running serverless AWS Lambda pipelines triggered by API Gateway endpoints with Cognito Identity and S3 backups.
              </p>
            </div>
          </div>
        );

      case "architecture":
        return (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-violet-50 text-violet-600 rounded-xl shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-950 text-base">Enterprise Systems Architecture</h4>
                <p className="text-xs text-slate-500 font-medium">Designing maintainable, decoupled architectures before writing code. Focus on clean domain boundaries and reuse.</p>
              </div>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="flex gap-3 items-start text-xs sm:text-sm text-slate-600 leading-relaxed">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="font-semibold text-slate-700">Refactored node configurations across systems to transition flawlessly from Node.js 14 backends to modern Node.js 20 frameworks.</span>
              </div>
              <div className="flex gap-3 items-start text-xs sm:text-sm text-slate-600 leading-relaxed">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="font-semibold text-slate-700">Designed structured database models (MongoDB, MySQL, and PostgreSQL) supporting scalable entity schemas with zero runtime performance hits.</span>
              </div>
              <div className="flex gap-3 items-start text-xs sm:text-sm text-slate-600 leading-relaxed">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="font-semibold text-slate-700">Architected highly resilient Spain Mining digital platform handling mission-critical, real-time enterprise operations.</span>
              </div>
            </div>
          </div>
        );

      case "mobile":
        return (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-950 text-base">Mobile Development & Support</h4>
                <p className="text-xs text-slate-500 font-medium">Building and maintaining hybrid mobile capabilities and production configurations for Android and iOS devices.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                <span className="font-bold text-slate-800 text-xs sm:text-sm">Android Applications</span>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Production deployments, client-side caching integrations, and device configurations for enterprise users.</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                <span className="font-bold text-slate-800 text-xs sm:text-sm">iOS Applications</span>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">App Store deployment pipeline management, push notifications delivery, and responsive native UI layout design.</p>
              </div>
            </div>
          </div>
        );

      case "leadership":
        return (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-950 text-base">Technical Leadership & DevOps Referent</h4>
                <p className="text-xs text-slate-500 font-medium">Leading migrations, managing stakeholder expectations, and acting as DevOps referent inside ICL.</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-lg flex gap-3 items-start">
                <span className="px-2.5 py-1 bg-white border border-slate-200 text-indigo-700 font-bold font-mono text-xs rounded uppercase tracking-wider shrink-0">
                  DevOps
                </span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                  Serving as DevOps Referent. Standardizing CI/CD with Jenkins, containerizing infrastructure using Docker, and optimizing deployment speeds.
                </p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-lg flex gap-3 items-start">
                <span className="px-2.5 py-1 bg-white border border-slate-200 text-indigo-700 font-bold font-mono text-xs rounded uppercase tracking-wider shrink-0">
                  Hitech
                </span>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                  Operating as an elite Hitech Contractor inside ICL, navigating complex enterprise hierarchies to deploy high-value platform modernizations.
                </p>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-950 text-base">Security & Authentication Standards</h4>
                <p className="text-xs text-slate-500 font-medium">Securing APIs, configuring identity providers, and preventing standard authorization bypass issues.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-lg space-y-1">
                <span className="text-xs font-bold text-slate-900 block font-mono">OAuth2 & MSAL</span>
                <p className="text-[10px] text-slate-500 font-medium">Standardized client-side and server-side federation protocols.</p>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-lg space-y-1">
                <span className="text-xs font-bold text-slate-900 block font-mono">Cognito Login</span>
                <p className="text-[10px] text-slate-500 font-medium">Passwordless and multi-factor authentication implementations.</p>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-lg space-y-1">
                <span className="text-xs font-bold text-slate-900 block font-mono">API Security</span>
                <p className="text-[10px] text-slate-500 font-medium">Lambda Authorizers, signature verifications, and CORS protection policies.</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold tracking-wider uppercase font-mono">
            <span>Section 2: Experience Matrix</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 mt-3">
            Explore My Experience
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Browse Nechama's professional record, core skills, systems design capability, and leadership roles.
          </p>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-xl w-full sm:w-auto overflow-x-auto">
          {[
            { id: "projects", label: "Projects", icon: <FolderKanban className="w-3.5 h-3.5" /> },
            { id: "skills", label: "Skills", icon: <Code className="w-3.5 h-3.5" /> },
            { id: "cloud", label: "Cloud", icon: <Cloud className="w-3.5 h-3.5" /> },
            { id: "architecture", label: "Architecture", icon: <Layers className="w-3.5 h-3.5" /> },
            { id: "mobile", label: "Mobile", icon: <Smartphone className="w-3.5 h-3.5" /> },
            { id: "leadership", label: "Leadership", icon: <Award className="w-3.5 h-3.5" /> },
            { id: "security", label: "Security", icon: <ShieldAlert className="w-3.5 h-3.5" /> },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider font-mono transition cursor-pointer shrink-0 ${
                activeCategory === cat.id
                  ? "bg-white text-slate-900 shadow-3xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Render area */}
      <div className="min-h-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Corporate Metadata Footer Box */}
      <div className="p-5 border border-slate-200/80 rounded-2xl bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Current Employment Record</span>
          <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">ICL &middot; Senior Full Stack Engineer</h4>
          <p className="text-xs text-slate-500 font-medium">Hitech Contractor | Responsibilities span core Angular development, NestJS pipelines, and AWS management.</p>
        </div>
        <div className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 font-mono text-xs font-semibold shrink-0">
          2022 - Present
        </div>
      </div>
    </div>
  );
}
