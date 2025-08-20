// src/Pages/Dashboard/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const UserDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  if (authLoading) return <p className="p-4 text-center">Loading auth...</p>;
  if (!user)
    return <p className="p-4 text-center">Please login to view dashboard.</p>;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/applications?email=${user.email}`);
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to fetch your applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, axiosSecure]);

   

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Applications</h1>

      {applications.length === 0 ? (
        <p className="text-gray-600">
          You have not applied for any policies yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 border-b">Policy Name</th>
                <th className="px-4 py-3 border-b">Status</th>
                <th className="px-4 py-3 border-b">Assigned Agent</th>
                <th className="px-4 py-3 border-b">Applied At</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{app.name}</td>
                  <td
                    className={`border px-4 py-2 font-semibold ${
                      app.status === "Approved"
                        ? "text-green-600"
                        : app.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {app.status}
                  </td>
                  <td className="border px-4 py-2">
                    {app.assignedAgent || "Not Assigned"}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(app.appliedAt).toLocaleString()}
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

export default UserDashboard;
