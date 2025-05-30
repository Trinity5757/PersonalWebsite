import { UploadCloud } from "lucide-react";
import { IBusiness } from "@/app/models/Business";
import UploadButton from "@/app/components/Cloudinary/UploadButton";
import { useEffect, useState } from "react";



export default function CreateBusinessModal({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  formData: Partial<IBusiness>;
  onChange: (name: string, value: string | string[]) => void;  
  onSubmit: (e: React.FormEvent) => void;
}) {
  const categoryOptions = ["Food", "Retail", "Restaurant", "Tech"];
  const [avatarPreview, setAvatarPreview] = useState<string | null>(formData.avatar || null);
  const [coverPreview, setCoverPreview] = useState<string | null>(formData.cover || null);
  const [tags, setTags] = useState<string>(""); 


  useEffect(() => {
    setAvatarPreview(formData.avatar || null);
  }, [formData.avatar]);

  useEffect(() => {
    setCoverPreview(formData.cover || null);
  }, [formData.cover]);

  useEffect(() => {
    if (!isOpen) {
      setAvatarPreview(null);
      setCoverPreview(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.tags) {
      setTags(formData.tags.join(", "));
    } else {
      setTags(""); 
    }
  }, [formData.tags]);

  

 
  
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
 
    const tagsArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0); 
    onChange("tags", tagsArray);
  
    await onSubmit(event); 

  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    if (name === "tags") {
      setTags(value); 
    } else {
      onChange(name, value); 
    }
  };

  const handleUploadSuccess = (fileUrl: string, fieldName: string) => {
    if (fieldName === "profilePicture") {
      setAvatarPreview(fileUrl); 
      onChange("profilePicture", fileUrl); 
    } else if (fieldName === "cover_picture") {
      setCoverPreview(fileUrl); 
      onChange("cover_picture", fileUrl); 
    }
  };
  

  return isOpen ? (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
    {/* Modal Content */}
    <div className="bg-base-100 p-6 rounded-lg shadow-2xl w-full max-w-lg my-8">
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Create Business
      </h2>

      {/* Form Fields Section */}
      <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {/* Business Name - Required */}
        <div>
          <label
            htmlFor="businessName"
            className="block text-sm font-medium text-white mb-1"
          >
            Business Name *
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName || ""}
            onChange={handleInputChange}
            required
            placeholder="Business Name"
            className="w-full p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Avatar Upload */}
        <div>
          <div className="w-full h-[52px] bg-black dark:bg-black border-none rounded-lg 
                        hover:bg-gray-900 dark:hover:bg-gray-900 
                        transition-colors duration-200 cursor-pointer">
            <UploadButton
              onUploadSuccess={(fileUrl) => handleUploadSuccess(fileUrl, "profilePicture")}
              buttonText={
                <span className="flex items-center justify-center text-white text-base h-[52px]">
                  <UploadCloud className="mr-2 h-5 w-5 text-white" />
                  Upload Business Avatar
                </span>
              }
              folder="page_avatars"
              className="w-full block"
            />
          </div>
          {avatarPreview && (
            <div className="mt-3">
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Cover Image Upload */}
        <div>
          <div className="w-full h-[52px] bg-black dark:bg-black border-none rounded-lg 
                        hover:bg-gray-900 dark:hover:bg-gray-900 
                        transition-colors duration-200 cursor-pointer">
            <UploadButton
              onUploadSuccess={(fileUrl) => handleUploadSuccess(fileUrl, "cover_picture")}
              buttonText={
                <span className="flex items-center justify-center text-white text-base h-[52px]">
                  <UploadCloud className="mr-2 h-5 w-5 text-white" />
                  Upload Cover Image
                </span>
              }
              folder="page_covers"
              className="w-full block"
            />
          </div>
          {coverPreview && (
            <div className="mt-3">
              <img
                src={coverPreview}
                alt="Cover Preview"
                className="w-full h-32 rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        {/* Category - Dropdown */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-white mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category || ""}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">Select a category</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Contact Email - Required */}
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-white mb-1">
            Contact Email *
          </label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail || ""}
            onChange={handleInputChange}
            required
            placeholder="contact@business.com"
            className="w-full p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="w-full p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-white mb-1">
            Website
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website || ""}
            onChange={handleInputChange}
            placeholder="https://www.example.com"
            className="w-full p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-white mb-1">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address || ""}
            onChange={handleInputChange}
            placeholder="Business Address"
            className="w-full p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-white mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags?.join(", ") || ""}
            onChange={(e) => onChange("tags", e.target.value.split(",").map((tag) => tag.trim()))}
            placeholder="tag1, tag2, tag3"
            className="w-full p-3 border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </form>

      {/* Action Buttons - Fixed at bottom */}
      <div className="flex justify-end items-center space-x-3 mt-4 pt-4 border-t border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-purple-400 hover:bg-purple-600 text-black font-semibold transition"
        >
          Create Business
        </button>
      </div>
    </div>
  </div>
) : null;
}