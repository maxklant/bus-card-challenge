import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameSetupProps {
  onStartGame: (playerNames: string[]) => void;
}

export function GameSetup({ onStartGame }: GameSetupProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(['']);

  const addPlayer = () => {
    if (playerNames.length < 8) {
      setPlayerNames([...playerNames, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 1) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const updated = [...playerNames];
    updated[index] = name;
    setPlayerNames(updated);
  };

  const canStart = playerNames.filter(name => name.trim().length > 0).length >= 2;
  const validNames = playerNames.filter(name => name.trim().length > 0);

  const handleStart = () => {
    if (canStart) {
      onStartGame(validNames);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-felt flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 bg-card/95 backdrop-blur-sm shadow-card border-casino-gold/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gold rounded-full mb-4 shadow-gold animate-glow">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Bussen</h1>
            <p className="text-muted-foreground">Voer de namen van de spelers in</p>
          </div>

          <div className="space-y-4">
            {playerNames.map((name, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Speler ${index + 1}`}
                  value={name}
                  onChange={(e) => updatePlayerName(index, e.target.value)}
                  className="flex-1"
                  maxLength={20}
                />
                {playerNames.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removePlayer(index)}
                    className="shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={addPlayer}
              disabled={playerNames.length >= 8}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Speler toevoegen
            </Button>

            <div className="text-sm text-muted-foreground">
              {validNames.length}/8 spelers
            </div>
          </div>

          <Button
            onClick={handleStart}
            disabled={!canStart}
            className={cn(
              "w-full mt-6 bg-gradient-casino text-primary-foreground font-semibold",
              "hover:shadow-gold transition-all duration-300",
              canStart && "animate-glow"
            )}
          >
            Spel starten
          </Button>

          {!canStart && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              Minimaal 2 spelers nodig
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}