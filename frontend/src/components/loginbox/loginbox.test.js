import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginBox from './loginbox';
import authService from '../../services/auth.service';
import { RolesContext } from '../../context/roles';

jest.mock('../../services/auth.service', () => ({
  isLoggedIn: jest.fn(),
  login: jest.fn(),
  navigateByRole: jest.fn(),
}));

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom')),
  useNavigate: () => mockedUsedNavigate,
}))

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <RolesContext.Provider value={providerProps}>{ui}</RolesContext.Provider>,
    renderOptions
  );
};

describe('LoginBox', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls authService.login when login button is clicked', async () => {
    authService.isLoggedIn.mockReturnValue(false);
    authService.login.mockResolvedValueOnce('admin');

    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <LoginBox />
      </MemoryRouter>
    );

    fireEvent.change(getByPlaceholderText('Usuario'), { target: { value: 'testUser' } });
    fireEvent.change(getByPlaceholderText('Contraseña'), { target: { value: 'testPassword' } });

    await act(async () => {
      fireEvent.click(getByText('Iniciar sesion'));
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith({ username: 'testUser', password: 'testPassword' });
      });
    });
  });

  it("calls authService.navigateByRole when user is already logged in and context is provided", async () => {
    const mockedRolesContext = { role: 'mockedRole' };

    authService.isLoggedIn.mockReturnValue(true);

    customRender(<LoginBox />, { providerProps: mockedRolesContext });

    await waitFor(() => {
      expect(authService.navigateByRole).toHaveBeenCalledTimes(1);
      expect(authService.navigateByRole).toHaveBeenCalledWith('mockedRole', mockedUsedNavigate);
    });
  });
});