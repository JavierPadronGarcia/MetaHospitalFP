import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminSchool from './adminschool';

jest.mock('../../../components/FloatingMenu/FloatingMenu', () => () => <div data-testid="floating-menu" />);

describe('AdminHome component', () => {
  beforeAll(() => {
    window.localStorage.setItem('schoolName', 'testSchool');
  });


  test('renders correctly', () => {
    const { getByText, getByAltText } = render(
      <MemoryRouter>
        <AdminSchool />
      </MemoryRouter>
    );

    expect(getByText('testSchool')).toBeInTheDocument();

    expect(getByAltText('Estudiantes')).toBeInTheDocument();
    expect(getByAltText('Profesores')).toBeInTheDocument();
    expect(getByAltText('Grupos')).toBeInTheDocument();
    expect(getByAltText('Cursos')).toBeInTheDocument();
  });
});
