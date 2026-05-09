'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, Download, Share2, Star } from 'lucide-react';



export default function CompletedPage() {
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
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
      setApps(data || []);
      setLoading(false);
    }
    fetchApps();
  }, []);

  return (
    <div style={{ overflowY: 'auto', height: 'calc(100vh - 60px)', paddingBottom: 88 }}>
      <div style={{ padding: '16px 18px 4px', fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#1a2744' }}>
        Completed
      </div>
      <div style={{ padding: '0 18px 8px', fontSize: 12, color: '#9CA3AF' }}>
        {loading ? 'Loading...' : `${apps.length} applications completed`}
      </div>

      {!loading && apps.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px 30px' }}>
          <div style={{ width: 64, height: 64, background: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle2 size={28} color="#059669" />
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1a2744', marginBottom: 6 }}>Koi completed application nahi</div>
          <div style={{ fontSize: 13, color: '#6B7280' }}>Jab application complete hogi — yahan dikhegi</div>
        </div>
      )}

      {apps.map((app) => (
        <div key={app.id} style={{ margin: '10px 18px 0', background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,48,135,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2744' }}>{app.service_name}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{app.ref_id}</div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 50, background: '#DCFCE7', color: '#166534' }}>
              Completed
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: '#DCFCE7', borderRadius: 8, marginBottom: 12 }}>
            <CheckCircle2 size={14} color="#166534" />
            <span style={{ fontSize: 12, color: '#166534', fontWeight: 500 }}>
              {new Date(app.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button style={{ padding: '10px 0', background: '#E8EEF8', color: '#003087', border: 'none', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <Download size={13} /> Download
            </button>
            <button style={{ padding: '10px 0', background: '#FFF3E6', color: '#FF9933', border: 'none', borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              <Share2 size={13} /> Share
            </button>
          </div>
        </div>
      ))}

      <div style={{ margin: '16px 18px 0', background: '#F8F4ED', borderRadius: 14, padding: '16px 18px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a2744', marginBottom: 4 }}>Happy with our service?</div>
        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>Rate us on Google Play</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={24} color="#FF9933" fill="#FF9933" style={{ cursor: 'pointer' }} />
          ))}
        </div>
      </div>
    </div>
  );
}