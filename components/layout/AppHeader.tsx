'use client';

import { Bell, Zap } from 'lucide-react';

export default function AppHeader() {
  return (
    <header
      style={{
        background: '#003087',
        padding: '14px 18px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        maxWidth: 430,
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            background: '#FF9933',
            borderRadius: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Zap size={18} color="#fff" strokeWidth={2.5} />
        </div>
        <div>
          <div
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 20,
              color: '#fff',
              lineHeight: 1.2,
              letterSpacing: '-0.3px',
            }}
          >
            RapidForm
          </div>
          <div
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            Bihar Government Services
          </div>
        </div>
      </div>
      <button
        style={{
          width: 36,
          height: 36,
          background: 'rgba(255,255,255,0.12)',
          borderRadius: 10,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Bell size={18} color="#fff" />
      </button>
    </header>
  );
}
