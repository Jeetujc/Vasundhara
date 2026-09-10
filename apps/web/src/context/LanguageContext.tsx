'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'hi';

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Branding & Header
    'app.title': 'VASUNDHARA',
    'app.subtitle': 'National Land Acquisition & Management System',
    'app.secure_portal': 'Secure Access Portal',

    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.notifications': 'Notifications',
    'nav.act': 'Act',
    'nav.projects': 'Projects',
    'nav.links': 'Important Links',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.back_home': '← Back to Home',
    'nav.back_dashboard': '← Back to Dashboard',
    'nav.back_login': '← Back to Login',

    // Common Actions & Buttons
    'btn.submit': 'Submit',
    'btn.save': 'Save',
    'btn.cancel': 'Cancel',
    'btn.search': 'Search',
    'btn.view_details': 'View Details',
    'btn.download_pdf': 'Download PDF',
    'btn.verify_now': 'Verify Now',
    'btn.view_audit': 'View Detailed Audit',
    'btn.raise_grievance': '+ Raise New Grievance',
    'btn.generate_mis': 'Generate MIS Report',
    'btn.export_report': 'Export Assembly Report',
    'btn.generate_cabinet': 'Generate Cabinet Note',
    'btn.start_survey': 'Start Survey',
    'btn.save_data': 'Save Citizen Data',
    'btn.submit_daily_report': 'Submit Daily Report',
    'btn.create_account': 'Create Authority Account',
    'btn.review_sign': 'Review & e-Sign',

    // Common Statuses
    'status.active': 'Active',
    'status.pending': 'Pending',
    'status.completed': 'Completed',
    'status.in_progress': 'In Progress',
    'status.resolved': 'Resolved',
    'status.account_active': 'Account Active',
    'status.eligible': 'Eligible',
    'status.under_review': 'Under Review',
    'status.action_required': 'Action Required',

    // Citizen Dashboard
    'citizen.dashboard': 'Dashboard',
    'citizen.welcome_back': 'Welcome back,',
    'citizen.action_required_title': 'Action Required: Bank Details Verification',
    'citizen.action_required_desc':
      'Your compensation is ready for transfer. Please verify your Aadhaar-linked bank account or upload a cancelled cheque to proceed.',
    'citizen.land_details_title': 'Citizen & Land Record Details',
    'citizen.registered_citizen': 'Registered Citizen',
    'citizen.owner_name': 'Owner Name',
    'citizen.aadhaar_number': 'Aadhaar Number',
    'citizen.mobile_number': 'Mobile Number',
    'citizen.account_type': 'Account Type',
    'citizen.location': 'Location',
    'citizen.financial_award_title': 'Financial & R&R Award Breakdown',
    'citizen.base_market_value': 'Base Market Value',
    'citizen.location_multiplier': 'Location Multiplier',
    'citizen.attached_assets': 'Value of Attached Assets',
    'citizen.basic_compensation': 'Basic Compensation',
    'citizen.solatium': 'Solatium (100%)',
    'citizen.rr_benefits_title': 'Rehabilitation & Resettlement Benefits',
    'citizen.displacement_allowance': 'One-time Displacement Allowance',
    'citizen.housing_plot': 'Housing Plot Allocated',
    'citizen.total_cash_award': 'Total Final Cash Award',
    'citizen.acquisition_tracker': 'Acquisition Tracker',
    'citizen.gis_title': 'GIS Spatial Map',
    'citizen.geo_tagged': 'Geo-Tagged',
    'citizen.document_vault': 'Document Vault',
    'citizen.help_grievances': 'Help & Grievances',
    'citizen.help_grievances_desc':
      'Having issues with your land area, asset calculation, or bank transfer? Raise an official grievance here.',

    // State Dashboard
    'state.title': 'State Macro-Oversight Workspace',
    'state.kpi_projects': 'Mega-Projects Active',
    'state.kpi_land_target': 'Land Target (Statewide)',
    'state.kpi_funds_disbursed': 'Funds Disbursed',
    'state.kpi_funds_risk': 'Funds at Risk of Lapse',
    'state.efficiency_ranking': 'District Efficiency Ranking',
    'state.statutory_radar': 'Statutory Expiry Radar',
    'state.clearance_tracker': 'Inter-Departmental Clearance Tracker',

    // District Dashboard
    'district.title': 'District CALA Command Center',
    'district.kpi_projects': 'Total Active Projects',
    'district.kpi_land_target': 'Land Acquired Target',
    'district.milestone_tracker': 'Acquisition Milestone Tracker',
    'district.rr_tracker': 'Project-Wise R&R Tracker',
    'district.pending_approvals': 'Pending Approvals',
    'district.financial_health': 'District Financial Health',

    // National Dashboard
    'national.title': 'National Master Monitoring System',
    'national.kpi_pipeline': 'Central Project Pipeline',
    'national.kpi_footprint': 'Aggregate Land Footprint',
    'national.kpi_escrow': 'Central Escrow Disbursed',
    'national.kpi_blocked': 'National Capital Blocked',

    // Field Officer Dashboard
    'field.title': 'Field Officer Workspace',
    'field.today_tasks': "Today's Tasks",
    'field.assigned_parcels': 'Assigned Land Parcels',
    'field.compensation_calc': 'Compensation Calculator',

    // Admin
    'admin.title': 'National System Administration',
    'admin.subtitle': 'Manage Authority Accounts, Geographic RBAC & System Audit Trail',
    'admin.create_title': 'Provision Authority Account',
    'admin.table_title': 'Provisioned Authority Users',
    'admin.recent_audits': 'System Audit Logs',

    // Forms & Auth
    'auth.citizen_portal': 'Citizen Portal',
    'auth.official_workspace': 'Official Workspace',
    'auth.login_aadhaar': 'Login with Aadhaar Number',
    'auth.department_login': 'Department Login',
    'auth.signin': 'Sign In',
    'auth.signing_in': 'Signing In...',
    'auth.new_user_register': 'New User? Register Here',
    'auth.register_title': 'Citizen Registration',
    'auth.create_account': 'Create Account',
    'auth.authority_level': 'Authority Level',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm Password',

    // States
    'state.loading': 'Loading...',
    'state.no_records': 'No records found.',
    'state.error': 'An error occurred. Please try again.',
  },
  hi: {
    // Branding & Header
    'app.title': 'वसुंधरा',
    'app.subtitle': 'राष्ट्रीय भूमि अधिग्रहण एवं प्रबंधन प्रणाली',
    'app.secure_portal': 'सुरक्षित प्रवेश पोर्टल',

    // Navigation
    'nav.home': 'होम',
    'nav.about': 'हमारे बारे में',
    'nav.notifications': 'अधिसूचनाएं',
    'nav.act': 'अधिनियम (Act)',
    'nav.projects': 'परियोजनाएं',
    'nav.links': 'महत्वपूर्ण लिंक',
    'nav.logout': 'लॉगआउट',
    'nav.login': 'लॉगिन',
    'nav.back_home': '← मुख्य पृष्ठ पर जाएं',
    'nav.back_dashboard': '← डैशबोर्ड पर वापस जाएं',
    'nav.back_login': '← लॉगिन पर वापस जाएं',

    // Common Actions & Buttons
    'btn.submit': 'जमा करें',
    'btn.save': 'सुरक्षित करें',
    'btn.cancel': 'रद्द करें',
    'btn.search': 'खोजें',
    'btn.view_details': 'विवरण देखें',
    'btn.download_pdf': 'पीडीएफ डाउनलोड करें',
    'btn.verify_now': 'अभी सत्यापित करें',
    'btn.view_audit': 'विस्तृत ऑडिट देखें',
    'btn.raise_grievance': '+ नई शिकायत दर्ज करें',
    'btn.generate_mis': 'एमआईएस रिपोर्ट बनाएं',
    'btn.export_report': 'विधानसभा रिपोर्ट डाउनलोड करें',
    'btn.generate_cabinet': 'कैबिनेट नोट तैयार करें',
    'btn.start_survey': 'सर्वे शुरू करें',
    'btn.save_data': 'नागरिक डेटा सुरक्षित करें',
    'btn.submit_daily_report': 'दैनिक रिपोर्ट सबमिट करें',
    'btn.create_account': 'प्राधिकारी खाता बनाएं',
    'btn.review_sign': 'समीक्षा एवं ई-हस्ताक्षर करें',

    // Common Statuses
    'status.active': 'सक्रिय',
    'status.pending': 'लंबित',
    'status.completed': 'पूर्ण',
    'status.in_progress': 'प्रगति पर',
    'status.resolved': 'निस्तारित',
    'status.account_active': 'खाता सक्रिय',
    'status.eligible': 'पात्र',
    'status.under_review': 'समीक्षाधीन',
    'status.action_required': 'कार्रवाई आवश्यक',

    // Citizen Dashboard
    'citizen.dashboard': 'डैशबोर्ड',
    'citizen.welcome_back': 'स्वागत है,',
    'citizen.action_required_title': 'कार्रवाई आवश्यक: बैंक खाता सत्यापन',
    'citizen.action_required_desc':
      'आपका मुआवजा हस्तांतरण के लिए तैयार है। कृपया अपने आधार से जुड़े बैंक खाते का सत्यापन करें।',
    'citizen.land_details_title': 'नागरिक एवं भू-अभिलेख विवरण',
    'citizen.registered_citizen': 'पंजीकृत नागरिक',
    'citizen.owner_name': 'भूमि स्वामी का नाम',
    'citizen.aadhaar_number': 'आधार संख्या',
    'citizen.mobile_number': 'मोबाइल नंबर',
    'citizen.account_type': 'खाते का प्रकार',
    'citizen.location': 'स्थान',
    'citizen.financial_award_title': 'वित्तीय एवं पुनर्वास (R&R) अवार्ड विवरण',
    'citizen.base_market_value': 'मूल बाजार मूल्य',
    'citizen.location_multiplier': 'स्थान गुणक (Multiplier)',
    'citizen.attached_assets': 'संलग्न संपत्तियों का मूल्य',
    'citizen.basic_compensation': 'मूल मुआवजा',
    'citizen.solatium': 'सांत्वना राशि (100% Solatium)',
    'citizen.rr_benefits_title': 'पुनर्वास एवं पुनःस्थापन लाभ',
    'citizen.displacement_allowance': 'एकमुश्त विस्थापन भत्ता',
    'citizen.housing_plot': 'आवासीय भूखंड आवंटित',
    'citizen.total_cash_award': 'कुल अंतिम नकद अवार्ड',
    'citizen.acquisition_tracker': 'अधिग्रहण ट्रैकर',
    'citizen.gis_title': 'जीआईएस स्थानिक मानचित्र',
    'citizen.geo_tagged': 'जियो-टैग्ड',
    'citizen.document_vault': 'दस्तावेज़ वॉल्ट (Document Vault)',
    'citizen.help_grievances': 'सहायता एवं शिकायत निवारण',
    'citizen.help_grievances_desc':
      'भूमि क्षेत्रफल, परिसंपत्ति मूल्यांकन अथवा बैंक अंतरण संबंधी आपत्ति यहां दर्ज करें।',

    // State Dashboard
    'state.title': 'राज्य स्तरीय वृहद निगरानी कार्यक्षेत्र',
    'state.kpi_projects': 'सक्रिय महा-परियोजनाएं',
    'state.kpi_land_target': 'भूमि अधिग्रहण लक्ष्य (राज्यव्यापी)',
    'state.kpi_funds_disbursed': 'संवितरित धनराशि',
    'state.kpi_funds_risk': 'व्यपगत जोखिम वाली धनराशि',
    'state.efficiency_ranking': 'जिला कार्यकुशलता रैंकिंग',
    'state.statutory_radar': 'वैधानिक समयसीमा रडार',
    'state.clearance_tracker': 'अंतर-विभागीय अनापत्ति ट्रैकर',

    // District Dashboard
    'district.title': 'जिला CALA कमान केंद्र',
    'district.kpi_projects': 'कुल सक्रिय परियोजनाएं',
    'district.kpi_land_target': 'भूमि अधिग्रहण लक्ष्य',
    'district.milestone_tracker': 'अधिग्रहण कानूनी चरण ट्रैकर',
    'district.rr_tracker': 'परियोजनावार पुनर्वास ट्रैकर',
    'district.pending_approvals': 'लंबित स्वीकृतियां',
    'district.financial_health': 'जिला वित्तीय स्थिति',

    // National Dashboard
    'national.title': 'राष्ट्रीय मास्टर मॉनिटरिंग सिस्टम',
    'national.kpi_pipeline': 'केंद्रीय परियोजना पाइपलाइन',
    'national.kpi_footprint': 'कुल भूमि क्षेत्रफल',
    'national.kpi_escrow': 'केंद्रीय एस्क्रो संवितरित',
    'national.kpi_blocked': 'अवरुद्ध राष्ट्रीय पूंजी',

    // Field Officer Dashboard
    'field.title': 'क्षेत्र अधिकारी कार्यक्षेत्र',
    'field.today_tasks': 'आज के कार्य',
    'field.assigned_parcels': 'आवंटित भूमि खसरे',
    'field.compensation_calc': 'मुआवजा कैलकुलेटर',

    // Admin
    'admin.title': 'राष्ट्रीय प्रणाली प्रशासन',
    'admin.subtitle': 'प्राधिकारी खाते, भौगोलिक आरबीएसी एवं प्रणाली ऑडिट ट्रेल',
    'admin.create_title': 'प्राधिकारी खाता बनाएं',
    'admin.table_title': 'स्वीकृत प्राधिकारी अधिकारी',
    'admin.recent_audits': 'प्रणाली ऑडिट लॉग्स',

    // Forms & Auth
    'auth.citizen_portal': 'नागरिक पोर्टल',
    'auth.official_workspace': 'शासकीय कार्यक्षेत्र',
    'auth.login_aadhaar': 'आधार संख्या से लॉगिन करें',
    'auth.department_login': 'विभागीय लॉगिन',
    'auth.signin': 'साइन इन करें',
    'auth.signing_in': 'प्रमाणीकरण जारी है...',
    'auth.new_user_register': 'नया उपयोगकर्ता? यहां पंजीकरण करें',
    'auth.register_title': 'नागरिक पंजीकरण',
    'auth.create_account': 'खाता बनाएं',
    'auth.authority_level': 'प्राधिकार स्तर',
    'auth.password': 'पासवर्ड',
    'auth.confirm_password': 'पासवर्ड की पुष्टि करें',

    // States
    'state.loading': 'लोड हो रहा है...',
    'state.no_records': 'कोई विवरण उपलब्ध नहीं है।',
    'state.error': 'त्रुटि हुई। कृपया पुनः प्रयास करें।',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, defaultText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string, defaultText?: string) => defaultText ?? key,
});

const STORAGE_KEY = 'vasundhara_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved === 'en' || saved === 'hi') {
        setLanguageState(saved);
      }
    } catch {
      // localStorage not accessible
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // no-op
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
  };

  const t = (key: string, defaultText?: string): string => {
    const currentDict = translations[language] || translations.en;
    if (currentDict[key]) {
      return currentDict[key];
    }
    const fallbackDict = translations.en;
    if (fallbackDict[key]) {
      return fallbackDict[key];
    }
    return defaultText ?? key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
