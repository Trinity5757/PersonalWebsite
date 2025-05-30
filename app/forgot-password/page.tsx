'use client';

import React, { FormEvent, useState } from 'react';
import { AtSign } from 'lucide-react';
import { Button } from '@/app/ui/button';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return 'Email is required.';
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send password reset email');
      }
      
      setSuccess(true);
      setEmail('');
    } catch (err) {
      console.error('Error requesting password reset:', err);
      setError(err instanceof Error ? err.message : 'Failed to send password reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Forgot Password
        </h1>
        
        {success ? (
          <div className="text-center">
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded">
              If your email is registered, you will receive a password reset link.
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Please check your email inbox and follow the instructions to reset your password.
            </p>
            <Link 
              href="/login" 
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Enter your email address below and we'll send you a link to reset your password.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="block w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 pl-10 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="Enter your email address"
                    required
                  />
                  <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-600" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-purple-500 text-black dark:text-base-100 rounded-md hover:bg-purple-600 focus:ring-2 focus:ring-purple-500"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="text-center mt-4">
              <Link 
                href="/login" 
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}