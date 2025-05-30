
"use client"

import SearchBar from "../SearchBar";

type Props = {
  isVisible: boolean;
  onClose: () => void;
}


export default function BlockUserModal({isVisible, onClose}: Props) {
  if(!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg resize overflow-auto"
        style={{ minHeight: "300px", maxHeight: "90vh" }}>
        <div className="justify-items-center p-4">

          <SearchBar/>

          <br/>
          <br/>
          <br/>
          <h1>Add user searchability to block members</h1>
          <br/>
          <br/>
          <br/>

          <button
            className="mx-auto bg-gray-200 text-gray-900 p-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}