import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <div className="navbar">
      <Link to="/" className="navbar-brand">
        🎀 BakesByNeha 🎀
      </Link>
      <div className="navbar-links">
        <Link
          to="/"
          className={`nav-btn ${
            location.pathname === "/" ? "active" : "inactive"
          }`}
        >
          🏠 Home
        </Link>
        <Link
          to="/calculator"
          className={`nav-btn ${
            location.pathname === "/calculator" ? "active" : "inactive"
          }`}
        >
          🧮 Cost Calculator
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
