import React, { useEffect, useState } from "react";
import axios from "axios";

const OurAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/agents") // তোমার backend URL
      .then((res) => {
        setAgents(res.data); // 3 agents already limited from backend
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch agents:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p className="text-center py-10 text-gray-500">Loading agents...</p>;

  if (!agents.length)
    return <p className="text-center py-10 text-gray-500">No agents found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-gray-700">
      <h2 className="text-3xl font-bold text-center mb-8">Meet Our Agents</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent._id}
            className="bg-white shadow-md rounded-lg p-4 text-center"
          >
            <img
              src={agent.photo || "/default-avatar.png"}
              alt={agent.name}
              className="w-24 h-24 mx-auto rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-semibold">{agent.name}</h3>
            <p className="text-gray-500 mb-2">
              Experience: {agent.experience || "N/A"} years
            </p>
            <p className="text-gray-500 mb-2">
              Specialties: {agent.specialties || "General"}
            </p>
            {agent.note && (
              <p className="text-gray-400 text-sm">{agent.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurAgents;
