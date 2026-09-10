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
  | 'field_officer';

const roleMap: Record<string, string> = {
  central: 'CENTRAL_OFFICER',
  state: 'STATE_OFFICER',
  district: 'DISTRICT_OFFICER',
  field_officer: 'FIELD_OFFICER',
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
        case 'CENTRAL_OFFICER':
          router.push('/dashboard/national');
          break;

        case 'STATE_OFFICER':
          if (!user.stateId) {
            throw new Error(
              'Your state officer account is not assigned to a state.'
            );
          }

          router.push(`/dashboard/state/${user.stateId}`);
          break;

        case 'DISTRICT_OFFICER':
          if (!user.districtId) {
            throw new Error(
              'Your district officer account is not assigned to a district.'
            );
          }

          router.push(`/dashboard/district/${user.districtId}`);
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
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#1E3A8A] mb-2">
          VASUNDHARA
        </h1>

        <h1 className="text-xl font-bold text-[#1E3A8A] mb-2">
          National Land Acquisition & Management System
        </h1>

        <p className="text-[#0F172A] text-lg">
          Secure Access Portal
        </p>
      </div>

      {/* Login Cards Container */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">

        {/* Official / Department Login */}
        <div className="flex-1 bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">

          <h2 className="text-2xl font-semibold text-[#0F172A] mb-4">
            Official Workspace
          </h2>

          <p className="text-gray-600 mb-8">
            Access Ministry dashboards, Collector action queues,
            and MIS reports.
          </p>

          <Link
            href="/login/departmentlogin"
            className="w-full block"
          >
            <button
              type="button"
              className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold py-3 px-4 rounded transition-colors"
            >
              Department Login
            </button>
          </Link>

          <p className="text-xs text-gray-400 mt-4">
            Requires authorized NIC credentials and RBAC clearance.
          </p>
        </div>

        {/* Authority Login */}
        <div className="flex-1 bg-white p-8 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">

          <h2 className="text-2xl font-semibold text-[#0F172A] mb-4">
            Authority Login
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
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm bg-white text-gray-800 disabled:bg-gray-100"
              >
                <option value="">
                  Select Authority Level
                </option>

                <option value="central">
                  Central Authority
                </option>

                <option value="state">
                  State Authority
                </option>

                <option value="district">
                  District Authority
                </option>

                <option value="field_officer">
                  Field Officer
                </option>
              </select>
            </div>

            {/* Aadhaar */}
            <div>
              <label
                htmlFor="aadharId"
                className="block text-xs font-semibold text-gray-700 uppercase mb-1"
              >
                Aadhaar ID
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
                placeholder="Enter 12-digit Aadhaar"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm text-gray-800 disabled:bg-gray-100"
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
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-sm text-gray-800 disabled:bg-gray-100"
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
        </div>
      </div>
    </div>
  );
}