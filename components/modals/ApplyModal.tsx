'use client';

import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/store/app';
import { generateRef } from '@/lib/utils';

export default function ApplyModal() {
  const { applyModalOpen, applyTatkal, closeApply, selectedService, setSuccessRef, setActivePage } = useAppStore();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(false);

  if (!applyModalOpen) return null;

  const biharDistricts = [
    'Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Purnia',
    'Arrah (Bhojpur)', 'Begusarai', 'Munger', 'Chapra (Saran)', 'Madhubani',
    'Sitamarhi', 'Vaishali', 'Nalanda', 'Nawada', 'Jehanabad', 'Aurangabad',
    'Rohtas', 'Buxar', 'Kaimur', 'Siwan', 'Gopalganj', 'West Champaran',
    'East Champaran', 'Sheohar', 'Samastipur', 'Khagaria', 'Supaul',
    'Madhepura', 'Saharsa', 'Kishanganj', 'Araria', 'Katihar', 'Jamui',
    'Lakhisarai', 'Sheikhpura', 'Banka', 'Other',
  ];

  async function handleSubmit() {
    if (!name.trim() || !phone.trim() || !district) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    const ref = generateRef();
    setSuccessRef(ref);
    setLoading(false);
    setStep('success');
  }

  function handleClose() {
    closeApply();
    setStep('form');
    setName('');
    setPhone('');
    setDistrict('');
    setSuccessRef(null);
  }

  function handleViewForms() {
    handleClose();
    setActivePage('forms');
  }

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 700,
          backdropFilter: 'blur(2px)',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 430,
          background: '#fff',
          borderRadius: '22px 22px 0 0',
          zIndex: 800,
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'slideUp2 0.28s cubic-bezier(0.34,1.2,0.64,1) forwards',
        }}
      >
        <style>{`
          @keyframes slideUp2 {
            from { transform: translateX(-50%) translateY(100%); }
            to   { transform: translateX(-50%) translateY(0); }
          }
          .rf-input {
            width: 100%;
            padding: 13px 14px;
            border: 1.5px solid #E5E7EB;
            border-radius: 12px;
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
            color: #1a2744;
            outline: none;
            background: #fff;
            transition: border-color 0.15s;
          }
          .rf-input:focus { border-color: #003087; }
          .rf-select {
            width: 100%;
            padding: 13px 14px;
            border: 1.5px solid #E5E7EB;
            border-radius: 12px;
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
            color: #1a2744;
            outline: none;
            background: #fff;
            appearance: none;
            -webkit-appearance: none;
            cursor: pointer;
          }
          .rf-select:focus { border-color: #003087; }
        `}</style>

        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 6 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: '#E5E7EB' }} />
        </div>

        {step === 'form' ? (
          <div style={{ padding: '8px 20px 40px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#1a2744', lineHeight: 1.2 }}>
                  Start Application
                </div>
                {applyTatkal && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      background: '#FFF3E6',
                      color: '#FF9933',
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: 50,
                      marginTop: 6,
                    }}
                  >
                    ⚡ Tatkal — 24hr Delivery
                  </div>
                )}
              </div>
              <button
                onClick={handleClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#F3F4F6',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <X size={16} color="#6B7280" />
              </button>
            </div>

            {/* Info notice */}
            <div
              style={{
                background: '#F0F4FC',
                borderRadius: 10,
                padding: '10px 14px',
                marginBottom: 20,
                fontSize: 12,
                color: '#003087',
                lineHeight: 1.5,
              }}
            >
              Our agent will contact you within 30 minutes to collect documents securely.
            </div>

            {/* Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>
                  Full Name *
                </label>
                <input
                  className="rf-input"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>
                  Mobile Number *
                </label>
                <input
                  className="rf-input"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={13}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>
                  District *
                </label>
                <select
                  className="rf-select"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  <option value="">Select your district</option>
                  {biharDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !name.trim() || !phone.trim() || !district}
              style={{
                width: '100%',
                padding: '15px 0',
                background: loading || !name.trim() || !phone.trim() || !district ? '#9CA3AF' : '#003087',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                cursor: loading || !name.trim() || !phone.trim() || !district ? 'not-allowed' : 'pointer',
                marginTop: 22,
                transition: 'background 0.15s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      border: '2px solid rgba(255,255,255,0.4)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite',
                    }}
                  />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          /* Success state */
          <div style={{ padding: '20px 24px 44px', textAlign: 'center' }}>
            <div
              style={{
                width: 72,
                height: 72,
                background: '#DCFCE7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
              }}
            >
              <CheckCircle size={36} color="#059669" strokeWidth={1.8} />
            </div>

            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#1a2744', marginBottom: 8 }}>
              Application Submitted!
            </div>
            <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6, marginBottom: 20 }}>
              Our agent will call you within 30 minutes. Keep your documents ready.
            </div>

            <div
              style={{
                background: '#F8F4ED',
                borderRadius: 12,
                padding: '14px 18px',
                marginBottom: 24,
              }}
            >
              <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Reference Number</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#003087', letterSpacing: '0.5px' }}>
                {generateRef()}
              </div>
            </div>

            <button
              onClick={handleViewForms}
              style={{
                width: '100%',
                padding: '14px 0',
                background: '#003087',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: 10,
              }}
            >
              Track Application
            </button>
            <button
              onClick={handleClose}
              style={{
                width: '100%',
                padding: '13px 0',
                background: '#F8F4ED',
                color: '#4B5563',
                border: 'none',
                borderRadius: 14,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Back to Services
            </button>
          </div>
        )}
      </div>
    </>
  );
}
