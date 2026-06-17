import { Button } from './Button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ title = 'Failed to load data', message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/60 p-6 sm:p-10 text-center w-full shadow-2xs animate-in fade-in duration-200 max-w-xl mx-auto">

      <svg className="mb-3.5 h-10 w-10 text-red-500/90 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>

      <h3 className="text-base sm:text-lg font-bold text-red-800 tracking-tight px-2">
        {title}
      </h3>

      <p className="mt-1.5 text-xs sm:text-sm text-red-600/90 font-medium max-w-xs sm:max-w-md mb-5 sm:mb-6 px-1 break-words line-clamp-4 hover:line-clamp-none transition-all duration-300 w-full">
        {message}
      </p>

      {onRetry && (
        <div className="w-full sm:w-auto flex justify-center px-4 sm:px-0">
          <Button
            variant="secondary"
            onClick={onRetry}

            className="w-full sm:w-auto text-xs py-2.5 px-5 font-bold"
          >
            Tente Novamente
          </Button>
        </div>
      )}
    </div>
  );
};