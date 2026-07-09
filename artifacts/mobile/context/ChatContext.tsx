import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Chat,
  Contact,
  CURRENT_USER_ID,
  generateId,
  Message,
  mockEncrypt,
} from '@/types/chat';

/**
 * Mock "ViewModel" layer for SecureChat.
 *
 * This mirrors the role a Kotlin StateFlow-backed ViewModel would play:
 * a single source of truth (`chats` state) that screens subscribe to,
 * plus intent-style functions (`sendMessage`, `markChatRead`, ...) that
 * mutate that state. There is no backend — everything lives in memory
 * for this first build, seeded once on mount.
 */

const CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Amara Osei',
    initials: 'AO',
    avatarColor: '#22C55E',
    online: true,
    about: 'Product design lead',
  },
  {
    id: 'c2',
    name: 'Diego Fernandez',
    initials: 'DF',
    avatarColor: '#34D399',
    online: false,
    about: 'Backend engineer',
  },
  {
    id: 'c3',
    name: 'Priya Nair',
    initials: 'PN',
    avatarColor: '#4ADE80',
    online: true,
    about: 'Security researcher',
  },
  {
    id: 'c4',
    name: 'Liam Chen',
    initials: 'LC',
    avatarColor: '#10B981',
    online: false,
    about: 'Traveling — back soon',
  },
  {
    id: 'c5',
    name: 'Sofia Rossi',
    initials: 'SR',
    avatarColor: '#059669',
    online: true,
    about: 'Available',
  },
];

function seedMessages(contactId: string): Message[] {
  const now = Date.now();
  const scripts: Record<string, [string, string][]> = {
    c1: [
      ['them', "Hey! Did you see the new lock screen mockups?"],
      ['me', 'Just opened them, the shield motif is clean'],
      ['them', "Glad you like it — let's ship it this week"],
    ],
    c2: [
      ['them', 'Key exchange service is deployed to staging'],
      ['me', 'Nice, running the handshake tests now'],
      ['them', 'Ping me if anything looks off'],
    ],
    c3: [
      ['them', 'Reviewed the encryption flow, looks solid'],
      ['them', 'One note on key rotation, sending doc'],
      ['me', 'Appreciate it, will read tonight'],
    ],
    c4: [
      ['them', "Landed, terrible wifi at the airport"],
      ['me', 'Safe travels! Talk when you land'],
    ],
    c5: [
      ['them', "Can you re-send the verified badge asset?"],
      ['me', 'Sending it over now'],
      ['them', 'Perfect, thank you'],
    ],
  };
  const script = scripts[contactId] ?? [];
  return script.map(([who, text], i) => {
    const plaintext = text;
    return {
      id: generateId(),
      senderId: who === 'me' ? CURRENT_USER_ID : contactId,
      encryptedPayload: mockEncrypt(plaintext),
      plaintext,
      timestamp: now - (script.length - i) * 1000 * 60 * 7,
      isRead: who === 'me' || i < script.length - 1,
    };
  });
}

function seedChats(): Chat[] {
  return CONTACTS.map((contact, i) => ({
    id: `chat-${contact.id}`,
    contact,
    messages: seedMessages(contact.id),
    pinned: i === 0,
  }));
}

const REPLIES = [
  'Got it, thanks!',
  "That works for me.",
  'Sending you the details shortly.',
  "Sounds good — talk soon.",
  "On it, give me a minute.",
  'Interesting, tell me more.',
];

interface ChatContextValue {
  chats: Chat[];
  getChat: (chatId: string) => Chat | undefined;
  getChatByContactId: (contactId: string) => Chat | undefined;
  sendMessage: (chatId: string, plaintext: string) => void;
  markChatRead: (chatId: string) => void;
  totalUnread: number;
}

const ChatContext = createContext<ChatContextValue | null>(null);

function unreadCountFor(chat: Chat): number {
  return chat.messages.filter(
    (m) => !m.isRead && m.senderId !== CURRENT_USER_ID,
  ).length;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // Single StateFlow-equivalent source of truth for all chat + message state.
  const [chats, setChats] = useState<Chat[]>(() => seedChats());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const sendMessage = useCallback((chatId: string, plaintext: string) => {
    const trimmed = plaintext.trim();
    if (!trimmed) return;

    const outgoing: Message = {
      id: generateId(),
      senderId: CURRENT_USER_ID,
      encryptedPayload: mockEncrypt(trimmed),
      plaintext: trimmed,
      timestamp: Date.now(),
      isRead: true,
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, outgoing] }
          : chat,
      ),
    );

    // Simulate the contact receiving + replying, to exercise state
    // transitions (new message arriving, unread badge incrementing).
    const delay = 1400 + Math.random() * 1200;
    const timer = setTimeout(() => {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== chatId) return chat;
          const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)]!;
          const incoming: Message = {
            id: generateId(),
            senderId: chat.contact.id,
            encryptedPayload: mockEncrypt(reply),
            plaintext: reply,
            timestamp: Date.now(),
            isRead: false,
          };
          return { ...chat, messages: [...chat.messages, incoming] };
        }),
      );
    }, delay);
    timers.current.push(timer);
  }, []);

  const markChatRead = useCallback((chatId: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: chat.messages.map((m) =>
                m.senderId !== CURRENT_USER_ID ? { ...m, isRead: true } : m,
              ),
            }
          : chat,
      ),
    );
  }, []);

  const getChat = useCallback(
    (chatId: string) => chats.find((c) => c.id === chatId),
    [chats],
  );

  const getChatByContactId = useCallback(
    (contactId: string) => chats.find((c) => c.contact.id === contactId),
    [chats],
  );

  const totalUnread = useMemo(
    () => chats.reduce((sum, chat) => sum + unreadCountFor(chat), 0),
    [chats],
  );

  const value = useMemo(
    () => ({
      chats,
      getChat,
      getChatByContactId,
      sendMessage,
      markChatRead,
      totalUnread,
    }),
    [
      chats,
      getChat,
      getChatByContactId,
      sendMessage,
      markChatRead,
      totalUnread,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatStore() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChatStore must be used within a ChatProvider');
  }
  return ctx;
}

export function chatUnreadCount(chat: Chat): number {
  return unreadCountFor(chat);
}
