import { useState, useEffect } from 'react';
import '../styles/MoneyInput.css';

// Validation function
export const isValidInput = (input) => {
  // Regex to validate strings like "5,30 € + 12,5€"
  // Allows optional spaces before and after "€"
  // Allows comma as decimal separator
  // Allows multiple additions
  const regex = /^(\d+,\d+\s*€|\d+\s*€)(\s*\+\s*(\d+,\d+\s*€|\d+\s*€))*$/;
  return regex.test(input.trim());
};

// Function to clean input for calculation
export function cleanInput(input) {
  // Removes "€" and any surrounding spaces, then replaces comma with period for parseFloat
  return input.replace(/\s*€\s*/g, "").replace(/,/g, ".");
}

const MoneyInput = (props) => {
  const { id, onChangeTotal, placeholder = "Ej: 5,30 € + 12,5€", initialValue = "" } = props;
  const [input, setInput] = useState(initialValue);
  const [isValid, setIsValid] = useState(true);
  const [total, setTotal] = useState(0);

  // Effect to process initialValue once on mount and when initialValue changes
  useEffect(() => {
    if (initialValue.trim() === "") {
      setIsValid(true);
      setTotal(0);
      // No need to call onChangeTotal here as handleChange will be triggered if parent needs to update
      // and Manager will calculate initial totals.
    } else {
      const valid = isValidInput(initialValue);
      setIsValid(valid);
      if (valid) {
        const numbers = initialValue.split("+").map(item =>
          parseFloat(cleanInput(item)) || 0
        );
        const newTotal = numbers.reduce((sum, num) => sum + num, 0);
        setTotal(newTotal);
        // Call onChangeTotal if the initial value is valid and should propagate up immediately
        // This is important if Manager relies on this for initial sum.
        if (onChangeTotal) {
          onChangeTotal(id, newTotal);
        }
      } else {
        setTotal(0); // Reset total for invalid initial value
        if (onChangeTotal) {
          onChangeTotal(id, 0); // Signal 0 for invalid initial value
        }
      }
    }
  }, [id, initialValue, onChangeTotal]); // Added onChangeTotal to dependencies

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim() === "") {
      setIsValid(true);
      setTotal(0);
      if (onChangeTotal) {
        onChangeTotal(id, 0);
      }
      return;
    }

    const valid = isValidInput(value);
    setIsValid(valid);

    if (valid) {
      const numbers = value.split("+").map(item =>
        parseFloat(cleanInput(item)) || 0
      );
      const newTotal = numbers.reduce((sum, num) => sum + num, 0);
      setTotal(newTotal);
      if (onChangeTotal) {
        onChangeTotal(id, newTotal);
      }
    } else {
      // When input is invalid but not empty, signal 0 for calculation purposes.
      // The component's own 'total' state might be left as is or reset,
      // but parent should get 0. Let's reset internal total too.
      setTotal(0); 
      if (onChangeTotal) {
        onChangeTotal(id, 0);
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        id={id} // Set the id prop on the input element
        value={input}
        onChange={handleChange}
        placeholder={placeholder}
        className={isValid ? "" : "error"}
        aria-invalid={!isValid} // For accessibility
      />
      {!isValid && <p className="error-message">Formato inválido</p>}
      {/* Display the individual total for this input */}
      <div>Total: {total.toFixed(2)}€</div>
    </div>
  );
};

export default MoneyInput;
