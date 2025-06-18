import React, { useEffect, useState } from 'react';
import { Mail, Pencil, ArrowLeft, Lock } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [profile, setProfile] = useState({ username: "", name: "", email: "", position: "", role: "" });
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal mengambil profil");
      const data = await res.json();
      setProfile(data);
      setFormData({ name: data.name, email: data.email });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal update profil");

      setEditOpen(false);
      fetchProfile();
    } catch (error) {
      console.error("Gagal update profil:", error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/users/me/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      if (!res.ok) throw new Error("Gagal ganti password");

      setPasswordOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '' });
      alert("Password berhasil diganti");
    } catch (error) {
      console.error("Gagal ganti password:", error);
      alert("Gagal ganti password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-white to-blue-100">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard" className="text-blue-700 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex gap-6">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-500">
            {profile.name?.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-blue-500">{profile.name}</h1>
            <p className="text-gray-500">{profile.role}</p>
            <div className="mt-2 flex items-center text-gray-700 gap-2">
              <Mail className="w-4 h-4" />
              <span>{profile.email}</span>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setEditOpen(true)}
                className="border border-blue-500 text-blue-500 px-4 py-1 rounded-lg flex items-center gap-1 hover:bg-purple-50"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => setPasswordOpen(true)}
                className="border border-blue-500 text-blue-500 px-4 py-1 rounded-lg flex items-center gap-1 hover:bg-purple-50"
              >
                <Lock className="w-4 h-4" /> Ganti Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit Profil */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} className="fixed z-50 inset-0">
        <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30">
          <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-bold mb-4">Edit Profil</Dialog.Title>
            <label className="block mb-2">
              Nama:
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border p-2 rounded mt-1"
              />
            </label>
            <label className="block mb-4">
              Email:
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border p-2 rounded mt-1"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditOpen(false)} className="px-3 py-1 text-gray-600 hover:underline">
                Batal
              </button>
              <button onClick={handleUpdate} className="bg-blue-700 text-white px-4 py-1 rounded-lg">
                Simpan
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal Ganti Password */}
      <Dialog open={passwordOpen} onClose={() => setPasswordOpen(false)} className="fixed z-50 inset-0">
        <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30">
          <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-bold mb-4">Ganti Password</Dialog.Title>
            <label className="block mb-2">
              Password Lama:
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full border p-2 rounded mt-1"
              />
            </label>
            <label className="block mb-4">
              Password Baru:
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full border p-2 rounded mt-1"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button onClick={() => setPasswordOpen(false)} className="px-3 py-1 text-gray-600 hover:underline">
                Batal
              </button>
              <button onClick={handlePasswordChange} className="bg-blue-700 text-white px-4 py-1 rounded-lg">
                Ganti
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
