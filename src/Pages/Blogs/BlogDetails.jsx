import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { getAuth } from "firebase/auth";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          setError("Failed to load blog. Make sure you are logged in.");
          return;
        }

        const token = await user.getIdToken();
        const res = await axios.get(`http://localhost:5000/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBlog(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load blog. Please try again.");
      }
    };

    fetchBlog();
  }, [id]);

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!blog) return <p className="p-6">Loading blog...</p>;

  return (
    <div className="p-6 text-gray-700 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-700 mb-6">{blog.content}</p>
      <small className="text-gray-500">
        By {blog.authorName || blog.author} on{" "}
        {new Date(blog.publishDate).toLocaleDateString()}
      </small>
    </div>
  );
};

export default BlogDetail;
