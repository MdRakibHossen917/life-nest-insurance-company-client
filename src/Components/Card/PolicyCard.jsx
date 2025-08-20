import React from "react";
import { Link } from "react-router";

const PolicyCard = ({ policy }) => {
  return (
    <div className="  text-black rounded shadow hover:shadow-lg transition p-4 flex flex-col">
      <img
        src={policy.image}
        alt={policy.title}
        className="w-full h-40 object-cover rounded mb-3"
      />
      <h3 className="text-xl font-bold">{policy.title}</h3>
      <p className="text-sm text-gray-500">{policy.category}</p>
      <p className="text-gray-700 mt-2 line-clamp-3">{policy.shortDetails}</p>

      <Link
        to={`/policies/${policy._id}`}
        className="mt-auto inline-block px-4 py-2 bg-[#47a9a2] text-white rounded hover:bg-[#1d7771] transition text-center"
      >
        View Details
      </Link>
    </div>
  );
};

export default PolicyCard;
