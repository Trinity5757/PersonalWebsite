'use client';

import { signOut } from 'next-auth/react';

const Logout: React.FC = () => {
  return (
    <button
      onClick={() => signOut()}
      className="bg-purple-400 text-black font-bold p-2 rounded hover:bg-purple-500 transition"
    >
      Logout
    </button>
  );
};

export default Logout;