import React, { useState, useEffect } from 'react';

interface TimerDisplayProps {
  isPlaying: boolean;
  speed: number;
  currentPosition: number;
  totalHeight: number;
  startTime: number | null;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  isPlaying,
  speed,
  currentPosition,
  totalHeight,
  startTime
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTotalTime, setEstimatedTotalTime] = useState(0);

  // Calculate elapsed time
  useEffect(() => {
    if (!isPlaying || !startTime) {
      setElapsedTime(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, startTime]);

  // Calculate estimated total time based on speed and progress
  useEffect(() => {
    if (totalHeight > 0 && currentPosition > 0) {
      const progress = currentPosition / totalHeight;
      if (progress > 0 && elapsedTime > 0) {
        const estimatedTotal = elapsedTime / progress;
        setEstimatedTotalTime(estimatedTotal);
      }
    }
  }, [currentPosition, totalHeight, elapsedTime]);

  // Format time as MM:SS
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const remainingTime = Math.max(0, estimatedTotalTime - elapsedTime);
  const progress = totalHeight > 0 ? (currentPosition / totalHeight) * 100 : 0;

  return (
    <div className="fixed top-4 left-4 z-30">
      <div className="bg-neutral-800 bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-3 border border-neutral-700">
        {/* Timer Display */}
        <div className="flex items-center gap-4 text-sm font-mono">
          <div className="flex items-center gap-1">
            <span className="text-red-400">E:</span>
            <span className="text-red-300">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-blue-400">R:</span>
            <span className="text-blue-300">{formatTime(remainingTime)}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-2 w-full bg-neutral-700 rounded-full h-1">
          <div 
            className="bg-green-400 h-1 rounded-full transition-all duration-100"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        {/* Status Indicator */}
        <div className="mt-1 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-neutral-500'}`} />
          <span className="text-xs text-neutral-400">
            {isPlaying ? 'Playing' : 'Paused'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
