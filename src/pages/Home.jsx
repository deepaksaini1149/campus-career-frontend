
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const categories = [
    {
      icon: "💼",
      title: "Internships",
      description: "Gain practical experience and build your career.",
      path: "/internships",
      count: "Explore opportunities",
      color: "purple"
    },
    {
      icon: "🚀",
      title: "Hackathons",
      description: "Build innovative projects and solve real problems.",
      path: "/hackathons",
      count: "Discover events",
      color: "blue"
    },
    {
      icon: "🏆",
      title: "Competitions",
      description: "Challenge yourself and showcase your skills.",
      path: "/competitions",
      count: "Find competitions",
      color: "orange"
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim().toLowerCase();

    if (
      query.includes("hack") ||
      query.includes("innovation")
    ) {
      navigate("/hackathons");
    } else if (
      query.includes("competition") ||
      query.includes("coding") ||
      query.includes("contest")
    ) {
      navigate("/competitions");
    } else {
      navigate("/internships");
    }
  };

  return (
    <main className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            ✨ YOUR CAREER JOURNEY STARTS HERE
          </span>

          <h1>
            Discover Opportunities.
            <br />
            <span>Build Your Future.</span>
          </h1>

          <p className="hero-description">
            Find internships, join exciting hackathons, and
            participate in competitions. Everything you need
            to take the next step in your career, in one place.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Search internships, hackathons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search career opportunities"
            />

            <button type="submit">
              Explore Now →
            </button>
          </form>

          <div className="hero-trust">
            <span>✓ Student-friendly platform</span>
            <span>✓ Multiple opportunity categories</span>
          </div>
        </div>

        {/* DECORATIVE GRAPHICS */}
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-glow"></div>

          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>

          <div className="hero-main-icon">🎓</div>

          <div className="floating-card floating-card-top">
            <span className="floating-icon">💼</span>
            <div>
              <strong>Career Growth</strong>
              <small>Build your experience</small>
            </div>
          </div>

          <div className="floating-card floating-card-bottom">
            <span className="floating-icon">🏆</span>
            <div>
              <strong>Show Your Skills</strong>
              <small>Make your mark</small>
            </div>
          </div>

          <div className="floating-star star-one">✦</div>
          <div className="floating-star star-two">✧</div>
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section className="category-section">
        <div className="section-heading">
          <span className="section-eyebrow">EXPLORE YOUR OPTIONS</span>
          <h2>Opportunities for Every Ambition</h2>
          <p>
            Learn, experiment, compete, and take your next career step.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <article
              className={`category-card ${category.color}`}
              key={category.title}
            >
              <div className="category-icon">
                {category.icon}
              </div>

              <h3>{category.title}</h3>

              <p>{category.description}</p>

              <button
                type="button"
                className="category-button"
                onClick={() => navigate(category.path)}
              >
                {category.count} →
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="section-heading">
          <span className="section-eyebrow">SIMPLE AND CONVENIENT</span>
          <h2>Your Next Opportunity Is Just Steps Away</h2>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Explore</h3>
            <p>
              Browse internships, hackathons, and competitions
              that match your interests.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h3>Discover</h3>
            <p>
              Review eligibility, deadlines, duration, and
              opportunity details.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Apply</h3>
            <p>
              Complete the application form and take the next
              step toward your goals.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="home-cta">
        <div>
          <span>YOUR FUTURE IS WAITING</span>
          <h2>Ready to take the next step?</h2>
          <p>
            Start exploring opportunities and turn your skills
            into real-world experience.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/register")}
        >
          Get Started →
        </button>
      </section>
    </main>
  );
}

export default Home;
