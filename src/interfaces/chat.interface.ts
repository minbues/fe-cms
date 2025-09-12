export interface Client {
  id: number;
  fullName: string;
  email: string;
}

export interface LastMessage {
  id: string;
  content: string;
  createdAt: string;
  senderId: number;
}

export interface ChatSession {
  id: string;
  client: Client;
  lastMessage: LastMessage;
  isClosed: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: number;
  content: string;
  senderName: string;
  isRead: boolean;
}
