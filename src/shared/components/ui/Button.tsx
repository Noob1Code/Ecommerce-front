import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wide transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-95 sm:active:scale-98';
    
    const variants = {
      primary: 'rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs sm:text-sm px-4 py-3 sm:py-2.5 shadow-md border-none',
      secondary: 'rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-xs sm:text-sm px-4 py-3 sm:py-2.5 shadow-xs',
      icon: 'rounded-full bg-white text-gray-900 shadow-md hover:bg-blue-600 hover:text-white border-none p-2.5 min-w-[2.75rem] min-h-[2.75rem]',
    };

    const sizeClasses = variant === 'icon' && !className.includes('h-') && !className.includes('w-') 
      ? 'h-11 w-11' 
      : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizeClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Spinner className={`${variant === 'icon' ? '' : 'mr-2'} h-4 w-4 text-current`} />
            {variant !== 'icon' && children}
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';