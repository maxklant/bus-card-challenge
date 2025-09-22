import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayingCard } from './PlayingCard';
import { ThemeSelector } from '@/components/ui/theme-selector';
import { Card as GameCard, Player } from '@/types/game';
import { Trophy, ArrowRight, Sparkles, Crown } from 'lucide-react';
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
  const totalCards = pyramidCards.flat().length;
  const revealedCards = pyramidRevealed.flat().filter(revealed => revealed).length;
  const progress = (revealedCards / totalCards) * 100;

  return (
    <div className="min-h-screen bg-gradient-casino relative overflow-hidden">
      {/* Artistic background elements */}
      <div className="absolute inset-0 bg-gradient-felt opacity-30"></div>
      <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-casino-gold/5 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-casino-green/5 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with enhanced styling */}
        <div className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <Trophy className="w-8 h-8 text-casino-gold golden-glow" />
              <Sparkles className="w-4 h-4 text-casino-gold absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h2 className="text-4xl font-bold text-casino-gold bg-gradient-gold bg-clip-text text-transparent">
              Piramide Ronde
            </h2>
          </div>
          
          <p className="text-casino-silver text-lg max-w-2xl mx-auto">
            Ontdek de geheimen van de piramide! Klik op de kaarten om ze om te draaien. 
            Matches leveren kostbare punten op!
          </p>

          {/* Progress indicator */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-sm text-casino-silver">
              <span>Voortgang</span>
              <span>{revealedCards}/{totalCards} kaarten</span>
            </div>
            <div className="w-full bg-casino-felt/50 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-gold transition-all duration-500 shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Theme selector positioned artistically */}
        <div className="fixed top-6 right-6 z-30">
          <ThemeSelector />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Pyramid */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-gradient-to-br from-casino-felt/50 to-background/80 backdrop-blur-lg border-casino-gold/30 hover-glow shadow-2xl">
              <h3 className="text-2xl font-bold text-casino-gold text-center mb-8 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6" />
                De Mystieke Piramide
                <Sparkles className="w-6 h-6" />
              </h3>
              
              <div className="space-y-4 max-w-2xl mx-auto perspective">
                {pyramidCards.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex justify-center gap-3 preserve-3d"
                    style={{
                      marginLeft: `${(pyramidCards.length - row.length) * 1.5}rem`
                    }}
                  >
                    {row.map((card, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={cn(
                          "transition-all duration-300 hover-lift cursor-pointer",
                          pyramidRevealed[rowIndex][colIndex] 
                            ? "card-flip hover-glow" 
                            : "hover:scale-110"
                        )}
                        style={{ 
                          animationDelay: `${(rowIndex * row.length + colIndex) * 0.1}s`,
                          transform: `translateZ(${(pyramidCards.length - rowIndex) * 10}px)`
                        }}
                        onClick={() => !pyramidRevealed[rowIndex][colIndex] && onRevealCard(rowIndex, colIndex)}
                      >
                        {pyramidRevealed[rowIndex][colIndex] ? (
                          <PlayingCard 
                            card={card} 
                            className="golden-glow shadow-lg" 
                          />
                        ) : (
                          <div className="w-16 h-24 bg-gradient-to-br from-casino-copper/80 to-casino-gold/60 rounded-lg border-2 border-casino-gold/50 flex items-center justify-center cursor-pointer hover:from-casino-gold/80 hover:to-casino-copper/60 transition-all duration-300 card-stack">
                            <div className="text-casino-felt font-bold text-xs">?</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Pyramid completion celebration */}
              {allRevealed && (
                <div className="mt-8 text-center space-y-4">
                  <div className="text-2xl font-bold text-casino-gold golden-glow">
                    🎉 Piramide Voltooid! 🎉
                  </div>
                  <div className="text-casino-silver">
                    Alle geheimen zijn onthuld!
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Enhanced Scoreboard */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-casino-green/20 to-casino-felt/30 backdrop-blur-lg border-casino-gold/30 hover-glow">
              <h3 className="text-xl font-bold text-casino-gold text-center mb-6 flex items-center justify-center gap-2">
                <Crown className="w-6 h-6" />
                Scorebord
              </h3>
              
              <div className="space-y-4">
                {sortedPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className={cn(
                      "p-4 rounded-lg border transition-all duration-300 hover-lift",
                      index === 0 
                        ? "bg-gradient-to-r from-casino-gold/30 to-casino-copper/20 border-casino-gold shadow-lg golden-glow" 
                        : "bg-muted/20 border-muted/30 hover:border-casino-gold/50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                          index === 0 
                            ? "bg-casino-gold text-casino-felt" 
                            : "bg-casino-silver text-casino-felt"
                        )}>
                          {index + 1}
                        </div>
                        <div>
                          <div className={cn(
                            "font-semibold",
                            index === 0 ? "text-casino-gold" : "text-foreground"
                          )}>
                            {player.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {player.handCards.length} kaarten
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={cn(
                          "text-2xl font-bold",
                          index === 0 ? "text-casino-gold" : "text-casino-silver"
                        )}>
                          {player.score}
                        </div>
                        <div className="text-xs text-muted-foreground">punten</div>
                      </div>
                    </div>
                    
                    {index === 0 && (
                      <div className="mt-2 text-center">
                        <Crown className="w-4 h-4 text-casino-gold mx-auto animate-pulse" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Game status and controls */}
            <Card className="p-6 bg-card/90 backdrop-blur-lg border-casino-gold/20">
              <div className="text-center space-y-4">
                <h4 className="font-semibold text-casino-gold text-lg">Game Status</h4>
                
                <div className="space-y-3">
                  <div className="text-sm text-casino-silver">
                    Piramide voortgang: {Math.round(progress)}%
                  </div>
                  
                  <div className="space-y-2">
                    {pyramidCards.map((row, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-12">
                          Rij {index + 1}:
                        </span>
                        <div className="flex gap-1 flex-1">
                          {row.map((_, cardIndex) => (
                            <div
                              key={cardIndex}
                              className={cn(
                                "h-2 flex-1 rounded-full transition-all duration-300",
                                pyramidRevealed[index][cardIndex]
                                  ? "bg-gradient-gold shadow-sm"
                                  : "bg-muted/30"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {allRevealed && (
                  <Button
                    onClick={onStartBus}
                    className="w-full bg-gradient-to-r from-casino-gold to-casino-copper hover:from-casino-copper hover:to-casino-gold text-background font-bold py-3 text-lg hover-lift golden-glow"
                  >
                    Start Bus Ronde
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}