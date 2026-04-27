import { useState } from "react";
import { useLocation } from "react-router-dom";
import { FileText, Video, BookOpen, Search } from "lucide-react";
import { courses, resources } from "../data/courses";

export default function Resources() {
  const location = useLocation();
  const state = location.state;

  const [selectedCourse, setSelectedCourse] = useState(state?.courseId || "all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const openResource = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const filteredResources = resources.filter((resource) => {
    const matchCourse =
      selectedCourse === "all" || resource.courseId === selectedCourse;

    const matchType = selectedType === "all" || resource.type === selectedType;

    const matchSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCourse && matchType && matchSearch;
  });

  const getIcon = (type) => {
    if (type === "pdf") return <FileText />;
    if (type === "video") return <Video />;
    return <BookOpen />;
  };

  return (
    <main className="page">
      <div className="hero">
        <h1>Learning Resources</h1>
        <p>
          Explore curated study materials to strengthen your knowledge and
          master difficult topics.
        </p>
      </div>

      <div className="filters">
        <div className="searchBox">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filterButtons">
          <button
            className={selectedCourse === "all" ? "active" : ""}
            onClick={() => setSelectedCourse("all")}
          >
            All Courses
          </button>

          {courses.map((course) => (
            <button
              key={course.id}
              className={selectedCourse === course.id ? "active" : ""}
              onClick={() => setSelectedCourse(course.id)}
            >
              {course.name}
            </button>
          ))}
        </div>

        <div className="filterButtons">
          {["all", "pdf", "video"].map((type) => (
            <button
              key={type}
              className={selectedType === type ? "activeDark" : ""}
              onClick={() => setSelectedType(type)}
            >
              {type === "all" ? "All Types" : type}
            </button>
          ))}
        </div>
      </div>

      {filteredResources.length === 0 ? (
        <div className="center">
          <p>No resources found.</p>
        </div>
      ) : (
        <div className="resourceGrid">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="resourceCard">
              <div className="resourceTop">
                <div className="resourceIcon">{getIcon(resource.type)}</div>
                <span>
                  {courses.find((c) => c.id === resource.courseId)?.name}
                </span>
              </div>

              <h3>{resource.title}</h3>
              <p>{resource.description}</p>

              <div className="resourceBottom">
                <span className="topicBadge">{resource.topic}</span>

                {resource.fileUrl ? (
                  <button
                    className="linkBtn"
                    onClick={() => openResource(resource.fileUrl)}
                  >
                    {resource.type === "pdf"
                      ? "Open PDF"
                      : resource.type === "video"
                      ? "Open Video"
                      : "Open"}
                  </button>
                ) : (
                  <span className="smallText">Notes</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}