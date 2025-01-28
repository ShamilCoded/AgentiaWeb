import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState([]);

  const handleQuery = async () => {
    try {
      const faqResponse = await axios.post("/api/faq", {
        message: query,
        context: ["What is your return policy?", "How to track my order?"]
      });

      const sentimentResponse = await axios.post("/api/sentiment", {
        message: query
      });

      const dbResponse = await axios.post("/api/database", {
        message: query
      });

      setResponses([
        { type: "FAQ Agent", response: faqResponse.data.answer },
        { type: "Sentiment Agent", response: sentimentResponse.data.sentiment.label },
        { type: "Database Agent", response: dbResponse.data.response }
      ]);
    } catch (error) {
      console.error("Error handling query:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
        <h1 className="text-2xl font-bold mb-4 text-center">Customer Support Chatbot</h1>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query here..."
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2"
        />
        <button
          onClick={handleQuery}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Ask Agents
        </button>
        <div className="mt-6">
          {responses.map((res, index) => (
            <div key={index} className="mb-4">
              <p><strong>{res.type}:</strong> {res.response}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
