import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { courses } from "../data/courses";

export default function CourseSelection() {
  return (
    <main className="page">
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Choose Your Path</h1>
        <p>
          Test your knowledge, discover weak areas, and access personalized
          study resources.
        </p>
      </motion.div>

      <div className="courseGrid">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/quiz/${course.id}`} className="courseCard">
              <div className="courseIcon">{course.icon}</div>
              <h2>{course.name}</h2>
              <p>{course.description}</p>

              <div className="startLink">
                <span>Start Quiz</span>
                <ArrowRight size={18} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}