import React from "react";

const AboutUs = () => {
  return (
    <section className="py-16 bg-gray-50 text-gray-800">
      {/* Title & Subtitle */}
      <div className="text-center mb-12 px-4">
        <h2 className="text-4xl font-bold mb-4">About LifeNest Insurance</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Providing trusted insurance solutions for you and your family. Learn
          about our mission, vision, and values.
        </p>
      </div>

      {/* Mission, Vision, Values */}
      <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-3 px-4">
        {/* Mission */}
        <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
          <p className="text-gray-600">
            To provide accessible and reliable insurance solutions that secure
            the future of our clients and their families.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
          <p className="text-gray-600">
            To be the most trusted insurance provider, delivering innovative
            products and excellent customer service worldwide.
          </p>
        </div>

        {/* Values */}
        <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-2xl font-semibold mb-4">Our Values</h3>
          <p className="text-gray-600">
            Integrity, transparency, customer-focus, and innovation drive
            everything we do to protect and support our clients.
          </p>
        </div>
      </div>

      {/* Optional Image / Team Section */}
      <div className="max-w-6xl mx-auto mt-16 px-4 text-center">
        <img
          src="https://picsum.photos/900/300"
          alt="About LifeNest"
          className="rounded-lg shadow-md mx-auto"
        />
        <p className="text-gray-600 mt-4">
          Our team of dedicated professionals works tirelessly to deliver the
          best insurance solutions for you.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
