import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/blogs/${id}`)
      .then((res) => setBlog(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!blog) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 text-gray-700 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-700 mb-6">{blog.content}</p>
      <small className="text-gray-500">
        By {blog.author} on {new Date(blog.publishDate).toLocaleDateString()}
      </small>
    </div>
  );
};

export default BlogDetail;
