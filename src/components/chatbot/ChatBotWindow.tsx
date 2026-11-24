"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Send,
  RotateCcw,
  X,
  Sparkles,
  Bot,
  User,
  AlertTriangle,
  Headset,
} from "lucide-react";
import {
  IConversation,
  IMessage,
  createConversation,
  getMessages,
  sendMessage,
  askAiSupport,
  requestHumanHandoff,
  markConversationRead,
} from "@/service/ChatService/ChatServiceApi";
import { errorMessage } from "@/lib/apiRequest";
import { useSessionUser } from "@/lib/useSessionUser";
import { useSocket } from "@/context/socket-context";

const STORAGE_KEY = "pp_ai_conversation_id";

const SUGGESTED_ACTIONS = [
  { label: "Emergency Hotline", query: "What is the emergency hotline?" },
  { label: "Water is Cloudy", query: "My pool water is cloudy and murky" },
  { label: "Pay an Invoice", query: "How do I pay an invoice?" },
  { label: "Talk to a human", query: "__HANDOFF__" },
];

interface ChatBotWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const senderIdOf = (senderId: IMessage["senderId"]) => (senderId && typeof senderId === "object" ? senderId._id : senderId);

export const ChatBotWindow: React.FC<ChatBotWindowProps> = ({ isOpen, onClose }) => {
  const me = useSessionUser();
  const socketCtx = useSocket();
  const socket = socketCtx?.socket;

  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [handoffUnavailable, setHandoffUnavailable] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const didInit = useRef(false);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  useEffect(() => {
    if (!isOpen || !me || me.role !== "CUSTOMER" || didInit.current) return;
    didInit.current = true;
    (async () => {
      const storedId = sessionStorage.getItem(STORAGE_KEY);
      if (storedId) {
        const msgRes = await getMessages(storedId, { limit: 50 });
        if (msgRes.success) {
          setConversation({ _id: storedId } as IConversation);
          setMessages([...msgRes.data].reverse());
          markConversationRead(storedId);
          return;
        }
        sessionStorage.removeItem(STORAGE_KEY);
      }
      const convRes = await createConversation({ kind: "AI_SUPPORT" });
      if (convRes.success) {
        sessionStorage.setItem(STORAGE_KEY, convRes.data._id);
        setConversation(convRes.data);
      } else {
        setLoadError(errorMessage(convRes));
      }
    })();
  }, [isOpen, me]);

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

  if (!isOpen) return null;

  const handleHandoff = async (thenSendText?: string) => {
    if (!conversation) return;
    setIsTyping(true);
    const res = await requestHumanHandoff(conversation._id);
    if (res.success) {
      setConversation(res.data);
      if (thenSendText) {
        const sendRes = await sendMessage(conversation._id, thenSendText);
        if (sendRes.success) setMessages((prev) => [...prev, sendRes.data]);
      }
      setIsTyping(false);
    } else {
      setIsTyping(false);
      setHandoffUnavailable(true);
      setLoadError(errorMessage(res, "No support agent is available right now. Please call +34 910 000 000."));
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isTyping || !conversation) return;

    if (text === "__HANDOFF__") {
      await handleHandoff();
      return;
    }

    if (!textToSend) setInputValue("");
    setLoadError(null);
    setIsTyping(true);

    if (conversation.handledBy === "AI") {
      const res = await askAiSupport(conversation._id, text.trim());
      if (res.success) {
        setIsTyping(false);
        setMessages((prev) => [...prev, res.data.userMessage, res.data.reply]);
      } else if (errorMessage(res).toLowerCase().includes("not configured")) {
        await handleHandoff(text.trim());
      } else {
        setIsTyping(false);
        setLoadError(errorMessage(res));
      }
    } else {
      const res = await sendMessage(conversation._id, text.trim());
      setIsTyping(false);
      if (res.success) setMessages((prev) => [...prev, res.data]);
      else setLoadError(errorMessage(res));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setConversation(null);
    setMessages([]);
    setLoadError(null);
    setHandoffUnavailable(false);
    didInit.current = false;
  };

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[410px] h-[550px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-zinc-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-gradient-to-r from-[#041D37] to-[#0A3055] text-white p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center shrink-0 shadow-xs">
            {conversation?.handledBy === "HUMAN" ? <Headset className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#041D37] rounded-full" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight">{conversation?.handledBy === "HUMAN" ? "Pure Pool Support" : "Pure Pool AI"}</span>
              {conversation?.handledBy !== "HUMAN" && <Sparkles className="w-3.5 h-3.5 text-sky-400" />}
            </div>
            <span className="text-[11px] text-zinc-300 font-medium">
              {conversation?.handledBy === "HUMAN" ? "Connected to our team" : "Always online · Madrid team"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button type="button" onClick={handleResetChat} title="Reset conversation" className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button type="button" onClick={onClose} title="Close chat" className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 bg-zinc-50/60">
        {!me ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 px-4">
            <Bot className="w-10 h-10 text-sky-400" />
            <p className="text-sm text-zinc-700 font-medium">Log in to chat with our Pure Pool AI assistant or support team.</p>
            <Link href="/login" className="text-sm font-bold text-sky-600 hover:underline">
              Log in
            </Link>
          </div>
        ) : me.role !== "CUSTOMER" ? (
          <div className="flex-1 flex items-center justify-center text-center text-sm text-zinc-500 px-4">
            This assistant is available for customer accounts.
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1.5 items-start">
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-sky-100 border border-sky-200 text-sky-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed bg-white text-zinc-800 rounded-tl-xs border border-zinc-200 shadow-2xs">
                  Hello! I&apos;m your Pure Pool AI Assistant. How can I help you today? You can ask me about pool water
                  issues, scheduled maintenance, equipment warranties, or how to settle an invoice.
                </div>
              </div>
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 pl-9 max-w-full">
                  {SUGGESTED_ACTIONS.map((action, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSendMessage(action.query)}
                      className="px-2.5 py-1 rounded-full bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 text-[11px] font-semibold transition-colors shadow-2xs cursor-pointer"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {messages.map((msg) => {
              if (msg.source === "SYSTEM") {
                return (
                  <div key={msg._id} className="flex justify-center">
                    <span className="text-[11px] text-zinc-500 bg-zinc-100 rounded-full px-3 py-1 text-center max-w-[90%]">{msg.text}</span>
                  </div>
                );
              }
              const isUser = senderIdOf(msg.senderId) === me.id;
              return (
                <div key={msg._id} className={`flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
                  <div className={`flex items-start gap-2 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                    {!isUser ? (
                      <div className="w-7 h-7 rounded-full bg-sky-100 border border-sky-200 text-sky-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        <Bot className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${isUser
                        ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-tr-xs shadow-2xs font-medium"
                        : "bg-white text-zinc-800 rounded-tl-xs border border-zinc-200 shadow-2xs"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {loadError && (
              <div className="flex justify-center">
                <span className="text-[11px] text-red-600 bg-red-50 rounded-full px-3 py-1 text-center max-w-[90%]">{loadError}</span>
              </div>
            )}

            {isTyping && (
              <div className="flex items-center gap-2 pl-9">
                <div className="bg-white border border-zinc-200 px-3 py-2 rounded-2xl rounded-tl-xs flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {me?.role === "CUSTOMER" && (
        <div className="p-3 bg-white border-t border-zinc-200 shrink-0 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your pool..."
              disabled={isTyping || !conversation}
              className="flex-1 h-10 px-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping || !conversation}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-2xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-400 px-1">
            {conversation?.handledBy === "AI" && !handoffUnavailable ? (
              <button type="button" onClick={() => handleHandoff()} className="font-semibold text-sky-600 hover:underline cursor-pointer">
                Talk to a human
              </button>
            ) : (
              <span>Pure Pool Smart Assistant</span>
            )}
            <a href="tel:+34910000000" className="text-red-500 font-semibold hover:underline inline-flex items-center gap-0.5">
              <AlertTriangle className="w-2.5 h-2.5" />
              <span>Emergency: 910 000 000</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBotWindow;
