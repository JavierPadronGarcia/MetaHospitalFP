import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminHome from './adminhome';

describe('AdminHome component', () => {
  test('renders correctly', () => {
    const { getByText, getByAltText } = render(
      <MemoryRouter>
        <AdminHome />
      </MemoryRouter>
    );

    expect(getByText('Bienvenido Admin')).toBeInTheDocument();

    expect(getByAltText('Usuarios')).toBeInTheDocument();
    expect(getByAltText('Escuelas')).toBeInTheDocument();
  });
});
