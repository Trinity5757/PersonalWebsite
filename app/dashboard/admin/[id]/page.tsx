// app/dashboard/admin/[id]/page.tsx
// Oswaldo - To do - Admin should be able to view any user profile details
import UserProfile from '@/app/components/UserProfile/UserProfile';

export default async function UserViewPage({ params }: { params: Promise<{ id: string }> }) {
  // Check session may or may not be necessary
  // const { data: session, status } = useSession();

  // if (status === 'loading') {
  //   return <p>Loading user data...</p>;
  // }

  // if (!session) {
  //   return <p>You need to be logged in to view this page.</p>;
  // }

  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">Profile Page</h1>
      <UserProfile userId={id} />
    </div>
  );
}
