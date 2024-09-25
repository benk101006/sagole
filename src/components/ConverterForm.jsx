// File2: ConverterForm.js
import { useEffect, useState } from "react";
import Currency from "./Currency";

const ConverterForm = ({ price }) => {
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("ETH");
    const [result, setResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const getExchangeRate = (currentPrice) => {
        setIsLoading(true);
        try {
            if (fromCurrency === "USD" && toCurrency === "ETH") {
                const ethAmount =   amount / currentPrice;
                setResult(`${amount} ${fromCurrency} = ${ethAmount.toFixed(6)} ${toCurrency}`);
            } else if (fromCurrency === "ETH" && toCurrency === "USD") {
                const usdAmount = currentPrice * amount;
                setResult(`${amount} ${fromCurrency} = ${usdAmount.toFixed(2)} ${toCurrency}`);
            } else {
                setResult("Conversion pair not supported.");
            }
        } catch (error) {
            setResult("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    }

    const handleSwapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        // Recalculate the result after swapping
        if (price && price.price) {
            getExchangeRate(price.price);
        }
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (price && price.price) {
            getExchangeRate(price.price);
        }
    }
    
    useEffect(() => {
        if (price && price.price && amount) {
            getExchangeRate(price.price);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [price, amount, fromCurrency, toCurrency]);

    return (
        <form className="converter-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
                <label className="form-label">Amount</label>
                <input
                    type="number"
                    className="form-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Enter ${fromCurrency}`}
                    required
                />
            </div>
            <div className="currency-selector">
                <div className="currency-section">
                    <label className="form-label">From</label>
                    <Currency
                        selectedCurrency={fromCurrency}
                        handleCurrency={(value) => setFromCurrency(value)}
                    />
                </div>
                <button type="button" className="swap-button" onClick={handleSwapCurrencies}>Swap</button>
                <div className="currency-section">
                    <label className="form-label">To</label>
                    <Currency
                        selectedCurrency={toCurrency}
                        handleCurrency={(value) => setToCurrency(value)}
                    />
                </div>
            </div>
            <button type="submit" className={`submit-button ${isLoading ? "loading" : ""}`}>
                {isLoading ? "Calculating..." : "Get Exchange Rate"}
            </button>
            <p className="exchange-rate-result">
                {isLoading ? "Calculating..." : result}
            </p>
        </form>
    )
}

export default ConverterForm;
