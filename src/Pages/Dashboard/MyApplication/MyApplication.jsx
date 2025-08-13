import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const MyApplication = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    data: applications = [],
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-applications", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/applications?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleView = (id) => {
    navigate(`/dashboard/applications/${id}`);
  };

  const handlePay = (id) => {
    navigate(`/dashboard/payment/${id}`);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This application will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/applications/${id}`);
        if (res.data.deletedCount > 0 || res.data.success) {
          Swal.fire({
            title: "Deleted!",
            text: "Application has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          refetch();
        } else {
          throw new Error("Application not found or already deleted");
        }
      } catch (err) {
        Swal.fire(
          "Error",
          err.message || "Failed to delete application",
          "error"
        );
      }
    }
  };

  if (isLoading) {
    return <p className="text-center mt-4">Loading applications...</p>;
  }

  if (error) {
    return (
      <p className="text-center mt-4 text-red-500">
        Error loading applications: {error.message}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto text-gray-700 shadow-md rounded-xl">
      <h2 className="text-lg font-semibold px-4 py-2">
        My Applications: {applications.length}
      </h2>
      <table className="table table-zebra w-full">
        <thead className="bg-base-200 text-base font-semibold">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>NID</th>
            <th>Status</th>
            <th>Premium</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center text-gray-500 py-6">
                No applications found.
              </td>
            </tr>
          )}
          {applications.map((app, index) => (
            <tr key={app._id}>
              <td>{index + 1}</td>
              <td className="max-w-[150px] truncate">{app.name}</td>
              <td>{app.nid}</td>
              <td className="capitalize">{app.status}</td>
              <td className="max-w-[200px] truncate">{app.estimatedPremium}</td>
              
              <td className="space-x-2">
                <button
                  onClick={() => handleView(app._id)}
                  className="btn btn-xs btn-outline"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(app._id)}
                  className="btn btn-xs btn-error"
                >
                  Delete
                </button>
                {["pending", "unpaid"].includes(app.status?.toLowerCase()) && (
                  <button
                    onClick={() => handlePay(app._id)}
                    className="btn btn-xs btn-primary text-black"
                  >
                    Pay
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyApplication;
