import React, { useState } from "react";
import {
  FaHome,
  FaUsers,
  FaMoneyBill,
  FaSignOutAlt,
  FaHistory,
  FaCalendarCheck,
} from "react-icons/fa";
import { Bell, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const managerName = localStorage.getItem("username") || "Manager";
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const recentRequests = [
    { id: 1, name: "Andi", type: "Leave", status: "Pending" },
    { id: 2, name: "Budi", type: "Reimbursement", status: "Approved" },
    { id: 3, name: "Cici", type: "Leave", status: "Rejected" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-300 p-6 flex flex-col justify-between">
        <div>
          <div className="text-center text-2xl font-bold mb-10">YukAbsen</div>
          <nav className="flex flex-col gap-6">
            <Link to="/manager/dashboard" className="flex items-center gap-3 text-sm font-semibold text-gray-700">
              <FaHome /> Dashboard
            </Link>
            <Link to="/manager/kelola-leave" className="flex items-center gap-3 text-sm font-semibold text-gray-700">
              <FaCalendarCheck /> Kelola Leave
            </Link>
            <Link to="/manager/kelola-Reimbursement" className="flex items-center gap-3 text-sm font-semibold text-gray-700">
              <FaMoneyBill /> Kelola Reimbursement
            </Link>
            <Link to="/manager/riwayat-absen" className="flex items-center gap-3 text-sm font-semibold text-gray-700">
              <FaHistory /> Riwayat Absen
            </Link>
            <Link to="/manager/kelola-karyawan" className="flex items-center gap-3 text-sm font-semibold text-gray-700">
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
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h2>
            <h1 className="mt-2 text-2xl font-bold">Welcome, {managerName}</h1>
          </div>
          <div className="flex gap-4">
            <Bell className="w-6 h-6 text-gray-600" />
            <User className="w-6 h-6 text-gray-600" />
          </div>
        </div>

        {/* Statistic Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card title="Total Employees" value="120" color="gray" />
          <Card title="Present" value="95" color="green" />
          <Card title="On Leave" value="5" color="yellow" />
          <Card title="Absent" value="20" color="red" />
        </div>

        {/* Tables */}
        <div className="flex gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 w-1/2 overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Attendance Today</h3>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Check-in Time</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Location</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">John Doe</td>
                  <td className="p-2">8:46 AM</td>
                  <td className="p-2"><Badge color="green">Present</Badge></td>
                  <td className="p-2">-</td>
                </tr>
                <tr>
                  <td className="p-2">Jane Smith</td>
                  <td className="p-2">8:57 AM</td>
                  <td className="p-2"><Badge color="yellow">On Leave</Badge></td>
                  <td className="p-2">Jane</td>
                </tr>
                <tr>
                  <td className="p-2">Michael Brown</td>
                  <td className="p-2">9:06 AM</td>
                  <td className="p-2"><Badge color="green">Present</Badge></td>
                  <td className="p-2">Andove</td>
                </tr>
                <tr>
                  <td className="p-2">Emily Johnson</td>
                  <td className="p-2">No Entry</td>
                  <td className="p-2"><Badge color="red">Absent</Badge></td>
                  <td className="p-2">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl shadow p-6 w-1/2 overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Recent Requests</h3>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req) => (
                  <tr key={req.id}>
                    <td className="p-2">{req.name}</td>
                    <td className="p-2">{req.type}</td>
                    <td className="p-2">
                      <Badge
                        color={
                          req.status === "Pending"
                            ? "yellow"
                            : req.status === "Approved"
                            ? "green"
                            : "red"
                        }
                      >
                        {req.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calendar & Monthly Summary */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Calendar</h3>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="rounded-md"
            />
            <p className="mt-4 text-sm">Selected Date: {selectedDate.toDateString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Attendance Summary</h3>
            <p className="text-sm">Placeholder for upcoming chart or summary.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// Card component
function Card({ title, value, color }) {
  const colors = {
    gray: "bg-gray-200 text-gray-800",
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
  };
  return (
    <div className={`rounded-xl p-4 shadow text-center ${colors[color]}`}>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

// Badge component
function Badge({ color, children }) {
  const styles = {
    green: "bg-green-500 text-white",
    yellow: "bg-yellow-500 text-white",
    red: "bg-red-500 text-white",
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[color]}`}
    >
      {children}
    </span>
  );
}
