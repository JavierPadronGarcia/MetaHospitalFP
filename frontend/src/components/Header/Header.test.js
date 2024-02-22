import React from 'react';
import { render } from '@testing-library/react';
import Header from './Header';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../../services/auth.service', () => ({
  logout: jest.fn().mockResolvedValue(),
}));

describe('Header component', () => {
  it('renders correctly with page name', () => {
    const { getByText } = render(
      <Router>
        <Header pageName="Test Page" />
      </Router>
    );
    expect(getByText('Test Page')).toBeInTheDocument();
  });
});
