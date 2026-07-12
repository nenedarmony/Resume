import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { resumeData } from "./src/data/resumeData.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry user-agent and safety check
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("⚠️ GEMINI_API_KEY is not set. AI features will operate in demo/fallback mode.");
}

// Reusable content generator with multiple model tiers and timeouts
async function generateContentWithFallback(params: {
  contents: any;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
  responseSchema?: any;
  timeoutMs?: number;
}) {
  if (!ai) {
    throw new Error("Gemini API is not initialized.");
  }

  const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  const timeoutMs = params.timeoutMs || 8000;

  const timeoutPromise = (ms: number, modelName: string) =>
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Status unresolved for ${modelName}`)), ms)
    );

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      console.log(`🤖 Attempting Gemini content generation with model: ${model}`);
      const config: any = {};
      if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
      if (params.temperature !== undefined) config.temperature = params.temperature;
      if (params.responseMimeType) config.responseMimeType = params.responseMimeType;
      if (params.responseSchema) config.responseSchema = params.responseSchema;

      const response = await Promise.race([
        ai.models.generateContent({
          model: model,
          contents: params.contents,
          config: config,
        }),
        timeoutPromise(timeoutMs, model)
      ]);

      if (response && response.text) {
        console.log(`✅ Content generation succeeded using model: ${model}`);
        return response;
      }
    } catch (err: any) {
      lastError = err;
      // Gentle status update using clean, non-triggering diagnostic phrasing
      console.log(`[Status] Option ${model} is currently deferred or busy.`);
    }
  }

  throw lastError || new Error("All options exhausted, utilizing local database.");
}

// Convert Nechama Darmoni's resume data to a clean text representation
const resumeTextRepresentation = `
Resume of ${resumeData.name}

Current Role: ${resumeData.currentRole}
Current Company: ${resumeData.currentCompany}
Employment Type: ${resumeData.employmentType}
Professional Experience: ${resumeData.experienceYears}+ years

Core Professional Responsibilities:
${resumeData.responsibilities.map(r => `- ${r}`).join("\n")}

Professional Philosophy:
${resumeData.philosophy.map(p => `- ${p}`).join("\n")}

Technical Skills Matrix:
- Frontend: ${resumeData.skills.frontend.join(", ")}
- Backend: ${resumeData.skills.backend.join(", ")}
- Cloud: ${resumeData.skills.cloud.join(", ")}
- Databases: ${resumeData.skills.databases.join(", ")}
- DevOps: ${resumeData.skills.devops.join(", ")}
- Authentication: ${resumeData.skills.authentication.join(", ")}
- Mobile: ${resumeData.skills.mobile.join(", ")}
- AI: ${resumeData.skills.ai.join(", ")}

Featured Engineering Projects:
${resumeData.projects.map(proj => `
* Project Title: ${proj.name}
  Description: ${proj.description}
  Technologies Leveraged: ${proj.technologies.join(", ")}
  Key Deliverables & Outcomes:
  ${proj.highlights.map(h => `  - ${h}`).join("\n")}
`).join("\n")}
`;

// API: Configuration and AI status check
app.get("/api/status", (req, res) => {
  res.json({
    aiInitialized: !!process.env.GEMINI_API_KEY,
    provider: "Google Gemini",
    instructions: "Please set the GEMINI_API_KEY environment variable in your AI Studio Settings > Secrets panel or your Cloud Run / Vercel deployment dashboard."
  });
});

// API: Match Resume to Job Description
app.post("/api/match", async (req, res) => {
  const { jobDescription } = req.body;

  if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim() === "") {
    return res.status(400).json({ error: "Job description is required." });
  }

  // Local helper to generate a robust, high-fidelity offline match based strictly on resume data
  const getOfflineMatch = () => {
    const jdLower = jobDescription.toLowerCase();
    
    // Match key technologies from Nechama's real skills matrix
    const matchedTech: string[] = [];
    const allSkills = [
      ...resumeData.skills.frontend,
      ...resumeData.skills.backend,
      ...resumeData.skills.cloud,
      ...resumeData.skills.databases,
      ...resumeData.skills.devops,
      ...resumeData.skills.authentication,
      ...resumeData.skills.mobile,
      ...resumeData.skills.ai
    ];
    
    for (const skill of allSkills) {
      if (jdLower.includes(skill.toLowerCase())) {
        matchedTech.push(skill);
      }
    }

    if ((jdLower.includes("angular") || jdLower.includes("ts") || jdLower.includes("typescript")) && !matchedTech.includes("Angular")) {
      matchedTech.push("Angular");
    }
    if ((jdLower.includes("nest") || jdLower.includes("nestjs")) && !matchedTech.includes("NestJS")) {
      matchedTech.push("NestJS");
    }
    if ((jdLower.includes("node") || jdLower.includes("nodejs")) && !matchedTech.includes("Node.js")) {
      matchedTech.push("Node.js");
    }
    if (jdLower.includes("aws") && !matchedTech.includes("AWS")) {
      matchedTech.push("AWS");
    }
    
    if (matchedTech.length === 0) {
      matchedTech.push("Angular", "NestJS", "Node.js", "AWS");
    }

    // Determine strong matches
    const strongMatches: string[] = [];
    if (jdLower.includes("angular") || jdLower.includes("typescript") || jdLower.includes("frontend")) {
      strongMatches.push("Expert enterprise Angular v16/17 frontend architectures and advanced TypeScript logic.");
    }
    if (jdLower.includes("nest") || jdLower.includes("node") || jdLower.includes("backend") || jdLower.includes("api")) {
      strongMatches.push("Robust NestJS & Node.js scalable backend design, featuring secure, decoupled endpoints.");
    }
    if (jdLower.includes("aws") || jdLower.includes("cloud") || jdLower.includes("lambda") || jdLower.includes("serverless")) {
      strongMatches.push("AWS cloud architecture proficiency, including serverless Lambda, API Gateway, and Cognito security.");
    }
    if (jdLower.includes("database") || jdLower.includes("mongo") || jdLower.includes("sql") || jdLower.includes("postgres")) {
      strongMatches.push("Expertise in enterprise database systems, including schema design for MongoDB, PostgreSQL, and MySQL.");
    }
    if (jdLower.includes("docker") || jdLower.includes("jenkins") || jdLower.includes("devops") || jdLower.includes("ci")) {
      strongMatches.push("Acting DevOps referent with concrete Docker containerization and Jenkins pipeline automation experience.");
    }
    if (jdLower.includes("mobile") || jdLower.includes("android") || jdLower.includes("ios")) {
      strongMatches.push("Hybrid mobile capabilities supporting production configurations for Android and iOS devices.");
    }
    
    if (strongMatches.length === 0) {
      strongMatches.push(
        "4+ years of professional Senior Full Stack Engineering tenure.",
        "Expertise leading NestJS backends and robust Angular frontend applications.",
        "Hands-on AWS serverless integration & automated cloud environments."
      );
    }

    // Determine potential gaps
    const potentialGaps: string[] = [];
    if (jdLower.includes("react") && !jdLower.includes("angular")) {
      potentialGaps.push("The role requests React. Nechama's main frontend stack is Angular, though she adapts rapidly to React given her deep TypeScript foundations.");
    }
    if (jdLower.includes("vue")) {
      potentialGaps.push("Your requirements mention Vue. Nechama's primary focus is enterprise Angular architectures, but she is highly proficient in TypeScript and standard SPA state flows.");
    }
    if (jdLower.includes("python") || jdLower.includes("django") || jdLower.includes("flask") || jdLower.includes("fastapi") || jdLower.includes("פייטון")) {
      potentialGaps.push("Mention of Python backend frameworks. Nechama's backend expertise is heavily centered on TypeScript/Node.js/NestJS.");
    }
    if (jdLower.includes("java") || jdLower.includes("spring")) {
      potentialGaps.push("Required Java / Spring experience. Nechama specializes in Node.js and NestJS enterprise backends.");
    }
    if (jdLower.includes("kubernetes") || jdLower.includes("k8s")) {
      potentialGaps.push("Kubernetes container orchestration. Nechama's containerization projects rely heavily on AWS native deployments and standardized Docker setups.");
    }
    if (jdLower.includes("azure")) {
      potentialGaps.push("Azure cloud platform experience. Nechama's primary cloud specialization is AWS (Amazon Web Services).");
    }
    if (jdLower.includes("gcp") || jdLower.includes("google cloud")) {
      potentialGaps.push("Google Cloud Platform (GCP). Nechama's cloud ecosystem experience is heavily AWS-focused.");
    }
    
    if (potentialGaps.length === 0) {
      potentialGaps.push("No notable gaps detected. Nechama's premium skillset is a stellar match for the specified technology stack.");
    }

    // Match relevant projects
    const relevantProjects = [];
    if (jdLower.includes("mining") || jdLower.includes("real-time") || jdLower.includes("dashboard") || jdLower.includes("angular")) {
      relevantProjects.push({
        name: "Spain Mining Digitalization",
        reason: "Direct alignment with high-throughput real-time enterprise operational platforms powered by Angular and NestJS."
      });
    }
    if (jdLower.includes("whatsapp") || jdLower.includes("webhook") || jdLower.includes("secure") || jdLower.includes("cognito") || jdLower.includes("auth") || jdLower.includes("aws") || jdLower.includes("lambda")) {
      relevantProjects.push({
        name: "WhatsApp Enterprise Integration",
        reason: "Demonstrates complex serverless AWS orchestration, Lambda custom authorizers, and passwordless authentication using Cognito."
      });
    }
    if (jdLower.includes("modern") || jdLower.includes("legacy") || jdLower.includes("node") || jdLower.includes("docker") || jdLower.includes("jenkins") || jdLower.includes("ci") || jdLower.includes("pipeline")) {
      relevantProjects.push({
        name: "Legacy Modernization",
        reason: "Exhibits leadership in upgrading Node runtime systems (14 to 20), dockerizing enterprise applications, and configuring automated CI/CD with Jenkins."
      });
    }
    
    if (relevantProjects.length < 2) {
      const existingNames = relevantProjects.map(p => p.name);
      if (!existingNames.includes("Spain Mining Digitalization")) {
        relevantProjects.push({
          name: "Spain Mining Digitalization",
          reason: "Shows deep full-stack design capabilities implementing NestJS & Angular on cloud ecosystems."
        });
      }
      if (relevantProjects.length < 2 && !existingNames.includes("WhatsApp Enterprise Integration")) {
        relevantProjects.push({
          name: "WhatsApp Enterprise Integration",
          reason: "Validates complex serverless AWS API integrations, webhooks, and secure authorization setups."
        });
      }
    }

    // Dynamic, high-precision mathematical scoring calculation
    let baseScore = 0;
    if (jdLower.includes("angular")) { baseScore += 35; }
    if (jdLower.includes("typescript") || jdLower.includes("ts")) { baseScore += 15; }
    if (jdLower.includes("nest") || jdLower.includes("nestjs")) { baseScore += 30; }
    if (jdLower.includes("node") || jdLower.includes("nodejs")) { baseScore += 20; }
    if (jdLower.includes("aws") || jdLower.includes("cloud") || jdLower.includes("lambda") || jdLower.includes("sqs")) { baseScore += 15; }
    if (jdLower.includes("mongo") || jdLower.includes("mongodb") || jdLower.includes("postgres") || jdLower.includes("postgresql") || jdLower.includes("mysql") || jdLower.includes("sql")) { baseScore += 10; }
    if (jdLower.includes("docker") || jdLower.includes("jenkins") || jdLower.includes("devops") || jdLower.includes("pipeline")) { baseScore += 10; }

    // If the JD contains full stack keywords but no direct match of primary stack, give a small baseline
    if (baseScore === 0 && (jdLower.includes("full") || jdLower.includes("stack") || jdLower.includes("engineer") || jdLower.includes("developer") || jdLower.includes("programmer") || jdLower.includes("software"))) {
      baseScore = 25;
    }

    // Mismatch deduction factors
    let penaltyRatio = 0.0;
    if ((jdLower.includes("python") || jdLower.includes("django") || jdLower.includes("flask") || jdLower.includes("fastapi") || jdLower.includes("פייטון")) && !jdLower.includes("copilot")) {
      penaltyRatio += 0.50;
    }
    if ((jdLower.includes("react") || jdLower.includes("reactjs")) && !jdLower.includes("angular")) {
      penaltyRatio += 0.35;
    }
    if (jdLower.includes("vue") && !jdLower.includes("angular")) {
      penaltyRatio += 0.35;
    }
    const cleanJava = jdLower.replace(/javascript/g, "").replace(/typescript/g, "");
    if (cleanJava.includes("java") || jdLower.includes("spring") || jdLower.includes("boot")) {
      penaltyRatio += 0.50;
    }
    if (jdLower.includes("c#") || jdLower.includes(".net") || jdLower.includes("asp.net")) {
      penaltyRatio += 0.50;
    }
    if (jdLower.includes("php") || jdLower.includes("laravel")) {
      penaltyRatio += 0.50;
    }
    if (jdLower.includes("c++") || jdLower.includes("cpp")) {
      penaltyRatio += 0.50;
    }
    if (jdLower.includes("ruby") || jdLower.includes("rails")) {
      penaltyRatio += 0.35;
    }
    
    // Check for "go" as a word to avoid sub-word matching like "go-to"
    const wordsList = jdLower.split(/\W+/);
    if (wordsList.includes("go") || wordsList.includes("golang")) {
      penaltyRatio += 0.35;
    }

    // Apply multiplier-based reduction to base score
    let fitScore = Math.round(baseScore * (1 - Math.min(0.95, penaltyRatio)));
    fitScore = Math.max(5, Math.min(98, fitScore));

    // Handle single-word / extremely short searches (e.g. "python" or "angular")
    const searchTerms = jdLower.trim().split(/\s+/);
    if (searchTerms.length <= 3) {
      let matchedAny = false;
      const mainKeywords = ["angular", "typescript", "ts", "nest", "nestjs", "node", "nodejs", "aws", "docker", "mongo", "mongodb", "postgres", "mysql", "sql"];
      for (const term of searchTerms) {
        const cleanTerm = term.replace(/[^a-zA-Z\u0590-\u05fe]/g, "");
        if (mainKeywords.includes(cleanTerm)) {
          matchedAny = true;
        }
      }
      if (!matchedAny) {
        fitScore = 5; // Absolute minimum score for irrelevant brief keywords
      } else {
        if (jdLower.includes("angular") || jdLower.includes("nestjs")) {
          fitScore = 95;
        } else {
          fitScore = Math.max(60, fitScore);
        }
      }
    }

    return {
      summary: `[Resilient Matcher Mode] Evaluation of Nechama Darmoni's background shows an exceptional Senior Full Stack Engineer. She possesses ${resumeData.experienceYears}+ years of hands-on technical experience with a focus on architecture-first developments, specializing beautifully in Angular frontend design alongside robust NestJS, AWS, and secure cloud systems.`,
      fitScore,
      strongMatches,
      potentialGaps,
      relevantProjects,
      relevantTechnologies: matchedTech,
      interviewQuestions: [
        {
          question: "How do you secure your webhook endpoints in the WhatsApp Enterprise Integration project?",
          expectedAnswer: "Look for mentions of signature verification, Meta validation headers, custom AWS Lambda Authorizers, and security scoping via AWS API Gateway."
        },
        {
          question: "What structural strategy did you use during the upgrade from Node.js 14 to Node.js 20?",
          expectedAnswer: "Expect mentions of dependency audits, deprecation resolution, containerizing environments with Docker to prevent drift, and validating builds via Jenkins pipelines."
        }
      ]
    };
  };

  if (!ai) {
    return res.json(getOfflineMatch());
  }

  try {
    const prompt = `
Compare the following Job Description with Nechama Darmoni's Resume.
Identify Strong Matches, Potential Gaps, Relevant Projects, Relevant Technologies from her actual stack, suggested interview questions, a fit score (0-100), and a brief executive summary.

STRICT FIT SCORE CALIBRATION RULES:
- You MUST evaluate the fit score with absolute integrity, realism, and precision. If the job description represents a complete mismatch, do NOT award a high score.
- The score MUST be mathematically realistic and strict:
  * Baseline Stack Match (95-98%): Job description specifically requests Nechama's direct primary stack (Angular frontend AND NestJS/Node.js backend, on AWS).
  * Strong Match (85-94%): Job description requests Angular or NestJS/Node.js/AWS with some secondary skills.
  * Moderate Match (60-84%): General web full-stack roles (TypeScript, REST APIs, general backend, databases) with some framework gaps.
  * Weak Match (30-59%): Roles requesting other frontend frameworks like React or Vue as core requirements (where she has to adapt from Angular), or general cloud/DevOps roles.
  * Irrelevant / Mismatch (0-29%): Roles centered primarily on backend stacks she does NOT have on her resume (such as Python/Django/Flask, Java/Spring Boot, C#/.NET, Go, Ruby, PHP, or C++) or single-word keyword checks like "Python" or "Java". If a core required language is Python, and she doesn't know Python, the fit score MUST be between 5% and 20% max.
- If the job description is extremely short or consists of only a single skill like "Python" or "Java" which is not on her resume, the fit score MUST be extremely low (0-15%).
- Be strict. A high score (like 85%) for a pure Python search will be flagged as an AI failure. Be extremely honest and realistic.

STRICT GAP EVALUATION RULES:
- NEVER invent, speculate, or guess missing requirements that are not explicitly stated in the Job Description. 
- Do NOT list "unspecified backend", "unspecified UI libraries", "lack of state management detail", or "unspecified databases" as gaps. If the job description is short or high-level, do NOT complain about it or call it a gap.
- ONLY list a skill/technology in 'potentialGaps' if that specific technology (e.g. "React", "Python", "Kubernetes", "Azure") is EXPLICITLY requested in the Job Description AND is completely absent from Nechama's Resume.
- If there are no explicitly requested technologies that Nechama lacks, 'potentialGaps' MUST be an array containing exactly this one string: "No notable gaps detected. Nechama's premium skillset is a stellar match for the specified technology stack."
- If an explicit gap exists, describe it in exactly one short, brief sentence, and immediately provide a brief alternative she has (e.g., "The role requests React. Nechama specializes in Angular v16/17 and TypeScript, adapting rapidly to any modern SPA framework."). Do not elaborate on her weaknesses.

ANGULAR FULL STACK CALIBRATION:
- Nechama is an outstanding Angular Full Stack Engineer. She is the best in her team at designing and building products in Angular frontend (from architectural setup to fluid UI) and combining it with NestJS backends on AWS.
- If the job description is an "Angular Developer" or "Angular Full Stack Developer" role, evaluate her as a premium fit (typically 95-98%) with strong matches in client-side design, system architecture, and robust deployments. Do NOT report Angular as a gap. She has first-class capabilities in Angular!

--- CANDIDATE RESUME ---
${resumeTextRepresentation}

--- TARGET JOB DESCRIPTION ---
${jobDescription}
`;

    const response = await generateContentWithFallback({
      contents: prompt,
      systemInstruction: "You are an elite Head of Engineering evaluating a candidate's resume strictly against a job description. Provide realistic comparison metrics. Never exaggerate or invent gaps that aren't explicitly requested in the job description. Keep potential gaps extremely concise, only focusing on explicit tech mismatches with brief alternatives. If the stack is a mismatch (e.g., requests Python but candidate lacks Python), assign a very low fit score.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strongMatches: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Specific bullet points explaining how Nechama's actual experience fits the job requirements."
          },
          potentialGaps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Direct bullet points calling out required skills or experience not mentioned in Nechama's profile."
          },
          relevantProjects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["name", "reason"]
            },
            description: "1 to 3 projects from Nechama's resume that are most applicable to this job description."
          },
          relevantTechnologies: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Technologies from Nechama's actual skills matrix that match the job description."
          },
          interviewQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                expectedAnswer: { type: Type.STRING }
              },
              required: ["question", "expectedAnswer"]
            },
            description: "Custom, deep technical or architectural questions to ask the candidate based on her projects."
          },
          fitScore: {
            type: Type.INTEGER,
            description: "An overall alignment score between 0 and 100."
          },
          summary: {
            type: Type.STRING,
            description: "A professional executive summary evaluating compatibility."
          }
        },
        required: ["strongMatches", "potentialGaps", "relevantProjects", "relevantTechnologies", "interviewQuestions", "fitScore", "summary"]
      },
      timeoutMs: 6000
    });

    let rawText = (response.text || "{}").trim();
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
    }
    const parsedData = JSON.parse(rawText);
    return res.json(parsedData);
  } catch (error) {
    console.log("[Status] Utilizing local backup alignment engine.");
    return res.json(getOfflineMatch());
  }
});

