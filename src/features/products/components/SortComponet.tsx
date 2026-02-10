"use client";

import { useState } from "react";

interface SortProductProps {
  onSortChange: (sortOrder: "asc" | "desc") => void;
}

const SortProduct: React.FC<SortProductProps> = ({ onSortChange }) => {
  const [selectedOrder, setSelectedOrder] = useState<"asc" | "desc">("asc");

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const order = event.target.value as "asc" | "desc";
    setSelectedOrder(order);
    onSortChange(order);
  };

  return (
    <div className="flex items-center gap-4">
      <label htmlFor="sort" className="text-gray-700 font-medium">
        Sort By:
      </label>
      <select
        id="sort"
        value={selectedOrder}
        onChange={handleSortChange}
        className="px-4 py-2 border rounded-lg bg-white shadow-sm text-gray-700 focus:ring focus:ring-blue-200 focus:border-blue-400"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default SortProduct;
