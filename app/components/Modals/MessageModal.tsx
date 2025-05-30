"use client";

import { IUser } from "@/app/models/Users";
import useChatRoomStore from "@/app/store/useChatRoomStore";
import useMessageStore from "@/app/store/useMessageStore";
import React, { useEffect, useState } from "react";

interface MessageModalProps {
  sender: string;
  participant: IUser;
  isOpen: boolean;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ sender, participant, isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatroomId, setChatroomId] = useState<string | null>(null);

  const { createOrFindChatRoom } = useChatRoomStore();
  const { sendMessage, fetchMessageByChatroom, messages, error } = useMessageStore();

  useEffect(() => {
    if (isOpen) {
      const fetchChatRoom = async () => {
        try {
          const chatResponse = await createOrFindChatRoom(sender, participant._id.toString());
          setChatroomId(chatResponse._id.toString());
          fetchMessageByChatroom(chatResponse._id.toString());
        } catch (err) {
          console.error("Failed to fetch chatroom:", err);
        }
      };
      fetchChatRoom();
    }

    if (!isOpen) {
      setMessage("");
      setChatroomId(null);
    }
  }, [isOpen, sender, participant._id, createOrFindChatRoom, fetchMessageByChatroom]);

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      if (!chatroomId) {
        const chatResponse = await createOrFindChatRoom(sender, participant._id.toString());
        setChatroomId(chatResponse._id.toString());
      }

      const newMessage = {
        chatId: chatroomId,
        senderId: sender,
        content: message,
        messageType: "text",
      };

      await sendMessage(newMessage);
      fetchMessageByChatroom(chatroomId as string);
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Chatroom Messages</h2>

        <div className="max-h-60 overflow-y-auto mb-4 bg-gray-800 p-3 rounded-lg">
          {loading ? (
            <p className="text-gray-400">Loading messages...</p>
          ) : error ? (
            <p className="text-red-400">Error: {error}</p>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg._id} className="bg-gray-700 p-3 rounded-md flex items-center space-x-3">
                <img
                  src={msg.sender?.avatar_image || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-white">{msg.sender?.username || "Unknown"}</p>
                  <p className="text-white">{msg.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No messages yet.</p>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-4 text-white">Send a Message</h2>

        <textarea
          rows={4}
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-base-100 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleSendMessage}
            className="px-4 py-2 bg-purple-400 text-base-100 rounded-md hover:bg-purple-600 transition"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
