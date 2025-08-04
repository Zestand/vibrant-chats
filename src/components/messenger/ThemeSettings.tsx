import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMessengerStore } from '@/store/messengerStore';
import { Sun, Moon, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSettings = ({ isOpen, onClose }: ThemeSettingsProps) => {
  const { 
    colorPalette, 
    themeMode, 
    setColorPalette, 
    setThemeMode 
  } = useMessengerStore();

  const colorPalettes = [
    { 
      id: 'blue' as const, 
      name: 'Синяя', 
      primary: '#1D4ED8',
      preview: 'bg-blue-500'
    },
    { 
      id: 'orange' as const, 
      name: 'Оранжевая', 
      primary: '#F97316',
      preview: 'bg-orange-500'
    },
    { 
      id: 'purple' as const, 
      name: 'Фиолетовая', 
      primary: '#8B5CF6',
      preview: 'bg-purple-500'
    },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        <Card className="bg-card border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Настройки темы
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Theme Mode */}
            <div>
              <h3 className="text-sm font-medium mb-3 text-foreground">Тема</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={themeMode === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setThemeMode('light')}
                  className="justify-start gap-2 h-12"
                >
                  <Sun className="w-4 h-4" />
                  Светлая
                </Button>
                <Button
                  variant={themeMode === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setThemeMode('dark')}
                  className="justify-start gap-2 h-12"
                >
                  <Moon className="w-4 h-4" />
                  Тёмная
                </Button>
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <h3 className="text-sm font-medium mb-3 text-foreground">Цветовая палитра</h3>
              <div className="space-y-2">
                {colorPalettes.map((palette) => (
                  <Button
                    key={palette.id}
                    variant="ghost"
                    onClick={() => setColorPalette(palette.id)}
                    className={cn(
                      "w-full justify-between h-12 px-3",
                      colorPalette === palette.id && "bg-primary/10 border border-primary/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-6 h-6 rounded-full", palette.preview)} />
                      <span className="font-medium">{palette.name}</span>
                    </div>
                    
                    {colorPalette === palette.id && (
                      <Badge variant="secondary" className="bg-primary/20 text-primary">
                        Активна
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3 text-foreground">Превью сообщений</h4>
              <div className="space-y-2">
                <div className="flex justify-start">
                  <div className="bg-message-other text-message-other-text px-3 py-2 rounded-2xl text-sm max-w-[80%]">
                    Привет! Как дела?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-message-own text-message-own-text px-3 py-2 rounded-2xl text-sm max-w-[80%]">
                    Отлично! Нравится новая тема?
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <Button onClick={onClose} className="w-full">
              Применить
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};