import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Add from './Add';
import { useNavigate } from "react-router-dom";

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom')),
  useNavigate: () => mockedUsedNavigate,
}))

const navigate = useNavigate();

describe('Add component', () => {


  test('renders with image icon', () => {
    const altText = 'Add icon';
    const link = '/example-link';

    const { getByAltText } = render(<Add alt={altText} link={link} />);

    const imageIcon = getByAltText(altText);
    expect(imageIcon).toBeInTheDocument();
  });

  test('navigates on click', () => {
    const altText = 'Add icon';
    const link = '/example-link';

    const { getByAltText } = render(<Add alt={altText} link={link} />);
    const imageIcon = getByAltText(altText);

    fireEvent.click(imageIcon);

    expect(navigate).toHaveBeenCalledWith(link);
  });

  test('renders with custom colors and svg icon', () => {
    const link = '/example-link';
    const colors = {
      background: 'blue',
      text: 'white'
    };

    const { container } = render(<Add link={link} colors={colors} />);

    const customIcon = container.querySelector('.add-icon-component');
    expect(customIcon).toHaveStyle('background: blue');
    expect(customIcon).toHaveStyle('color: white');
  });

});