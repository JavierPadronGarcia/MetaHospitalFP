import React from 'react';
import { render } from '@testing-library/react';
import PopForm from './popform';

const mockCancel = jest.fn();
const mockSubmit = jest.fn();

const renderInputsMock = jest.fn(() => <input />);

test('renders PopForm component correctly', () => {
  const { container } = render(
    <PopForm renderInputs={renderInputsMock} cancel={mockCancel} onSubmit={mockSubmit} showModalAutomatically={false} />
  );

  const floatingButton = container.querySelector('.floating-button');
  expect(floatingButton).toBeInTheDocument();
});
