import React, { useState, useEffect } from "react";
import axios from "axios";

const TOTAL_QUESTIONS = 362;

const Dashboard = ({ user ,theme }) => {
  const bookmarked = React.useMemo(() => user?.user?.bookmarks || [], [user]);
  const done = React.useMemo(() => user?.user?.done || [], [user]);
  const [bquestions, setbQuestions] = useState([]); // bookmarked questions
  const [dquestions, setdQuestions] = useState([]); // done questions

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.post(
          "https://task1authbackend.onrender.com/api/v1/questions/questions",
          { ids: [...bookmarked, ...done] }
        );

        const data = response.data;

        // Separate questions into bookmarked and done
        const bQuestions = data.filter((q) => bookmarked.includes(q.id));
        const dQuestions = data.filter((q) => done.includes(q.id));

        setbQuestions(bQuestions);
        setdQuestions(dQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    if (bookmarked.length > 0 || done.length > 0) {
      fetchQuestions();
    }
  }, [bookmarked, done]);

  const progress = Math.min((done.length / TOTAL_QUESTIONS) * 100, 100);

  return (
    <div className={`min-h-screen flex flex-row p-4 md:p-6 ${theme === "dark" ? "bg-black text-neon-cyan" : "bg-white text-black"}`}>
      {/* Left Content */}
      <div className="flex-1 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">
          Welcome to the Dashboard, {user?.user?.userName}
        </h1>

        {/* My Bookmarks */}
        <div className="w-full max-w-3xl mb-8">
          <h2 className="text-2xl font-semibold mb-4">⭐ My Bookmarks</h2>
          {bquestions.length > 0 ? (
            <div className="max-h-60 overflow-y-auto border border-gray-700 rounded-lg p-2">
              <ul className="space-y-2">
                {bquestions.map((q) => (
                  <li
                    key={q.id}
                    className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
                  >
                    {q.title}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-400">No bookmarked questions yet.</p>
          )}
        </div>

        {/* Submitted Questions */}
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4">✅ Submitted Questions</h2>
          {dquestions.length > 0 ? (
            <div className="max-h-60 overflow-y-auto border border-gray-700 rounded-lg p-2">
              <ul className="space-y-2">
                {dquestions.map((q) => (
                  <li
                    key={q.id}
                    className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
                  >
                    {q.title}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-400">No submitted questions yet.</p>
          )}
        </div>
      </div>

      {/* Right Progress Bar */}
      <div className="w-24 flex flex-col items-center ml-6">
        <div className="relative h-[70vh] w-8 bg-gray-900 rounded-lg overflow-hidden shadow-inner border border-cyan-400">
          {/* Filled Progress */}
          <div
            className="absolute bottom-0 left-0 w-full bg-cyan-400 neon-glow transition-all duration-700"
            style={{ height: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-4 text-lg font-bold text-cyan-400 text-center">
          {done.length}/{TOTAL_QUESTIONS}
        </p>
        <p className="text-sm text-gray-400">Completed</p>
      </div>

      {/* Neon theme */}
      <style>{`
        .text-neon-cyan { color: #00ffff; }
        .neon-glow {
          box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
