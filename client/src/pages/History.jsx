import { useEffect, useState } from "react";
import { getHistory } from "../services/api";
import { useNavigate } from "react-router-dom";

function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await getHistory();
        setHistory(res.data);
      } catch (err) {
        console.log(err);
        alert("Login required");
        window.location.href = "/";
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">

      <h2 className="text-3xl font-bold mb-6 text-blue-600">
        History
      </h2>

      <div className="w-full max-w-4xl space-y-4">

        {history.length === 0 && (
          <p className="text-gray-500 text-center">
            No history found
          </p>
        )}

        {history.map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow-md"
          >
            <p className="text-sm text-gray-500 mb-1">
              <b>Type:</b> {item.type}
            </p>

            {item.input?.question && (
              <p className="mb-2">
                <b>Question:</b> {item.input.question}
              </p>
            )}

            {item.input?.code && (
              <p className="mb-3 text-sm text-gray-600 break-words">
                <b>Code:</b> {item.input.code.slice(0, 100)}...
              </p>
            )}

            <button
              onClick={() =>
                navigate("/", {
                  state: { result: item.response },
                })
              }
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition hover:scale-105 active:scale-95"
            >
              View Result
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}

export default History;