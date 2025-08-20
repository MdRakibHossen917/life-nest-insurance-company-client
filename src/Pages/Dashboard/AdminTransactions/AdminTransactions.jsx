import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { format } from "date-fns";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminTransactions = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    user: "",
    policy: "",
  });
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosSecure.get("/payments/all");
        setPayments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <p>Loading all transactions...</p>;

  // Filter payments
  const filteredPayments = payments.filter((p) => {
    const paidAt = new Date(p.paid_at);
    const from = filters.from ? new Date(filters.from) : null;
    const to = filters.to ? new Date(filters.to) : null;
    if (from && paidAt < from) return false;
    if (to && paidAt > to) return false;
    if (filters.user && !p.email.includes(filters.user)) return false;
    if (filters.policy && !p.policyName.includes(filters.policy)) return false;
    return true;
  });

  // Total income
  const totalIncome = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  // Chart Data
  const chartData = {
    labels: filteredPayments.map((p) =>
      format(new Date(p.paid_at), "MM/dd/yyyy")
    ),
    datasets: [
      {
        label: "Income ($)",
        data: filteredPayments.map((p) => p.amount),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <div className="p-6 text-gray-800">
      <h2 className="text-2xl font-bold mb-4">
        All Stripe Transactions (Admin)
      </h2>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <input
          type="date"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <input
          type="date"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="User Email"
          value={filters.user}
          onChange={(e) => setFilters({ ...filters, user: e.target.value })}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Policy Name"
          value={filters.policy}
          onChange={(e) => setFilters({ ...filters, policy: e.target.value })}
          className="border px-2 py-1 rounded"
        />
      </div>

      <p className="mb-4 font-bold">Total Income: ${totalIncome.toFixed(2)}</p>

      {/* Chart */}
      <div className="mb-6">
        <Chart type="bar" data={chartData} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Transaction ID</th>
              <th className="border px-4 py-2">Customer Email</th>
              <th className="border px-4 py-2">Policy Name</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => (
              <tr key={p._id}>
                <td className="border px-4 py-2">{p.transactionId}</td>
                <td className="border px-4 py-2">{p.email}</td>
                <td className="border px-4 py-2">{p.policyName}</td>
                <td className="border px-4 py-2">${p.amount}</td>
                <td className="border px-4 py-2">
                  {new Date(p.paid_at).toLocaleString()}
                </td>
                <td className="border px-4 py-2">Success</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransactions;
