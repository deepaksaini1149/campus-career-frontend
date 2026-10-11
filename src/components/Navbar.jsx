function Navbar() {
  return (
    <nav>
      <h2>Campus Career</h2>

      <div>
        <button onClick={() => window.location.href = "/"}>
          Home
        </button>

        <button onClick={() => window.location.href = "/dashboard"}>
          Dashboard
        </button>

        <button onClick={() => window.location.href = "/internships"}>
          Internships
        </button>

        <button onClick={() => window.location.href = "/hackathons"}>
          Hackathons
        </button>

        <button onClick={() => window.location.href = "/competitions"}>
          Competitions
        </button>

        <button onClick={() => window.location.href = "/login"}>
          Login
        </button>

        <button onClick={() => window.location.href = "/register"}>
          Register
        </button>
      </div>
    </nav>
  );
}

export default Navbar;