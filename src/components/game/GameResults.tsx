import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeSelector } from '@/components/ui/theme-selector';
import { Player } from '@/types/game';
import { Trophy, Medal, RotateCcw, Crown, Bus, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameResultsProps {
  players: Player[];
  busPlayer: Player | null;
  onPlayAgain: () => void;
}

export function GameResults({ players, busPlayer, onPlayAgain }: GameResultsProps) {
  const sortedPlayers = [...players].sort((a, b) => a.score - b.score); // Lower score is better
  const winner = sortedPlayers[0];
  const loser = sortedPlayers[sortedPlayers.length - 1];

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="w-8 h-8 text-casino-gold golden-glow" />;
      case 1: return <Medal className="w-6 h-6 text-casino-silver" />;
      case 2: return <Medal className="w-6 h-6 text-casino-copper" />;
      default: return <Star className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-gradient-to-r from-casino-gold/30 to-casino-copper/20 border-casino-gold shadow-2xl golden-glow';
      case 1: return 'bg-gradient-to-r from-casino-silver/30 to-casino-felt/20 border-casino-silver/70';
      case 2: return 'bg-gradient-to-r from-casino-copper/30 to-casino-felt/20 border-casino-copper/70';
      default: return 'bg-muted/20 border-muted/30';
    }
  };

  const getRankText = (index: number) => {
    switch (index) {
      case 0: return 'text-casino-gold';
      case 1: return 'text-casino-silver';
      case 2: return 'text-casino-copper';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-casino relative overflow-hidden">
      {/* Artistic celebration background */}
      <div className="absolute inset-0 bg-gradient-felt opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Floating sparkles */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-casino-gold rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-5xl space-y-8">
          {/* Theme selector */}
          <div className="fixed top-6 right-6 z-30">
            <ThemeSelector />
          </div>

          {/* Celebration Header */}
          <div className="text-center space-y-6">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-gold rounded-full flex items-center justify-center mb-6 mx-auto golden-glow animate-bounce">
                <Trophy className="w-12 h-12 text-casino-felt" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-8 h-8 text-casino-gold animate-spin" />
              </div>
              <div className="absolute -bottom-2 -left-2">
                <Sparkles className="w-6 h-6 text-casino-gold animate-ping" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-casino-gold bg-gradient-gold bg-clip-text text-transparent mb-4">
              Spel Afgelopen!
            </h1>
            
            <div className="space-y-2">
              <p className="text-xl text-casino-silver">
                Gefeliciteerd {winner.name}! 🎉
              </p>
              <p className="text-casino-silver/80">
                De laagste score wint in dit spel!
              </p>
            </div>
          </div>

          {/* Results Cards */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Final Rankings */}
            <Card className="p-8 bg-gradient-to-br from-casino-felt/50 to-background/80 backdrop-blur-lg border-casino-gold/30 hover-glow">
              <h2 className="text-2xl font-bold text-casino-gold text-center mb-8 flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6" />
                Eindstand
              </h2>
              
              <div className="space-y-4">
                {sortedPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className={cn(
                      "p-6 rounded-lg border transition-all duration-300 hover-lift",
                      getRankColor(index)
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(index)}
                          <span className="text-2xl font-bold text-casino-felt bg-casino-gold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                            {index + 1}
                          </span>
                        </div>
                        
                        <div>
                          <div className={cn("text-xl font-bold", getRankText(index))}>
                            {player.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {player.handCards.length} kaarten • {index === 0 ? 'Winnaar!' : `${index + 1}e plaats`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={cn("text-3xl font-bold", getRankText(index))}>
                          {player.score}
                        </div>
                        <div className="text-sm text-muted-foreground">punten</div>
                      </div>
                    </div>
                    
                    {index === 0 && (
                      <div className="mt-4 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-casino-gold/20 rounded-full">
                          <Crown className="w-4 h-4 text-casino-gold" />
                          <span className="text-casino-gold font-semibold">Kampioen!</span>
                          <Crown className="w-4 h-4 text-casino-gold" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Game Summary */}
            <div className="space-y-6">
              {/* Bus Player Highlight */}
              {busPlayer && (
                <Card className="p-6 bg-gradient-to-br from-red-500/20 to-casino-felt/30 backdrop-blur-lg border-red-500/30">
                  <h3 className="text-xl font-bold text-red-400 text-center mb-4 flex items-center justify-center gap-2">
                    <Bus className="w-6 h-6" />
                    Bus Rijder
                  </h3>
                  
                  <div className="text-center space-y-3">
                    <div className="text-2xl font-bold text-red-300">
                      {busPlayer.name}
                    </div>
                    <div className="text-red-400/80">
                      Heeft de bus gereden en extra uitdagingen overwonnen!
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full">
                      <Bus className="w-4 h-4" />
                      <span className="font-semibold">Dapper!</span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Game Statistics */}
              <Card className="p-6 bg-card/90 backdrop-blur-lg border-casino-gold/20">
                <h3 className="text-xl font-bold text-casino-gold text-center mb-6">
                  Spel Statistieken
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                    <span className="text-muted-foreground">Aantal spelers:</span>
                    <span className="font-semibold text-casino-silver">{players.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                    <span className="text-muted-foreground">Winnende score:</span>
                    <span className="font-semibold text-casino-gold">{winner.score} punten</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                    <span className="text-muted-foreground">Hoogste score:</span>
                    <span className="font-semibold text-casino-copper">{loser.score} punten</span>
                  </div>
                  
                  {busPlayer && (
                    <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <span className="text-red-400">Bus gereden door:</span>
                      <span className="font-semibold text-red-300">{busPlayer.name}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Play Again Button */}
              <Button
                onClick={onPlayAgain}
                className="w-full bg-gradient-to-r from-casino-gold to-casino-copper hover:from-casino-copper hover:to-casino-gold text-background font-bold py-6 text-xl hover-lift golden-glow"
              >
                <RotateCcw className="w-6 h-6 mr-3" />
                Speel Opnieuw
                <Sparkles className="w-6 h-6 ml-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}