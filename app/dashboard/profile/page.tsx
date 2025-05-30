// app/dashboard/profile/page.tsx

"use client";


import UserProfile from '@/app/components/UserProfile/UserProfile';
import { useSession } from 'next-auth/react';


export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="min-h-screen flex justify-center items-center bg-[#E8EAED]">
    <div className="loader"></div>
  </div>
  }

  if (!session) {
    return <p>You need to be logged in to view this page.</p>;
  }

  const userId = session.user?.id;

  return (
    <div>
      <h1 className="text-2xl font-bold">Profile Page</h1>
      <UserProfile userId={userId} />
    </div>
  );
}