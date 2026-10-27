import { useState } from 'react';
import AdminPortal from './AdminPortal';
import Toast from '../frontend/components/Toast';

export default function AdminApp() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const handleNavigate = (page) => {
    if (page === 'home' || page === 'shop') {
      window.location.href = '/';
    } else {
      window.location.hash = `#${page}`;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      <AdminPortal onNavigate={handleNavigate} onShowToast={showToast} />

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[90] space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          />
        ))}
      </div>
    </div>
  );
}
