'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { authService } from '../../../services/auth.service';

export default function LoginPage() {
  const router = useRouter();

  const [citizenCredentials, setCitizenCredentials] = useState({
    aadharId: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCitizenSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError('');

    // Basic Aadhaar validation
    if (!/^\d{12}$/.test(citizenCredentials.aadharId)) {
      setError('Aadhaar number must be exactly 12 digits.');
      return;
    }

    try {
      setLoading(true);

      // Connect to NestJS
      const session = await authService.login({
        aadharId: citizenCredentials.aadharId,
        password: citizenCredentials.password,
      });

      console.log('Login successful:', session.user);

      // Citizen dashboard
      router.push('/dashboard/citizen');
    } catch (err) {
      console.error('Login error:', err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid Aadhaar number or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">

      {/* Government Branding */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#1E3A8A] mb-2">
          VASUNDHARA
        </h1>

        <h2 className="text-xl font-bold text-[#1E3A8A] mb-2">
          National Land Acquisition & Management System
        </h2>

        <p className="text-[#0F172A] text-lg">
          Secure Access Portal
        </p>
      </div>

      {/* Login Cards */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">

        {/* ================= CITIZEN LOGIN ================= */}

        <div className="flex-1 bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">

          <h2 className="text-2xl font-semibold text-[#0F172A] mb-2">
            Citizen Portal
          </h2>

          <p className="text-gray-600 mb-6 text-sm">
            Access land records, track acquisition status, and submit claims
            or grievances.
          </p>

          {/* Error */}
          {error && (
            <div className="w-full mb-4 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm text-left">
              {error}
            </div>
          )}

          <form
            onSubmit={handleCitizenSubmit}
            className="w-full flex flex-col gap-4 text-left"
          >

            {/* Aadhaar */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Aadhaar Number
              </label>

              <input
                type="text"
                required
                inputMode="numeric"
                maxLength={12}
                placeholder="Enter 12-digit Aadhaar"
                value={citizenCredentials.aadharId}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');

                  setCitizenCredentials({
                    ...citizenCredentials,
                    aadharId: value,
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm text-gray-800"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Password
              </label>

              <input
                type="password"
                required
                placeholder="Enter Password"
                value={citizenCredentials.password}
                onChange={(e) =>
                  setCitizenCredentials({
                    ...citizenCredentials,
                    password: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#F59E0B] text-sm text-gray-800"
              />
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-xs text-gray-500">

              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-[#F59E0B] focus:ring-[#F59E0B]"
                />
                Remember me
              </label>

              <Link
                href="/forgot-password"
                className="hover:underline text-[#D97706]"
              >
                Forgot Password?
              </Link>

            </div>

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F59E0B] hover:bg-[#D97706] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded transition-colors mt-2"
            >
              {loading ? 'Signing In...' : 'Citizen Login'}
            </button>

          </form>

          {/* Register */}
          <p className="text-xs text-gray-500 mt-6">
            New user?{' '}

            <Link
              href="/register"
              className="text-[#D97706] font-semibold hover:underline"
            >
              Register here
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
}