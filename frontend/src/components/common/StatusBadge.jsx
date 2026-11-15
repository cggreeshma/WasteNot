import React from 'react';

const statusMap = {
  pending: 'badge-pending',
  accepted: 'badge-accepted',
  rejected: 'badge-rejected',
  cancelled: 'badge-cancelled',
  collected: 'badge-collected',
  active: 'badge-active',
  inactive: 'badge-inactive',
  expired: 'badge-expired',
};

const StatusBadge = ({ status }) => {
  const className = statusMap[status] || 'badge bg-slate-100 text-slate-600';
  return (
    <span className={className}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

export default StatusBadge;
