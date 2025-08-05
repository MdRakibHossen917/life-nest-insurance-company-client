import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

const QuotePage = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "Male",
    coverage: "",
    duration: "",
    smoker: "No",
  });

  const [quote, setQuote] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculatePremium = () => {
    const { age, gender, coverage, duration, smoker } = formData;

    const ageFactor = age < 30 ? 1 : age < 50 ? 1.5 : 2;
    const genderFactor = gender === "Male" ? 1.1 : 1;
    const smokerFactor = smoker === "Yes" ? 1.5 : 1;
    const durationFactor = duration / 10;

    const baseRate = 5; // per lakh per year

    const annual =
      (coverage *
        baseRate *
        ageFactor *
        genderFactor *
        smokerFactor *
        durationFactor) /
      10;
    const monthly = annual / 12;

    setQuote({
      annual: annual.toFixed(2),
      monthly: monthly.toFixed(2),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculatePremium();
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-black">
      <h2 className="text-3xl font-bold mb-6">Get Your Insurance Quote</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        <div>
          <label>Coverage Amount (in Lakh)</label>
          <input
            type="number"
            name="coverage"
            value={formData.coverage}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Duration (Years)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Smoker?</label>
          <select
            name="smoker"
            value={formData.smoker}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Get Estimate
        </button>
      </form>

      {/* Result Section */}
      {quote && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h3 className="text-xl font-semibold mb-2">Estimated Premium</h3>
          <p>💰 Monthly: ৳ {quote.monthly}</p>
          <p>📆 Annual: ৳ {quote.annual}</p>

          <Link
            onClick={() => navigate("/policy-apply-from")}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Apply for Policy
          </Link>
        </div>
      )}
    </div>
  );
};

export default QuotePage;
