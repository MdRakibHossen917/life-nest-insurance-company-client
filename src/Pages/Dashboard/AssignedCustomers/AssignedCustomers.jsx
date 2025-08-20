import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const AssignedCustomers = () => {
  const [assignedCustomers, setAssignedCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [agentEmail, setAgentEmail] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    // Firebase auth listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAgentEmail(user.email);

        // Assuming role is stored in user claims or local state
        user.getIdTokenResult().then((idTokenResult) => {
          setRole(idTokenResult.claims.role || "user"); // default to "user" if role missing
        });
      } else {
        setError("Agent email is missing. Please login first.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAssignedCustomers = async () => {
      if (!agentEmail) return; // wait until email is available
      if (role !== "rider") {
        setError("Only agents can view assigned customers.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/applications/assigned/${agentEmail}`
        );
        setAssignedCustomers(response.data);
      } catch (err) {
        console.error("Error fetching assigned customers:", err);
        setError("Failed to fetch assigned customers");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedCustomers();
  }, [agentEmail, role]);

  if (loading) return <p>Loading assigned customers...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!assignedCustomers.length) return <p>No assigned customers found.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Assigned Customers</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Applied At</th>
            <th className="border px-4 py-2">Assigned At</th>
          </tr>
        </thead>
        <tbody>
          {assignedCustomers.map((customer) => (
            <tr key={customer._id}>
              <td className="border px-4 py-2">{customer.name}</td>
              <td className="border px-4 py-2">{customer.email}</td>
              <td className="border px-4 py-2">{customer.status}</td>
              <td className="border px-4 py-2">
                {new Date(customer.appliedAt).toLocaleString()}
              </td>
              <td className="border px-4 py-2">
                {customer.assignedAt
                  ? new Date(customer.assignedAt).toLocaleString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignedCustomers;
