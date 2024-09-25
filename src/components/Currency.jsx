// File3: Currency.js
import React from 'react';
import PropTypes from 'prop-types';

const currencies = ['USD', 'ETH'];

const Currency = ({ selectedCurrency, handleCurrency }) => {
  return (
    <div className="currency-select">
      <select
        onChange={(e) => handleCurrency(e.target.value)}
        className="currency-dropdown"
        value={selectedCurrency || currencies[0]} // Fallback to first currency if none selected
      >
        {currencies.map(currency => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
}

Currency.propTypes = {
  selectedCurrency: PropTypes.string,
  handleCurrency: PropTypes.func.isRequired,
};

export default Currency;
