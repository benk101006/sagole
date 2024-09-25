# ETH USD Converter

This project is a web application that collects data about Ethereum (ETH), the digital coin.

## projects skills:
- react
- js

## Project Features

### Graph

The graph displays the value of ETH in USD over different time frames selected by the user:

- 7D (7 days)
- 30D (30 days)
- 180D (180 days)
- 1Y (1 year)

Beneath the graph, there are two statistical data points:
- 24h Volume
- Market Cap

The data for the graph is fetched from the following URL: [CoinGecko API](https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7)

### Converter

The second feature on the web application is a converter that uses the most recent value of ETH to allow users to convert from USD to ETH and vice versa.

## Usage

To view the graph or use the converter:
1. Select the desired timeframe for the graph to display the ETH value changes over that period.
2. Use the converter to input an amount in USD to see the equivalent amount in ETH based on the latest conversion rate.
