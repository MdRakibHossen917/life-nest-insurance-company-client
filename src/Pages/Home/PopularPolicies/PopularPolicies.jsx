import React, { useState, useEffect } from "react";
import { Link } from "react-router";

const PopularPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
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

  if (loading) return <p>Loading policies...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!policies.length) return <p>No policies available</p>;

  return (
    <div className="mx-20 my-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-800">
      {policies.map((policy) => (
        <div
          key={policy._id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <img
            src={policy.image || "https://picsum.photos/400/200"}
            alt={policy.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-bold">{policy.title}</h3>
            <p>Coverage: ${policy.coverageRange?.toLocaleString()}</p>
            <p>Term: {policy.duration} years</p>
            <Link
              to={`/policies/${policy._id}`}
              className="text-blue-600 hover:text-blue-800 mt-2 block"
            >
              View Details →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PopularPolicies;
