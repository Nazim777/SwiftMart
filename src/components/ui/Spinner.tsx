import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-primary"></div>
    </div>
  );
};

export default Spinner;
