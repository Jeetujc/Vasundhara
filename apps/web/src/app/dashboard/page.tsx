'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../services/auth.service';

const ROLE_DASHBOARD_MAP: Record<string, string> = {
  PUBLIC_USER: '/dashboard/citizen',
  CENTRAL_OFFICER: '/dashboard/national',
  STATE_OFFICER: '/dashboard/state',
  DISTRICT_OFFICER: '/dashboard/district',
  FIELD_OFFICER: '/dashboard/field',
  ADMIN: '/admin',
};

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const session = authService.getSession();
    if (!session) {
      router.replace('/login/mainlogin');
      return;
    }

    const role = session.user?.role || 'PUBLIC_USER';
    const target = ROLE_DASHBOARD_MAP[role] || '/dashboard/citizen';
    router.replace(target);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FBFAF6] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#5B6472]">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
