import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

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
    const agentRequest = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      nid: data.nid,
      district: data.district,
      status: "pending",
      requestedBy: user?.email,
    };

    try {
      await axiosSecure.post("/agents", agentRequest);
      alert("Agent request submitted successfully!");
      reset();
    } catch (err) {
      console.error(err);
      alert("Failed to submit request");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-gray-800 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Request to Become an Agent
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="w-full border rounded-md p-2"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">Name is required</span>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            defaultValue={user?.email}
            {...register("email", { required: true })}
            className="w-full border rounded-md p-2"
            readOnly
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1">Phone</label>
          <input
            type="text"
            {...register("phone", { required: true })}
            className="w-full border rounded-md p-2"
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">Phone is required</span>
          )}
        </div>

        {/* NID */}
        <div>
          <label className="block mb-1">National ID (NID)</label>
          <input
            type="text"
            {...register("nid", { required: true })}
            className="w-full border rounded-md p-2"
          />
          {errors.nid && (
            <span className="text-red-500 text-sm">NID is required</span>
          )}
        </div>

        {/* District */}
        <div>
          <label className="block mb-1">District</label>
          <input
            type="text"
            {...register("district", { required: true })}
            className="w-full border rounded-md p-2"
          />
          {errors.district && (
            <span className="text-red-500 text-sm">District is required</span>
          )}
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestAgent;
