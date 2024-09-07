import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Hero from "./components/hero";
import Product from "./components/Product";
import Product1 from "./components/Product1";
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
            <Route path="/product-query1" element={<Product1 />} />
            <Route path="/result" element={<Result />} />
            <Route path="/result1" element={<Result />} />
          </Routes>
        </Background>
      </Router>
    </div>
  );
}

export default App;
