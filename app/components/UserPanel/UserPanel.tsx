// app/components/UserPanel/UserPanel.tsx
'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import useUserStore from '@/app/store/useUserStore';


export default function UserPanel() {
  const { data: session } = useSession();
  const router = useRouter();
  const { users, deleteUser, loading } = useUserStore();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true); // This will run only on the client side
  }, []);

  useEffect(() => {
    if (isClient && session?.user.role !== 'admin') {
      router.push('/'); // Redirect non-admin users
    } else if (isClient) {
      fetchUsers();
    }
  }, [isClient, session]);

  const handleDeleteUser = async (userId: string) => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      try {
        await deleteUser(userId); // Delete user from the store
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  <p className="text-blue-500 mr-2">
                    Edit
                  </p>
                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-500">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
