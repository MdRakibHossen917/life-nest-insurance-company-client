import React, { useState } from "react";

const FreeQuoteForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    policyType: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://life-nest-company-server.vercel.app/quotes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error("Failed to submit");
      setMessage("Quote request submitted successfully!");
      setFormData({ name: "", email: "", phone: "", policyType: "" });
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Get a Free Quote</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone (optional)"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="policyType"
          value={formData.policyType}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select Policy Type</option>
          <option value="life">Life Insurance</option>
          <option value="health">Health Insurance</option>
          <option value="auto">Auto Insurance</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FreeQuoteForm;
