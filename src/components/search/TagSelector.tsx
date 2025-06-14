
import React from "react";

interface TagSelectorProps {
  selectedTag: string | null;
  onSelectTag: (tag: string) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTag, onSelectTag }) => {
  const tags = ["정기", "1회", "육아업무", "사무실", "화장실"];

  return (
    <div className="flex gap-2 p-4 overflow-x-auto">
      {tags.map((tag) => (
        <div
          key={tag}
          onClick={() => onSelectTag(tag)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm cursor-pointer transition-colors
            ${selectedTag === tag ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
        >
          {tag}
        </div>
      ))}
    </div>
  );
};

export default TagSelector;
