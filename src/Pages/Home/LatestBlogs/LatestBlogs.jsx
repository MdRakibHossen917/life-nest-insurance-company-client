import React from "react";
import { Link } from "react-router";
import Image1 from "../../../assets/Blogs/beautiful-couple-spend-time-summer-park-near-car.jpg";
import Image2 from "../../../assets/Blogs/full-shot-adults-traveling-with-kid.jpg";
import Image3 from "../../../assets/Blogs/jakub-zerdzicki-GQn9GnMkVQg-unsplash.jpg";
import Image4 from "../../../assets/Blogs/tierra-mallorca-rgJ1J8SDEAY-unsplash.jpg";

const blogsData = [
  {
    id: 1,
    title: "Car Insurance Of State",
    author: "Md Rakib Hossen",
    date: "Aug 20, 2025",
    image: Image1,
  },
  {
    id: 2,
    title: "Traveling the World",
    author: "Jane Alam",
    date: "Aug 18, 2025",
    image: Image2,
  },
  {
    id: 3,
    title: "Service All of Insurance",
    author: "Abir Hossain",
    date: "Aug 15, 2025",
    image: Image3,
  },
  {
    id: 4,
    title: "Home Insurance",
    author: "Enam Mahmud",
    date: "Aug 10, 2025",
    image: Image4,
  },
];

const LatestBlogs = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-900">
      {/* Title and Subtitle */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Latest Blogs</h2>
        <p className="text-gray-600 text-lg">
          Stay updated with the newest articles, tips, and insights from our
          experts.
        </p>
      </div>

      {/* Blog Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogsData.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                By {blog.author} • {blog.date}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Optional More Blogs Button */}
      <div className="text-center mt-8">
        <Link to="/blogs">
          <button className="bg-[#78B9B5] text-white px-6 py-2 rounded-lg hover:bg-[#419b95] transition-colors">
            More Blogs
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LatestBlogs;
