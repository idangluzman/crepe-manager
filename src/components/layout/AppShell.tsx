import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function AppShell() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-cream">
      <nav className="bg-chocolate text-cream px-4 py-3 flex items-center justify-between shadow-md">
        <Link to="/" className="text-xl font-bold tracking-tight no-underline text-cream">
          🥞 Crepe Manager
        </Link>
        <div className="flex items-center gap-3">
          {location.pathname !== "/" && (
            <Link
              to="/"
              className="text-cream-dark hover:text-white text-sm no-underline transition-colors"
            >
              Leaderboard
            </Link>
          )}
          {user ? (
            <Link
              to="/admin"
              className="bg-accent-orange hover:bg-accent-orange-light text-white px-3 py-1.5 rounded-lg text-sm font-medium no-underline transition-colors"
            >
              Admin
            </Link>
          ) : (
            <Link
              to="/admin"
              className="text-cream-dark hover:text-white text-sm no-underline transition-colors"
            >
              Admin
            </Link>
          )}
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
