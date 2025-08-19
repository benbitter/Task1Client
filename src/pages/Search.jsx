import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";

const ITEMS_PER_PAGE = 6;

const highlightText = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, (match) => `<mark class="bg-yellow-400">${match}</mark>`);
};

const Search = ({ theme }) => {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dotSizes, setDotSizes] = useState([8, 8, 8, 8]);

  // Voice recognition states
  const [listening, setListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const recognitionRef = useRef(null);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchSection = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://task1questionbackend.onrender.com/api/v1/questions/category/0`);
        setQuestions(res.data || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setQuestions([]);
        setLoading(false);
      }
    };
    fetchSection();
  }, []);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const title = q?.title || "";
      const matchesSearch = debouncedSearch
        ? title.toLowerCase().includes(debouncedSearch.toLowerCase())
        : true;
      const matchesDifficulty = difficulty ? q?.difficulty === difficulty : true;
      return matchesSearch && matchesDifficulty;
    });
  }, [questions, debouncedSearch, difficulty]);

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE) || 1;
  const paginatedQuestions = filteredQuestions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Dot loading animation
  useEffect(() => {
    let direction = [true, true, true, true];
    const interval = setInterval(() => {
      setDotSizes((prev) =>
        prev.map((size, idx) => {
          let newSize = direction[idx] ? size + 1 : size - 1;
          if (newSize >= 20) direction[idx] = false;
          if (newSize <= 8) direction[idx] = true;
          return newSize;
        })
      );
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Setup speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setSpokenText(transcript);
      setSearch(transcript);
      setPage(1);
    };

    recognitionRef.current.onend = () => {
      if (listening) recognitionRef.current.start(); // Auto-restart if listening
    };
  }, [listening]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  if (loading)
    return (
      <div className={`fixed top-0 left-0 w-full h-full flex justify-center items-center ${theme === "dark" ? "bg-black" : "bg-white"}`}>
        <div className="flex gap-4">
          {dotSizes.map((size, idx) => (
            <div
              key={idx}
              style={{ width: size, height: size }}
              className={`rounded-full ${
                idx % 2 ? "bg-green-500" : idx % 3 ? "bg-blue-500" : "bg-red-500"
              }`}
            ></div>
          ))}
        </div>
        <p className="text-gray-500">Loading might take a while...</p>
      </div>
    );

  return (
    <div className={`min-h-screen w-full p-4 flex flex-col items-center ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
      <h1 className="text-2xl font-bold mb-4">Search Questions</h1>

      {/* Search & Filter */}
      <div className="w-full max-w-2xl flex flex-col md:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search by title..."
          className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button
          onClick={toggleListening}
          className={`px-3 py-2 rounded ${
            listening ? "bg-red-600" : "bg-blue-600"
          }`}
        >
          {listening ? "Stop 🎤" : "Start 🎤"}
        </button>
        <select
          className="p-2 rounded bg-gray-800 text-white border border-gray-600"
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Show spoken text */}
      {spokenText && (
        <p className="mb-4 text-yellow-400">🎧 Listening: "{spokenText}"</p>
      )}

      {/* Results */}
      <div className="w-full max-w-2xl">
        {paginatedQuestions.length === 0 ? (
          <p className="text-gray-400 text-center">No matching questions found</p>
        ) : (
          <ul className="space-y-3">
            {paginatedQuestions.map((q) => (
              <li
                key={q._id}
                className="p-3 rounded bg-gray-900 border border-gray-700 text-white"
              >
                <span
                    
                  dangerouslySetInnerHTML={{
                    __html: highlightText(q?.title || "", debouncedSearch),
                  }}
                />
                <div className="text-sm text-gray-400">
                  Difficulty: {q?.difficulty || "Unknown"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;
