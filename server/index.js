import express from "express";
import cors from "cors";
import groq from "./utils/groq.js";
import connectDB from "./config/db.js";
import Analysis from "./models/Analysis.js";
import authRoutes from "./routes/authRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import cookieParser from "cookie-parser";
import optionalAuth from "./middlewares/optionalAuth.js";

connectDB();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/api", historyRoutes);

app.post("/analyze", optionalAuth, async (req, res) => {
  try {
    let { code, question } = req.body;

    const cleanCode = code?.trim();
    const cleanQuestion = question?.trim();

    if (!cleanCode && !cleanQuestion) {
      return res.status(400).json({
        error: "No input provided",
      });
    }

    let prompt;

    if (cleanQuestion && cleanCode) {
      prompt = `
You are an expert DSA mentor.

Problem:
${cleanQuestion}

User Code:
${cleanCode}

Evaluate the solution strictly.

IMPORTANT:
- Use strictly valid JSON
- Use double quotes only
- No trailing commas
- No markdown
- No extra text
- Tags must be relevant DSA topics (Array, DP, Graph, Greedy, etc.)
- Difficulty must be one of: Easy, Medium, Hard

CONTENT QUALITY RULES:

- Avoid one-line answers
- Each explanation must be detailed (at least 4–6 lines)
- Focus on intuition, not just the result
- Clearly explain WHY the approach works
- Clearly explain WHEN to use the approach
- Use simple and clear language (like teaching a student)

APPROACH RULES:

- Always provide exactly 3 approaches:
  1. Brute Force
  2. Better
  3. Optimal

- For each approach explanation, include:
  - Core idea
  - Intuition behind it
  - High-level steps (no code)

HINT RULES:

- Provide exactly 3 hints:
  - Hint 1: very small clue
  - Hint 2: moderate guidance
  - Hint 3: near-solution explanation (but no full solution)

EVALUATION RULES (if code is provided):

- Be honest and critical
- Clearly state if the user is on the correct path
- Mention what is good
- Mention mistakes or inefficiencies
- Mention missing edge cases
- Suggest improvements

TAGS & DIFFICULTY:

- Tags must be relevant DSA topics (e.g., Array, Hashing, DP, Graph, Greedy, Sliding Window, etc.)
- Provide 2–4 meaningful tags
- Difficulty must be exactly one of: Easy, Medium, Hard

GENERAL:

- Do NOT hallucinate missing details
- If context is unclear, say it clearly
- Do NOT provide full code solutions
- Focus on learning and problem-solving guidance

Return ONLY JSON:

{
  "tags": ["", ""],
  "difficulty": "",
  "evaluation": {
    "isCorrectDirection": true,
    "whatIsGood": "",
    "issues": "",
    "missingEdgeCases": "",
    "improvements": ""
  },
  "complexity": {
    "time": "",
    "space": ""
  },
  "approaches": [
    {
      "type": "Brute Force",
      "explanation": "",
      "timeComplexity": "",
      "spaceComplexity": ""
    },
    {
      "type": "Better",
      "explanation": "",
      "timeComplexity": "",
      "spaceComplexity": ""
    },
    {
      "type": "Optimal",
      "explanation": "",
      "timeComplexity": "",
      "spaceComplexity": ""
    }
  ],
  "bestApproach": "",
  "hints": ["", "", ""]
}
`;
    }

    else if (cleanQuestion) {
      prompt = `
Solve this DSA problem:

${cleanQuestion}

IMPORTANT:
- Strict valid JSON
- No markdown
- No trailing commas
- Tags must be relevant DSA topics (Array, DP, Graph, Greedy, etc.)
- Difficulty must be one of: Easy, Medium, Hard

CONTENT QUALITY RULES:

- Avoid one-line answers
- Each explanation must be detailed (at least 4–6 lines)
- Focus on intuition, not just the result
- Clearly explain WHY the approach works
- Clearly explain WHEN to use the approach
- Use simple and clear language (like teaching a student)

APPROACH RULES:

- Always provide exactly 3 approaches:
  1. Brute Force
  2. Better
  3. Optimal

- For each approach explanation, include:
  - Core idea
  - Intuition behind it
  - High-level steps (no code)

HINT RULES:

- Provide exactly 3 hints:
  - Hint 1: very small clue
  - Hint 2: moderate guidance
  - Hint 3: near-solution explanation (but no full solution)

EVALUATION RULES (if code is provided):

- Be honest and critical
- Clearly state if the user is on the correct path
- Mention what is good
- Mention mistakes or inefficiencies
- Mention missing edge cases
- Suggest improvements

TAGS & DIFFICULTY:

- Tags must be relevant DSA topics (e.g., Array, Hashing, DP, Graph, Greedy, Sliding Window, etc.)
- Provide 2–4 meaningful tags
- Difficulty must be exactly one of: Easy, Medium, Hard

GENERAL:

- Do NOT hallucinate missing details
- If context is unclear, say it clearly
- Do NOT provide full code solutions
- Focus on learning and problem-solving guidance

Return ONLY JSON:

{
  "tags": ["", ""],
  "difficulty": ""
  "approaches": [
    {
      "type": "Brute Force",
      "explanation": "",
      "timeComplexity": "",
      "spaceComplexity": ""
    },
    {
      "type": "Better",
      "explanation": "",
      "timeComplexity": "",
      "spaceComplexity": ""
    },
    {
      "type": "Optimal",
      "explanation": "",
      "timeComplexity": "",
      "spaceComplexity": ""
    }
  ],
  "bestApproach": "",
  "hints": ["", "", ""]
}
`;
    }

    else {
      prompt = `
Analyze this code:

${cleanCode}

IMPORTANT:
- If problem unclear, say "Insufficient context"
- Strict valid JSON
- No markdown
- No trailing commas

CONTENT QUALITY RULES:

- Avoid one-line answers
- Use simple and clear language (like teaching a student)

EVALUATION RULES:

- Be honest and critical
- Clearly state if the user is on the correct path
- Mention what is good
- Mention mistakes or inefficiencies
- Mention missing edge cases
- Suggest improvements

Return ONLY JSON:

{
  "evaluation": {
    "isCorrectDirection": true,
    "whatIsGood": "",
    "issues": "",
    "improvements": ""
  },
  "complexity": {
    "time": "",
    "space": ""
  }
}
`;
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are an expert DSA mentor." },
        { role: "user", content: prompt },
      ],
    });

    let aiText = response.choices[0].message.content;

    aiText = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const jsonMatch = aiText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return res.json({ error: "No JSON found", raw: aiText });
    }

    let jsonString = jsonMatch[0];

    jsonString = jsonString
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]");  

    let parsed;

    try {
      parsed = JSON.parse(jsonString);
    } catch (err) {
      console.error("JSON parse failed:", err);

      return res.json({
        error: "Invalid JSON",
        raw: aiText,
      });
    }

    if (req.user) {
      await Analysis.create({
        userId: req.user.id,
        type:
          cleanQuestion && cleanCode
            ? "both"
            : cleanQuestion
            ? "question"
            : "code",
        input: {
          question: cleanQuestion,
          code: cleanCode,
        },
        response: parsed,
      });
    }

    res.json(parsed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(PORT, () => {
  console.log(`${PORT}`);
});
