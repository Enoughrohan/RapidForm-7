'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  User, FileText, Bell, Headphones, Phone,
  Star, LogOut, ChevronRight, MapPin, Shield
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const menuSections = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Edit Profile', color: '#003087', bg: '#E8EEF8' },
      { icon: FileText, label: 'My Documents', color: '#003087', bg: '#E8EEF8' },
      { icon: MapPin, label: 'Address Book', color: '#003087', bg: '#E8EEF8' },
      { icon: Bell, label: 'Notifications', color: '#003087', bg: '#E8EEF8' },
      { icon: Shield, label: 'Privacy & Security', color: '#003087', bg: '#E8EEF8' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: Headphones, label: 'Help & Support', color: '#003087', bg: '#E8EEF8' },
      { icon: Phone, label: 'Contact Agent', color: '#003087', bg: '#E8EEF8' },
      { icon: Star, label: 'Rate Us', color: '#003087', bg: '#E8EEF8' },
    ],
  },
];

async function handleLogout() {
  await supabase.auth.signOut();
  window.location.href = '/login';
}

export default function AccountPage({ user }: { user: any }) {
  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || user?.phone || '';
  const avatar = user?.user_metadata?.avatar_url;
  const initial = name.charAt(0).toUpperCase();

  const [stats, setStats] = useState({ applied: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('applications')
      .select('status')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (!data) return;
        setStats({
          applied: data.length,
          inProgress: data.filter(a => ['submitted', 'docs_pending', 'under_review', 'approved'].includes(a.status)).length,
          completed: data.filter(a => a.status === 'completed').length,
        });
      });
  }, [user]);

  return (
    <div style={{ overflowY: 'auto', height: 'calc(100vh - 60px)', paddingBottom: 88 }}>
      <div style={{ background: 'linear-gradient(135deg, #003087, #1a4fa0)', padding: '20px 18px 36px' }}>
        {avatar ? (
          <img src={avatar} alt={name} style={{ width: 66, height: 66, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)', marginBottom: 12, objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 66, height: 66, borderRadius: '50%', background: '#FF9933', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Serif Display', serif", fontSize: 26, color: '#fff', marginBottom: 12, border: '3px solid rgba(255,255,255,0.3)' }}>
            {initial}
          </div>
        )}
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 21, color: '#fff', marginBottom: 3 }}>{name}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{email}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 18 }}>
          {[
            { num: stats.applied, label: 'Applied' },
            { num: stats.inProgress, label: 'In Progress' },
            { num: stats.completed, label: 'Completed' },
          ].map(({ num, label }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{num}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', marginTop: -18, padding: '22px 18px 8px', minHeight: '100%' }}>
        {menuSections.map(({ title, items }) => (
          <div key={title} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>{title}</div>
            {items.map(({ icon: Icon, label, color, bg }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', background: '#F8F4ED', borderRadius: 12, marginBottom: 8, cursor: 'pointer' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={color} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#1a2744' }}>{label}</div>
                <ChevronRight size={16} color="#D1D5DB" />
              </div>
            ))}
          </div>
        ))}

        <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', background: '#FFF1F2', borderRadius: 12, marginBottom: 8, cursor: 'pointer' }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: '#FFE4E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogOut size={18} color="#E11D48" strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#E11D48' }}>Sign Out</div>
        </div>

        <div style={{ textAlign: 'center', padding: '16px 0 4px', fontSize: 11, color: '#D1D5DB' }}>
          RapidForm v1.0.0 — Bihar Government Services
        </div>
      </div>
    </div>
  );
}