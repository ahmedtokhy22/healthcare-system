import React from 'react';
export const Select = ({ onValueChange, children }) => {
  return <div className="relative w-full" onChange={(e) => onValueChange(e.target.value)}>{children}</div>;
};

export const SelectTrigger = ({ children }) => <div className="w-full">{children}</div>;

export const SelectValue = ({ placeholder }) => null; // مش هنحتاجه في النسخة المبسطة

export const SelectContent = ({ children }) => (
  <select className="w-full p-2 border rounded-md bg-white">{children}</select>
);

export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);