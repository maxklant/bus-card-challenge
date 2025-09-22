import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayingCard } from './PlayingCard';
import { ThemeSelector } from '@/components/ui/theme-selector';
import { Card as GameCard, Player } from '@/types/game';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown, Bus, RotateCcw } from 'lucide-react';
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
  onMakeGuess,
  onFinishGame
}: BusRoundProps) {
  const progress = (currentBusIndex / 7) * 100; // 8 correct guesses needed (0-7)
  const currentCard = busCards[currentBusIndex];
  const isCompleted = currentBusIndex >= 7;

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <ThemeSelector />
          <Card className="p-8 bg-gradient-to-br from-emerald-900/95 via-emerald-800/95 to-emerald-900/95 backdrop-blur-xl shadow-2xl border-emerald-400/50">
            <div className="text-center space-y-6">
              <div className="text-6xl">🎉</div>
              <h2 className="text-3xl font-bold text-emerald-300">Bus Voltooid!</h2>
              <p className="text-xl text-emerald-100">
                <strong className="text-emerald-300">{busPlayer.name}</strong> heeft de bus succesvol voltooid!
              </p>
              <Button
                onClick={onFinishGame}
                className="bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-bold px-8 py-4 text-lg rounded-xl shadow-xl"
              >
                Spel Afronden
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <ThemeSelector />
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bus className="w-8 h-8 text-amber-400" />
            <h2 className="text-4xl font-bold text-amber-300">De Bus</h2>
          </div>
          <p className="text-amber-100 mb-6 text-lg">
            <strong className="text-amber-300">{busPlayer.name}</strong> moet de bus door!
          </p>
          <Progress value={progress} className="w-full max-w-md mx-auto h-3 bg-slate-700/50" />
          <p className="text-amber-200 mt-3 font-semibold">
            Correcte gokken: {currentBusIndex} van 8
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="p-8 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl shadow-2xl border-amber-400/30 relative overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-transparent to-purple-500/20"></div>
                <div className="absolute top-4 left-4 w-8 h-8 border border-amber-400/30 rounded rotate-45"></div>
                <div className="absolute top-8 right-8 w-6 h-6 border border-purple-400/30 rounded-full"></div>
                <div className="absolute bottom-8 left-8 w-4 h-4 bg-amber-400/20 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-10 h-10 border border-amber-400/20 rounded rotate-12"></div>
              </div>
              
              <h3 className="text-2xl font-bold text-center mb-8 text-amber-300 relative z-10">Kaarten Historie</h3>
              
              <div className="flex justify-center mb-8">
                <div className="relative perspective-1000">
                  {/* Kaarten stapel - alle vorige kaarten met offset */}
                  {busCards.map((card, index) => {
                    const isCurrentCard = index === currentBusIndex;
                    const offset = Math.max(0, index - Math.max(0, currentBusIndex - 4)); // Toon max 5 kaarten
                    const isVisible = index >= Math.max(0, currentBusIndex - 4);
                    
                    if (!isVisible) return null;
                    
                    return (
                      <div
                        key={card.id}
                        className={cn(
                          "absolute transition-all duration-500 ease-out transform-gpu",
                          isCurrentCard && "z-20 scale-110 rotate-0 shadow-2xl shadow-amber-400/50",
                          !isCurrentCard && "z-10"
                        )}
                        style={{
                          transform: isCurrentCard 
                            ? 'translateX(0px) translateY(0px) rotateZ(0deg) scale(1.1)'
                            : `translateX(${-offset * 8}px) translateY(${-offset * 6}px) rotateZ(${(offset - 2) * 3}deg) scale(${1 - offset * 0.05})`,
                          filter: isCurrentCard ? 'brightness(1.1) contrast(1.1)' : 'brightness(0.8) contrast(0.9)',
                        }}
                      >
                        <PlayingCard
                          card={card}
                          className={cn(
                            "border-2 transition-all duration-300",
                            isCurrentCard 
                              ? "border-amber-400 shadow-lg shadow-amber-400/30 ring-4 ring-amber-400/20" 
                              : "border-slate-600/50 shadow-md"
                          )}
                          animate={isCurrentCard ? 'glow' : undefined}
                        />
                        {isCurrentCard && (
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                              Actieve Kaart
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {/* Placeholder voor lege stapel */}
                  {busCards.length === 0 && (
                    <div className="w-24 h-36 border-2 border-dashed border-amber-400/50 rounded-lg flex items-center justify-center">
                      <span className="text-amber-400/70 text-sm">Geen kaarten</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Enhanced Progress indicators */}
              <div className="flex justify-center gap-3 mb-8 relative z-10">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 relative",
                      index < currentBusIndex 
                        ? "bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-400/30 scale-110" 
                        : index === currentBusIndex
                        ? "bg-gradient-to-br from-amber-400 to-yellow-500 border-amber-400 text-slate-900 animate-pulse shadow-lg shadow-amber-400/50 scale-125"
                        : "bg-slate-800/50 border-slate-600/50 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                    )}
                  >
                    <span className="relative z-10">
                      {index < currentBusIndex ? "✓" : index + 1}
                    </span>
                    {index === currentBusIndex && (
                      <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-30"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Enhanced Controls */}
              <div className="text-center relative z-10">
                <p className="text-xl font-semibold text-amber-100 mb-8 leading-relaxed">
                  Is de volgende kaart <span className="text-amber-300 font-bold">hoger</span> of <span className="text-amber-300 font-bold">lager</span> dan {currentCard?.name}?
                </p>

                <div className="flex justify-center gap-6">
                  <Button
                    onClick={() => onMakeGuess('higher')}
                    className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-400 hover:via-emerald-500 hover:to-emerald-600 text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 flex items-center gap-3 px-8 py-4 text-lg rounded-xl border border-emerald-400/50 transition-all duration-300 hover:scale-105 group"
                  >
                    <ArrowUp className="w-6 h-6 group-hover:animate-bounce" />
                    <span>Hoger</span>
                  </Button>

                  <Button
                    onClick={() => onMakeGuess('lower')}
                    className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-400 hover:via-red-500 hover:to-red-600 text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-red-500/30 flex items-center gap-3 px-8 py-4 text-lg rounded-xl border border-red-400/50 transition-all duration-300 hover:scale-105 group"
                  >
                    <ArrowDown className="w-6 h-6 group-hover:animate-bounce" />
                    <span>Lager</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Enhanced Info Panel */}
          <div className="space-y-6">
            {/* Player info */}
            <Card className="p-6 bg-gradient-to-br from-slate-800/90 via-purple-800/90 to-slate-800/90 backdrop-blur-xl shadow-2xl border-amber-400/30">
              <h4 className="font-bold mb-4 text-center text-amber-300 text-lg">🚌 Bus Passagier</h4>
              <div className="text-center space-y-3">
                <div className="text-xl font-bold text-amber-100 bg-slate-700/50 px-4 py-2 rounded-lg border border-amber-400/30">
                  {busPlayer.name}
                </div>
                <div className="text-amber-200">
                  <span className="text-sm text-amber-400">Piramide Score:</span>
                  <span className="ml-2 font-semibold text-lg">{busPlayer.score}</span>
                </div>
              </div>
            </Card>

            {/* Player's hand */}
            <Card className="p-6 bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-800/80 backdrop-blur-xl border-amber-400/20">
              <h4 className="font-semibold mb-4 text-center text-amber-300">🃏 Handkaarten</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {busPlayer.handCards.map((card, index) => (
                  <div 
                    key={card.id} 
                    className="scale-75 transition-transform hover:scale-90 hover:z-10 relative"
                    style={{
                      transform: `scale(0.75) rotate(${(index - busPlayer.handCards.length / 2) * 5}deg)`,
                      zIndex: index
                    }}
                  >
                    <PlayingCard card={card} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Enhanced Rules */}
            <Card className="p-6 bg-gradient-to-br from-slate-800/70 via-indigo-900/70 to-slate-800/70 backdrop-blur-xl border-amber-400/20">
              <h4 className="font-semibold mb-4 text-center text-amber-300">📋 Bus Regels</h4>
              <div className="text-sm text-amber-100 space-y-3">
                <div className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
                  <RotateCcw className="w-4 h-4 text-red-400" />
                  <span>Fout gokken = opnieuw beginnen</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
                  <ArrowUp className="w-4 h-4 text-emerald-400" />
                  <span>Correct = volgende ronde</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
                  <span className="text-amber-400 font-bold">🎯</span>
                  <span>8 correcte gokken = vrij!</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}