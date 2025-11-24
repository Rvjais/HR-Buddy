// @desc    Generate questions using AI
// @route   POST /api/ai/generate-questions
// @access  Private (HR only)
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateQuestions = async (req, res) => {
  try {
    const { jobProfile, numberOfQuestions = 20 } = req.body;

    if (!jobProfile) {
      return res.status(400).json({ message: 'Job profile is required' });
    }

    // Validate number of questions
    const numQuestions = Math.min(Math.max(parseInt(numberOfQuestions), 5), 30);

    const questions = await generateQuestionsForProfile(jobProfile, numQuestions);

    res.json({ questions });
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate questions' });
  }
};

async function generateQuestionsForProfile(jobProfile, count) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-pro which is widely available and stable
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are an expert technical interviewer. Generate ${count} multiple choice interview questions for a ${jobProfile} position.
    
    Return ONLY a raw JSON array (no markdown formatting, no code blocks) with this exact schema for each question:
    [
      {
        "questionText": "The actual question string",
        "type": "mcq",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "The correct option string (must match one of the options exactly)"
      }
    ]

    Requirements:
    1. Questions should be practical and relevant to ${jobProfile}.
    2. Provide exactly 4 options for each question.
    3. Ensure the correctAnswer matches one option exactly.
    4. Do not wrap the output in \`\`\`json or any other text. Return ONLY the JSON string.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up potential markdown formatting if the model adds it despite instructions
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const questions = JSON.parse(text);
    return questions;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to template questions if API fails (optional, but good for stability)
    // For now, we'll throw the error to let the user know configuration might be wrong
    throw new Error("Failed to generate questions with AI: " + error.message);
  }
}
