import React from 'react';

function Result() {
  const scrapedData = [
    { srNo: 1, name: 'Product 1', price: '$100', source: 'example.com' },
    { srNo: 2, name: 'Product 2', price: '$120', source: 'another-example.com' },
    { srNo: 2, name: 'Product 2', price: '$120', source: 'another-example.com' },
    { srNo: 2, name: 'Product 2', price: '$120', source: 'another-example.com' },
    { srNo: 2, name: 'Product 2', price: '$120', source: 'another-example.com' },
    // Add more rows as needed
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Scraped Data</h1>
      <table className="table-auto border-collapse w-3/4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Sr. No.</th>
            <th className="border px-4 py-2">Product Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Source</th>
          </tr>
        </thead>
        <tbody>
          {scrapedData.map((item, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{item.srNo}</td>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.price}</td>
              <td className="border px-4 py-2">{item.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Result;
