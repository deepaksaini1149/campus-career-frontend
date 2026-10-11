
import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/opportunities`;
const APPLICATIONS_URL = `${import.meta.env.VITE_API_BASE_URL}/api/applications`;

const emptyForm = {
  title: "",
  type: "Internship",
  organization: "",
  location: "",
  mode: "Online",
  duration: "",
  eligibility: "",
  deadline: "",
  description: ""
};

function AdminDashboard() {
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [applicationsError, setApplicationsError] = useState("");

  const loadOpportunities = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load opportunities.");
      }

      const data = await response.json();
      setOpportunities(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Unable to load opportunities. Check the backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    setApplicationsLoading(true);
    setApplicationsError("");

    try {
      const response = await fetch(APPLICATIONS_URL);

      if (!response.ok) {
        throw new Error("Could not load applications.");
      }

      const data = await response.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      setApplicationsError(
        "Unable to load applications. Check that the backend is running and the applications API is available."
      );
      console.error(err);
    } finally {
      setApplicationsLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
    loadApplications();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const url = editingId
      ? `${API_URL}/${editingId}`
      : API_URL;

    try {
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Unable to save the opportunity.");
      }

      setMessage(
        editingId
          ? "Opportunity updated successfully!"
          : "Opportunity added successfully!"
      );

      setFormData(emptyForm);
      setEditingId(null);

      await loadOpportunities();
    } catch (err) {
      setError(err.message || "Something went wrong.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (opportunity) => {
    setEditingId(opportunity.id);

    setFormData({
      title: opportunity.title || "",
      type: opportunity.type || "Internship",
      organization: opportunity.organization || "",
      location: opportunity.location || "",
      mode: opportunity.mode || "Online",
      duration: opportunity.duration || "",
      eligibility: opportunity.eligibility || "",
      deadline: opportunity.deadline || "",
      description: opportunity.description || ""
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete opportunity ${id}?`
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Unable to delete the opportunity.");
      }

      setMessage("Opportunity deleted successfully!");

      if (editingId === id) {
        resetForm();
      }

      await loadOpportunities();
    } catch (err) {
      setError(err.message || "Something went wrong.");
      console.error(err);
    }
  };

  const getOpportunityTitle = (application) => {
    const opportunityId = application.opportunityId;

    const opportunity = opportunities.find(
      (item) => String(item.id) === String(opportunityId)
    );

    return opportunity
      ? opportunity.title
      : `Opportunity #${opportunityId ?? "Unknown"}`;
  };

  return (
    <main className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Manage opportunities and review student applications.</p>

      {message && (
        <p role="status" style={{ color: "green" }}>
          {message}
        </p>
      )}

      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}

      <section>
        <h2>
          {editingId
            ? `Edit Opportunity #${editingId}`
            : "Add New Opportunity"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Opportunity Title</label>
          <br />
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter opportunity title"
            required
          />
          <br />
          <br />

          <label>Type</label>
          <br />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="Internship">Internship</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Competition">Competition</option>
          </select>
          <br />
          <br />

          <label>Organization</label>
          <br />
          <input
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder="Enter organization"
            required
          />
          <br />
          <br />

          <label>Location</label>
          <br />
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location"
            required
          />
          <br />
          <br />

          <label>Mode</label>
          <br />
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            required
          >
            <option value="Online">Online</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          <br />
          <br />

          <label>Duration</label>
          <br />
          <input
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Example: 3 Months"
            required
          />
          <br />
          <br />

          <label>Eligibility</label>
          <br />
          <input
            name="eligibility"
            value={formData.eligibility}
            onChange={handleChange}
            placeholder="Who can apply?"
            required
          />
          <br />
          <br />

          <label>Deadline</label>
          <br />
          <input
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            placeholder="Example: 30 October 2026"
            required
          />
          <br />
          <br />

          <label>Description</label>
          <br />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter opportunity details"
            rows={5}
            required
          />
          <br />
          <br />

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId
                ? "Update Opportunity"
                : "Add Opportunity"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </form>
      </section>

      <hr />

      <section>
        <h2>Manage Opportunities</h2>

        <button type="button" onClick={loadOpportunities}>
          Refresh Opportunities
        </button>

        {loading ? (
          <p>Loading opportunities...</p>
        ) : opportunities.length === 0 ? (
          <p>No opportunities found.</p>
        ) : (
          opportunities.map((opportunity) => (
            <article
              key={opportunity.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                margin: "16px 0"
              }}
            >
              <h3>{opportunity.title}</h3>
              <p><strong>ID:</strong> {opportunity.id}</p>
              <p><strong>Type:</strong> {opportunity.type}</p>
              <p>
                <strong>Organization:</strong>{" "}
                {opportunity.organization}
              </p>
              <p><strong>Location:</strong> {opportunity.location}</p>
              <p><strong>Mode:</strong> {opportunity.mode}</p>
              <p><strong>Duration:</strong> {opportunity.duration}</p>
              <p>
                <strong>Eligibility:</strong>{" "}
                {opportunity.eligibility}
              </p>
              <p><strong>Deadline:</strong> {opportunity.deadline}</p>
              <p>
                <strong>Description:</strong>{" "}
                {opportunity.description}
              </p>

              <button
                type="button"
                onClick={() => handleEdit(opportunity)}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDelete(opportunity.id)}
              >
                Delete
              </button>
            </article>
          ))
        )}
      </section>

      <hr />

      <section>
        <h2>Student Applications</h2>
        <p>
          Total applications: <strong>{applications.length}</strong>
        </p>

        <button
          type="button"
          onClick={() => {
            loadOpportunities();
            loadApplications();
          }}
        >
          Refresh Applications
        </button>

        {applicationsError && (
          <p role="alert" style={{ color: "red" }}>
            {applicationsError}
          </p>
        )}

        {applicationsLoading ? (
          <p>Loading student applications...</p>
        ) : applications.length === 0 ? (
          <p>No student applications found.</p>
        ) : (
          applications.map((application) => (
            <article
              key={application.id}
              style={{
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                padding: "18px",
                margin: "16px 0",
                background: "#fff"
              }}
            >
              <h3>Application #{application.id}</h3>

              <p>
                <strong>Opportunity:</strong>{" "}
                {getOpportunityTitle(application)}
              </p>

              <p>
                <strong>Opportunity ID:</strong>{" "}
                {application.opportunityId ?? "Not provided"}
              </p>

              <p>
                <strong>Student Name:</strong>{" "}
                {application.name || "Not provided"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {application.email || "Not provided"}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {application.phone || "Not provided"}
              </p>

              <p>
                <strong>College:</strong>{" "}
                {application.college || "Not provided"}
              </p>

              <p>
                <strong>Branch:</strong>{" "}
                {application.branch || "Not provided"}
              </p>

              <p>
                <strong>Year:</strong>{" "}
                {application.year || "Not provided"}
              </p>

              <p>
                <strong>Resume:</strong>{" "}
                {application.resume ? (
                  <a
                    href={application.resume}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Resume Link
                  </a>
                ) : (
                  "Not provided"
                )}
              </p>

              <p>
                <strong>Cover Letter:</strong>
              </p>

              <p style={{ whiteSpace: "pre-wrap" }}>
                {application.coverLetter || "Not provided"}
              </p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
