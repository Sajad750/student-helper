import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="page center">
      <h1 className="notFound">404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for does not exist.</p>

      <Link to="/" className="primaryBtn">
        <Home size={18} />
        Back to Home
      </Link>
    </main>
  );
}