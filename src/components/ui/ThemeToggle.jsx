import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import "../../css/App.css";

const ThemeMode = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => { 
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button id="themeToggle" onClick={() => setDarkMode(prev => !prev)}>
      {darkMode ? <FaSun className="icon" title="Light Mode" /> : <FaMoon className="icon" title="Dark Mode" />}
    </button>
  );
};

export default ThemeMode;
