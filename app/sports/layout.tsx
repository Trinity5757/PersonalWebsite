'use client';

import { ReactNode } from 'react';
// import { useSession } from 'next-auth/react';
// import { resolveSidebarConfig } from 'app/utility/sidebarConfig';
import Navbar from '@/app/components/Navbar/Navbar';
import DynamicSidebar from '../components/Sidebars/DynamicSidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function PagesLayout({ children }: LayoutProps) {
  // validate user
  // const { data: session } = useSession();

  // const sidebarConfig = resolveSidebarConfig('pages', session);

  return (
    <div className="flex flex-col h-screen">

      <Navbar />

      <div className="flex flex-grow pt-[64px]">

        <DynamicSidebar type="sports" />


        <div className="flex-grow mx-auto w-full bg-gray-100 dark:bg-[#1c1c1d] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}