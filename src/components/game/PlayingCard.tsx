import { Card } from '@/types/game';
import { getCardEmoji, getCardDisplayValue } from '@/utils/cardUtils';
import { cn } from '@/lib/utils';

interface PlayingCardProps {
  card?: Card;
  faceDown?: boolean;
  className?: string;
  onClick?: () => void;
  animate?: 'deal' | 'flip' | 'float' | 'glow';
}

export function PlayingCard({ 
  card, 
  faceDown = false, 
  className, 
  onClick,
  animate 
}: PlayingCardProps) {
  const isRed = card?.color === 'red';
  
  const animationClass = {
    deal: 'animate-card-deal',
    flip: 'animate-card-flip',
    float: 'animate-float',
    glow: 'animate-glow'
  }[animate || ''];

  return (
    <div
      className={cn(
        "relative w-20 h-28 bg-card border-2 rounded-lg shadow-card",
        "flex flex-col items-center justify-center cursor-pointer",
        "transition-all duration-300 hover:shadow-card-hover hover:scale-105",
        "select-none",
        animationClass,
        onClick && "hover:bg-card/90",
        className
      )}
      onClick={onClick}
      style={{ perspective: '1000px' }}
    >
      {faceDown ? (
        <div className="w-full h-full bg-gradient-casino border-2 border-casino-gold/30 rounded-lg flex items-center justify-center">
          <div className="text-casino-gold text-2xl">🂠</div>
        </div>
      ) : card ? (
        <>
          {/* Card value in corners */}
          <div className={cn(
            "absolute top-1 left-1 text-sm font-bold",
            isRed ? "text-red-600" : "text-gray-800"
          )}>
            {getCardDisplayValue(card)}
          </div>
          <div className={cn(
            "absolute bottom-1 right-1 text-sm font-bold rotate-180",
            isRed ? "text-red-600" : "text-gray-800"
          )}>
            {getCardDisplayValue(card)}
          </div>
          
          {/* Suit symbol in center */}
          <div className="text-3xl">
            {getCardEmoji(card.suit)}
          </div>
          
          {/* Suit symbols in corners */}
          <div className={cn(
            "absolute top-1 left-1 mt-3 text-xs",
            isRed ? "text-red-600" : "text-gray-800"
          )}>
            {getCardEmoji(card.suit)}
          </div>
          <div className={cn(
            "absolute bottom-1 right-1 mb-3 text-xs rotate-180",
            isRed ? "text-red-600" : "text-gray-800"
          )}>
            {getCardEmoji(card.suit)}
          </div>
        </>
      ) : (
        <div className="text-muted-foreground text-sm">Leeg</div>
      )}
    </div>
  );
}