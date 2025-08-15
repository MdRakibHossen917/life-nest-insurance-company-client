import React, { useEffect, useState } from "react";
import axios from "axios";

const PopularPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/policies/popular") // আপনার backend popular endpoint
      .then((res) => setPolicies(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load popular policies");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center py-8 text-gray-500">Loading…</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;
  if (policies.length === 0)
    return <p className="text-center py-8 text-gray-500">No policies found</p>;

  return (
    <div className="max-w-6xl mx-auto py-8 text-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-center">
        🏆 Popular Policies
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {policies.map((policy) => (
          <div
            key={policy._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={policy.image}
              alt={policy.title}
              className="h-40 w-full object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold mb-1">{policy.title}</h3>
            <p className="text-sm mb-1">Category: {policy.category}</p>
            <p className="text-sm mb-1">Coverage: {policy.coverageRange}</p>
            <p className="text-sm mb-1">Duration: {policy.duration}</p>
            <p className="text-sm font-medium">
              Base Premium: ৳{policy.basePremium}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularPolicies;
