import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import axios from "axios";

const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [lastLogin, setLastLogin] = useState(null);
  const [role, setRole] = useState(""); // Admin / Agent / Customer
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [uploading, setUploading] = useState(false);
  const [dbUser, setDbUser] = useState(null);

  const { register, handleSubmit, setValue, watch } = useForm();
  const watchPhoto = watch("photo");

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  useEffect(() => {
    if (!user?.email) return;

    // Use the correct endpoint: /users/:email instead of /users?email=
    axiosSecure
      .get(`/users/${user.email}`)
      .then((res) => {
        const profile = res.data;
        setDbUser(profile);
        setValue("photo", profile.photo || "");
        setRole(profile.role || "User");
        setLastLogin(profile.lastLogin || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
        setMessage({ type: "error", text: "Failed to load profile" });
      });
  }, [user, setValue, axiosSecure]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        formData
      );
      const imageUrl = res.data.data.url;
      setValue("photo", imageUrl);
      setMessage({ type: "success", text: "Image uploaded successfully!" });
    } catch (err) {
      console.error("Image upload error:", err);
      setMessage({ type: "error", text: "Image upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setMessage({ type: "", text: "" });
    try {
      // Only update if the photo has changed
      if (data.photo === dbUser?.photo) {
        setMessage({ type: "info", text: "No changes to save" });
        return;
      }

      const updateData = {
        photo: data.photo,
      };

      const res = await axiosSecure.patch(`/users/${user.email}`, updateData);

      if (res.data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        // Update local state
        setDbUser({ ...dbUser, photo: data.photo });
      } else {
        setMessage({
          type: "error",
          text: res.data.message || "No changes were made",
        });
      }
    } catch (err) {
      console.error("Profile update error:", err);
      if (err.response?.data?.message) {
        setMessage({ type: "error", text: err.response.data.message });
      } else {
        setMessage({
          type: "error",
          text: "Failed to update profile. Please check your permissions.",
        });
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

      {/* Avatar */}
      <div className="text-center mb-6">
        <img
          src={watchPhoto || user?.photoURL || "/default-avatar.png"}
          alt={user?.displayName || "User Avatar"}
          className="w-28 h-28 mx-auto rounded-full object-cover mb-2 border-2 border-blue-300"
        />
        <div className="inline-block px-3 py-1 rounded-full bg-blue-200 text-blue-800 font-semibold">
          {role || "User"}
        </div>
      </div>

      {/* Inline message */}
      {message.text && (
        <p
          className={`text-center mb-4 p-2 rounded ${
            message.type === "success"
              ? "text-green-800 bg-green-100"
              : message.type === "error"
              ? "text-red-800 bg-red-100"
              : "text-blue-800 bg-blue-100"
          }`}
        >
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name (read-only from Firebase) */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={user?.displayName || ""}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block mb-1 font-medium">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border rounded-md p-2"
            disabled={uploading}
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading image...</p>
          )}
          <input type="hidden" {...register("photo")} />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Role (read-only) */}
        <div>
          <label className="block mb-1 font-medium">Role</label>
          <input
            type="text"
            value={role || "User"}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Last Login */}
        {lastLogin && (
          <p className="text-gray-500 text-sm text-center">
            Last Login: {new Date(lastLogin).toLocaleString()}
          </p>
        )}

        {/* Submit */}
        <div className="text-center mt-4">
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 transition duration-200"
          >
            {uploading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
