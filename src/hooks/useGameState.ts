import { useState, useCallback } from 'react';
import { GameState, Player, Card, GamePhase } from '@/types/game';
import { createDeck, dealCardWithReshuffle } from '@/utils/cardUtils';

const initialGameState: GameState = {
  phase: 'setup',
  players: [],
  currentPlayerIndex: 0,
  currentQuestionIndex: 0,
  deck: [],
  usedCards: [],
  pyramidCards: [],
  pyramidRevealed: [],
  busCards: [],
  currentBusIndex: 0,
  busPlayer: null,
  gameHistory: [],
  busLength: undefined,
  busOpenCards: undefined,
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
      usedCards: [],
      gameHistory: [`Spel gestart met ${players.length} spelers`],
    });
  }, []);

  const addCardToCurrentPlayer = useCallback((card: Card) => {
    setGameState(prev => {
      const newPlayers = [...prev.players];
      newPlayers[prev.currentPlayerIndex].handCards.push(card);
      
      // Add the card to used cards
      const newUsedCards = [...prev.usedCards, card];
      
      return {
        ...prev,
        players: newPlayers,
        usedCards: newUsedCards,
      };
    });
  }, []);

  const dealCardToCurrentPlayer = useCallback(() => {
    setGameState(prev => {
      const { card, remainingDeck, newUsedCards, wasReshuffled } = dealCardWithReshuffle(prev.deck, prev.usedCards);
      
      const newPlayers = [...prev.players];
      newPlayers[prev.currentPlayerIndex].handCards.push(card);
      
      const newHistory = [...prev.gameHistory];
      if (wasReshuffled) {
        newHistory.push('Deck opnieuw geschud!');
      }
      newHistory.push(`${newPlayers[prev.currentPlayerIndex].name} kreeg ${card.name}`);
      
      return {
        ...prev,
        players: newPlayers,
        deck: remainingDeck,
        usedCards: newUsedCards,
        gameHistory: newHistory,
      };
    });
  }, []);

  const dealCardOnly = useCallback((): Card | null => {
    const currentState = gameState;
    const { card, remainingDeck, newUsedCards, wasReshuffled } = dealCardWithReshuffle(currentState.deck, currentState.usedCards);
    
    // Update the state
    setGameState(prev => {
      const newPlayers = [...prev.players];
      newPlayers[prev.currentPlayerIndex].handCards.push(card);
      
      const newHistory = [...prev.gameHistory];
      if (wasReshuffled) {
        newHistory.push('Deck opnieuw geschud!');
      }
      newHistory.push(`${newPlayers[prev.currentPlayerIndex].name} kreeg ${card.name}`);
      
      return {
        ...prev,
        players: newPlayers,
        deck: remainingDeck,
        usedCards: newUsedCards,
        gameHistory: newHistory,
      };
    });
    
    return card;
  }, [gameState]);

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
        let currentUsedCards = [...prev.usedCards];
        const historyUpdates = [...prev.gameHistory];

        for (let row = 0; row < pyramidSize; row++) {
          pyramidCards[row] = [];
          pyramidRevealed[row] = [];
          
          for (let col = 0; col <= row; col++) {
            const { card, remainingDeck, newUsedCards, wasReshuffled } = dealCardWithReshuffle(currentDeck, currentUsedCards);
            pyramidCards[row][col] = card;
            pyramidRevealed[row][col] = false;
            currentDeck = remainingDeck;
            currentUsedCards = newUsedCards;
            
            if (wasReshuffled) {
              historyUpdates.push('Deck opnieuw geschud!');
            }
          }
        }

        return {
          ...prev,
          phase: 'pyramid',
          deck: currentDeck,
          usedCards: currentUsedCards,
          pyramidCards,
          pyramidRevealed,
          currentPlayerIndex: 0,
          currentQuestionIndex: 0,
          gameHistory: historyUpdates.concat(['Piramide fase gestart']),
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

      // Deal first card to determine bus length
      const currentDeck = [...prev.deck];
      const currentUsedCards = [...prev.usedCards];
      const historyUpdates = [...prev.gameHistory];

      const { card: lengthCard, remainingDeck: deck1, newUsedCards: used1, wasReshuffled: reshuffled1 } = dealCardWithReshuffle(currentDeck, currentUsedCards);
      
      if (reshuffled1) {
        historyUpdates.push('Deck opnieuw geschud voor bus kaarten!');
      }

      // Deal second card to determine number of open cards
      const { card: openCard, remainingDeck: deck2, newUsedCards: used2, wasReshuffled: reshuffled2 } = dealCardWithReshuffle(deck1, used1);
      
      if (reshuffled2) {
        historyUpdates.push('Deck opnieuw geschud voor tweede bus kaart!');
      }

      // Determine bus length and open cards based on card values
      const busLength = Math.max(3, Math.min(lengthCard.value, 10)); // Between 3-10 cards
      const busOpenCards = Math.max(1, Math.min(openCard.value, Math.floor(busLength / 2))); // At least 1, max half the bus length

      // Initialize bus cards array with all face-down cards
      const initialBusCards: Card[] = [];
      let remainingDeck = deck2;
      let remainingUsedCards = used2;

      // Deal all bus cards at once
      for (let i = 0; i < busLength; i++) {
        const { card, remainingDeck: newDeck, newUsedCards, wasReshuffled } = dealCardWithReshuffle(remainingDeck, remainingUsedCards);
        if (wasReshuffled) {
          historyUpdates.push(`Deck opnieuw geschud tijdens bus kaart ${i + 1}!`);
        }
        initialBusCards.push(card);
        remainingDeck = newDeck;
        remainingUsedCards = newUsedCards;
      }

      return {
        ...prev,
        phase: 'bus',
        busPlayer,
        busCards: initialBusCards,
        currentBusIndex: 0,
        deck: remainingDeck,
        usedCards: remainingUsedCards,
        busLength,
        busOpenCards,
        gameHistory: historyUpdates.concat([
          `${busPlayer.name} moet de bus in!`,
          `Bus lengte bepaald door ${lengthCard.name}: ${busLength} kaarten`,
          `Open kaarten bepaald door ${openCard.name}: ${busOpenCards} kaarten`
        ]),
      };
    });
  }, []);

  const makeBusGuess = useCallback((guess: 'higher' | 'lower') => {
    setGameState(prev => {
      const busLength = prev.busLength || 8;
      
      // Check if we've completed all correct guesses
      if (prev.currentBusIndex >= busLength - 1) {
        // Bus completed successfully
        return {
          ...prev,
          phase: 'results',
          gameHistory: [...prev.gameHistory, `${prev.busPlayer?.name} heeft de bus succesvol voltooid!`],
        };
      }

      const currentCard = prev.busCards[prev.currentBusIndex];
      const nextCard = prev.busCards[prev.currentBusIndex + 1];
      
      const historyUpdates = [...prev.gameHistory];
      
      const isCorrect = (guess === 'higher' && nextCard.value > currentCard.value) ||
                       (guess === 'lower' && nextCard.value < currentCard.value) ||
                       (nextCard.value === currentCard.value); // Equal counts as correct

      if (isCorrect) {
        // Move to next card
        return {
          ...prev,
          currentBusIndex: prev.currentBusIndex + 1,
          gameHistory: historyUpdates.concat([`Correct! ${nextCard.name} (${prev.currentBusIndex + 1}/${busLength})`]),
        };
      } else {
        // Wrong guess - deal new cards and reset
        const currentDeck = [...prev.deck];
        const currentUsedCards = [...prev.usedCards];
        
        // Deal new bus cards
        const newBusCards: Card[] = [];
        let remainingDeck = currentDeck;
        let remainingUsedCards = currentUsedCards;

        for (let i = 0; i < busLength; i++) {
          const { card, remainingDeck: newDeck, newUsedCards, wasReshuffled } = dealCardWithReshuffle(remainingDeck, remainingUsedCards);
          if (wasReshuffled) {
            historyUpdates.push(`Deck opnieuw geschud tijdens nieuwe bus kaart ${i + 1}!`);
          }
          newBusCards.push(card);
          remainingDeck = newDeck;
          remainingUsedCards = newUsedCards;
        }

        return {
          ...prev,
          currentBusIndex: 0,
          busCards: newBusCards,
          deck: remainingDeck,
          usedCards: remainingUsedCards,
          gameHistory: historyUpdates.concat([`Fout! ${nextCard.name} - Nieuwe bus kaarten gedeeld`]),
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
    dealCardToCurrentPlayer,
    dealCardOnly,
    nextQuestion,
    revealPyramidCard,
    startBusPhase,
    makeBusGuess,
    resetGame,
    setPhase,
  };
}