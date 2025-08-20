import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import SocialLogin from "../../Components/Shared/SocialLogin";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setProfilePic] = useState("");
  const axiosInstance = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const defaultPic = "https://i.ibb.co/4f0j0Lp/default-profile.png"; // fallback image

  const onSubmit = async (data) => {
    try {
      // Firebase create user
      const result = await createUser(data.email, data.password);

      // Save user info in backend
      const userInfo = {
        email: data.email,
        role: "user",
        name: data.name,
        photoURL: profilePic || defaultPic,
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };
      await axiosInstance.post("/users", userInfo);

      // 3️⃣ Update Firebase profile
      await updateUserProfile({
        displayName: data.name,
        photoURL: profilePic || defaultPic,
      });

      // 4️⃣ Success alert
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your account has been created.",
        confirmButtonText: "Continue",
      });

      // 5️⃣ Navigate
      navigate(from);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.message || "Something went wrong!",
      });
    }
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    if (!image) return;

    // File type & size validation
    if (!image.type.startsWith("image/")) {
      return Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload an image file (jpg, png, etc.)",
      });
    }
    if (image.size > 10 * 1024 * 1024) {
      return Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Maximum size is 10MB",
      });
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData
      );
      setProfilePic(res.data.data.url);
      Swal.fire({
        icon: "success",
        title: "Image Uploaded",
        text: "Profile picture uploaded successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Image upload failed:", err);
      Swal.fire({
        icon: "error",
        title: "Image Upload Failed",
        text: "Please try again!",
      });
    }
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl mx-auto mt-8">
      <div className="card-body">
        <h1 className="text-4xl font-bold text-center mb-4">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              {...register("name", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.name && (
              <p className="text-red-500 mt-1">Name is required</p>
            )}
          </div>

          {/* Profile Image */}
          <div>
            <label className="label">Profile Picture</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="input input-bordered w-full"
            />
          </div>

          {/* Email */}
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.email && (
              <p className="text-red-500 mt-1">Email is required</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: true, minLength: 6 })}
              className="input input-bordered w-full"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500 mt-1">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500 mt-1">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2">
            Register
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 underline">
            Login
          </Link>
        </p>

        <SocialLogin />
      </div>
    </div>
  );
};

export default Register;
