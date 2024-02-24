import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Headers from './headers';
import { BrowserRouter as Router } from 'react-router-dom';
import authService from '../../services/auth.service';

jest.mock('../../services/auth.service', () => ({
  logout: jest.fn().mockResolvedValue(),
}));

describe('Headers component', () => {
  it('renders correctly with title and menu items', () => {
    const { getByText } = render(
      <Router>
        <Headers title="Test Title" color="#ffffff" groupId="testGroupId" />
      </Router>
    );
    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Inicio')).toBeInTheDocument();
    expect(getByText('Perfil')).toBeInTheDocument();
    expect(getByText('Chat de grupo')).toBeInTheDocument();
    expect(getByText('Cerrar Sesión')).toBeInTheDocument();
  });

  // it('navigates correctly on menu item click', () => {
  //   const { getByText } = render(
  //     <Router>
  //       <Headers title="Test Title" color="#ffffff" groupId="testGroupId" />
  //     </Router>
  //   );

  //   fireEvent.click(getByText('Perfil'));
  //   expect(window.location.pathname).toBe('/myUser');

  //   fireEvent.click(getByText('Cerrar Sesión'));
  //   const confirmButton = getByText('Confirmar');
  //   fireEvent.click(confirmButton);
  //   expect(authService.logout).toHaveBeenCalled();
  // });
});
