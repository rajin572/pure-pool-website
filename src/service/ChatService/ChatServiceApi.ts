import { get, post } from "@/lib/apiRequest";

export type TConversationKind = "DIRECT" | "GROUP" | "CUSTOMER_SUPPORT" | "AI_SUPPORT";
export type THandledBy = "AI" | "HUMAN";
export type TMessageSource = "HUMAN" | "AI" | "SYSTEM";

export interface IConversationParticipant {
  _id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

/** `Conversation`, as returned by `GET /conversations` / `POST /conversations`. */
export interface IConversation {
  _id: string;
  kind: TConversationKind;
  name?: string;
  participants: IConversationParticipant[];
  status: "OPEN" | "CLOSED";
  handledBy: THandledBy;
  title?: string;
  lastMessage?: { text: string; at: string; senderId?: string } | null;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IMessageSenderRef {
  _id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

/** `senderId` is populated on `GET .../messages` only; POST/socket payloads carry a plain id or omit it (SYSTEM messages). */
export interface IMessage {
  _id: string;
  conversationId: string;
  senderId?: IMessageSenderRef | string | null;
  source: TMessageSource;
  text: string;
  attachments: string[];
  readBy: string[];
  createdAt: string;
  updatedAt: string;
}

export const createConversation = (body: { kind: TConversationKind; name?: string; participants?: string[] }) =>
  post<IConversation>("/conversations", body);

export const getMessages = (conversationId: string, params?: { before?: string; limit?: number }) =>
  get<IMessage[]>(`/conversations/${conversationId}/messages`, params);

export const sendMessage = (conversationId: string, text: string) =>
  post<IMessage>(`/conversations/${conversationId}/messages`, { text });

export const markConversationRead = (conversationId: string) =>
  post<{ marked: number }>(`/conversations/${conversationId}/read`);

export const askAiSupport = (conversationId: string, text: string) =>
  post<{ userMessage: IMessage; reply: IMessage }>(`/conversations/${conversationId}/ai-reply`, { text });

export const requestHumanHandoff = (conversationId: string) =>
  post<IConversation>(`/conversations/${conversationId}/handoff`);
