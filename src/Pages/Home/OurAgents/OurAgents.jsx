import React, { useEffect, useState } from "react";
import axios from "axios";
import defaultAvatar from "../../../assets/Image/default.jpg"; // Make sure this file exists

const OurAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    axios
      .get("https://life-nest-company-server.vercel.app/agents")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAgents(res.data);
        } else if (res.data.data && Array.isArray(res.data.data)) {
          setAgents(res.data.data);
        } else {
          setAgents([]);
          setError("No agents found.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError(
          "Failed to load agents. Make sure your server is running and accessible."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-center">Loading agents...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <section className="max-w-7xl mx-auto px-4 py-26 text-gray-700">
      <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Meet Our Agents
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent._id}
            className="rounded-lg shadow p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => setSelectedAgent(agent)}
          >
            {/* Agent picture */}
            <img
              src={agent.photoURL || defaultAvatar}
              alt={agent.name || "Agent"}
              className="w-24 h-24 rounded-full mb-3 border-2 border-[#78B9B5] object-cover"
            />

            <h3 className="text-xl font-semibold mb-1 text-gray-800">
              {agent.name || "Unnamed Agent"}
            </h3>
            <p className="text-gray-700 mb-1">{agent.role || "Agent"}</p>
            <p className="text-gray-500 text-sm">{agent.email || "No email"}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md relative text-center">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl"
              onClick={() => setSelectedAgent(null)}
            >
              &times;
            </button>

            <img
              src={selectedAgent.photo || defaultAvatar}
              alt={selectedAgent.name || "Agent"}
              className="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-[#78B9B5] object-cover"
            />

            <h1 className="text-2xl font-semibold text-[#78B9B5] underline mb-2">
              Agent Details
            </h1>
            <h3 className="text-2xl font-bold mb-2">{selectedAgent.name}</h3>
            <p className="text-gray-700 mb-2">
              <strong>Role:</strong> {selectedAgent.role || "Agent"}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> {selectedAgent.email || "No email"}
            </p>
            {selectedAgent.phone && (
              <p className="text-gray-700 mb-2">
                <strong>Phone:</strong> {selectedAgent.phone}
              </p>
            )}
            {selectedAgent.bio && (
              <p className="text-gray-700">
                <strong>Bio:</strong> {selectedAgent.bio}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default OurAgents;
