import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const MyApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail("");
        setApplications([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!userEmail) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/applications?email=${userEmail}`
        );
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [userEmail]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("❗Are you sure you want to delete?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/applications/${id}`);
      setApplications(applications.filter((app) => app._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handlePay = (id) => {
    alert("💳 Payment clicked for application ID: " + id);
    // এখানে পরে Stripe integration বা অন্য logic দিতে পারো
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        Loading applications...
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center  mb-6 dark:text-gray-900">
        My Applications
      </h2>

      {applications.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 text-lg mt-10">
          😕 No applications found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border rounded shadow">
            <thead className="bg-gray-100 dark:bg-gray-700 text-left">
              <tr className="text-gray-700 dark:text-gray-300">
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(({ _id, name, email, status }) => (
                <tr
                  key={_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4 border-b dark:text-white">{name}</td>
                  <td className="py-3 px-4 border-b dark:text-white">
                    {email}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : status === "Rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {status || "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b space-x-2">
                    <button
                      onClick={() =>
                        alert(
                          `📄 Application Details:\n\nName: ${name}\nEmail: ${email}\nStatus: ${
                            status || "Pending"
                          }`
                        )
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handlePay(_id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Pay
                    </button>
                    <button
                      onClick={() => handleDelete(_id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyApplication;
