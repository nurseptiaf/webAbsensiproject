import React, { useEffect, useState } from "react";
import { FaHome, FaCalendarCheck, FaClipboardList, FaMoneyBill, FaSignOutAlt } from "react-icons/fa";
import { Bell, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "Karyawan";

  const [attendanceStatus, setAttendanceStatus] = useState("not-checked-in");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAttendanceHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/attendance/records", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Gagal mengambil data absen");

        const data = await res.json();

        const today = new Date().toISOString().split("T")[0];
        const todayRecord = data.find((r) => r.date === today);

        if (!todayRecord) {
          setAttendanceStatus("not-checked-in");
        } else if (todayRecord.checkOutTime) {
          setAttendanceStatus("checked-out");
        } else if (todayRecord.checkInTime) {
          setAttendanceStatus("checked-in");
        } else {
          setAttendanceStatus("not-checked-in");
        }
        setMessage("");
      } catch (error) {
        setMessage(error.message || "Terjadi kesalahan saat mengambil data absen");
      }
      setLoading(false);
    };

    fetchAttendanceHistory();
  }, [token, navigate]);

  // ... lanjutkan dengan kode yang sudah ada (handleCheckIn, handleCheckOut, dll)

  const handleCheckIn = async () => {
    setLoading(true);
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
        setAttendanceStatus("checked-in");
      }
    } catch (error) {
      setMessage("Error saat check-in");
    }
    setLoading(false);
  };

  const handleCheckOut = async () => {
    setLoading(true);
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
        setAttendanceStatus("checked-out");
      }
    } catch (error) {
      setMessage("Error saat check-out");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const formattedDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-blue-300 p-6 flex flex-col justify-between">
        <div>
          <div className="text-center text-2xl font-bold mb-10">YukAbsen</div>
          <nav className="flex flex-col gap-6">
            <Link to="/dashboard" className="flex items-center gap-3 text-sm font-semibold text-gray-700">
              <FaHome /> Dashboard
            </Link>
            <Link to="/attendance" className="flex items-center gap-3 text-sm font-semibold text-gray-700">
              <FaCalendarCheck /> Attendance
            </Link>
            <Link to="/leave" className="flex items-center gap-3 text-sm font-semibold text-gray-700">
              <FaClipboardList /> Leave Of Absence
            </Link>
            <Link to="/reimbursement" className="flex items-center gap-3 text-sm font-semibold text-gray-700">
              <FaMoneyBill /> Reimbursement
            </Link>
          </nav>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3 text-sm font-semibold text-gray-700 hover:text-red-600">
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold">{formattedDate}</h2>
            <h1 className="mt-2 text-2xl font-bold">Welcome, {username}</h1>
          </div>
          <div className="flex gap-4">
            <Bell className="w-6 h-6 text-gray-600" />
            <User className="w-6 h-6 text-gray-600" />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 w-full">
          <h3 className="text-sm font-semibold text-gray-600">Status Attendance</h3>
          {loading ? (
            <div className="mt-3 h-10 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-700">Loading...</span>
            </div>
          ) : (
            <div className="mt-3 bg-gray-200 rounded-full h-10 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-700">
                {attendanceStatus === "checked-in"
                  ? "Checked In"
                  : attendanceStatus === "checked-out"
                  ? "Checked Out"
                  : "Not Checked In"}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            disabled={attendanceStatus === "checked-in" || attendanceStatus === "checked-out" || loading}
            onClick={handleCheckIn}
            className={`w-full rounded-xl p-6 shadow-md text-xl font-semibold ${
              attendanceStatus === "checked-in" || attendanceStatus === "checked-out"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-200"
            }`}
          >
            Check In
          </button>
          <button
            disabled={attendanceStatus !== "checked-in" || loading}
            onClick={handleCheckOut}
            className={`w-full rounded-xl p-6 shadow-md text-xl font-semibold ${
              attendanceStatus !== "checked-in"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-200"
            }`}
          >
            Check Out
          </button>
        </div>

        {message && <div className="mt-6 p-4 bg-red-200 text-red-700 rounded">{message}</div>}

        <h3 className="mt-8 text-lg font-bold">Notifications</h3>
      </main>
    </div>
  );
}
