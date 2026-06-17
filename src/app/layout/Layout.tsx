import { Outlet } from 'react-router-dom';
import { NotificationModal } from '../../shared/components/ui';
import { Footer } from './Footer';
import { Header } from './Header';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans antialiased">
      <NotificationModal />

      <Header />

      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};