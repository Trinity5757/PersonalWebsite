// app/components/Avatar/Avatar.tsx
import React from 'react';
import { Loader } from 'lucide-react'; // Import the Loader icon from Lucide

interface AvatarProps {
  src?: string; // Optional avatar image URL
  alt?: string; // Alternate text for the avatar image
  size?: string; // Size of the avatar (e.g., 'w-16 h-16' for 64px x 64px)
  isLoading?: boolean; // Optional loading state
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = "User Avatar", size = "w-16 h-16", isLoading = false }) => {
  return (
    <div className={`relative ${size} rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center`}>
      {isLoading ? (
        <Loader className="animate-spin text-gray-400 h-8 w-8" />
      ) : src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="object-cover w-full h-full" />
      ) : (
        <span className="text-gray-400 text-2xl font-bold">A</span> // Placeholder text or initials
      )}
    </div>
  );
};

export default Avatar;
