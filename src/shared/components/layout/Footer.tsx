export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex justify-center space-x-6 md:order-2">
            <span className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer">About</span>
            <span className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer">Privacy</span>
            <span className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer">Terms</span>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-sm text-gray-500">
              &copy; {currentYear} E-Commerce Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};