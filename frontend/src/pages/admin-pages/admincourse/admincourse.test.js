import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminCourse from './admincourse';

describe('AdminCourse component', () => {
  test('renders correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <AdminCourse />
      </MemoryRouter>
    );

    const teacherH2 = container.querySelectorAll('.list-titles')[0];
    const studentsH2 = container.querySelectorAll('.list-titles')[1];

    expect(teacherH2).toBeInTheDocument();
    expect(studentsH2).toBeInTheDocument();

    expect(teacherH2.textContent).toContain('Profesores');
    expect(studentsH2.textContent).toContain('Estudiantes');
  });
});
