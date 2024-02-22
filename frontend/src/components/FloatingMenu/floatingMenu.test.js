import React from 'react';
import { fireEvent, render, act } from '@testing-library/react';
import FloatingMenu from './FloatingMenu';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/admin/schools'
  })
}));

jest.mock('../../services/jsreport.service', () => ({
  SchoolsReportView: jest.fn(),
  downloadSchoolsReport: jest.fn(),
  UsersReportView: jest.fn(),
  downloadUsersReport: jest.fn(),
  CoursesReportView: jest.fn(),
  downloadCoursesReport: jest.fn(),
  sendReportByEmail: jest.fn()
}));

describe('FloatingMenu component', () => {
  it('renders correctly', () => {
    const { getByText, container } = render(<FloatingMenu />);

    const dropdownButton = container.querySelector('.floating-menu');
    act(() => {
      fireEvent.click(dropdownButton);
    });
    expect(getByText('Ver')).toBeInTheDocument();
    expect(getByText('Enviar por email')).toBeInTheDocument();
    expect(getByText('Descargar')).toBeInTheDocument();
  });
});