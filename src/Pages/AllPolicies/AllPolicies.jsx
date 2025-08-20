import React, { useEffect, useState } from "react";
import axios from "axios";
import PolicyCard from "../../Components/Card/PolicyCard";

const AllPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const policiesPerPage = 8;

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://life-nest-company-server.vercel.app/policies")
      .then((res) => {
        setPolicies(res.data.policies || []);
        setFilteredPolicies(res.data.policies || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load policies. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Search functionality with safe property access
  useEffect(() => {
    if (!policies || policies.length === 0) return;

    const filtered = policies.filter((policy) => {
      const name = policy?.name || "";
      const description = policy?.description || "";

      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredPolicies(filtered);
    setCurrentPage(1);
  }, [searchTerm, policies]);

  // Get current policies for pagination
  const indexOfLastPolicy = currentPage * policiesPerPage;
  const indexOfFirstPolicy = indexOfLastPolicy - policiesPerPage;
  const currentPolicies = filteredPolicies.slice(
    indexOfFirstPolicy,
    indexOfLastPolicy
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredPolicies.length / policiesPerPage);

  // Generate page numbers to show
  const getDisplayedPageNumbers = () => {
    if (totalPages <= 1) return [];

    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center">
        <div className="text-2xl text-gray-600 mt-10">Loading policies...</div>
        <div className="mt-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <div className="text-center mt-6">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl text-black mx-auto p-6">
      {/* Title and Subtitle */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          Explore Our Insurance Policies
        </h2>
        <p className="text-gray-600 text-lg">
          Find the perfect policy that fits your needs and secures your future.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search policies by name or description..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        {filteredPolicies.length === 0 ? (
          <p>No policies found matching your search.</p>
        ) : (
          <p>
            Showing {indexOfFirstPolicy + 1}-
            {Math.min(indexOfLastPolicy, filteredPolicies.length)} of{" "}
            {filteredPolicies.length} policies
          </p>
        )}
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {currentPolicies.length > 0 ? (
          currentPolicies.map((policy) => (
            <PolicyCard key={policy._id || Math.random()} policy={policy} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 text-lg">
              No policies available at the moment.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {getDisplayedPageNumbers().map((number, index) =>
              number === "..." ? (
                <span key={`ellipsis-${index}`} className="px-2 py-2">
                  ...
                </span>
              ) : (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`w-10 h-10 rounded-full border ${
                    currentPage === number
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {number}
                </button>
              )
            )}

            {/* Next Button */}
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AllPolicies;
