'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/auth.service';

export default function DistrictDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const session = authService.getSession();
    if (!session) {
      router.replace('/login/departmentlogin');
      return;
    }
    const districtId = session.user?.districtId || 'JBP';
    router.replace(`/dashboard/district/${districtId}`);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FBFAF6] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#5B6472]">Routing to District Dashboard...</p>
      </div>
    </div>
  );
}
