import React, { useEffect, useState } from "react";
import { Eye, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

 

const AgentPolicyClearance = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processingAction, setProcessingAction] = useState(null);
  const [error, setError] = useState(null);

  //Fetch policies
  useEffect(() => {
    const fetchAgentPolicies = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await axiosSecure.get(
          `/applications/assigned/${user.email}`
        );

        if (Array.isArray(response.data)) {
          const pendingPolicies = response.data.filter(
            (app) =>
              app.status.toLowerCase() === "pending" ||
              app.status.toLowerCase() === "assigned"
          );
          setPolicies(pendingPolicies);
        } else {
          setError("Invalid data format received from server");
        }
      } catch (error) {
        console.error("Error fetching agent policies:", error);
        setError("Failed to load policy claims. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchAgentPolicies();
    }
  }, [user?.email, authLoading, axiosSecure]);

  //View & Modal
  const viewDetails = (policy) => {
    setSelectedPolicy(policy);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedPolicy(null);
  };

  //Approve Claim
  const handleApprove = async (applicationId) => {
    try {
      setProcessingAction(applicationId);
      const { data } = await axiosSecure.patch(
        `/applications/${applicationId}/status`,
        { status: "approved" }
      );

      if (data.success) {
        setPolicies((prev) => prev.filter((p) => p._id !== applicationId));
        closeModal();
        Swal.fire(
          "Approved!",
          "Policy claim approved successfully.",
          "success"
        );
      } else {
        throw new Error(data.message || "Failed to approve claim");
      }
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    } finally {
      setProcessingAction(null);
    }
  };

  //Reject Claim
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
      setProcessingAction(applicationId);
      const { data } = await axiosSecure.patch(
        `/applications/${applicationId}/status`,
        { status: "rejected" }
      );

      if (data.success) {
        setPolicies((prev) => prev.filter((p) => p._id !== applicationId));
        closeModal();
        Swal.fire("Rejected!", "Policy claim rejected.", "success");
      } else {
        throw new Error(data.message || "Failed to reject claim");
      }
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    } finally {
      setProcessingAction(null);
    }
  };

  //Retry
  const retryFetch = () => {
    setError(null);
    setLoading(true);
  };
 

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
        Policy Claims Clearance
      </h2>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-start mb-3 md:mb-0">
            <AlertCircle className="text-red-500 mt-0.5 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={retryFetch}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      )}

      {/* No Data */}
      {!error && policies.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg shadow">
          <p className="text-gray-500">
            No pending policy claims for clearance.
          </p>
        </div>
      )}

      {/* Table */}
      {policies.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Applicant
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Policy Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                  Applied Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policies.map((policy) => (
                <tr key={policy._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {policy.aname || policy.name || "N/A"}
                    <div className="text-gray-500 text-xs sm:hidden">
                      {policy.userEmail || policy.email || "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">
                    {policy.userEmail || policy.email || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {policy.policyType || policy.category || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">
                    {policy.applicationDate
                      ? new Date(policy.applicationDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold capitalize">
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium">
                    <button
                      onClick={() => viewDetails(policy)}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={16} className="mr-1" />
                      <span className="hidden md:inline">View Details</span>
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                Policy Claim Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Applicant Info
                  </h4>
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

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Policy Info
                  </h4>
                  <p>
                    <strong>Policy Type:</strong> {selectedPolicy.category}
                  </p>
                  <p>
                    <strong>Coverage:</strong>{" "}
                    {selectedPolicy.nid}
                  </p>
                  <p>
                    <strong>Premium:</strong> ${selectedPolicy.estimatedPremium}
                  </p>
                  <p>
                    <strong>Applied:</strong>{" "}
                    {selectedPolicy.applicationDate
                      ? new Date(
                          selectedPolicy.applicationDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => handleReject(selectedPolicy._id)}
                  disabled={processingAction === selectedPolicy._id}
                  className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  {processingAction === selectedPolicy._id ? (
                    <Loader2 size={18} className="animate-spin mr-2" />
                  ) : (
                    <XCircle size={18} className="mr-2" />
                  )}
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedPolicy._id)}
                  disabled={processingAction === selectedPolicy._id}
                  className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                >
                  {processingAction === selectedPolicy._id ? (
                    <Loader2 size={18} className="animate-spin mr-2" />
                  ) : (
                    <CheckCircle size={18} className="mr-2" />
                  )}
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentPolicyClearance;
