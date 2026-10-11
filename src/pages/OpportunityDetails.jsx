import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function OpportunityDetails() {

  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/opportunities/${id}`)
      .then(response => response.json())
      .then(data => {
        setOpportunity(data);
      })
      .catch(error => {
        console.error("Error fetching opportunity:", error);
      });
  }, [id]);

  if (!opportunity) {
    return <p>Loading opportunity...</p>;
  }

  return (
    <div>
      <h1>{opportunity.title}</h1>

      <p>
        <strong>Organization:</strong> {opportunity.organization}
      </p>

      <p>
        <strong>Type:</strong> {opportunity.type}
      </p>

      <p>
        <strong>Location:</strong> {opportunity.location}
      </p>

      <p>
        <strong>Mode:</strong> {opportunity.mode}
      </p>

      <p>
        <strong>Duration:</strong> {opportunity.duration}
      </p>

      <p>
        <strong>Eligibility:</strong> {opportunity.eligibility}
      </p>

      <p>
        <strong>Deadline:</strong> {opportunity.deadline}
      </p>

      <h3>Description</h3>

      <p>{opportunity.description}</p>

      <button>Apply Now</button>
    </div>
  );
}

export default OpportunityDetails;