import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  Users,
  FileText,
  ShieldCheck,
  UserCheck,
  Hourglass,
  CheckCircle,
  CreditCard,
} from "lucide-react";

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching admin stats...");
        const res = await axiosSecure.get("/admin-stats");
        console.log("Admin stats response:", res.data);
        setStats(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setError("Failed to load dashboard data: " + error.message);
        setLoading(false);
      }
    };
    fetchStats();
  }, [axiosSecure]);

  if (loading) {
    return (
      <div className="text-center py-10 animate-pulse">
        📊 Loading dashboard data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      color: "bg-blue-500",
      icon: <Users size={28} />,
    },
    {
      title: "Total Policies",
      value: stats.totalPolicies || 0,
      color: "bg-green-500",
      icon: <ShieldCheck size={28} />,
    },
    {
      title: "Total Applications",
      value: stats.totalApplications || 0,
      color: "bg-yellow-500",
      icon: <FileText size={28} />,
    },
    {
      title: "Total Agents",
      value: stats.totalAgents || 0,
      color: "bg-purple-500",
      icon: <UserCheck size={28} />,
    },
    {
      title: "Pending Applications",
      value: stats.pendingApplications || 0,
      color: "bg-pink-500",
      icon: <Hourglass size={28} />,
    },
    {
      title: "Total Payments",
      value: stats.totalPayments || 0,
      color: "bg-orange-500",
      icon: <CreditCard size={28} />,
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
         Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} text-white p-6 rounded-2xl shadow-lg hover:scale-105 transform transition duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold opacity-90">
                  {card.title}
                </h3>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;