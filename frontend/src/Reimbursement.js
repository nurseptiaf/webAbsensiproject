import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaHome,
  FaCalendarCheck,
  FaClipboardList,
  FaMoneyBill,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Reimbursement() {
  const [reimbursements, setReimbursements] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReimbursements = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/reimbursement/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReimbursements(response.data);
      } catch (error) {
        console.error("Error fetching reimbursements:", error);
      }
    };
    fetchReimbursements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("reason", description);
      if (file) formData.append("file", file);

      await axios.post(
        "http://localhost:8000/api/reimbursement/apply",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAmount("");
      setDescription("");
      setFile(null);
      alert("Reimbursement berhasil diajukan");
      window.location.reload();
    } catch (error) {
      console.error("Error applying reimbursement:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-300 p-6 min-h-screen sticky top-0 flex flex-col justify-between">
        <div>
          <div className="text-center text-2xl font-bold mb-10">
            <span className="bg-gradient-to-r from-blue-100 to-yellow-200 bg-clip-text text-transparent">
              YukAbsen
            </span>
          </div>

          <nav className="flex flex-col gap-6">
            <a
              href="/dashboard"
              className="flex items-center gap-3 text-sm font-semibold text-gray-700"
            >
              <FaHome /> Dashboard
            </a>
            <a
              href="/attendance"
              className="flex items-center gap-3 text-sm font-semibold text-gray-700"
            >
              <FaCalendarCheck /> Attendance
            </a>
            <a
              href="/leave"
              className="flex items-center gap-3 text-sm font-semibold text-gray-700"
            >
              <FaClipboardList /> Leave Of Absence
            </a>
            <a
              href="/reimbursement"
              className="flex items-center gap-3 text-sm font-semibold text-gray-700"
            >
              <FaMoneyBill /> Reimbursement
            </a>
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
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="w-full max-w-3xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Reimbursement</h1>
            </div>

            <form
              className="bg-white p-6 rounded-lg shadow mb-8"
              onSubmit={handleSubmit}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Rp"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dokumen Pendukung
                </label>
                <input
                  type="file"
                  className="w-full"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Ajukan Reimbursement
              </button>
            </form>

            <h2 className="text-xl font-semibold mb-4">Riwayat Pengajuan</h2>
            <div className="space-y-4">
              {reimbursements.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold text-gray-800">
                      Rp {item.amount.toLocaleString()}
                    </div>
                    <div className="text-gray-600 text-sm">{item.reason}</div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                      item.status === "pending"
                        ? "bg-yellow-500"
                        : item.status === "approved"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
