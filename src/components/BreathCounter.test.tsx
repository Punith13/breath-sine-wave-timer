import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BreathCounter } from './BreathCounter';

describe('BreathCounter', () => {
  describe('rendering', () => {
    it('should render with default props', () => {
      render(<BreathCounter count={5} />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('/ 21')).toBeInTheDocument();
    });

    it('should render with custom maxCount', () => {
      render(<BreathCounter count={3} maxCount={10} />);
      
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('/ 10')).toBeInTheDocument();
    });

    it('should render count of 0', () => {
      render(<BreathCounter count={0} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('/ 21')).toBeInTheDocument();
    });

    it('should render maximum count', () => {
      render(<BreathCounter count={21} maxCount={21} />);
      
      expect(screen.getByText('21')).toBeInTheDocument();
      expect(screen.getByText('/ 21')).toBeInTheDocument();
    });

    it('should render large count values', () => {
      render(<BreathCounter count={999} maxCount={1000} />);
      
      expect(screen.getByText('999')).toBeInTheDocument();
      expect(screen.getByText('/ 1000')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<BreathCounter count={5} maxCount={21} />);
      
      const counter = screen.getByRole('status');
      expect(counter).toHaveAttribute('aria-live', 'polite');
      expect(counter).toHaveAttribute('aria-label', 'Breathing cycle counter: 5 of 21');
    });

    it('should update aria-label when count changes', () => {
      const { rerender } = render(<BreathCounter count={5} maxCount={21} />);
      
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Breathing cycle counter: 5 of 21');
      
      rerender(<BreathCounter count={10} maxCount={21} />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Breathing cycle counter: 10 of 21');
    });

    it('should update aria-label when maxCount changes', () => {
      const { rerender } = render(<BreathCounter count={5} maxCount={21} />);
      
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Breathing cycle counter: 5 of 21');
      
      rerender(<BreathCounter count={5} maxCount={10} />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Breathing cycle counter: 5 of 10');
    });

    it('should have screen reader text', () => {
      render(<BreathCounter count={5} maxCount={21} />);
      
      expect(screen.getByText('Breathing cycle 5 of 21')).toBeInTheDocument();
      expect(screen.getByText('Breathing cycle 5 of 21')).toHaveClass('sr-only');
    });

    it('should mark visual elements as aria-hidden', () => {
      render(<BreathCounter count={5} maxCount={21} />);
      
      expect(screen.getByText('5')).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getByText('/ 21')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('CSS classes', () => {
    it('should apply default CSS classes', () => {
      render(<BreathCounter count={5} />);
      
      const counter = screen.getByRole('status');
      expect(counter).toHaveClass('breath-counter');
      expect(counter).toHaveClass('breath-counter--overlay');
      // In test environment, viewport defaults to desktop, so medium becomes large
      expect(counter).toHaveClass('breath-counter--large');
      expect(counter).toHaveClass('breath-counter--desktop');
    });

    it('should apply position variant classes', () => {
      const { rerender } = render(<BreathCounter count={5} position="overlay" />);
      expect(screen.getByRole('status')).toHaveClass('breath-counter--overlay');
      
      rerender(<BreathCounter count={5} position="controls" />);
      expect(screen.getByRole('status')).toHaveClass('breath-counter--controls');
    });

    it('should apply size variant classes', () => {
      const { rerender } = render(<BreathCounter count={5} size="small" />);
      expect(screen.getByRole('status')).toHaveClass('breath-counter--small');
      
      rerender(<BreathCounter count={5} size="medium" />);
      // In test environment (desktop), medium size becomes large due to responsive logic
      expect(screen.getByRole('status')).toHaveClass('breath-counter--large');
      
      rerender(<BreathCounter count={5} size="large" />);
      expect(screen.getByRole('status')).toHaveClass('breath-counter--large');
    });

    it('should apply custom className', () => {
      render(<BreathCounter count={5} className="custom-class" />);
      
      const counter = screen.getByRole('status');
      expect(counter).toHaveClass('breath-counter');
      expect(counter).toHaveClass('custom-class');
    });

    it('should apply multiple custom classes', () => {
      render(<BreathCounter count={5} className="class1 class2 class3" />);
      
      const counter = screen.getByRole('status');
      expect(counter).toHaveClass('breath-counter');
      expect(counter).toHaveClass('class1');
      expect(counter).toHaveClass('class2');
      expect(counter).toHaveClass('class3');
    });
  });

  describe('component structure', () => {
    it('should have correct DOM structure', () => {
      render(<BreathCounter count={5} maxCount={21} />);
      
      const counter = screen.getByRole('status');
      expect(counter).toBeInTheDocument();
      
      // Check for count span
      const countSpan = screen.getByText('5');
      expect(countSpan).toHaveClass('breath-counter__count');
      expect(countSpan.parentElement).toBe(counter);
      
      // Check for max span
      const maxSpan = screen.getByText('/ 21');
      expect(maxSpan).toHaveClass('breath-counter__max');
      expect(maxSpan.parentElement).toBe(counter);
      
      // Check for screen reader text
      const srText = screen.getByText('Breathing cycle 5 of 21');
      expect(srText).toHaveClass('sr-only');
      expect(srText.parentElement).toBe(counter);
    });

    it('should maintain structure with different props', () => {
      render(<BreathCounter count={0} maxCount={100} position="controls" size="large" />);
      
      const counter = screen.getByRole('status');
      expect(counter.children).toHaveLength(3); // count span, max span, sr-only span
      
      expect(screen.getByText('0')).toHaveClass('breath-counter__count');
      expect(screen.getByText('/ 100')).toHaveClass('breath-counter__max');
      expect(screen.getByText('Breathing cycle 0 of 100')).toHaveClass('sr-only');
    });
  });

  describe('prop handling', () => {
    it('should handle count prop changes', () => {
      const { rerender } = render(<BreathCounter count={1} />);
      expect(screen.getByText('1')).toBeInTheDocument();
      
      rerender(<BreathCounter count={15} />);
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    it('should handle maxCount prop changes', () => {
      const { rerender } = render(<BreathCounter count={5} maxCount={10} />);
      expect(screen.getByText('/ 10')).toBeInTheDocument();
      
      rerender(<BreathCounter count={5} maxCount={50} />);
      expect(screen.getByText('/ 50')).toBeInTheDocument();
      expect(screen.queryByText('/ 10')).not.toBeInTheDocument();
    });

    it('should handle position prop changes', () => {
      const { rerender } = render(<BreathCounter count={5} position="overlay" />);
      expect(screen.getByRole('status')).toHaveClass('breath-counter--overlay');
      
      rerender(<BreathCounter count={5} position="controls" />);
      expect(screen.getByRole('status')).toHaveClass('breath-counter--controls');
      expect(screen.getByRole('status')).not.toHaveClass('breath-counter--overlay');
    });

    it('should handle size prop changes', () => {
      const { rerender } = render(<BreathCounter count={5} size="small" />);
      expect(screen.getByRole('status')).toHaveClass('breath-counter--small');
      
      rerender(<BreathCounter count={5} size="large" />);
      expect(screen.getByRole('status')).toHaveClass('breath-counter--large');
      expect(screen.getByRole('status')).not.toHaveClass('breath-counter--small');
    });

    it('should handle className prop changes', () => {
      const { rerender } = render(<BreathCounter count={5} className="initial" />);
      expect(screen.getByRole('status')).toHaveClass('initial');
      
      rerender(<BreathCounter count={5} className="updated" />);
      expect(screen.getByRole('status')).toHaveClass('updated');
      expect(screen.getByRole('status')).not.toHaveClass('initial');
    });
  });

  describe('edge cases', () => {
    it('should handle count of 0', () => {
      render(<BreathCounter count={0} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Breathing cycle counter: 0 of 21');
    });

    it('should handle negative count values', () => {
      render(<BreathCounter count={-5} />);
      
      expect(screen.getByText('-5')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Breathing cycle counter: -5 of 21');
    });

    it('should handle very large count values', () => {
      render(<BreathCounter count={999999} maxCount={1000000} />);
      
      expect(screen.getByText('999999')).toBeInTheDocument();
      expect(screen.getByText('/ 1000000')).toBeInTheDocument();
    });

    it('should handle maxCount of 0', () => {
      render(<BreathCounter count={0} maxCount={0} />);
      
      expect(screen.getByText('/ 0')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Breathing cycle counter: 0 of 0');
    });

    it('should handle empty className', () => {
      render(<BreathCounter count={5} className="" />);
      
      const counter = screen.getByRole('status');
      expect(counter).toHaveClass('breath-counter');
      expect(counter).toHaveClass('breath-counter--overlay');
      // In test environment (desktop), medium size becomes large due to responsive logic
      expect(counter).toHaveClass('breath-counter--large');
    });

    it('should handle undefined optional props', () => {
      render(<BreathCounter count={5} />);
      
      const counter = screen.getByRole('status');
      expect(counter).toHaveClass('breath-counter--overlay'); // default position
      // In test environment (desktop), medium size becomes large due to responsive logic
      expect(counter).toHaveClass('breath-counter--large'); // responsive size for desktop
      expect(screen.getByText('/ 21')).toBeInTheDocument(); // default maxCount
    });
  });

  describe('responsive behavior', () => {
    it('should include viewport data attributes', () => {
      render(<BreathCounter count={5} />);
      
      const counter = screen.getByRole('status');
      expect(counter).toHaveAttribute('data-viewport-width');
      expect(counter).toHaveAttribute('data-viewport-height');
      expect(counter).toHaveAttribute('data-orientation');
    });

    it('should apply responsive positioning classes for overlay position', () => {
      render(<BreathCounter count={5} position="overlay" />);
      
      const counter = screen.getByRole('status');
      expect(counter).toHaveClass('breath-counter--overlay');
      // In test environment, should get desktop positioning class
      expect(counter).toHaveClass('breath-counter--desktop');
    });

    it('should not apply positioning classes for controls position', () => {
      render(<BreathCounter count={5} position="controls" />);
      
      const counter = screen.getByRole('status');
      expect(counter).toHaveClass('breath-counter--controls');
      expect(counter).not.toHaveClass('breath-counter--desktop');
      expect(counter).not.toHaveClass('breath-counter--mobile');
    });

    it('should respect explicit size prop over responsive sizing', () => {
      render(<BreathCounter count={5} size="small" />);
      
      const counter = screen.getByRole('status');
      expect(counter).toHaveClass('breath-counter--small');
      expect(counter).not.toHaveClass('breath-counter--large');
    });
  });
});