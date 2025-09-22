import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTheme, themes, ThemeName } from '@/contexts/ThemeContext';
import { Palette, Check, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeSelector() {
  const { currentTheme, setTheme, isDarkMode, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-2">
      {/* Dark Mode Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleDarkMode}
        className="flex items-center gap-2 border-amber-400/30 hover:bg-amber-400/10 bg-slate-800/50 backdrop-blur-sm"
      >
        {isDarkMode ? (
          <Moon className="w-4 h-4 text-amber-400" />
        ) : (
          <Sun className="w-4 h-4 text-amber-400" />
        )}
        <span className="hidden sm:inline text-amber-300">
          {isDarkMode ? 'Dark' : 'Light'}
        </span>
      </Button>

      {/* Theme Selector */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border-amber-400/30 hover:bg-amber-400/10 bg-slate-800/50 backdrop-blur-sm"
      >
        <Palette className="w-4 h-4 text-amber-400" />
        <span className="hidden sm:inline text-amber-300">Thema</span>
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
          <Card className="absolute top-full mt-2 right-0 z-50 p-6 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border-amber-400/30 shadow-2xl min-w-72 rounded-xl">
            <h3 className="font-bold text-amber-300 mb-4 text-center text-lg">🎨 Kies een thema</h3>
            
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key as ThemeName);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left hover:scale-105 relative overflow-hidden group",
                    currentTheme === key
                      ? "bg-gradient-to-r from-amber-500/20 to-amber-600/20 border-amber-400/70 shadow-lg shadow-amber-400/20"
                      : "bg-slate-800/30 border-slate-600/50 hover:bg-slate-700/40 hover:border-amber-400/50"
                  )}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div 
                      className="w-full h-full" 
                      style={{ 
                        background: theme.gradient,
                        transform: currentTheme === key ? 'scale(1)' : 'scale(0.8)',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </div>
                  
                  <div className="text-3xl relative z-10">{theme.emoji}</div>
                  
                  <div className="flex-1 relative z-10">
                    <div className={cn(
                      "font-semibold",
                      currentTheme === key ? "text-amber-200" : "text-slate-300"
                    )}>
                      {theme.name}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white/30 shadow-sm"
                        style={{ backgroundColor: `hsl(${theme.primary})` }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white/30 shadow-sm"
                        style={{ backgroundColor: `hsl(${theme.accent})` }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white/30 shadow-sm"
                        style={{ backgroundColor: `hsl(${theme.background})` }}
                      />
                    </div>
                  </div>

                  {currentTheme === key && (
                    <div className="relative z-10">
                      <Check className="w-6 h-6 text-amber-400 animate-pulse" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="text-xs text-amber-400/70 text-center mt-4 pt-4 border-t border-amber-400/20">
              ✨ Thema wordt automatisch opgeslagen
            </div>
          </Card>
        </>
      )}
    </div>
  );
}