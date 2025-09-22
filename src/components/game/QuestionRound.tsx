import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayingCard } from './PlayingCard';
import { Card as GameCard, QuestionType } from '@/types/game';
import { dealCard, getSuitName } from '@/utils/cardUtils';
import { Progress } from '@/components/ui/progress';
import { Users, ArrowRight } from 'lucide-react';

interface QuestionRoundProps {
  players: { id: string; name: string; handCards: GameCard[] }[];
  currentPlayerIndex: number;
  currentQuestionIndex: number;
  deck: GameCard[];
  onAnswerQuestion: (answer: string, card: GameCard) => void;
  onNextQuestion: () => void;
}

const questions = [
  {
    type: 'color' as QuestionType,
    question: 'Rood of zwart?',
    options: ['Rood', 'Zwart']
  },
  {
    type: 'higher-lower' as QuestionType,
    question: 'Hoger of lager dan je vorige kaart?',
    options: ['Hoger', 'Lager']
  },
  {
    type: 'inside-outside' as QuestionType,
    question: 'Binnen of buiten je twee kaarten?',
    options: ['Binnen', 'Buiten']
  },
  {
    type: 'suit' as QuestionType,
    question: 'Welke soort?',
    options: ['Harten', 'Ruiten', 'Klaveren', 'Schoppen']
  }
];

export function QuestionRound({
  players,
  currentPlayerIndex,
  currentQuestionIndex,
  deck,
  onAnswerQuestion,
  onNextQuestion
}: QuestionRoundProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [revealedCard, setRevealedCard] = useState<GameCard | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  const currentPlayer = players[currentPlayerIndex];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestionsAnswered = players.reduce((total, player) => total + player.handCards.length, 0);
  const totalProgress = (totalQuestionsAnswered) / (players.length * 4) * 100;

  const handleAnswer = useCallback(async (answer: string) => {
    if (deck.length === 0) return;

    setSelectedAnswer(answer);
    setIsRevealing(true);

    // Simulate card flip animation delay
    setTimeout(() => {
      const { card } = dealCard(deck);
      setRevealedCard(card);
      onAnswerQuestion(answer, card);
    }, 300);
  }, [deck, onAnswerQuestion]);

  const handleNext = useCallback(() => {
    setSelectedAnswer(null);
    setRevealedCard(null);
    setIsRevealing(false);
    onNextQuestion();
  }, [onNextQuestion]);

  const isCorrectAnswer = useCallback((answer: string, card: GameCard): boolean => {
    switch (currentQuestion.type) {
      case 'color':
        return (answer === 'Rood' && card.color === 'red') || 
               (answer === 'Zwart' && card.color === 'black');
      
      case 'higher-lower':
        if (currentPlayer.handCards.length === 0) return false;
        const lastCard = currentPlayer.handCards[currentPlayer.handCards.length - 1];
        return (answer === 'Hoger' && card.value > lastCard.value) ||
               (answer === 'Lager' && card.value < lastCard.value);
      
      case 'inside-outside':
        if (currentPlayer.handCards.length < 2) return false;
        const [card1, card2] = currentPlayer.handCards.slice(-2);
        const min = Math.min(card1.value, card2.value);
        const max = Math.max(card1.value, card2.value);
        const isInside = card.value > min && card.value < max;
        return (answer === 'Binnen' && isInside) || (answer === 'Buiten' && !isInside);
      
      case 'suit':
        const dutchToEnglish = {
          'Harten': 'hearts',
          'Ruiten': 'diamonds', 
          'Klaveren': 'clubs',
          'Schoppen': 'spades'
        };
        return dutchToEnglish[answer as keyof typeof dutchToEnglish] === card.suit;
      
      default:
        return false;
    }
  }, [currentQuestion.type, currentPlayer.handCards]);

  return (
    <div className="min-h-screen bg-gradient-felt flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-6 h-6 text-casino-gold" />
            <h2 className="text-2xl font-bold text-foreground">Vragenronde</h2>
          </div>
          <Progress value={totalProgress} className="w-full max-w-md mx-auto mb-4" />
          <p className="text-muted-foreground">
            {currentPlayer.name} - Vraag {currentQuestionIndex + 1} van 4
          </p>
        </div>

        {/* Current Player */}
        <Card className="p-6 bg-card/95 backdrop-blur-sm shadow-card border-casino-gold/20 mb-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">{currentPlayer.name}</h3>
            
            {/* Player's current cards */}
            <div className="flex justify-center gap-2 mb-6">
              {currentPlayer.handCards.map((card, index) => (
                <PlayingCard key={card.id} card={card} animate="float" />
              ))}
              {Array.from({ length: 4 - currentPlayer.handCards.length }, (_, i) => (
                <div key={`empty-${i}`} className="w-20 h-28 border-2 border-dashed border-muted rounded-lg" />
              ))}
            </div>

            {/* Question */}
            <h4 className="text-lg font-medium text-foreground mb-4">{currentQuestion.question}</h4>

            {revealedCard ? (
              <div className="space-y-6">
                {/* Revealed card */}
                <div className="flex justify-center">
                  <PlayingCard 
                    card={revealedCard} 
                    animate="flip"
                  />
                </div>

                {/* Result */}
                <div className="text-center">
                  {selectedAnswer && (
                    <div className={`inline-block px-4 py-2 rounded-full font-medium ${
                      isCorrectAnswer(selectedAnswer, revealedCard)
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {isCorrectAnswer(selectedAnswer, revealedCard) ? '✓ Correct!' : '✗ Fout!'}
                    </div>
                  )}
                </div>

                {/* Next button */}
                <Button 
                  onClick={handleNext}
                  className="bg-gradient-casino text-primary-foreground font-semibold hover:shadow-gold"
                >
                  {totalQuestionsAnswered < players.length * 4 - 1 ? (
                    <>Volgende speler <ArrowRight className="ml-2 w-4 h-4" /></>
                  ) : (
                    'Naar Piramide'
                  )}
                </Button>
              </div>
            ) : (
              /* Answer options */
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {currentQuestion.options.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    onClick={() => handleAnswer(option)}
                    disabled={isRevealing}
                    className="h-12 text-lg font-medium border-casino-gold/30 hover:bg-casino-green/10 hover:border-casino-gold/50"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* All players overview */}
        <Card className="p-4 bg-card/80 backdrop-blur-sm border-casino-gold/10">
          <h4 className="font-medium text-foreground mb-3 text-center">Spelers overzicht</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {players.map((player, index) => (
              <div 
                key={player.id}
                className={`p-3 rounded-lg border transition-all ${
                  index === currentPlayerIndex 
                    ? 'bg-casino-green/20 border-casino-gold/50' 
                    : 'bg-muted/20 border-muted/30'
                }`}
              >
                <div className="text-sm font-medium text-foreground">{player.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {player.handCards.length}/4 kaarten
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}