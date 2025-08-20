import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const RequestAgent = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!user) {
      Swal.fire(
        "Login Required",
        "Please login first to submit request",
        "warning"
      );
      return;
    }

    const agentRequest = {
      name: data.name,
      email: user.email,
      phone: data.phone,
      nid: data.nid,
      district: data.district,
    };

    try {
      const res = await axiosSecure.post("/agents", agentRequest);
      Swal.fire(
        "Success",
        res.data.message || "Agent request submitted!",
        "success"
      );
      reset();
    } catch (err) {
      console.error(err.response?.data || err.message);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to submit request",
        "error"
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-lg text-gray-900">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">
        Request to Become an Agent
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-600">
            Full Name
          </label>
          <input
            type="text"
            {...register("name", { required: true })}
            placeholder="Your full name"
            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
              errors.name ? "border-red-500 ring-red-200" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">Name is required</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-medium text-gray-600">Email</label>
          <input
            type="email"
            defaultValue={user?.email}
            readOnly
            className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-2 font-medium text-gray-600">Phone</label>
          <input
            type="text"
            {...register("phone", { required: true })}
            placeholder="01XXXXXXXXX"
            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
              errors.phone ? "border-red-500 ring-red-200" : "border-gray-300"
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">Phone is required</p>
          )}
        </div>

        {/* NID */}
        <div>
          <label className="block mb-2 font-medium text-gray-600">
            National ID (NID)
          </label>
          <input
            type="text"
            {...register("nid", { required: true })}
            placeholder="Your NID number"
            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
              errors.nid ? "border-red-500 ring-red-200" : "border-gray-300"
            }`}
          />
          {errors.nid && (
            <p className="text-red-500 text-sm mt-1">NID is required</p>
          )}
        </div>

        {/* District */}
        <div>
          <label className="block mb-2 font-medium text-gray-600">
            District
          </label>
          <input
            type="text"
            {...register("district", { required: true })}
            placeholder="Your district"
            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
              errors.district
                ? "border-red-500 ring-red-200"
                : "border-gray-300"
            }`}
          />
          {errors.district && (
            <p className="text-red-500 text-sm mt-1">District is required</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestAgent;
