import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { getAuth } from "firebase/auth";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          setError("Failed to load blogs. Make sure you are logged in.");
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();
        const res = await axios.get(
          "https://life-nest-company-server.vercel.app/blogs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBlogs(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p className="p-6">Loading blogs...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 text-gray-700">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-gray-900">
          All Blogs  
        </h2>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Stay updated with the newest articles, tips, and insights from our
          experts.
        </p>
      </div>

      {blogs.length === 0 ? (
        <p>No blogs available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="rounded-lg shadow-md p-4 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
              <p className="text-gray-700 mb-4">
                {blog.content.slice(0, 100)}...
              </p>
              <small className="text-gray-500">
                By {blog.authorName || blog.author} on{" "}
                {new Date(blog.publishDate).toLocaleDateString()}
              </small>
              <Link
                to={`/blogs/${blog._id}`}
                className="text-blue-500 hover:underline mt-2 block"
              >
                Read More
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;
