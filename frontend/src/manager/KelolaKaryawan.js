import React, { useState, useEffect, useCallback } from "react";

import {
  FaUsers,
  FaEdit,
  FaTrash,
  FaHome,
  FaCalendarCheck,
  FaMoneyBill,
  FaHistory,
  FaSignOutAlt,
  FaPlus,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function KelolaKaryawan() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("");

  const token = localStorage.getItem("token");

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setEmployees(data);
      } else {
        console.error("Gagal mengambil data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);


  const handleAdd = () => {
    setEditData({
      username: "",
      name: "",
      position: "",
      email: "",
      password: "",
    });
    setIsAdding(true);
    setShowModal(true);
  };

  const handleEdit = (emp) => {
    setEditData(emp);
    setIsAdding(false);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data karyawan ini?")) return;
    try {
      await fetch(`http://localhost:8000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSave = async () => {
    const method = isAdding ? "POST" : "PUT";
    const url = isAdding
      ? "http://localhost:8000/api/users"
      : `http://localhost:8000/api/users/${editData._id}`;

    if (
      !editData.username ||
      !editData.name ||
      !editData.position ||
      !editData.email
    ) {
      alert("Semua field harus diisi!");
      return;
    }

    const body = isAdding
      ? {
          username: editData.username,
          name: editData.name,
          email: editData.email,
          position: editData.position,
          password: editData.password || "default123",
          role: "karyawan",
        }
      : {
          name: editData.name,
          email: editData.email,
          position: editData.position,
        };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.message || "Gagal menyimpan data");
        return;
      }

      setShowModal(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logout berhasil!");
    window.location.href = "/";
  };

  const filteredEmployees = employees.filter((emp) => {
    const nameMatch = emp.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const positionMatch = filterPosition
      ? emp.position === filterPosition
      : true;
    return nameMatch && positionMatch;
  });

  const uniquePositions = [...new Set(employees.map((emp) => emp.position))];

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

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Kelola Data Karyawan</h1>

        <div className="mb-4 flex flex-wrap items-center gap-4">
          <button
            onClick={handleAdd}
            className="bg-yellow-300 text-white px-4 py-2 rounded hover:bg-yellow-700 flex items-center gap-2"
          >
            <FaPlus /> Tambah Karyawan
          </button>

          <input
            type="text"
            placeholder="Cari nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-64"
          />

          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Semua Posisi</option>
            {uniquePositions.map((pos, idx) => (
              <option key={idx} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="text-left border-b">
                <th className="p-3">Nama</th>
                <th className="p-3">Posisi</th>
                <th className="p-3">Email</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{emp.name}</td>
                  <td className="p-3">{emp.position}</td>
                  <td className="p-3">{emp.email}</td>
                  <td className="p-3 flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && editData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">
                {isAdding ? "Tambah Karyawan" : "Edit Data Karyawan"}
              </h2>
              <div className="space-y-3">
                {isAdding && (
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) =>
                      setEditData({ ...editData, username: e.target.value })
                    }
                    placeholder="Username"
                    className="w-full border p-2 rounded"
                  />
                )}
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  placeholder="Nama"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  value={editData.position}
                  onChange={(e) =>
                    setEditData({ ...editData, position: e.target.value })
                  }
                  placeholder="Posisi"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  placeholder="Email"
                  className="w-full border p-2 rounded"
                />
                {isAdding && (
                  <input
                    type="password"
                    value={editData.password}
                    onChange={(e) =>
                      setEditData({ ...editData, password: e.target.value })
                    }
                    placeholder="Password"
                    className="w-full border p-2 rounded"
                  />
                )}
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
