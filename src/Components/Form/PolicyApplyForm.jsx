import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router";
import { getAuth } from "firebase/auth"; // <-- import firebase auth

const PolicyApplyForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { estimatedPremium } = location.state || {};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    estimatedPremium: estimatedPremium || "",
    address: "",
    nid: "",
    nomineeName: "",
    relationship: "",
    healthConditions: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
        name: user.name || "",
      }));
    }
  }, [user?.email, user?.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const conditions = [...prev.healthConditions];
      if (checked) {
        conditions.push(value);
      } else {
        const index = conditions.indexOf(value);
        if (index > -1) conditions.splice(index, 1);
      }
      return { ...prev, healthConditions: conditions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      alert("User email is required to submit application.");
      return;
    }

    setLoading(true);

    const applicationData = {
      ...formData,
      status: "pending",
      appliedAt: new Date(),
    };

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        alert("User not authenticated.");
        setLoading(false);
        return;
      }

      // Get Firebase ID Token for Authorization header
      const idToken = await currentUser.getIdToken();

      const res = await axios.post(
        "http://localhost:5000/applications",
        applicationData,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (res.data.insertedId) {
        Swal.fire({
          title: "Success!",
          text: "Application submitted successfully! Proceed to payment.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
         navigate("/dashboard/myApplication");
        });

        setFormData({
          name: user.name || "",
          email: user.email,
          estimatedPremium: "",
          address: "",
          nid: "",
          nomineeName: "",
          relationship: "",
          healthConditions: [],
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while submitting.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-black bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Policy Application Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            readOnly
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Estimated Premium */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="estimatedPremium">
            Estimated Monthly Premium (৳)
          </label>
          <input
            id="estimatedPremium"
            name="estimatedPremium"
            type="text"
            value={formData.estimatedPremium}
            readOnly
            disabled
            className="w-full border border-gray-300 p-3 rounded bg-gray-100 cursor-not-allowed text-gray-700"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="address">
            Address
          </label>
          <input
            id="address"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* NID */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="nid">
            NID Number
          </label>
          <input
            id="nid"
            name="nid"
            type="number"
            placeholder="NID Number"
            value={formData.nid}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Nominee */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="nomineeName">
            Nominee Name
          </label>
          <input
            id="nomineeName"
            name="nomineeName"
            placeholder="Nominee Name"
            value={formData.nomineeName}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Relationship */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="relationship">
            Relationship
          </label>
          <input
            id="relationship"
            name="relationship"
            placeholder="Relationship"
            value={formData.relationship}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Health Conditions */}
        <fieldset className="border p-4 rounded" disabled={loading}>
          <legend className="font-semibold mb-2">Health Conditions:</legend>
          {[
            "Diabetes",
            "High Blood Pressure",
            "Heart Disease",
            "Cancer",
            "None of the Above",
          ].map((item) => (
            <div key={item} className="mb-1">
              <label className="inline-flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={item}
                  onChange={handleCheckboxChange}
                  checked={formData.healthConditions.includes(item)}
                  className="cursor-pointer"
                />
                <span>{item}</span>
              </label>
            </div>
          ))}
        </fieldset>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-6 py-3 rounded text-white text-lg font-semibold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default PolicyApplyForm;
