import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export function LoginButton() {
  const { user, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return (
      <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm mb-4">
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{user.email}</p>
        </div>
        <button
          onClick={signOut}
          className="text-sm text-chocolate-light/60 hover:text-chocolate transition-colors ml-2"
        >
          Sign out
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch {
      setError("Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full px-4 py-3 rounded-lg border-2 border-cream-dark focus:border-accent-orange focus:outline-none bg-white text-chocolate placeholder:text-chocolate-light/40"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full px-4 py-3 rounded-lg border-2 border-cream-dark focus:border-accent-orange focus:outline-none bg-white text-chocolate placeholder:text-chocolate-light/40"
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-accent-orange hover:bg-accent-orange-light disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors"
      >
        {submitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
