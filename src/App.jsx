
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import Internships from "./pages/Internships";
import Hackathons from "./pages/Hackathons";
import Competitions from "./pages/Competitions";

import OpportunityDetails from "./pages/OpportunityDetails";
import ApplicationForm from "./pages/ApplicationForm";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* User Account */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Opportunities */}
        <Route path="/internships" element={<Internships />} />
        <Route path="/hackathons" element={<Hackathons />} />
        <Route path="/competitions" element={<Competitions />} />

        {/* Opportunity Details and Applications */}
        <Route
          path="/opportunity/:id"
          element={<OpportunityDetails />}
        />

        <Route
          path="/apply/:id"
          element={<ApplicationForm />}
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
