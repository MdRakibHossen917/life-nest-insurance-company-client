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
    <div className="max-w-6xl mx-auto px-4 py-8 text-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-center">Latest Blogs</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className=" rounded-lg shadow p-4 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
              <p className="text-gray-700 mb-4">
                {blog.content.length > 100
                  ? blog.content.substring(0, 100) + "..."
                  : blog.content}
              </p>
            </div>
            <button
              onClick={() => navigate(`/blogs/${blog._id}`)}
              className="mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Read More
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => navigate("/blogs")}
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded text-lg"
        >
          All Blogs / Articles
        </button>
      </div>
    </div>
  );
};

export default LatestBlogs;
