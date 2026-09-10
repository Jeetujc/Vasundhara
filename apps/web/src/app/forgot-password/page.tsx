'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/layout/header';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || identifier.length < 10) {
      setError('Please provide a valid 12-digit Aadhaar number or 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setMessage(`One Time Password (OTP) sent to mobile linked with ${identifier.slice(-4)}.`);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    setError('');
    setStep(3);
    setMessage('OTP verified. Please choose a strong new password.');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Password updated successfully! Please login with your new credentials.');
      router.push('/login/mainlogin');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FBFAF6] font-sans text-[#1B2430] flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white border border-[#DDD8C8] rounded-xl shadow-lg max-w-md w-full p-8 space-y-6">
          <div>
            <span className="text-[10px] font-bold text-[#B96E22] uppercase tracking-wider bg-[#FDF8E3] border border-[#E7DFB8] px-2.5 py-0.5 rounded">
              Aadhaar Self-Service
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#122C4A] mt-2">Reset Password</h1>
            <p className="text-xs text-[#5B6472] mt-1">
              Recover access to your VASUNDHARA citizen or department account.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded font-medium">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-800 text-xs px-3 py-2 rounded font-medium">
              ✓ {message}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  Aadhaar Number or Official Mobile
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 555555555555 or 9555555555"
                  className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#122C4A] hover:bg-[#0B1F35] text-white font-bold py-2.5 rounded text-xs transition shadow-sm disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send Verification OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full border border-gray-300 rounded px-3 py-2.5 text-center text-lg font-mono tracking-widest"
                />
                <p className="text-[10px] text-gray-400 mt-1">Prototype testing OTP: any 6 digits.</p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1D5FA8] hover:bg-[#122C4A] text-white font-bold py-2.5 rounded text-xs transition shadow-sm"
              >
                Verify OTP →
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  New Secure Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded text-xs transition shadow-sm disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Set New Password'}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
            <Link href="/login/mainlogin" className="text-[#1D5FA8] font-bold hover:underline">
              ← Back to Login
            </Link>
            <Link href="/" className="hover:underline">
              Portal Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
