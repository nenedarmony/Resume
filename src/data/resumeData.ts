export interface Project {
  name: string;
  description: string;
  technologies: string[];
  highlights: string[];
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  experienceYears: number;
  currentCompany: string;
  employmentType: string;
  currentRole: string;
  philosophy: string[];
  responsibilities: string[];
  skills: {
    frontend: string[];
    backend: string[];
    cloud: string[];
    databases: string[];
    devops: string[];
    authentication: string[];
    mobile: string[];
    ai: string[];
  };
  projects: Project[];
}

export const resumeData: ResumeData = {
  name: "Nechama Darmoni",
  title: "Senior Full Stack Engineer (Angular & NestJS)",
  subtitle: "High-Performance Distributed Systems | Scalable Cloud Architecture | Elite UI/UX Design",
  description: "Senior Full Stack Engineer with 4+ years of hands-on experience designing and operating event-driven distributed systems, secure cloud backends, and highly interactive, performant frontend applications. Recognized as the team's absolute design and Angular expert, regularly building end-to-end solutions combining fluid, beautifully crafted user interfaces with secure AWS architectures.",
  experienceYears: 4,
  currentCompany: "ICL",
  employmentType: "Hitech Contractor",
  currentRole: "Senior Full Stack Engineer",
  philosophy: [
    "I believe that bridging premium, human-centric user interface design with robust backend architecture is the key to software excellence.",
    "I thrive on designing modular, generic components and clean state management structures that keep applications fluid and scalable.",
    "I value close collaboration across engineering disciplines, driving product success from the database layer directly to the user's viewport."
  ],
  responsibilities: [
    "End-to-End Ownership: Designing and implementing modular Angular frontend architectures and high-performance NestJS REST APIs.",
    "Elite UI/UX Design & Frontend Architecture: Leading component hierarchy, advanced state management, and real-time dashboard layouts in Angular.",
    "Distributed Systems: Building asynchronous, event-driven backends using AWS SQS and reliable queue processors.",
    "Enterprise Security & Auth: Implementing secure REST APIs, role-based access control (RBAC), and Cognito authentication."
  ],
  skills: {
    frontend: ["Angular v16/17 (Architect-Level)", "TypeScript", "RxJS", "State Management (NgRx/Services)", "Component Design & UI/UX Styling"],
    backend: ["NestJS", "Node.js", "TypeScript", "REST APIs", "Event-Driven Backends"],
    cloud: ["AWS (ECS, Lambda, SQS)", "Secrets Manager", "Cognito", "API Gateway", "CloudWatch", "CloudFront", "S3", "IAM", "EC2"],
    databases: ["MongoDB", "PostgreSQL", "MySQL", "Database Schema Design"],
    devops: ["Docker (Local & Production ECS)", "Jenkins CI/CD", "Automated Workflows"],
    authentication: ["OAuth2", "JWT & Refresh Tokens", "AWS Cognito", "Role-Based Access Control (RBAC)", "MSAL", "Secure Token Lifecycles"],
    mobile: ["Android", "iOS"],
    ai: ["Model Context Protocol (MCP)", "Playwright MCP", "AI-assisted Automated Testing", "GitHub Copilot", "Claude"]
  },
  projects: [
    {
      name: "Spain Mining Digitalization",
      description: "An enterprise platform supporting hundreds of users in production and driving critical real-time workflows in mining operations.",
      technologies: ["Angular v16/17", "NestJS", "Node.js", "TypeScript", "MongoDB", "AWS ECS", "Docker", "CloudWatch", "IAM"],
      highlights: [
        "Architect-Level Frontend Design: Created the core Angular application structure, custom reusable UI components, and fluid responsive layouts—established as the team's premier expert on Angular development.",
        "High-Performance Operations Dashboards: Designed and implemented highly interactive, real-time dashboards in Angular, delivering millisecond-accurate updates for complex operational workflows.",
        "End-to-End Product Ownership: Spearheaded both the responsive client interface and robust NestJS REST APIs, taking the product from concept to containerized production.",
        "Containerized Infrastructure: Standardized development environments using Docker and managed high-availability production environments on AWS ECS."
      ]
    },
    {
      name: "WhatsApp Enterprise Integration",
      description: "A highly secure, decoupled business communications engine facilitating Meta WhatsApp Webhook integrations and real-time asynchronous notifications.",
      technologies: ["Meta WhatsApp", "OAuth2", "Lambda Authorizer", "API Gateway", "Cognito", "AWS SQS", "Secrets Manager", "NestJS", "Node.js"],
      highlights: [
        "Event-Driven Distributed Architecture: Built an asynchronous communications pipeline using AWS SQS message queues and API Gateway to ingest webhook events, decoupling internal systems from external API rate-limits.",
        "Enterprise Identity & Access Management: Designed and implemented secure token-based authentication via AWS Cognito, custom Lambda Authorizers, OAuth2, and JSON Web Tokens (JWT) with rigorous validation lifecycles.",
        "Data Protection & Secret Management: Integrated AWS Secrets Manager to store sensitive Meta API tokens, certificates, and encryption keys, complying with enterprise CIS and security auditor guidelines.",
        "Cross-Functional Architecture: Collaborated with multiple engineering groups, DevOps, and Product Managers to define technical decisions, API contracts, and high-availability message-processing flows."
      ]
    },
    {
      name: "Legacy Modernization & CI/CD",
      description: "Comprehensive refactoring and modernization of core infrastructure systems to improve speed, security, and build efficiency.",
      technologies: ["Node.js 20", "Docker", "Jenkins", "Model Context Protocol (MCP)", "Playwright MCP", "AI-assisted Testing", "CI/CD Pipelines"],
      highlights: [
        "Major Engine Modernization: Spearheaded the complex refactoring and runtime upgrade of a core backend application from Node.js 14 directly to Node.js 20, overcoming legacy dependency deadlocks.",
        "CI/CD Refactoring & Containerization: Migrated development and testing environments into lightweight Docker containers, integrating optimized build-and-test stages in Jenkins CI/CD pipelines.",
        "AI-Assisted Automated Testing: Integrated Model Context Protocol (MCP) and Playwright MCP into local workflows, establishing AI-assisted regression testing to proactively capture and mitigate edge cases.",
        "Technical Leadership & Mentorship: Served as DevOps Referent, defining testing standards, guiding peer backend developers on container workflows, and ensuring modern architectural compliance."
      ]
    }
  ]
};
