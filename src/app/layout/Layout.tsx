import { Outlet } from 'react-router-dom';
import { NotificationModal } from '../../shared/components/ui';
import { Header } from './Header';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      <NotificationModal /> 
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};