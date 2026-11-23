/**
 * Notifications (Postman folder "User"): list, unread count, mark one / all as read.
 * Allowed for every signed-in customer, including ones still waiting for approval.
 * Client Components only.
 */
import { post, patch, request } from "@/lib/apiRequest";
import type { IApiResult } from "@/types";

export interface INotification {
  _id: string;
  userId: string;
  kind: string;
  title: string;
  body?: string;
  resourceType?: string;
  resourceId?: string;
  createdAt: string;
  updatedAt?: string;
  /** Set once the notification has been read. */
  readAt?: string;
}

export interface INotificationList {
  items: INotification[];
  /** Unread notifications over the whole list, not just this page. */
  unread: number;
  total: number;
}

export const listNotifications = async (limit = 10): Promise<IApiResult<INotificationList>> => {
  const res = await request<INotification[]>(`/notifications?page=1&limit=${limit}`);
  if (!res.success) return res;
  const meta = res.meta as (typeof res.meta & { unread?: number }) | undefined;
  return {
    success: true,
    data: { items: res.data, unread: meta?.unread ?? 0, total: meta?.total ?? res.data.length },
  };
};

export const getUnreadCount = () => request<{ unread: number }>("/notifications/unread-count");

export const markNotificationRead = (id: string) => patch<INotification>(`/notifications/${id}/read`, {});

export const markAllNotificationsRead = () => post<{ marked: number }>("/notifications/read-all");
