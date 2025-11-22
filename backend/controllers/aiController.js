// @desc    Generate questions using AI
// @route   POST /api/ai/generate-questions
// @access  Private (HR only)
export const generateQuestions = async (req, res) => {
  try {
    const { jobProfile, numberOfQuestions = 20 } = req.body;

    if (!jobProfile) {
      return res.status(400).json({ message: 'Job profile is required' });
    }

    // Validate number of questions
    const numQuestions = Math.min(Math.max(parseInt(numberOfQuestions), 5), 30);

    // AI Integration Point
    // Replace this with actual AI API call (OpenAI, Anthropic, etc.)
    // For now, we'll use a template-based generator

    const questions = await generateQuestionsForProfile(jobProfile, numQuestions);

    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to generate questions
// REPLACE THIS WITH ACTUAL AI API CALL
async function generateQuestionsForProfile(jobProfile, count) {
  // This is a placeholder. In production, you would:
  // 1. Use OpenAI API, Anthropic Claude, or similar
  // 2. Pass the job profile and number of questions
  // 3. Parse and normalize the response

  // Example with OpenAI (uncomment and configure when ready):
  /*
  import OpenAI from 'openai';

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const completion = await openai.chat.completions.create({
    model: process.env.AI_MODEL || "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an expert technical interviewer. Generate multiple choice interview questions with 4 options each."
      },
      {
        role: "user",
        content: `Generate ${count} multiple choice interview questions for a ${jobProfile} position.
        Return ONLY a JSON array with this exact format:
        [
          {
            "questionText": "question here",
            "type": "mcq",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option B"
          }
        ]
        Make questions practical and relevant to the role.`
      }
    ],
    temperature: 0.8,
  });

  const response = completion.choices[0].message.content;
  const questions = JSON.parse(response);
  return questions;
  */

  // Placeholder template-based questions
  const questionTemplates = getQuestionTemplatesForProfile(jobProfile, count);

  return questionTemplates;
}

// Template-based question generator (fallback/demo)
function getQuestionTemplatesForProfile(jobProfile, count) {
  const profile = jobProfile.toLowerCase();

  // Default questions bank
  const defaultQuestions = [
    {
      questionText: `What are the key responsibilities of a ${jobProfile}?`,
      type: "mcq",
      options: [
        "Only writing code",
        "Design, development, testing, and maintenance",
        "Only attending meetings",
        "Only documentation"
      ],
      correctAnswer: "Design, development, testing, and maintenance"
    },
    {
      questionText: "What is the purpose of version control systems?",
      type: "mcq",
      options: [
        "To track changes and collaborate on code",
        "To compile code",
        "To run tests",
        "To deploy applications"
      ],
      correctAnswer: "To track changes and collaborate on code"
    },
    {
      questionText: "Which of the following is a best practice in software development?",
      type: "mcq",
      options: [
        "Writing code without comments",
        "Skipping code reviews",
        "Writing clean, maintainable, and well-documented code",
        "Deploying directly to production"
      ],
      correctAnswer: "Writing clean, maintainable, and well-documented code"
    },
    {
      questionText: "What does CI/CD stand for?",
      type: "mcq",
      options: [
        "Continuous Integration / Continuous Deployment",
        "Code Integration / Code Deployment",
        "Central Integration / Central Development",
        "Computer Integration / Computer Development"
      ],
      correctAnswer: "Continuous Integration / Continuous Deployment"
    },
    {
      questionText: "What is the main benefit of automated testing?",
      type: "mcq",
      options: [
        "It slows down development",
        "It catches bugs early and ensures code quality",
        "It replaces manual development",
        "It eliminates the need for developers"
      ],
      correctAnswer: "It catches bugs early and ensures code quality"
    }
  ];

  // Role-specific questions
  let roleQuestions = [];

  if (profile.includes('react') || profile.includes('frontend') || profile.includes('javascript')) {
    roleQuestions = [
      {
        questionText: "What is the Virtual DOM in React?",
        type: "mcq",
        options: [
          "A real DOM element",
          "A lightweight copy of the real DOM",
          "A database",
          "A server-side rendering tool"
        ],
        correctAnswer: "A lightweight copy of the real DOM"
      },
      {
        questionText: "What is the purpose of useEffect hook in React?",
        type: "mcq",
        options: [
          "To manage state",
          "To perform side effects in functional components",
          "To create components",
          "To style components"
        ],
        correctAnswer: "To perform side effects in functional components"
      },
      {
        questionText: "What is JSX?",
        type: "mcq",
        options: [
          "A database query language",
          "JavaScript XML - syntax extension for JavaScript",
          "A CSS framework",
          "A testing library"
        ],
        correctAnswer: "JavaScript XML - syntax extension for JavaScript"
      },
      {
        questionText: "What is the difference between props and state in React?",
        type: "mcq",
        options: [
          "Props are mutable, state is immutable",
          "Props are passed from parent, state is managed within component",
          "They are the same thing",
          "Props are for styling, state is for data"
        ],
        correctAnswer: "Props are passed from parent, state is managed within component"
      },
      {
        questionText: "What is React Router used for?",
        type: "mcq",
        options: [
          "State management",
          "Navigation and routing in React applications",
          "API calls",
          "Styling components"
        ],
        correctAnswer: "Navigation and routing in React applications"
      },
      {
        questionText: "What is the purpose of useState hook?",
        type: "mcq",
        options: [
          "To add state to functional components",
          "To fetch data from APIs",
          "To navigate between pages",
          "To style components"
        ],
        correctAnswer: "To add state to functional components"
      },
      {
        questionText: "What is prop drilling in React?",
        type: "mcq",
        options: [
          "A performance optimization technique",
          "Passing props through multiple levels of components",
          "A testing method",
          "A build tool"
        ],
        correctAnswer: "Passing props through multiple levels of components"
      },
      {
        questionText: "What is the Context API used for in React?",
        type: "mcq",
        options: [
          "Styling components",
          "Managing and sharing state across components without prop drilling",
          "Routing",
          "Form validation"
        ],
        correctAnswer: "Managing and sharing state across components without prop drilling"
      }
    ];
  } else if (profile.includes('node') || profile.includes('backend') || profile.includes('express')) {
    roleQuestions = [
      {
        questionText: "What is Node.js?",
        type: "mcq",
        options: [
          "A frontend framework",
          "A JavaScript runtime built on Chrome's V8 engine",
          "A database",
          "A CSS preprocessor"
        ],
        correctAnswer: "A JavaScript runtime built on Chrome's V8 engine"
      },
      {
        questionText: "What is Express.js?",
        type: "mcq",
        options: [
          "A database",
          "A minimal and flexible Node.js web application framework",
          "A frontend library",
          "A testing framework"
        ],
        correctAnswer: "A minimal and flexible Node.js web application framework"
      },
      {
        questionText: "What is middleware in Express?",
        type: "mcq",
        options: [
          "A database layer",
          "Functions that have access to request and response objects",
          "A frontend component",
          "A deployment tool"
        ],
        correctAnswer: "Functions that have access to request and response objects"
      },
      {
        questionText: "What is the purpose of package.json?",
        type: "mcq",
        options: [
          "To store database credentials",
          "To manage project metadata and dependencies",
          "To compile code",
          "To style applications"
        ],
        correctAnswer: "To manage project metadata and dependencies"
      },
      {
        questionText: "What is npm?",
        type: "mcq",
        options: [
          "Node Package Manager",
          "New Programming Method",
          "Network Protocol Manager",
          "Node Performance Monitor"
        ],
        correctAnswer: "Node Package Manager"
      },
      {
        questionText: "What is the event loop in Node.js?",
        type: "mcq",
        options: [
          "A debugging tool",
          "The mechanism that handles asynchronous operations",
          "A database connection pool",
          "A testing framework"
        ],
        correctAnswer: "The mechanism that handles asynchronous operations"
      }
    ];
  } else if (profile.includes('python') || profile.includes('django') || profile.includes('flask')) {
    roleQuestions = [
      {
        questionText: "What is Python primarily known for?",
        type: "mcq",
        options: [
          "Mobile development only",
          "Readability and versatility across multiple domains",
          "Game development only",
          "Hardware programming only"
        ],
        correctAnswer: "Readability and versatility across multiple domains"
      },
      {
        questionText: "What is a Python decorator?",
        type: "mcq",
        options: [
          "A styling tool",
          "A function that modifies another function",
          "A database query",
          "A testing framework"
        ],
        correctAnswer: "A function that modifies another function"
      },
      {
        questionText: "What is the difference between a list and a tuple in Python?",
        type: "mcq",
        options: [
          "Lists are immutable, tuples are mutable",
          "Lists are mutable, tuples are immutable",
          "They are the same",
          "Lists are for numbers, tuples are for strings"
        ],
        correctAnswer: "Lists are mutable, tuples are immutable"
      },
      {
        questionText: "What is pip in Python?",
        type: "mcq",
        options: [
          "Python's package installer",
          "A web framework",
          "A database",
          "A testing tool"
        ],
        correctAnswer: "Python's package installer"
      }
    ];
  } else if (profile.includes('java') || profile.includes('spring')) {
    roleQuestions = [
      {
        questionText: "What is the main principle of Object-Oriented Programming in Java?",
        type: "mcq",
        options: [
          "Procedural programming",
          "Encapsulation, Inheritance, Polymorphism, and Abstraction",
          "Functional programming only",
          "Assembly programming"
        ],
        correctAnswer: "Encapsulation, Inheritance, Polymorphism, and Abstraction"
      },
      {
        questionText: "What is the JVM?",
        type: "mcq",
        options: [
          "Java Virtual Machine - executes Java bytecode",
          "A text editor",
          "A database",
          "A web browser"
        ],
        correctAnswer: "Java Virtual Machine - executes Java bytecode"
      },
      {
        questionText: "What is the difference between JDK and JRE?",
        type: "mcq",
        options: [
          "They are the same",
          "JDK is for development, JRE is for running Java applications",
          "JDK is older version",
          "JRE is for development only"
        ],
        correctAnswer: "JDK is for development, JRE is for running Java applications"
      }
    ];
  }

  // Combine role-specific and general questions
  const allQuestions = [...roleQuestions, ...defaultQuestions];

  // Return requested number of questions
  const selectedQuestions = [];
  const usedIndices = new Set();

  while (selectedQuestions.length < count && selectedQuestions.length < allQuestions.length) {
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    if (!usedIndices.has(randomIndex)) {
      selectedQuestions.push(allQuestions[randomIndex]);
      usedIndices.add(randomIndex);
    }
  }

  // If we need more questions, duplicate some with variations
  while (selectedQuestions.length < count) {
    const baseQuestion = allQuestions[selectedQuestions.length % allQuestions.length];
    selectedQuestions.push({
      ...baseQuestion,
      questionText: `[Advanced] ${baseQuestion.questionText}`
    });
  }

  return selectedQuestions;
}
