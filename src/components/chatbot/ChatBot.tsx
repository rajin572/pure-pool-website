"use client";

import React, { useState } from "react";
import ChatBotTrigger from "./ChatBotTrigger";
import ChatBotWindow from "./ChatBotWindow";

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatBotTrigger
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
      />
      <ChatBotWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default ChatBot;

