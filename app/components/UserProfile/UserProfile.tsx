"use client";
import { useEffect, useState } from 'react';
import useUserStore from '@/app/store/useUserStore';
import UserDetails from './UserDetails';
import UserEditForm from './EditProfile';
import LoadingSpinner from '../Spinners/formloader';
import { PenBox, X } from 'lucide-react';
import { IUser } from '@/app/models/Users';

interface UserProfileProps {
  userId: string; // Prop for userId
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const { user, error, loading, fetchUser, updateUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<IUser>>({
    _id: '',
    first_name: '',
    last_name: '',
    email: '',
    role: 'user',
    gender: 'other',
    bio: '',
    avatar_image: '',
    cover_image: '',
  });

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId, fetchUser]);

  useEffect(() => {
    if (user) {
      setFormData({
        _id: user._id,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        role: user.role || 'user',
        gender: user.gender || 'other',
        bio: user.bio || '',
        avatar_image: user.avatar_image || '',
        cover_image: user.cover_image || '',
      });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData._id) {
      console.error('User ID is missing. Cannot update.');
      return;
    }
    try {
      await updateUser(formData._id.toString(), formData);
      // After update, fetch the latest user data
      fetchUser(userId);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    console.error(error);
    return <div className="text-red-500 font-bold">Error: {error}</div>;
  }

  if (!user) {
    return <div className="text-gray-500">User not found.</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">User Profile Details</h1>
        <button
          title='edit'
          type="button"
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? <X className="w-6 h-6" /> : <PenBox className="w-6 h-6" />}
        </button>
      </div>

      {isEditing ? (
        <UserEditForm
          formData={formData as any}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      ) : (
        <UserDetails user={user} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
};

export default UserProfile;