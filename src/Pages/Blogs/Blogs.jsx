import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/blogs")
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 text-gray-700">
      <h2 className="text-2xl font-bold mb-6">All Blogs</h2>
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
                By {blog.author} on{" "}
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
