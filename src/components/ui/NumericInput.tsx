import React, { useState, useEffect } from 'react';

interface NumericInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number | string;
  onValueChange: (value: number) => void;
  className?: string;
}

export function NumericInput({ value, onValueChange, className, ...props }: NumericInputProps) {
  // Internal state to handle the display string (with separators)
  const [displayValue, setDisplayValue] = useState('');

  // Update display value when the numerical value prop changes
  useEffect(() => {
    if (value === '' || value === undefined || value === null) {
      setDisplayValue('');
    } else {
      setDisplayValue(formatNumber(Number(value)));
    }
  }, [value]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters to get the raw number
    const rawValue = e.target.value.replace(/\D/g, '');
    
    if (rawValue === '') {
      setDisplayValue('');
      onValueChange(0); // or handle as needed, maybe NaN/null
    } else {
      const numValue = parseInt(rawValue, 10);
      setDisplayValue(formatNumber(numValue)); // Update display immediately
      onValueChange(numValue);
    }
  };

  return (
    <input
      {...props}
      type="text" // Must be text to support separators
      value={displayValue}
      onChange={handleChange}
      className={className}
      inputMode="numeric"
    />
  );
}
