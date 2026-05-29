const labels = {
  pending: "Pending",
  accepted: "Accepted",
  confirmed: "Accepted",
  preparing: "Preparing",
  assigned_to_courier: "Assigned",
  out_for_delivery: "Out for delivery",
  delivered: "Completed",
  cancelled: "Cancelled",
  not_assigned: "Not assigned",
  assigned: "Assigned",
  picked_up: "Picked up",
  on_the_way: "On the way",
};

function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-${status || "pending"}`}>
      {labels[status] || status}
    </span>
  );
}

export default StatusBadge;
