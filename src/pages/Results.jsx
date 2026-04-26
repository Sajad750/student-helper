import { useLocation, Link } from "react-router-dom";
import { Trophy, CheckCircle2, XCircle, BookOpen, ArrowRight } from "lucide-react";
import { quizzes, resources } from "../data/courses";

export default function Results() {
  const location = useLocation();
  const state = location.state;

  if (!state) {
    return (
      <main className="page center">
        <h1>No Results Found</h1>
        <p>Please complete a quiz first.</p>
        <Link to="/" className="primaryBtn">
          Back to Courses
        </Link>
      </main>
    );
  }

  const { answers, score, totalQuestions, courseId, courseName } = state;
  const quiz = quizzes[courseId];

  if (!quiz) {
    return (
      <main className="page center">
        <h1>Result Error</h1>
        <p>Quiz data was not found.</p>
        <Link to="/" className="primaryBtn">
          Back to Courses
        </Link>
      </main>
    );
  }

  const percentage = Math.round((score / totalQuestions) * 100);

  const wrongTopics = quiz.questions
    .filter((q) => answers[q.id] !== q.correctAnswer)
    .map((q) => q.topic);

  let recommendedResources = resources.filter(
    (r) => r.courseId === courseId && wrongTopics.includes(r.topic)
  );

  const combinedResources = resources.filter(
    (r) =>
      r.courseId === courseId &&
      r.combinedTopics &&
      r.combinedTopics.some((topic) => wrongTopics.includes(topic)) &&
      r.combinedTopics.filter((topic) => wrongTopics.includes(topic)).length >= 2
  );

  if (combinedResources.length > 0) {
    recommendedResources = [
      ...combinedResources.filter((r) => r.isPriority),
      ...recommendedResources,
    ];
  }

  const message =
    percentage >= 80
      ? "Excellent Work!"
      : percentage >= 60
      ? "Good Effort!"
      : "Keep Practicing!";

  return (
    <main className="resultsPage">
      <section className="scoreCard">
        <Trophy size={80} />
        <h1>{message}</h1>

        <div className="score">
          {score}/{totalQuestions}
        </div>

        <p>
          You scored {percentage}% on {courseName}
        </p>

        <Link to="/" className="primaryBtn">
          Try Another Quiz
        </Link>
      </section>

      <section>
        <h2 className="sectionTitle">Review Your Answers</h2>

        <div className="reviewList">
          {quiz.questions.map((question, index) => {
            const userAnswer = answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <div
                key={question.id}
                className={`reviewCard ${isCorrect ? "correct" : "wrong"}`}
              >
                {isCorrect ? <CheckCircle2 /> : <XCircle />}

                <div>
                  <span className="smallText">Question {index + 1}</span>
                  <h3>{question.question}</h3>

                  <div className={isCorrect ? "answerBox correctBox" : "answerBox wrongBox"}>
                    <p>
                      Your answer:{" "}
                      <b>{question.options[userAnswer]}</b>
                    </p>

                    {!isCorrect &&
                      question.wrongChoiceExplanations?.[userAnswer] && (
                        <p>{question.wrongChoiceExplanations[userAnswer]}</p>
                      )}
                  </div>

                  {!isCorrect && (
                    <div className="answerBox correctBox">
                      <p>
                        Correct answer:{" "}
                        <b>{question.options[question.correctAnswer]}</b>
                      </p>
                      <p>✓ {question.explanation}</p>
                    </div>
                  )}

                  {isCorrect && question.explanation && (
                    <div className="answerBox noteBox">
                      <p>✓ {question.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {recommendedResources.length > 0 && (
        <section className="recommendBox">
          <div className="recommendTitle">
            <BookOpen />
            <h2>Improve Your Understanding</h2>
          </div>

          <p>
            Based on your quiz results, we recommend reviewing these topics.
          </p>

          <div className="resourceGrid">
            {recommendedResources.map((resource) => (
              <div key={resource.id} className="resourceCard">
                <span className="topicBadge">{resource.type.toUpperCase()}</span>

                {resource.isPriority && (
                  <span className="recommendedBadge">RECOMMENDED</span>
                )}

                <h3>{resource.title}</h3>
                <p>{resource.description}</p>

                <span className="smallText">
                  {resource.combinedTopics
                    ? `Covers: ${resource.combinedTopics.join(", ")}`
                    : `Topic: ${resource.topic}`}
                </span>

                {resource.fileUrl ? (
                  <button
                    className="linkBtn"
                    onClick={() => window.open(resource.fileUrl, "_blank")}
                  >
                    Open Resource →
                  </button>
                ) : (
                  <span className="smallText">
                    {resource.type === "video" ? "Video Resource" : "Study Notes"}
                  </span>
                )}
              </div>
            ))}
          </div>

          <Link to="/resources" state={{ courseId }} className="primaryBtn">
            View All Study Materials <ArrowRight size={16} />
          </Link>
        </section>
      )}
    </main>
  );
}