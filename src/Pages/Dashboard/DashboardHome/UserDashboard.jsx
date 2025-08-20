import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const UserDashboard = () => {
  const authContext = useAuth();
  const axiosSecure = useAxiosSecure();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  if (!authContext) return <p>Loading auth...</p>; // safety

  const { user, loading: authLoading } = authContext;

  useEffect(() => {
    if (!user?.email) return;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/applications?email=${user.email}`);
        setApplications(res.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, axiosSecure]);

  if (authLoading || loading) return <p>Loading your dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Policy Name</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Assigned Agent</th>
              <th className="border px-4 py-2">Applied At</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td className="border px-4 py-2">{app.name}</td>
                <td className="border px-4 py-2">{app.status}</td>
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
      )}
    </div>
  );
};

export default UserDashboard;
