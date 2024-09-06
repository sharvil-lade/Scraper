import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Hero from "./components/hero";
import Product from "./components/Product";
import Result from "./components/Result";
import Background from "./components/Background";

function App() {
  return (
    <div>
      <Router>
        <Background>
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/product-query" element={<Product />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </Background>
      </Router>
    </div>
  );
}

export default App;
