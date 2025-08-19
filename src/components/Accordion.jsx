import { useState } from "react";
import QuestionItem from "./QuestionItem";

export default function Accordion({ categories }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {categories.map((cat, idx) => (
        <div key={cat._id} className="border rounded-lg overflow-hidden">
          <button
            onClick={() => setOpen(open === idx ? null : idx)}
            className="w-full flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 dark:text-white"
          >
            <span className="text-lg font-semibold">{cat.name}</span>
            <span>{open === idx ? "▲" : "▼"}</span>
          </button>

          {open === idx && (
            <div className="p-4 space-y-3 bg-white dark:bg-gray-900">
              {cat.questions.map((q) => (
                <QuestionItem key={q._id} question={q} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
