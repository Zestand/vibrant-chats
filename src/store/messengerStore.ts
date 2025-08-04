import { create } from 'zustand';

export type ColorPalette = 'blue' | 'orange' | 'purple';
export type ThemeMode = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'user';
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  timestamp: Date;
  type: 'text' | 'image' | 'voice';
  imageUrl?: string;
  voiceUrl?: string;
  duration?: number; // for voice messages
  isPinned?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
}

interface MessengerState {
  // Theme & UI
  colorPalette: ColorPalette;
  themeMode: ThemeMode;
  
  // User
  currentUser: User | null;
  
  // Chats & Messages
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  
  // Draft
  messageDraft: string;
  
  // Actions
  setColorPalette: (palette: ColorPalette) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setCurrentUser: (user: User) => void;
  setActiveChat: (chat: Chat | null) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setMessageDraft: (draft: string) => void;
  deleteMessage: (messageId: string) => void;
  pinMessage: (messageId: string) => void;
  updateUnreadCount: (chatId: string, count: number) => void;
}

export const useMessengerStore = create<MessengerState>((set, get) => ({
  // Initial state
  colorPalette: 'blue',
  themeMode: 'light',
  currentUser: {
    id: 'user-1',
    name: 'Вы',
    avatar: '/placeholder.svg',
    role: 'user',
    isOnline: true,
  },
  chats: [
    {
      id: 'chat-1',
      name: 'Алиса Петрова',
      avatar: '/placeholder.svg',
      participants: [],
      unreadCount: 2,
      isGroup: false,
      lastMessage: {
        id: 'msg-1',
        content: 'Привет! Как дела?',
        senderId: 'user-2',
        chatId: 'chat-1',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'text',
      },
    },
    {
      id: 'chat-2',
      name: 'Команда разработки',
      avatar: '/placeholder.svg',
      participants: [],
      unreadCount: 5,
      isGroup: true,
      lastMessage: {
        id: 'msg-2',
        content: 'Отличная работа!',
        senderId: 'user-3',
        chatId: 'chat-2',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        type: 'text',
      },
    },
    {
      id: 'chat-3',
      name: 'Михаил Иванов',
      avatar: '/placeholder.svg',
      participants: [],
      unreadCount: 0,
      isGroup: false,
      lastMessage: {
        id: 'msg-3',
        content: 'Увидимся завтра',
        senderId: 'user-1',
        chatId: 'chat-3',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'text',
      },
    },
  ],
  activeChat: null,
  messages: [
    {
      id: 'msg-demo-1',
      content: 'Привет! Как дела?',
      senderId: 'user-2',
      chatId: 'chat-1',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: 'text',
    },
    {
      id: 'msg-demo-2',
      content: 'Всё отлично! Работаю над новым проектом',
      senderId: 'user-1',
      chatId: 'chat-1',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      type: 'text',
    },
    {
      id: 'msg-demo-3',
      content: 'Звучит интересно! Расскажешь больше?',
      senderId: 'user-2',
      chatId: 'chat-1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text',
    },
  ],
  messageDraft: '',

  // Actions
  setColorPalette: (palette) => {
    set({ colorPalette: palette });
    
    // Update CSS class on document
    const root = document.documentElement;
    root.classList.remove('theme-blue', 'theme-orange', 'theme-purple');
    if (palette !== 'blue') {
      root.classList.add(`theme-${palette}`);
    }
  },
  
  setThemeMode: (mode) => {
    set({ themeMode: mode });
    
    // Update CSS class on document
    const root = document.documentElement;
    root.classList.toggle('dark', mode === 'dark');
  },
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  setActiveChat: (chat) => set({ activeChat: chat }),
  
  addMessage: (messageData) => {
    const newMessage: Message = {
      ...messageData,
      id: `msg-${Date.now()}`,
      timestamp: new Date(),
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage],
      // Update chat's last message
      chats: state.chats.map((chat) =>
        chat.id === messageData.chatId
          ? { ...chat, lastMessage: newMessage }
          : chat
      ),
    }));
  },
  
  setMessageDraft: (draft) => set({ messageDraft: draft }),
  
  deleteMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== messageId),
    })),
  
  pinMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, isPinned: !msg.isPinned } : msg
      ),
    })),
  
  updateUnreadCount: (chatId, count) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, unreadCount: count } : chat
      ),
    })),
}));