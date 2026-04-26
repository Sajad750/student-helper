import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, Circle } from "lucide-react";
import { courses, quizzes } from "../data/courses";

export default function Quiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = courses.find((c) => c.id === courseId);
  const quiz = quizzes[courseId];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  if (!course || !quiz) {
    return (
      <main className="page center">
        <h1>Quiz Not Found</h1>
        <p>The quiz you're looking for does not exist.</p>
      </main>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const allAnswered = Object.keys(answers).length === totalQuestions;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const selectAnswer = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionIndex,
    });
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const submitQuiz = () => {
    if (!allAnswered) return;

    let score = 0;

    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        score++;
      }
    });

    navigate("/results", {
      state: {
        answers,
        score,
        totalQuestions,
        courseId,
        courseName: course.name,
      },
    });
  };

  return (
    <main className="quizPage">
      <div className="progressHeader">
        <span>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <span>
          {Object.keys(answers).length}/{totalQuestions} answered
        </span>
      </div>

      <div className="progressBar">
        <div className="progressFill" style={{ width: `${progress}%` }} />
      </div>

      <section className="questionCard">
        <span className="topicBadge">{currentQuestion.topic}</span>

        <h1>{currentQuestion.question}</h1>

        <div className="options">
          {currentQuestion.options.map((option, index) => {
            const selected = answers[currentQuestion.id] === index;

            return (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                className={`optionButton ${selected ? "selected" : ""}`}
              >
                {selected ? <CheckCircle2 /> : <Circle />}
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="quizButtons">
        <button
          className="secondaryBtn"
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
        >
          Previous
        </button>

        <div className="questionNav">
          {quiz.questions.map((q, index) => {
            const answered = answers[q.id] !== undefined;
            const current = index === currentQuestionIndex;

            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(index)}
                title={`Question ${index + 1}`}
                className={`dot ${answered ? "answered" : ""} ${
                  current ? "current" : ""
                }`}
              />
            );
          })}
        </div>

        {isLastQuestion ? (
          <button
            className="primaryBtn"
            disabled={!allAnswered}
            onClick={submitQuiz}
          >
            Submit Quiz
          </button>
        ) : (
          <button
            className="primaryBtn"
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
          >
            Next
          </button>
        )}
      </div>
    </main>
  );
}