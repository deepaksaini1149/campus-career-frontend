
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("campusCareerUser");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      if (!parsedUser.id || !parsedUser.email) {
        localStorage.removeItem("campusCareerUser");
        navigate("/login");
        return;
      }

      setUser(parsedUser);

      Promise.all([
        fetch("https://campus-career-backend-hibf.onrender.com/api/opportunities"),
        fetch("https://campus-career-backend-hibf.onrender.com/api/applications"),
      ])
        .then(async ([opportunityResponse, applicationResponse]) => {
          if (!opportunityResponse.ok || !applicationResponse.ok) {
            throw new Error("Unable to load dashboard data.");
          }

          return Promise.all([
            opportunityResponse.json(),
            applicationResponse.json(),
          ]);
        })
        .then(([opportunityData, applicationData]) => {
          setOpportunities(
            Array.isArray(opportunityData) ? opportunityData : []
          );

          const allApplications = Array.isArray(applicationData)
            ? applicationData
            : [];

          setApplications(
            allApplications.filter(
              (application) =>
                (application.email || "").toLowerCase() ===
                parsedUser.email.toLowerCase()
            )
          );
        })
        .catch((err) => {
          console.error("Dashboard error:", err);
          setError(
            "Unable to load dashboard information. Please check the backend."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      localStorage.removeItem("campusCareerUser");
      navigate("/login");
    }
  }, [navigate]);

  const internshipCount = opportunities.filter(
    (item) => item.type?.toLowerCase() === "internship"
  ).length;

  const hackathonCount = opportunities.filter(
    (item) => item.type?.toLowerCase() === "hackathon"
  ).length;

  const competitionCount = opportunities.filter(
    (item) => item.type?.toLowerCase() === "competition"
  ).length;

  const handleLogout = () => {
    localStorage.removeItem("campusCareerUser");
    navigate("/login");
  };

  if (!user) {
    return <main className="opportunities-page">Opening dashboard...</main>;
  }

  return (
    <main className="opportunities-page">
      <section className="opportunities-hero">
        <p className="section-eyebrow">STUDENT DASHBOARD</p>
        <h1>Welcome, {user.name || "Student"}!</h1>
        <p>
          Your next opportunity starts here. Explore, apply, and build your
          future.
        </p>

        <button
          type="button"
          onClick={handleLogout}
          className="secondary-button"
        >
          Logout
        </button>
      </section>

      {error && <p className="error-message">{error}</p>}

      <section className="opportunity-grid">
        <article className="opportunity-card">
          <span className="opportunity-type">INTERNSHIPS</span>
          <h2>{loading ? "..." : internshipCount}</h2>
          <p>Explore internships and gain practical experience.</p>
          <Link to="/internships">Explore Internships</Link>
        </article>

        <article className="opportunity-card">
          <span className="opportunity-type">HACKATHONS</span>
          <h2>{loading ? "..." : hackathonCount}</h2>
          <p>Build projects, collaborate, and innovate.</p>
          <Link to="/hackathons">Explore Hackathons</Link>
        </article>

        <article className="opportunity-card">
          <span className="opportunity-type">COMPETITIONS</span>
          <h2>{loading ? "..." : competitionCount}</h2>
          <p>Challenge yourself and showcase your skills.</p>
          <Link to="/competitions">Explore Competitions</Link>
        </article>
      </section>

      <section style={{ marginTop: "40px" }}>
        <h2>My Application History</h2>
        <p>Applications submitted using your registered email address.</p>

        {loading && <p>Loading your applications...</p>}

        {!loading && !error && applications.length === 0 && (
          <article className="opportunity-card">
            <h3>No applications yet</h3>
            <p>
              When you apply for an opportunity, it will appear here.
            </p>
            <Link to="/internships">Find Opportunities</Link>
          </article>
        )}

        {!loading &&
          applications.map((application) => {
            const opportunity = opportunities.find(
              (item) => String(item.id) === String(application.opportunityId)
            );

            return (
              <article
                className="opportunity-card"
                key={application.id}
                style={{ marginBottom: "16px" }}
              >
                <h3>
                  {opportunity?.title || `Opportunity #${application.opportunityId}`}
                </h3>
                <p>
                  <strong>Applicant:</strong> {application.name}
                </p>
                <p>
                  <strong>Email:</strong> {application.email}
                </p>
                <p>
                  <strong>Application ID:</strong> {application.id}
                </p>
                <p>
                  <strong>Organization:</strong>{" "}
                  {opportunity?.organization || "Not available"}
                </p>
              </article>
            );
          })}
      </section>
    </main>
  );
}

export default Dashboard;
