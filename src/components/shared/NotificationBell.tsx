"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { errorMessage } from "@/lib/apiRequest";
import {
  getUnreadCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type INotification,
} from "@/service/NotificationService/NotificationServiceApi";

const POLL_MS = 60_000;

const timeAgo = (iso: string) => {
  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return "just now";
};

/** Bell with the unread badge and the list panel. `scrolled` only switches the colours. */
const NotificationBell = ({ scrolled }: { scrolled: boolean }) => {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<INotification[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const refreshCount = useCallback(async () => {
    const res = await getUnreadCount();
    if (res.success) setUnread(res.data.unread);
  }, []);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await listNotifications(10);
    setLoading(false);
    if (!res.success) {
      setError(errorMessage(res, "We couldn't load your notifications."));
      return;
    }
    setItems(res.data.items);
    setUnread(res.data.unread);
  }, []);

  // Badge: once on mount, then every minute while the tab is visible.
  useEffect(() => {
    const first = setTimeout(refreshCount, 0);
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") refreshCount();
    }, POLL_MS);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [refreshCount]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) loadList();
  };

  const handleRead = async (n: INotification) => {
    if (n.readAt) return;
    const readAt = new Date().toISOString();
    setItems((cur) => cur?.map((x) => (x._id === n._id ? { ...x, readAt } : x)) ?? cur);
    setUnread((c) => Math.max(0, c - 1));
    const res = await markNotificationRead(n._id);
    if (!res.success) {
      // Put it back so the badge stays true to the server.
      setItems((cur) => cur?.map((x) => (x._id === n._id ? { ...x, readAt: undefined } : x)) ?? cur);
      setUnread((c) => c + 1);
      toast.error(errorMessage(res, "We couldn't mark it as read."));
    }
  };

  const handleReadAll = async () => {
    setMarkingAll(true);
    const res = await markAllNotificationsRead();
    setMarkingAll(false);
    if (!res.success) {
      toast.error(errorMessage(res, "We couldn't mark them as read."));
      return;
    }
    const readAt = new Date().toISOString();
    setItems((cur) => cur?.map((x) => (x.readAt ? x : { ...x, readAt })) ?? cur);
    setUnread(0);
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        aria-expanded={open}
        onClick={toggle}
        className={`relative flex items-center justify-center size-8 xl:size-9 rounded-full border transition-all duration-200 shrink-0 cursor-pointer ${scrolled
          ? "border-slate-200/90 text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 hover:text-slate-900"
          : "border-white/20 text-white/90 bg-white/10 hover:bg-white/20 hover:text-white backdrop-blur-md"
          }`}
      >
        <Bell className="size-4 xl:size-4.5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-sky-500 text-white text-[10px] font-bold leading-4 text-center ring-2 ring-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 origin-top-right rounded-2xl bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.12)] text-slate-800 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
            <button
              type="button"
              onClick={handleReadAll}
              disabled={unread === 0 || markingAll}
              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 disabled:text-slate-300 disabled:cursor-not-allowed cursor-pointer"
            >
              <CheckCheck className="size-3.5" />
              Mark all as read
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && !items && (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
                <Loader2 className="size-4 animate-spin" /> Loading…
              </div>
            )}

            {error && (
              <div className="px-4 py-8 text-center text-sm text-slate-600">
                <p>{error}</p>
                <button type="button" onClick={loadList} className="mt-2 text-sky-600 font-semibold cursor-pointer">
                  Try again
                </button>
              </div>
            )}

            {!error && items && items.length === 0 && (
              <p className="px-4 py-10 text-center text-sm text-slate-500">You&apos;re all caught up. No notifications yet.</p>
            )}

            {!error && items && items.length > 0 && (
              <ul>
                {items.map((n) => (
                  <li key={n._id}>
                    <button
                      type="button"
                      onClick={() => handleRead(n)}
                      className={`w-full text-left px-4 py-3 flex gap-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${n.readAt ? "" : "bg-sky-50/50"}`}
                    >
                      <span
                        aria-hidden
                        className={`mt-1.5 size-2 rounded-full shrink-0 ${n.readAt ? "bg-transparent" : "bg-sky-500"}`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className={`block text-sm leading-snug ${n.readAt ? "font-medium text-slate-700" : "font-semibold text-slate-900"}`}>
                          {n.title}
                        </span>
                        {n.body && <span className="block text-xs text-slate-500 mt-0.5 leading-snug">{n.body}</span>}
                        <span className="block text-[11px] text-slate-400 mt-1">{timeAgo(n.createdAt)}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
