'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Filter, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

const statusOptions = [
  { value: 'submitted',    label: 'Submitted',    bg: '#DBEAFE', color: '#1e40af' },
  { value: 'docs_pending', label: 'Docs Pending', bg: '#FEF3C7', color: '#92400E' },
  { value: 'under_review', label: 'Under Review', bg: '#F3E8FF', color: '#6B21A8' },
  { value: 'approved',     label: 'Approved',     bg: '#DCFCE7', color: '#166534' },
  { value: 'completed',    label: 'Completed',    bg: '#DCFCE7', color: '#166534' },
  { value: 'rejected',     label: 'Rejected',     bg: '#FEE2E2', color: '#991B1B' },
];

export default function AgentDashboard() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updating, setUpdating] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    const { data } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setApps(data);
      setStats({
        total: data.length,
        pending: data.filter(a => ['submitted', 'docs_pending', 'under_review'].includes(a.status)).length,
        completed: data.filter(a => a.status === 'completed').length,
      });
    }
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    await supabase.from('applications').update({ status }).eq('id', id);
    await fetchAll();
    setUpdating(null);
  }

  const filtered = apps.filter(app => {
    const matchSearch = search === '' ||
      app.service_name?.toLowerCase().includes(search.toLowerCase()) ||
      app.ref_id?.toLowerCase().includes(search.toLowerCase()) ||
      app.district?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatus = (s: string) => statusOptions.find(o => o.value === s) || statusOptions[0];

  return (
    <div style={{ minHeight: '100vh', background: '#F8F4ED', fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* Header */}
      <div style={{ background: '#003087', padding: '16px 18px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 430, margin: '0 auto' }}>
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#fff' }}>Agent Dashboard</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>RapidForm Bihar</div>
          </div>
          <div style={{ width: 36, height: 36, background: '#FF9933', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Serif Display', serif", fontSize: 16, color: '#fff' }}>A</div>
        </div>
      </div>

      <div style={{ maxWidth: 430, margin: '0 auto', paddingBottom: 40 }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '14px 18px 0' }}>
          {[
            { num: stats.total,     label: 'Total',     bg: '#E8EEF8', color: '#003087' },
            { num: stats.pending,   label: 'Pending',   bg: '#FEF3C7', color: '#92400E' },
            { num: stats.completed, label: 'Completed', bg: '#DCFCE7', color: '#166534' },
          ].map(({ num, label, bg, color }) => (
            <div key={label} style={{ background: '#fff', borderRadius: 12, padding: '12px 10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,48,135,0.08)' }}>
              <div style={{ fontSize: 22, fontFamily: "'DM Serif Display', serif", color }}>{num}</div>
              <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ padding: '14px 18px 0' }}>
          <div style={{ background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', boxShadow: '0 2px 8px rgba(0,48,135,0.08)' }}>
            <Search size={16} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Search by name, ref, district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#1a2744', flex: 1, background: 'transparent' }}
            />
          </div>
        </div>

        {/* Filter */}
        <div className="no-scrollbar" style={{ overflowX: 'auto', padding: '12px 18px 0', display: 'flex', gap: 8 }}>
          <button
            onClick={() => setFilterStatus('all')}
            style={{ whiteSpace: 'nowrap', padding: '7px 14px', borderRadius: 50, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1.5px solid transparent', fontFamily: "'DM Sans', sans-serif", background: filterStatus === 'all' ? '#003087' : '#fff', color: filterStatus === 'all' ? '#fff' : '#4B5563', borderColor: filterStatus === 'all' ? '#003087' : '#E5E7EB' }}
          >
            All ({apps.length})
          </button>
          {statusOptions.map(s => (
            <button
              key={s.value}
              onClick={() => setFilterStatus(s.value)}
              style={{ whiteSpace: 'nowrap', padding: '7px 14px', borderRadius: 50, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1.5px solid transparent', fontFamily: "'DM Sans', sans-serif", background: filterStatus === s.value ? '#003087' : '#fff', color: filterStatus === s.value ? '#fff' : '#4B5563', borderColor: filterStatus === s.value ? '#003087' : '#E5E7EB' }}
            >
              {s.label} ({apps.filter(a => a.status === s.value).length})
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div style={{ padding: '12px 18px 0' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontSize: 14 }}>Loading...</div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontSize: 14 }}>No applications found</div>
          )}

          {filtered.map((app) => {
            const s = getStatus(app.status);
            return (
              <div key={app.id} style={{ background: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,48,135,0.08)' }}>
                
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2744' }}>{app.service_name}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{app.ref_id}</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 50, background: s.bg, color: s.color, flexShrink: 0 }}>
                    {s.label}
                  </div>
                </div>

                {/* Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
                  <div style={{ background: '#F8F4ED', borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2 }}>District</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2744' }}>{app.district}</div>
                  </div>
                  <div style={{ background: '#F8F4ED', borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2 }}>Date</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1a2744' }}>
                      {new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 8 }}>Update Status:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {statusOptions.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => updateStatus(app.id, opt.value)}
                        disabled={app.status === opt.value || updating === app.id}
                        style={{
                          padding: '5px 12px',
                          borderRadius: 50,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: app.status === opt.value ? 'default' : 'pointer',
                          border: '1.5px solid transparent',
                          fontFamily: "'DM Sans', sans-serif",
                          background: app.status === opt.value ? opt.bg : '#F8F4ED',
                          color: app.status === opt.value ? opt.color : '#6B7280',
                          borderColor: app.status === opt.value ? opt.color : 'transparent',
                          opacity: updating === app.id && app.status !== opt.value ? 0.5 : 1,
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
