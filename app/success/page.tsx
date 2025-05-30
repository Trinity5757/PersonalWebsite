// app/success/page.tsx
"use client";

import React from 'react';

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-green-600">Success!</h1>
        <p className="mt-2 text-gray-600">
          Your transaction has been completed successfully.
        </p>
     
      </div>
    </div>
  );
}
