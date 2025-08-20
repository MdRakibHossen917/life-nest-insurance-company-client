import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { getAuth, updatePassword } from "firebase/auth";

const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [lastLogin, setLastLogin] = useState(null);
  const [role, setRole] = useState("");  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch profile info
  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get(`/users/${user.email}`)
      .then((res) => {
        const profile = res.data;
        setRole(profile.role || "User");
        setLastLogin(profile.lastLogin || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
        setMessage({ type: "error", text: "Failed to load profile" });
      });
  }, [user, axiosSecure]);

  // Password change handler
  const onPasswordChange = async (data) => {
    setMessage({ type: "", text: "" });
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setMessage({
        type: "error",
        text: "You must be logged in to change password.",
      });
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    try {
      await updatePassword(currentUser, data.newPassword);
      setMessage({ type: "success", text: "Password updated successfully!" });
      reset({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Password update error:", err);
      setMessage({
        type: "error",
        text: err.message || "Failed to update password.",
      });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-center">My Profile</h2>

      {/* Avatar */}
      <div className="text-center mb-6">
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt={user?.displayName || "User Avatar"}
          className="w-28 h-28 mx-auto rounded-full object-cover mb-2 border-2 border-blue-300"
        />
      </div>

      {/* Inline message */}
      {message.text && (
        <p
          className={`text-center p-2 rounded ${
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

      <div className="space-y-4">
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
      </div>

      {/* Change Password */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Change Password
        </h3>
        <form onSubmit={handleSubmit(onPasswordChange)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">New Password</label>
            <input
              type="password"
              {...register("newPassword", { required: true, minLength: 6 })}
              className="w-full border rounded-md p-2"
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <span className="text-red-500 text-sm">
                Password must be at least 6 characters
              </span>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword", { required: true })}
              className="w-full border rounded-md p-2"
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                Please confirm your password
              </span>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-[#3f9b95] text-white px-6 py-2 rounded-md hover:bg-[#1f8780] transition duration-200"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
