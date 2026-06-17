export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto shrink-0">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-medium text-gray-400 text-center sm:text-left">
          &copy; {currentYear}ModularStore. Todos os direitos reservados. Desenvolvido com integridade de arquitetura corporativa.
        </p>
        <div className="flex space-x-6 shrink-0">
          <span className="text-[10px] bg-gray-50 border border-gray-100 rounded px-2 py-0.5 text-gray-400 font-mono font-bold uppercase tracking-wide">
            Ambiente: Integrado com o backend
          </span>
        </div>
      </div>
    </footer>
  );
};