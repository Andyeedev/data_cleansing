export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  severity?: string;
  is_read: boolean;
  read?: boolean;
  link?: string;
  created_at: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  page: number;
  page_size: number;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  type: string;
  channel: string;
  enabled: boolean;
}

export interface PreferenceUpdateRequest {
  type: string;
  channel: string;
  enabled: boolean;
}
