import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const ClaimRequestPage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    policyId: "",
    policyName: "",
    reason: "",
    document: null,
  });

  // Fetch approved policies
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get(
          `/policies/approved/${user.email}`
        );
        if (response.data && Array.isArray(response.data)) {
          setPolicies(response.data);
        }
      } catch (error) {
        console.error("Error fetching approved policies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [user, axiosSecure]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "document") {
      setFormData({ ...formData, document: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectPolicy = (policy) => {
    setFormData({
      ...formData,
      policyId: policy._id,
      policyName: policy.policyType || policy.name,
      reason: "",
      document: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.policyId || !formData.reason || !formData.document) {
      return Swal.fire(
        "Error",
        "Please fill all fields and upload document",
        "error"
      );
    }

    const form = new FormData();
    form.append("policyId", formData.policyId);
    form.append("policyName", formData.policyName);
    form.append("userEmail", user.email);
    form.append("reason", formData.reason);
    form.append("document", formData.document);
    form.append("status", "pending");

    try {
      const response = await axiosSecure.post("/claims", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        Swal.fire("Success", "Claim submitted successfully!", "success");
        setFormData({
          policyId: "",
          policyName: "",
          reason: "",
          document: null,
        });
      }
    } catch (error) {
      console.error("Claim submission error:", error);
      Swal.fire("Error", "Failed to submit claim", "error");
    }
  };

  if (loading) {
    return <p className="text-center py-10">Loading approved policies...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Claim Request</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Select a Policy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((policy) => (
            <div
              key={policy._id}
              className="p-4 border rounded shadow hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSelectPolicy(policy)}
            >
              <p className="font-medium">{policy.policyType || policy.name}</p>
              {policy.claimStatus ? (
                <span
                  className={`mt-1 inline-block px-2 py-1 text-xs rounded-full ${
                    policy.claimStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800 cursor-pointer"
                  }`}
                  onClick={() => {
                    if (policy.claimStatus === "approved") {
                      Swal.fire(
                        "Approved",
                        "Your claim is already approved!",
                        "success"
                      );
                    }
                  }}
                >
                  {policy.claimStatus}
                </span>
              ) : (
                <span className="mt-1 inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                  No Claim
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {formData.policyId && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow max-w-lg"
        >
          <h3 className="text-xl font-semibold mb-4">Submit Claim</h3>
          <div className="mb-4">
            <label className="block font-medium mb-1">Policy Name</label>
            <input
              type="text"
              name="policyName"
              value={formData.policyName}
              readOnly
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Reason for Claim</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Upload Document</label>
            <input
              type="file"
              name="document"
              accept=".pdf,image/*"
              onChange={handleInputChange}
              required
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Claim
          </button>
        </form>
      )}
    </div>
  );
};

export default ClaimRequestPage;
