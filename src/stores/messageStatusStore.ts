import { create } from "zustand";

// ----------------------------
// Types and Interfaces
// ----------------------------

// The type of message content (media type)
export type MessageMediaType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "file"
  | "location";

// The lifecycle status of a message
export type MessageStatusType =
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "expired";

// Who read a message and when
export interface ReadReceipt {
  userId: string;
  userName: string;
  readAt: Date;
  deviceInfo?: string;
}

// Message status data
export interface MessageStatus {
  messageId: string;
  chatId: string;
  senderId: string;

  // Status progression
  status: MessageStatusType;

  // Timestamps
  sentAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
  failedAt?: Date;

  // Read receipts (for group chats)
  readBy: ReadReceipt[];

  // Delivery details
  deliveryAttempts: number;
  lastAttemptAt?: Date;
  errorMessage?: string;

  // Metadata
  isEncrypted: boolean;
  messageSize: number; // in bytes
  messageType: MessageMediaType; // fixed: uses MessageMediaType
}

// Configuration for message tracking behavior
export interface MessageStatusSettings {
  sendReadReceipts: boolean;
  showReadReceipts: boolean;
  showDeliveryStatus: boolean;
  showTypingStatus: boolean;
  readReceiptDelay: number; // seconds
  enableGroupReadReceipts: boolean;
  showLastSeen: boolean;
}

// ----------------------------
// Zustand State Definition
// ----------------------------
interface MessageStatusState {
  // Message statuses
  messageStatuses: Record<string, MessageStatus>;

  // Settings
  settings: MessageStatusSettings;

  // Batch operations
  pendingStatusUpdates: Record<string, Partial<MessageStatus>>;

  // Actions
  createMessageStatus: (
    messageId: string,
    chatId: string,
    senderId: string,
    mediaType?: MessageMediaType
  ) => void;

  updateMessageStatus: (
    messageId: string,
    status: MessageStatusType,
    timestamp?: Date
  ) => void;

  addReadReceipt: (
    messageId: string,
    userId: string,
    userName: string,
    readAt?: Date
  ) => void;

  markMessageAsRead: (
    messageId: string,
    userId: string,
    userName: string
  ) => void;

  markChatAsRead: (
    chatId: string,
    userId: string,
    userName: string,
    upToMessageId?: string
  ) => void;

  batchUpdateStatuses: (
    updates: Array<{
      messageId: string;
      status: MessageStatusType;
      timestamp?: Date;
    }>
  ) => void;

  // Getters
  getMessageStatus: (messageId: string) => MessageStatus | null;
  getChatMessageStatuses: (chatId: string) => MessageStatus[];
  getUnreadCount: (chatId: string, userId: string) => number;
  getLastReadMessage: (chatId: string, userId: string) => string | null;

  // Settings
  updateSettings: (settings: Partial<MessageStatusSettings>) => void;
}

// ----------------------------
// Status Manager for Simulated Updates
// ----------------------------
class MessageStatusManager {
  private static instance: MessageStatusManager;
  private callbacks: Array<
    (messageId: string, status: MessageStatusType, timestamp: Date) => void
  > = [];

  static getInstance(): MessageStatusManager {
    if (!MessageStatusManager.instance) {
      MessageStatusManager.instance = new MessageStatusManager();
    }
    return MessageStatusManager.instance;
  }

  addCallback(
    callback: (
      messageId: string,
      status: MessageStatusType,
      timestamp: Date
    ) => void
  ) {
    this.callbacks.push(callback);
  }

  // Simulate message status progression
  simulateMessageDelivery(messageId: string) {
    // Sent -> Delivered (1-3 seconds)
    setTimeout(() => {
      this.callbacks.forEach((cb) => cb(messageId, "delivered", new Date()));
    }, 1000 + Math.random() * 2000);

    // Delivered -> Read (3-10 seconds, 70% chance)
    if (Math.random() > 0.3) {
      setTimeout(() => {
        this.callbacks.forEach((cb) => cb(messageId, "read", new Date()));
      }, 3000 + Math.random() * 7000);
    }
  }

  // Simulate message failure (5% chance)
  simulateMessageFailure(messageId: string) {
    if (Math.random() < 0.05) {
      setTimeout(() => {
        this.callbacks.forEach((cb) => cb(messageId, "failed", new Date()));
      }, 2000 + Math.random() * 3000);
      return true;
    }
    return false;
  }
}