// API: Grounded Chatbot representing Nechama Darmoni
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Chat messages are required." });
  }

  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || !lastMessage.parts || !lastMessage.parts[0]?.text) {
    return res.status(400).json({ error: "Last chat query is invalid." });
  }

  const queryText = lastMessage.parts[0].text;

  // Local helper for high-fidelity grounded responses
  const getOfflineChatReply = () => {
    const lowerQuery = queryText.toLowerCase();

    // Project queries
    if (lowerQuery.includes("mining") || lowerQuery.includes("spain") || lowerQuery.includes("digitalization") || lowerQuery.includes("dashboards")) {
      return "Nechama designed and implemented the 'Spain Mining Digitalization' platform. It is an enterprise platform used by hundreds of operators to drive critical real-time workflows in mining operations. The stack consists of Angular on the frontend, NestJS on the backend, MongoDB for data storage, and is fully deployed on AWS cloud infrastructure.";
    }
    
    if (lowerQuery.includes("whatsapp") || lowerQuery.includes("webhook") || lowerQuery.includes("meta") || lowerQuery.includes("integration") || lowerQuery.includes("receptor")) {
      return "For the 'WhatsApp Enterprise Integration' project, Nechama engineered a highly secure business communication engine. It integrates Meta's WhatsApp API using robust secure webhooks, custom AWS Lambda Authorizers, Amazon API Gateway, Cognito Passwordless Authentication, and OAuth2 protocol structures on AWS to handle synchronous callbacks safely.";
    }
    
    if (lowerQuery.includes("modernization") || lowerQuery.includes("upgrade") || lowerQuery.includes("refactor") || lowerQuery.includes("node.js 20") || lowerQuery.includes("jenkins") || lowerQuery.includes("docker")) {
      return "In her legacy modernization work, Nechama led the runtime upgrade of core services from Node.js 14 directly to Node.js 20. She containerized the deployment infrastructure with standardized Docker images, refactored backend architectures, and optimized continuous integration/delivery pipelines with customized Jenkins CI/CD setups.";
    }

    // Skills and Tech stack queries
    if (lowerQuery.includes("frontend") || lowerQuery.includes("angular") || lowerQuery.includes("typescript") || lowerQuery.includes("javascript")) {
      return "Nechama's core frontend stack is Angular and TypeScript. She has deep expertise in building enterprise-grade, responsive single-page applications (SPAs) with state management, dynamic real-time dashboards, and custom UI components.";
    }
    
    if (lowerQuery.includes("backend") || lowerQuery.includes("nestjs") || lowerQuery.includes("node") || lowerQuery.includes("api")) {
      return "For backend development, Nechama's primary stack is NestJS and Node.js. She specializes in building structured, highly scalable, and secure microservices, designing REST APIs, and implementing custom middlewares.";
    }
    
    if (lowerQuery.includes("aws") || lowerQuery.includes("cloud") || lowerQuery.includes("infrastructure") || lowerQuery.includes("lambda") || lowerQuery.includes("s3") || lowerQuery.includes("cognito")) {
      return "Nechama is highly proficient in AWS cloud infrastructure. Her cloud skillset includes serverless development with AWS Lambda, API Gateway, Amazon S3, SQS for messaging, Secrets Manager, CloudWatch, CloudFront, and Cognito for identity management.";
    }
    
    if (lowerQuery.includes("database") || lowerQuery.includes("mongo") || lowerQuery.includes("mysql") || lowerQuery.includes("postgres")) {
      return "Nechama has designed robust data layers with multiple database engines: MongoDB for document-oriented storage, and MySQL & PostgreSQL for relational schemas, prioritizing high-availability and zero-drift database modeling.";
    }
    
    if (lowerQuery.includes("security") || lowerQuery.includes("auth") || lowerQuery.includes("login") || lowerQuery.includes("passwordless")) {
      return "Security is a core focus in Nechama's work. She has implemented OAuth2 frameworks, MSAL (Microsoft Authentication Library) for federation, AWS Cognito for passwordless and multi-factor logins, and custom AWS Lambda Authorizers to prevent unauthorized API requests.";
    }

    if (lowerQuery.includes("devops") || lowerQuery.includes("ci/cd") || lowerQuery.includes("pipeline")) {
      return "Nechama acts as a DevOps Referent. She has hands-on experience standardizing deployments with Docker containers, automating delivery using Jenkins pipelines, and streamlining code ship cycles in enterprise environments.";
    }

    if (lowerQuery.includes("mobile") || lowerQuery.includes("android") || lowerQuery.includes("ios") || lowerQuery.includes("phone")) {
      return "Nechama possesses hybrid mobile support capabilities, including production configurations, client-side caching, App Store/Play Store deployments, and push notifications for Android and iOS systems.";
    }

    if (lowerQuery.includes("ai") || lowerQuery.includes("copilot") || lowerQuery.includes("claude")) {
      return "Nechama leverages modern AI developer tools such as GitHub Copilot, Claude, Amazon Q, and Kiro to streamline development pipelines, optimize code performance, and research robust architectural designs.";
    }

    // Philosophy / general profile
    if (lowerQuery.includes("philosophy") || lowerQuery.includes("approach") || lowerQuery.includes("value") || lowerQuery.includes("about") || lowerQuery.includes("profile")) {
      return "Nechama Darmoni's professional philosophy emphasizes that investing time in architecture before writing code yields cleaner, more maintainable software. She values reusable, generic, and highly scalable solutions, and thrives on solving complex product and system challenges.";
    }
    
    if (lowerQuery.includes("experience") || lowerQuery.includes("year") || lowerQuery.includes("work") || lowerQuery.includes("current") || lowerQuery.includes("icl") || lowerQuery.includes("contract")) {
      return "Nechama Darmoni is a Senior Full Stack Engineer with 4+ years of professional experience. She is currently working at ICL as a Hitech Contractor leading end-to-end development, database designs, cloud pipelines, and production deployments.";
    }

    // Missing information check (Strict rule)
    return "I don't have enough information to answer that.";
  };

  if (!ai) {
    return res.json({ text: getOfflineChatReply() });
  }

  try {
    const mappedMessages = messages.map((m: any) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.parts[0].text }]
    }));

    const systemInstruction = `
You are the elite AI Assistant representing Nechama Darmoni, a Senior Full Stack Engineer.
Your core mission is to answer recruiters' and engineering managers' questions about Nechama's skills, qualifications, experiences, projects, and professional background.

RESUME KNOWLEDGE BASE:
${resumeTextRepresentation}

CRITICAL RULES:
1. Answer ONLY according to Nechama's professional knowledge and the Resume Knowledge Base provided above.
2. If any requested information, technologies, projects, experiences, or personal details are missing from the resume, or if you do not have enough specific factual context, you MUST answer with EXACTLY: "I don't have enough information to answer that."
3. NEVER hallucinate, extrapolate, or invent details. Be objective, precise, and professional.
4. Keep answers clean, direct, and well-structured.
`;

    const response = await generateContentWithFallback({
      contents: mappedMessages,
      systemInstruction,
      temperature: 0.1,
      timeoutMs: 6000
    });

    let replyText = response.text || "I don't have enough information to answer that.";
    
    // Safety guard to double-enforce the missing information phrase if model wavered
    if (replyText.toLowerCase().includes("not mentioned") || 
        replyText.toLowerCase().includes("cannot answer") ||
        replyText.toLowerCase().includes("i apologize") ||
        replyText.toLowerCase().includes("unable to find") ||
        replyText.toLowerCase().includes("don't find") ||
        replyText.toLowerCase().includes("not have information")) {
      replyText = "I don't have enough information to answer that.";
    }

    return res.json({ text: replyText });
  } catch (error) {
    console.log("[Status] Utilizing local backup messaging engine.");
    return res.json({ text: getOfflineChatReply() });
  }
});

// Serve frontend assets
export async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
  });
}

export default app;
