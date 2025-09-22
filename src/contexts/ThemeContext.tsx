import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeName = 
  | 'casino-green' 
  | 'ocean-blue' 
  | 'pink-purple' 
  | 'orange-red' 
  | 'dark-blue' 
  | 'forest-gold' 
  | 'purple-gold'
  | 'sunset-orange'
  | 'midnight-silver';

export const themes = {
  'casino-green': {
    name: 'Casino Green',
    emoji: '🎰',
    primary: '140 60% 25%',
    accent: '45 95% 55%',
    background: '140 40% 8%',
    gradient: 'linear-gradient(135deg, hsl(140 60% 25%), hsl(140 50% 30%))'
  },
  'ocean-blue': {
    name: 'Ocean Blue',
    emoji: '🌊',
    primary: '200 70% 35%',
    accent: '180 85% 55%',
    background: '210 45% 8%',
    gradient: 'linear-gradient(135deg, hsl(200 70% 35%), hsl(180 60% 40%))'
  },
  'pink-purple': {
    name: 'Pink Purple',
    emoji: '🌸',
    primary: '320 60% 45%',
    accent: '290 85% 65%',
    background: '330 40% 10%',
    gradient: 'linear-gradient(135deg, hsl(320 60% 45%), hsl(290 70% 50%))'
  },
  'orange-red': {
    name: 'Fire Orange',
    emoji: '🔥',
    primary: '15 80% 45%',
    accent: '35 90% 60%',
    background: '20 40% 8%',
    gradient: 'linear-gradient(135deg, hsl(15 80% 45%), hsl(35 70% 50%))'
  },
  'dark-blue': {
    name: 'Midnight Blue',
    emoji: '🌙',
    primary: '220 60% 25%',
    accent: '0 0% 75%',
    background: '225 45% 6%',
    gradient: 'linear-gradient(135deg, hsl(220 60% 25%), hsl(220 50% 30%))'
  },
  'forest-gold': {
    name: 'Forest Green',
    emoji: '🌿',
    primary: '120 50% 30%',
    accent: '50 90% 55%',
    background: '125 40% 8%',
    gradient: 'linear-gradient(135deg, hsl(120 50% 30%), hsl(120 40% 35%))'
  },
  'purple-gold': {
    name: 'Royal Purple',
    emoji: '👑',
    primary: '270 60% 35%',
    accent: '45 95% 55%',
    background: '275 45% 8%',
    gradient: 'linear-gradient(135deg, hsl(270 60% 35%), hsl(270 50% 40%))'
  },
  'sunset-orange': {
    name: 'Sunset',
    emoji: '🌅',
    primary: '25 80% 50%',
    accent: '340 90% 65%',
    background: '30 40% 8%',
    gradient: 'linear-gradient(135deg, hsl(25 80% 50%), hsl(340 70% 55%))'
  },
  'midnight-silver': {
    name: 'Midnight Silver',
    emoji: '✨',
    primary: '240 20% 20%',
    accent: '0 0% 80%',
    background: '240 30% 5%',
    gradient: 'linear-gradient(135deg, hsl(240 20% 20%), hsl(240 15% 25%))'
  }
};

interface ThemeContextType {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themeConfig: typeof themes[ThemeName];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('casino-green');
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  useEffect(() => {
    // Load saved theme and dark mode from localStorage
    const savedTheme = localStorage.getItem('bussen-theme') as ThemeName;
    const savedDarkMode = localStorage.getItem('bussen-dark-mode') === 'true';
    
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
    setIsDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    // Apply theme to CSS custom properties and dark mode
    const theme = themes[currentTheme];
    const root = document.documentElement;
    
    // Apply theme colors
    root.style.setProperty('--casino-green', theme.primary);
    root.style.setProperty('--casino-gold', theme.accent);
    root.style.setProperty('--casino-felt', theme.background);
    root.style.setProperty('--gradient-casino', theme.gradient);
    root.style.setProperty('--gradient-gold', `linear-gradient(135deg, hsl(${theme.accent}), hsl(${theme.accent.split(' ')[0]} ${parseInt(theme.accent.split(' ')[1]) - 10}% ${parseInt(theme.accent.split(' ')[2]) - 5}%))`);
    
    // Apply dark mode class
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('bussen-theme', currentTheme);
    localStorage.setItem('bussen-dark-mode', isDarkMode.toString());
  }, [currentTheme, isDarkMode]);

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const value = {
    currentTheme,
    setTheme,
    themeConfig: themes[currentTheme],
    isDarkMode,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}