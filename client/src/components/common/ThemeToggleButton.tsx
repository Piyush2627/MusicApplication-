import { useEffect, useState } from "react";

function ThemeToggleButton() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white text-black transition-colors dark:bg-gray-900 dark:text-white">
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        className="rounded bg-gray-200 px-4 py-2 dark:bg-gray-700"
      >
        Toggle {darkMode ? "Light" : "Dark"} Mode
      </button>
    </div>
  );
}
export default ThemeToggleButton;
