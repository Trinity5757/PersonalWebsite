// app/components/userprofile/UserDetails.tsx


import React from 'react';

interface UserDetailsProps {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    last_login?: Date | null;
    gender: string;
  };
  onEdit: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-gray-700">
        <span className="font-semibold">First Name:</span> {user.first_name}
      </p>
      <p className="text-lg font-medium text-gray-700">
        <span className="font-semibold">Last Name:</span> {user.last_name}
      </p>
      <p className="text-lg font-medium text-gray-700">
        <span className="font-semibold">Email:</span> {user.email}
      </p>
      <p className="text-lg font-medium text-gray-700">
        <span className="font-semibold">Role:</span> {user.role}
      </p>
      <p className="text-lg font-medium text-gray-700">
        <span className="font-semibold">Last Login:</span> {user.last_login ? user.last_login.toString() : 'Never'}
      </p>
      <p className="text-lg font-medium text-gray-700 mb-5">
        <span className="font-semibold">Gender:</span> {user.gender}
      </p>

      <div className="flex justify-end space-x-2 border-t border-gray-200 mt-4 py-4 "></div>

    </div>
  );
};

export default UserDetails;
