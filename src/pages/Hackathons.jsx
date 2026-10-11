
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Hackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://campus-career-backend-hibf.onrender.com/api/opportunities/type/Hackathon")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load hackathons");
        }
        return response.json();
      })
      .then((data) => {
        setHackathons(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching hackathons:", err);
        setError("Unable to load hackathons. Please check the backend.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredHackathons = hackathons.filter((item) => {
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
        <h1>Discover Hackathons</h1>
        <p>
          Build innovative solutions, collaborate with talented people, and
          turn your ideas into reality.
        </p>

        <input
          className="opportunity-search"
          type="search"
          placeholder="Search by hackathon, organization or location..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search hackathons"
        />

        {!loading && !error && (
          <p>
            {filteredHackathons.length} hackathon
            {filteredHackathons.length === 1 ? "" : "s"} found
          </p>
        )}
      </section>

      <section className="opportunity-grid">
        {loading && <p>Loading hackathons...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading &&
          !error &&
          filteredHackathons.map((item) => (
            <article className="opportunity-card" key={item.id}>
              <span className="opportunity-type">HACKATHON</span>

              <h2>{item.title || "Untitled Hackathon"}</h2>

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

        {!loading && !error && filteredHackathons.length === 0 && (
          <p>No hackathons found. Try another search or check back later.</p>
        )}
      </section>
    </main>
  );
}

export default Hackathons;
