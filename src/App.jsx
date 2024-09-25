import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GetData from './components/GetData'



function App() {
  const [count, setCount] = useState(0)

  const URL = 'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7%0A'


  return (
    <>
      <GetData url = {URL}/>
    </>
  )
}

export default App
