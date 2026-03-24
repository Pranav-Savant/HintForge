import { useState, useEffect } from "react";
import { analyzeCode } from "../services/api.js";
import { useLocation } from "react-router-dom";

function App() {
  const [code, setCode] = useState("");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  loading
  const location = useLocation();

  useEffect(() => {
    if (location.state?.result) {
      setResponse(location.state.result);
    }
  }, [location.state]);

  const handleAnalyze = async () => {
    try {
      if (!code.trim() && !question.trim()) {
        setResponse({ error: "Please enter problem or code" });
        return;
      }

      setLoading(true);
      setResponse(null);

      const res = await analyzeCode({ code, question });

      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setResponse({ error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">

      <h1 className="text-4xl font-bold mb-6 text-blue-600">
        HintForge
      </h1>

      <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-md">

        <h3 className="text-lg font-semibold mb-2">Problem</h3>
        <textarea
          className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          rows="4"
          placeholder="Enter problem description..."
          value={question}
          onChange={(e) => {
            setResponse(null);
            setQuestion(e.target.value);
          }}
        />

        <h3 className="text-lg font-semibold mb-2"> Your Code</h3>
        <textarea
          className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          rows="6"
          placeholder="Paste your code..."
          value={code}
          onChange={(e) => {
            setResponse(null);
            setCode(e.target.value);
          }}
        />

        <p className="text-sm text-gray-500 mb-4">
          💡 Best results when both problem and code are provided
        </p>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`px-6 py-2 rounded-lg text-white transition ${loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
        {loading && (
          <p className="mt-4 text-gray-500 animate-pulse">
            Thinking like a DSA mentor...
          </p>
        )}
      </div>

      {response?.error && (
        <p className="text-red-500 mt-4">{response.error}</p>
      )}

      <div className="mt-6 w-full max-w-4xl space-y-4 animate-fadeIn">
        {response && !response.error && (
          <div className="mt-6 w-full max-w-4xl space-y-4">


            {response.tags && (
              <div className="bg-white p-5 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {response.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {response.difficulty && (
              <div className="bg-white p-5 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-2">Difficulty</h2>
                <span className={`px-3 py-1 rounded-full text-white text-sm ${response.difficulty === "Easy"
                  ? "bg-green-500"
                  : response.difficulty === "Medium"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                  }`}>
                  {response.difficulty}
                </span>
              </div>
            )}
            {response.evaluation && (
              <div className="bg-white p-5 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-2">Evaluation</h2>
                <p>
                  <b>Direction:</b>{" "}
                  {response.evaluation.isCorrectDirection
                    ? "Correct ✅"
                    : "Needs Improvement ❌"}
                </p>
                <p><b>Good:</b> {response.evaluation.whatIsGood}</p>
                <p><b>Issues:</b> {response.evaluation.issues}</p>
                <p><b>Improvements:</b> {response.evaluation.improvements}</p>

                {response.complexity && (
                  <>
                    <h3 className="font-semibold mt-3">Complexity</h3>
                    <p><b>Time:</b> {response.complexity.time}</p>
                    <p><b>Space:</b> {response.complexity.space}</p>
                  </>
                )}
              </div>
            )}

            {response.approaches && (
              <div className="bg-white p-5 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-2">Approaches</h2>
                {response.approaches.map((app, index) => (
                  <div key={index} className="mb-3">
                    <h3 className="font-semibold text-blue-600">
                      {app.type}
                    </h3>
                    <p>{app.explanation}</p>
                    <p className="text-sm text-gray-600">
                      Time: {app.timeComplexity} | Space: {app.spaceComplexity}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {response.bestApproach && (
              <div className="bg-white p-5 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-2">Best Approach</h2>
                <p>{response.bestApproach}</p>
              </div>
            )}

            {response.hints && (
              <div className="bg-white p-5 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-2">Hints</h2>
                {response.hints.map((hint, index) => (
                  <p key={index}>👉 {hint}</p>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default App;