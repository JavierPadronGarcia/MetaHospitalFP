import React from 'react';
import { render } from '@testing-library/react';
import Tag from './tag';

test('renders Tag component with name and color', () => {
  const name = 'Example Tag';
  const color = 'red';

  const { container } = render(<Tag name={name} color={color} />);

  const nameElement = container.querySelector('.Tag>p');
  expect(nameElement).toBeInTheDocument();

  const tagElement = container.querySelector('.Tag');
  expect(tagElement).toHaveStyle('background-color: red');
});