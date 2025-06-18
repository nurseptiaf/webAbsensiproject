import React, { useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaHistory,
  FaHome,
  FaMoneyBill,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function KelolaLeave() {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    const filtered =
      statusFilter === "all"
        ? leaves
        : leaves.filter((leave) => leave.status === statusFilter);
    setFilteredLeaves(filtered);
  }, [statusFilter, leaves]);

  const fetchLeaves = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/leave/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setLeaves(data);
    } catch (err) {
      console.error("Gagal mengambil data cuti:", err);
    }
  };

  const updateStatusLocal = (id, newStatus) => {
    setLeaves((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const approveLeave = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/leave/approve/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        updateStatusLocal(id, "approved");
        closeModal();
      } else {
        console.error("Gagal menyetujui cuti");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const rejectLeave = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/leave/reject/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        updateStatusLocal(id, "rejected");
        closeModal();
      } else {
        console.error("Gagal menolak cuti");
      }
    } catch (err) {
      console.error(err);
    }
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const openModal = (leave) => {
    setSelectedLeave(leave);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLeave(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-300 p-6 flex flex-col justify-between">
        <div>
          <div className="text-center text-2xl font-bold mb-10">
            <span className="bg-gradient-to-r from-blue-100 to-yellow-200 bg-clip-text text-transparent">
              YukAbsen
            </span>
          </div>
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
      <div className="p-6 flex-1">
        <h1 className="text-2xl font-bold mb-6">Kelola Leave</h1>

        <div className="mb-4">
          <label className="text-sm font-medium">Filter Status: </label>
          <select
            className="ml-2 px-3 py-1 border rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Semua</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="text-left border-b">
                <th className="p-3">Nama Karyawan</th>
                <th className="p-3">Alasan</th>
                <th className="p-3">Tanggal Mulai</th>
                <th className="p-3">Tanggal Selesai</th>
                <th className="p-3">Status</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave) => (
                <tr key={leave._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{leave.employeeId?.name || "Unknown"}</td>
                  <td className="p-3">{leave.reason}</td>
                  <td className="p-3">{leave.startDate?.slice(0, 10)}</td>
                  <td className="p-3">{leave.endDate?.slice(0, 10)}</td>
                  <td className="p-3">
                    <Badge status={leave.status} />
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => openModal(leave)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeaves.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    Tidak ada data cuti.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedLeave && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Detail Cuti</h2>
            <p>
              <strong>Nama:</strong> {selectedLeave.employeeId?.name}
            </p>
            <p>
              <strong>Alasan:</strong> {selectedLeave.reason}
            </p>
            <p>
              <strong>Tanggal Mulai:</strong>{" "}
              {selectedLeave.startDate?.slice(0, 10)}
            </p>
            <p>
              <strong>Tanggal Selesai:</strong>{" "}
              {selectedLeave.endDate?.slice(0, 10)}
            </p>
            <p>
              <strong>Status:</strong> <Badge status={selectedLeave.status} />
            </p>
            <div className="flex justify-end gap-3 mt-4">
              {selectedLeave.status === "pending" && (
                <>
                  <button
                    onClick={() => approveLeave(selectedLeave._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectLeave(selectedLeave._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={closeModal}
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
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
