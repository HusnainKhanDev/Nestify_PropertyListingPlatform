import React from 'react';

const Analytics = ({ data }) => {
  // Destructuring data from recordsets
   if (!data || !Array.isArray(data) || data.length < 5) {
    return <div>Loading analytics or not enough data...</div>;
  }

  const cityCounts = data[0] || [];
  const purposeCounts = data[1] || [];
  const totalListings = data[2][0]['Total Listings'] || [];
  const highestPriceProps = data[3] || [];
  const avgPrices = data[4] || [];

  return (
    <div className='bg-gray-100 w-full h-auto p-6 rounded-md shadow-lg space-y-6'>
      <h2 className='text-2xl font-bold text-center mb-4'>📊 Listing Analytics</h2>

      {/* City-wise Property Count */}
      <section>
        <h3 className='text-lg font-semibold mb-2'>🏙️ Property Count per City</h3>
        <table className='w-full border border-gray-400 text-sm'>
          <thead className='bg-blue-200'>
            <tr>
              <th className='p-2 border'>City</th>
              <th className='p-2 border'>Property Count</th>
            </tr>
          </thead>
          <tbody>
            {cityCounts.map((item, index) => (
              <tr key={index} className='text-center'>
                <td className='p-2 border'>{item?.City}</td>
                <td className='p-2 border'>{item?.PropertyCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Purpose Count */}
      <section>
        <h3 className='text-lg font-semibold mb-2'>🎯 Listings by Purpose</h3>
        <div className='space-y-1'>
          {purposeCounts.map((item, index) => (
            <div key={index} className='bg-white p-3 rounded border'>
              {`${item?.Purpose}: ${item?.TotalListings} Listing(s)`}
            </div>
          ))}
        </div>
      </section>

      {/* Total Listings */}
      <section>
        <h3 className='text-lg font-semibold mb-2'>📌 Total Listings</h3>
        <div className='bg-white p-3 rounded border w-fit'>
          Total Listings: <span className='font-bold'>{totalListings}</span>
        </div>
      </section>

      {/* Highest Price per Purpose */}
      <section>
        <h3 className='text-lg font-semibold mb-2'> Highest Price by Purpose</h3>
        <table className='w-full border border-gray-400 text-sm'>
          <thead className='bg-green-200'>
            <tr>
              <th className='p-2 border'>Purpose</th>
              <th className='p-2 border'>Highest Price</th>
            </tr>
          </thead>
          <tbody>
            {highestPriceProps.map((item, index) => (
              <tr key={index} className='text-center'>
                <td className='p-2 border'>{item?.Purpose}</td>
                <td className='p-2 border'>Rs. {item["Heighest Price Property"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Avg Price by City & Purpose */}
      <section>
        <h3 className='text-lg font-semibold mb-2'>📈 Average Price by City and Purpose</h3>
        <table className='w-full border border-gray-400 text-sm'>
          <thead className='bg-yellow-200'>
            <tr>
              <th className='p-2 border'>City</th>
              <th className='p-2 border'>Purpose</th>
              <th className='p-2 border'>Average Price</th>
            </tr>
          </thead>
          <tbody>
            {avgPrices.map((item, index) => (
              <tr key={index} className='text-center'>
                <td className='p-2 border'>{item?.City}</td>
                <td className='p-2 border'>{item?.Purpose}</td>
                <td className='p-2 border'>Rs. {item?.AvgPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Analytics;
