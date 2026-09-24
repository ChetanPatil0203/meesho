





export default function Toast({ message, type, onClose }) {
  const styles = {
    success: 'bg-white border-l-4 border-green-500 text-gray-800',
    error: 'bg-white border-l-4 border-red-500 text-gray-800',
    info: 'bg-white border-l-4 border-blue-500 text-gray-800'
  };

  const icons = {
    success:
    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
        <svg width="14" height="14" fill="none" stroke="#22C55E" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12" /></svg>
      </div>,

    error:
    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
        <svg width="14" height="14" fill="none" stroke="#EF4444" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </div>,

    info:
    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
        <svg width="14" height="14" fill="none" stroke="#3B5BDB" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
      </div>

  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[260px] max-w-xs pointer-events-auto animate-slide-in ${styles[type]}`}>
      {icons[type]}
      <span className="text-sm font-medium flex-1 leading-snug">{message}</span>
      <button onClick={onClose} className="text-gray-300 hover:text-gray-500 flex-shrink-0 ml-1">
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
    </div>);

}