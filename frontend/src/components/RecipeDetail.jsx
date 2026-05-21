import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RecipeDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/recipes/${name}`)
      .then((res) => res.json())
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      });
  }, [name]);

  if (loading)
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading... 🍰</h2>
    );

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "0 24px" }}>
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        style={{
          backgroundColor: "#f8b4c8",
          border: "none",
          padding: "10px 20px",
          borderRadius: "20px",
          cursor: "pointer",
          color: "#fff",
          fontSize: "1rem",
          marginBottom: "24px",
        }}
      >
        ← Back to Recipes
      </button>

      {/* Recipe Image */}
      <img
        src={recipe.image}
        alt={recipe.name}
        style={{ width: "100%", borderRadius: "16px", marginBottom: "24px" }}
      />

      {/* Recipe Name */}
      <h1 style={{ color: "#d47a9a", marginBottom: "8px" }}>{recipe.name}</h1>
      <p style={{ color: "#a0687a", marginBottom: "24px" }}>
        🍽️ Serves {recipe.servings} people
      </p>

      {/* Ingredients */}
      <div
        style={{
          backgroundColor: "#fff0f5",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ color: "#d47a9a", marginBottom: "12px" }}>
          🧁 Ingredients
        </h2>
        <ul style={{ paddingLeft: "20px" }}>
          {Object.entries(recipe.ingredients).map(([item, amount]) => (
            <li key={item} style={{ marginBottom: "8px", color: "#5a3e4b" }}>
              <strong>{item}</strong> — {amount}
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <div
        style={{
          backgroundColor: "#fce4ec",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h2 style={{ color: "#d47a9a", marginBottom: "12px" }}>
          👩‍🍳 Instructions
        </h2>
        <p style={{ lineHeight: "1.8", color: "#5a3e4b" }}>
          {recipe.instructions}
        </p>
      </div>
    </div>
  );
}

export default RecipeDetail;
