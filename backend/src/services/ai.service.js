import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import puppeteer from "puppeteer";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// async function invokeGeminiAi() {
//     const response = await ai.models.generateContent({
//         model: "gemini-3.6-flash",
//         contents: "Hello Gemini! Explain what is an interview?",
//     });

//     console.log(response.text);
// }

const interviewReportSchema = z.object({
    matchScore: z.number()
        .min(0)
        .max(100)
        .describe("The overall match score from 0 to 100 representing how well the candidate's resume, skills, and experience match the requirements of the job description"),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intentions"),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),

    skillGap: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap: low means the candidate has some knowledge but needs improvement, medium means the skill is partially missing or insufficient for the job, and high means the skill is completely missing or critically required for the job.")
    })).describe("A list of important skills that the candidate is missing or needs to improve to better match the requirements of the job description."),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number of the preparation plan"),
        focus: z.string().describe("The main topic or skill the candidate should focus on that day"),
        tasks: z.array(z.string()).describe("The specific tasks the candidate should complete on that day")
    })).describe("A structured preparation plan that helps the candidate improve their skill gaps and prepare for the target job"),

    title: z.string().describe("The title of the job for which the interview report is generated"),
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `
    Generate a personalized interview report for the candidate based on their resume, self-description, and the given job description.

    Resume:
    ${resume}

    Self Description:
    ${selfDescription}

    Job Description:
    ${jobDescription}

    Analyze all three carefully and generate the interview report according to the provided schema.
    `;

    const response = await ai.interactions.create({
        model: "gemini-3.6-flash",
        input: prompt,
        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: z.toJSONSchema(interviewReportSchema),
        },
    });

    const interviewReport = interviewReportSchema.parse(
        JSON.parse(response.output_text)
    );

    return interviewReport;
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
        ],
    });

    try {
        const page = await browser.newPage();

        await page.setContent(htmlContent, {
            waitUntil: "networkidle0",
        });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20px",
                right: "20px",
                bottom: "20px",
                left: "20px",
            },
        });

        return pdfBuffer;
    } finally {
        await browser.close();
    }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to pdf using puppeteer"),
    });

    const prompt = `Create a professional, ATS-friendly resume for the candidate using the information provided below.

    Resume:
    ${resume}

    Self Description:
    ${selfDescription}

    Job Description:
    ${jobDescription}

    Instructions:
    - Use the candidate's actual information and do not invent companies, education, skills, experience, projects, achievements, or dates.
    - Tailor the resume toward the given job description by highlighting the candidate's most relevant skills, experience, and projects.
    - Keep the resume concise, professional, and suitable for a job application.
    - Use clear sections such as Summary, Skills, Experience, Projects, Education, and Certifications when the information is available.
    - Prioritize information that is relevant to the target job.
    - Improve wording and structure where appropriate, but do not fabricate information.
    - Make the resume ATS-friendly with simple headings, readable typography, proper spacing, and a clean professional layout.
    - Generate complete, valid HTML with embedded CSS so it can be directly converted to a PDF using Puppeteer.
    - The HTML should be designed for A4 paper and should have professional margins, spacing, typography, and page-break handling.
    - Do not include markdown, explanations, or code fences.
    - Return only a JSON object with a single field "html" containing the complete HTML document.

    The final HTML must be ready to render directly in Puppeteer.`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: z.toJSONSchema(resumePdfSchema),
        },
    });

    
    const jsonContent = JSON.parse(
      response.text.replace(/```json|```/g, "").trim()
    );
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;
}

export {
    generateInterviewReport,
    generateResumePdf,
};