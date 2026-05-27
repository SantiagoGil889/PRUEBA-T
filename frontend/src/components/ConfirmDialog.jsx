export function ConfirmDialog({ open, onConfirm, onCancel, message }) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
    }}>
      <div role="dialog" aria-modal="true" style={{
        background: '#fff', borderRadius: 12, padding: '1.5rem',
        width: 320, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
 
        <h2 style={{ fontSize: 16, fontWeight: 500, margin: '0 0 6px' }}>Eliminar tarea</h2>
        <p style={{ fontSize: 14, color: '#666', margin: '0 0 1.25rem' }}>
          {message ?? '¿Seguro que deseas eliminar esta tarea? '}
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button onClick={onCancel} style={{
            padding: '8px 20px', borderRadius: 8, border: '1px solid #ddd',
            background: '#fff', cursor: 'pointer', fontSize: 14
          }}>
            Cancelar
          </button>
          <button onClick={onConfirm} style={{
            padding: '8px 20px', borderRadius: 8, border: '1px solid #fca5a5',
            background: '#a3151a', color: 'white', cursor: 'pointer', fontSize: 14
          }}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}