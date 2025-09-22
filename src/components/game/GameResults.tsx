import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Player } from '@/types/game';
import { Trophy, Medal, RotateCcw, Crown, Bus } from 'lucide-react';
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
      case 0: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 1: return <Medal className="w-6 h-6 text-gray-400" />;
      case 2: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return null;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 1: return 'bg-gray-500/20 border-gray-500/50 text-gray-300';
      case 2: return 'bg-amber-600/20 border-amber-600/50 text-amber-400';
      default: return 'bg-muted/20 border-muted/30 text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-felt flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-gold rounded-full mb-4 animate-glow">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Spel Afgelopen!</h1>
          <p className="text-muted-foreground">Hier zijn de eindresultaten</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Winner announcement */}
          <Card className="p-6 bg-gradient-gold/10 backdrop-blur-sm shadow-card border-casino-gold/50">
            <div className="text-center">
              <Crown className="w-12 h-12 text-casino-gold mx-auto mb-4 animate-float" />
              <h2 className="text-xl font-bold text-foreground mb-2">Winnaar!</h2>
              <div className="text-2xl font-bold text-casino-gold mb-1">{winner.name}</div>
              <div className="text-sm text-muted-foreground">
                Minste punten: {winner.score}
              </div>
              <div className="mt-4 text-sm text-center text-muted-foreground">
                🎉 Gefeliciteerd! Je hoefde het minst te drinken!
              </div>
            </div>
          </Card>

          {/* Bus player */}
          {busPlayer && (
            <Card className="p-6 bg-destructive/10 backdrop-blur-sm shadow-card border-destructive/30">
              <div className="text-center">
                <Bus className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-bold text-foreground mb-2">Bus Passagier</h2>
                <div className="text-2xl font-bold text-destructive mb-1">{busPlayer.name}</div>
                <div className="text-sm text-muted-foreground">
                  Eindscore: {busPlayer.score}
                </div>
                <div className="mt-4 text-sm text-center text-muted-foreground">
                  🚌 Moest de bus door - maar heeft het gehaald!
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Full rankings */}
        <Card className="p-6 bg-card/95 backdrop-blur-sm shadow-card border-casino-gold/20 mb-8">
          <h3 className="text-xl font-bold text-center mb-6 text-foreground">Eindklassement</h3>
          
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div 
                key={player.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-all",
                  getRankColor(index)
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(index) || (
                      <span className="font-bold text-lg">{index + 1}</span>
                    )}
                  </div>
                  
                  <div>
                    <div className="font-semibold text-lg">{player.name}</div>
                    {player.id === busPlayer?.id && (
                      <div className="text-xs opacity-75">Bus passagier</div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold">{player.score}</div>
                  <div className="text-xs opacity-75">punten</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Play again */}
        <div className="text-center">
          <Button 
            onClick={onPlayAgain}
            className="bg-gradient-casino text-primary-foreground font-semibold hover:shadow-gold animate-glow px-8 py-3 text-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Opnieuw Spelen
          </Button>
          
          <div className="mt-4 text-sm text-muted-foreground max-w-md mx-auto">
            Bedankt voor het spelen van Bussen! 
            {winner.score === 0 && " Perfecte score - geen punten!"}
          </div>
        </div>
      </div>
    </div>
  );
}