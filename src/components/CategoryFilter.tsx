import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  const categories = [
    { value: "escola", label: "📚 Escola", color: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" },
    { value: "projeto", label: "🚀 Projeto", color: "bg-project/10 text-project border-project/20 hover:bg-project/20" },
    { value: "pessoal", label: "👤 Pessoal", color: "bg-secondary/10 text-secondary border-border hover:bg-secondary/20" },
    { value: "urgente", label: "⚠️ Urgente", color: "bg-urgent/10 text-urgent border-urgent/20 hover:bg-urgent/20" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelectCategory(null)}
        className="transition-all duration-base"
      >
        Todas
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.value}
          variant="outline"
          size="sm"
          onClick={() => onSelectCategory(cat.value)}
          className={`transition-all duration-base border-2 ${
            selectedCategory === cat.value
              ? cat.color
              : "hover:opacity-80"
          }`}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
