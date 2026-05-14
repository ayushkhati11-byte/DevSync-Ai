import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface AuditResult {
  overallScore: number;
  codeQuality: number;
  documentation: number;
  bestPractices: number;
  performance: number;
  techStack: string[];
  strengths: string[];
  suggestions: string[];
  summary: string;
}

export async function auditCode(code: string, repoName: string): Promise<AuditResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = [
    "You are a senior code reviewer. Analyze this repo and give HONEST scores.",
    "Score each dimension 0-100: 90-100=Production-ready, 70-89=Good, 50-69=Average, Below50=Poor",
    "Dimensions: codeQuality, documentation, bestPractices, performance, maintainability",
    "Return techStack (from dependencies and code imports - e.g., React, Next.js, TypeScript, Tailwind, Prisma, etc.)",
    "Repository: " + repoName,
    "Context and code:",
    code.slice(0, 15000),
    "Output JSON with: overallScore, codeQuality, documentation, bestPractices, performance, techStack (array of strings), strengths, suggestions, summary"
  ].join("\n\n");

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI response was not valid JSON");
  }
  
  const parsed = JSON.parse(jsonMatch[0]);
  return {
    overallScore: parsed.overallScore ?? 70,
    codeQuality: parsed.codeQuality ?? 65,
    documentation: parsed.documentation ?? 65,
    bestPractices: parsed.bestPractices ?? 65,
    performance: parsed.performance ?? 65,
    techStack: parsed.techStack ?? [],
    strengths: parsed.strengths ?? [],
    suggestions: parsed.suggestions ?? [],
    summary: parsed.summary ?? "Repository analyzed.",
  };
}