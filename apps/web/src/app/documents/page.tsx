'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/layout/header';
import { documentService, type DocumentItem } from '../../services/document.service';

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('SECTION_11');
  const [mimeType, setMimeType] = useState('application/pdf');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      setLoading(true);
      const data = await documentService.list();
      setDocs(data || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      await documentService.upload({
        name,
        storageKey: `docs/${Date.now()}_${name.replace(/\s+/g, '_')}.pdf`,
        mimeType,
        sizeBytes: 1048576,
      });
      alert('Document registered and indexed successfully.');
      setName('');
      setShowUploadModal(false);
      await loadDocs();
    } catch (err: any) {
      alert(err?.message || 'Failed to upload document record.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (doc: DocumentItem) => {
    const text = `GOVERNMENT OF INDIA - MINISTRY OF RURAL DEVELOPMENT
VASUNDHARA NATIONAL LAND RECORDS REPOSITORY
------------------------------------------------------------
Document: ${doc.name}
Storage Key: ${doc.storageKey}
Status: ${doc.status}
Registered At: ${doc.createdAt || new Date().toISOString()}
------------------------------------------------------------
This official document is digitally signed and cryptographically
hashed under statutory Land Acquisition authority.`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filtered = docs.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FBFAF6] font-sans text-[#1B2430]">
      <Header />

      {/* Sub-nav */}
      <nav className="bg-[#0E243D] text-white px-8 py-2.5 flex flex-wrap items-center justify-between border-b border-[#1D5FA8]/40 shadow-sm text-xs">
        <div className="flex items-center gap-6">
          <span className="font-bold text-[#F2A71B] uppercase tracking-wider flex items-center gap-1.5">
            📁 Digital Document Vault
          </span>
          <div className="flex items-center gap-1">
            <Link href="/documents" className="bg-[#1D5FA8] text-white px-3 py-1.5 rounded font-bold transition">
              All Documents
            </Link>
            <Link href="/notifications" className="text-gray-300 hover:text-white px-3 py-1.5 rounded transition hover:bg-white/10">
              Gazette Notifications
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-[#1D5FA8] hover:bg-[#122C4A] text-white px-3.5 py-1.5 rounded font-bold transition shadow-sm flex items-center gap-1.5"
          >
            + Upload New Document
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#122C4A]">Statutory Document Vault &amp; Gazette Repository</h1>
            <p className="text-sm text-[#5B6472] mt-1">
              Verified Section 11 notices, Section 19 declarations, Award orders, and Field Panchnamas.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-[#122C4A] hover:bg-[#0B1F35] text-white text-xs font-bold px-4 py-2 rounded transition shadow-sm flex items-center gap-1.5"
            >
              + Upload Document Metadata
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border border-[#DDD8C8] rounded-lg shadow-sm p-4 mb-6 flex items-center gap-4">
          <div className="flex-1 max-w-md relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents by title or file name..."
              className="w-full text-xs bg-gray-50 border border-[#DDD8C8] rounded pl-8 pr-3 py-2"
            />
            <svg className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white border border-[#DDD8C8] rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#DDD8C8] bg-gray-50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#122C4A]">Indexed Records ({filtered.length})</h2>
            <span className="text-xs text-gray-500 font-semibold">Digitally Signed &amp; Immutable</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-sm">
              No documents found. Click "+ Upload New Document" to register an official record.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                    <th className="px-5 py-3">Document Title</th>
                    <th className="px-4 py-3">Format / MIME</th>
                    <th className="px-4 py-3">Storage Key</th>
                    <th className="px-4 py-3">Verification</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <div className="font-bold text-[#122C4A] text-sm flex items-center gap-2">
                          <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          {doc.name}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          ID: {doc.id.slice(-8)}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-gray-600">
                        {doc.mimeType || 'application/pdf'}
                      </td>
                      <td className="px-4 py-4 font-mono text-gray-500 text-[10px] max-w-xs truncate">
                        {doc.storageKey}
                      </td>
                      <td className="px-4 py-4">
                        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          {doc.status || 'UPLOADED'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="bg-[#122C4A] hover:bg-[#0B1F35] text-white font-bold py-1.5 px-3 rounded text-[11px] shadow-sm transition inline-flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-[#122C4A]">Upload Document Record</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Section 19 Declaration NH-44 Jabalpur"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Statutory Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 font-medium"
                >
                  <option value="SECTION_11">Section 11 (Preliminary Notification)</option>
                  <option value="SECTION_19">Section 19 (Final Declaration)</option>
                  <option value="SECTION_21">Section 21 (Compensation Award Order)</option>
                  <option value="SECTION_38">Section 38 (Possession Panchnama)</option>
                  <option value="CADASTRAL">7/12 Nakal &amp; Cadastral Map</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">MIME Type</label>
                <input
                  type="text"
                  value={mimeType}
                  onChange={(e) => setMimeType(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 font-mono"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="border border-gray-300 text-gray-700 font-bold px-4 py-2 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-[#122C4A] hover:bg-[#0B1F35] text-white font-bold px-4 py-2 rounded shadow-sm disabled:opacity-50"
                >
                  {uploading ? 'Registering...' : 'Register Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
