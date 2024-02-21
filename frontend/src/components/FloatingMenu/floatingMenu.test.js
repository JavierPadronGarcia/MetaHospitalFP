import React from 'react';
import { render } from '@testing-library/react';
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
    const { getByText } = render(<FloatingMenu />);
    expect(getByText('Ver')).toBeInTheDocument();
    expect(getByText('Enviar por email')).toBeInTheDocument();
  });

});