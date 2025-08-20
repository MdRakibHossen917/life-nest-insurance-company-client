import React, { useState } from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "What types of insurance do you offer?",
      answer:
        "We provide life insurance, health insurance, travel insurance, and family protection plans tailored to your needs.",
    },
    {
      question: "How can I file a claim?",
      answer:
        "You can file a claim online through your account dashboard or contact our support team for guidance.",
    },
    {
      question: "Can I update my policy after purchase?",
      answer:
        "Yes, you can update your policy details, add coverage options, or change beneficiaries anytime by contacting us.",
    },
    {
      question: "Do you provide customer support?",
      answer:
        "Absolutely! Our customer support team is available 24/7 to help with any inquiries or issues.",
    },
    {
      question: "Is my personal information safe?",
      answer:
        "Yes, we follow strict data privacy policies and use secure encryption to protect your personal information.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-50 text-gray-800">
      {/* Title & Subtitle */}
      <div className="text-center mb-12 px-4">
        <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Have questions? We have answers! Browse our FAQ to learn more about
          LifeNest Insurance.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto px-4 space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <span className="text-2xl">
                {openIndex === index ? "−" : "+"}
              </span>
            </div>
            {openIndex === index && (
              <p className="mt-4 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
