"use client";

import { useEffect, useState } from "react";

interface ClerkUser {
  id: string;
  email_addresses: { email_address: string }[];
}

export default function AdminPanel() {
  const [users, setUsers] = useState<ClerkUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [subStatus, setSubStatus] = useState<boolean | null>(null);

  // Fetch Clerk users
  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  // Fetch subscription status
  const fetchSubscriptionStatus = async () => {
    const res = await fetch("/api/admin/check-subscription");
    const data = await res.json();
    setSubStatus(data.active);
  };

  // Cancel subscription
  const cancelSub = async () => {
    await fetch("/api/admin/cancel-subscription", { method: "POST" });
    fetchSubscriptionStatus();
  };

  // Activate subscription
  const activateSub = async () => {
    await fetch("/api/admin/activate-subscription", { method: "POST" });
    fetchSubscriptionStatus();
  };

  useEffect(() => {
    fetchUsers();
    fetchSubscriptionStatus();
  }, []);

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* Subscription Controls */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <p className="mb-2 font-semibold">
          Subscription Status:{" "}
          <span className={subStatus ? "text-green-600" : "text-red-600"}>
            {subStatus ? "Active" : "Inactive"}
          </span>
        </p>
        <div className="space-x-2">
          <button
            onClick={activateSub}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Activate
          </button>
          <button
            onClick={cancelSub}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Users Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">User ID</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border border-gray-300 px-4 py-2">{u.id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {u.email_addresses[0]?.email_address}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
