'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Clock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FormsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApps() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .neq('status', 'completed')
        .order('created_at', { ascending: false });
      setApps(data || []);
      setLoading(false);
    }
    fetchApps();
  }, []);

  const statusColor: any = {
    submitted: { bg: '#DBEAFE', color: '#1e40af', label: 'Submitted' },
    docs_pending: { bg: '#FEF3C7', color: '#92400E', label: 'Docs Pending' },
    under_review: { bg: '#F3E8FF', color: '#6B21A8', label: 'Under Review' },
    approved: { bg: '#DCFCE7', color: '#166534', label: 'Approved' },
  };

  return (
    <div style={{ overflowY: 'auto', height: 'calc(100vh - 60px)', paddingBottom: 88 }}>
      <div style={{ padding: '16px 18px 4px', fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#1a2744' }}>
        My Applications
      </div>
      <div style={{ padding: '0 18px 8px', fontSize: 12, color: '#9CA3AF' }}>
        {loading ? 'Loading...' : `${apps.length} active applications`}
      </div>

      {!loading && apps.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px 30px' }}>
          <div style={{ width: 64, height: 64, background: '#E8EEF8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Clock size={28} color="#003087" />
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1a2744', marginBottom: 6 }}>Koi application nahi</div>
          <div style={{ fontSize: 13, color: '#6B7280' }}>Koi bhi service apply karo — yahan dikhega</div>
        </div>
      )}

      {apps.map((app) => {
        const s = statusColor[app.status] || statusColor.submitted;
        return (
          <div key={app.id} style={{ margin: '10px 18px 0', background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,48,135,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2744' }}>{app.service_name}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{app.ref_id}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 50, background: s.bg, color: s.color }}>
                {s.label}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#F8F4ED', borderRadius: 8, fontSize: 12, color: '#4B5563' }}>
              <Clock size={13} color="#9CA3AF" />
              {new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              {app.is_tatkal && <span style={{ background: '#FFF3E6', color: '#FF9933', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 50 }}>Tatkal</span>}
            </div>

            {app.status === 'docs_pending' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: '#FEF3C7', borderRadius: 8, marginTop: 8, fontSize: 12, color: '#92400E' }}>
                <AlertCircle size={13} />
                Documents pending — please upload
              </div>
            )}
          </div>
        );
      })}

      <div style={{ margin: '16px 18px 0', background: 'linear-gradient(135deg, #003087, #1a4fa0)', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3 }}>Apply for more services</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>111+ government services available</div>
        </div>
        <div style={{ width: 36, height: 36, background: '#FF9933', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowRight size={18} color="#fff" />
        </div>
      </div>
    </div>
  );
}