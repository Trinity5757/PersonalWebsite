'use client';

import { AtSign, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/app/ui/button';
import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function LoginForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [disabled, setDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validateField = (name: string, value: string) => {
    if (!value.trim()) {
      return `${name} is required.`;
    }
    return '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Extract email and password
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    // Validate fields
    const newErrors = {
      email: validateField('Email', email),
      password: validateField('Password', password),
    };

    setErrors(newErrors);

    // If there are errors, stop form submission
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    setDisabled(true);

    // Use NextAuth to sign in the user
    const signInResult = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      setErrors({ general: 'Invalid email or password. Please try again.' });
    } else {
      // Redirect to the dashboard upon successful login
      router.push('/home'); // Adjust the path as needed
    }

    setDisabled(false);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Email
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email address"
            disabled={disabled}
            className={`block w-full bg-gray-100 dark:bg-gray-800 border ${
              errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } rounded-md py-2 px-3 pl-10 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none`}
          />
          <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-600" />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="password"
            placeholder="Enter your password"
            disabled={disabled}
            className={`block w-full bg-gray-100 dark:bg-gray-800 border ${
              errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } rounded-md py-2 px-3 pl-10 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none`}
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-600" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-600"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.password}</p>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="flex items-center justify-end">
        <Link
          href="/forgot-password"
          className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {/* General Error */}
      {errors.general && (
        <p className="text-sm text-red-500 dark:text-red-400 text-center">{errors.general}</p>
      )}

      {/* Submit Button */}
      <Button
        disabled={disabled}
        className="w-full py-2 bg-purple-500 text-black dark:text-base-100 rounded-md hover:bg-purple-600 focus:ring-2 focus:ring-purple-500"
      >
        Login
      </Button>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Not a member yet?{" "}
          <Link
            href="/register"
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </form>
  );
}