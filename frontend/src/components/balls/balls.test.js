import React from 'react';
import { render } from '@testing-library/react';
import Balls from './balls';

describe('Balls Component', () => {
  it('Renders correctly', () => {
    const { container } = render(<Balls />)
    expect(container.firstChild).toBeInTheDocument();
  });

  it('Renders with correct number of balls', () => {
    const { container } = render(<Balls />);
    expect(container.querySelectorAll('.ball >div').length).toBe(6);
  });

  it('Renders each ball with the correct class name', () => {
    const { container } = render(<Balls />);
    const balls = container.querySelectorAll('.ball > div');
    balls.forEach((ball, index) => {
      expect(ball).toHaveClass(`ball${index + 1}`);
    })
  });
});