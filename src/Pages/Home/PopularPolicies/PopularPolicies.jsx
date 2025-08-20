import React, { useState, useEffect } from "react";
import { Link } from "react-router";

const PopularPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const apiUrl =
          import.meta.env.VITE_API_URL ||
          "https://life-nest-company-server.vercel.app";
        const res = await fetch(`${apiUrl}/policies/6`);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        setPolicies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  if (loading) return <p className="text-center py-8">Loading policies...</p>;
  if (error)
    return <p className="text-red-500 text-center py-8">Error: {error}</p>;
  if (!policies.length)
    return <p className="text-center py-8">No policies available</p>;

  return (
    <section className="py-16 bg-gray-50">
      {/* Title & Subtitle */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          Our Most Popular Insurance Policies
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore the top policies chosen by our customers. Compare coverage,
          terms, and find the perfect plan for you.
        </p>
      </div>

      {/* Policies Grid */}
      <div className="mx-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-800">
        {policies.map((policy) => (
          <div
            key={policy._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={policy.image || "https://picsum.photos/400/200"}
              alt={policy.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">
                {policy.title}
              </h3>
              <p className="text-gray-600">
                Coverage: ${policy.coverageRange?.toLocaleString()}
              </p>
              <p className="text-gray-600">Term: {policy.duration} years</p>
              <Link
                to={`/policies/${policy._id}`}
                className="text-blue-600 hover:text-blue-800 mt-2 block font-medium"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularPolicies;
