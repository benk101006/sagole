import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import ConverterForm from './ConverterForm';

const URL7D = 'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7%0A'
const URL30D = 'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=30%0A'
const URL180D = 'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=180%0A'


const GraphAndConverter = ({ data, volume, marketCap }) => {
  const [timeframe, setTimeframe] = useState('7D');

  const filteredData = data.filter((item) => {
    // Filter data based on the selected timeframe
    return item.timeframe === timeframe;
  });

  const chartData = {
    labels: filteredData.map(item => item.timestamp),
    datasets: [
      {
        label: 'ETH Price',
        data: filteredData.map(item => item.price),
        backgroundColor: 'black',
        borderColor: 'red',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="graph-and-converter-container">
      <div className="graph-container">
        <Line data={chartData} />
        <div className="graph-info">
          <p>24h Volume: {volume} USD</p>
          <p>Market Cap: {marketCap} USD</p>
        </div>
      </div>
      <div className="converter-container">
        <h2>Convert United States Dollar (USD) to Ethereum (ETH)</h2>
        <ConverterForm price={filteredData.at(-1)} />
      </div>
    </div>
  );
};

export default GraphAndConverter;
