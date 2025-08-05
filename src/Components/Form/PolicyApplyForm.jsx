import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const PolicyApplyForm = () => {
  const { user } = useAuth();
    const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    name: "",
    email: "", //starting value blank.
    address: "",
    nid: "",
    nomineeName: "",
    relationship: "",
    healthConditions: [],
  });

  const [loading, setLoading] = useState(false); // loading state

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user?.email]);

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
       status: "Pending",
       appliedAt: new Date(),
     };

     try {
       const res = await axios.post(
         "http://localhost:5000/applications",
         applicationData
       );

       if (res.data.insertedId) {
         Swal.fire({
           title: "Success!",
           text: "Application submitted successfully!",
           icon: "success",
           confirmButtonText: "OK",
         }).then(() => {
      
           navigate("/dashboard/myApplication");
         });

         setFormData({
           name: "",
           email: user.email,
           address: "",
           nid: "",
           nomineeName: "",
           relationship: "",
           healthConditions: [],
         });
       }
     } catch (error) {
       console.error(error);
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
    <div className="max-w-2xl mx-auto p-6 text-black">
      <h2 className="text-2xl font-bold mb-4">Policy Application Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
          disabled={loading}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          readOnly
          className="w-full border p-2 rounded bg-gray-200 cursor-not-allowed"
          disabled={loading}
        />
        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
          disabled={loading}
        />
        <input
          name="nid"
          type="number"
          placeholder="NID Number"
          value={formData.nid}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
          disabled={loading}
        />
        <input
          name="nomineeName"
          placeholder="Nominee Name"
          value={formData.nomineeName}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
          disabled={loading}
        />
        <input
          name="relationship"
          placeholder="Relationship"
          value={formData.relationship}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
          disabled={loading}
        />
        <fieldset className="border p-4 rounded" disabled={loading}>
          <legend className="font-semibold mb-2">Health Conditions:</legend>
          {[
            "Diabetes",
            "High Blood Pressure",
            "Heart Disease",
            "Cancer",
            "None of the Above",
          ].map((item) => (
            <div key={item}>
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={item}
                  onChange={handleCheckboxChange}
                  checked={formData.healthConditions.includes(item)}
                />
                <span>{item}</span>
              </label>
            </div>
          ))}
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded text-white ${
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
