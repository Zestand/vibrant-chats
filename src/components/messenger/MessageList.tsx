import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMessengerStore } from '@/store/messengerStore';
import { Pin, Trash2, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

export const MessageList = () => {
  const { 
    messages, 
    activeChat, 
    currentUser, 
    deleteMessage, 
    pinMessage 
  } = useMessengerStore();
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const chatMessages = messages.filter(msg => msg.chatId === activeChat?.id);
  
  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [chatMessages.length]);

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chat-bg">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Выберите чат</h3>
          <p className="text-message-time">Выберите чат из списка, чтобы начать общение</p>
        </div>
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isCurrentUser = (senderId: string) => senderId === currentUser?.id;

  return (
    <div className="flex-1 flex flex-col bg-chat-bg">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-sidebar-bg">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={activeChat.avatar} alt={activeChat.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {activeChat.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-foreground">{activeChat.name}</h2>
            <p className="text-sm text-message-time">
              {activeChat.isGroup ? `${activeChat.participants.length} участников` : 'в сети'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <AnimatePresence>
          {chatMessages.map((message, index) => {
            const isOwn = isCurrentUser(message.senderId);
            const showAvatar = !isOwn && (
              index === 0 || 
              chatMessages[index - 1]?.senderId !== message.senderId
            );

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex gap-2 mb-4 group",
                  isOwn ? "justify-start" : "justify-start"
                )}
              >
                {/* Avatar for other users */}
                <div className="w-8 h-8 flex-shrink-0">
                  {showAvatar && !isOwn && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {activeChat.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1 max-w-[70%]">
                  <div
                    className={cn(
                      "relative px-4 py-2 rounded-2xl shadow-sm",
                      isOwn 
                        ? "bg-message-own text-message-own-text" 
                        : "bg-message-other text-message-other-text"
                    )}
                  >
                    {message.isPinned && (
                      <Pin className="absolute -top-2 -right-2 w-4 h-4 text-primary" />
                    )}
                    
                    {message.type === 'text' && (
                      <p className="text-sm leading-5">{message.content}</p>
                    )}
                    
                    {message.type === 'image' && (
                      <div className="space-y-2">
                        <img 
                          src={message.imageUrl} 
                          alt="Изображение" 
                          className="rounded-lg max-w-full h-auto"
                        />
                        {message.content && (
                          <p className="text-sm leading-5">{message.content}</p>
                        )}
                      </div>
                    )}
                    
                    {message.type === 'voice' && (
                      <div className="flex items-center gap-2 min-w-[200px]">
                        <Button variant="ghost" size="sm" className="rounded-full p-2 h-8 w-8">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </Button>
                        <div className="flex-1 h-8 bg-current opacity-20 rounded-full relative">
                          <div className="absolute inset-0 bg-current opacity-40 rounded-full w-1/3"></div>
                        </div>
                        <span className="text-xs opacity-70">
                          {message.duration ? `${message.duration}s` : '0:15'}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                      
                      {/* Message actions */}
                      {currentUser?.role === 'admin' && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => pinMessage(message.id)}
                          >
                            <Pin className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                            onClick={() => deleteMessage(message.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
};