'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CitizenRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, submit data to backend API here
    alert("Registration Successful! Redirecting to login...");
    router.push('/login/mainlogin');
  };

  return (
    <div className="min-h-screen bg-[#FBFAF6] flex flex-col md:flex-row font-sans text-[#1B2430]">
      
      {/* LEFT SIDE: Branding & Instructions */}
      <div className="md:w-5/12 bg-[#122C4A] text-white p-10 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" fill="currentColor" viewBox="0 0 100 100"><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"></path></pattern><rect width="100%" height="100%" fill="url(#grid)"></rect></svg>
        
        <div className="relative z-10">
          <Link href="/login/mainlogin" className="inline-flex items-center text-sm font-bold text-[#F2A71B] hover:text-white mb-12 transition-colors">
            &larr; Back to Login
          </Link>
          
          <div className="w-16 h-16 mb-6">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full block">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#F2A71B" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#F2A71B" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="4" fill="#F2A71B" />
            </svg>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-serif font-bold tracking-tight mb-4 text-[#FDF8E3]">
            Citizen Registration
          </h1>
          <p className="text-[#9FB0C4] text-sm leading-relaxed mb-8">
            Create your VASUNDHARA account to track land acquisition notifications, monitor compensation awards, and raise official grievances.
          </p>

          <ul className="space-y-4 text-sm text-[#EAF0F7]">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 mt-0.5">✓</div>
              <span>Keep your <strong>Aadhaar Card</strong> ready for e-KYC.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 mt-0.5">✓</div>
              <span>Ensure your mobile number is linked to your Aadhaar.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 mt-0.5">✓</div>
              <span>Provide exact Tehsil/Village to auto-link land records.</span>
            </li>
          </ul>
        </div>
        
        <div className="relative z-10 mt-12 pt-8 border-t border-[#1D5FA8] text-sm text-[#9FB0C4]">
          <p>Government of India &copy; 2026</p>
        </div>
      </div>

      {/* RIGHT SIDE: Registration Form */}
      <div className="md:w-7/12 p-8 lg:p-16 flex items-center justify-center bg-white overflow-y-auto">
        <div className="w-full max-w-lg">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#122C4A]">Create Account</h2>
              <p className="text-sm text-[#5B6472] mt-1">Step {step} of 2: {step === 1 ? 'Identity & Contact' : 'Location & Security'}</p>
            </div>
            <div className="flex gap-1">
              <div className={`w-8 h-2 rounded-full ${step >= 1 ? 'bg-[#1D5FA8]' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-2 rounded-full ${step >= 2 ? 'bg-[#1D5FA8]' : 'bg-gray-200'}`}></div>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#5B6472] mb-1.5">Aadhaar Number <span className="text-red-500">*</span></label>
                  <input required type="text" placeholder="XXXX-XXXX-XXXX" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8]" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-[#5B6472] mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input required type="text" placeholder="As per Aadhaar" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#5B6472] mb-1.5">Date of Birth <span className="text-red-500">*</span></label>
                    <input required type="date" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8] text-[#5B6472]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-[#5B6472] mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-[#5B6472] bg-gray-100 border border-r-0 border-[#DDD8C8] rounded-l">+91</span>
                      <input required type="tel" placeholder="10-digit number" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded-r focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#5B6472] mb-1.5">Email Address</label>
                    <input type="email" placeholder="Optional" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8]" />
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={() => setStep(2)}
                  className="w-full bg-[#122C4A] hover:bg-[#0B1F35] text-white font-bold py-3.5 px-4 rounded shadow-sm transition-colors mt-4 text-sm"
                >
                  Continue to Next Step &rarr;
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-[#5B6472] mb-1.5">State <span className="text-red-500">*</span></label>
                    <select required className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8] text-sm">
                      <option value="">Select State</option>
                      <option value="MP">Madhya Pradesh</option>
                      <option value="UP">Uttar Pradesh</option>
                      <option value="MH">Maharashtra</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#5B6472] mb-1.5">District <span className="text-red-500">*</span></label>
                    <select required className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8] text-sm">
                      <option value="">Select District</option>
                      <option value="Indore">Indore</option>
                      <option value="Bhopal">Bhopal</option>
                      <option value="Ujjain">Ujjain</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#5B6472] mb-1.5">Tehsil <span className="text-red-500">*</span></label>
                    <input required type="text" placeholder="Enter Tehsil" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#5B6472] mb-1.5">Village <span className="text-red-500">*</span></label>
                    <input required type="text" placeholder="Enter Village" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8]" />
                  </div>
                </div>

                <div className="border-t border-[#DDD8C8] my-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-[#5B6472] mb-1.5">Create Password <span className="text-red-500">*</span></label>
                      <input required type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8]" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#5B6472] mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                      <input required type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#DDD8C8] rounded focus:outline-none focus:border-[#1D5FA8] focus:ring-1 focus:ring-[#1D5FA8]" />
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 mt-4 cursor-pointer">
                  <input required type="checkbox" className="mt-1 w-4 h-4 text-[#1D5FA8] border-gray-300 rounded focus:ring-[#1D5FA8]" />
                  <span className="text-xs text-[#5B6472] leading-relaxed">
                    I hereby consent to link my Aadhaar details with the State Bhulekh records for e-KYC verification and authorize the Department of Revenue to send SMS alerts regarding land acquisition under the RFCTLARR Act, 2013.
                  </span>
                </label>

                <div className="flex gap-4 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-white border border-[#DDD8C8] text-[#1B2430] hover:bg-gray-50 font-bold py-3.5 px-4 rounded transition-colors text-sm"
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className="w-2/3 bg-[#F2A71B] hover:bg-[#D97706] text-[#0B1F35] font-bold py-3.5 px-4 rounded shadow-sm transition-colors text-sm uppercase tracking-wide"
                  >
                    Complete Registration
                  </button>
                </div>
              </div>
            )}

          </form>
          
          <div className="mt-8 text-center text-sm text-[#5B6472]">
            Already have an account? <Link href="/login/mainlogin" className="font-bold text-[#1D5FA8] hover:underline">Log in here</Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}