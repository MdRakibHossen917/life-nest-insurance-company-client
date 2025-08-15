import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

const AddPolicy = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [uploadedImageURL, setUploadedImageURL] = useState("");
  const { user } = useAuth();
  const imageWatch = watch("image");

  const imageHostingKey = import.meta.env.VITE_IMGBB_API_KEY;
  const imageHostingURL = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // ✅ Use FormData for image upload
      const formData = new FormData();
      formData.append("image", data.image[0]);

      const res = await axios.post(imageHostingURL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        const imageURL = res.data.data.url;
        setUploadedImageURL(imageURL);

        // Unique tracking ID
        const trackingId =
          "TID-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

        const policy = {
          title: data.title,
          category: data.category,
          description: data.description,
          minAge: parseInt(data.minAge),
          maxAge: parseInt(data.maxAge),
          coverageRange: data.coverageRange,
          duration: data.duration,
          basePremium: parseFloat(data.basePremium),
          image: imageURL,

          // Additional metadata
          creatorEmail: user?.email || "anonymous",
          premiumStatus: "unpaid",
          paymentStatus: "pending",
          tracking_id: trackingId,
          creation_date: new Date().toISOString(),
        };

        const response = await axios.post(
          "http://localhost:5000/policies",
          policy,
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken || ""}`,
            },
          }
        );

        if (response.data.insertedId || response.data.success) {
          Swal.fire("Success", "Policy Added!", "success");
          reset();
          setUploadedImageURL("");
        }
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Image upload or policy creation failed!", "error");
    } finally {
      setLoading(false);
    }
  };

  // Preview
  const localPreview = imageWatch?.[0]
    ? URL.createObjectURL(imageWatch[0])
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 rounded-lg shadow-md bg-white dark:bg-gray-900 transition-all duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        ➕ Add New Insurance Policy
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <div>
            <label className="label text-gray-700 dark:text-gray-200">
              Title
            </label>
            <input
              {...register("title", { required: true })}
              className="input input-bordered w-full bg-white dark:bg-gray-800 dark:text-white"
              placeholder="Enter policy title"
            />
          </div>

          <div>
            <label className="label text-gray-700 dark:text-gray-200">
              Category
            </label>
            <select
              {...register("category", { required: true })}
              className="select select-bordered w-full bg-white dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select</option>
              <option value="Term Life">Term Life</option>
              <option value="Senior">Senior</option>
              <option value="Child">Child</option>
            </select>
          </div>

          <div>
            <label className="label text-gray-700 dark:text-gray-200">
              Description
            </label>
            <textarea
              {...register("description", { required: true })}
              className="textarea textarea-bordered w-full bg-white dark:bg-gray-800 dark:text-white"
              placeholder="Description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label text-gray-700 dark:text-gray-200">
                Min Age
              </label>
              <input
                type="number"
                {...register("minAge", { required: true })}
                className="input input-bordered w-full bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="label text-gray-700 dark:text-gray-200">
                Max Age
              </label>
              <input
                type="number"
                {...register("maxAge", { required: true })}
                className="input input-bordered w-full bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="label text-gray-700 dark:text-gray-200">
              Coverage Range
            </label>
            <input
              {...register("coverageRange", { required: true })}
              className="input input-bordered w-full bg-white dark:bg-gray-800 dark:text-white"
              placeholder="e.g. ৳10,000 - ৳5,00,000"
            />
          </div>

          <div>
            <label className="label text-gray-700 dark:text-gray-200">
              Duration
            </label>
            <select
              {...register("duration", { required: true })}
              className="select select-bordered w-full bg-white dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select Duration</option>
              <option value="3 Years">3 Years</option>
              <option value="5 Years">5 Years</option>
              <option value="7 Years">7 Years</option>
              <option value="10 Years">10 Years</option>
            </select>
          </div>

          <div>
            <label className="label text-gray-700 dark:text-gray-200">
              Base Premium (৳)
            </label>
            <select
              {...register("basePremium", { required: true })}
              className="select select-bordered w-full bg-white dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select Base Premium</option>
              <option value="100000">100,000</option>
              <option value="500000">500,000</option>
              <option value="1000000">1,000,000</option>
            </select>
          </div>

          <div>
            <label className="label text-gray-700 dark:text-gray-200">
              Upload Image
            </label>
            <input
              type="file"
              {...register("image", { required: true })}
              accept="image/*"
              className="file-input file-input-bordered w-full bg-white dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="text-center mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Uploading..." : "➕ Submit Policy"}
            </button>
          </div>
        </form>

        {/* Image Preview */}
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
            {uploadedImageURL
              ? "✅ Uploaded Image Preview"
              : "🖼️ Local Image Preview"}
          </h3>
          <div className="w-full h-64 rounded-lg overflow-hidden border dark:border-gray-700 flex items-center justify-center">
            {localPreview || uploadedImageURL ? (
              <img
                src={uploadedImageURL || localPreview}
                alt="Preview"
                className="object-contain h-full w-full"
              />
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                No image selected
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPolicy;
