import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayingCard } from './PlayingCard';
import { ThemeSelector } from '@/components/ui/theme-selector';
import { Card as GameCard, Player } from '@/types/game';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown, Bus, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BusRoundProps {
  busPlayer: Player;
  busCards: GameCard[];
  currentBusIndex: number;
  busLength?: number;
  busOpenCards?: number;
  onMakeGuess: (guess: 'higher' | 'lower') => void;
  onFinishGame: () => void;
}

export function BusRound({
  busPlayer,
  busCards,
  currentBusIndex,
  busLength = 8,
  busOpenCards = 2,
  onMakeGuess,
  onFinishGame
}: BusRoundProps) {
  const progress = (currentBusIndex / (busLength - 1)) * 100;
  const currentCard = busCards[currentBusIndex];
  const isCompleted = currentBusIndex >= busLength - 1;

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-casino relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-felt opacity-30"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-6">
            <div className="fixed top-6 right-6 z-30">
              <ThemeSelector />
            </div>
            <Card className="p-8 bg-gradient-to-br from-casino-green/30 to-casino-felt/30 backdrop-blur-lg border-casino-gold/30 golden-glow">
              <div className="text-center space-y-6">
                <div className="text-6xl">🎉</div>
                <h2 className="text-3xl font-bold text-casino-gold">Bus Voltooid!</h2>
                <p className="text-xl text-casino-silver">
                  <strong className="text-casino-gold">{busPlayer.name}</strong> heeft de bus succesvol voltooid!
                </p>
                <Button
                  onClick={onFinishGame}
                  className="bg-gradient-gold hover:bg-gradient-casino text-background font-bold px-8 py-4 text-lg hover-lift golden-glow"
                >
                  Spel Afronden
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-casino relative overflow-hidden">
      {/* Artistic background elements */}
      <div className="absolute inset-0 bg-gradient-felt opacity-20"></div>
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-casino-gold/10 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-casino-green/10 blur-xl"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* Header met bus info */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Bus className="w-8 h-8 text-casino-gold golden-glow" />
              <h1 className="text-4xl font-bold text-casino-gold bg-gradient-gold bg-clip-text text-transparent">
                De Bus
              </h1>
            </div>
            <p className="text-casino-silver text-lg">
              <strong className="text-casino-gold">{busPlayer.name}</strong> moet door de bus!
            </p>
            <div className="flex items-center gap-4 text-casino-silver">
              <span>Bus lengte: {busLength} kaarten</span>
              <span>Open kaarten: {busOpenCards}</span>
              <span>Positie: {currentBusIndex + 1}/{busLength}</span>
            </div>
          </div>
          <ThemeSelector />
        </div>

        {/* Progress indicator */}
        <Card className="p-4 bg-card/80 backdrop-blur-lg border-casino-gold/20">
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-casino-silver">
              <span>Voortgang</span>
              <span>{currentBusIndex + 1} van {busLength}</span>
            </div>
            <Progress 
              value={progress} 
              className="w-full h-3 bg-casino-felt/50" 
            />
          </div>
        </Card>

        {/* Main bus layout */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Bus kaarten - volledige breedte */}
          <div className="lg:col-span-3">
            <Card className="p-6 bg-gradient-to-br from-casino-felt/50 to-background/80 backdrop-blur-lg border-casino-gold/30 hover-glow">
              <h3 className="text-2xl font-bold text-casino-gold text-center mb-6 flex items-center justify-center gap-2">
                🚌 De Bus Kaarten
              </h3>
              
              {/* Bus kaarten grid - responsive */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-items-center">
                {busCards.map((card, index) => {
                  const isCurrentCard = index === currentBusIndex;
                  const isRevealed = index < busOpenCards;
                  const isPassed = index < currentBusIndex;
                  
                  return (
                    <div
                      key={`${card.id}-${index}`}
                      className={cn(
                        "relative transition-all duration-300",
                        isCurrentCard && "transform scale-110 z-20",
                        isPassed && "opacity-60"
                      )}
                    >
                      {/* Kaart positie indicator */}
                      <div className={cn(
                        "absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold px-2 py-1 rounded-full",
                        isCurrentCard 
                          ? "bg-casino-gold text-casino-felt animate-pulse" 
                          : isPassed
                          ? "bg-casino-green text-white"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                      
                      {/* De kaart zelf */}
                      <div className={cn(
                        "relative",
                        isCurrentCard && "ring-4 ring-casino-gold/50 rounded-lg golden-glow"
                      )}>
                        <PlayingCard
                          card={card}
                          faceDown={!isRevealed && !isPassed}
                          className={cn(
                            "border-2 transition-all duration-300",
                            isCurrentCard 
                              ? "border-casino-gold shadow-lg shadow-casino-gold/30" 
                              : isPassed
                              ? "border-casino-green/50"
                              : "border-casino-silver/30",
                            !isRevealed && !isPassed && "hover:border-casino-gold/50"
                          )}
                          animate={isCurrentCard ? 'glow' : undefined}
                        />
                      </div>
                      
                      {/* Status indicators */}
                      {isCurrentCard && (
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                          <div className="bg-casino-gold text-casino-felt px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                            Actief
                          </div>
                        </div>
                      )}
                      
                      {isPassed && (
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                          <div className="bg-casino-green text-white px-3 py-1 rounded-full text-xs font-bold">
                            ✓
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legenda */}
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-casino-gold" />
                  <span className="text-casino-silver">Open kaarten: {busOpenCards}</span>
                </div>
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-casino-silver" />
                  <span className="text-casino-silver">Dichte kaarten: {busLength - busOpenCards}</span>
                </div>
              </div>
            </Card>

            {/* Game controls */}
            {currentCard && (
              <Card className="mt-6 p-6 bg-gradient-to-br from-casino-green/20 to-casino-felt/30 backdrop-blur-lg border-casino-gold/30">
                <div className="text-center space-y-6">
                  <h4 className="text-xl font-bold text-casino-gold">
                    Volgende kaart gokken
                  </h4>
                  
                  <p className="text-lg text-casino-silver">
                    Is de volgende kaart <span className="text-casino-gold font-bold">hoger</span> of{' '}
                    <span className="text-casino-gold font-bold">lager</span> dan{' '}
                    <span className="text-casino-gold font-bold">{currentCard.name}</span>?
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                      onClick={() => onMakeGuess('higher')}
                      className="bg-gradient-to-r from-casino-green to-casino-felt hover:from-casino-gold hover:to-casino-copper text-white font-bold px-8 py-4 text-lg hover-lift flex items-center gap-3"
                    >
                      <ArrowUp className="w-6 h-6" />
                      Hoger
                    </Button>

                    <Button
                      onClick={() => onMakeGuess('lower')}
                      className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-bold px-8 py-4 text-lg hover-lift flex items-center gap-3"
                    >
                      <ArrowDown className="w-6 h-6" />
                      Lager
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Info panel */}
          <div className="space-y-6">
            {/* Player info */}
            <Card className="p-6 bg-card/90 backdrop-blur-lg border-casino-gold/20">
              <h4 className="font-bold mb-4 text-center text-casino-gold text-lg">
                🚌 Bus Rijder
              </h4>
              <div className="text-center space-y-3">
                <div className="text-xl font-bold text-casino-gold bg-casino-felt/20 px-4 py-2 rounded-lg border border-casino-gold/30">
                  {busPlayer.name}
                </div>
                <div className="text-casino-silver">
                  <span className="text-sm">Piramide Score:</span>
                  <div className="font-semibold text-lg text-casino-gold">{busPlayer.score}</div>
                </div>
              </div>
            </Card>

            {/* Bus rules */}
            <Card className="p-6 bg-card/90 backdrop-blur-lg border-casino-gold/20">
              <h4 className="font-semibold mb-4 text-center text-casino-gold">
                📋 Bus Regels
              </h4>
              <div className="text-sm text-casino-silver space-y-3">
                <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                  <div className="text-casino-gold font-bold">1.</div>
                  <span>Eerst worden {busOpenCards} kaarten open gelegd</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                  <div className="text-casino-gold font-bold">2.</div>
                  <span>Gok hoger/lager voor de volgende kaart</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                  <RotateCcw className="w-4 h-4 text-red-400 mt-0.5" />
                  <span className="text-red-300">Fout = nieuwe bus kaarten</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-casino-green/20 rounded-lg border border-casino-green/30">
                  <div className="text-casino-green font-bold">🎯</div>
                  <span className="text-casino-green">Alle kaarten = vrij!</span>
                </div>
              </div>
            </Card>

            {/* Player hand */}
            <Card className="p-6 bg-card/90 backdrop-blur-lg border-casino-gold/20">
              <h4 className="font-semibold mb-4 text-center text-casino-gold">
                🃏 Handkaarten
              </h4>
              <div className="grid grid-cols-2 gap-2 justify-items-center">
                {busPlayer.handCards.slice(0, 4).map((card, index) => (
                  <div 
                    key={card.id} 
                    className="scale-75 transition-transform hover:scale-90 hover:z-10 relative"
                  >
                    <PlayingCard card={card} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}