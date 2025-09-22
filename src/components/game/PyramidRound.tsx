import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayingCard } from './PlayingCard';
import { Card as GameCard, Player } from '@/types/game';
import { Trophy, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PyramidRoundProps {
  players: Player[];
  pyramidCards: GameCard[][];
  pyramidRevealed: boolean[][];
  onRevealCard: (row: number, col: number) => void;
  onStartBus: () => void;
}

export function PyramidRound({
  players,
  pyramidCards,
  pyramidRevealed,
  onRevealCard,
  onStartBus
}: PyramidRoundProps) {
  const allRevealed = pyramidRevealed.every(row => row.every(revealed => revealed));
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-felt p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-casino-gold" />
            <h2 className="text-2xl font-bold text-foreground">Piramide Ronde</h2>
          </div>
          <p className="text-muted-foreground">
            Klik op de kaarten om ze om te draaien. Matches leveren punten op!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pyramid */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-card/95 backdrop-blur-sm shadow-card border-casino-gold/20">
              <h3 className="text-lg font-semibold text-center mb-6">De Piramide</h3>
              
              <div className="space-y-4">
                {pyramidCards.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex justify-center gap-2">
                    {row.map((card, colIndex) => (
                      <div key={`${rowIndex}-${colIndex}`} className="relative">
                        <PlayingCard
                          card={pyramidRevealed[rowIndex][colIndex] ? card : undefined}
                          faceDown={!pyramidRevealed[rowIndex][colIndex]}
                          onClick={() => !pyramidRevealed[rowIndex][colIndex] && onRevealCard(rowIndex, colIndex)}
                          animate={pyramidRevealed[rowIndex][colIndex] ? 'flip' : undefined}
                          className={cn(
                            !pyramidRevealed[rowIndex][colIndex] && 'hover:shadow-gold cursor-pointer'
                          )}
                        />
                        {/* Row level indicator */}
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs bg-casino-gold text-primary px-2 py-1 rounded-full font-bold">
                          {rowIndex + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {allRevealed && (
                <div className="text-center mt-8">
                  <Button 
                    onClick={onStartBus}
                    className="bg-gradient-gold text-primary font-semibold hover:shadow-gold animate-glow"
                  >
                    Naar de Bus <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Players and Scores */}
          <div className="space-y-4">
            <Card className="p-4 bg-card/95 backdrop-blur-sm shadow-card border-casino-gold/20">
              <h3 className="text-lg font-semibold mb-4 text-center">Scorebord</h3>
              
              <div className="space-y-3">
                {sortedPlayers.map((player, index) => (
                  <div 
                    key={player.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all",
                      index === 0 
                        ? "bg-destructive/20 border-destructive/50 animate-glow" 
                        : "bg-muted/20 border-muted/30"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">{player.name}</span>
                      <span className={cn(
                        "text-lg font-bold",
                        index === 0 ? "text-destructive" : "text-casino-gold"
                      )}>
                        {player.score}
                      </span>
                    </div>
                    {index === 0 && (
                      <div className="text-xs text-destructive mt-1">
                        Moet de bus in! 🚌
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Player hands */}
            <Card className="p-4 bg-card/80 backdrop-blur-sm border-casino-gold/10">
              <h4 className="font-medium mb-3 text-center">Handkaarten</h4>
              
              <div className="space-y-4">
                {players.map((player) => (
                  <div key={player.id}>
                    <div className="text-sm font-medium mb-2 text-foreground">
                      {player.name}
                    </div>
                    <div className="flex gap-1 justify-center">
                      {player.handCards.map((card) => (
                        <div key={card.id} className="scale-75">
                          <PlayingCard card={card} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Instructions */}
            <Card className="p-4 bg-card/80 backdrop-blur-sm border-casino-gold/10">
              <h4 className="font-medium mb-2 text-center">Hoe werkt het?</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Klik kaarten om ze om te draaien</div>
                <div>• Match met handkaart = punten</div>
                <div>• Hoger niveau = meer punten</div>
                <div>• Meeste punten gaat de bus in</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}