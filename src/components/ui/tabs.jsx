import React from 'react';

export const Tabs = ({ children, value, onValueChange }) => (
  <div className="w-full">
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { value, onValueChange });
      }
      return child;
    })}
  </div>
);

export const TabsList = ({ children, value, onValueChange }) => (
  <div className="flex bg-slate-100 p-1 rounded-xl mb-6 gap-1">
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { currentValue: value, onValueChange });
      }
      return child;
    })}
  </div>
);

export const TabsTrigger = ({ children, value, currentValue, onValueChange }) => (
  <button
    type="button"
    onClick={() => onValueChange(value)}
    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
      currentValue === value 
      ? 'bg-white shadow-sm text-blue-600' 
      : 'text-slate-500 hover:text-slate-700'
    }`}
  >
    {children}
  </button>
);

export const TabsContent = ({ children, value, currentValue }) => 
  value === currentValue ? <div className="mt-4">{children}</div> : null;