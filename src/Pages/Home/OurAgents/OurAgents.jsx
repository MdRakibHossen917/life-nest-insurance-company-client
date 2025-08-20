import React, { useEffect, useState } from "react";
import axios from "axios";

const OurAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
       const res = await axios.get("http://localhost:5000/agents?limit=3");
       setAgents(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch agents:", err);
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) {
    return <p className="text-center py-12 text-gray-500">Loading agents...</p>;
  }

  if (agents.length === 0) {
    return <p className="text-center py-12 text-gray-500">No agents found.</p>;
  }

  return (
    <div className="py-16 px-6 text-gray-800">
      {/* Section Title */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
          Meet Our Top Agents
        </h2>
        <p className="text-gray-500 text-lg">
          Our experienced agents are here to guide you and help you choose the
          best insurance policies. Trust our team to provide personalized
          solutions tailored to your needs.
        </p>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {agents.map((agent) => (
          <div
            key={agent._id}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={agent.photo || "https://via.placeholder.com/150"}
              alt={agent.name}
              className="w-28 h-28 rounded-full mb-4 object-cover border-4 border-indigo-500"
            />
            <h3 className="text-xl font-semibold text-gray-800">
              {agent.name}
            </h3>
            {agent.experience && (
              <p className="text-gray-500 text-sm mt-1">
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
