'use client';

import AppHeader from '@/components/layout/AppHeader';
import BottomNav from '@/components/layout/BottomNav';
import HomePage from '@/components/HomePage';
import FormsPage from '@/components/FormsPage';
import CompletedPage from '@/components/CompletedPage';
import AccountPage from '@/components/AccountPage';
import ServiceModal from '@/components/modals/ServiceModal';
import ApplyModal from '@/components/modals/ApplyModal';
import { useAppStore } from '@/store/app';

export default function App() {
  const { activePage } = useAppStore();

  return (
    <>
      <AppHeader />

      <main style={{ position: 'relative' }}>
        {activePage === 'home'      && <HomePage />}
        {activePage === 'forms'     && <FormsPage />}
        {activePage === 'completed' && <CompletedPage />}
        {activePage === 'account'   && <AccountPage />}
      </main>

      <BottomNav />
      <ServiceModal />
      <ApplyModal />
    </>
  );
}
