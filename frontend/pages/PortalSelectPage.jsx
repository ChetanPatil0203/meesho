import CustomerLoginPage from './CustomerLoginPage';

export default function PortalSelectPage({ onSelectAdmin, onSelectUser, onLoginSuccess }) {
  return (
    <CustomerLoginPage
      onSelectAdmin={onSelectAdmin}
      onSelectUser={onSelectUser}
      onSuccess={(user) => {
        if (onLoginSuccess) {
          onLoginSuccess(user);
        } else if (onSelectUser) {
          onSelectUser();
        }
      }}
      onNavigate={(page) => {
        if (page === 'admin') onSelectAdmin?.();
        else if (page === 'home') onSelectUser?.();
        else if (page) window.location.hash = `#${page}`;
      }}
    />
  );
}
