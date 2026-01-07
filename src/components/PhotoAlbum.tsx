import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Photo {
  id: number;
  title: string;
  url: string;
}

interface PhotoAlbumProps {
  photos: Photo[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function PhotoAlbum({ photos, isOpen, onClose, initialIndex = 0 }: PhotoAlbumProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');

  if (!isOpen) return null;

  const goToNext = () => {
    if (currentIndex < photos.length - 1 && !isFlipping) {
      setFlipDirection('next');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0 && !isFlipping) {
      setFlipDirection('prev');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrev();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-background/80 hover:bg-background"
        onClick={onClose}
      >
        <Icon name="X" size={24} />
      </Button>

      <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center perspective-[2000px]">
        <div className="relative w-full h-full flex items-center justify-center">
          <div 
            className={`photo-album-page ${isFlipping ? (flipDirection === 'next' ? 'flipping-next' : 'flipping-prev') : ''}`}
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s ease-in-out',
            }}
          >
            <div className="album-content bg-card border-4 border-border rounded-2xl shadow-2xl overflow-hidden">
              <img
                src={photos[currentIndex].url}
                alt={photos[currentIndex].title}
                className="w-full h-full object-contain"
                style={{ maxHeight: '70vh' }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{photos[currentIndex].title}</h3>
                <p className="text-white/70">{currentIndex + 1} / {photos.length}</p>
              </div>
            </div>
          </div>
        </div>

        {currentIndex > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 w-16 h-16 rounded-full bg-primary/20 hover:bg-primary/40 backdrop-blur-sm"
            onClick={goToPrev}
            disabled={isFlipping}
          >
            <Icon name="ChevronLeft" size={32} />
          </Button>
        )}

        {currentIndex < photos.length - 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 w-16 h-16 rounded-full bg-primary/20 hover:bg-primary/40 backdrop-blur-sm"
            onClick={goToNext}
            disabled={isFlipping}
          >
            <Icon name="ChevronRight" size={32} />
          </Button>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {photos.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-primary w-8' 
                : 'bg-foreground/30 hover:bg-foreground/50'
            }`}
            onClick={() => {
              if (!isFlipping && index !== currentIndex) {
                setFlipDirection(index > currentIndex ? 'next' : 'prev');
                setIsFlipping(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsFlipping(false);
                }, 600);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
