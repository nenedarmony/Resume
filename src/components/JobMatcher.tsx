import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Award, HelpCircle, Loader2, Cpu, Sparkles } from "lucide-react";

interface ProjectReason {
  name: string;
  reason: string;
}

interface InterviewQuestion {
  question: string;
  expectedAnswer: string;
}

interface MatchResult {
  summary: string;
  fitScore: number;
  strongMatches: string[];
  potentialGaps: string[];
  relevantProjects: ProjectReason[];
  relevantTechnologies: string[];
  interviewQuestions: InterviewQuestion[];
}

export default function JobMatcher() {
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => {
        const element = resultRef.current;
        if (element) {
          const yOffset = -120; // safe padding for sticky header
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 150);
    }
  }, [result]);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription }),
      });

      if (!response.ok) {
        throw new Error("Failed to compare the resume and job description.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200/60";
    if (score >= 60) return "text-amber-700 bg-amber-50 border-amber-200/60";
    return "text-rose-700 bg-rose-50 border-rose-200/60";
  };

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold tracking-wider uppercase font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Section 1: Interactive Matcher</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">
          Match Me To Your Job
        </h2>
        <p className="text-slate-500 max-w-2xl text-sm sm:text-base font-medium">
          Paste your specific job description. Nechama's AI Assistant will immediately evaluate her true technical skills and projects against your requirements, highlighting explicit fits, gaps, matching technologies, and crafting specialized technical interview prompts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel (Left) */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleMatch} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <label htmlFor="jd-textarea" className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Target Job Description
              </label>
              <button
                type="button"
                onClick={() => setJobDescription("")}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                disabled={isLoading}
              >
                Clear
              </button>
            </div>

            <div className="relative">
              <textarea
                id="jd-textarea"
                rows={10}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target requirements here..."
                className="w-full text-slate-700 bg-slate-50/50 border border-slate-200 rounded-lg p-3.5 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 focus:outline-hidden text-xs sm:text-sm leading-relaxed transition resize-y font-sans font-medium"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !jobDescription.trim()}
              className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold rounded-lg text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Comparing Experience Facts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Analyze Alignment</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Panel (Right) */}
        <div className="lg:col-span-7">
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-16 border border-dashed border-slate-200 bg-slate-50/50 rounded-xl space-y-4">
              <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
              <div className="text-center">
                <p className="font-bold text-slate-800 text-sm">Evaluating Resume Knowledge...</p>
                <p className="text-xs text-slate-400 mt-1">Grounded analysis checks facts. Excludes unverified skills.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Verification Failure</p>
                <p className="text-xs mt-1">{error}</p>
              </div>
            </div>
          )}

          {!isLoading && !result && !error && (
            <div className="p-12 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center space-y-3 bg-white">
              <div className="p-3 bg-slate-100 text-slate-700 rounded-full">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Awaiting JD Input</h3>
              <p className="text-xs text-slate-400 max-w-sm font-medium">
                Provide a job description to trigger the high-fidelity compatibility report.
              </p>
            </div>
          )}

          {result && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 scroll-mt-24"
            >
              {/* Overall Summary Block */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-150">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Compatibility Overview</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono mt-0.5">Google Engineering Style Match Metrics</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 ${getScoreColor(result.fitScore)}`}>
                    <span className="text-xl font-extrabold font-mono">{result.fitScore}%</span>
                    <span className="text-[9px] uppercase tracking-widest font-mono">Alignment</span>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm font-medium">
                  {result.summary}
                </p>
              </div>

              {/* Matches & Gaps Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matches */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider font-mono border-b border-slate-50 pb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Strong Matches</span>
                  </div>
                  <ul className="space-y-2.5">
                    {result.strongMatches.map((m, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-xs text-slate-600 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                        <span className="font-medium">{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gaps */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider font-mono border-b border-slate-50 pb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Potential Gaps</span>
                  </div>
                  <ul className="space-y-2.5">
                    {result.potentialGaps.map((g, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-xs text-slate-600 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                        <span className="font-medium">{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technologies Matched */}
              {result.relevantTechnologies && result.relevantTechnologies.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider font-mono border-b border-slate-50 pb-2">
                    <Cpu className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Verified Matching Technologies</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {result.relevantTechnologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-50 border border-slate-200/60 text-slate-700 rounded-md text-xs font-semibold font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Linked */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider font-mono border-b border-slate-50 pb-2">
                  <Award className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Matching Project Showcases</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.relevantProjects.map((p, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-150 rounded-lg space-y-1.5">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm font-sans">{p.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{p.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions */}
              <div className="bg-slate-950 text-white rounded-xl p-5 shadow-sm space-y-4 border border-slate-900">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Tailored Technical Interview Questions</span>
                </div>
                <div className="space-y-4">
                  {result.interviewQuestions.map((q, idx) => (
                    <div key={idx} className="space-y-1.5 text-xs sm:text-sm">
                      <p className="font-bold text-slate-100 font-sans">
                        Q{idx + 1}: {q.question}
                      </p>
                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 leading-relaxed font-sans text-xs">
                        <strong className="text-indigo-400 block mb-1">What to listen for in candidate response:</strong>
                        {q.expectedAnswer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
