import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageApplications = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgentMap, setSelectedAgentMap] = useState({});
  const axiosSecure = useAxiosSecure();

  // Fetch agents
  useEffect(() => {
    if (!user) return;
    const fetchAgents = async () => {
      try {
        const res = await axiosSecure.get("/agents/all");
        // Handle both response formats
        if (Array.isArray(res.data)) {
          setAgents(res.data);
        } else if (res.data.data && Array.isArray(res.data.data)) {
          setAgents(res.data.data);
        } else {
          console.error("Unexpected agents response format:", res.data);
          setAgents([]);
        }
      } catch (err) {
        console.error("Error fetching agents:", err);
        setAgents([]);
      }
    };
    fetchAgents();
  }, [user, axiosSecure]);

  // Fetch applications
  useEffect(() => {
    if (!user) return;
    const fetchApplications = async () => {
      try {
        const res = await axiosSecure.get("/applications/all");
        setApplications(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setApplications([]);
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user, axiosSecure]);

  const setSelectedAgent = (appId, agentId) => {
    setSelectedAgentMap((prev) => ({ ...prev, [appId]: agentId }));
  };

  const handleAssignAgent = async (appId, agentEmail) => {
    if (!agentEmail) {
      return Swal.fire(
        "Select Agent!",
        "Please select an agent first.",
        "warning"
      );
    }

    const confirm = await Swal.fire({
      title: "Assign Agent?",
      text: "Are you sure you want to assign this agent to the application?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, assign!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/applications/assign/${appId}`, {
        agentEmail,
      });

      if (res.data.success) {
        Swal.fire(
          "Assigned!",
          "Agent has been assigned successfully.",
          "success"
        );
        // Update local state
        setApplications((prev) =>
          prev.map((app) =>
            app._id === appId
              ? {
                  ...app,
                  assignedAgent: agentEmail,
                  status: "Assigned",
                  assignedAt: new Date(),
                }
              : app
          )
        );
      } else {
        Swal.fire(
          "Error!",
          res.data.message || "Failed to assign agent.",
          "error"
        );
      }
    } catch (err) {
      console.error("Error assigning agent:", err);
      Swal.fire(
        "Error!",
        err.response?.data?.message ||
          "Failed to assign agent. Please try again.",
        "error"
      );
    }
  };

  const handleReject = async (appId) => {
    const confirm = await Swal.fire({
      title: "Reject Application?",
      text: "Are you sure you want to reject this application?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/applications/reject/${appId}`);

      if (res.data.success) {
        Swal.fire(
          "Rejected!",
          "Application has been rejected successfully.",
          "success"
        );
        setApplications((prev) =>
          prev.map((app) =>
            app._id === appId ? { ...app, status: "Rejected" } : app
          )
        );
      } else {
        Swal.fire(
          "Error!",
          res.data.message || "Failed to reject application.",
          "error"
        );
      }
    } catch (err) {
      console.error("Error rejecting application:", err);
      Swal.fire(
        "Error!",
        err.response?.data?.message ||
          "Failed to reject application. Please try again.",
        "error"
      );
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading applications...</span>
      </div>
    );
  }

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    assigned: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    approved: "bg-green-100 text-green-800",
    paid: "bg-purple-100 text-purple-800",
  };

  // Filter agents to only show approved ones for assignment
  const approvedAgents = agents.filter((agent) => agent.status === "approved");

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Manage Applications
      </h2>

      {applications.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No applications found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {app.aname || app.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.userEmail || app.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.policyName || app.policyId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.applicationDate
                      ? new Date(app.applicationDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        statusStyles[app.status?.toLowerCase()] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {app.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.assignedAgent || "Not assigned"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col space-y-2">
                      <select
                        value={selectedAgentMap[app._id] || ""}
                        onChange={(e) =>
                          setSelectedAgent(app._id, e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        disabled={
                          app.status === "Rejected" || app.status === "paid"
                        }
                      >
                        <option value="">Select Agent</option>
                        {approvedAgents.map((agent) => (
                          <option key={agent._id} value={agent.email}>
                            {agent.name} ({agent.district || "N/A"})
                          </option>
                        ))}
                      </select>

                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleAssignAgent(
                              app._id,
                              selectedAgentMap[app._id]
                            )
                          }
                          disabled={
                            app.status === "Rejected" ||
                            app.status === "paid" ||
                            !selectedAgentMap[app._id]
                          }
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Assign
                        </button>

                        <button
                          onClick={() => handleReject(app._id)}
                          disabled={
                            app.status === "Rejected" || app.status === "paid"
                          }
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageApplications;
