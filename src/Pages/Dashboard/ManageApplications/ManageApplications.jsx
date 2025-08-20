import React, { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthProvider";
import axios from "axios";

const ManageApplications = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgentMap, setSelectedAgentMap] = useState({});

  const axiosSecure = axios.create({ baseURL: "http://localhost:5000" });
  axiosSecure.interceptors.request.use(async (config) => {
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Fetch agents
  useEffect(() => {
    if (!user) return;
    const fetchAgents = async () => {
      try {
        const res = await axiosSecure.get("/agents/all");
        if (res.data.success) setAgents(res.data.data);
        else setAgents([]);
      } catch (err) {
        console.error(err);
        setAgents([]);
      }
    };
    fetchAgents();
  }, [user]);

  // Fetch applications
  useEffect(() => {
    if (!user) return;
    const fetchApplications = async () => {
      try {
        const res = await axiosSecure.get("/applications/all");
        setApplications(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setApplications([]);
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  const setSelectedAgent = (appId, agentId) => {
    setSelectedAgentMap((prev) => ({ ...prev, [appId]: agentId }));
  };

  const handleAssignAgent = async (appId, agentEmail) => {
    if (!agentEmail)
      return Swal.fire(
        "Select Agent!",
        "Please select an agent first.",
        "warning"
      );

    const confirm = await Swal.fire({
      title: "Assign Agent?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, assign",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/applications/assign/${appId}`, {
        agentEmail,
      });
      if (res.data.success) {
        Swal.fire("Assigned!", "Agent has been assigned.", "success");
        setApplications((prev) =>
          prev.map((app) =>
            app._id === appId
              ? { ...app, assignedAgent: agentEmail, status: "Assigned" }
              : app
          )
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to assign agent.", "error");
    }
  };

  const handleReject = async (appId) => {
    const confirm = await Swal.fire({
      title: "Reject Application?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/applications/reject/${appId}`);
      if (res.data.success) {
        Swal.fire("Rejected!", "Application has been rejected.", "success");
        setApplications((prev) =>
          prev.map((app) =>
            app._id === appId ? { ...app, status: "Rejected" } : app
          )
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Failed to reject application.", "error");
    }
  };

  if (loading || authLoading)
    return (
      <p className="text-center py-8 text-gray-600">Loading applications...</p>
    );

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    assigned: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Manage Applications
      </h2>

      {applications.length === 0 ? (
        <p className="text-center py-4 text-gray-500">No applications found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Applicant
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 text-gray-700">
                    {app.aname || app.name}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {app.userEmail || app.email}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {app.appliedAt
                      ? new Date(app.appliedAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        statusStyles[app.status.toLowerCase()] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex flex-wrap gap-2 items-center">
                    <select
                      value={selectedAgentMap[app._id] || ""}
                      onChange={(e) =>
                        setSelectedAgent(app._id, e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                      disabled={app.status === "Rejected"}
                    >
                      <option value="">Select Agent</option>
                      {agents.map((agent) => (
                        <option key={agent._id} value={agent.email}>
                          {agent.name} ({agent.district})
                        </option>
                      ))}
                    </select>

                    <button
                      className={`px-3 py-1 rounded text-white text-sm font-medium transition ${
                        app.status === "Rejected" || !selectedAgentMap[app._id]
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                      onClick={() =>
                        handleAssignAgent(app._id, selectedAgentMap[app._id])
                      }
                      disabled={
                        app.status === "Rejected" || !selectedAgentMap[app._id]
                      }
                    >
                      {app.assignedAgent ? "Reassign" : "Assign"}
                    </button>

                    <button
                      className={`px-3 py-1 rounded text-white text-sm font-medium transition ${
                        app.status === "Rejected"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                      onClick={() => handleReject(app._id)}
                      disabled={app.status === "Rejected"}
                    >
                      Reject
                    </button>
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
