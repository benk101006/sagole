import React, { useState, useEffect } from 'react';
import ConverterForm from './ConverterForm';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Import Chart.js

const GetData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formattedData, setFormattedData] = useState([]);
  const [timeframe, setTimeframe] = useState('7D'); // Default timeframe is '7D'
  
  // Helper function to generate the URL based on timeframe
  const generateUrl = (timeframe) => {
    const daysMap = {
      '7D': 7,
      '30D': 30,
      '180D': 180,
      '1Y': 365
    };
    const days = daysMap[timeframe];
    return `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=${days}`;
  };

  const [url, setUrl] = useState(generateUrl(timeframe));

  // Function to format timestamp
  const formatTimestamp = (timestamp, timeframe) => {
    const date = new Date(timestamp);
    switch (timeframe) {
      case '7D':
      case '30D':
        return `${date.getMonth() + 1}/${date.getDate()}`; // MM/DD format for shorter periods
      case '180D':
      case '1Y':
        return `${date.getMonth() + 1}/${date.getFullYear()}`; // MM/YYYY format for longer periods
      default:
        return date.toLocaleDateString(); // Default to locale date string
    }
  };
  
  // Function to filter data based on timeframe
  const filterDataByTimeframe = (data, timeframe) => {
    const now = Date.now();
    let past;

    switch (timeframe) {
      case '7D':
        past = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case '30D':
        past = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case '180D':
        past = now - 180 * 24 * 60 * 60 * 1000;
        break;
      case '1Y':
        past = now - 365 * 24 * 60 * 60 * 1000;
        break;
      default:
        past = now - 7 * 24 * 60 * 60 * 1000;
    }

    const filteredData = data.prices.filter(([timestamp, _price]) => timestamp >= past);
    console.log(`Filtered data for ${timeframe}:`, filteredData);
    return filteredData;
  };

  useEffect(() => {
    console.log(`Fetching data for timeframe: ${timeframe}`);
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await res.json();
        setData(result);

        // Filter data based on timeframe
        const filtered = filterDataByTimeframe(result, timeframe);

        // Process and format the data
        const formatted = filtered.map(([timestamp, price]) => ({
          timestamp: formatTimestamp(timestamp, timeframe),
          price,
        }));

        setFormattedData(formatted);
      } catch (error) {
        setError(error);
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, timeframe]);

  const handleTimeframeChange = (newTimeframe) => {
    console.log(`Changing timeframe to: ${newTimeframe}`);
    setTimeframe(newTimeframe);
    
    // Update URL based on the selected timeframe
    setUrl(generateUrl(newTimeframe));
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error.message}</p>;
  if (!data || !data.prices) return <p className="no-data">No data found</p>;

  const newPrice = formattedData.at(-1);

  // Prepare data for the chart
  const chartData = {
    labels: formattedData.map(item => item.timestamp),
    datasets: [
      {
        label: 'ETH Price',
        data: formattedData.map(item => item.price),
        backgroundColor: 'rgba(255, 0, 0, 0.2)', // Red fill
        borderColor: 'red', // Red line
        borderWidth: 2,
        pointRadius: 0, // Remove points for a cleaner line
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }, // Hide legend
    },
    scales: {
      x: {
        display: true,
        ticks: {
          color: 'white',
          autoSkip: true, // Automatically skip labels to prevent overlap
        },
        grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        display: true,
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  // Extract volume and market cap from data (assuming they exist)
  const latestMarketCap = data.market_caps.length > 0 ? data.market_caps.at(-1)[1] : 'N/A';
  const latestVolume = data.total_volumes.length > 0 ? data.total_volumes.at(-1)[1] : 'N/A';

  return (
    <div className="graph-and-converter-container">
      <div className="graph-container">
        <div className="timeframe-selector">
          {['7D', '30D', '180D', '1Y'].map((tf) => (
            <button
              key={tf}
              className={`timeframe-button ${timeframe === tf ? 'active' : ''}`}
              onClick={() => handleTimeframeChange(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
        <Line data={chartData} options={chartOptions} />
        <div className="graph-info">
          <p>24h Volume: {latestVolume.toLocaleString()} USD</p>
          <p>Market Cap: {latestMarketCap.toLocaleString()} USD</p>
        </div>
      </div>
      <div className="converter-container">
        <h2>Convert United States Dollar (USD) to Ethereum (ETH)</h2>
        <ConverterForm price={newPrice} />
      </div>
    </div>
  );
};

export default GetData;
