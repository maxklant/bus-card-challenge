import { useState, useCallback } from 'react';
import { GameState, Player, Card, GamePhase } from '@/types/game';
import { createDeck, dealCard } from '@/utils/cardUtils';

const initialGameState: GameState = {
  phase: 'setup',
  players: [],
  currentPlayerIndex: 0,
  currentQuestionIndex: 0,
  deck: [],
  pyramidCards: [],
  pyramidRevealed: [],
  busCards: [],
  currentBusIndex: 0,
  busPlayer: null,
  gameHistory: [],
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const initializeGame = useCallback((playerNames: string[]) => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name,
      handCards: [],
      score: 0,
    }));

    const deck = createDeck();

    setGameState({
      ...initialGameState,
      phase: 'questions',
      players,
      deck,
      gameHistory: [`Spel gestart met ${players.length} spelers`],
    });
  }, []);

  const addCardToCurrentPlayer = useCallback((card: Card) => {
    setGameState(prev => {
      const newPlayers = [...prev.players];
      newPlayers[prev.currentPlayerIndex].handCards.push(card);
      
      return {
        ...prev,
        players: newPlayers,
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setGameState(prev => {
      // Calculate total questions answered so far
      const totalQuestionsAnswered = (prev.currentPlayerIndex * 4) + prev.currentQuestionIndex + 1;
      const totalQuestionsNeeded = prev.players.length * 4;

      if (totalQuestionsAnswered >= totalQuestionsNeeded) {
        // Move to pyramid phase
        const pyramidSize = 4;
        const pyramidCards: Card[][] = [];
        const pyramidRevealed: boolean[][] = [];
        let currentDeck = [...prev.deck];

        for (let row = 0; row < pyramidSize; row++) {
          pyramidCards[row] = [];
          pyramidRevealed[row] = [];
          
          for (let col = 0; col <= row; col++) {
            const { card, remainingDeck } = dealCard(currentDeck);
            pyramidCards[row][col] = card;
            pyramidRevealed[row][col] = false;
            currentDeck = remainingDeck;
          }
        }

        return {
          ...prev,
          phase: 'pyramid',
          deck: currentDeck,
          pyramidCards,
          pyramidRevealed,
          currentPlayerIndex: 0,
          currentQuestionIndex: 0,
          gameHistory: [...prev.gameHistory, 'Piramide fase gestart'],
        };
      }

      // Move to next player for current question
      if (prev.currentPlayerIndex < prev.players.length - 1) {
        return {
          ...prev,
          currentPlayerIndex: prev.currentPlayerIndex + 1,
        };
      } else {
        // All players answered current question, move to next question
        return {
          ...prev,
          currentPlayerIndex: 0,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        };
      }
    });
  }, []);

  const revealPyramidCard = useCallback((row: number, col: number) => {
    setGameState(prev => {
      const newRevealed = [...prev.pyramidRevealed];
      newRevealed[row][col] = true;

      // Check for matches with player hands
      const revealedCard = prev.pyramidCards[row][col];
      const newPlayers = [...prev.players];
      const matchingPlayers: string[] = [];

      newPlayers.forEach(player => {
        const hasMatch = player.handCards.some(card => card.value === revealedCard.value);
        if (hasMatch) {
          player.score += (row + 1); // More points for higher pyramid levels
          matchingPlayers.push(player.name);
        }
      });

      const newHistory = [...prev.gameHistory];
      if (matchingPlayers.length > 0) {
        newHistory.push(`${revealedCard.name} omgedraaid - Match voor: ${matchingPlayers.join(', ')}`);
      } else {
        newHistory.push(`${revealedCard.name} omgedraaid - Geen matches`);
      }

      return {
        ...prev,
        pyramidRevealed: newRevealed,
        players: newPlayers,
        gameHistory: newHistory,
      };
    });
  }, []);

  const startBusPhase = useCallback(() => {
    setGameState(prev => {
      // Find player with highest score (most unlucky)
      const busPlayer = prev.players.reduce((highest, current) => 
        current.score > highest.score ? current : highest
      );

      // Deal bus cards
      const busCardCount = 8;
      const busCards: Card[] = [];
      let currentDeck = [...prev.deck];

      for (let i = 0; i < busCardCount; i++) {
        if (currentDeck.length > 0) {
          const { card, remainingDeck } = dealCard(currentDeck);
          busCards.push(card);
          currentDeck = remainingDeck;
        }
      }

      return {
        ...prev,
        phase: 'bus',
        busPlayer,
        busCards,
        currentBusIndex: 0,
        deck: currentDeck,
        gameHistory: [...prev.gameHistory, `${busPlayer.name} moet de bus in!`],
      };
    });
  }, []);

  const makeBusGuess = useCallback((guess: 'higher' | 'lower') => {
    setGameState(prev => {
      if (prev.currentBusIndex >= prev.busCards.length - 1) {
        // Bus completed successfully
        return {
          ...prev,
          phase: 'results',
          gameHistory: [...prev.gameHistory, `${prev.busPlayer?.name} heeft de bus succesvol voltooid!`],
        };
      }

      const currentCard = prev.busCards[prev.currentBusIndex];
      const nextCard = prev.busCards[prev.currentBusIndex + 1];
      
      const isCorrect = (guess === 'higher' && nextCard.value > currentCard.value) ||
                       (guess === 'lower' && nextCard.value < currentCard.value) ||
                       (nextCard.value === currentCard.value);

      if (isCorrect) {
        return {
          ...prev,
          currentBusIndex: prev.currentBusIndex + 1,
          gameHistory: [...prev.gameHistory, `Correct! ${nextCard.name}`],
        };
      } else {
        // Reset to beginning
        return {
          ...prev,
          currentBusIndex: 0,
          gameHistory: [...prev.gameHistory, `Fout! ${nextCard.name} - Opnieuw beginnen`],
        };
      }
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialGameState);
  }, []);

  const setPhase = useCallback((phase: GamePhase) => {
    setGameState(prev => ({ ...prev, phase }));
  }, []);

  return {
    gameState,
    initializeGame,
    addCardToCurrentPlayer,
    nextQuestion,
    revealPyramidCard,
    startBusPhase,
    makeBusGuess,
    resetGame,
    setPhase,
  };
}