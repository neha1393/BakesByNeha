import { useState, useEffect } from "react";

function CostCalculator() {
  const [stock, setStock] = useState([]);
  const [rows, setRows] = useState([
    { stockId: "", usedQty: "", unit: "grams" },
  ]);
  const [profitPercent, setProfitPercent] = useState("");
  const [result, setResult] = useState(null);

  // Fetch stock from backend
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/stock`)
      .then((res) => res.json())
      .then((data) => setStock(data));
  }, []);

  const addRow = () => {
    setRows([...rows, { stockId: "", usedQty: "", unit: "grams" }]);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const calculate = () => {
    let breakdown = [];
    let totalCost = 0;

    for (let row of rows) {
      const stockItem = stock.find((s) => s.id === parseInt(row.stockId));
      if (!stockItem || !row.usedQty) continue;

      // Convert used qty to same unit as stock (grams)
      let usedInGrams = parseFloat(row.usedQty);
      if (row.unit === "kg") usedInGrams = usedInGrams * 1000;

      // Cost = used grams × price per gram
      const cost = usedInGrams * stockItem.price_per_unit;
      totalCost += cost;

      breakdown.push({
        name: stockItem.name,
        usedQty: row.usedQty,
        unit: row.unit,
        cost: cost,
      });
    }

    const profit = parseFloat(profitPercent) || 0;
    // Selling price formula: cost / (1 - profit%/100)
    const sellingPrice = profit > 0 ? totalCost / (1 - profit / 100) : null;

    setResult({ breakdown, totalCost, sellingPrice, profitPercent: profit });
  };

  const reset = () => {
    setRows([{ stockId: "", usedQty: "", unit: "grams" }]);
    setProfitPercent("");
    setResult(null);
  };

  const inputStyle = {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #f8b4c8",
    fontSize: "0.9rem",
    outline: "none",
    width: "100%",
    backgroundColor: "#fff",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 15px rgba(244, 143, 177, 0.2)",
    marginBottom: "24px",
  };

  return (
    <div style={{ maxWidth: "750px", margin: "0 auto", padding: "32px 20px" }}>
      <h1
        style={{ color: "#d47a9a", marginBottom: "8px", textAlign: "center" }}
      >
        🧮 Bake Cost Calculator
      </h1>
      <p
        style={{ textAlign: "center", color: "#a0687a", marginBottom: "32px" }}
      >
        Select ingredients you used today and enter the quantity! 🌸
      </p>

      {/* Ingredients Used Section */}
      <div style={cardStyle}>
        <h2 style={{ color: "#d47a9a", marginBottom: "16px" }}>
          🧁 Ingredients Used
        </h2>

        {/* Column Headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr auto",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              color: "#a0687a",
              fontSize: "0.85rem",
              fontWeight: "bold",
            }}
          >
            Ingredient
          </span>
          <span
            style={{
              color: "#a0687a",
              fontSize: "0.85rem",
              fontWeight: "bold",
            }}
          >
            Quantity
          </span>
          <span
            style={{
              color: "#a0687a",
              fontSize: "0.85rem",
              fontWeight: "bold",
            }}
          >
            Unit
          </span>
          <span></span>
        </div>

        {/* Ingredient Rows */}
        {rows.map((row, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr auto",
              gap: "8px",
              marginBottom: "10px",
              alignItems: "center",
            }}
          >
            {/* Dropdown from stock */}
            <select
              style={inputStyle}
              value={row.stockId}
              onChange={(e) => updateRow(index, "stockId", e.target.value)}
            >
              <option value="">Select ingredient</option>
              {stock.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Quantity used */}
            <input
              style={inputStyle}
              type="number"
              placeholder="100"
              value={row.usedQty}
              onChange={(e) => updateRow(index, "usedQty", e.target.value)}
            />

            {/* Unit */}
            <select
              style={inputStyle}
              value={row.unit}
              onChange={(e) => updateRow(index, "unit", e.target.value)}
            >
              <option value="grams">grams</option>
              <option value="kg">kg</option>
            </select>

            {/* Remove button */}
            <button
              onClick={() => removeRow(index)}
              style={{
                background: "#ffe4f0",
                border: "none",
                borderRadius: "8px",
                padding: "8px 10px",
                cursor: "pointer",
                color: "#d47a9a",
                fontSize: "1rem",
              }}
            >
              ✕
            </button>
          </div>
        ))}

        {/* Add Row Button */}
        <button
          onClick={addRow}
          style={{
            marginTop: "8px",
            backgroundColor: "#ffe4f0",
            border: "1px dashed #f8b4c8",
            borderRadius: "10px",
            padding: "10px 20px",
            cursor: "pointer",
            color: "#d47a9a",
            fontSize: "0.95rem",
            width: "100%",
          }}
        >
          + Add Ingredient
        </button>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          onClick={calculate}
          style={{
            flex: 1,
            backgroundColor: "#f8b4c8",
            border: "none",
            borderRadius: "12px",
            padding: "14px",
            cursor: "pointer",
            color: "#fff",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          🧮 Calculate Cost
        </button>
        <button
          onClick={reset}
          style={{
            flex: 1,
            backgroundColor: "#ffe4f0",
            border: "1px solid #f8b4c8",
            borderRadius: "12px",
            padding: "14px",
            cursor: "pointer",
            color: "#d47a9a",
            fontSize: "1rem",
          }}
        >
          🔄 Reset
        </button>
      </div>

      {/* Result Section */}
      {result && (
        <div
          style={{
            ...cardStyle,
            background: "linear-gradient(135deg, #ffe4f0, #fff0f5)",
            border: "1px solid #f8b4c8",
          }}
        >
          <h2
            style={{
              color: "#d47a9a",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            📊 Cost Breakdown
          </h2>

          {/* Ingredient breakdown */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8b4c8" }}>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    color: "#fff",
                    borderRadius: "8px 0 0 0",
                  }}
                >
                  Ingredient
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  Used
                </th>
                <th
                  style={{
                    padding: "10px",
                    textAlign: "right",
                    color: "#fff",
                    borderRadius: "0 8px 0 0",
                  }}
                >
                  Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {result.breakdown.map((item, i) => (
                <tr
                  key={i}
                  style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#fff8fb" }}
                >
                  <td style={{ padding: "10px", color: "#5a3e4b" }}>
                    {item.name}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      color: "#5a3e4b",
                    }}
                  >
                    {item.usedQty} {item.unit}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      textAlign: "right",
                      color: "#d47a9a",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{item.cost.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Cost */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "16px",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <p style={{ color: "#a0687a", fontSize: "0.9rem" }}>
              Total Bake Cost
            </p>
            <p
              style={{ color: "#d47a9a", fontSize: "2rem", fontWeight: "bold" }}
            >
              ₹{result.totalCost.toFixed(2)}
            </p>
          </div>

          {/* Profit % Input */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <p
              style={{
                color: "#a0687a",
                marginBottom: "10px",
                fontWeight: "bold",
              }}
            >
              💰 Enter your desired profit margin:
            </p>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <input
                style={{ ...inputStyle, maxWidth: "150px" }}
                type="number"
                placeholder="e.g. 40"
                value={profitPercent}
                onChange={(e) => setProfitPercent(e.target.value)}
              />
              <span style={{ color: "#a0687a" }}>%</span>
              <button
                onClick={calculate}
                style={{
                  backgroundColor: "#f8b4c8",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  color: "#fff",
                  fontSize: "0.95rem",
                }}
              >
                Get Selling Price →
              </button>
            </div>
          </div>

          {/* Selling Price Result */}
          {result.sellingPrice && (
            <div
              style={{
                backgroundColor: "#e8f5e9",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: "#2e7d32",
                  fontSize: "0.9rem",
                  marginBottom: "4px",
                }}
              >
                Suggested Selling Price ({result.profitPercent}% profit)
              </p>
              <p
                style={{
                  color: "#2e7d32",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                ₹{result.sellingPrice.toFixed(2)}
              </p>
              <p
                style={{
                  color: "#2e7d32",
                  fontSize: "0.85rem",
                  marginTop: "8px",
                }}
              >
                🎉 You make ₹
                {(result.sellingPrice - result.totalCost).toFixed(2)} profit on
                this bake!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CostCalculator;
