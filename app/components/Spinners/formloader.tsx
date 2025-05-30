// app/components/spinners/formloader.tsx
import React from 'react';

const FormLoader = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg flex justify-center items-center">
      <div className="animate-spin border-4 border-blue-600 border-t-transparent rounded-full w-12 h-12"></div>
    </div>
  );
};

export default FormLoader;
