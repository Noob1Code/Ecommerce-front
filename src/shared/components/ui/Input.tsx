import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, disabled, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        <input
          ref={ref}
          disabled={disabled}
          className={`block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base shadow-2xs transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:py-2.5 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${error
              ? 'border-red-500 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-500/20'
              : ''
            } ${className}`}
          {...props}
        />
        {error && (
          <span className="mt-1.5 text-xs font-bold text-red-600 px-1 animate-in fade-in duration-150 tracking-wide">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';