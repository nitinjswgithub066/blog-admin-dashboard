export type AdminNotification = {
  id: string;
  type: "comment" | "traffic" | "draft" | "document" | "legal" | "category" | "system";
  title: string;
  message?: string;
  time: string;
  isRead: boolean;
  createdAt: string;
};
