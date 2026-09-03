import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LockKeyhole, ReceiptText } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("ChangeMeAdmin123!");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-[#eef3f0]">
      <section className="hidden min-h-screen w-[42%] bg-[#0d1c1e] px-14 py-12 text-white lg:block">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600">
            <ReceiptText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">BizManager</h1>
            <p className="text-sm text-emerald-100">Business System</p>
          </div>
        </div>
        <div className="mt-28 max-w-md">
          <p className="text-sm font-semibold uppercase text-emerald-300">Sales Recording</p>
          <h2 className="mt-4 text-5xl font-bold leading-tight">Fast invoices for daily business.</h2>
          <p className="mt-6 text-lg text-slate-300">
            Login to create transactions, print clean invoices, and keep every record safely in PostgreSQL.
          </p>
        </div>
      </section>

      <section className="flex min-h-screen flex-1 items-center justify-center px-5">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-xl">
          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-950">Login</h2>
            <p className="mt-2 text-sm text-slate-500">Use your admin or employee account.</p>
          </div>

          <label className="block text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-emerald-700"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
          />

          <label className="mt-5 block text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-emerald-700"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
          />

          {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}

          <button
            className="mt-7 h-11 w-full rounded-md bg-emerald-700 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
