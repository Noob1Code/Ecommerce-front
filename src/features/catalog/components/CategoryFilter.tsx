interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

// Em um app real, isso poderia vir da API. Por enquanto, definimos as opções disponíveis.
const CATEGORIES = [
  { id: '', label: 'All' },
  { id: 'Electronics', label: 'Electronics' },
  { id: 'Accessories', label: 'Accessories' },
  { id: 'Food', label: 'Food' },
];

export const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category.id;
        return (
          <button
            key={category.label}
            onClick={() => onSelectCategory(category.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
              isSelected
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
};