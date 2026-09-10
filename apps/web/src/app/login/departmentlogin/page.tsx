'use client';

import React, { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { authService } from '../../../services/auth.service';

type AuthorityLevel =
  | ''
  | 'central'
  | 'state'
  | 'district'
  | 'field_officer'
  | 'admin';

const roleMap: Record<string, string> = {
  central: 'CENTRAL_OFFICER',
  state: 'STATE_OFFICER',
  district: 'DISTRICT_OFFICER',
  field_officer: 'FIELD_OFFICER',
  admin: 'ADMIN',
};

export default function LoginPage() {
  const router = useRouter();

  const [authorityLevel, setAuthorityLevel] =
    useState<AuthorityLevel>('');

  const [aadharId, setAadharId] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');

    // -----------------------------------------
    // Validation
    // -----------------------------------------

    if (!authorityLevel) {
      setError('Please select your authority level.');
      return;
    }

    if (!/^\d{12}$/.test(aadharId)) {
      setError('Aadhaar must contain exactly 12 digits.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setLoading(true);

      // -----------------------------------------
      // Login through common auth service
      // -----------------------------------------

      const session = await authService.login({
        aadharId,
        password,
      });

      // -----------------------------------------
      // Get logged-in user
      // -----------------------------------------

      const user = session.user;

      if (!user) {
        throw new Error('Invalid login response.');
      }

      // -----------------------------------------
      // Verify selected authority level
      // -----------------------------------------

      const expectedRole = roleMap[authorityLevel];

      if (user.role !== expectedRole) {
        await authService.logout();

        throw new Error(
          `Selected authority level does not match your account role.`
        );
      }

      // -----------------------------------------
      // Redirect based on actual role
      // -----------------------------------------

      switch (user.role) {
        case 'ADMIN':
          router.push('/admin');
          break;

        case 'CENTRAL_OFFICER':
          router.push('/dashboard/national');
          break;

        case 'STATE_OFFICER':
          router.push(`/dashboard/state/${user.stateId || 'MP'}`);
          break;

        case 'DISTRICT_OFFICER':
          router.push(`/dashboard/district/${user.districtId || 'JBP'}`);
          break;

        case 'FIELD_OFFICER':
          router.push('/dashboard/field');
          break;

        default:
          await authService.logout();

          throw new Error(
            'This account is not authorized for the official workspace.'
          );
      }
    } catch (err: any) {
      console.error('Authority login error:', err);

      setError(
        err?.message ||
          'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">

      {/* Official Government Branding Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <h1 className="text-4xl font-bold text-[#1E3A8A] mb-2 font-serif hover:opacity-90">
            VASUNDHARA
          </h1>
        </Link>

        <h2 className="text-xl font-bold text-[#1E3A8A] mb-2">
          National Land Acquisition &amp; Management System
        </h2>

        <p className="text-[#0F172A] text-lg">
          Official Authority Portal
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">

        <h2 className="text-2xl font-semibold text-[#0F172A] mb-2">
          Authority Sign In
        </h2>

        <p className="text-gray-600 mb-6 text-sm">
          Select your authority tier and sign in with your credentials.
        </p>

        <form
          onSubmit={handleLogin}
          className="w-full flex flex-col gap-4 text-left"
        >

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Authority Level */}
          <div>
            <label
              htmlFor="authorityLevel"
              className="block text-xs font-semibold text-gray-700 uppercase mb-1"
            >
              Authority Level
            </label>

            <select
              id="authorityLevel"
              value={authorityLevel}
              onChange={(e) =>
                setAuthorityLevel(
                  e.target.value as AuthorityLevel
                )
              }
              disabled={loading}
              className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm bg-white text-gray-800 disabled:bg-gray-100 font-medium"
            >
              <option value="">
                Select Authority Level
              </option>

              <option value="central">
                Central Authority (DoLR / MoRD)
              </option>

              <option value="state">
                State Authority (Macro-Oversight)
              </option>

              <option value="district">
                District Authority (CALA)
              </option>

              <option value="field_officer">
                Field Revenue Officer / Patwari
              </option>

              <option value="admin">
                System Administrator
              </option>
            </select>
          </div>

          {/* Aadhaar */}
          <div>
            <label
              htmlFor="aadharId"
              className="block text-xs font-semibold text-gray-700 uppercase mb-1"
            >
              Aadhaar ID (12 Digits)
            </label>

            <input
              id="aadharId"
              type="text"
              inputMode="numeric"
              maxLength={12}
              value={aadharId}
              onChange={(e) =>
                setAadharId(
                  e.target.value.replace(/\D/g, '')
                )
              }
              placeholder="e.g. 999999999999"
              disabled={loading}
              className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm text-gray-800 disabled:bg-gray-100"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-gray-700 uppercase mb-1"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter Password"
              disabled={loading}
              className="w-full px-3 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm text-gray-800 disabled:bg-gray-100"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E3A8A] hover:bg-[#172b69] disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded transition-colors mt-2"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

        </form>

        <Link
          href="/login/mainlogin"
          className="text-xs font-bold text-[#1E3A8A] hover:underline mt-6"
        >
          ← Back to Portal Selection
        </Link>
      </div>
    </div>
  );
}