import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Menu2 from './menu2';

test('renders Menu2 component correctly', () => {
  const { getByText, getByRole } = render(
    <Router>
      <Menu2 />
    </Router>
  );

  const logo = getByRole('img', { name: /logotype/i });
  expect(logo).toBeInTheDocument();

  const homeLink = getByText(/inicio/i);
  expect(homeLink).toBeInTheDocument();

  const studentsLink = getByText(/estudiantes/i);
  expect(studentsLink).toBeInTheDocument();

  const teachersLink = getByText(/profesores/i);
  expect(teachersLink).toBeInTheDocument();

  const groupLink = getByText(/grupos/i);
  expect(groupLink).toBeInTheDocument();

  const coursesLink = getByText(/cursos/i);
  expect(coursesLink).toBeInTheDocument();
});
