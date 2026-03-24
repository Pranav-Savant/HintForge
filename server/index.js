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

Solve the following DSA problem step by step:

1. Restate the problem clearly
2. Identify constraints and important observations

DEPENDENCY ANALYSIS (MANDATORY):

- Clearly state what each output element depends on.
- Determine whether the dependency is:
  - Local (row/column/neighbors), OR
  - Global (entire array/matrix)
- Only use approaches that match this dependency.
- If dependency is global, DO NOT use row-wise or column-wise shortcuts unless proven correct.

3. Start from brute force and improve logically
4. Derive the optimal approach with justification
5. Explain why other intuitive approaches fail
6. Carefully handle constraints like modulo and division
7. Dry run the solution on a small example to verify correctness
8. Provide time and space complexity
9. Give a confidence score (0–100%) and explain it

IMPORTANT:
- Use strictly valid JSON
- Use double quotes only
- No trailing commas
- No markdown
- No extra text
- Tags must be relevant DSA topics (Array, DP, Graph, Greedy, etc.)
- Difficulty must be one of: Easy, Medium, Hard
- Do NOT assume patterns like prefix sum/product unless proven
- Do NOT guess formulas
- If unsure, say "I am not certain"
- Prioritize correctness over sounding confident

- Before using any known pattern (DP, prefix sum/product, greedy, etc.), you MUST justify why it applies to this problem.
- If justification is missing, do NOT use that pattern.

Before finalizing the solution, verify the following:

1. If modulo is used:
   - Check whether division is valid under this modulo
   - If not, avoid division-based approaches

2. If multiplication/product is involved:
   - Consider overflow and modulo handling

3. If the problem is multi-dimensional:
   - Clearly explain how the approach extends to that dimension

4. Check edge cases:
   - Zero values
   - Minimum/maximum constraints
   - Duplicate values if relevant

5. Validate the approach with a small example

Self-Check:

- Is any step using division under modulo? If yes, verify correctness.
- Does the approach fail for edge cases like zero or duplicates?
- Is the logic valid for all dimensions (1D/2D/etc)?
- Test with a small example and confirm output.

If confidence < 90%, re-evaluate the solution before answering.

Do not introduce concepts that are not directly required by the problem unless you clearly justify why they are necessary.

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

FINAL VERIFICATION (MANDATORY):

Before giving final answer, verify:

1. Does the approach actually compute what the problem asks for?
2. Try a small example and check if your logic produces the correct result.
3. Check if any step introduces unrelated concepts (like diagonal, row/column separation when not required).
4. If any inconsistency is found, FIX the approach before output.

If verification fails, regenerate the solution.

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
}`;
            }

            else if (cleanQuestion) {
              prompt = `You are an expert DSA mentor.

Problem:
${cleanQuestion}

User Code:
${cleanCode}

Evaluate the solution strictly.

Solve the following DSA problem step by step:

1. Restate the problem clearly
2. Identify constraints and important observations

DEPENDENCY ANALYSIS (MANDATORY):

- Clearly state what each output element depends on.
- Determine whether the dependency is:
  - Local (row/column/neighbors), OR
  - Global (entire array/matrix)
- Only use approaches that match this dependency.
- If dependency is global, DO NOT use row-wise or column-wise shortcuts unless proven correct.

3. Start from brute force and improve logically
4. Derive the optimal approach with justification
5. Explain why other intuitive approaches fail
6. Carefully handle constraints like modulo and division
7. Dry run the solution on a small example to verify correctness
8. Provide time and space complexity
9. Give a confidence score (0–100%) and explain it

IMPORTANT:
- Use strictly valid JSON
- Use double quotes only
- No trailing commas
- No markdown
- No extra text
- Tags must be relevant DSA topics (Array, DP, Graph, Greedy, etc.)
- Difficulty must be one of: Easy, Medium, Hard
- Do NOT assume patterns like prefix sum/product unless proven
- Do NOT guess formulas
- If unsure, say "I am not certain"
- Prioritize correctness over sounding confident

- Before using any known pattern (DP, prefix sum/product, greedy, etc.), you MUST justify why it applies to this problem.
- If justification is missing, do NOT use that pattern.

Before finalizing the solution, verify the following:

1. If modulo is used:
   - Check whether division is valid under this modulo
   - If not, avoid division-based approaches

2. If multiplication/product is involved:
   - Consider overflow and modulo handling

3. If the problem is multi-dimensional:
   - Clearly explain how the approach extends to that dimension

4. Check edge cases:
   - Zero values
   - Minimum/maximum constraints
   - Duplicate values if relevant

5. Validate the approach with a small example

Self-Check:

- Is any step using division under modulo? If yes, verify correctness.
- Does the approach fail for edge cases like zero or duplicates?
- Is the logic valid for all dimensions (1D/2D/etc)?
- Test with a small example and confirm output.

If confidence < 90%, re-evaluate the solution before answering.

Do not introduce concepts that are not directly required by the problem unless you clearly justify why they are necessary.

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

FINAL VERIFICATION (MANDATORY):

Before giving final answer, verify:

1. Does the approach actually compute what the problem asks for?
2. Try a small example and check if your logic produces the correct result.
3. Check if any step introduces unrelated concepts (like diagonal, row/column separation when not required).
4. If any inconsistency is found, FIX the approach before output.

If verification fails, regenerate the solution.

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
}`;
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
