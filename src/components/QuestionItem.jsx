const difficultyColors = {
  Easy: "bg-green-200 text-green-800",
  Medium: "bg-yellow-200 text-yellow-800",
  Hard: "bg-red-200 text-red-800",
};

export default function QuestionItem({ question }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 border rounded">
      <div>
        <a
          href={question.link}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
        >
          {question.title}
        </a>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <a href={question.youtube} target="_blank" rel="noreferrer">
            📺 YouTube
          </a>
        </p>
      </div>
      <span
        className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-semibold ${difficultyColors[question.difficulty]}`}
      >
        {question.difficulty}
      </span>
    </div>
  );
}
