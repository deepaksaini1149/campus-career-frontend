
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://campus-career-backend-hibf.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      if (!response.ok) {
        setMessage("Invalid email or password.");
        return;
      }

      const data = await response.json();

      if (!data || !data.id || !data.email) {
        setMessage("Invalid email or password.");
        return;
      }

      localStorage.setItem(
        "campusCareerUser",
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
        })
      );

      const redirectPath = location.state?.from || "/dashboard";

      setMessage("Login successful! Redirecting...");

      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to connect to server. Please start the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="opportunities-page">
      <section className="opportunities-hero">
        <p className="section-eyebrow">CAMPUS CAREER</p>
        <h1>Welcome Back</h1>
        <p>Sign in to explore opportunities and manage your applications.</p>

        <form
          onSubmit={handleLogin}
          style={{
            maxWidth: "420px",
            margin: "28px auto",
            padding: "28px",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 10px 35px rgba(30, 41, 59, 0.10)",
            textAlign: "left",
          }}
        >
          <label
            htmlFor="login-email"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Email address
          </label>

          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          />

          <label
            htmlFor="login-password"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Password
          </label>

          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "8px",
              background: loading ? "#64748b" : "#4f46e5",
              color: "white",
              fontWeight: 600,
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          {message && (
            <p
              role="status"
              style={{
                marginTop: "16px",
                color: message.startsWith("Login successful")
                  ? "#15803d"
                  : "#dc2626",
                textAlign: "center",
              }}
            >
              {message}
            </p>
          )}

          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;
