import React, { useState } from "react";

const NewsletterSubscription = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(
        "https://life-nest-company-server.vercel.app/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Subscription failed");
      }

      setMessage({
        text: data.message || "Thank you for subscribing!",
        type: "success",
      });
      setFormData({ name: "", email: "" });
    } catch (error) {
      setMessage({
        text: error.message || "Failed to subscribe. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white p-10 rounded-xl shadow-lg text-center">
          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Stay Updated!
          </h2>
          {/* Subtitle */}
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter and get the latest updates on our
            services, offers, and insurance tips.
          </p>

          {/* Message */}
          {message.text && (
            <div
              className={`mb-4 p-4 rounded ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                loading
                  ? "bg-[#439893] cursor-not-allowed"
                  : "bg-[#3f9993] hover:bg-[#14615c]"
              } transition-colors duration-300`}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-500">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSubscription;
