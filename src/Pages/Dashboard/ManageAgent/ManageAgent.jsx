import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageAgent = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axiosSecure.get("/agents/all");
      setAgents(response.data.data || response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error("Failed to load agents");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (agentId, newStatus) => {
    setUpdating(agentId);
    try {
      const response = await axiosSecure.patch(`/agents/${agentId}/status`, {
        status: newStatus,
      });

      if (response.data.success) {
        toast.success(`Agent ${newStatus} successfully`);
        // Update the local state
        setAgents(
          agents.map((agent) =>
            agent._id === agentId ? { ...agent, status: newStatus } : agent
          )
        );
      } else {
        toast.error("Failed to update agent status");
      }
    } catch (error) {
      console.error("Error updating agent status:", error);
      toast.error("Failed to update agent status");
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteAgent = async (agentId) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) {
      return;
    }

    try {
      const response = await axiosSecure.delete(`/agents/${agentId}`);

      if (response.data.success) {
        toast.success("Agent deleted successfully");
        // Remove from local state
        setAgents(agents.filter((agent) => agent._id !== agentId));
      } else {
        toast.error("Failed to delete agent");
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast.error("Failed to delete agent");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "disapproved":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Agents</h2>

      {agents.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No agent requests found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    District
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agents.map((agent) => (
                  <tr key={agent._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                            {agent.name?.charAt(0) || "A"}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {agent.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{agent.email}</div>
                      <div className="text-sm text-gray-500">
                        {agent.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agent.district || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          agent.status
                        )}`}
                      >
                        {agent.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(agent.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {agent.status !== "approved" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(agent._id, "approved")
                            }
                            disabled={updating === agent._id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            {updating === agent._id
                              ? "Approving..."
                              : "Approve"}
                          </button>
                        )}
                        {agent.status !== "disapproved" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(agent._id, "disapproved")
                            }
                            disabled={updating === agent._id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            {updating === agent._id
                              ? "Disapproving..."
                              : "Disapprove"}
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAgent(agent._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAgent;
