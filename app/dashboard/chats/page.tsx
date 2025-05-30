"use client";
// app/dashboard/chats/page.tsx
// test chatroom
import { useState, useEffect } from "react";
import useChatRoomStore from "@/app/store/useChatRoomStore";
import { useSession } from "next-auth/react";
import {  GroupIcon, MailIcon } from "lucide-react";

const Chat = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { getChatRoomsByUser, chatRooms, loading, error } = useChatRoomStore();
  const [selectedChatRoom, setSelectedChatRoom] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (userId) {
      getChatRoomsByUser(userId.toString())
        .then(() => console.log("Chat rooms fetched successfully"))
        .catch((err) => console.error("Error fetching chat rooms:", err));
    }
  }, [userId, getChatRoomsByUser]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage("");
    }
  };

  if (loading) return <p>Loading chat rooms...</p>;
  if (error) return <p>Error: {error}</p>;

  const directMessages = chatRooms.filter((room) => room.isDirectMessage);
  const groupChats = chatRooms.filter((room) => !room.isDirectMessage);

  return (
    <div className="p-4 border rounded shadow-md max-w-lg mx-auto">
      <h2 className="text-lg font-semibold mb-2">Chat Rooms</h2>

      {/* Direct Messages Section */}
      {directMessages.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-600">Direct Messages</h3>
          <div className="border p-2 rounded-md bg-gray-50">
            {directMessages.map((room) => (
              <button
                key={room._id.toString()}
                onClick={() => setSelectedChatRoom(room._id.toString())}
                className={`flex items-center gap-2 p-2 w-full text-left rounded-md transition ${
                  selectedChatRoom === room._id.toString()
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <MailIcon className="text-blue-600" />
                {room.chatName} 
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Group Chats Section */}
      {groupChats.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-600">Group Chats</h3>
          <div className="border p-2 rounded-md bg-gray-50">
            {groupChats.map((room) => (
              <button
                key={room._id.toString()}
                onClick={() => setSelectedChatRoom(room._id.toString())}
                className={`flex items-center gap-2 p-2 w-full text-left rounded-md transition ${
                  selectedChatRoom === room._id.toString()
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <GroupIcon className="text-purple-600" />
                {room.chatName} <span className="text-sm text-gray-500">({room.participants.length} members)</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Window */}
      {selectedChatRoom && (
        <div className="mt-4 border p-4 rounded-md shadow bg-white">
          <h2 className="text-lg font-semibold mb-2">Chat Room: {selectedChatRoom}</h2>
          <div className="border p-2 h-40 overflow-y-auto bg-gray-100 rounded-md">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <p key={index} className="p-1 border-b">{msg}</p>
              ))
            ) : (
              <p className="text-gray-500">No messages yet.</p>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
