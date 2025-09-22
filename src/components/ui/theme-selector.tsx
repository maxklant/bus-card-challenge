import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTheme, themes, ThemeName } from '@/contexts/ThemeContext';
import { Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeSelector() {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border-casino-gold/30 hover:bg-casino-green/10"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline">Thema</span>
        <span className="text-lg">{themes[currentTheme].emoji}</span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <Card className="absolute top-full mt-2 right-0 z-50 p-4 bg-card/95 backdrop-blur-sm border-casino-gold/20 shadow-card min-w-64">
            <h3 className="font-semibold text-foreground mb-3 text-center">Kies een thema</h3>
            
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key as ThemeName);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all text-left hover:scale-105",
                    currentTheme === key
                      ? "bg-casino-green/20 border-casino-gold/50 shadow-gold"
                      : "bg-muted/20 border-muted/30 hover:bg-casino-green/10 hover:border-casino-gold/30"
                  )}
                >
                  <div className="text-2xl">{theme.emoji}</div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{theme.name}</div>
                    <div className="flex gap-1 mt-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: `hsl(${theme.primary})` }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: `hsl(${theme.accent})` }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: `hsl(${theme.background})` }}
                      />
                    </div>
                  </div>

                  {currentTheme === key && (
                    <Check className="w-5 h-5 text-casino-gold" />
                  )}
                </button>
              ))}
            </div>

            <div className="text-xs text-muted-foreground text-center mt-3 pt-3 border-t border-muted/20">
              Thema wordt automatisch opgeslagen
            </div>
          </Card>
        </>
      )}
    </div>
  );
}