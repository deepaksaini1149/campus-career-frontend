
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Internships() {
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://campus-career-backend-hibf.onrender.com/api/opportunities/type/Internship")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load internships");
        }
        return response.json();
      })
      .then((data) => {
        setInternships(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching internships:", err);
        setError("Backend is not running. Please start Spring Boot.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredInternships = internships.filter((item) => {
    const query = search.toLowerCase();

    return (
      (item.title || "").toLowerCase().includes(query) ||
      (item.organization || "").toLowerCase().includes(query) ||
      (item.location || "").toLowerCase().includes(query)
    );
  });

  const handleApply = (opportunityId) => {
    const savedUser = localStorage.getItem("campusCareerUser");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);

        if (user?.id && user?.email) {
          navigate(`/apply/${opportunityId}`);
          return;
        }
      } catch (err) {
        console.error("Invalid saved login:", err);
      }
    }

    navigate("/login", {
      state: { from: `/apply/${opportunityId}` },
    });
  };

  return (
    <main className="opportunities-page">
      <section className="opportunities-hero">
        <p className="section-eyebrow">CAMPUS CAREER</p>
        <h1>Find Your Next Internship</h1>
        <p>Discover opportunities and build your professional future.</p>

        <input
          className="opportunity-search"
          type="search"
          placeholder="Search by title, company or location..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search internships"
        />

        {!loading && !error && (
          <p>{filteredInternships.length} internships found</p>
        )}
      </section>

      <section className="opportunity-grid">
        {loading && <p>Loading internships...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading &&
          !error &&
          filteredInternships.map((item) => (
            <article className="opportunity-card" key={item.id}>
              <span className="opportunity-type">INTERNSHIP</span>

              <h2>{item.title || "Untitled Internship"}</h2>

              <p>
                <strong>Company:</strong>{" "}
                {item.organization || "Not specified"}
              </p>

              <p>
                <strong>Location:</strong> {item.location || "Not specified"}
              </p>

              <p>
                <strong>Mode:</strong> {item.mode || "Not specified"}
              </p>

              <p>
                <strong>Duration:</strong> {item.duration || "Not specified"}
              </p>

              <p>
                <strong>Eligibility:</strong>{" "}
                {item.eligibility || "Not specified"}
              </p>

              <p>
                <strong>Deadline:</strong> {item.deadline || "Not specified"}
              </p>

              <p>{item.description || "No description available."}</p>

              <div className="opportunity-actions">
                <button
                  type="button"
                  onClick={() => navigate(`/opportunity/${item.id}`)}
                >
                  View Details
                </button>

                <button
                  type="button"
                  onClick={() => handleApply(item.id)}
                >
                  Apply Now
                </button>
              </div>
            </article>
          ))}

        {!loading && !error && filteredInternships.length === 0 && (
          <p>No internships found. Try another search.</p>
        )}
      </section>
    </main>
  );
}

export default Internships;
