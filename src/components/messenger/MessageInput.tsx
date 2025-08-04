import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMessengerStore } from '@/store/messengerStore';
import { Send, Image, Mic, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MessageInput = () => {
  const { 
    activeChat, 
    currentUser, 
    messageDraft, 
    setMessageDraft, 
    addMessage 
  } = useMessengerStore();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout>();

  // Auto-save draft
  useEffect(() => {
    // Save draft to localStorage
    if (activeChat) {
      localStorage.setItem(`draft-${activeChat.id}`, messageDraft);
    }
  }, [messageDraft, activeChat]);

  // Load draft when chat changes
  useEffect(() => {
    if (activeChat) {
      const savedDraft = localStorage.getItem(`draft-${activeChat.id}`) || '';
      setMessageDraft(savedDraft);
    }
  }, [activeChat, setMessageDraft]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [messageDraft]);

  const handleSendMessage = () => {
    if (!messageDraft.trim() || !activeChat || !currentUser) return;

    addMessage({
      content: messageDraft.trim(),
      senderId: currentUser.id,
      chatId: activeChat.id,
      type: 'text',
    });

    setMessageDraft('');
    localStorage.removeItem(`draft-${activeChat.id}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }

    // Simulate voice message
    if (activeChat && currentUser) {
      addMessage({
        content: 'Голосовое сообщение',
        senderId: currentUser.id,
        chatId: activeChat.id,
        type: 'voice',
        duration: recordingTime,
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeChat && currentUser) {
      // Simulate image upload
      const imageUrl = URL.createObjectURL(file);
      
      addMessage({
        content: 'Изображение',
        senderId: currentUser.id,
        chatId: activeChat.id,
        type: 'image',
        imageUrl,
      });
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!activeChat) {
    return null;
  }

  return (
    <div className="p-4 border-t border-border bg-message-input">
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
        >
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse-gentle"></div>
          <span className="text-sm font-medium text-red-600 dark:text-red-400">
            Запись голосового сообщения: {formatRecordingTime(recordingTime)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={stopRecording}
            className="ml-auto text-red-600 hover:text-red-700"
          >
            Остановить
          </Button>
        </motion.div>
      )}

      <div className="flex items-end gap-2">
        {/* Attachment Button */}
        <div className="flex gap-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 text-message-time hover:text-primary"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <Image className="w-5 h-5" />
          </Button>
        </div>

        {/* Message Input */}
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={messageDraft}
            onChange={(e) => setMessageDraft(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Напишите сообщение..."
            className="min-h-[40px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            rows={1}
          />
        </div>

        {/* Send/Voice Button */}
        <div className="flex gap-1">
          {messageDraft.trim() ? (
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="h-10 w-10 p-0 rounded-full bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-10 w-10 p-0 rounded-full transition-colors",
                isRecording 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "text-message-time hover:text-primary"
              )}
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
            >
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};