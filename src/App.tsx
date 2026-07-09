import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import JobMatcher from "./components/JobMatcher";
import ExperienceExplorer from "./components/ExperienceExplorer";
import { 
  Sparkles, 
  Linkedin, 
  Mail, 
  MapPin, 
  Layers,
  Terminal,
  ShieldCheck,
  FileText
} from "lucide-react";
import { resumeData } from "./data/resumeData";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("resume");
  const [aiStatus, setAiStatus] = useState<{ aiInitialized: boolean; provider: string; instructions: string } | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setAiStatus(data))
      .catch((err) => console.error("Failed to fetch AI status:", err));
  }, []);

  const handleNavigate = (target: string) => {
    if (target === "experience") {
      // Scroll to the experience section
      const element = document.getElementById("experience-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      setActiveTab(target);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between font-sans selection:bg-slate-900 selection:text-white">
      
      {/* Top Banner Contact Information & Links */}
      <div className="bg-slate-950 text-slate-300 py-3 px-4 border-b border-slate-900 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 hover:text-white transition cursor-default text-xs font-semibold font-mono">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>nenedarmo@gmail.com</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition cursor-default text-xs font-semibold font-mono">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Hitech Contractor (ICL)</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition cursor-default text-xs font-semibold font-mono">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>4+ Years Verified Experience</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white transition flex items-center gap-1 text-xs font-semibold font-mono"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main SaaS Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button 
            onClick={() => setActiveTab("resume")}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <div className="p-2.5 rounded-lg bg-slate-950 text-white shadow-xs group-hover:bg-slate-900 transition">
              <Terminal className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="block font-extrabold text-slate-950 tracking-tight text-lg leading-none">
                {resumeData.name}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                {resumeData.title}
              </span>
            </div>
          </button>
 
          {/* Tab Navigation */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab("resume")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-mono transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "resume"
                  ? "bg-white text-slate-950 shadow-3xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Resume</span>
            </button>
            <button
              onClick={() => setActiveTab("match")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider font-mono transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "match"
                  ? "bg-white text-indigo-700 shadow-3xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Match Me</span>
            </button>
          </nav>
        </div>
      </header>

      {/* AI Key Configuration Banner */}
      {aiStatus && !aiStatus.aiInitialized && (
        <div className="bg-amber-50/90 border-b border-amber-200/70 text-amber-900 px-4 py-2 text-xs sm:text-sm shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <p className="font-medium text-slate-800">
                <strong>Demo Mode Active:</strong> Live {aiStatus.provider} matching is offline. {aiStatus.instructions}
              </p>
            </div>
          </div>
        </div>
      )}
 
      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {activeTab === "resume" && (
          <div className="space-y-16">
            <Hero onNavigate={handleNavigate} />
            <div id="experience-section" className="border-t border-slate-200/85 pt-16">
              <ExperienceExplorer />
            </div>
          </div>
        )}
        {activeTab === "match" && <JobMatcher />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-extrabold text-slate-900 font-mono text-sm">{resumeData.name}</p>
            <p className="text-xs text-slate-400 font-medium">Production-tested Senior Full Stack Engineering CV Evaluator</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-slate-400 text-xs font-bold uppercase font-mono tracking-wider">
            <span className="hover:text-slate-800 cursor-default">Angular</span>
            <span className="hover:text-slate-800 cursor-default">NestJS</span>
            <span className="hover:text-slate-800 cursor-default">AWS Lambda</span>
            <span className="hover:text-slate-800 cursor-default">Docker</span>
            <span className="hover:text-slate-800 cursor-default">MongoDB</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
