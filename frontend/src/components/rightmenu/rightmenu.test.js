import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Rightmenu from './rightmenu';

// Mock de las funciones cancel y onSubmit
const mockCancel = jest.fn();
const mockSubmit = jest.fn();

// Función de renderImputs mock
const renderInputsMock = jest.fn(() => <input />);

test('renders Rightmenu component correctly', () => {
  const { getByText, getByAltText, container } = render(
    <Rightmenu renderImputs={renderInputsMock} cancel={mockCancel} onSubmit={mockSubmit} mode="ADD" currentRoute="/admin/control-panel" />
  );

  const icon = getByAltText('decoration');
  expect(icon).toBeInTheDocument();

  const inputsElement = container.querySelector('.inputs');
  expect(inputsElement).toBeInTheDocument();

  const submitButton = container.querySelector('.submit-button');
  expect(submitButton).toBeInTheDocument();

  expect(mockCancel).not.toHaveBeenCalled();

  fireEvent.click(submitButton);
  expect(mockSubmit).toHaveBeenCalled();


  const cancelButton = getByText('Cancelar');
  fireEvent.click(cancelButton);
  expect(mockCancel).toHaveBeenCalled();
});
