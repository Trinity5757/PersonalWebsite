'use client';

import { AtSign, Lock, Eye, EyeOff, User, Smile } from 'lucide-react';
import { Button } from '@/app/ui/button';
import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const username = formData.get('username')?.toString() || '';
    const firstName = formData.get('first_name')?.toString() || '';
    const lastName = formData.get('last_name')?.toString() || '';
    const dateOfBirth = formData.get('date_of_birth')?.toString() || '';
    const gender = formData.get('gender')?.toString() || '';

    const newErrors = {
      username: validateField('Username', username),
      first_name: validateField('First Name', firstName),
      last_name: validateField('Last Name', lastName),
      email: validateField('Email', email),
      date_of_birth: validateField('Date of Birth', dateOfBirth),
      gender: validateField('Gender', gender),
      password: validateField('Password', password),
    };

    setErrors(newErrors);

    // If there are errors, don't submit the form
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    setDisabled(true);

    const response = await fetch(`/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        gender,
      }),
    });

    const result = await response.json();
    setMessage(result.message);
    setStatus(response.ok ? 'success' : 'error');
    setDisabled(false);

    if (response.ok) {
      router.push('/login');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {[
        { label: 'Username', name: 'username', type: 'text', icon: <User /> },
        { label: 'First Name', name: 'first_name', type: 'text', icon: <Smile /> },
        { label: 'Last Name', name: 'last_name', type: 'text', icon: <Smile /> },
        { label: 'Email', name: 'email', type: 'email', icon: <AtSign /> },
      ].map(({ label, name, type, icon }) => (
        <div key={name}>
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
          <div className="relative">
            <input
              type={type}
              name={name}
              id={name}
              placeholder={`Enter your ${label.toLowerCase()}`}
              disabled={disabled}
              className={`block w-full bg-gray-100 dark:bg-gray-800 border ${
                errors[name] ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              } rounded-md py-2 px-3 pl-10 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:focus:outline-none`}
            />
            {icon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-600">
                {icon}
              </div>
            )}
          </div>
          {errors[name] && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors[name]}</p>
          )}
        </div>
      ))}

      <div>
        <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date of Birth
        </label>
        <input
          type="date"
          name="date_of_birth"
          id="date_of_birth"
          disabled={disabled}
          className={`block w-full bg-gray-100 dark:bg-gray-800 border ${
            errors['date_of_birth'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
          } rounded-md py-2 px-3 text-gray-500 dark:text-gray-500 placeholder-gray-400 focus:outline-none dark:focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
        {errors['date_of_birth'] && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors['date_of_birth']}</p>
        )}
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Gender
        </label>
        <select
          name="gender"
          id="gender"
          disabled={disabled}
          className={`block w-full bg-gray-100 dark:bg-gray-800 border ${
            errors['gender'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
          } rounded-md py-2 px-3 text-gray-500 dark:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:focus:outline-none`}
        >
          <option value="">Select your gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors['gender'] && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors['gender']}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              errors['password'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } rounded-md py-2 px-3 pl-10 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:focus:outline-none`}
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors['password'] && (
          <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors['password']}</p>
        )}
      </div>

      <Button className="w-full py-2 bg-purple-500 text-black dark:text-base-100 rounded-md hover:bg-purple-600 focus:ring-2 focus:ring-purple-500">
        Register
      </Button>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Already a member?{' '}
          <Link
            href="/login"
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md text-center ${
            status === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}