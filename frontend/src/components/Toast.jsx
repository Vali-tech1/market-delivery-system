function Toast({ toast, onClose }) {
  if (!toast) {
    return null;
  }

  return (
    <div className={`toast toast-${toast.type || "info"}`} role="status">
      <div>
        <strong>{toast.title}</strong>
        {toast.message && <p>{toast.message}</p>}
      </div>
      <button className="icon-button" type="button" onClick={onClose} aria-label="Close notification">
        x
      </button>
    </div>
  );
}

export default Toast;
