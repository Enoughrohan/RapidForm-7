'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, Users, FileText, Clock, Search } from 'lucide-react';

const ADMIN_PASSWORD = 'rapidform@2024';

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [activeTab, setActiveTab] = useState<'agents' | 'applications'>('agents');
  const [agents, setAgents] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (authed) fetchAll();
  }, [authed]);

  async function fetchAll() {
    setLoading(true);
    const [agentsRes, appsRes] = await Promise.all([
      supabase.from('agents').select('*').order('created_at', { ascending: false }),
      supabase.from('applications').select('*').order('created_at', { ascending: false }),
    ]);
    setAgents(agentsRes.data || []);
    setApplications(appsRes.data || []);
    setLoading(false);
  }

  async function updateAgentStatus(id: string, status: string) {
    setUpdating(id);
    await supabase.from('agents').update({ status }).eq('id', id);
    await fetchAll();
    setUpdating(null);
  }

  async function updateAppStatus(id: string, status: string) {
    setUpdating(id);
    await supabase.from('applications').update({ status }).eq('id', id);
    await fetchAll();
    setUpdating(null);
  }

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError('');
    } else {
      setPwError('Wrong password');
    }
  }

  const filteredAgents = agents.filter(a =>
    search === '' ||
    a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.district?.toLowerCase().includes(search.toLowerCase()) ||
    a.phone?.includes(search)
  );

  const filteredApps = applications.filter(a =>
    search === '' ||
    a.service_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.ref_id?.toLowerCase().includes(search.toLowerCase()) ||
    a.district?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    totalAgents: agents.length,
    pendingAgents: agents.filter(a => a.status === 'pending').length,
    approvedAgents: agents.filter(a => a.status === 'approved').length,
    totalApps: applications.length,
    pendingApps: applications.filter(a => ['submitted', 'docs_pending', 'under_review'].includes(a.status)).length,
    completedApps: applications.filter(a => a.status === 'completed').length,
  };

  // Login screen
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F4ED', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '32px 28px', width: '100%', maxWidth: 380, boxShadow: '0 4px 24px rgba(0,48,135,0.12)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 52, height: 52, background: '#003087', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <span style={{ fontSize: 22 }}>🔐</span>
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: '#1a2744' }}>Admin Panel</div>
            <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>RapidForm Bihar</div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#4B5563', marginBottom: 6 }}>Password</label>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '13px 14px', border: '1.5px solid #E5E7EB', borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#1a2744', outline: 'none' }}
            />
          </div>
          {pwError && <div style={{ fontSize: 12, color: '#E11D48', marginBottom: 12 }}>{pwError}</div>}
          <button
            onClick={handleLogin}
            style={{ width: '100%', padding: '14px 0', background: '#003087', color: '#fff', border: 'none', borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F4ED', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ background: '#003087', padding: '16px 18px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#fff' }}>Admin Panel</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>RapidForm Bihar</div>
          </div>
          <button onClick={() => setAuthed(false)} style={{ padding: '7px 16px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px 18px 40px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { num: stats.totalAgents,    label: 'Total Agents',    color: '#003087' },
            { num: stats.pendingAgents,  label: 'Pending Agents',  color: '#92400E' },
            { num: stats.approvedAgents, label: 'Active Agents',   color: '#166634' },
            { num: stats.totalApps,      label: 'Total Apps',      color: '#003087' },
            { num: stats.pendingApps,    label: 'Pending Apps',    color: '#92400E' },
            { num: stats.completedApps,  label: 'Completed Apps',  color: '#166534' },
          ].map(({ num, label, color }) => (
            <div key={label} style={{ background: '#fff', borderRadius: 12, padding: '12px 10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,48,135,0.08)' }}>
              <div style={{ fontSize: 22, fontFamily: "'DM Serif Display', serif", color }}>{num}</div>
              <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[
            { id: 'agents', label: `Agents (${agents.length})`, icon: Users },
            { id: 'applications', label: `Applications (${applications.length})`, icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id as any); setSearch(''); }}
              style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer', background: activeTab === id ? '#003087' : '#fff', color: activeTab === id ? '#fff' : '#4B5563', boxShadow: '0 2px 8px rgba(0,48,135,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', boxShadow: '0 2px 8px rgba(0,48,135,0.08)', marginBottom: 14 }}>
          <Search size={16} color="#9CA3AF" />
          <input
            type="text"
            placeholder={activeTab === 'agents' ? 'Search agents...' : 'Search applications...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#1a2744', flex: 1, background: 'transparent' }}
          />
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF' }}>Loading...</div>}

        {/* Agents Tab */}
        {!loading && activeTab === 'agents' && filteredAgents.map(agent => (
          <div key={agent.id} style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,48,135,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1a2744' }}>{agent.full_name}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{agent.district} • {agent.phone}</div>
                {agent.email && <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{agent.email}</div>}
              </div>
              <div style={{
                fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 50,
                background: agent.status === 'approved' ? '#DCFCE7' : agent.status === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                color: agent.status === 'approved' ? '#166534' : agent.status === 'rejected' ? '#991B1B' : '#92400E',
              }}>
                {agent.status === 'approved' ? 'Approved' : agent.status === 'rejected' ? 'Rejected' : 'Pending'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
              <div style={{ background: '#F8F4ED', borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ fontSize: 10, color: '#9CA3AF' }}>Aadhaar</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2744' }}>
                  {agent.aadhaar ? `XXXX XXXX ${agent.aadhaar.slice(-4)}` : 'N/A'}
                </div>
              </div>
              <div style={{ background: '#F8F4ED', borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ fontSize: 10, color: '#9CA3AF' }}>Applied On</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2744' }}>
                  {new Date(agent.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>

            {agent.status === 'pending' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  onClick={() => updateAgentStatus(agent.id, 'approved')}
                  disabled={updating === agent.id}
                  style={{ padding: '10px 0', background: '#DCFCE7', color: '#166534', border: 'none', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                >
                  <CheckCircle size={14} /> Approve
                </button>
                <button
                  onClick={() => updateAgentStatus(agent.id, 'rejected')}
                  disabled={updating === agent.id}
                  style={{ padding: '10px 0', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                >
                  <XCircle size={14} /> Reject
                </button>
              </div>
            )}

            {agent.status === 'approved' && (
              <button
                onClick={() => updateAgentStatus(agent.id, 'rejected')}
                disabled={updating === agent.id}
                style={{ width: '100%', padding: '10px 0', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Revoke Access
              </button>
            )}

            {agent.status === 'rejected' && (
              <button
                onClick={() => updateAgentStatus(agent.id, 'approved')}
                disabled={updating === agent.id}
                style={{ width: '100%', padding: '10px 0', background: '#DCFCE7', color: '#166534', border: 'none', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Re-Approve
              </button>
            )}
          </div>
        ))}

        {/* Applications Tab */}
        {!loading && activeTab === 'applications' && filteredApps.map(app => {
          const statusMap: any = {
            submitted:    { bg: '#DBEAFE', color: '#1e40af', label: 'Submitted' },
            docs_pending: { bg: '#FEF3C7', color: '#92400E', label: 'Docs Pending' },
            under_review: { bg: '#F3E8FF', color: '#6B21A8', label: 'Under Review' },
            approved:     { bg: '#DCFCE7', color: '#166534', label: 'Approved' },
            completed:    { bg: '#DCFCE7', color: '#166534', label: 'Completed' },
            rejected:     { bg: '#FEE2E2', color: '#991B1B', label: 'Rejected' },
          };
          const s = statusMap[app.status] || statusMap.submitted;

          return (
            <div key={app.id} style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,48,135,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2744' }}>{app.service_name}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{app.ref_id} • {app.district}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 50, background: s.bg, color: s.color, flexShrink: 0 }}>
                  {s.label}
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {Object.entries(statusMap).map(([val, cfg]: any) => (
                  <button
                    key={val}
                    onClick={() => updateAppStatus(app.id, val)}
                    disabled={app.status === val || updating === app.id}
                    style={{
                      padding: '5px 12px', borderRadius: 50, fontSize: 11, fontWeight: 600,
                      cursor: app.status === val ? 'default' : 'pointer',
                      border: '1.5px solid transparent', fontFamily: "'DM Sans', sans-serif",
                      background: app.status === val ? cfg.bg : '#F8F4ED',
                      color: app.status === val ? cfg.color : '#6B7280',
                      borderColor: app.status === val ? cfg.color : 'transparent',
                    }}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
