import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Coin from './Coin';

describe('Coin', () => {
  it('should render with default props', () => {
    render(<Coin />);
    const coin = screen.getByAltText('gold coin');
    expect(coin).toBeInTheDocument();
    expect(coin).toHaveAttribute('src');
  });

  it('should render with custom size', () => {
    render(<Coin size="2em" />);
    const coin = screen.getByAltText('gold coin');
    expect(coin).toHaveStyle({ width: '2em', height: '2em' });
  });

  it('should apply coin-in-text class when useInText is true', () => {
    render(<Coin useInText />);
    const coin = screen.getByAltText('gold coin');
    expect(coin).toHaveClass('coin', 'coin-in-text');
  });

  it('should apply custom className', () => {
    render(<Coin className="custom-class" />);
    const coin = screen.getByAltText('gold coin');
    expect(coin).toHaveClass('coin', 'custom-class');
  });

  it('should use empty alt text when decorative is true', () => {
    const { container } = render(<Coin decorative />);
    const coin = container.querySelector('img');
    expect(coin).toHaveAttribute('alt', '');
  });

  it('should use descriptive alt text when decorative is false', () => {
    render(<Coin decorative={false} />);
    const coin = screen.getByAltText('gold coin');
    expect(coin).toBeInTheDocument();
  });

  it('should combine all classes correctly', () => {
    render(<Coin className="custom-class" useInText />);
    const coin = screen.getByAltText('gold coin');
    expect(coin).toHaveClass('coin', 'coin-in-text', 'custom-class');
  });
});
