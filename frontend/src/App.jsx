import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import RecipeDetail from "./components/RecipeDetail";
import CostCalculator from "./components/CostCalculator";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:name" element={<RecipeDetail />} />
        <Route path="/calculator" element={<CostCalculator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
