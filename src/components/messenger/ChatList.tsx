import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMessengerStore } from '@/store/messengerStore';
import { cn } from '@/lib/utils';

export const ChatList = () => {
  const { chats, activeChat, setActiveChat } = useMessengerStore();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes < 1 ? 'Только что' : `${minutes} мин`;
    }
    
    if (hours < 24) {
      return `${hours} ч`;
    }
    
    return date.toLocaleDateString('ru', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-sidebar-bg border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">Чаты</h1>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {chats.map((chat, index) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-chat-hover",
                activeChat?.id === chat.id && "bg-primary/10 border border-primary/20"
              )}
              onClick={() => setActiveChat(chat)}
            >
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {chat.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {chat.isGroup && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-1c0-1.38.56-2.63 1.46-3.54.9-.9 2.16-1.46 3.54-1.46h6c.53 0 1.04.11 1.5.3L12 16.8l-7 1.2zM12.5 11h-1c-1.38 0-2.63-.56-3.54-1.46S6.5 7.38 6.5 6c0-1.11.89-2 2-2h3c1.11 0 2 .89 2 2 0 1.38-.56 2.63-1.46 3.54S13.88 11 12.5 11z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-foreground truncate">{chat.name}</h3>
                  {chat.lastMessage && (
                    <span className="text-xs text-message-time">
                      {formatTime(chat.lastMessage.timestamp)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-message-time truncate">
                    {chat.lastMessage?.content || 'Нет сообщений'}
                  </p>
                  
                  {chat.unreadCount > 0 && (
                    <Badge 
                      variant="default" 
                      className="bg-primary text-primary-foreground text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center"
                    >
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};