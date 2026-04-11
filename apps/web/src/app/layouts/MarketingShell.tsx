import { Link, Outlet } from "react-router-dom";

export function MarketingShell() {
  return (
    <div className="marketing-shell">
      <header className="shell-header">
        <strong>Animated Resume</strong>
        <nav className="shell-nav">
          <Link to="/">Home</Link>
          <Link to="/auth/sign-in">Sign in</Link>
          <Link to="/auth/sign-up">Create account</Link>
        </nav>
      </header>
      <main className="shell-main">
        <Outlet />
      </main>
    </div>
  );
}
