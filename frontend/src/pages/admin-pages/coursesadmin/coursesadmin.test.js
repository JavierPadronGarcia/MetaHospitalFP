import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import CoursesAdmin from './coursesadmin';
import { MemoryRouter } from 'react-router-dom';
import CoursesService from '../../../services/courses.service';

jest.mock('../../../services/courses.service', () => ({
  getCourses: jest.fn(() => Promise.resolve([])),
  deleteCourse: jest.fn(() => Promise.resolve()),
  updateCourse: jest.fn(() => Promise.resolve()),
  createNewCourse: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../components/FloatingMenu/FloatingMenu', () => () => <div data-testid="floating-menu" />);

describe('CoursesAdmin component', () => {
  test('renders correctly', async () => {
    const { container, getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <CoursesAdmin />
      </MemoryRouter>
    );

    const courseName = container.querySelector('.Tag>p');
    const name = container.querySelectorAll('.headlines')[0];
    const acronyms = container.querySelectorAll('.headlines')[1];

    expect(courseName.textContent).toContain('Cursos');
    expect(name).toBeInTheDocument();
    expect(acronyms).toBeInTheDocument();
    expect(name.textContent).toContain('Nombre');
    expect(acronyms.textContent).toContain('Acrónimo');

    expect(getByPlaceholderText('Nombre')).toBeInTheDocument();
    expect(getByPlaceholderText('Acrónimo')).toBeInTheDocument();

    expect(container).toMatchSnapshot('initialState');

    act(() => {
      fireEvent.change(getByPlaceholderText('Nombre'), { target: { value: 'Nuevo Curso' } });
      fireEvent.change(getByPlaceholderText('Acrónimo'), { target: { value: 'NC' } });
      fireEvent.click(getByText('Enviar'));
    })

    expect(CoursesService.createNewCourse).toHaveBeenCalledWith({ name: 'Nuevo Curso', acronyms: 'NC' });

    expect(container).toMatchSnapshot('finalState');
  });
});
