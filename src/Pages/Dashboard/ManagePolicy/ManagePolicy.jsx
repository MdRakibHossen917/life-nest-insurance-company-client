import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagePolicy = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPolicy, setEditPolicy] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    minAge: "",
    maxAge: "",
    coverageRange: "",
    duration: "",
    basePremium: "",
    image: "",
  });
  const [modalOpen, setModalOpen] = useState(false);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get(
        "https://life-nest-company-server.vercel.app/policies"
      );
      setPolicies(res.data.policies || res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) return;
    try {
      await axios.delete(
        `https://life-nest-company-server.vercel.app/policies/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPolicies();
    } catch (err) {
      console.error(err);
      alert("Failed to delete policy");
    }
  };

  const handleOpenEdit = (policy) => {
    setEditPolicy(policy);
    setFormData({
      title: policy.title || "",
      category: policy.category || "",
      description: policy.description || "",
      minAge: policy.minAge || "",
      maxAge: policy.maxAge || "",
      coverageRange: policy.coverageRange || "",
      duration: policy.duration || "",
      basePremium: policy.basePremium || "",
      image: policy.image || "",
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditPolicy(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editPolicy) return;

    try {
      await axios.patch(
        `https://life-nest-company-server.vercel.app/policies/${editPolicy._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPolicies();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("Failed to update policy");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 text-gray-800">
      <h2 className="text-xl font-bold mb-4">Manage Policies</h2>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Min Age</th>
            <th className="border px-4 py-2">Max Age</th>
            <th className="border px-4 py-2">Coverage</th>
            <th className="border px-4 py-2">Duration</th>
            <th className="border px-4 py-2">Base Premium</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <tr key={policy._id}>
              <td className="border px-4 py-2">{policy.title}</td>
              <td className="border px-4 py-2">{policy.category}</td>
              <td className="border px-4 py-2">{policy.minAge}</td>
              <td className="border px-4 py-2">{policy.maxAge}</td>
              <td className="border px-4 py-2">{policy.coverageRange}</td>
              <td className="border px-4 py-2">{policy.duration}</td>
              <td className="border px-4 py-2">{policy.basePremium}</td>
              <td className="border px-4 py-2 flex gap-2">
                <button
                  className="bg-yellow-400 px-2 py-1 rounded"
                  onClick={() => handleOpenEdit(policy)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(policy._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit Policy</h3>
            <form onSubmit={handleUpdate} className="space-y-2">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="border p-2 w-full"
                required
              />
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Category"
                className="border p-2 w-full"
                required
              />
              <input
                type="number"
                name="minAge"
                value={formData.minAge}
                onChange={handleInputChange}
                placeholder="Min Age"
                className="border p-2 w-full"
                required
              />
              <input
                type="number"
                name="maxAge"
                value={formData.maxAge}
                onChange={handleInputChange}
                placeholder="Max Age"
                className="border p-2 w-full"
                required
              />
              <input
                type="text"
                name="coverageRange"
                value={formData.coverageRange}
                onChange={handleInputChange}
                placeholder="Coverage Range"
                className="border p-2 w-full"
                required
              />
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="Duration"
                className="border p-2 w-full"
                required
              />
              <input
                type="number"
                name="basePremium"
                value={formData.basePremium}
                onChange={handleInputChange}
                placeholder="Base Premium"
                className="border p-2 w-full"
                required
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePolicy;
