import { UploadCloud } from "lucide-react";
import UploadButton from "@/app/components/Cloudinary/UploadButton";
import { IBusiness } from "@/app/models/Business";

export default function BusinessModal({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  formData: Partial<IBusiness>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const handleUploadSuccess = (uploadedResource: any, fieldName: string) => {
    const cloudinaryUrl = uploadedResource.secure_url;
    onChange({
      target: {
        name: fieldName,
        value: cloudinaryUrl,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };



  return isOpen ? (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-4 sm:p-6 rounded-lg max-w-md w-full z-50">
        <h2 className="text-xl font-semibold text-center mb-4">Create Business</h2>

        {/* Page Avatar Upload Section */}
        <div className="mb-4 relative z-50">
          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
            Business Avatar
          </label>
          <div className="mt-2 flex justify-center items-center">
            {/* Custom file upload button */}
            <label
              htmlFor="profilePicture"
              className="cursor-pointer inline-flex items-center text-white bg-blue-500 hover:bg-blue-600 rounded-md py-2 px-4"
            >
              <UploadCloud className="w-5 h-5 mr-2" />
              <UploadButton
                onUploadSuccess={(resource) =>
                  handleUploadSuccess(resource, "profilePicture")
                }
                buttonText="Upload Avatar"
              />
            </label>
          </div>

          {/* Displaying avatar preview if available */}
          {formData.profilePicture && (
            <div className="mt-4 flex justify-center z-50">
              <img
                src={formData.profilePicture}
                alt="Page Avatar Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 z-50"
              />
            </div>
          )}
        </div>

        {/* Page Cover Image Upload Section */}
        <div className="mb-4">
          <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700">
            Business Cover Image
          </label>
          <div className="mt-2 flex items-center gap-4">
            {/* Upload Button */}
            <UploadButton
              onUploadSuccess={(resource) =>
                handleUploadSuccess(resource, "cover_picture")
              }
              buttonText="Upload Cover"
            />

            {/* Cover Image Preview */}
            {formData.cover_picture && (
              <div className="flex justify-center items-center">
                <img
                  src={formData.cover_picture}
                  alt="Cover Preview"
                  className="w-32 h-20 rounded-lg object-cover border-2 border-gray-300"
                />
              </div>
            )}
          </div>
        </div>

        {/* Form Fields Section */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Team Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.businessName || ""}
              onChange={onChange}
              placeholder="Page Name"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sport */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <textarea
              name="category"
              value={formData.category || ""}
              onChange={onChange}
              placeholder="Your industry..."
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            />
          </div>


          {/* Action Buttons */}
          <div className="mt-4 flex justify-between">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
            >
              Create Business
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
}
