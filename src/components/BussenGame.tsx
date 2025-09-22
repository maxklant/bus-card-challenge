import { useGameState } from '@/hooks/useGameState';
import { dealCard } from '@/utils/cardUtils';
import { GameSetup } from './game/GameSetup';
import { QuestionRound } from './game/QuestionRound';
import { PyramidRound } from './game/PyramidRound';
import { BusRound } from './game/BusRound';
import { GameResults } from './game/GameResults';

export function BussenGame() {
  const {
    gameState,
    initializeGame,
    addCardToCurrentPlayer,
    dealCardToCurrentPlayer,
    dealCardOnly,
    nextQuestion,
    revealPyramidCard,
    startBusPhase,
    makeBusGuess,
    resetGame,
    setPhase
  } = useGameState();

  const handleDealCard = () => {
    return dealCardOnly();
  };

  const handleAnswerQuestion = (answer: string) => {
    // Logic is now handled inside dealCardOnly
  };

  const handleStartBus = () => {
    startBusPhase();
  };

  const handleFinishGame = () => {
    setPhase('results');
  };

  switch (gameState.phase) {
    case 'setup':
      return <GameSetup onStartGame={initializeGame} />;

    case 'questions':
      return (
        <QuestionRound
          players={gameState.players}
          currentPlayerIndex={gameState.currentPlayerIndex}
          currentQuestionIndex={gameState.currentQuestionIndex}
          deck={gameState.deck}
          onAnswerQuestion={handleAnswerQuestion}
          onDealCard={handleDealCard}
          onNextQuestion={nextQuestion}
        />
      );

    case 'pyramid':
      return (
        <PyramidRound
          players={gameState.players}
          pyramidCards={gameState.pyramidCards}
          pyramidRevealed={gameState.pyramidRevealed}
          onRevealCard={revealPyramidCard}
          onStartBus={handleStartBus}
        />
      );

    case 'bus':
      return gameState.busPlayer ? (
        <BusRound
          busPlayer={gameState.busPlayer}
          busCards={gameState.busCards}
          currentBusIndex={gameState.currentBusIndex}
          busLength={gameState.busLength}
          busOpenCards={gameState.busOpenCards}
          onMakeGuess={makeBusGuess}
          onFinishGame={handleFinishGame}
        />
      ) : null;

    case 'results':
      return (
        <GameResults
          players={gameState.players}
          busPlayer={gameState.busPlayer}
          onPlayAgain={resetGame}
        />
      );

    default:
      return <GameSetup onStartGame={initializeGame} />;
  }
}