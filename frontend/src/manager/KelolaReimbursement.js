import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaMoneyBill,
  FaCalendarCheck,
  FaHistory,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function KelolaReimbursement() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchReimbursements = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/reimbursement/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching reimbursements:", error);
    }
  };

  useEffect(() => {
    fetchReimbursements();
  }, []);

  useEffect(() => {
    const filtered =
      statusFilter === "all"
        ? requests
        : requests.filter((r) => r.status === statusFilter);
    setFilteredRequests(filtered);
  }, [statusFilter, requests]);

  const updateStatusLocal = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((req) => (req._id === id ? { ...req, status: newStatus } : req))
    );
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const endpoint =
        newStatus === "approve"
          ? `http://localhost:8000/api/reimbursement/approve/${id}`
          : `http://localhost:8000/api/reimbursement/reject/${id}`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        updateStatusLocal(
          id,
          newStatus === "approve" ? "approved" : "rejected"
        );
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleView = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const Badge = ({ status }) => {
    const colorMap = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 text-xs rounded-full font-semibold ${colorMap[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-300 p-6 flex flex-col justify-between">
        <div>
          <div className="text-center text-2xl font-bold mb-10">YukAbsen</div>
          <nav className="flex flex-col gap-6">
            <Link
              to="/manager/managerdashboard"
              className="flex items-center gap-3 text-sm font-semibold text-gray-700"
            >
              <FaHome /> Dashboard
            </Link>
            <Link
              to="/manager/kelola-leave"
              className="flex items-center gap-3 text-sm font-semibold text-gray-700"
            >
              <FaCalendarCheck /> Kelola Leave
            </Link>
            <Link
              to="/manager/kelola-reimbursement"
              className="flex items-center gap-3 text-sm font-semibold text-gray-700"
            >
              <FaMoneyBill /> Kelola Reimbursement
            </Link>
            <Link
              to="/manager/riwayat-absen"
              className="flex items-center gap-3 text-sm font-semibold text-gray-700"
            >
              <FaHistory /> Riwayat Absen
            </Link>
            <Link
              to="/manager/kelola-karyawan"
              className="flex items-center gap-3 text-sm font-semibold text-gray-700"
            >
              <FaUsers /> Kelola Data Karyawan
            </Link>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-sm font-semibold text-gray-700 hover:text-red-600"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Kelola Reimbursement</h1>

        {/* Filter */}
        <div className="mb-4">
          <label className="text-sm font-medium">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="ml-2 px-3 py-1 border rounded"
          >
            <option value="all">Semua</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="text-left border-b">
                <th className="p-3">Nama Karyawan</th>
                <th className="p-3">Alasan</th>
                <th className="p-3">Jumlah</th>
                <th className="p-3">Status</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{req.employeeId?.name || "-"}</td>
                  <td className="p-3">{req.reason}</td>
                  <td className="p-3">Rp{req.amount?.toLocaleString()}</td>
                  <td className="p-3">
                    <Badge status={req.status} />
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleView(req)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    Tidak ada data reimbursement.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Detail Reimbursement</h2>
            <p>
              <strong>Nama:</strong> {selectedRequest.employeeId?.name}
            </p>
            <p>
              <strong>Alasan:</strong> {selectedRequest.reason}
            </p>
            <p>
              <strong>Jumlah:</strong> Rp
              {selectedRequest.amount?.toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> <Badge status={selectedRequest.status} />
            </p>

            {selectedRequest.status === "pending" && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => updateStatus(selectedRequest._id, "approve")}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(selectedRequest._id, "reject")}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
