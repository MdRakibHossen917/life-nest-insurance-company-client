import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageAgent = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/agents/all")  
      .then((res) => {
        setAgents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/agents/${id}`, { status });
      setAgents(
        agents.map((agent) => (agent._id === id ? { ...agent, status } : agent))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/agents/${id}`);
      setAgents(agents.filter((agent) => agent._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="text-center">Loading agents...</p>;

  return (
    <div className="p-6 text-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Manage Agents</h2>

      <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent._id} className="border-t">
                 
                <td className="p-2">{agent.name}</td>
                <td className="p-2">{agent.email}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      agent.status === "approved"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {agent.status}
                  </span>
                </td>
                <td className="p-2 flex gap-2">
                  {agent.status !== "approved" && (
                    <button
                      onClick={() => handleApprove(agent._id, "approved")}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Approve
                    </button>
                  )}
                  {agent.status !== "pending" && (
                    <button
                      onClick={() => handleApprove(agent._id, "pending")}
                      className="px-3 py-1 bg-yellow-600 text-white rounded"
                    >
                      Disapprove
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(agent._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {agents.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No agents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAgent;
