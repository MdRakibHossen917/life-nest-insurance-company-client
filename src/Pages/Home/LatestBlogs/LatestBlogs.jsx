import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/blogs/latest")
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 text-gray-700">
      {/* Title */}
      <h2 className="text-4xl font-bold text-center mb-2 text-gray-800">
        Stay Informed with Our Latest Insights
      </h2>
      {/* Subtitle */}
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Explore our most recent blogs and articles about insurance tips,
        industry updates, and helpful guides to make informed decisions.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="rounded-lg shadow p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {blog.title}
              </h3>
              <p className="text-gray-700 mb-4">
                {blog.content.length > 100
                  ? blog.content.substring(0, 100) + "..."
                  : blog.content}
              </p>
            </div>
            <button
              onClick={() => navigate(`/blogs/${blog._id}`)}
              className="mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors duration-300"
            >
              Read More
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={() => navigate("/blogs")}
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded text-lg transition-colors duration-300"
        >
          All Blogs / Articles
        </button>
      </div>
    </section>
  );
};

export default LatestBlogs;
