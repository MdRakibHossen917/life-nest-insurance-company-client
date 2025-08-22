import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Eye, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

const AgentPolicyClearance = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch pending/assigned claims
  useEffect(() => {
    const fetchAgentPolicies = async () => {
      if (!user?.email) return;
      try {
        setLoading(true);
        const response = await axiosSecure.get(
          `/applications/assigned/${user.email}`
        );

        if (Array.isArray(response.data)) {
          const pendingPolicies = response.data.filter(
            (app) => app.status === "pending" || app.status === "Assigned"
          );
          setPolicies(pendingPolicies);
        }
      } catch (error) {
        console.error("Error fetching agent policies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentPolicies();
  }, [user, axiosSecure]);

  // ✅ Show details modal
  const viewDetails = (policy) => {
    setSelectedPolicy(policy);
    setShowModal(true);
  };

  // ✅ Approve claim
  const handleApprove = async (applicationId) => {
    try {
      const response = await axiosSecure.patch(
        `/applications/${applicationId}/status`,
        { status: "approved" }
      );

      if (response.data.success) {
        setPolicies((prev) => prev.filter((p) => p._id !== applicationId));
        setShowModal(false);
        Swal.fire(
          "Approved!",
          "Policy claim approved successfully.",
          "success"
        );
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to approve policy claim.", "error");
    }
  };

  // ✅ Reject claim
  const handleReject = async (applicationId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Rejecting this claim cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await axiosSecure.patch(
        `/applications/${applicationId}/status`,
        { status: "rejected" }
      );

      if (response.data.success) {
        setPolicies((prev) => prev.filter((p) => p._id !== applicationId));
        setShowModal(false);
        Swal.fire("Rejected!", "Policy claim rejected.", "success");
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to reject policy claim.", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Policy Claims Clearance
      </h2>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-gray-500" size={32} />
          <span className="ml-2 text-gray-600">Loading claims...</span>
        </div>
      ) : policies.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No pending policy claims for clearance.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Applicant Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Policy Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policies.map((policy) => (
                <tr key={policy._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {policy.aname || policy.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {policy.userEmail || policy.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {policy.policyType || policy.category || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {policy.applicationDate
                      ? new Date(policy.applicationDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => viewDetails(policy)}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={16} className="mr-1" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 relative">
            <h3 className="text-2xl font-bold mb-4">Policy Claim Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-gray-700">Applicant Info</h4>
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedPolicy.aname || selectedPolicy.name}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {selectedPolicy.userEmail || selectedPolicy.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedPolicy.phone || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong> {selectedPolicy.address || "N/A"}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700">Policy Info</h4>
                <p>
                  <strong>Policy Type:</strong>{" "}
                  {selectedPolicy.policyType || selectedPolicy.category}
                </p>
                <p>
                  <strong>Coverage Amount:</strong> $
                  {selectedPolicy.coverageAmount ||
                    selectedPolicy.amount ||
                    "N/A"}
                </p>
                <p>
                  <strong>Premium:</strong> ${selectedPolicy.premium || "N/A"}
                </p>
                <p>
                  <strong>Applied Date:</strong>{" "}
                  {new Date(
                    selectedPolicy.applicationDate
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            {selectedPolicy.additionalInfo && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700">Additional Info</h4>
                <p className="bg-gray-100 p-3 rounded">
                  {selectedPolicy.additionalInfo}
                </p>
              </div>
            )}

            {/* Approve/Reject Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => handleReject(selectedPolicy._id)}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <XCircle size={18} className="mr-2" /> Reject
              </button>
              <button
                onClick={() => handleApprove(selectedPolicy._id)}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <CheckCircle size={18} className="mr-2" /> Approve
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentPolicyClearance;
