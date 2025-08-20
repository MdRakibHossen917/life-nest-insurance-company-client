import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageBlogs = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newBlog, setNewBlog] = useState({ title: "", content: "" });

  // Fetch Blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/blogs");
      setBlogs(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(
        "Failed to load blogs. You may not have permission to view blogs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
  }, [user]);

  // Create Blog
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const blogData = {
        title: newBlog.title,
        content: newBlog.content,
        // These fields will be added by the backend automatically
      };

      const res = await axiosSecure.post("/blogs", blogData);

      if (res.data.success) {
        Swal.fire("Created!", "Blog has been created.", "success");
        setNewBlog({ title: "", content: "" });
        fetchBlogs();
      } else {
        Swal.fire("Error", "Failed to create blog", "error");
      }
    } catch (err) {
      console.error("Error creating blog:", err);
      Swal.fire(
        "Error",
        "Failed to create blog. You may not have permission.",
        "error"
      );
    }
  };

  // Delete Blog
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/blogs/${id}`);

        if (res.data.success) {
          Swal.fire("Deleted!", "Blog has been deleted.", "success");
          fetchBlogs();
        } else {
          Swal.fire(
            "Error",
            res.data.message || "Failed to delete blog",
            "error"
          );
        }
      } catch (err) {
        console.error("Error deleting blog:", err);
        Swal.fire(
          "Error",
          "Failed to delete blog. You may not have permission.",
          "error"
        );
      }
    }
  };

  // Update Blog
  const handleUpdate = async (id) => {
    const blog = blogs.find((b) => b._id === id);
    if (!blog) return;

    const { value: formValues } = await Swal.fire({
      title: "Edit Blog",
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Title" value="${blog.title}">` +
        `<textarea id="swal-input2" class="swal2-textarea" placeholder="Content" style="height: 150px;">${blog.content}</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          title: document.getElementById("swal-input1").value,
          content: document.getElementById("swal-input2").value,
        };
      },
    });

    if (formValues) {
      try {
        const res = await axiosSecure.patch(`/blogs/${id}`, formValues);

        if (res.data.success) {
          Swal.fire("Updated!", "Blog has been updated.", "success");
          fetchBlogs();
        } else {
          Swal.fire(
            "Error",
            res.data.message || "Failed to update blog",
            "error"
          );
        }
      } catch (err) {
        console.error("Error updating blog:", err);
        Swal.fire(
          "Error",
          "Failed to update blog. You may not have permission.",
          "error"
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading blogs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Blogs</h2>

      {/* Create Blog Form */}
      <form
        onSubmit={handleCreate}
        className="mb-8 bg-white p-6 rounded-lg shadow-md"
      >
        <h3 className="text-xl font-semibold mb-4">Create New Blog</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Blog Title"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Blog Content"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
            value={newBlog.content}
            onChange={(e) =>
              setNewBlog({ ...newBlog, content: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Create Blog
          </button>
        </div>
      </form>

      {/* Blog List */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold mb-4">Your Blogs</h3>

        {blogs.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No blogs found. Create your first blog above!
            </p>
          </div>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {blog.title}
              </h3>
              <p className="text-gray-600 mb-4 whitespace-pre-line">
                {blog.content}
              </p>
              <div className="text-sm text-gray-500 mb-4">
                <p>
                  Published: {new Date(blog.publishDate).toLocaleDateString()}
                </p>
                <p>By: {blog.authorName || blog.authorEmail}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleUpdate(blog._id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageBlogs;
