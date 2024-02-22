import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CardUnits from './cardunits';
import { useNavigate } from "react-router-dom";

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom')),
  useNavigate: () => mockedUsedNavigate,
}))

let localStorageMock = {};
const localStorageSpy = jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation((key, value) => {
  localStorageMock[key] = value;
});

const navigate = useNavigate();

describe('CardUnits component', () => {

  afterEach(() => {
    localStorageSpy.mockClear();
  });

  it('calls navigate when clicked', () => {

    const { container } = render(
      <CardUnits title="Test Title" color="blue" route="/test-route" />
    );

    fireEvent.click(container.firstChild);
    expect(navigate).toHaveBeenCalledWith('/test-route');
  });

  it('stores actualWorkUnit in localStorage if workUnit prop is provided', () => {
    const { container } = render(
      <CardUnits title="Test Title" color="blue" route="/test-route" workUnit={{ id: 123, name: 'Work Unit' }} />
    );

    fireEvent.click(container.firstChild);
    expect(localStorageSpy).toHaveBeenCalledWith('actualWorkUnit', JSON.stringify({ id: 123, name: 'Work Unit' }));
  });
});
