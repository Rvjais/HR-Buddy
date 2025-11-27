// @desc    Generate questions using AI
// @route   POST /api/ai/generate-questions
// @access  Private (HR only)
import OpenAI from 'openai';

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
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OpenAI API Key is missing');
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: apiKey.startsWith('sk-or-v1') ? 'https://openrouter.ai/api/v1' : undefined,
      defaultHeaders: apiKey.startsWith('sk-or-v1') ? {
        'HTTP-Referer': 'https://hr-buddy.com', // Optional: Replace with your actual site URL
        'X-Title': 'HR Buddy', // Optional: Replace with your actual site name
      } : undefined
    });

    const prompt = `You are an expert technical interviewer. Generate ${count} interview questions for a ${jobProfile} position.
    
    Include a mix of Multiple Choice Questions (MCQ) and Open-Ended Text Questions.
    At least 20% of the questions should be text-based (type: "text").

    Return ONLY a raw JSON array (no markdown formatting, no code blocks) with this exact schema for each question:
    
    For MCQs:
    {
      "questionText": "The actual question string",
      "type": "mcq",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The correct option string (must match one of the options exactly)"
    }

    For Text Questions:
    {
      "questionText": "The actual question string",
      "type": "text"
    }

    Requirements:
    1. Questions should be practical and relevant to ${jobProfile}.
    2. For MCQs, provide exactly 4 options and ensure correctAnswer matches one option exactly.
    3. For Text Questions, do NOT provide options or correctAnswer.
    4. Do not wrap the output in \`\`\`json or any other text. Return ONLY the JSON string.`;

    console.log('Sending request to OpenAI...');

    const isOpenRouter = apiKey.startsWith('sk-or-v1');
    const model = isOpenRouter ? 'openai/gpt-4o' : 'gpt-4o';

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    let text = completion.choices[0].message.content;

    // Clean up potential markdown formatting if the model adds it despite instructions
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const questions = JSON.parse(text);
    return questions;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate questions with AI: " + error.message);
  }
}
