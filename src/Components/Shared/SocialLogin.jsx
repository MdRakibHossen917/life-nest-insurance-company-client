// src/Pages/Login/SocialLogin.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const SocialLogin = () => {
  const { signInWithGoogle } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((result) => {
        const user = result.user;

        // 🔹 ব্যাকএন্ডে ইউজার সেভ/আপডেট
        fetch("https://life-nest-company-server.vercel.app/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            role: "user", // চাইলে বাদও দিতে পারো, ব্যাকএন্ড ডিফল্ট দিবে
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("User saved/updated:", data);
          })
          .catch((err) => console.error("Backend error:", err));

        // 🔹 সফল লগইন এলার্ট
        Swal.fire({
          icon: "success",
          title: "Login successful!",
          showConfirmButton: false,
          timer: 1500,
        });

        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: error.message,
        });
      });
  };

  return (
    <div className="text-center mt-4">
      <p className="mb-4">OR</p>
      <button
        onClick={handleGoogleSignIn}
        className="btn bg-white w-full text-black border-[#e5e5e5] flex items-center justify-center gap-2"
      >
        <svg
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <g>
            <path d="m0 0H512V512H0" fill="#fff"></path>
            <path
              fill="#34a853"
              d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
            ></path>
            <path
              fill="#4285f4"
              d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
            ></path>
            <path
              fill="#fbbc02"
              d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
            ></path>
            <path
              fill="#ea4335"
              d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
            ></path>
          </g>
        </svg>
        Login with Google
      </button>
    </div>
  );
};

export default SocialLogin;
