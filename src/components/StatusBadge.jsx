const STYLES = {
  pending: "badge-warning",
  confirmed: "badge-info",
  completed: "badge-success",
  cancelled: "badge-ghost",
};

const StatusBadge = ({ status }) => (
  <span className={`badge badge-sm ${STYLES[status] || "badge-ghost"} capitalize`}>
    {status}
  </span>
);

export default StatusBadge;