import React, { useState } from "react";
import { Link } from "react-router";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Sending...");

    // Example: Replace with actual API request
    setTimeout(() => {
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <section className="py-16 bg-gray-50 text-gray-800">
      {/* Title & Subtitle */}
      <div className="text-center mb-12 px-4">
        <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Have questions or need assistance? Reach out to our team and we'll get
          back to you as soon as possible. Learn more{" "}
          <Link
            to="/about"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            about us
          </Link>
          .
        </p>
      </div>

      {/* Contact Form & Info */}
      <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 px-4">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
          >
            {status === "Sending..." ? "Sending..." : "Send Message"}
          </button>

          {status && status !== "Sending..." && (
            <p className="text-green-600 mt-2">{status}</p>
          )}
        </form>

        {/* Contact Info */}
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <h3 className="text-2xl font-semibold mb-4">Our Contact Info</h3>
          <p>
            <strong>Email:</strong> mdrakibhossencse@gmail.com
          </p>
          <p>
            <strong>Phone:</strong> +880 01300981501
          </p>
          <p>
            <strong>Address:</strong> 123 Shomajkallan Road, Dhaka, Bangladesh
          </p>

          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">Follow Me</h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.linkedin.com/in/rakibhossen917/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/MdRakibHossen917"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-600"
              >
                GitHub
              </a>
              <a
                href="https://my-portfolio-dd98e.web.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800"
              >
                Portfolio
              </a>
              <a
                href="https://www.facebook.com/md.rakib.hossen.41751"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
