import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, icon, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-6 sm:p-12 text-center bg-gray-50/20 w-full max-w-xl mx-auto shadow-2xs">
      {icon ? (
        <div className="mb-4 text-gray-400 flex items-center justify-center shrink-0">{icon}</div>
      ) : (
        <svg className="mb-4 h-11 w-11 sm:h-12 w-12 text-gray-400/80 animate-pulse duration-1000 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )}

      <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight px-2">
        {title}
      </h3>

      <p className="mt-1.5 text-xs sm:text-sm text-gray-500 font-medium max-w-xs sm:max-w-md mb-5 sm:mb-6 px-1">
        {description}
      </p>

      {action && (
        <div className="w-full sm:w-auto flex justify-center px-4 sm:px-0">
          {action}
        </div>
      )}
    </div>
  );
};