import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaCalendarCheck,
  FaClipboardList,
  FaMoneyBill,
  FaSignOutAlt,
} from "react-icons/fa";
import { User } from "lucide-react";
import SuccessModal from "./SuccessModal";
import { Link } from "react-router-dom";

export default function Attendance() {
  const token = localStorage.getItem("token");
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [status, setStatus] = useState("Belum Absen");
  const [message, setMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successDate, setSuccessDate] = useState("");
  const [successTime, setSuccessTime] = useState("");

  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      if (!token) {
        setMessage("Token tidak ditemukan, silakan login");
        return;
      }
      try {
        const res = await fetch(
          "http://localhost:8000/api/attendance/records",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Gagal mengambil data absen");
        const data = await res.json();
        setAttendanceHistory(data);

        const today = new Date().toISOString().split("T")[0];
        const todayRecord = data.find((r) => r.date === today);

        if (!todayRecord) {
          setStatus("Belum Absen");
        } else if (todayRecord.checkOutTime) {
          setStatus("Checked Out");
        } else if (todayRecord.checkInTime) {
          setStatus("Checked In");
        }
      } catch (error) {
        setMessage(error.message);
      }
    };

    fetchAttendanceHistory();
  }, [token]);

  const handleCheckIn = async () => {
    setMessage("");
    try {
      const res = await fetch("http://localhost:8000/api/attendance/checkin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Gagal check-in");
      } else {
        setMessage("Check-in berhasil");
        setStatus("Checked In");
        setAttendanceHistory((prev) => [data.attendance, ...prev]);

        const checkInTime = new Date(data.attendance.checkInTime);
        setSuccessDate(
          checkInTime.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        );
        setSuccessTime(
          checkInTime.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setShowSuccessModal(true);
      }
    } catch (error) {
      setMessage("Error saat check-in");
    }
  };

  const handleCheckOut = async () => {
    setMessage("");
    try {
      const res = await fetch("http://localhost:8000/api/attendance/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Gagal check-out");
      } else {
        setMessage("Check-out berhasil");
        setStatus("Checked Out");
        setAttendanceHistory((prev) =>
          prev.map((record) =>
            record.date === data.attendance.date ? data.attendance : record
          )
        );
      }
    } catch (error) {
      setMessage("Error saat check-out");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-blue-300 p-6 flex flex-col justify-between">
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
              <FaClipboardList /> Leave Of Absense
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

      <main className="flex-1 p-10 overflow-auto">
        <div className="flex justify-between items-start">
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">Attendance</h2>
            <h3 className="text-md font-semibold">
              {new Date().toLocaleDateString()}
            </h3>

            <div className="mt-6 flex gap-6">
              <button
                onClick={handleCheckIn}
                disabled={status === "Checked In" || status === "Checked Out"}
                className="flex-1 bg-gray-300 rounded-xl p-6 shadow-md text-xl font-semibold flex justify-between items-center disabled:opacity-50"
              >
                Check In <span className="text-gray-500 text-sm">⤴</span>
              </button>
              <button
                onClick={handleCheckOut}
                disabled={status !== "Checked In"}
                className="flex-1 bg-gray-300 rounded-xl p-6 shadow-md text-xl font-semibold flex justify-between items-center disabled:opacity-50"
              >
                Check Out <span className="text-gray-500 text-sm">⤴</span>
              </button>
            </div>

            <h3 className="mt-8 text-lg font-bold">Status Absen: {status}</h3>

            {message && (
              <p className="mt-4 text-red-600 font-semibold">{message}</p>
            )}

            <h3 className="mt-6 text-lg font-bold">History Absense</h3>
            <ul className="mt-3 space-y-2">
              {attendanceHistory.length === 0 && (
                <li className="bg-white p-4 rounded shadow text-gray-500">
                  Belum ada data absensi.
                </li>
              )}
              {attendanceHistory.map((entry, idx) => (
                <li key={idx} className="bg-white p-4 rounded shadow">
                  <div>
                    <strong>Tanggal:</strong> {entry.date}
                  </div>
                  <div>
                    <strong>Check In:</strong>{" "}
                    {formatDateTime(entry.checkInTime)}
                  </div>
                  <div>
                    <strong>Check Out:</strong>{" "}
                    {formatDateTime(entry.checkOutTime)}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            <Link to="/profile">
              <User className="w-6 h-6 text-gray-600 hover:text-blue-500 cursor-pointer" />
            </Link>
          </div>
        </div>

        {/* Modal ditampilkan di luar tombol */}
        {showSuccessModal && (
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            date={successDate}
            time={successTime}
          />
        )}
      </main>
    </div>
  );
}
