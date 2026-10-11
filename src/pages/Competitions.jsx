
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Competitions() {
  const [competitions, setCompetitions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/opportunities/type/Competition")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load competitions");
        }
        return response.json();
      })
      .then((data) => {
        setCompetitions(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching competitions:", err);
        setError("Unable to load competitions. Please check the backend.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredCompetitions = competitions.filter((item) => {
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
        <h1>Explore Competitions</h1>
        <p>
          Challenge yourself, showcase your skills, and earn recognition for
          your talent.
        </p>

        <input
          className="opportunity-search"
          type="search"
          placeholder="Search by competition, organization or location..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search competitions"
        />

        {!loading && !error && (
          <p>
            {filteredCompetitions.length} competition
            {filteredCompetitions.length === 1 ? "" : "s"} found
          </p>
        )}
      </section>

      <section className="opportunity-grid">
        {loading && <p>Loading competitions...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading &&
          !error &&
          filteredCompetitions.map((item) => (
            <article className="opportunity-card" key={item.id}>
              <span className="opportunity-type">COMPETITION</span>

              <h2>{item.title || "Untitled Competition"}</h2>

              <p>
                <strong>Organization:</strong>{" "}
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

        {!loading && !error && filteredCompetitions.length === 0 && (
          <p>
            {search
              ? "No competitions match your search. Try another keyword."
              : "No competitions are available right now. Please check back later."}
          </p>
        )}
      </section>
    </main>
  );
}

export default Competitions;
