import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import axios from "axios";

const ManageTransactions = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const idToken = await user.getIdToken();
      const res = await axios.get("http://localhost:5000/payments", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      setPayments(res.data);
      setLoading(false);
    };
    fetchPayments();
  }, []);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Transactions</h2>
      {payments.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="table-auto border w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Transaction ID</th>
              <th className="border px-4 py-2">Paid At</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td className="border px-4 py-2">{p.email}</td>
                <td className="border px-4 py-2">${p.amount}</td>
                <td className="border px-4 py-2">{p.transactionId}</td>
                <td className="border px-4 py-2">
                  {new Date(p.paid_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageTransactions;
