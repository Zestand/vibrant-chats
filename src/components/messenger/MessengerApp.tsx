import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChatList } from './ChatList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ThemeSettings } from './ThemeSettings';
import { useMessengerStore } from '@/store/messengerStore';
import { Settings, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MessengerApp = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { activeChat, colorPalette, themeMode } = useMessengerStore();

  // Initialize theme on mount
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', themeMode === 'dark');
    
    root.classList.remove('theme-blue', 'theme-orange', 'theme-purple');
    if (colorPalette !== 'blue') {
      root.classList.add(`theme-${colorPalette}`);
    }
  }, [colorPalette, themeMode]);

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar - Chat List */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={cn(
          "w-80 flex-shrink-0 border-r border-border relative z-50",
          "lg:relative lg:translate-x-0",
          isMobileMenuOpen 
            ? "fixed inset-y-0 left-0 translate-x-0" 
            : "hidden lg:block"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border bg-sidebar-bg flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">VibrantChats</h1>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
              className="h-8 w-8 p-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
              className="h-8 w-8 p-0 lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ChatList />
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-border bg-sidebar-bg flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Menu className="w-4 h-4" />
          </Button>
          
          {activeChat && (
            <>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">
                  {activeChat.name[0]}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-foreground text-sm">{activeChat.name}</h2>
                <p className="text-xs text-message-time">
                  {activeChat.isGroup ? `${activeChat.participants.length} участников` : 'в сети'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Messages Area */}
        <MessageList />

        {/* Message Input */}
        {activeChat && <MessageInput />}
      </div>

      {/* Theme Settings Modal */}
      <ThemeSettings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};