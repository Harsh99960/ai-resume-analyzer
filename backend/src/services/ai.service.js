import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import * as z from "zod";
import puppeteer from "puppeteer";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const interviewReportSchema = z.object({
    matchScore: z.number()
        .min(0)
        .max(100)
        .describe(
            "The overall match score from 0 to 100 representing how well the candidate's resume, skills, and experience match the requirements of the job description"
        ),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe(
            "How to answer this question, what points to cover, what approach to take etc."
        ),
    })).describe(
        "Technical questions that can be asked in the interview along with their intentions"
    ),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe(
            "How to answer this question, what points to cover, what approach to take etc."
        ),
    })).describe(
        "Behavioral questions that can be asked in interview along with their intention and how to answer them"
    ),

    skillGap: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe(
            "The severity of the skill gap"
        ),
    })).describe(
        "A list of important skills that the candidate is missing or needs to improve"
    ),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number of the preparation plan"),
        focus: z.string().describe(
            "The main topic or skill the candidate should focus on that day"
        ),
        tasks: z.array(z.string()).describe(
            "The specific tasks the candidate should complete on that day"
        ),
    })).describe(
        "A structured preparation plan that helps the candidate improve their skill gaps"
    ),

    title: z.string().describe(
        "The title of the job for which the interview report is generated"
    ),
});


async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription,
}) {
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

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: z.toJSONSchema(interviewReportSchema),
        },
    });

    const interviewReport = interviewReportSchema.parse(
        JSON.parse(response.text)
    );

    return interviewReport;
}


async function generatePdfFromHtml(htmlContent) {
    console.log("Starting Puppeteer PDF generation...");

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

        console.log("PDF generated successfully.");

        return pdfBuffer;
    } finally {
        await browser.close();
    }
}


async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription,
}) {
    const resumePdfSchema = z.object({
        html: z.string().describe(
            "The complete HTML content of the resume which can be converted to PDF using Puppeteer"
        ),
    });

    const prompt = `
Create a professional, ATS-friendly resume for the candidate using the information provided below.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Instructions:

- Use the candidate's actual information.
- Do not invent companies, education, skills, experience, projects, achievements, or dates.
- Tailor the resume toward the given job description.
- Highlight the candidate's most relevant skills, experience, and projects.
- Keep the resume concise, professional, and suitable for a job application.
- Use clear sections such as Summary, Skills, Experience, Projects, Education, and Certifications when the information is available.
- Prioritize information that is relevant to the target job.
- Improve wording and structure where appropriate.
- Do not fabricate information.
- Make the resume ATS-friendly.
- Use simple headings.
- Use readable typography.
- Use professional spacing.
- Generate complete, valid HTML.
- Include embedded CSS.
- Design the HTML for A4 paper.
- Include professional margins and page-break handling.
- Do not include markdown.
- Do not include explanations.
- Do not include code fences.

Return ONLY a JSON object with one field called "html".
The "html" field must contain the complete HTML document.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: z.toJSONSchema(resumePdfSchema),
        },
    });

    console.log("Gemini resume response received.");

    /*
     * Gemini is instructed to return structured JSON.
     * Using the SDK's response text directly avoids manually
     * stripping markdown/code fences from an arbitrary response.
     */
    const jsonContent = resumePdfSchema.parse(
        JSON.parse(response.text)
    );

    console.log("Resume HTML received from Gemini.");

    const pdfBuffer = await generatePdfFromHtml(
        jsonContent.html
    );

    return pdfBuffer;
}


export {
    generateInterviewReport,
    generateResumePdf,
};