import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Halaman umum
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Attendance from './Attendance';
import Leave from './Leave';
import Reimbursement from './Reimbursement';

// Halaman manajer
import ManagerDashboard from './manager/ManagerDashboard';
import KelolaReimbursement from './manager/KelolaReimbursement';
import KelolaLeave from './manager/KelolaLeave';
import KelolaKaryawan from './manager/KelolaKaryawan';
import RiwayatAbsensi from './manager/RiwayatAbsensi';
import ManagerRoute from './manager/ManagerRouter';


function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect ke login secara default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Employee routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/reimbursement" element={<Reimbursement />} />

        {/* Manager routes (hanya bisa diakses jika ManagerRoute terpenuhi) */}
        <Route
          path="/manager/managerdashboard"
          element={
            <ManagerRoute>
              <ManagerDashboard />
            </ManagerRoute>
          }
        />
        <Route
          path="/manager/kelola-reimbursement"
          element={
            <ManagerRoute>
              <KelolaReimbursement />
            </ManagerRoute>
          }
        />
        <Route
          path="/manager/kelola-leave"
          element={
            <ManagerRoute>
              <KelolaLeave />
            </ManagerRoute>
          }
        />
        <Route
          path="/manager/kelola-karyawan"
          element={
            <ManagerRoute>
              <KelolaKaryawan />
            </ManagerRoute>
          }
        />
        <Route
          path="/manager/riwayat-absen"
          element={
            <ManagerRoute>
              <RiwayatAbsensi />
            </ManagerRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
