import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaCalendarCheck,
  FaClipboardList,
  FaMoneyBill,
  FaSignOutAlt,
} from "react-icons/fa";
import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "Karyawan";

  const [attendanceStatus, setAttendanceStatus] = useState("not-checked-in");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [reimburseHistory, setReimburseHistory] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAttendanceStatus = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "http://localhost:8000/api/attendance/records",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
      } catch (error) {
        setMessage(
          error.message || "Terjadi kesalahan saat mengambil data absen"
        );
      }
      setLoading(false);
    };

    const fetchNotifications = async () => {
      try {
        const [attendanceRes, leaveRes, reimburseRes] = await Promise.all([
          fetch("http://localhost:8000/api/attendance/records", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/api/leave/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/api/reimbursement/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const attendanceData = await attendanceRes.json();
        const leaveData = await leaveRes.json();
        const reimburseData = await reimburseRes.json();

        setAttendanceHistory(attendanceData.reverse().slice(0, 3));
        setLeaveHistory(leaveData.reverse().slice(0, 3));
        setReimburseHistory(reimburseData.reverse().slice(0, 3));
      } catch (error) {
        console.error("Gagal mengambil notifikasi:", error);
      }
    };

    fetchAttendanceStatus();
    fetchNotifications();
  }, [token, navigate]);

  const handleCheckIn = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:8000/api/attendance/checkin", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
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

      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold">{formattedDate}</h2>
            <h1 className="mt-2 text-2xl font-bold">Welcome, {username}</h1>
          </div>
          <div className="flex gap-4">
            <Link to="/profile">
              <User className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 w-full">
          <h3 className="text-sm font-semibold text-gray-600">
            Status Attendance
          </h3>
          {loading ? (
            <div className="mt-3 h-10 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-700">
                Loading...
              </span>
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
            disabled={
              attendanceStatus === "checked-in" ||
              attendanceStatus === "checked-out" ||
              loading
            }
            onClick={handleCheckIn}
            className={`w-full rounded-xl p-6 shadow-md text-xl font-semibold ${
              attendanceStatus === "checked-in" ||
              attendanceStatus === "checked-out"
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

        {message && (
          <div className="mt-6 p-4 bg-red-200 text-red-700 rounded">
            {message}
          </div>
        )}

        <h3 className="mt-10 text-xl font-bold text-gray-800">
          📢 Notifications
        </h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Attendance Card */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <h4 className="text-md font-semibold text-blue-600 mb-2 flex items-center">
              <FaCalendarCheck className="mr-2" /> Absensi Terbaru
            </h4>
            <ul className="space-y-2 text-sm">
              {attendanceHistory.length === 0 ? (
                <li className="text-gray-500 italic">Belum ada data absensi</li>
              ) : (
                attendanceHistory.map((a, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{a.date}</p>
                      <p className="text-xs text-gray-600">
                        {a.checkInTime
                          ? `Check-in: ${new Date(
                              a.checkInTime
                            ).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : "Belum Check-in"}
                        {" | "}
                        {a.checkOutTime
                          ? `Check-out: ${new Date(
                              a.checkOutTime
                            ).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : "Sedang Check-in"}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      Absensi
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Leave Card */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <h4 className="text-md font-semibold text-green-600 mb-2 flex items-center">
              <FaClipboardList className="mr-2" /> Cuti Terakhir
            </h4>
            <ul className="space-y-2 text-sm">
              {leaveHistory.length === 0 ? (
                <li className="text-gray-500 italic">Belum ada data cuti</li>
              ) : (
                leaveHistory.map((l, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded-md"
                  >
                    <div>
                      <p className="font-medium">
                        {new Date(l.startDate).toLocaleDateString("id-ID")} -{" "}
                        {new Date(l.endDate).toLocaleDateString("id-ID")}
                      </p>
                      <p className="text-xs text-gray-600">{l.reason}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        l.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : l.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {l.status}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Reimbursement Card */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <h4 className="text-md font-semibold text-purple-600 mb-2 flex items-center">
              <FaMoneyBill className="mr-2" /> Reimburse Terakhir
            </h4>
            <ul className="space-y-2 text-sm">
              {reimburseHistory.length === 0 ? (
                <li className="text-gray-500 italic">
                  Belum ada data reimburse
                </li>
              ) : (
                reimburseHistory.map((r, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-2 rounded-md"
                  >
                    <div>
                      <p className="font-medium">
                        Rp{r.amount.toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs text-gray-600">{r.reason}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        r.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : r.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
