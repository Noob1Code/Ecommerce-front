import { useState, useEffect } from 'react';

interface SearchBarProps {
  initialValue: string;
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ initialValue, onSearch, placeholder = "Buscar produtos..." }: SearchBarProps) => {
  const [localValue, setLocalValue] = useState(initialValue);

  // Sincroniza com a URL caso ela mude externamente (ex: se o usuário clicar em "Limpar Busca")
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  // A busca agora só acontece quando o formulário é enviado (Enter ou Clique no botão)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localValue);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative flex w-full max-w-lg items-center"
    >
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-gray-300 bg-white py-3 pl-6 pr-14 text-sm text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        aria-label="Pesquisar"
        title="Pesquisar"
      >
        <svg 
          className="h-5 w-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  );
};