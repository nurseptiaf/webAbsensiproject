import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('karyawan');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('http://localhost:8000/api/auth/register', {
        username,
        password,
        role,
      });

      setSuccess(res.data.message || 'Pendaftaran berhasil');
      setTimeout(() => navigate('/login'), 1500); // redirect ke login setelah sukses
    } catch (err) {
      console.error('Register error:', err.response?.data);
      setError(err.response?.data?.message || 'Pendaftaran gagal');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
        {success && <p className="text-green-600 mb-3 text-sm">{success}</p>}

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 px-4 py-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded"
          required
        >
          <option value="karyawan">Karyawan</option>
          <option value="manajer">Manajer</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Daftar
        </button>
      </form>
    </div>
  );
}