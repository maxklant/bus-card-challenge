import { Card, Suit, CardColor } from '@/types/game';

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const suitNames = {
  hearts: 'Harten',
  diamonds: 'Ruiten',
  clubs: 'Klaveren',
  spades: 'Schoppen'
};

const valueNames = {
  1: 'Aas',
  11: 'Boer',
  12: 'Vrouw',
  13: 'Koning'
};

export function createDeck(): Card[] {
  const deck: Card[] = [];
  
  for (const suit of suits) {
    const color: CardColor = suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
    
    for (let value = 1; value <= 13; value++) {
      const name = valueNames[value as keyof typeof valueNames] || value.toString();
      
      deck.push({
        id: `${suit}-${value}`,
        suit,
        value,
        color,
        name: `${name} ${suitNames[suit]}`
      });
    }
  }
  
  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

export function dealCard(deck: Card[]): { card: Card; remainingDeck: Card[] } {
  if (deck.length === 0) {
    throw new Error('Cannot deal from empty deck');
  }
  
  const card = deck[0];
  const remainingDeck = deck.slice(1);
  
  return { card, remainingDeck };
}

export function isHigher(card1: Card, card2: Card): boolean {
  return card1.value > card2.value;
}

export function isInsideRange(card: Card, minCard: Card, maxCard: Card): boolean {
  const min = Math.min(minCard.value, maxCard.value);
  const max = Math.max(minCard.value, maxCard.value);
  return card.value > min && card.value < max;
}

export function getCardEmoji(suit: Suit): string {
  const emojis = {
    hearts: '♥️',
    diamonds: '♦️',
    clubs: '♣️',
    spades: '♠️'
  };
  return emojis[suit];
}

export function getSuitName(suit: Suit): string {
  return suitNames[suit];
}

export function getCardDisplayValue(card: Card): string {
  if (card.value === 1) return 'A';
  if (card.value === 11) return 'J';
  if (card.value === 12) return 'Q';
  if (card.value === 13) return 'K';
  return card.value.toString();
}