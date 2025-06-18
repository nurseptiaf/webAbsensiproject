import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCalendarCheck,
  FaClipboardList,
  FaMoneyBill,
  FaSignOutAlt,
} from "react-icons/fa";

export default function LeaveOfAbsence() {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const fetchLeaves = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/leave/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLeaves(response.data);
    } catch (error) {
      console.error("Gagal mengambil data cuti", error);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/leave/apply", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFormData({ startDate: "", endDate: "", reason: "" });
      fetchLeaves();
    } catch (error) {
      console.error("Terjadi kesalahan saat mengirim data.", error);
      alert("Terjadi kesalahan saat mengirim data.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatDate = (dateStr) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("id-ID", options);
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
              to="/dashboard"
              className="flex items-center gap-3 text-sm font-semibold text-gray-700"
            >
              <FaHome /> Dashboard
            </Link>
            <Link
              to="/attendance"
              className="flex items-center gap-3 text-sm font-semibold text-gray-700"
            >
              <FaCalendarCheck /> Attendance
            </Link>
            <Link
              to="/leave"
              className="flex items-center gap-3 text-sm font-semibold text-gray-700"
            >
              <FaClipboardList /> Leave Of Absence
            </Link>
            <Link
              to="/reimbursement"
              className="flex items-center gap-3 text-sm font-semibold text-gray-700"
            >
              <FaMoneyBill /> Reimbursement
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
      <main className="flex-1 p-8 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Leave of Absence</h1>

        {/* Form Pengajuan */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow mb-8 max-w-3xl"
        >
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Selesai
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="mb-4 max-w-3xl">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alasan
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows="3"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Ajukan Cuti
          </button>
        </form>

        {/* Riwayat Pengajuan Cuti dalam Tabel */}
        <section className="flex-1 overflow-auto bg-white p-6 rounded-lg shadow max-w-full">
          <h2 className="text-xl font-semibold mb-4">Riwayat Pengajuan Cuti</h2>
          <table className="min-w-full border border-gray-300 table-auto">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-4 py-2">Alasan</th>
                <th className="border px-4 py-2">Tanggal Mulai</th>
                <th className="border px-4 py-2">Tanggal Selesai</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    Tidak ada data cuti.
                  </td>
                </tr>
              )}
              {leaves.map((leave, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 even:bg-gray-50 odd:bg-white"
                >
                  <td className="border px-4 py-2">{leave.reason}</td>
                  <td className="border px-4 py-2">{formatDate(leave.startDate)}</td>
                  <td className="border px-4 py-2">{formatDate(leave.endDate)}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white font-semibold text-sm ${
                        leave.status === "pending"
                          ? "bg-yellow-500"
                          : leave.status === "approved"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
