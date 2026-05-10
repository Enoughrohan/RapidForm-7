'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Clock, AlertCircle, CheckCircle2, LogOut } from 'lucide-react';

const AGENT_PASSWORD = 'agent@rapidform';

const statusOptions = [
  { value: 'submitted',    label: 'Submitted',    bg: '#DBEAFE', color: '#1e40af' },
  { value: 'docs_pending', label: 'Docs Pending', bg: '#FEF3C7', color: '#92400E' },
  { value: 'under_review', label: 'Under Review', bg: '#F3E8FF', color: '#6B21A8' },
  { value: 'approved',     label: 'Approved',     bg: '#DCFCE7', color: '#166534' },
  { value: 'completed',    label: 'Completed',    bg: '#DCFCE7', color: '#166534' },
  { value: 'rejected',     label: 'Rejected',     bg: '#FEE2E2', color: '#991B1B' },
];

export default function AgentDashboard() {
  const [authed, setAuthed] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [agent, setAgent] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updating, setUpdating] = useState<string | null>(null);

  async function handleLogin() {
    if (password !== AGENT_PASSWORD) {
      setLoginError('Wrong password');
      return;
    }
    setLoading(true);
    setLoginError('');

    const { data } = await supabase
      .from('agents')
      .select('*')
      .eq('phone', phone)
      .eq('status', 'approved')
      .single();

    if (!data) {
      setLoginError('Agent nahi mila ya approved nahi hai. Admin se contact karein.');
      setLoading(false);
      return;
    }

    setAgent(data);
    setAuthed(true);
    setLoading(false);
    fetchApps(data.district);
  }

  async function fetchApps(district: string) {
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('district', district)
      .order('created_at', { ascending: false });
    setApps(data || []);
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    await supabase.from('applications').update({ status }).eq('id', id);
    await fetchApps(agent.district);
    setUpdating(null);
  }

  const filtered = apps.filter(app => {
    const matchSearch = search === '' ||
      app.service_name?.toLowerCase().includes(search.toLowerCase()) ||
      app.ref_id?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: apps.length,
    pending: apps.filter(a => ['submitted', 'docs_pending', 'under_review'].includes(a.status)).length,
    completed: apps.filter(a => a.status === 'completed').length,
  };

  const getStatus = (s: string) => statusOptions.find(o => o.value === s) || statusOptions[0];

  // Login screen
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F4ED', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '32px 24px', width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,48,135,0.12)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 52, height: 52, background: '#003087', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <span style={{ fontSize: 22, color: '#FF9933' }}>⚡</span>
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#1a2744' }}>Agent Login</div>
            <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>RapidForm Bihar</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>Registered Mobile Number</label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '13px 12px', background: '#F8F4ED', fontSize: 14, color: '#1a2744', fontWeight: 600, borderRight: '1.5px solid #E5E7EB' }}>+91</div>
                <input
                  type="tel"
                  placeholder="XXXXX XXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  style={{ flex: 1, padding: '13px 14px', border: 'none', outline: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#1a2744', background: '#fff' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>Password</label>
              <input
                type="password"
                placeholder="Agent password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{ width: '100%', padding: '13px 14px', border: '1.5px solid #E5E7EB', borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#1a2744', outline: 'none' }}
              />
            </div>
          </div>

          {loginError && (
            <div style={{ fontSize: 12, color: '#E11D48', marginTop: 12, padding: '8px 12px', background: '#FEE2E2', borderRadius: 8 }}>
              {loginError}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || phone.length !== 10 || !password}
            style={{ width: '100%', padding: '14px 0', background: loading ? '#9CA3AF' : '#003087', color: '#fff', border: 'none', borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 20 }}
          >
            {loading ? 'Checking...' : 'Login'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#9CA3AF' }}>
            Agent nahi hain? <a href="/agent-register" style={{ color: '#003087', fontWeight: 600 }}>Register karein</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F4ED', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ background: '#003087', padding: '14px 18px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: '#fff' }}>
              {agent.full_name}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>
              {agent.district} District Agent
            </div>
          </div>
          <button
            onClick={() => { setAuthed(false); setAgent(null); setApps([]); }}
            style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <LogOut size={16} color="#fff" />
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 430, margin: '0 auto', paddingBottom: 40 }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '14px 18px 0' }}>
          {[
            { num: stats.total,     label: 'Total',     color: '#003087' },
            { num: stats.pending,   label: 'Pending',   color: '#92400E' },
            { num: stats.completed, label: 'Completed', color: '#166534' },
          ].map(({ num, label, color }) => (
            <div key={label} style={{ background: '#fff', borderRadius: 12, padding: '12px 10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,48,135,0.08)' }}>
              <div style={{ fontSize: 22, fontFamily: "'DM Serif Display', serif", color }}>{num}</div>
              <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* District Badge */}
        <div style={{ margin: '12px 18px 0', background: '#E8EEF8', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#003087', flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: '#003087', fontWeight: 600 }}>
            Sirf {agent.district} district ki applications dikh rahi hain
          </span>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 18px 0' }}>
          <div style={{ background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', boxShadow: '0 2px 8px rgba(0,48,135,0.08)' }}>
            <Search size={16} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Search by service or ref..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#1a2744', flex: 1, background: 'transparent' }}
            />
          </div>
        </div>

        {/* Filter */}
        <div className="no-scrollbar" style={{ overflowX: 'auto', padding: '10px 18px 0', display: 'flex', gap: 8 }}>
          <button onClick={() => setFilterStatus('all')} style={{ whiteSpace: 'nowrap', padding: '7px 14px', borderRadius: 50, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', fontFamily: "'DM Sans', sans-serif", background: filterStatus === 'all' ? '#003087' : '#fff', color: filterStatus === 'all' ? '#fff' : '#4B5563' }}>
            All ({apps.length})
          </button>
          {statusOptions.map(s => (
            <button key={s.value} onClick={() => setFilterStatus(s.value)} style={{ whiteSpace: 'nowrap', padding: '7px 14px', borderRadius: 50, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: 'none', fontFamily: "'DM Sans', sans-serif", background: filterStatus === s.value ? '#003087' : '#fff', color: filterStatus === s.value ? '#fff' : '#4B5563' }}>
              {s.label} ({apps.filter(a => a.status === s.value).length})
            </button>
          ))}
        </div>

        {/* Apps List */}
        <div style={{ padding: '12px 18px 0' }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontSize: 14 }}>
              Koi application nahi mili
            </div>
          )}

          {filtered.map(app => {
            const s = getStatus(app.status);
            return (
              <div key={app.id} style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,48,135,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2744' }}>{app.service_name}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{app.ref_id}</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 50, background: s.bg, color: s.color, flexShrink: 0 }}>
                    {s.label}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
                  <div style={{ background: '#F8F4ED', borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>District</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2744' }}>{app.district}</div>
                  </div>
                  <div style={{ background: '#F8F4ED', borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>Date</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2744' }}>
                      {new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 8 }}>Status Update:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {statusOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => updateStatus(app.id, opt.value)}
                        disabled={app.status === opt.value || updating === app.id}
                        style={{
                          padding: '5px 12px', borderRadius: 50, fontSize: 11, fontWeight: 600,
                          cursor: app.status === opt.value ? 'default' : 'pointer',
                          border: '1.5px solid transparent', fontFamily: "'DM Sans', sans-serif",
                          background: app.status === opt.value ? opt.bg : '#F8F4ED',
                          color: app.status === opt.value ? opt.color : '#6B7280',
                          borderColor: app.status === opt.value ? opt.color : 'transparent',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
