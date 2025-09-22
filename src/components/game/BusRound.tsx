import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayingCard } from './PlayingCard';
import { ThemeSelector } from '@/components/ui/theme-selector';
import { Card as GameCard, Player } from '@/types/game';
import { Progress } from '@/components/ui/progress';
import { Bus, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BusRoundProps {
  busPlayer: Player;
  busCards: GameCard[];
  currentBusIndex: number;
  onMakeGuess: (guess: 'higher' | 'lower') => void;
  onFinishGame: () => void;
}

export function BusRound({
  busPlayer,
  busCards,
  currentBusIndex,
  onMakeGuess,
  onFinishGame
}: BusRoundProps) {
  const progress = (currentBusIndex / (busCards.length - 1)) * 100;
  const currentCard = busCards[currentBusIndex];
  const isLastCard = currentBusIndex >= busCards.length - 1;

  if (isLastCard) {
    return (
      <div className="min-h-screen bg-gradient-felt flex items-center justify-center p-4">
        {/* Theme selector */}
        <div className="fixed top-4 right-4 z-30">
          <ThemeSelector />
        </div>
        
        <Card className="p-8 bg-card/95 backdrop-blur-sm shadow-card border-casino-gold/20 text-center max-w-md">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gold rounded-full mb-4 animate-glow">
              <Bus className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Gefeliciteerd!</h2>
            <p className="text-muted-foreground mb-4">
              <strong>{busPlayer.name}</strong> heeft de bus succesvol voltooid!
            </p>
          </div>

          <Button 
            onClick={onFinishGame}
            className="bg-gradient-casino text-primary-foreground font-semibold hover:shadow-gold"
          >
            Bekijk Resultaten
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-felt p-4">
      <div className="max-w-4xl mx-auto">
        {/* Theme selector */}
        <div className="fixed top-4 right-4 z-30">
          <ThemeSelector />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bus className="w-6 h-6 text-casino-gold" />
            <h2 className="text-2xl font-bold text-foreground">De Bus</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            <strong>{busPlayer.name}</strong> moet de bus door!
          </p>
          <Progress value={progress} className="w-full max-w-md mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">
            Kaart {currentBusIndex + 1} van {busCards.length}
          </p>
        </div>

        {/* Game Area */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Bus cards */}
          <div className="md:col-span-2">
            <Card className="p-6 bg-card/95 backdrop-blur-sm shadow-card border-casino-gold/20">
              <h3 className="text-lg font-semibold text-center mb-6">De Bus Route</h3>
              
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {busCards.map((card, index) => (
                  <div key={card.id} className="relative">
                    <PlayingCard
                      card={index <= currentBusIndex ? card : undefined}
                      faceDown={index > currentBusIndex}
                      className={cn(
                        index === currentBusIndex && "ring-2 ring-casino-gold shadow-gold scale-110",
                        index < currentBusIndex && "opacity-75 scale-90"
                      )}
                      animate={index === currentBusIndex ? 'glow' : undefined}
                    />
                    {index === currentBusIndex && (
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-casino-gold text-primary px-2 py-1 rounded-full text-xs font-bold">
                          Huidig
                        </div>
                      </div>
                    )}
                    {index < currentBusIndex && (
                      <div className="absolute top-1 right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                        <span className="text-xs text-white">✓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="text-center">
                <p className="text-lg font-medium text-foreground mb-6">
                  Is de volgende kaart hoger of lager dan {currentCard?.name}?
                </p>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => onMakeGuess('higher')}
                    className="bg-gradient-casino text-primary-foreground font-semibold hover:shadow-gold flex items-center gap-2 px-8 py-3 text-lg"
                  >
                    <ArrowUp className="w-5 h-5" />
                    Hoger
                  </Button>

                  <Button
                    onClick={() => onMakeGuess('lower')}
                    className="bg-gradient-casino text-primary-foreground font-semibold hover:shadow-gold flex items-center gap-2 px-8 py-3 text-lg"
                  >
                    <ArrowDown className="w-5 h-5" />
                    Lager
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            {/* Player info */}
            <Card className="p-4 bg-card/95 backdrop-blur-sm shadow-card border-casino-gold/20">
              <h4 className="font-semibold mb-3 text-center text-foreground">Bus Passagier</h4>
              <div className="text-center">
                <div className="text-lg font-bold text-casino-gold">{busPlayer.name}</div>
                <div className="text-sm text-muted-foreground">Score: {busPlayer.score}</div>
              </div>
            </Card>

            {/* Player's hand */}
            <Card className="p-4 bg-card/80 backdrop-blur-sm border-casino-gold/10">
              <h4 className="font-medium mb-3 text-center">Handkaarten</h4>
              <div className="flex flex-wrap gap-1 justify-center">
                {busPlayer.handCards.map((card) => (
                  <div key={card.id} className="scale-75">
                    <PlayingCard card={card} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Rules */}
            <Card className="p-4 bg-card/80 backdrop-blur-sm border-casino-gold/10">
              <h4 className="font-medium mb-2 text-center">Bus Regels</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3 h-3" />
                  <span>Fout = opnieuw beginnen</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-3 h-3" />
                  <span>Goed = volgende kaart</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bus className="w-3 h-3" />
                  <span>Hele bus = vrij!</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}