import React, { useState } from "react";

const QuestionsAccordion = ({ data }) => {
  const [openCategory, setOpenCategory] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);

  // group questions by category (LL, DLL, etc.)
  const groupByCategory = () => {
    const categories = {};
    data.forEach((q) => {
      let category = "";
      if (q.title.toLowerCase().includes("dll")) category = "Doubly Linked List";
      else if (q.title.toLowerCase().includes("linkedlist") || q.title.toLowerCase().includes("ll"))
        category = "Linked List";
      else category = "Others";

      if (!categories[category]) categories[category] = [];
      categories[category].push(q);
    });
    return categories;
  };

  const categories = groupByCategory();

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {Object.keys(categories).map((category, idx) => (
        <div key={idx} className="mb-4 border rounded-lg dark:border-gray-700">
          {/* Category Accordion */}
          <button
            onClick={() => setOpenCategory(openCategory === category ? null : category)}
            className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 dark:bg-gray-800 text-left font-semibold"
          >
            {category}
            <span>{openCategory === category ? "−" : "+"}</span>
          </button>

          {/* Questions inside category */}
          {openCategory === category && (
            <div className="p-2 bg-white dark:bg-gray-900">
              {categories[category].map((q) => (
                <div key={q.id} className="mb-2">
                  <button
                    onClick={() => setOpenQuestion(openQuestion === q.id ? null : q.id)}
                    className="w-full flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md text-left"
                  >
                    {q.title}
                    <span>{openQuestion === q.id ? "▲" : "▼"}</span>
                  </button>

                  {openQuestion === q.id && (
                    <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 rounded-md mt-1">
                      <ul className="list-disc ml-5 space-y-1">
                        {q.p1_link && (
                          <li>
                            <a
                              href={q.p1_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 underline"
                            >
                              Practice Link 1
                            </a>
                          </li>
                        )}
                        {q.p2_link && (
                          <li>
                            <a
                              href={q.p2_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 underline"
                            >
                              Practice Link 2
                            </a>
                          </li>
                        )}
                        {q.yt_link && (
                          <li>
                            <a
                              href={q.yt_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 underline"
                            >
                              YouTube Link
                            </a>
                          </li>
                        )}
                        {!q.p1_link && !q.p2_link && !q.yt_link && (
                          <li className="text-gray-500">No resources available</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionsAccordion;
