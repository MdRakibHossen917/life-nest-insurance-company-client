import React, { useEffect, useState } from "react";
import axios from "axios";
import PolicyCard from "../../Components/Card/PolicyCard";

const AllPolicies = () => {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/policies")
      .then((res) => setPolicies(res.data.policies))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-7xl text-black mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-6">All Insurance Policies</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {policies.map((policy) => (
          <PolicyCard key={policy._id} policy={policy} />
        ))}
      </div>
    </div>
  );
};

export default AllPolicies;
