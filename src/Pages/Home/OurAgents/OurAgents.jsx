import React, { useEffect, useState } from "react";
import axios from "axios";

const OurAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  // dynamic agents fetch  
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/agents");  
        setAgents(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch agents:", err);
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) {
    return <p className="text-center py-8">Loading agents...</p>;
  }

  if (agents.length === 0) {
    return <p className="text-center py-8">No agents found.</p>;
  }

  return (
    <div className="py-12 mx-20 px-6 bg-gray-50 text-gray-800">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-700">
        Meet Our Agents
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {agents.map((agent) => (
          <div
            key={agent._id}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center"
          >
            <img
              src={agent.photo || "https://via.placeholder.com/150"}
              alt={agent.name}
              className="w-28 h-28 rounded-full mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-800">
              {agent.name}
            </h3>
            {agent.experience && (
              <p className="text-gray-500 text-sm">
                {agent.experience} years experience
              </p>
            )}
            {agent.specialties && (
              <p className="text-gray-500 text-sm mt-1">{agent.specialties}</p>
            )}
            <p className="text-gray-600 text-sm mt-2">{agent.district}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurAgents;
