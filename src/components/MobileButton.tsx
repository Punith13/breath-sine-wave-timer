import React, { useState, useCallback } from 'react';
import { hapticButtonPress } from '../utils/haptics';

interface MobileButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'medium' | 'large';
  disabled?: boolean;
  enableHaptics?: boolean;
  className?: string;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  enableHaptics = true,
  className = '',
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = useCallback(() => {
    if (!disabled) {
      setIsPressed(true);
      if (enableHaptics) {
        hapticButtonPress();
      }
    }
  }, [disabled, enableHaptics]);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleMouseDown = useCallback(() => {
    if (!disabled) {
      setIsPressed(true);
    }
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick();
    }
  }, [onClick, disabled]);

  const buttonClasses = [
    'mobile-button',
    `mobile-button--${variant}`,
    `mobile-button--${size}`,
    isPressed ? 'mobile-button--pressed' : '',
    disabled ? 'mobile-button--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={disabled}
      aria-pressed={isPressed}
    >
      {children}
    </button>
  );
};