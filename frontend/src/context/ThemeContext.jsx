// src/context/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check localStorage or default to 'dark' (luxury)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'luxury');

  useEffect(() => {
    // 1. Update HTML tag
    document.documentElement.setAttribute('data-theme', theme);
    // 2. Save to storage
    localStorage.setItem('theme', theme);
    
    // 3. OPTIONAL: specific Tailwind dark mode handling if strictly using 'dark' class
    if (theme === 'luxury' || theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'luxury' ? 'corporate' : 'luxury'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);