import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import { getAuth } from "firebase/auth";
 

const AddBlogs = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: user?.displayName || "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.displayName) {
      setFormData((prev) => ({
        ...prev,
        author: user.displayName,
      }));
    }
  }, [user?.displayName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    setLoading(true);

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Swal.fire("Error", "User not authenticated", "error");
        setLoading(false);
        return;
      }

      const idToken = await currentUser.getIdToken();

      const blogData = {
        ...formData,
        publishDate: new Date(),  
      };

      const res = await axios.post("http://localhost:5000/blogs", blogData, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (res.data.insertedId) {
        Swal.fire("Success", "Blog published successfully!", "success");
        setFormData({
          title: "",
          content: "",
          author: user?.displayName || "",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow text-black">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            placeholder="Blog title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Write your blog content here..."
            value={formData.content}
            onChange={handleChange}
            required
            disabled={loading}
            rows="6"
            className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="author">
            Author
          </label>
          <input
            id="author"
            name="author"
            value={formData.author}
            readOnly
            disabled
            className="w-full border border-gray-300 p-3 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Publish */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-6 py-3 rounded text-white text-lg font-semibold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlogs;
