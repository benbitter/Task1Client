import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function PaginationPage({ user  , theme}) {
  const [searchParams] = useSearchParams();
  const [openIndex, setOpenIndex] = useState(null);
  const [dotSizes, setDotSizes] = useState([8, 8, 8, 8]);
  const [data, setData] = useState([]);
  const [bookmarked, setBookmarked] = useState(user?.user?.bookmarks || []);
  const [done, setDone] = useState(user?.user?.done || []);
  const [listening, setListening] = useState(false);
  const contentRefs = useRef([]);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const sl_no = parseInt(searchParams.get("sl_no") || "0");

  // ✅ Define voice commands
  const commands = [
    {
      command: "next page",
      callback: () => goToPage(page + 1),
    },
    {
      command: "previous page",
      callback: () => goToPage(page - 1),
    },
  ];

  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands });

  // ✅ Mic toggle
  const toggleListening = async () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setListening(false);
    } else {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      SpeechRecognition.startListening({
        continuous: true,
        interimResults: true,
        language: "en-IN",
      });
      setListening(true);
    }
  };

  // Fetch data when sl_no changes
  useEffect(() => {
    setBookmarked(user?.user?.bookmarks || []);
    setDone(user?.user?.done || []);
    const fetchSection = async () => {
      try {
        const res = await axios.get(
          `https://task1questionbackend.onrender.com/api/v1/questions/category/${sl_no}`
        );
        setData(res.data || []);
      } catch (error) {
        console.error(error);
        setData([]);
      }
    };
    fetchSection();
  }, [sl_no, user?.user]);

  // Dot  animation
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

  if (!data.length)
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
          <p className="text-gray-500">Loading might take a while...</p>
        </div>
      </div>
    );

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const currentItems = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / limit);

  const goToPage = (newPage) => {
    if (newPage > totalPages) newPage = 1;
    if (newPage < 1) newPage = totalPages;
    searchParams.set("page", newPage);
    window.history.replaceState(null, "", "?" + searchParams.toString());
    setOpenIndex(null);
  };

  const toggleItem = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const truncateTitle = (title) => {
    if (!title) return "";
    return title.length > 60 ? title.slice(0, 60) + "..." : title;
  };

  // ✅ Handlers
  const markQuestionHandler = async (id) => {
    try {
      await axios.get(
        `https://task1authbackend.onrender.com/api/v1/auth/markDone?questionId=${id}`,
        { withCredentials: true }
      );
      setDone((prev) =>
        prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
      );
    } catch (err) {
      console.error(err);
    }
  };

  const bookmarkQuestionHandler = async (id) => {
    try {
      await axios.get(
        `https://task1authbackend.onrender.com/api/v1/auth/addBookmark?questionId=${id}`,
        { withCredentials: true }
      );
      setBookmarked((prev) =>
        prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <p className="text-red-500">❌ Browser does not support speech recognition.</p>;
  }

  return (
    <div className={`min-h-screen p-4 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 neon-text text-center">
        React Pagination with Neon Accordion
      </h1>

      {/* ✅ Show live transcript */}
      <div className="mb-4 p-3 bg-gray-900 rounded text-green-400 w-full max-w-xl text-center">
        <p>say next page or previous page to navigate</p>
        <p><strong>Listening:</strong> {listening ? "✅ Yes" : "❌ No"}</p>
        <p><strong>You said:</strong> {transcript || "..."}</p>
      </div>

      {/* ✅ Mic Toggle Button */}
      <button
        onClick={toggleListening}
        className={`mb-6 px-4 py-2 rounded text-white ${listening ? "bg-red-500" : "bg-green-600"}`}
      >
        {listening ? "Stop Listening" : "Start Listening"}
      </button>

      <div className="w-full md:w-7/10 divide-y rounded-lg">
        {currentItems.map((item, idx) => (
          <div
            key={idx}
            className="mb-2 border border-neon-purple rounded-lg overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleItem(idx)}
              className="w-full px-3 md:px-5 py-2 md:py-3 flex flex-col md:flex-row justify-between items-start md:items-center font-semibold bg-neon-purple/20 hover:bg-neon-purple/40 transition-colors"
            >
              <span className="break-words md:truncate w-full md:w-auto">
                {truncateTitle(item?.title)}
              </span>
              <span className="text-sm mt-1 md:mt-0">
                Submissions: {item?.submission} | Difficulty: {item?.difficulty}
              </span>
            </button>

            <div
              ref={(el) => (contentRefs.current[idx] = el)}
              className={`overflow-hidden transition-all duration-300`}
              style={{
                maxHeight:
                  openIndex === idx
                    ? contentRefs.current[idx]?.scrollHeight + "px"
                    : "0px",
              }}
            >
              <div className="px-3 md:px-5 py-2 md:py-3 bg-neon-purple/10 flex flex-col gap-4">
                {/* Links */}
                <div className="flex flex-wrap gap-4 md:gap-6 justify-start">
                  {item?.p1_link && (
                    <a href={item.p1_link} target="_blank" rel="noopener noreferrer" className="underline text-neon-green break-all">
                      {item.p1_link}
                    </a>
                  )}
                  {item?.p2_link && (
                    <a href={item.p2_link} target="_blank" rel="noopener noreferrer" className="underline text-neon-green break-all">
                      {item.p2_link}
                    </a>
                  )}
                  {item?.yt_link && (
                    <a href={item.yt_link} target="_blank" rel="noopener noreferrer" className="underline text-neon-green break-all">
                      {item.yt_link}
                    </a>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => markQuestionHandler(item.id)}
                    className={`px-3 py-1 rounded ${
                      done.includes(item.id)
                        ? "bg-green-500 text-black"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {done.includes(item.id) ? "Marked Done" : "Mark Done"}
                  </button>
                  <button
                    onClick={() => bookmarkQuestionHandler(item.id)}
                    className={`px-3 py-1 rounded ${
                      bookmarked.includes(item.id)
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {bookmarked.includes(item.id) ? "Bookmarked" : "Bookmark"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6 items-center">
        <button
          onClick={() => goToPage(page - 1)}
          className="px-4 py-2 bg-neon-blue text-black rounded w-full sm:w-auto"
        >
          Previous
        </button>
        <span className="self-center">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => goToPage(page + 1)}
          className="px-4 py-2 bg-neon-blue text-black rounded w-full sm:w-auto"
        >
          Next
        </button>
      </div>

      <style>{`
        .neon-text {
          color: #39ff14;
          text-shadow: 0 0 5px #39ff14, 0 0 10px #39ff14, 0 0 20px #39ff14;
        }
        .text-neon-cyan { color: #00ffff; }
        .text-neon-green { color: #39ff14; }
        .bg-neon-purple { background-color: #9d00ff; }
        .bg-neon-blue { background-color: #00ffff; }
      `}</style>
    </div>
  );
}
