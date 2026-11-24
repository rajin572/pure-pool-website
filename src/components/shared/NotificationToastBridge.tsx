"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useSocket } from "@/context/socket-context";

interface NotificationPayload {
  title: string;
  body: string;
}

/** Shows a toast for every `notification:new` socket event while the site is open. */
export default function NotificationToastBridge() {
  const socketCtx = useSocket();
  const socket = socketCtx?.socket;

  useEffect(() => {
    if (!socket) return;
    const onNotification = (payload: NotificationPayload) => toast.info(payload.title, { description: payload.body });
    socket.on("notification:new", onNotification);
    return () => {
      socket.off("notification:new", onNotification);
    };
  }, [socket]);

  return null;
}
