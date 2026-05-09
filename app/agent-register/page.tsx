'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Zap, CheckCircle } from 'lucide-react';

const biharDistricts = [
  'Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Purnia',
  'Arrah (Bhojpur)', 'Begusarai', 'Munger', 'Chapra (Saran)', 'Madhubani',
  'Sitamarhi', 'Vaishali', 'Nalanda', 'Nawada', 'Jehanabad', 'Aurangabad',
  'Rohtas', 'Buxar', 'Kaimur', 'Siwan', 'Gopalganj', 'West Champaran',
  'East Champaran', 'Sheohar', 'Samastipur', 'Khagaria', 'Supaul',
  'Madhepura', 'Saharsa', 'Kishanganj', 'Araria', 'Katihar', 'Jamui',
  'Lakhisarai', 'Sheikhpura', 'Banka',
];

export default function AgentRegister() {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    district: '',
    aadhaar: '',
  });

  function update(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  async function handleSubmit() {
    if (!form.full_name || !form.phone || !form.email || !form.district || !form.aadhaar) {
      setError('Saare fields bharna zaroori hai');
      return;
    }
    if (form.phone.length !== 10) {
      setError('Valid 10 digit mobile number daalo');
      return;
    }
    if (form.aadhaar.length !== 12) {
      setError('Valid 12 digit Aadhaar number daalo');
      return;
    }

    setLoading(true);
    setError('');

    const { error: dbError } = await supabase
      .from('agents')
      .insert({
        full_name: form.full_name,
        phone: form.phone,
        email: form.email,
        district: form.district,
        aadhaar: form.aadhaar,
        status: 'pending',
      });

    if (dbError) {
      setError('Error aaya. Dobara try karo.');
      setLoading(false);
      return;
    }

    setStep('success');
    setLoading(false);
  }

  const inputStyle = {
    width: '100%',
    padding: '13px 14px',
    border: '1.5px solid #E5E7EB',
    borderRadius: 12,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: '#1a2744',
    outline: 'none',
    background: '#fff',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#4B5563',
    marginBottom: 6,
  } as const;

  return (
    <div style={{ minHeight: '100vh', background: '#F8F4ED', padding: '24px 20px', maxWidth: 430, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, background: '#003087', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
          <Zap size={24} color="#FF9933" strokeWidth={2.5} />
        </div>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#1a2744' }}>RapidForm</div>
        <div style={{ fontSize: 12, color: '#6B7280' }}>Agent Registration</div>
      </div>

      {step === 'form' ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: '24px 20px', boxShadow: '0 4px 24px rgba(0,48,135,0.10)' }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#1a2744', marginBottom: 6 }}>
            Agent Banne ke Liye Apply Karein
          </div>
          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 20, lineHeight: 1.5 }}>
            Apni details bharein — RapidForm team 24 ghante mein verify karegi aur aapko approve karegi.
          </div>

          {/* Notice */}
          <div style={{ background: '#FFF3E6', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: '#FF9933', lineHeight: 1.5, fontWeight: 500 }}>
            Sirf Bihar ke residents apply kar sakte hain. Aadhaar verification zaroori hai.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Poora Naam *</label>
              <input style={inputStyle} type="text" placeholder="Apna poora naam likhein" value={form.full_name} onChange={e => update('full_name', e.target.value)} />
            </div>

            <div>
              <label style={labelStyle}>Mobile Number *</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '13px 12px', background: '#F8F4ED', fontSize: 14, color: '#1a2744', fontWeight: 600, borderRight: '1.5px solid #E5E7EB' }}>+91</div>
                <input type="tel" placeholder="XXXXX XXXXX" value={form.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} style={{ flex: 1, padding: '13px 14px', border: 'none', outline: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#1a2744', background: '#fff' }} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Email Address *</label>
              <input style={inputStyle} type="email" placeholder="aapka@email.com" value={form.email} onChange={e => update('email', e.target.value)} />
            </div>

            <div>
              <label style={labelStyle}>District *</label>
              <select value={form.district} onChange={e => update('district', e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                <option value="">Apna district chunein</option>
                {biharDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Aadhaar Number *</label>
              <input style={inputStyle} type="tel" placeholder="12 digit Aadhaar number" value={form.aadhaar} onChange={e => update('aadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))} maxLength={12} />
              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Sirf verification ke liye — secure rakha jayega</div>
            </div>
          </div>

          {error && (
            <div style={{ fontSize: 12, color: '#E11D48', marginTop: 12, padding: '8px 12px', background: '#FEE2E2', borderRadius: 8 }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%', padding: '15px 0', background: loading ? '#9CA3AF' : '#003087', color: '#fff', border: 'none', borderRadius: 14, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 22 }}
          >
            {loading ? 'Submit ho raha hai...' : 'Application Submit Karein'}
          </button>

          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 16, textAlign: 'center', lineHeight: 1.5 }}>
            Submit karne ke baad RapidForm team aapko 24 ghante mein contact karegi
          </div>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 20, padding: '32px 24px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,48,135,0.10)' }}>
          <div style={{ width: 72, height: 72, background: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <CheckCircle size={36} color="#059669" strokeWidth={1.8} />
          </div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#1a2744', marginBottom: 10 }}>
            Application Submit Ho Gayi!
          </div>
          <div style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6, marginBottom: 24 }}>
            Aapki agent application receive ho gayi hai. RapidForm team 24 ghante mein aapko call karegi aur verification complete karegi.
          </div>
          <div style={{ background: '#F0F4FC', borderRadius: 12, padding: '14px 18px', marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: '#003087', fontWeight: 600, marginBottom: 4 }}>Aage Kya Hoga:</div>
            <div style={{ fontSize: 12, color: '#4B5563', lineHeight: 1.8, textAlign: 'left' }}>
              1. Team aapka Aadhaar verify karegi<br />
              2. Video call se identity confirm hogi<br />
              3. Agent agreement sign karna hoga<br />
              4. Dashboard access milega
            </div>
          </div>
          <a href="/" style={{ display: 'block', padding: '14px 0', background: '#003087', color: '#fff', borderRadius: 14, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
            Home Par Jaayein
          </a>
        </div>
      )}
    </div>
  );
}
