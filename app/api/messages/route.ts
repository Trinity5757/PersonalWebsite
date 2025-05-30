// app/api/messages/route.ts

import { getAllMessages,getMessageByChatroom, getMessageByAuthor, createMessage } from '@/app/services/chatServices/messageService';
import { NextRequest } from 'next/server';
export async function GET(req:NextRequest) { 
  try {
    let messages; 
    
    const chatId = req.nextUrl.searchParams.get('chatId');
    const authorId = req.nextUrl.searchParams.get('authorId');
    if(chatId && !authorId){
        messages = await getMessageByChatroom(chatId);
    }

    if (!chatId && authorId){
        messages = await getMessageByAuthor(authorId);
    }
    if(chatId && authorId){
        messages = await getMessageByChatroom(chatId,authorId);
    }
    if(!chatId && !authorId){
        messages = await getAllMessages(); 
    }


    return new Response(JSON.stringify(messages), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
     
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response('Failed to fetch messages', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  
  try {
    const { chatId, senderId, content, messageType, mediaUrl, mediaSize} = await req.json();      
        
    const newMessage = await createMessage(chatId, senderId, content, messageType, mediaUrl, mediaSize);

    return new Response(JSON.stringify({
      "message": "Message created successfully with id: " + newMessage._id,
       "chatMessage": newMessage.content
      }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return new Response('Failed to create message', { status: 500 });
  }
}