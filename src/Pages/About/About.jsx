import React from "react";

const About = () => {
  return (
    <section className="py-16 bg-gray-50 text-gray-800">
      {/* Title & Subtitle */}
      <div className="text-center mb-12 px-4">
        <h2 className="text-4xl font-bold mb-4">About LifeNest Insurance</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          At LifeNest Insurance, we provide trusted and comprehensive insurance
          solutions to secure your future. Learn about our mission, vision, and
          values.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-4 mb-16">
        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Our Mission
          </h3>
          <p className="text-gray-600">
            To provide accessible and reliable insurance solutions that protect
            families and individuals, ensuring peace of mind in every stage of
            life.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Our Vision
          </h3>
          <p className="text-gray-600">
            To become the most trusted insurance provider in the region,
            renowned for innovation, customer satisfaction, and community
            impact.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-8">Our Core Values</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
            <h4 className="text-xl font-semibold mb-2">Integrity</h4>
            <p className="text-gray-600">
              We uphold the highest ethical standards in everything we do.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
            <h4 className="text-xl font-semibold mb-2">Customer First</h4>
            <p className="text-gray-600">
              Our clients are at the heart of every decision we make.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
            <h4 className="text-xl font-semibold mb-2">Innovation</h4>
            <p className="text-gray-600">
              We embrace technology and creative solutions to improve insurance
              services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
