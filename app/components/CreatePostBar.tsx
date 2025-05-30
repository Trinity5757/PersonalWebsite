import { useState } from "react";
import IconButton from "app/components/post/IconButton";
import { CiImageOn } from "react-icons/ci";
import CreatePostModal from "app/components/Modals/CreatePostModal";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFilteredPosts: (filtered: any[]) => void;
};

export default function CreatePostBar({ posts, setFilteredPosts }: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [searchTypes] = useState<string[]>(["tags", "caption", "username"]);

  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setQuery(query);

    if (!query) {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter((post) =>
      searchTypes.some((type) =>
        post[type]?.toLowerCase().includes(query)
      )
    );
    setFilteredPosts(filtered);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-md p-3 dark:bg-base-100">
      <div className="flex items-center space-x-2">
        <IconButton
          className="flex items-center justify-center p-2 rounded-full text-white hover:text-gray-600 transition-colors duration-300"
          tooltip="Create Post"
          icon={
            <CiImageOn className="h-10 w-10 rounded-full p-2 bg-gray-300 text-gray-600 hover:bg-gray-400" />
          }
          onClick={toggleModal}
        />
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search posts and explore..."
          className="flex-grow p-2 text-gray-600 placeholder-gray-500 rounded-full bg-[#E8EAED] outline-none"
        />
      </div>

      <CreatePostModal
        created_by={{
          _id: "user_id", // Replace with session user ID
          username: "user_name", // Replace with session username
          avatar_image: null, // Replace with session avatar image
        }}
        isVisible={isModalVisible}
        onClose={toggleModal}
      />
    </div>
  );
}