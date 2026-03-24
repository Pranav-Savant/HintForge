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

app.use(cors({ origin: ["http://localhost:5173","https://hintforge.netlify.app"], credentials: true }));
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

THINKING PHASE (MANDATORY - DO NOT SKIP):

Before writing the final answer, you MUST internally:
1. Determine what each output element depends on
2. Decide whether dependency is LOCAL or GLOBAL
3. List at least 2 possible approaches
4. Reject incorrect approaches with proper reasoning
5. Select only logically valid approaches

DO NOT output this thinking.

Solve the following DSA problem step by step:

1. Restate the problem clearly
2. Identify constraints and important observations

DEPENDENCY ANALYSIS (MANDATORY):

- Each output element depends on: ______
- Dependency type: (LOCAL / GLOBAL)

- If dependency is GLOBAL:
  - DO NOT use row-wise, column-wise, or diagonal shortcuts unless fully justified

3. Start from brute force and improve logically
4. Derive the optimal approach with justification
5. Explain why other intuitive approaches fail
6. Carefully handle constraints like modulo and division
7. Dry run with a small example
8. Provide time and space complexity
9. Give confidence score

STRICT RULES:
- Do NOT guess patterns
- Do NOT use DP/prefix unless justified
- Reject invalid approaches

SANITY CHECK:
- Verify with small example
- Fix if incorrect

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
You are an expert DSA mentor.

Problem:
${cleanQuestion}

THINKING PHASE (MANDATORY - DO NOT SKIP):

Before writing the final answer, you MUST internally:
1. Determine dependency (LOCAL / GLOBAL)
2. Evaluate possible approaches
3. Reject incorrect ones

Solve the problem step by step with correct logic.

DEPENDENCY RULE:
- If GLOBAL → no row/column tricks

STRICT RULE:
- Do NOT invent approaches

SANITY CHECK:
- Verify with example

Return ONLY JSON:
{
  "tags": ["", ""],
  "difficulty": "",
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

else {
  prompt = `
Analyze this code:

${cleanCode}

IMPORTANT:
- If problem unclear, say "Insufficient context"
- Strict valid JSON
- No markdown
- No trailing commas

Be critical and accurate.

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
