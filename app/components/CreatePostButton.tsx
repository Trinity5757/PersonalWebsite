import { useState } from "react";
import { Plus } from "lucide-react";
import CreatePostModal from "app/components/Modals/CreatePostModal";

type CreatePostButtonProps = {
  userId: string;
  username: string;
  avatarImage: string | null;
};

export default function CreatePostButton({
  userId,
  username,
  avatarImage,
}: CreatePostButtonProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
    setIsDropdownVisible(false); // Close dropdown when modal opens
  };

  const handleMouseEnter = () => setIsDropdownVisible(true);
  const handleMouseLeave = () => setIsDropdownVisible(false);

  return (
    <div className="relative">
      {/* Plus Icon */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        <button className="p-2">
          <Plus className="h-6 w-6 text-purple-500 hover:text-purple-600 transition" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownVisible && (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute top-full mt-2 bg-white text-black dark:bg-base-100 rounded-lg shadow-lg w-40 z-50"
          >
            <button
              onClick={toggleModal}
              className="block w-full text-left px-4 py-2 hover:bg-purple-500 hover:text-white transition"
            >
              Create New Post
            </button>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        created_by={{
          _id: userId,
          username: username,
          avatar_image: avatarImage,
        }}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
}