import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../services/authApiSlice";
import { login } from "../store";

const decodeJwtToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m6.5 8 4.7 3.5a1.5 1.5 0 0 0 1.8 0L17.5 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.5 10V8.5A4.5 4.5 0 0 1 12 4a4.5 4.5 0 0 1 4.5 4.5V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.5 10h11A2.5 2.5 0 0 1 20 12.5v5A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-5A2.5 2.5 0 0 1 6.5 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginApi] = useLoginMutation();

  const isEmailValid = useMemo(() => {
    if (!credentials.email) return true;
    return /^\S+@\S+\.\S+$/.test(credentials.email);
  }, [credentials.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginApi(credentials).unwrap();
      const decoded = decodeJwtToken(response.token);

      if (!decoded?.role) throw new Error("Invalid token - no role");

      dispatch(login(response.token));

      const rolePath =
        decoded.role === "admin"
          ? "admin"
          : decoded.role === "teacher"
          ? "teacher"
          : "student";
      navigate(`/${rolePath}/dashboard`, { replace: true });
    } catch (err) {
      setError(err?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-white shadow-lg">
              <span className="text-lg font-bold">Logo</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-textPrimary">
              Welcome 
            </h1>
            <p className="mt-2 text-sm text-textSecondary">
              Sign in to continue to your dashboard
            </p>
          </div>

          <div className="rounded-3xl bg-card p-6 shadow-xl ring-1 ring-black/5 sm:p-8">
            {error && (
              <div className="mb-5 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
                <div className="font-semibold">Sign-in failed</div>
                <div className="text-error/90">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-textPrimary">
                  Email
                </label>

                <div
                  className={`relative rounded-xl border bg-white transition focus-within:ring-2 ${
                    !isEmailValid
                      ? "border-error/40 focus-within:ring-error/20"
                      : "border-gray-200 focus-within:border-primary focus-within:ring-primary/25"
                  }`}
                >
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-textSecondary">
                    <MailIcon className="h-5 w-5" />
                  </span>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials({ ...credentials, email: e.target.value })
                    }
                    className="w-full rounded-xl bg-transparent py-3 pl-11 pr-4 text-textPrimary placeholder:text-textSecondary/70 outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    required
                    disabled={loading}
                    aria-invalid={!isEmailValid}
                  />
                </div>

                {!isEmailValid && (
                  <p className="mt-2 text-xs text-error">
                    Enter a valid email address.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-textPrimary">
                  Password
                </label>

                <div className="relative rounded-xl border border-gray-200 bg-white transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-textSecondary">
                    <LockIcon className="h-5 w-5" />
                  </span>

                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                    className="w-full rounded-xl bg-transparent py-3 pl-11 pr-20 text-textPrimary placeholder:text-textSecondary/70 outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    required
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute inset-y-0 right-2 my-1 rounded-lg px-3 text-xs font-bold text-secondary/70 hover:bg-background hover:text-secondary"
                    disabled={loading}
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-textSecondary">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30"
                    disabled={loading}
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="text-sm font-semibold text-secondary hover:text-primary"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !isEmailValid}
                className={`w-full rounded-xl py-3 text-sm font-bold text-white shadow-lg transition
                ${
                  loading || !isEmailValid
                    ? "cursor-not-allowed bg-textSecondary"
                    : "bg-primary hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-primary/30"
                }`}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <p className="pt-2 text-center text-xs text-textSecondary">
                By continuing, you agree to the Terms & Privacy Policy.
              </p>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-textSecondary">
            Tip: Use your school email for faster access.
          </p>
        </div>
      </div>
    </div>
  );
}
