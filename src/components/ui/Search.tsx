import React from "react";

interface SearchProps {
  value: string;
  onSearchChange: (searchTerm: string) => void;
  placeholder?: string;
}

const Search: React.FC<SearchProps> = ({
  value,
  onSearchChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="flex justify-center mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full max-w-3xl border p-2 rounded-md"
      />
    </div>
  );
};

export default Search;
