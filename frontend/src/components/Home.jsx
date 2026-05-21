import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [recipes, setRecipes] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/recipes")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "80px",
          fontFamily: "'Poppins', sans-serif",
          color: "#d87093",
        }}
      >
        Loading recipes... 🍰
      </h2>
    );

  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          textAlign: "center",
          padding: "50px 20px 30px",
          background: "linear-gradient(180deg, #fce4ec 0%, #fff6fa 100%)",
        }}
      >
        <h1
          style={{
            fontSize: "2.2rem",
            color: "#d87093",
            marginBottom: "10px",
            fontWeight: "700",
            letterSpacing: "0.5px",
          }}
        >
          Welcome to BakesByNeha! 🧁
        </h1>
        <p
          style={{
            color: "#b07090",
            fontSize: "1rem",
            fontWeight: "300",
            letterSpacing: "0.3px",
          }}
        >
          Where every dessert tells a sweet story 🍰
        </p>
      </div>

      {/* Subtitle */}
      <p
        style={{
          textAlign: "center",
          margin: "24px 20px 8px",
          fontSize: "0.95rem",
          color: "#c47a95",
          fontWeight: "400",
          letterSpacing: "0.2px",
        }}
      >
        Click on a recipe to see full details!
      </p>

      {/* Recipe Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "28px",
          padding: "20px 48px 60px",
        }}
      >
        {Object.entries(recipes).map(([key, recipe]) => (
          <div
            key={key}
            onClick={() => navigate(`/recipe/${key}`)}
            style={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              border: "1px solid #fce4ec",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow =
                "0 12px 28px rgba(216,112,147,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
            }}
          >
            <img
              src={recipe.image}
              alt={recipe.name}
              style={{
                width: "100%",
                height: "210px",
                objectFit: "cover",
              }}
            />
            <div style={{ padding: "18px 20px 22px" }}>
              <h2
                style={{
                  color: "#d87093",
                  marginBottom: "8px",
                  fontSize: "1.15rem",
                  fontWeight: "600",
                  letterSpacing: "0.3px",
                }}
              >
                {recipe.name}
              </h2>
              <p
                style={{
                  color: "#b07090",
                  fontSize: "0.88rem",
                  fontWeight: "400",
                }}
              >
                🍽️ Serves {recipe.servings} people
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
