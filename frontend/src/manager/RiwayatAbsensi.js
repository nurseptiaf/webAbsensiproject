import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaHome,
  FaCalendarCheck,
  FaMoneyBill,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function RiwayatAbsensi() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/attendance/all",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Gagal mengambil data absensi:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    alert("Logout berhasil!");
  };

  const filteredHistory = history.filter((record) => {
    const nameMatch =
      record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const dateMatch = filterDate ? record.date === filterDate : true;
    return nameMatch && dateMatch;
  });

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

      {/* Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Riwayat Absensi Karyawan</h1>

        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Cari nama..."
            className="border p-2 rounded w-full sm:w-60"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 rounded w-full sm:w-60"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="text-left border-b">
                <th className="p-3">Nama</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Check-in</th>
                <th className="p-3">Check-out</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((record, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{record.name}</td>
                  <td className="p-3">{record.date}</td>
                  <td className="p-3">{record.checkInTime || "-"}</td>
                  <td className="p-3">{record.checkOutTime || "-"}</td>
                  <td className="p-3">{record.status}</td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
