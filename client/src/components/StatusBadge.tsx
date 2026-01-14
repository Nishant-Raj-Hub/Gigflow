import { clsx } from "clsx";

type StatusType = "open" | "assigned" | "pending" | "hired" | "rejected";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = {
    open: "bg-green-50 text-green-700 border-green-200",
    assigned: "bg-slate-100 text-slate-700 border-slate-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    hired: "bg-indigo-50 text-indigo-700 border-indigo-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const labels = {
    open: "Open",
    assigned: "Assigned",
    pending: "Pending",
    hired: "Hired",
    rejected: "Rejected",
  };

  return (
    <span className={clsx(
      "px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider",
      styles[status],
      className
    )}>
      {labels[status]}
    </span>
  );
}
