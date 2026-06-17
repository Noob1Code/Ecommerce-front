import { forwardRef } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  allowOverflow?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', children, allowOverflow = false, ...props }, ref) => {

    const overflowClass = allowOverflow ? 'overflow-x-auto scrollbar-thin' : 'overflow-hidden';

    return (
      <div
        ref={ref}
        className={`${overflowClass} rounded-xl border border-gray-200 bg-white shadow-xs sm:shadow-sm transition-shadow duration-150 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';