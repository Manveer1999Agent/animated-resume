import { Link, Outlet } from "react-router-dom";

export function ProductShell() {
  return (
    <div className="product-shell">
      <aside className="product-sidebar">
        <h1>Workspace</h1>
        <nav className="shell-nav">
          <Link to="/app/dashboard">Dashboard</Link>
        </nav>
      </aside>
      <main className="shell-main">
        <Outlet />
      </main>
    </div>
  );
}
