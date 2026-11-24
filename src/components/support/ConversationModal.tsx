"use client";

import React, { useEffect, useRef, useState } from "react";
import ReusableModal from "@/components/ui/CustomUi/ReuseableModal";
import { Loader2, Send } from "lucide-react";
import {
  createConversation,
  getMessages,
  sendMessage,
  markConversationRead,
  IConversation,
  IMessage,
  TConversationKind,
} from "@/service/ChatService/ChatServiceApi";
import { errorMessage } from "@/lib/apiRequest";
import { useSessionUser } from "@/lib/useSessionUser";
import { useSocket } from "@/context/socket-context";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: TConversationKind;
  participants?: string[];
  title: string;
  subtitle?: string;
}

const senderIdOf = (senderId: IMessage["senderId"]) => (senderId && typeof senderId === "object" ? senderId._id : senderId);

export default function ConversationModal({ open, onOpenChange, kind, participants, title, subtitle }: Props) {
  const me = useSessionUser();
  const socketCtx = useSocket();
  const socket = socketCtx?.socket;

  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setConversation(null);
      setMessages([]);
      setLoadError(null);
      const convRes = await createConversation({ kind, participants });
      if (cancelled) return;
      if (!convRes.success) {
        setLoadError(errorMessage(convRes));
        return;
      }
      setConversation(convRes.data);
      const msgRes = await getMessages(convRes.data._id, { limit: 50 });
      if (cancelled) return;
      if (msgRes.success) setMessages([...msgRes.data].reverse());
      markConversationRead(convRes.data._id);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, kind, participants]);

  useEffect(() => {
    if (!socket || !conversation) return;
    socket.emit("conversation:join", conversation._id);
    const onNew = (payload: { conversationId: string; message: IMessage }) => {
      if (payload.conversationId !== conversation._id) return;
      setMessages((prev) => [...prev, payload.message]);
      markConversationRead(conversation._id);
    };
    socket.on("message:new", onNew);
    return () => {
      socket.emit("conversation:leave", conversation._id);
      socket.off("message:new", onNew);
    };
  }, [socket, conversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !conversation || isSending) return;
    setInputText("");
    setIsSending(true);
    const res = await sendMessage(conversation._id, text);
    setIsSending(false);
    if (res.success) setMessages((prev) => [...prev, res.data]);
    else setLoadError(errorMessage(res));
  };

  return (
    <ReusableModal open={open} onOpenChange={onOpenChange} title={title} description={subtitle} maxWidth="sm:max-w-lg">
      <div className="flex flex-col h-[60vh] sm:h-[480px]">
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 py-2">
          {!conversation && !loadError ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-500 gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Connecting...
            </div>
          ) : loadError ? (
            <div className="flex-1 flex items-center justify-center text-sm text-red-600 text-center px-6">{loadError}</div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Say hello to get started.</div>
          ) : (
            messages.map((msg) => {
              if (msg.source === "SYSTEM") {
                return (
                  <div key={msg._id} className="flex justify-center">
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1 text-center max-w-[90%]">{msg.text}</span>
                  </div>
                );
              }
              const isOutgoing = senderIdOf(msg.senderId) === me?.id;
              return (
                <div key={msg._id} className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${isOutgoing ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={!conversation}
            placeholder="Type a message..."
            className="flex-1 h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-sky-500 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!conversation || !inputText.trim() || isSending}
            className="w-11 h-11 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </ReusableModal>
  );
}
