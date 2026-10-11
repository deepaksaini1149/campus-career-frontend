
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [checkingLogin, setCheckingLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    branch: "",
    year: "",
    resume: "",
    coverLetter: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("campusCareerUser");

    if (!savedUser) {
      navigate("/login", {
        replace: true,
        state: { from: `/apply/${id}` },
      });
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      if (!parsedUser.id || !parsedUser.email) {
        localStorage.removeItem("campusCareerUser");
        navigate("/login", {
          replace: true,
          state: { from: `/apply/${id}` },
        });
        return;
      }

      setUser(parsedUser);
      setFormData((previous) => ({
        ...previous,
        name: parsedUser.name || "",
        email: parsedUser.email || "",
      }));
      setCheckingLogin(false);
    } catch {
      localStorage.removeItem("campusCareerUser");
      navigate("/login", {
        replace: true,
        state: { from: `/apply/${id}` },
      });
    }
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    // Check login again before submitting.
    const savedUser = localStorage.getItem("campusCareerUser");

    if (!user || !savedUser) {
      navigate("/login", {
        replace: true,
        state: { from: `/apply/${id}` },
      });
      return;
    }

    let currentUser;

    try {
      currentUser = JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("campusCareerUser");
      navigate("/login", {
        replace: true,
        state: { from: `/apply/${id}` },
      });
      return;
    }

    if (!currentUser?.id || !currentUser?.email) {
      localStorage.removeItem("campusCareerUser");
      navigate("/login", {
        replace: true,
        state: { from: `/apply/${id}` },
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://campus-career-backend-hibf.onrender.com/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            opportunityId: Number(id),
            ...formData,
            name: currentUser.name || formData.name,
            email: currentUser.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Application could not be saved.");
      }

      const savedApplication = await response.json();

      setMessage(
        `Application submitted successfully! Application ID: ${savedApplication.id}`
      );
    } catch (err) {
      console.error("Application error:", err);
      setError(
        "Could not save your application. Please check the backend and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingLogin) {
    return <main className="opportunities-page">Checking login...</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="opportunities-page">
      <section className="opportunities-hero">
        <p className="section-eyebrow">CAMPUS CAREER</p>
        <h1>Apply for Opportunity</h1>
        <p>Complete your details to submit your application.</p>
        <p>
          Logged in as <strong>{user.email}</strong>
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "620px",
          margin: "24px auto",
          padding: "28px",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 10px 35px rgba(30, 41, 59, 0.10)",
        }}
      >
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          readOnly
          required
          style={fieldStyle}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          readOnly
          required
          style={fieldStyle}
        />

        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
          required
          style={fieldStyle}
        />

        <label htmlFor="college">College Name</label>
        <input
          id="college"
          name="college"
          type="text"
          placeholder="Enter your college name"
          value={formData.college}
          onChange={handleChange}
          required
          style={fieldStyle}
        />

        <label htmlFor="branch">Branch</label>
        <input
          id="branch"
          name="branch"
          type="text"
          placeholder="Example: ECE"
          value={formData.branch}
          onChange={handleChange}
          required
          style={fieldStyle}
        />

        <label htmlFor="year">Year of Study</label>
        <select
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
          style={fieldStyle}
        >
          <option value="">Select Year</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>

        <label htmlFor="resume">Resume Link</label>
        <input
          id="resume"
          name="resume"
          type="url"
          placeholder="Paste your resume link"
          value={formData.resume}
          onChange={handleChange}
          required
          style={fieldStyle}
        />

        <label htmlFor="coverLetter">Cover Letter</label>
        <textarea
          id="coverLetter"
          name="coverLetter"
          placeholder="Write a short cover letter"
          value={formData.coverLetter}
          onChange={handleChange}
          rows={6}
          required
          style={fieldStyle}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>

        {message && (
          <div role="status">
            <h3>{message}</h3>
            <button type="button" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </button>
          </div>
        )}

        {error && <p className="error-message" role="alert">{error}</p>}

        <p>
          Changed your mind? <Link to="/dashboard">Return to Dashboard</Link>
        </p>
      </form>
    </main>
  );
}

const fieldStyle = {
  display: "block",
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "18px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  boxSizing: "border-box",
};

export default ApplicationForm;
