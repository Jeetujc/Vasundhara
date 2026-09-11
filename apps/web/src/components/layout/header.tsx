'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authService, type AuthUser } from '../../services/auth.service';
import { useLanguage } from '../../context/LanguageContext';

import CentralHeader from './headers/CentralHeader';
import StateHeader from './headers/StateHeader';
import DistrictHeader from './headers/DistrictHeader';
import FieldHeader from './headers/FieldHeader';
import AdminHeader from './headers/AdminHeader';
import CitizenHeader from './headers/CitizenHeader';
import GuestHeader from './headers/GuestHeader';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname() || '';
  const { language, setLanguage } = useLanguage();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const session = authService.getSession();
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    router.replace('/login/mainlogin');
  };

  const role = user?.role;

  // Render role-specific header component
  const renderRoleHeader = () => {
    if (!user || !role) {
      return (
        <GuestHeader
          pathname={pathname}
          language={language}
          onSetLanguage={setLanguage}
        />
      );
    }

    switch (role) {
      case 'CENTRAL_OFFICER':
        return (
          <CentralHeader
            user={user}
            pathname={pathname}
            language={language}
            onSetLanguage={setLanguage}
            onLogout={handleLogout}
          />
        );

      case 'STATE_OFFICER':
        return (
          <StateHeader
            user={user}
            pathname={pathname}
            language={language}
            onSetLanguage={setLanguage}
            onLogout={handleLogout}
          />
        );

      case 'DISTRICT_OFFICER':
        return (
          <DistrictHeader
            user={user}
            pathname={pathname}
            language={language}
            onSetLanguage={setLanguage}
            onLogout={handleLogout}
          />
        );

      case 'FIELD_OFFICER':
        return (
          <FieldHeader
            user={user}
            pathname={pathname}
            language={language}
            onSetLanguage={setLanguage}
            onLogout={handleLogout}
          />
        );

      case 'ADMIN':
        return (
          <AdminHeader
            user={user}
            pathname={pathname}
            language={language}
            onSetLanguage={setLanguage}
            onLogout={handleLogout}
          />
        );

      case 'PUBLIC_USER':
        return (
          <CitizenHeader
            user={user}
            pathname={pathname}
            language={language}
            onSetLanguage={setLanguage}
            onLogout={handleLogout}
          />
        );

      default:
        return (
          <GuestHeader
            pathname={pathname}
            language={language}
            onSetLanguage={setLanguage}
          />
        );
    }
  };

  return renderRoleHeader();
}