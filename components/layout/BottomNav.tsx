'use client';

import { Home, Clock, CheckCircle, UserCircle } from 'lucide-react';
import { useAppStore, type TabPage } from '@/store/app';

const navItems: { id: TabPage; label: string; icon: React.ElementType }[] = [
  { id: 'home',      label: 'Home',      icon: Home },
  { id: 'forms',     label: 'My Forms',  icon: Clock },
  { id: 'completed', label: 'Completed', icon: CheckCircle },
  { id: 'account',   label: 'Account',   icon: UserCircle },
];

export default function BottomNav() {
  const { activePage, setActivePage } = useAppStore();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        background: '#fff',
        borderTop: '1px solid #E5E7EB',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        padding: '8px 0 20px',
        zIndex: 200,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      }}
    >
      {navItems.map(({ id, label, icon: Icon }) => {
        const active = activePage === id;
        return (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '4px 0',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.15s',
                transform: active ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <Icon size={22} color={active ? '#003087' : '#9CA3AF'} strokeWidth={active ? 2 : 1.8} />
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: active ? '#003087' : '#9CA3AF',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'color 0.15s',
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
