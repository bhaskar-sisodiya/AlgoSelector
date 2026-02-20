// src/context/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Force default to 'dark'
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Force 'dark' if it's anything else (fix for stuck themes)
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme !== 'dark') {
        localStorage.setItem('theme', 'dark');
    }
  }, []);

  useEffect(() => {
    // 1. Update HTML tag
    document.documentElement.setAttribute('data-theme', theme);
    // 2. Save to storage
    localStorage.setItem('theme', theme);
    
    // 3. Force dark class for Tailwind
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    console.log("Theme applied:", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);