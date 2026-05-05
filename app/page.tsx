'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import AppHeader from '@/components/layout/AppHeader';
import BottomNav from '@/components/layout/BottomNav';
import HomePage from '@/components/HomePage';
import FormsPage from '@/components/FormsPage';
import CompletedPage from '@/components/CompletedPage';
import AccountPage from '@/components/AccountPage';
import ServiceModal from '@/components/modals/ServiceModal';
import ApplyModal from '@/components/modals/ApplyModal';
import { useAppStore } from '@/store/app';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function App() {
  const { activePage } = useAppStore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = '/login';
      } else {
        setUser(data.user);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F4ED' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #E8EEF8', borderTopColor: '#003087', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <AppHeader user={user} />
      <main>
        {activePage === 'home' && <HomePage />}
        {activePage === 'forms' && <FormsPage />}
        {activePage === 'completed' && <CompletedPage />}
        {activePage === 'account' && <AccountPage user={user} />}
      </main>
      <BottomNav />
      <ServiceModal />
      <ApplyModal />
    </>
  );
}