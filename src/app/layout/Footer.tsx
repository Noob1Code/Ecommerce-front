export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">
          &copy; {currentYear} Mercado Preso. All rights reserved. Built with configuration management integrity.
        </p>
        <div className="flex space-x-6">
          <span className="text-xs text-gray-400 font-mono">Environment: Standalone Mock Mode</span>
        </div>
      </div>
    </footer>
  );
};