import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Product1() {
  const [productType, setProductType] = useState('');
  const [productName, setProductName] = useState('');
  const navigate = useNavigate();

  const handleProductTypeChange = (e) => {
    setProductType(e.target.value);
  };

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleSubmit = async () => {
    if (productType && productName) {
      try {
        const response = await axios.post('http://localhost:5000/scrape1', {
          searchTerm: productName,
        });
        navigate('/result1', { state: { products: response.data } });
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data. Please try again.');
      }
    } else {
      alert('Please fill in both fields');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Enter Product Details for Query 2</h1>
      <div className="flex flex-col items-center space-y-4 w-80">
        <select
          value={productType}
          onChange={handleProductTypeChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="" disabled>Select Type of Product</option>
          <option value="Electronics">Electronics</option>
          <option value="Routers">Routers</option>
          <option value="Hard Disk">Hard Disk</option>
          <option value="Drives">Drives</option>
          <option value="Laptops">Laptops</option>
          <option value="Workstations">Workstations</option>
          <option value="Graphics Cards">Graphics Cards</option>
        </select>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={handleProductNameChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
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

export default Product1;
