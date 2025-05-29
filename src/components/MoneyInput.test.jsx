import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MoneyInput, { isValidInput, cleanInput } from './MoneyInput.jsx';

describe('isValidInput utility', () => {
  it('validates "5,30 € + 12,5€" as true', () => expect(isValidInput('5,30 € + 12,5€')).toBe(true));
  it('validates "10 € + 3,5 € + 2 €" as true', () => expect(isValidInput('10 € + 3,5 € + 2 €')).toBe(true));
  it('validates "5,30€ + 12,5 €" as true', () => expect(isValidInput('5,30€ + 12,5 €')).toBe(true));
  it('validates "5.30 € + 12,5€" as false (uses period)', () => expect(isValidInput('5.30 € + 12,5€')).toBe(false));
  it('validates "5, € + 12,5€" as false (missing digit after comma)', () => expect(isValidInput('5, € + 12,5€')).toBe(false));
  it('validates "" as false (empty string)', () => expect(isValidInput('')).toBe(false)); // component handles empty as valid
  it('validates "10€" as true', () => expect(isValidInput('10€')).toBe(true));
  it('validates "10,50€" as true', () => expect(isValidInput('10,50€')).toBe(true));
  it('validates "10,50 €" as true', () => expect(isValidInput('10,50 €')).toBe(true));
  it('validates "10,50 € + 5€" as true', () => expect(isValidInput('10,50 € + 5€')).toBe(true));
  it('validates "abc" as false', () => expect(isValidInput('abc')).toBe(false));
  it('validates "10,€ + 5" as false', () => expect(isValidInput('10,€ + 5')).toBe(false));
});

describe('cleanInput utility', () => {
  it('cleans "5,30 €" to "5.30"', () => expect(cleanInput('5,30 €')).toBe('5.30'));
  it('cleans "12,5€" to "12.5"', () => expect(cleanInput('12,5€')).toBe('12.5'));
  it('cleans "10€" to "10"', () => expect(cleanInput('10€')).toBe('10'));
});

describe('MoneyInput Component', () => {
  beforeEach(() => {
    render(<MoneyInput />);
  });

  it('renders input field and total display', () => {
    expect(screen.getByPlaceholderText(/Ej: 5,30 € \+ 12,5€/i)).toBeInTheDocument();
    expect(screen.getByText(/Total calculado: 0.00€/i)).toBeInTheDocument();
  });

  it('calculates total for valid input: "5,30 € + 12,5€"', () => {
    const inputField = screen.getByPlaceholderText(/Ej: 5,30 € \+ 12,5€/i);
    fireEvent.change(inputField, { target: { value: '5,30 € + 12,5€' } });
    expect(screen.getByText(/Total calculado: 17.80€/i)).toBeInTheDocument();
    expect(inputField).not.toHaveClass('error');
    expect(screen.queryByText(/Formato inválido/i)).not.toBeInTheDocument();
  });

  it('calculates total for valid input: "10 € + 3,5 € + 2 €"', () => {
    const inputField = screen.getByPlaceholderText(/Ej: 5,30 € \+ 12,5€/i);
    fireEvent.change(inputField, { target: { value: '10 € + 3,5 € + 2 €' } });
    expect(screen.getByText(/Total calculado: 15.50€/i)).toBeInTheDocument();
  });
  
  it('calculates total for valid input: "5,30€ + 12,5 €"', () => {
    const inputField = screen.getByPlaceholderText(/Ej: 5,30 € \+ 12,5€/i);
    fireEvent.change(inputField, { target: { value: '5,30€ + 12,5 €' } });
    expect(screen.getByText(/Total calculado: 17.80€/i)).toBeInTheDocument();
  });

  it('shows error for invalid input: "5.30 € + 12,5€"', () => {
    const inputField = screen.getByPlaceholderText(/Ej: 5,30 € \+ 12,5€/i);
    fireEvent.change(inputField, { target: { value: '5.30 € + 12,5€' } });
    expect(inputField).toHaveClass('error');
    expect(screen.getByText(/Formato inválido/i)).toBeInTheDocument();
    expect(screen.getByText(/Total calculado: 0.00€/i)).toBeInTheDocument(); // Assuming reset or initial state
  });

  it('shows error for invalid input: "5, € + 12,5€"', () => {
    const inputField = screen.getByPlaceholderText(/Ej: 5,30 € \+ 12,5€/i);
    fireEvent.change(inputField, { target: { value: '5, € + 12,5€' } });
    expect(inputField).toHaveClass('error');
    expect(screen.getByText(/Formato inválido/i)).toBeInTheDocument();
  });

  it('handles empty input correctly', () => {
    const inputField = screen.getByPlaceholderText(/Ej: 5,30 € \+ 12,5€/i);
    // First, type something valid
    fireEvent.change(inputField, { target: { value: '5,30 €' } });
    expect(screen.getByText(/Total calculado: 5.30€/i)).toBeInTheDocument();
    // Then, clear the input
    fireEvent.change(inputField, { target: { value: '' } });
    expect(screen.getByText(/Total calculado: 0.00€/i)).toBeInTheDocument();
    expect(inputField).not.toHaveClass('error');
    expect(screen.queryByText(/Formato inválido/i)).not.toBeInTheDocument();
  });

  it('shows error message when input is invalid and hides it when valid', () => {
    const inputField = screen.getByPlaceholderText(/Ej: 5,30 € \+ 12,5€/i);
    // Invalid input
    fireEvent.change(inputField, { target: { value: 'abc' } });
    expect(inputField).toHaveClass('error');
    expect(screen.getByText(/Formato inválido/i)).toBeInTheDocument();

    // Valid input
    fireEvent.change(inputField, { target: { value: '10€' } });
    expect(inputField).not.toHaveClass('error');
    expect(screen.queryByText(/Formato inválido/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Total calculado: 10.00€/i)).toBeInTheDocument();
  });
});
