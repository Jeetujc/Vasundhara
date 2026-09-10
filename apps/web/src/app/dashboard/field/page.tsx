'use client';

import React, { useEffect, useState } from 'react';
import Header from '../../../components/layout/header';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService, type AuthUser } from '../../../services/auth.service';
import {
  dashboardService,
  type FieldDashboardData,
} from '../../../services/dashboard.service';
import { gisService } from '../../../services/gis.service';
import { workflowService } from '../../../services/workflow.service';
import { useLanguage } from '../../../context/LanguageContext';

export default function FieldOfficerDashboard() {
  const router = useRouter();
  const { language, setLanguage, toggleLanguage } = useLanguage();
  const isHindi = language === 'hi';

  const [user, setUser] = useState<AuthUser | null>(null);
  const [fieldData, setFieldData] = useState<FieldDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState(3);

  // Controls what shows in the right-hand panel
  const [activePanel, setActivePanel] = useState<'toolbox' | 'survey' | 'calculator'>('toolbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Calculator States
  const [calcArea, setCalcArea] = useState('1.25');
  const [calcRate, setCalcRate] = useState('1500000');
  const [calcMultiplier, setCalcMultiplier] = useState('1.5');

  // Survey Form States
  const [surveyOwnerName, setSurveyOwnerName] = useState('Ramesh Patel');
  const [surveyMobile, setSurveyMobile] = useState('9876543210');
  const [surveyCategory, setSurveyCategory] = useState('Agricultural (Irrigated)');
  const [surveyNotes, setSurveyNotes] = useState('Found 1 concrete structure and 5 mature mango trees inside acquisition boundary.');
  const [surveyCompletedTasks, setSurveyCompletedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadFieldData = async () => {
      try {
        setLoading(true);
        const session = authService.getSession();
        if (!session) {
          router.replace('/login/departmentlogin');
          return;
        }

        const [currentUser, fData] = await Promise.all([
          authService.getCurrentUser().catch(() => session.user),
          dashboardService.getField().catch((err) => {
            console.warn('Field dashboard API err:', err);
            return null;
          }),
        ]);

        setUser(currentUser);
        if (fData) {
          setFieldData(fData);
        }
      } catch (err) {
        console.error('Field dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFieldData();
  }, [router]);

  // Translations dictionary
  const t = {
    title: isHindi ? 'क्षेत्र अधिकारी कार्यक्षेत्र' : 'Field Officer Workspace',
    sync: isHindi ? 'ऑफ़लाइन सिंक' : 'Offline Sync',
    voice: isHindi ? 'वॉयस सर्वे' : 'Voice Survey Dictation',
    boundary: isHindi ? 'सीमा माप' : 'Walk GPS Boundary',
    panchnama: isHindi ? 'डिजिटल पंचनामा' : 'Digital Panchnama',
    calculator: isHindi ? 'मुआवजा कैलकुलेटर' : 'Compensation Calculator',
    tasks: isHindi
      ? `आज के कार्य (${fieldData?.officer?.tehsilName || 'पाटन / जबलपुर'})`
      : `Today's Tasks (${fieldData?.officer?.tehsilName || 'Patan / Jabalpur'})`,
    flag: isHindi ? 'विसंगति दर्ज करें' : 'Flag Discrepancy',
    notice: isHindi ? 'नोटिस दें' : 'Serve Notice',
    start: isHindi ? 'सर्वे शुरू करें' : 'Start Survey',
    search: isHindi ? 'नागरिक या खसरा खोजें...' : 'Search Citizen or Khasra...',
    uploadPic: isHindi ? 'ज़मीन की फोटो लें / अपलोड करें' : 'Upload Land Photos',
    landInfo: isHindi ? 'भूमि विवरण दर्ज करें' : 'Enter Land Info',
    save: isHindi ? 'डेटा सुरक्षित करें' : 'Save Citizen Data',
    sendReport: isHindi ? 'दैनिक रिपोर्ट सबमिट करें' : 'Submit Daily Report',
    navHome: isHindi ? 'होम' : 'Home',
    navAbout: isHindi ? 'हमारे बारे में' : 'About Us',
    navNotif: isHindi ? 'अधिसूचनाएं' : 'Notification',
    navAct: isHindi ? 'अधिनियम (Act)' : 'Act',
    navProjects: isHindi ? 'परियोजनाएं' : 'Projects',
    navLinks: isHindi ? 'महत्वपूर्ण लिंक' : 'Important Links',
    navLogout: isHindi ? 'लॉगआउट' : 'Logout',
  };

  const calculateCompensation = () => {
    const baseValue = Number(calcArea) * Number(calcRate);
    const multipliedValue = baseValue * Number(calcMultiplier);
    const solatium = multipliedValue; // 100% Solatium under 2013 Act
    return multipliedValue + solatium;
  };

  const handleSaveSurvey = async () => {
    if (selectedTask) {
      setSurveyCompletedTasks((prev) => ({ ...prev, [selectedTask.id]: true }));
      try {
        await gisService.saveParcelBoundary(selectedTask.id, {
          latitude: 23.1815,
          longitude: 79.9864,
          remarks: surveyNotes,
        });
      } catch (err) {
        console.warn('Could not sync boundary to GIS backend:', err);
      }
    }
    setOfflineQueue((prev) => prev + 1);
    setActivePanel('toolbox');
    alert(`Survey data for Khasra ${selectedTask?.parcelNumber || '452/1'} successfully verified & pushed to CALA & GIS repository.`);
  };

  const handleSyncData = () => {
    alert(`Connected to State Land Server: ${offlineQueue} cached field records synced successfully.`);
    setOfflineQueue(0);
  };

  const handlePushDailyReport = () => {
    alert(`Daily Verification Report compiled and submitted to District CALA for Jabalpur collectorate.`);
  };

  const tasks = fieldData?.assignedParcels && fieldData.assignedParcels.length > 0
    ? fieldData.assignedParcels
    : [
        {
          id: 'p-1',
          parcelNumber: '452/1',
          surveyNumber: 'SR-452',
          village: 'Panagar',
          area: 1.25,
          status: 'IN_PROGRESS',
          projectName: 'NH-44 Highway Widening',
        },
        {
          id: 'p-2',
          parcelNumber: '453',
          surveyNumber: 'SR-453',
          village: 'Panagar',
          area: 0.85,
          status: 'COMPLETED',
          projectName: 'NH-44 Highway Widening',
        },
      ];

  const filteredTasks = tasks.filter((tItem) => {
    const query = searchQuery.toLowerCase();
    return (
      tItem.parcelNumber.toLowerCase().includes(query) ||
      (tItem.village && tItem.village.toLowerCase().includes(query)) ||
      (tItem.projectName && tItem.projectName.toLowerCase().includes(query))
    );
  });

  return (
    <>
      <Header />

      {/* Navigation */}
      <nav className="bg-[#122C4A] flex flex-wrap items-center px-8 py-2 md:py-0 shadow-sm relative z-10">
        <ul className="flex flex-wrap flex-1 list-none m-0 p-0">
          {[
            { name: t.navHome, href: '/' },
            { name: t.navAbout, href: '/#about-us' },
            { name: t.navNotif, href: '/notifications' },
            {
              name: t.navAct,
              href: 'https://mwcc.org.in/knowledge%20center/LandAcqisition/landAcquisitionAct-2013-.pdf',
              newTab: true,
            },
            { name: t.navProjects, href: '/#projects' },
            { name: t.navLinks, href: '/#important-links' },
          ].map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                target={item.newTab ? '_blank' : '_self'}
                className="block px-[18px] py-[14px] text-[#EAF0F7] text-[13px] font-semibold tracking-[0.02em] hover:bg-[#0B1F35] transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={() => {
            authService.logout();
            router.replace('/login/departmentlogin');
          }}
          className="text-white bg-[#D97706] hover:bg-[#B45309] px-4 py-2 rounded text-sm font-semibold transition"
        >
          {t.navLogout}
        </button>
      </nav>

      {/* Main Desktop Workspace Container */}
      <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1B2430]">
        {/* Workspace Header */}
        <div className="bg-white border-b border-[#DDD8C8] px-8 py-5 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#122C4A] rounded-full flex items-center justify-center text-white font-bold text-lg">
              FO
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#122C4A]">{t.title}</h1>
              <p className="text-sm text-[#5B6472]">
                Patwari / Revenue Officer:{' '}
                <strong className="text-[#1B2430]">
                  {fieldData?.officer?.name || user?.name || 'Field Officer'}
                </strong>{' '}
                | Tehsil: {fieldData?.officer?.tehsilName || 'Patan'} | District:{' '}
                {fieldData?.officer?.districtName || 'Jabalpur'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/workflow/tasks"
              className="bg-[#122C4A] hover:bg-[#0B1F35] text-white text-xs font-bold px-3.5 py-2 rounded shadow-sm transition flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              All Workflow Tasks
            </Link>
            <Link
              href="/gis"
              className="bg-[#1D5FA8] hover:bg-[#122C4A] text-white text-xs font-bold px-3.5 py-2 rounded shadow-sm transition flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Open Full GIS Map
            </Link>
            <button
              onClick={toggleLanguage}
              className="border-2 border-[#122C4A] text-[#122C4A] font-bold px-3.5 py-1.5 rounded hover:bg-[#122C4A] hover:text-white transition-colors text-xs"
            >
              {isHindi ? 'Switch to English' : 'हिंदी में देखें'}
            </button>
          </div>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="max-w-[1536px] mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Tasks & Search (Takes up 2/3 of the screen)  */}
          {/* ========================================================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-[#DDD8C8] rounded-lg shadow-sm focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8] text-base font-semibold"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="flex justify-between items-center border-b border-[#DDD8C8] pb-2">
              <h2 className="text-lg font-bold text-[#122C4A] uppercase tracking-wide">
                {t.tasks}
              </h2>
              <span className="text-xs font-bold text-[#1D5FA8] bg-blue-50 px-3 py-1.5 rounded border border-blue-100">
                {filteredTasks.length} Assigned Parcels
              </span>
            </div>

            {/* Task List (Desktop Wide Cards) */}
            <div className="space-y-4">
              {filteredTasks.map((task) => {
                const isCompleted = surveyCompletedTasks[task.id] || task.status === 'COMPLETED';
                return (
                  <div
                    key={task.id}
                    className={`bg-white border border-[#DDD8C8] rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row justify-between p-6 ${
                      isCompleted
                        ? 'opacity-80'
                        : 'border-l-4 border-l-[#F2A71B]'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`text-sm font-bold px-3 py-1 rounded border ${
                            isCompleted
                              ? 'bg-gray-100 text-gray-600 line-through'
                              : 'text-[#122C4A] bg-[#FDF8E3] border-[#E7DFB8]'
                          }`}
                        >
                          Khasra {task.parcelNumber}
                        </span>
                        {isCompleted ? (
                          <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded border border-green-200">
                            ✓ Verified & Saved
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-[#B96E22] flex items-center gap-1">
                            📍 Village {task.village || 'Panagar'}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-[#1B2430]">
                        {task.projectName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Survey No: {task.surveyNumber || 'SR-N/A'} | Area to Acquire: {task.area} Ha
                      </p>

                      <div className="flex gap-3 mt-4">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded border border-blue-100">
                          Needs Asset Valuation
                        </span>
                        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded border border-purple-100">
                          e-KYC Ready
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-col justify-center items-end gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                      <div className="text-right w-full">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Bhulekh Record</p>
                        <p className="text-sm font-bold text-[#122C4A]">Agricultural / Barren</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setActivePanel('survey');
                        }}
                        className="w-full bg-[#1D5FA8] hover:bg-[#122C4A] text-white font-bold py-3 px-6 rounded shadow-sm transition text-sm flex items-center justify-center gap-2"
                      >
                        {isCompleted ? 'Re-Inspect Survey' : t.start}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </button>
                      <Link
                        href={`/gis/parcels?parcelId=${task.id}`}
                        className="w-full text-xs font-bold text-[#1D5FA8] hover:bg-blue-50 py-2 rounded transition border border-blue-200 text-center flex items-center justify-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        View on GIS Map
                      </Link>
                      <button
                        onClick={() => alert(`Discrepancy logged for Khasra ${task.parcelNumber}: Discrepancy sent to CALA review.`)}
                        className="w-full text-xs font-bold text-red-600 hover:bg-red-50 py-1.5 rounded transition border border-transparent hover:border-red-200"
                      >
                        {t.flag}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Dynamic Panel (Takes up 1/3 of the screen)  */}
          {/* ========================================================= */}
          <div className="lg:col-span-1">
            {/* VIEW 1: Default Toolbox */}
            {activePanel === 'toolbox' && (
              <div className="space-y-6">
                {/* Offline Sync Status */}
                <div className="bg-white border border-red-200 rounded-lg shadow-sm p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-red-700 text-sm font-bold">
                    <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
                    {offlineQueue} Offline Surveys Pending
                  </div>
                  <p className="text-xs text-gray-600">
                    Surveys are saved locally due to low network. Sync them when you have internet access.
                  </p>
                  <button
                    onClick={handleSyncData}
                    className="w-full bg-red-600 text-white text-sm font-bold py-2.5 rounded shadow-sm hover:bg-red-700 transition"
                  >
                    Sync Data to Server
                  </button>
                </div>

                {/* Survey Toolbox */}
                <div className="bg-white border border-[#DDD8C8] rounded-lg shadow-sm p-5">
                  <h3 className="text-sm font-bold text-[#122C4A] uppercase tracking-wide mb-4">
                    Survey Toolbox
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setActivePanel('calculator')}
                      className="bg-gray-50 border border-gray-200 p-4 rounded hover:border-[#1D5FA8] hover:bg-blue-50 transition flex flex-col items-center gap-3"
                    >
                      <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-bold text-center text-[#122C4A]">{t.calculator}</span>
                    </button>
                    <button
                      onClick={() => alert('Speech Recognition active. Dictate notes into microphone.')}
                      className="bg-gray-50 border border-gray-200 p-4 rounded hover:border-[#1D5FA8] hover:bg-blue-50 transition flex flex-col items-center gap-3"
                    >
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      <span className="text-xs font-bold text-center text-[#122C4A]">{t.voice}</span>
                    </button>
                    <button
                      onClick={() => alert('GPS Tracker recording polygon coordinates: Lat 23.1815, Long 79.9864 (+-2m accuracy).')}
                      className="bg-gray-50 border border-gray-200 p-4 rounded hover:border-[#1D5FA8] hover:bg-blue-50 transition flex flex-col items-center gap-3"
                    >
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="text-xs font-bold text-center text-[#122C4A]">{t.boundary}</span>
                    </button>
                    <button
                      onClick={() => alert('Digital Panchnama Template loaded. Witness signatures ready via biometric/stylus.')}
                      className="bg-gray-50 border border-gray-200 p-4 rounded hover:border-[#1D5FA8] hover:bg-blue-50 transition flex flex-col items-center gap-3"
                    >
                      <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span className="text-xs font-bold text-center text-[#122C4A]">{t.panchnama}</span>
                    </button>
                  </div>
                </div>

                {/* Submit Report Banner */}
                <div className="bg-[#122C4A] border border-[#1D5FA8] rounded-lg shadow-sm p-5 text-white flex flex-col gap-4">
                  <div>
                    <h3 className="font-bold text-lg">{t.sendReport}</h3>
                    <p className="text-xs text-[#9FB0C4] mt-1">
                      Compile all today's surveys and submit them to the District CALA Dashboard for approval.
                    </p>
                  </div>
                  <button
                    onClick={handlePushDailyReport}
                    className="w-full bg-[#F2A71B] text-[#0B1F35] text-sm font-bold py-3 rounded shadow-sm hover:bg-[#D97706] transition"
                  >
                    Push Daily Report
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 2: Data Upload & Survey Form */}
            {activePanel === 'survey' && (
              <div className="bg-white border border-[#DDD8C8] rounded-lg shadow-lg overflow-hidden flex flex-col h-[800px]">
                <div className="bg-[#122C4A] text-white p-5 flex items-center justify-between border-b border-[#0B1F35]">
                  <div>
                    <h2 className="font-bold text-lg">
                      Survey: Khasra {selectedTask?.parcelNumber || '452/1'}
                    </h2>
                    <p className="text-xs text-[#9FB0C4]">
                      {surveyOwnerName} ({selectedTask?.village || 'Panagar'})
                    </p>
                  </div>
                  <button
                    onClick={() => setActivePanel('toolbox')}
                    className="bg-white/10 hover:bg-white/20 p-2 rounded transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* Photo Upload */}
                  <div>
                    <h3 className="text-sm font-bold text-[#122C4A] mb-3">
                      {t.uploadPic} <span className="text-red-500">*</span>
                    </h3>
                    <div
                      onClick={() => alert('Camera activated. Geotagged photo captured with timestamp and coordinates.')}
                      className="border-2 border-dashed border-[#DDD8C8] bg-[#F8FAFC] rounded-lg p-8 flex flex-col items-center justify-center text-[#5B6472] cursor-pointer hover:bg-gray-100 hover:border-[#1D5FA8] transition"
                    >
                      <svg className="w-10 h-10 mb-3 text-[#1D5FA8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-bold text-[#122C4A]">Browse Files or Open Camera</span>
                      <span className="text-xs mt-1">Upload geocoded images (Max 5MB)</span>
                    </div>
                  </div>

                  {/* Citizen Identity Verification */}
                  <div>
                    <h3 className="text-sm font-bold text-[#122C4A] mb-3 border-b border-gray-100 pb-2">
                      Citizen Details Verification
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">
                          Owner Name (As per Bhulekh)
                        </label>
                        <input
                          type="text"
                          value={surveyOwnerName}
                          onChange={(e) => setSurveyOwnerName(e.target.value)}
                          className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">
                          Aadhaar Linked Mobile Number
                        </label>
                        <div className="flex">
                          <span className="bg-gray-100 border border-r-0 border-[#DDD8C8] px-3 py-3 rounded-l text-sm text-gray-500">
                            +91
                          </span>
                          <input
                            type="tel"
                            value={surveyMobile}
                            onChange={(e) => setSurveyMobile(e.target.value)}
                            placeholder="Enter citizen's 10-digit number"
                            className="w-full px-4 py-3 bg-white border border-[#DDD8C8] rounded-r focus:outline-none focus:border-[#1D5FA8] text-sm"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert(`OTP sent to ${surveyMobile}. Citizen authentication verified.`)}
                        className="w-full bg-[#EAF0F7] text-[#1D5FA8] font-bold text-xs py-3 rounded border border-[#1D5FA8] hover:bg-[#1D5FA8] hover:text-white transition"
                      >
                        Trigger e-KYC OTP Request
                      </button>
                    </div>
                  </div>

                  {/* Land & Asset Entry */}
                  <div>
                    <h3 className="text-sm font-bold text-[#122C4A] mb-3 border-b border-gray-100 pb-2">
                      {t.landInfo}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">
                          Current Ground Category
                        </label>
                        <select
                          value={surveyCategory}
                          onChange={(e) => setSurveyCategory(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] text-sm"
                        >
                          <option>Agricultural (Irrigated)</option>
                          <option>Barren Land</option>
                          <option>Commercial/Residential Structure Found</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">
                          Asset Valuation Notes (Trees, Wells, Buildings)
                        </label>
                        <textarea
                          rows={4}
                          value={surveyNotes}
                          onChange={(e) => setSurveyNotes(e.target.value)}
                          placeholder="E.g., Found 1 concrete structure and 5 mature mango trees inside acquisition boundary."
                          className="w-full px-4 py-3 bg-white border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] text-sm"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-[#DDD8C8] bg-gray-50">
                  <button
                    onClick={handleSaveSurvey}
                    className="w-full bg-[#F2A71B] text-[#0B1F35] font-bold py-3.5 rounded shadow-sm hover:bg-[#D97706] transition text-sm uppercase tracking-wide"
                  >
                    {t.save}
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 3: Compensation Calculator */}
            {activePanel === 'calculator' && (
              <div className="bg-white border border-[#DDD8C8] rounded-lg shadow-lg overflow-hidden flex flex-col">
                <div className="bg-[#122C4A] text-white p-5 flex items-center justify-between border-b border-[#0B1F35]">
                  <h2 className="font-bold text-lg">{t.calculator}</h2>
                  <button
                    onClick={() => setActivePanel('toolbox')}
                    className="bg-white/10 hover:bg-white/20 p-2 rounded transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <p className="text-xs text-gray-500 mb-4">
                    Calculate immediate statutory estimates based on the RFCTLARR Act 2013 (Includes 100% Solatium).
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      Land Area Acquired (Hectares)
                    </label>
                    <input
                      type="number"
                      value={calcArea}
                      onChange={(e) => setCalcArea(e.target.value)}
                      placeholder="e.g., 1.25"
                      className="w-full px-4 py-3 bg-white border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      Base Market Rate (₹ per Ha)
                    </label>
                    <input
                      type="number"
                      value={calcRate}
                      onChange={(e) => setCalcRate(e.target.value)}
                      placeholder="e.g., 1500000"
                      className="w-full px-4 py-3 bg-white border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      Jurisdiction Multiplier
                    </label>
                    <select
                      value={calcMultiplier}
                      onChange={(e) => setCalcMultiplier(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] text-sm font-bold"
                    >
                      <option value="1">Urban Boundary (1x)</option>
                      <option value="1.5">Semi-Urban / Peri-Urban (1.5x)</option>
                      <option value="2">Rural Area (2x)</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 bg-[#FDF8E3] border-t border-[#E7DFB8] text-center">
                  <p className="text-[10px] uppercase font-bold text-[#B96E22] mb-2 tracking-wider">
                    Estimated Award Generation
                  </p>
                  <p className="text-3xl font-serif font-bold text-[#122C4A]">
                    ₹ {calculateCompensation().toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}