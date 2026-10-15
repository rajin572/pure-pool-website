"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  RotateCcw,
  X,
  Sparkles,
  Bot,
  User,
  AlertTriangle,
} from "lucide-react";
import {
  ChatMessage,
  INITIAL_CHAT_MESSAGES,
  sendChatMessage,
} from "@/service/ChatService/ChatServiceApi";

let messageSeq = 0;
const createMsgId = (prefix: string) => {
  messageSeq += 1;
  return `${prefix}-${messageSeq}`;
};

interface ChatBotWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatBotWindow: React.FC<ChatBotWindowProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: createMsgId("user"),
      role: "user",
      content: text.trim(),
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    try {
      /**
       * In live mode:
       * Trigger live AI assistant endpoint or Redux RTK Query mutation:
       */
      const res = await sendChatMessage(text, messages);

      const botMessage: ChatMessage = {
        id: createMsgId("bot"),
        role: "assistant",
        content: res.reply,
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: createMsgId("err"),
        role: "assistant",
        content: "I apologize, but I could not connect to our knowledge base. Please call us at +34 910 000 000.",
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_CHAT_MESSAGES);
    setInputValue("");
  };

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[410px] h-[550px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-zinc-200/90 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* 1. Header */}
      <div className="bg-gradient-to-r from-[#041D37] to-[#0A3055] text-white p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center shrink-0 shadow-xs">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#041D37] rounded-full" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight">Pure Pool AI</span>
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <span className="text-[11px] text-zinc-300 font-medium">
              Always online · Madrid team
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleResetChat}
            title="Reset conversation"
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close chat"
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Messages Thread */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 bg-zinc-50/60">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`flex items-start gap-2 max-w-[85%] ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
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
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-tr-xs shadow-2xs font-medium"
                      : "bg-white text-zinc-800 rounded-tl-xs border border-zinc-200 shadow-2xs"
                  }`}
                >
                  {msg.content}
                </div>
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-zinc-400 px-9">
                {msg.timestamp}
              </span>

              {/* Suggested Action Chips (if any on first message) */}
              {!isUser && msg.suggestedActions && (
                <div className="flex flex-wrap gap-1.5 pt-1 pl-9 max-w-full">
                  {msg.suggestedActions.map((action, aIdx) => (
                    <button
                      key={aIdx}
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
          );
        })}

        {/* Typing indicator */}
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
      </div>

      {/* 3. Input & Actions */}
      <div className="p-3 bg-white border-t border-zinc-200 shrink-0 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your pool..."
            disabled={isTyping}
            className="flex-1 h-10 px-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
          />
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-2xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400 px-1">
          <span>Pure Pool Smart Assistant</span>
          <a
            href="tel:+34910000000"
            className="text-red-500 font-semibold hover:underline inline-flex items-center gap-0.5"
          >
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>Emergency: 910 000 000</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ChatBotWindow;
