'use client';

import {
  User, FileText, Bell, Headphones, Phone,
  Star, LogOut, ChevronRight, MapPin, Shield
} from 'lucide-react';

const menuSections = [
  {
    title: 'Account',
    items: [
      { icon: User,      label: 'Edit Profile',   color: '#003087', bg: '#E8EEF8' },
      { icon: FileText,  label: 'My Documents',   color: '#003087', bg: '#E8EEF8' },
      { icon: MapPin,    label: 'Address Book',    color: '#003087', bg: '#E8EEF8' },
      { icon: Bell,      label: 'Notifications',   color: '#003087', bg: '#E8EEF8' },
      { icon: Shield,    label: 'Privacy & Security', color: '#003087', bg: '#E8EEF8' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: Headphones, label: 'Help & Support',   color: '#003087', bg: '#E8EEF8' },
      { icon: Phone,      label: 'Contact Agent',    color: '#003087', bg: '#E8EEF8' },
      { icon: Star,       label: 'Rate Us',           color: '#003087', bg: '#E8EEF8' },
    ],
  },
];

export default function AccountPage() {
  return (
    <div style={{ overflowY: 'auto', height: 'calc(100vh - 60px)', paddingBottom: 88 }}>
      {/* Profile header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #003087, #1a4fa0)',
          padding: '20px 18px 36px',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: 66,
            height: 66,
            borderRadius: '50%',
            background: '#FF9933',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'DM Serif Display', serif",
            fontSize: 26,
            color: '#fff',
            marginBottom: 12,
            border: '3px solid rgba(255,255,255,0.3)',
          }}
        >
          R
        </div>
        <div
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 21,
            color: '#fff',
            marginBottom: 3,
          }}
        >
          Rahul Kumar
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 6 }}>
          +91 98765 43210
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', display: 'inline-block' }} />
          Patna, Bihar
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 8,
            marginTop: 18,
          }}
        >
          {[
            { num: '5', label: 'Applied' },
            { num: '2', label: 'In Progress' },
            { num: '3', label: 'Completed' },
          ].map(({ num, label }) => (
            <div
              key={label}
              style={{
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 10,
                padding: '10px 8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{num}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu card */}
      <div
        style={{
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          marginTop: -18,
          padding: '22px 18px 8px',
          minHeight: '100%',
        }}
      >
        {menuSections.map(({ title, items }) => (
          <div key={title} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#9CA3AF',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: 10,
              }}
            >
              {title}
            </div>
            {items.map(({ icon: Icon, label, color, bg }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '13px 14px',
                  background: '#F8F4ED',
                  borderRadius: 12,
                  marginBottom: 8,
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={18} color={color} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#1a2744' }}>{label}</div>
                <ChevronRight size={16} color="#D1D5DB" />
              </div>
            ))}
          </div>
        ))}

        {/* Sign out */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '13px 14px',
            background: '#FFF1F2',
            borderRadius: 12,
            marginBottom: 8,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#FFE4E6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogOut size={18} color="#E11D48" strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#E11D48' }}>Sign Out</div>
        </div>

        {/* Version */}
        <div style={{ textAlign: 'center', padding: '16px 0 4px', fontSize: 11, color: '#D1D5DB' }}>
          RapidForm v1.0.0 &bull; Bihar Government Services
        </div>
      </div>
    </div>
  );
}
