
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!name.trim() || !email.trim() || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setMessage(
          data?.message ||
            data?.error ||
            "Registration failed. This email may already be registered."
        );
        return;
      }

      if (!data || !data.id || !data.email) {
        setMessage(
          "Registration response was unexpected. Check the backend before trying again."
        );
        return;
      }

      setSuccess(true);
      setMessage("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Unable to connect to the server. Please start the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="opportunities-page">
      <section className="opportunities-hero">
        <p className="section-eyebrow">CAMPUS CAREER</p>
        <h1>Create Your Account</h1>
        <p>Join Campus Career and discover opportunities for your future.</p>

        <form
          onSubmit={handleRegister}
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
            htmlFor="register-name"
            style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}
          >
            Full name
          </label>

          <input
            id="register-name"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={100}
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
            htmlFor="register-email"
            style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}
          >
            Email address
          </label>

          <input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            maxLength={150}
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
            htmlFor="register-password"
            style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}
          >
            Password
          </label>

          <input
            id="register-password"
            type="password"
            placeholder="At least 6 characters"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
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
            {loading ? "Creating account..." : "Create Account"}
          </button>

          {message && (
            <p
              role="status"
              style={{
                marginTop: "16px",
                color: success ? "#15803d" : "#dc2626",
                textAlign: "center",
              }}
            >
              {message}
            </p>
          )}

          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;
