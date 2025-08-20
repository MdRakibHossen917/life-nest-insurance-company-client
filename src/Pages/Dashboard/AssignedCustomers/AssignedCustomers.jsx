import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const AssignedCustomers = () => {
  const [assignedCustomers, setAssignedCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [agentEmail, setAgentEmail] = useState(null);
  const [role, setRole] = useState(null);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAgentEmail(user.email);

        try {
          // Get user role from backend
          const response = await axiosSecure.get(
            `/users/role?email=${user.email}`
          );
          setRole(response.data.role);
        } catch (err) {
          console.error("Error fetching user role:", err);
          // If endpoint doesn't exist, try to get role from user profile
          try {
            const userResponse = await axiosSecure.get(`/users/${user.email}`);
            setRole(userResponse.data.role || "user");
          } catch (secondErr) {
            console.error("Error fetching user profile:", secondErr);
            setError("Failed to fetch user information");
            setLoading(false);
          }
        }
      } else {
        setError("Please login first to view assigned customers.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [axiosSecure]);

  useEffect(() => {
    const fetchAssignedCustomers = async () => {
      if (!agentEmail) return;

      try {
        setLoading(true);

        // Check if user is an agent
        if (role !== "agent") {
          setError("Only agents can view assigned customers.");
          setLoading(false);
          return;
        }

        // Fetch assigned customers
        const response = await axiosSecure.get(
          `/applications/assigned/${agentEmail}`
        );

        if (response.data && Array.isArray(response.data)) {
          setAssignedCustomers(response.data);
        } else {
          setError("No assigned customers found or invalid response format.");
        }
      } catch (err) {
        console.error("Error fetching assigned customers:", err);
        if (err.response?.status === 404) {
          setError("No assigned customers found.");
        } else {
          setError(
            "Failed to fetch assigned customers. Please try again later."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (agentEmail && role) {
      fetchAssignedCustomers();
    }
  }, [agentEmail, role, axiosSecure]);

   

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto mt-8">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Assigned Customers
      </h2>

      {assignedCustomers.length === 0 ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative">
          No customers have been assigned to you yet.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Assigned Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignedCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.aname || customer.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.userEmail || customer.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : customer.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : customer.status === "Assigned"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {customer.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.applicationDate
                      ? new Date(customer.applicationDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.assignedAt
                      ? new Date(customer.assignedAt).toLocaleDateString()
                      : "N/A"}
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

export default AssignedCustomers;
