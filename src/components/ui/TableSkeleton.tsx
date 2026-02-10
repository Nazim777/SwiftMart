import React from 'react';

const TableSkeleton = () => {
  return (
    <div className="w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-5 bg-gray-100 py-3 px-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-300 rounded animate-pulse"></div>
        ))}
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 py-4 px-4">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-4 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
