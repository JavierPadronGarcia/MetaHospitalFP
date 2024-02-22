import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Menu from './menu';

describe('Menu component', () => {
  test('renders Menu component correctly', () => {
    const { getByText, getByRole } = render(
      <Router>
        <Menu />
      </Router>
    );

    const logo = getByRole('img', { name: /logotype/i });
    expect(logo).toBeInTheDocument();

    const inicioLink = getByText(/inicio/i);
    expect(inicioLink).toBeInTheDocument();

    const usuariosLink = getByText(/usuarios/i);
    expect(usuariosLink).toBeInTheDocument();

    const escuelasLink = getByText(/escuelas/i);
    expect(escuelasLink).toBeInTheDocument();

    const moreOptionsButton = getByText(/más opciones/i);
    expect(moreOptionsButton).toBeInTheDocument();
  });
});

