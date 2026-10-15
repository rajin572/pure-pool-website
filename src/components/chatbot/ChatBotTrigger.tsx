"use client";

import React from "react";
import { MessageSquare, X, Sparkles } from "lucide-react";

interface ChatBotTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
}

export const ChatBotTrigger: React.FC<ChatBotTriggerProps> = ({
  isOpen,
  onToggle,
  unreadCount = 0,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip Pill */}
      {!isOpen && (
        <div
          onClick={onToggle}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-zinc-200/90 text-xs font-semibold text-zinc-800 shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 animate-fade-in group"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
          <span>Ask Pure Pool AI</span>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={onToggle}
        aria-label={isOpen ? "Close AI Support Chat" : "Open AI Support Chat"}
        className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-blue-700 via-sky-600 to-sky-400 hover:from-blue-800 hover:to-sky-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 cursor-pointer"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-200 rotate-0" />
        ) : (
          <MessageSquare className="w-6 h-6 transition-transform duration-200" />
        )}

        {/* Online Indicator Badge */}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full">
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </span>
        )}

        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatBotTrigger;

