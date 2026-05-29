function EmptyState({ title, message, action }) {
  return (
    <div className="state-panel empty-state">
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}

export default EmptyState;
