import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import axios from "axios";

const DetailsPolicy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`https://life-nest-company-server.vercel.app/policies/${id}`)
      .then((res) => {
        setPolicy(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch policy details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center py-10 text-xl">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10 text-xl">{error}</div>
    );
  }

  return (
    <div className="max-w-4xl text-black mx-auto p-4">
      <h2 className="text-4xl font-bold mb-4">{policy.title}</h2>

      <img
        src={policy.image}
        alt={policy.title}
        className="w-full h-full  rounded mb-6"
      />

      <p className="text-lg text-gray-700 mb-4">{policy.shortDetails}</p>

      <p className="text-base">
        <strong>Category:</strong> {policy.category}
      </p>

      <p className="text-base mt-2">
        <strong>Coverage:</strong> ${policy.coverageRange}
      </p>

      <p className="text-base mt-2">
        <strong>Term Duration:</strong> {policy.duration}
      </p>

      <p className="text-base mt-2">
        <strong>Popularity:</strong> {policy.popularity} ⭐
      </p>
      <p className="text-base mt-2">
        <strong>
          Description: <br />
        </strong>{" "}
        {policy.description}
      </p>

      <div className="flex justify-between my-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-[#3f9b95] text-sm rounded hover:bg-[#21716c] "
        >
          ← Back
        </button>
        <Link to="/get-quote" className="btn w-50 rounded bg-[#3f9b95] ">
          Quote Page
        </Link>
      </div>
    </div>
  );
};

export default DetailsPolicy;
