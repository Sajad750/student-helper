import { Routes, Route, Link } from "react-router-dom";
import CourseSelection from "./pages/CourseSelection";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="logo">
  GradeUp
</Link>

        <div className="navLinks">
          <Link to="/">Courses</Link>
          <Link to="/resources">Resources</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<CourseSelection />} />
        <Route path="/quiz/:courseId" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}