import React from "react";
import RegisterForm from "./form";
import InteractiveLogo from "app/register/InteractiveLogo";

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#1c1c1d] p-6">
      <div className="relative mx-auto flex w-full max-w-lg flex-col space-y-6 rounded-lg bg-white dark:bg-base-100 shadow-lg p-8 md:p-10">
        <div className="flex flex-col items-center space-y-4">
          {/* Interactive Logo with Theme Toggle */}
          <InteractiveLogo />
          <h1 className="text-center text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
            Register
          </h1>
          <p className="text-center text-gray-500 dark:text-gray-400">
            Create your account to get started
          </p>
        </div>

        {/* Form */}
        <RegisterForm />
      </div>
    </main>
  );
}