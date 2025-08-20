import React, { useState, useEffect } from "react";

import HeroImg1 from "../../../assets/Hero/girl-bumping-fists-with-parents.jpg";
import HeroImg2 from "../../../assets/Hero/img12.jpg";
import HeroImg3 from "../../../assets/Hero/img14.jpg";
import { Link } from "react-router";

const slides = [
  {
    image: HeroImg1,
    heading: "Secure Your Tomorrow Today",
    tagline:
      "Plan ahead for a worry-free future with our trusted insurance solutions.",
  },
  {
    image: HeroImg2,
    heading: "Protect What Matters Most",
    tagline: "Reliable coverage for your family and assets.",
  },
  {
    image: HeroImg3,
    heading: "Peace of Mind is Priceless",
    tagline: "Get comprehensive plans tailored just for you.",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 5000); // change slide every 5 seconds
    return () => clearInterval(timer);
  }, [length]);

  return (
    <section
      style={{ position: "relative", height: "80vh", overflow: "hidden" }}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "80vh",
            width: "100%",
            position: index === current ? "relative" : "absolute",
            top: 0,
            left: 0,
            opacity: index === current ? 1 : 0,
            transition: "opacity 1s ease-in-out",
            display: "flex",
            alignItems: "center",
            paddingLeft: "5%",
            color: "#fff",
            textShadow: "0 0 10px rgba(0,0,0,0.7)",
          }}
        >
          {index === current && (
            <div style={{ maxWidth: "450px" }}>
              <h1
                style={{
                  fontSize: "3rem",
                  marginBottom: "1rem",
                  fontWeight: "700",
                }}
              >
                {slide.heading}
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  marginBottom: "2rem",
                  lineHeight: "1.5",
                }}
              >
                {slide.tagline}
              </p>
              <Link to="/get-quote">
                <button
                  style={{
                    backgroundColor: "#1E90FF",
                    color: "white",
                    padding: "12px 24px",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                >
                  Get a Free Quote
                </button>
              </Link>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default Hero;
