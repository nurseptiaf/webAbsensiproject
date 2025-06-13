import React from "react";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

export default function SuccessModal({ isOpen, onClose, date, time }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-gray-200 rounded-xl p-6 w-[400px] text-center shadow-xl">
        <div className="flex justify-center items-center mb-4">
          <div className="w-14 h-14 rounded-full border-2 border-gray-500 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-4">You have successfully been absent</h2>

        <div className="bg-gray-100 p-4 rounded-xl text-left text-sm mb-6">
          <p className="font-bold mb-2">Detail Absen</p>
          <div className="flex items-center gap-2 mb-1">
            <FaCalendarAlt className="text-gray-700" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-gray-700" />
            <span>{time} WIB</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 border border-gray-700 rounded-full text-sm hover:bg-gray-300 transition"
        >
          Closed
        </button>
      </div>
    </div>
  );
}
