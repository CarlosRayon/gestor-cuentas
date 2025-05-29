import { useState } from 'react';
import '../styles/MoneyInput.css';

// Validation function
export const isValidInput = (input) => { // Exported for testing
  // Regex to validate strings like "5,30 € + 12,5€"
  // Allows optional spaces before and after "€"
  // Allows comma as decimal separator
  // Allows multiple additions
  const regex = /^(\d+,\d+\s*€|\d+\s*€)(\s*\+\s*(\d+,\d+\s*€|\d+\s*€))*$/;
  return regex.test(input.trim());
};

// Function to clean input for calculation
export function cleanInput(input) { // Exported for testing
  // Removes "€" and any surrounding spaces, then replaces comma with period for parseFloat
  return input.replace(/\s*€\s*/g, "").replace(/,/g, ".");
}

const MoneyInput = () => {
  const [input, setInput] = useState("");
  const [isValid, setIsValid] = useState(true); // Assume valid initially or for empty input
  const [total, setTotal] = useState(0);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim() === "") {
      setIsValid(true);
      setTotal(0);
      return;
    }

    const valid = isValidInput(value);
    setIsValid(valid);

    if (valid) {
      const numbers = value.split("+").map(item =>
        parseFloat(cleanInput(item)) || 0
      );
      setTotal(numbers.reduce((sum, num) => sum + num, 0));
    } else {
      // Optionally, you might want to reset total or handle it differently when invalid
      // For now, total remains as is until a valid input updates it.
    }
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Ej: 5,30 € + 12,5€"
        className={isValid ? "" : "error"}
        aria-invalid={!isValid} // For accessibility
      />
      {!isValid && <p className="error-message">Formato inválido</p>}
      <div>Total calculado: {total.toFixed(2)}€</div>
    </div>
  );
};

export default MoneyInput;
