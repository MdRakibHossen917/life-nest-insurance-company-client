import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";


const Profile = () => {
  const { user } = useAuth(); // Firebase user
  const axiosSecure = useAxiosSecure(); // Axios with JWT interceptor
  const [lastLogin, setLastLogin] = useState(null);
  const [role, setRole] = useState(""); // Admin / Agent / Customer
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, setValue } = useForm();

  // Fetch profile info from DB
  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get(`/users?email=${user.email}`)
      .then((res) => {
        const profile = res.data;
        setValue("name", profile.name);
        setValue("photo", profile.photo);
        setRole(profile.role);
        setLastLogin(profile.lastLogin); // DB or Firebase timestamp
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user, setValue, axiosSecure]);

  const onSubmit = async (data) => {
    try {
      const updateData = {
        name: data.name,
        photo: data.photo,
      };
      const res = await axiosSecure.patch(`/users/${user.email}`, updateData);
      if (res.data.success) {
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  if (loading) return <p className="text-center py-10">Loading profile...</p>;

  return (
    <div className="max-w-2xl text-gray-800 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

      <div className="text-center mb-4">
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt={user?.displayName}
          className="w-24 h-24 mx-auto rounded-full object-cover mb-2"
        />
        <div className="inline-block px-3 py-1 rounded-full bg-blue-200 text-blue-800 font-semibold">
          {role || "User"}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Photo URL */}
        <div>
          <label className="block mb-1 font-medium">Photo URL</label>
          <input
            type="text"
            {...register("photo")}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Email (non-editable) */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100"
          />
        </div>

        {/* Last Login */}
        {lastLogin && (
          <p className="text-gray-500 text-sm">
            Last Login: {new Date(lastLogin).toLocaleString()}
          </p>
        )}

        <div className="text-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
