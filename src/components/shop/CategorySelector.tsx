
import React from "react";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="overflow-x-auto hide-scrollbar pb-2">
      <div className="flex space-x-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm whitespace-nowrap",
              activeCategory === category
                ? "bg-[#00C8B0] text-white"
                : "bg-gray-100 text-gray-700"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
