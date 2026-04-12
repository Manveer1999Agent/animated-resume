import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { SparklesText } from "../../components/ui/sparkles-text";

export function MarketingShell() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className="marketing-shell">
      <header className="shell-header">
        <SparklesText text="Animated Resume" sparklesCount={10} className="text-xl" />
        <nav className="shell-nav">
          <button 
            onClick={toggleTheme}
            style={{
              background: 'transparent', border: '1px solid var(--ar-color-border)', 
              borderRadius: '8px', padding: '4px 8px', cursor: 'pointer',
              color: 'var(--ar-color-text-primary)'
            }}
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </nav>
      </header>
      <main className="shell-main">
        <Outlet />
      </main>
    </div>
  );
}
