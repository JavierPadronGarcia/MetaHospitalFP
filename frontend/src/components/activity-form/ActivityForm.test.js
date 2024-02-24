import React from 'react';
import { render } from '@testing-library/react';
import ActivityForm from './ActivityForm';

describe('ActivityForm component', () => {

  beforeAll(() => {
    const colors = { primaryColor: 'blue', text: 'white' };
    const colorsString = JSON.stringify(colors);
    sessionStorage.setItem('colors', colorsString);
  });

  test('add form renders correctly', () => {

    const props = {
      groupId: 'groupIdValue',
      workUnitId: 'workUnitIdValue',
      isUpdateForm: false,
      updateFormContent: {
        case: { id: 'caseIdValue', name: 'Case Name' },
        assigned: true,
        date: new Date()
      },
      notifyUpdateInfo: jest.fn()
    };

    const { container, getByText, getByPlaceholderText } = render(<ActivityForm {...props} />);

    const addButton = container.querySelector('.buttons>button');
    const selectCaseLabel = getByText('Selecciona un caso');
    const selectStudentsLabel = getByText('Selecciona alumnos');
    const datePickerLabel = getByPlaceholderText('fecha de finalización');

    expect(addButton).toBeInTheDocument();
    expect(selectCaseLabel).toBeInTheDocument();
    expect(selectStudentsLabel).toBeInTheDocument();
    expect(datePickerLabel).toBeInTheDocument();
  });

  test('update form renders correctly', () => {

    const props = {
      groupId: 'groupIdValue',
      workUnitId: 'workUnitIdValue',
      isUpdateForm: true,
      updateFormContent: {
        case: { id: 'caseIdValue', name: 'Case Name' },
        assigned: true,
        date: new Date()
      },
      notifyUpdateInfo: jest.fn()
    };

    const { container, getByText, getByPlaceholderText } = render(<ActivityForm {...props} />);

    const updateButton = container.querySelector('.buttons>button');
    const selectCaseLabel = getByText('Selecciona un caso');
    const selectStudentsLabel = getByText('Selecciona alumnos');
    const datePickerLabel = getByPlaceholderText('fecha de finalización');

    expect(updateButton).toBeInTheDocument();
    expect(selectCaseLabel).toBeInTheDocument();
    expect(selectStudentsLabel).toBeInTheDocument();
    expect(datePickerLabel).toBeInTheDocument();
  });
});
