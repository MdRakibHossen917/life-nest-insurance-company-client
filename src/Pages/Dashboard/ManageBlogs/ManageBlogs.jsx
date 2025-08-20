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
      const res = await axiosSecure.get(`/blogs?_t=${new Date().getTime()}`);
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchBlogs();
  }, [user]);

  // Create Blog
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosSecure.post("/blogs", newBlog);
      Swal.fire("Created!", "Blog has been created.", "success");
      setNewBlog({ title: "", content: "" });
      fetchBlogs();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to create blog", "error");
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
        await axiosSecure.delete(`/blogs/${id}`);
        Swal.fire("Deleted!", "Blog has been deleted.", "success");
        fetchBlogs();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete blog", "error");
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
        `<textarea id="swal-input2" class="swal2-textarea" placeholder="Content">${blog.content}</textarea>`,
      focusConfirm: false,
      preConfirm: () => {
        return {
          title: document.getElementById("swal-input1").value,
          content: document.getElementById("swal-input2").value,
        };
      },
    });

    if (formValues) {
      try {
        await axiosSecure.patch(`/blogs/${id}`, formValues);
        Swal.fire("Updated!", "Blog has been updated.", "success");
        fetchBlogs();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to update blog", "error");
      }
    }
  };

  if (loading) return <p>Loading blogs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Blogs</h2>

      {/* Create Blog Form */}
      <form onSubmit={handleCreate} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full"
          value={newBlog.title}
          onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          className="border p-2 w-full"
          value={newBlog.content}
          onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Blog
        </button>
      </form>

      {/* Blog List */}
      <div className="space-y-4">
        {blogs.map((blog) => (
          <div key={blog._id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{blog.title}</h3>
            <p className="my-2">{blog.content}</p>
            <p className="text-sm text-gray-500">
              Published: {new Date(blog.publishDate).toLocaleString()}
            </p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleUpdate(blog._id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBlogs;
