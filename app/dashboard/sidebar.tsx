'use client'; 
// app/ui/dashboard/sidebar.tsx
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Logout from './Logout';
const Sidebar = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex flex-col bg-gray-800 text-white h-full ">
    
      <ul className="flex-grow">
    
         <li>
          <Link href="/dashboard/admin" className="block p-4 hover:bg-gray-700 transition duration-200">
          <h2 className="text-lg font-bold">{session?.user?.name}</h2>

          </Link>
        </li>
        <li>
          <Link href="/home" className="block p-4 hover:bg-gray-700 transition duration-200">
            Home
          </Link>
        </li>
        <li>
          <Link href="/dashboard/profile" className="block p-4 hover:bg-gray-700 transition duration-200">
            Profile
          </Link>
        </li>

        <li>
          <Link href="/dashboard/members" className="block p-4 hover:bg-gray-700 transition duration-200">
            Members
          </Link>
        </li>
        <li>
          <Link href="/dashboard/settings" className="block p-4 hover:bg-gray-700 transition duration-200">
            Settings
          </Link>
        </li>
       
      </ul>
      <div className="p-4 border-t border-gray-600">
       <Logout />
      </div>
    </nav>
  );
};

export default Sidebar;
