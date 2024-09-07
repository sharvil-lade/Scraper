import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const [selectedQuery, setSelectedQuery] = useState("");
  const navigate = useNavigate();

  const handleQueryChange = (e) => {
    setSelectedQuery(e.target.value);
  };

  const handleSubmit = () => {
    if (selectedQuery === "Query 1") {
      navigate("/product-query"); // For Query 1
    } else if (selectedQuery === "Query 2") {
      navigate("/product-query1"); // For Query 2
    } else {
      alert("This functionality is only for Query 1 and Query 2 at the moment.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Select Query</h1>
      <div className="flex flex-col items-center space-y-4 w-80">
        <select
          value={selectedQuery}
          onChange={handleQueryChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="" disabled>
            Select Query
          </option>
          <option value="Query 1">Query 1</option>
          <option value="Query 2">Query 2</option>
          <option value="Query 3">Query 3</option>
        </select>
        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Hero;
