import React from 'react';
import { format } from 'date-fns';
import { ChevronRight, Clock, CheckCircle2 } from 'lucide-react';

export default function JobCard({ certificate, processRun, onClick }) {
  const getStatusBadge = () => {
    if (!processRun) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
          <Clock className="w-3 h-3" />
          Not Started
        </span>
      );
    }
    
    switch (processRun.status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <Clock className="w-3 h-3" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            <Clock className="w-3 h-3" />
            Not Started
          </span>
        );
    }
  };

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all text-left flex items-center gap-4"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-slate-900 truncate">
            {certificate.manufacturer} {certificate.model}
          </h3>
        </div>
        <p className="text-sm text-slate-500 mb-2">
          {certificate.certificate_number}
        </p>
        <div className="flex items-center gap-3">
          {getStatusBadge()}
          <span className="text-xs text-slate-400">
            {format(new Date(certificate.created_date), 'dd MMM yyyy')}
          </span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
    </button>
  );
}