import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

const getAIClient = () => {
  const apiKey = localStorage.getItem('gemini_api_key') || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export const improveText = async (text: string, type: 'summary' | 'bullet' | 'fix_summary', context?: string): Promise<string> => {
  try {
    const ai = getAIClient();
    let prompt = "";

    if (type === 'summary') {
      prompt = `Rewrite the following professional summary to be more impactful, concise, and ATS-friendly. Keep it under 4 sentences. Text: "${text}"`;
    } else if (type === 'bullet') {
      prompt = `Rewrite the following resume bullet point to use the STAR method (Situation, Task, Action, Result) if possible, using strong action verbs. Keep it concise. Text: "${text}"`;
    } else if (type === 'fix_summary') {
      prompt = `
        Rewrite the following professional summary to specifically include these missing keywords/skills naturally: ${context}.
        Do not just list them; weave them into the narrative. Keep it professional and under 5 sentences.
        Original Text: "${text}"
      `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || text;
  } catch (error: any) {
    console.error("AI Improvement failed", error);
    if (error.message === 'API_KEY_MISSING') throw error;
    return text; // Fallback to original
  }
};

export const parseResumeFromText = async (text: string): Promise<any> => {
  try {
    const ai = getAIClient();
    const prompt = `
      Extract resume information from the following text and return it as a JSON object adhering strictly to the JSON Resume schema structure (basics, work, education, skills, projects).
      Ensure standard field names are used.
      
      Text to parse:
      ${text}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("AI Parsing failed", error);
    throw error;
  }
};

export const parseResumeFromPdf = async (base64Data: string, mimeType: string): Promise<any> => {
    try {
        const ai = getAIClient();
        const prompt = `
            You are a professional resume parser. Extract information from this resume document and return it as a JSON object.
            
            Follow this strict structure:
            {
              "basics": { "name": "", "label": "", "email": "", "phone": "", "url": "", "summary": "", "location": { "city": "", "region": "" }, "profiles": [] },
              "work": [{ "name": "", "position": "", "startDate": "", "endDate": "", "highlights": [] }],
              "education": [{ "institution": "", "area": "", "studyType": "", "startDate": "", "endDate": "" }],
              "skills": [{ "name": "Category", "keywords": [] }],
              "projects": [],
              "certifications": []
            }

            If dates are present, format them as YYYY-MM. 
            For skills, try to group them logically.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp', // Using 2.0 Flash for better multimodal document understanding
            contents: {
                role: 'user',
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType, data: base64Data } }
                ]
            },
            config: {
                responseMimeType: "application/json"
            }
        });

        return JSON.parse(response.text || "{}");
    } catch (error: any) {
        console.error("AI PDF Parsing failed", error);
        throw error;
    }
};

export interface JobMatchAnalysis {
    score: number;
    missingKeywords: string[];
    suggestions: string[];
}

export const analyzeJobMatch = async (resumeData: ResumeData, jobDescription: string): Promise<JobMatchAnalysis> => {
    try {
        const ai = getAIClient();
        
        // Prepare a simplified version of resume to reduce token count
        const resumeContext = JSON.stringify({
            summary: resumeData.basics.summary,
            skills: resumeData.skills.map(s => s.keywords).flat(),
            experience: resumeData.work.map(w => `${w.position} at ${w.name}: ${w.highlights.join(' ')}`).join('\n')
        });

        const prompt = `
            You are an expert ATS (Applicant Tracking System) scanner.
            Compare the following Resume Data against the provided Job Description.

            1. Calculate a match score (0-100) based on skills and relevance.
            2. Identify critical keywords or skills from the Job Description that are MISSING from the resume.
            3. Provide 3 specific, actionable suggestions to improve the resume for this specific job.

            Resume Data:
            ${resumeContext}

            Job Description:
            ${jobDescription}

            Return strict JSON:
            {
                "score": number,
                "missingKeywords": ["string", "string"],
                "suggestions": ["string", "string", "string"]
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        return JSON.parse(response.text || "{}");
    } catch (error: any) {
        console.error("Job Analysis failed", error);
        if (error.message === 'API_KEY_MISSING') throw error;
        return { score: 0, missingKeywords: [], suggestions: ["AI Analysis Failed"] };
    }
};