// ----------------------------
// Zustand Store Implementation
// ----------------------------
export const useMessageStatusStore = create<MessageStatusState>((set, get) => ({
  messageStatuses: {},
  settings: {
    sendReadReceipts: true,
    showReadReceipts: true,
    showDeliveryStatus: true,
    showTypingStatus: true,
    readReceiptDelay: 0, // No delay
    enableGroupReadReceipts: true,
    showLastSeen: true,
  },
  pendingStatusUpdates: {},

  createMessageStatus: (messageId, chatId, senderId, mediaType = "text") => {
    const messageStatus: MessageStatus = {
      messageId,
      chatId,
      senderId,
      status: "sending",
      sentAt: new Date(),
      readBy: [],
      deliveryAttempts: 1,
      lastAttemptAt: new Date(),
      isEncrypted: true,
      messageSize: Math.floor(Math.random() * 1000) + 100,
      messageType: mediaType, // ✅ Correctly typed
    };

    set((state) => ({
      messageStatuses: {
        ...state.messageStatuses,
        [messageId]: messageStatus,
      },
    }));

    // Simulate sending process
    const manager = MessageStatusManager.getInstance();

    if (!manager.simulateMessageFailure(messageId)) {
      setTimeout(() => {
        get().updateMessageStatus(messageId, "sent");
        manager.simulateMessageDelivery(messageId);
      }, 100 + Math.random() * 500);
    }
  },

  updateMessageStatus: (messageId, status, timestamp = new Date()) => {
    set((state) => {
      const existing = state.messageStatuses[messageId];
      if (!existing) return state;

      const updates: Partial<MessageStatus> = { status };
      switch (status) {
        case "sent":
          updates.sentAt = timestamp;
          break;
        case "delivered":
          updates.deliveredAt = timestamp;
          break;
        case "read":
          updates.readAt = timestamp;
          break;
        case "failed":
          updates.failedAt = timestamp;
          updates.deliveryAttempts = existing.deliveryAttempts + 1;
          updates.errorMessage = "Failed to deliver message";
          break;
      }

      return {
        messageStatuses: {
          ...state.messageStatuses,
          [messageId]: { ...existing, ...updates },
        },
      };
    });
  },

  addReadReceipt: (messageId, userId, userName, readAt = new Date()) => {
    set((state) => {
      const message = state.messageStatuses[messageId];
      if (!message) return state;

      const existingIdx = message.readBy.findIndex((r) => r.userId === userId);
      const newReceipt: ReadReceipt = {
        userId,
        userName,
        readAt,
        deviceInfo: "Web Browser",
      };

      const updatedReadBy =
        existingIdx >= 0
          ? [
              ...message.readBy.slice(0, existingIdx),
              newReceipt,
              ...message.readBy.slice(existingIdx + 1),
            ]
          : [...message.readBy, newReceipt];

      return {
        messageStatuses: {
          ...state.messageStatuses,
          [messageId]: {
            ...message,
            readBy: updatedReadBy,
            status: message.status === "delivered" ? "read" : message.status,
            readAt: message.readAt || readAt,
          },
        },
      };
    });
  },

  markMessageAsRead: (messageId, userId, userName) => {
    const { settings } = get();
    if (!settings.sendReadReceipts) return;
    setTimeout(() => {
      get().addReadReceipt(messageId, userId, userName);
    }, settings.readReceiptDelay * 1000);
  },

  markChatAsRead: (chatId, userId, userName, upToMessageId) => {
    const { messageStatuses, settings } = get();
    if (!settings.sendReadReceipts) return;

    const chatMessages = Object.values(messageStatuses)
      .filter((m) => m.chatId === chatId)
      .sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());

    let messagesToMark = chatMessages;
    if (upToMessageId) {
      const index = chatMessages.findIndex(
        (m) => m.messageId === upToMessageId
      );
      if (index >= 0) messagesToMark = chatMessages.slice(0, index + 1);
    }

    messagesToMark.forEach((msg, i) => {
      if (msg.senderId !== userId && msg.status !== "read") {
        setTimeout(() => {
          get().markMessageAsRead(msg.messageId, userId, userName);
        }, i * 100 + settings.readReceiptDelay * 1000);
      }
    });
  },

  batchUpdateStatuses: (updates) => {
    set((state) => {
      const newStatuses = { ...state.messageStatuses };

      updates.forEach(({ messageId, status, timestamp = new Date() }) => {
        const existing = newStatuses[messageId];
        if (!existing) return;

        const changes: Partial<MessageStatus> = { status };
        switch (status) {
          case "delivered":
            changes.deliveredAt = timestamp;
            break;
          case "read":
            changes.readAt = timestamp;
            break;
          case "failed":
            changes.failedAt = timestamp;
            changes.deliveryAttempts = existing.deliveryAttempts + 1;
            break;
        }

        newStatuses[messageId] = { ...existing, ...changes };
      });

      return { messageStatuses: newStatuses };
    });
  },

  getMessageStatus: (id) => get().messageStatuses[id] || null,

  getChatMessageStatuses: (chatId) => {
    const { messageStatuses } = get();
    return Object.values(messageStatuses)
      .filter((m) => m.chatId === chatId)
      .sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());
  },

  getUnreadCount: (chatId, userId) => {
    const { messageStatuses } = get();
    return Object.values(messageStatuses).filter(
      (m) =>
        m.chatId === chatId &&
        m.senderId !== userId &&
        m.status !== "read" &&
        !m.readBy.some((r) => r.userId === userId)
    ).length;
  },

  getLastReadMessage: (chatId, userId) => {
    const { messageStatuses } = get();
    const readMessages = Object.values(messageStatuses)
      .filter(
        (m) =>
          m.chatId === chatId &&
          (m.status === "read" || m.readBy.some((r) => r.userId === userId))
      )
      .sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime());

    return readMessages.length > 0 ? readMessages[0].messageId : null;
  },

  updateSettings: (settings) => {
    set((state) => ({
      settings: { ...state.settings, ...settings },
    }));
  },
}));

// Initialize status manager listener
const statusManager = MessageStatusManager.getInstance();
statusManager.addCallback((messageId, status, timestamp) => {
  useMessageStatusStore
    .getState()
    .updateMessageStatus(messageId, status, timestamp);
});
