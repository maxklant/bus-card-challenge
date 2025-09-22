import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayingCard } from './PlayingCard';
import { ThemeSelector } from '@/components/ui/theme-selector';
import { Card as GameCard, QuestionType } from '@/types/game';
import { getSuitName } from '@/utils/cardUtils';
import { Progress } from '@/components/ui/progress';
import { Users, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

interface QuestionRoundProps {
  players: { id: string; name: string; handCards: GameCard[] }[];
  currentPlayerIndex: number;
  currentQuestionIndex: number;
  deck: GameCard[];
  onAnswerQuestion: (answer: string) => void;
  onDealCard: () => GameCard | null;
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
  onDealCard,
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
      const card = onDealCard();
      if (card) {
        setRevealedCard(card);
        onAnswerQuestion(answer);
      }
    }, 300);
  }, [deck.length, onAnswerQuestion, onDealCard]);

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
      
      case 'higher-lower': {
        if (currentPlayer.handCards.length === 0) return false;
        const lastCard = currentPlayer.handCards[currentPlayer.handCards.length - 1];
        return (answer === 'Hoger' && card.value > lastCard.value) ||
               (answer === 'Lager' && card.value < lastCard.value);
      }
      
      case 'inside-outside': {
        if (currentPlayer.handCards.length < 2) return false;
        const [card1, card2] = currentPlayer.handCards.slice(-2);
        const min = Math.min(card1.value, card2.value);
        const max = Math.max(card1.value, card2.value);
        const isInside = card.value > min && card.value < max;
        return (answer === 'Binnen' && isInside) || (answer === 'Buiten' && !isInside);
      }
      
      case 'suit': {
        const dutchToEnglish = {
          'Harten': 'hearts',
          'Ruiten': 'diamonds', 
          'Klaveren': 'clubs',
          'Schoppen': 'spades'
        };
        return dutchToEnglish[answer as keyof typeof dutchToEnglish] === card.suit;
      }
      
      default:
        return false;
    }
  }, [currentQuestion.type, currentPlayer.handCards]);

  const showResult = revealedCard && selectedAnswer;
  const answerCorrect = showResult ? isCorrectAnswer(selectedAnswer, revealedCard) : false;

  return (
    <div className="min-h-screen bg-gradient-casino relative overflow-hidden">
      {/* Artistic background elements */}
      <div className="absolute inset-0 bg-gradient-felt opacity-20"></div>
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-casino-gold/10 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-casino-green/10 blur-xl"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* Header with progress and theme selector */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-casino-gold bg-gradient-gold bg-clip-text text-transparent">
              Vragen Ronde
            </h1>
            <div className="flex items-center gap-4 text-casino-silver">
              <span className="text-lg">Vraag {currentQuestionIndex + 1} van 4</span>
              <Progress 
                value={totalProgress} 
                className="w-40 h-3 bg-casino-felt/50" 
              />
            </div>
          </div>
          <ThemeSelector />
        </div>

        {/* Current player highlight */}
        <Card className="p-6 bg-gradient-to-br from-casino-green/20 to-casino-felt/30 backdrop-blur-lg border-casino-gold/30 golden-glow">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-casino-gold">
              <Users className="w-5 h-5" />
              <span className="text-lg font-medium">Aan de beurt:</span>
            </div>
            <h2 className="text-3xl font-bold text-casino-silver">{currentPlayer.name}</h2>
          </div>
        </Card>

        {/* Main game area with artistic layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Player's cards */}
          <Card className="p-6 bg-card/90 backdrop-blur-lg border-casino-gold/20 hover-lift">
            <h3 className="font-semibold text-casino-gold mb-4 text-center text-lg">
              Jouw kaarten
            </h3>
            <div className="perspective">
              <div className="grid grid-cols-2 gap-4 preserve-3d">
                {currentPlayer.handCards.map((card, index) => (
                  <div
                    key={`${card.suit}-${card.value}-${index}`}
                    className="card-deal hover-glow"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <PlayingCard 
                      card={card} 
                      className="transform hover:rotate-y-12 transition-all duration-300" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Question and answer area */}
          <Card className="p-8 bg-gradient-to-br from-casino-felt/50 to-background/80 backdrop-blur-lg border-casino-gold/30 hover-glow">
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-casino-gold">
                  {currentQuestion.question}
                </h3>
                {currentQuestionIndex > 0 && (
                  <p className="text-muted-foreground text-sm">
                    Gebaseerd op je vorige kaart{currentQuestionIndex > 1 ? 'en' : ''}
                  </p>
                )}
              </div>

              {/* Revealed card area with animation */}
              {revealedCard && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="card-flip">
                      <PlayingCard card={revealedCard} className="golden-glow" />
                    </div>
                  </div>
                  
                  {/* Result feedback */}
                  {showResult && (
                    <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
                      answerCorrect 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {answerCorrect ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                      <span className="font-medium">
                        {answerCorrect ? 'Correct!' : 'Fout!'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Answer buttons or next button */}
              {!isRevealing && !revealedCard && (
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      onClick={() => handleAnswer(option)}
                      disabled={isRevealing}
                      className="h-14 text-lg font-semibold bg-gradient-to-r from-casino-green/20 to-casino-felt/20 border-casino-gold/40 hover:border-casino-gold hover:bg-gradient-gold hover:text-background transition-all duration-300 hover-lift"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {revealedCard && (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-gold hover:bg-gradient-casino text-background font-semibold px-8 py-3 text-lg hover-lift"
                >
                  Volgende speler
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}

              {isRevealing && !revealedCard && (
                <div className="space-y-4">
                  <div className="text-lg text-casino-gold font-medium">
                    Kaart wordt onthuld...
                  </div>
                  <div className="flex justify-center">
                    <div className="w-8 h-8 border-2 border-casino-gold border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Deck and progress */}
          <Card className="p-6 bg-card/90 backdrop-blur-lg border-casino-gold/20">
            <div className="text-center space-y-6">
              <h3 className="font-semibold text-casino-gold text-lg">Deck Status</h3>
              
              {/* Deck visualization */}
              <div className="flex justify-center">
                <div className="relative card-stack">
                  <div className="w-20 h-28 bg-gradient-to-br from-casino-gold/80 to-casino-copper/60 rounded-lg border-2 border-casino-gold/50 flex items-center justify-center transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                    <span className="text-casino-felt font-bold text-sm">
                      {deck.length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {deck.length} kaarten over
              </div>

              {/* Game progress indicator */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-casino-silver">
                  Voortgang
                </div>
                <div className="space-y-2">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index < currentQuestionIndex
                          ? 'bg-gradient-gold shadow-lg'
                          : index === currentQuestionIndex
                          ? 'bg-casino-green/60 pulse-gentle'
                          : 'bg-muted/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* All players overview with enhanced styling */}
        <Card className="p-6 bg-card/80 backdrop-blur-lg border-casino-gold/20">
          <h4 className="font-semibold text-casino-gold mb-6 text-center text-xl">
            Spelers Overzicht
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {players.map((player, index) => (
              <div 
                key={player.id}
                className={`p-4 rounded-lg border transition-all duration-300 hover-lift ${
                  index === currentPlayerIndex 
                    ? 'bg-gradient-to-br from-casino-green/30 to-casino-gold/20 border-casino-gold shadow-lg golden-glow' 
                    : 'bg-muted/20 border-muted/30 hover:border-casino-gold/30'
                }`}
              >
                <div className="text-center space-y-2">
                  <div className={`font-semibold ${
                    index === currentPlayerIndex ? 'text-casino-gold' : 'text-foreground'
                  }`}>
                    {player.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {player.handCards.length}/4 kaarten
                  </div>
                  {index === currentPlayerIndex && (
                    <div className="flex justify-center">
                      <ArrowRight className="w-4 h-4 text-casino-gold animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}