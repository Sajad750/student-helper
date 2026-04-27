import { useLocation, Link } from "react-router-dom";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { quizzes, resources } from "../data/courses";

export default function Results() {
  const location = useLocation();
  const state = location.state;

  const openResource = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

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

  const uniqueWrongTopics = [...new Set(wrongTopics)];

  const recommendedVideos = resources.filter(
    (r) =>
      r.courseId === courseId &&
      r.type === "video" &&
      uniqueWrongTopics.includes(r.topic)
  );

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

                  <div
                    className={
                      isCorrect
                        ? "answerBox correctBox"
                        : "answerBox wrongBox"
                    }
                  >
                    <p>
                      Your answer: <b>{question.options[userAnswer]}</b>
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

                      {question.explanation && (
                        <p>✓ {question.explanation}</p>
                      )}
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

      {recommendedVideos.length > 0 && (
        <section className="recommendBox">
          <div className="recommendTitle">
            <BookOpen />
            <h2>Recommended Videos</h2>
          </div>

          <p>
            Based on your wrong answers, watch these videos to review the weak
            topics.
          </p>

          <div className="resourceGrid">
            {recommendedVideos.map((resource) => (
              <div key={resource.id} className="resourceCard">
                <span className="topicBadge">VIDEO</span>

                <h3>{resource.title}</h3>

                <p>{resource.description}</p>

                <span className="smallText">Topic: {resource.topic}</span>

                <br />

                <button
                  className="linkBtn"
                  onClick={() => openResource(resource.fileUrl)}
                >
                  Open Video →
                </button>
              </div>
            ))}
          </div>

          <Link to="/resources" state={{ courseId }} className="primaryBtn">
            View PDF Resources <ArrowRight size={16} />
          </Link>
        </section>
      )}
    </main>
  );
}