'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { authService, type AuthUser } from '../../../../services/auth.service';
import { compensationService } from '../../../../services/compensation.service';
import { parcelService } from '../../../../services/parcel.service';

export default function ProjectCompensationPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [parcels, setParcels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showPayment, setShowPayment] = useState<string | null>(null);
  const [form, setForm] = useState({ parcelId: '', familyId: '', assessedAmount: '', approvedAmount: '' });
  const [paymentForm, setPaymentForm] = useState({ paidAmount: '', paymentDate: '', remarks: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const session = authService.getSession();
    if (session) setUser(session.user);
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [compData, parcelData] = await Promise.all([
        compensationService.list({ projectId }),
        parcelService.list({ projectId }),
      ]);
      setCases(compData as any || []);
      setParcels(parcelData as any || []);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.parcelId || !form.familyId || !form.assessedAmount) { setError('Parcel, Family, and Assessed Amount are required'); return; }
    try {
      setSaving(true); setError('');
      await compensationService.create({ projectId, parcelId: form.parcelId, familyId: form.familyId, assessedAmount: form.assessedAmount, approvedAmount: form.approvedAmount || form.assessedAmount });
      setForm({ parcelId: '', familyId: '', assessedAmount: '', approvedAmount: '' });
      setShowForm(false);
      await loadData();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleUpdatePayment = async (id: string) => {
    try {
      setSaving(true); setError('');
      await compensationService.updatePayment(id, { paidAmount: paymentForm.paidAmount, paymentDate: paymentForm.paymentDate || undefined, remarks: paymentForm.remarks || undefined });
      setShowPayment(null);
      setPaymentForm({ paidAmount: '', paymentDate: '', remarks: '' });
      await loadData();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const canManage = user && ['ADMIN', 'CENTRAL_OFFICER', 'STATE_OFFICER', 'DISTRICT_OFFICER'].includes(user.role);
  const fmt = (v: any) => v ? `₹${Number(v).toLocaleString('en-IN')}` : '₹0';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#122C4A]">Compensation Cases</h2>
        {canManage && <button onClick={() => setShowForm(!showForm)} className="bg-[#1D5FA8] hover:bg-[#174C8A] text-white px-4 py-2 rounded-lg text-sm font-semibold">{showForm ? 'Cancel' : '+ New Case'}</button>}
      </div>
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">{error}</div>}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-[#E8E4D9] rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-[#122C4A] mb-4">Create Compensation Case</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5B6472] mb-1">Parcel *</label>
              <select value={form.parcelId} onChange={(e) => setForm({ ...form, parcelId: e.target.value })}
                className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm">
                <option value="">Select Parcel</option>
                {parcels.map((p: any) => <option key={p.id} value={p.id}>{p.parcelNumber} - {p.village || 'N/A'}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5B6472] mb-1">Family ID *</label>
              <input type="text" value={form.familyId} onChange={(e) => setForm({ ...form, familyId: e.target.value })}
                className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm" placeholder="Affected Family ID" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5B6472] mb-1">Assessed Amount (₹) *</label>
              <input type="number" value={form.assessedAmount} onChange={(e) => setForm({ ...form, assessedAmount: e.target.value })}
                className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm" placeholder="e.g. 8050000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5B6472] mb-1">Approved Amount (₹)</label>
              <input type="number" value={form.approvedAmount} onChange={(e) => setForm({ ...form, approvedAmount: e.target.value })}
                className="w-full border border-[#DDD8C8] rounded-lg px-3 py-2 text-sm" placeholder="Same as assessed if blank" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="mt-4 bg-[#1D5FA8] text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
            {saving ? 'Saving...' : 'Create Case'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#DDD8C8] border-t-[#1D5FA8] rounded-full animate-spin" /></div>
      ) : cases.length === 0 ? (
        <div className="bg-white border border-[#E8E4D9] rounded-xl p-8 text-center text-[#5B6472]">No compensation cases</div>
      ) : (
        <div className="space-y-4">
          {cases.map((c: any) => (
            <div key={c.id} className="bg-white border border-[#E8E4D9] rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-[#122C4A]">{c.family?.headOfFamily || c.family?.familyReference || c.familyId}</div>
                  <div className="text-xs text-[#5B6472] mt-1">Parcel: {c.parcel?.parcelNumber || c.parcelId} • {c.parcel?.village || ''}</div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === 'PAID' ? 'bg-green-100 text-green-800' : c.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{c.status}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.paymentStatus === 'DISBURSED' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>{c.paymentStatus}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                <div><span className="text-[#5B6472]">Assessed:</span> <span className="font-medium">{fmt(c.assessedAmount)}</span></div>
                <div><span className="text-[#5B6472]">Approved:</span> <span className="font-medium">{fmt(c.approvedAmount)}</span></div>
                <div><span className="text-[#5B6472]">Paid:</span> <span className="font-medium text-green-700">{fmt(c.paidAmount)}</span></div>
                <div><span className="text-[#5B6472]">Pending:</span> <span className="font-medium text-red-700">{fmt(c.pendingAmount)}</span></div>
              </div>
              {canManage && (
                <div className="mt-3 pt-3 border-t border-[#E8E4D9]">
                  {showPayment === c.id ? (
                    <div className="flex flex-wrap gap-2 items-end">
                      <div>
                        <label className="block text-xs text-[#5B6472] mb-1">Payment Amount</label>
                        <input type="number" value={paymentForm.paidAmount} onChange={(e) => setPaymentForm({ ...paymentForm, paidAmount: e.target.value })}
                          className="border border-[#DDD8C8] rounded px-2 py-1.5 text-xs w-36" />
                      </div>
                      <div>
                        <label className="block text-xs text-[#5B6472] mb-1">Payment Date</label>
                        <input type="date" value={paymentForm.paymentDate} onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                          className="border border-[#DDD8C8] rounded px-2 py-1.5 text-xs" />
                      </div>
                      <button onClick={() => handleUpdatePayment(c.id)} disabled={saving} className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-50">
                        {saving ? '...' : 'Update Payment'}
                      </button>
                      <button onClick={() => setShowPayment(null)} className="text-[#5B6472] text-xs">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setShowPayment(c.id)} className="text-[#1D5FA8] text-xs font-semibold hover:underline">
                      💰 Update Payment
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
