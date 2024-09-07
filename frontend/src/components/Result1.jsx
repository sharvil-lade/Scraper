import React from 'react';
import { useLocation } from 'react-router-dom';

function Result() {
  const location = useLocation();
  const { products } = location.state;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-6">Scraped Data</h1>
      <table className="table-auto border-collapse w-3/4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Sr. No.</th>
            <th className="border px-4 py-2">Product Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Link</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{product.title}</td>
              <td className="border px-4 py-2">{product.price}</td>
              <td className="border px-4 py-2">
                <a href={product.link} target="_blank" rel="noopener noreferrer">
                  Product Link
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Result;
