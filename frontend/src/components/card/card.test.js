import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Card from './card';

describe('Card component', () => {
  it('renders card with title and content', () => {
    const { getByText } = render(
      <Card title="Test Title" content="Test Content" highlightColor="yellow" />
    );

    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('adds hovered class on mouse enter and removes on mouse leave', () => {
    const { getByTestId } = render(
      <Card title="Test Title" content="Test Content" highlightColor="yellow" />
    );

    const cardContainer = getByTestId('card-container');
    const card = getByTestId('card');

    fireEvent.mouseEnter(cardContainer);
    expect(card).toHaveClass('hovered');

    fireEvent.mouseLeave(cardContainer);
    expect(card).not.toHaveClass('hovered');
  });
});
