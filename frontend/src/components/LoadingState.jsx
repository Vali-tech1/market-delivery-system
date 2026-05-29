function LoadingState({ message = "Loading..." }) {
  return (
    <div className="state-panel">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}

export default LoadingState;
