export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type CardColor = 'red' | 'black';

export interface Card {
  id: string;
  suit: Suit;
  value: number; // 1-13 (Ace=1, Jack=11, Queen=12, King=13)
  color: CardColor;
  name: string; // e.g., "Ace of Hearts", "7 of Spades"
}

export interface Player {
  id: string;
  name: string;
  handCards: Card[];
  score: number; // Points accumulated during pyramid round
}

export type GamePhase = 'setup' | 'questions' | 'pyramid' | 'bus' | 'results';

export type QuestionType = 'color' | 'higher-lower' | 'inside-outside' | 'suit';

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  currentQuestionIndex: number;
  deck: Card[];
  pyramidCards: Card[][];
  pyramidRevealed: boolean[][];
  busCards: Card[];
  currentBusIndex: number;
  busPlayer: Player | null;
  gameHistory: string[];
}

export interface QuestionState {
  type: QuestionType;
  question: string;
  options: string[];
  playerCards: Card[];
}