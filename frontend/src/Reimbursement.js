import React, { useState } from "react";
import { FaHome, FaCalendarCheck, FaClipboardList, FaMoneyBill } from "react-icons/fa";
import { Bell, User } from "lucide-react";

export default function Reimbursement() {
  const [reimbursements, setReimbursements] = useState([
    { date: "2025-05-01", amount: "Rp 250.000", description: "Transportasi ke luar kota", status: "pending" },
    { date: "2025-04-15", amount: "Rp 100.000", description: "Beli alat tulis", status: "approved" },
    { date: "2025-03-20", amount: "Rp 300.000", description: "Biaya makan client meeting", status: "rejected" },
  ]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-300 p-6">
        <div className="text-center text-2xl font-bold mb-10">YukAbsen</div>
        <nav className="flex flex-col gap-6">
          <a href="/dashboard" className="flex items-center gap-3 text-sm font-semibold text-gray-700">
            <FaHome /> Dashboard
          </a>
          <a href="/attendance" className="flex items-center gap-3 text-sm font-semibold text-gray-700">
            <FaCalendarCheck /> Attendance
          </a>
          <a href="/leave" className="flex items-center gap-3 text-sm font-semibold text-gray-700">
            <FaClipboardList /> Leave Of Absence
          </a>
          <a href="/reimbursement" className="flex items-center gap-3 text-sm font-semibold text-gray-700">
            <FaMoneyBill /> Reimbursement
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-start">
          <div className="w-full max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Reimbursement</h1>
            <form className="bg-white p-6 rounded-lg shadow mb-8">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input type="date" className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                <input type="text" className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Rp" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea className="w-full border border-gray-300 rounded px-3 py-2" rows="3"></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dokumen Pendukung</label>
                <input type="file" className="w-full" accept="image/*" />
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Ajukan Reimbursement
              </button>
            </form>

            <h2 className="text-xl font-semibold mb-4">Riwayat Pengajuan</h2>
            <div className="space-y-4">
              {reimbursements.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-800">{item.date} - {item.amount}</div>
                    <div className="text-gray-600 text-sm">{item.description}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                    item.status === "pending"
                      ? "bg-yellow-500"
                      : item.status === "approved"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Icons */}
          <div className="flex gap-4">
            <Bell className="w-6 h-6 text-gray-600" />
            <User className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </main>
    </div>
  );
}
