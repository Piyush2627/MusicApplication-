import { useEffect, useState } from "react";

function ThemeToggleButton() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode((prev) => !prev)}
      className="rounded bg-gray-200 px-4 py-2 dark:bg-gray-700"
    >
      Toggle {darkMode ? "Light" : "Dark"} Mode
    </button>
  );
}
export default ThemeToggleButton;
