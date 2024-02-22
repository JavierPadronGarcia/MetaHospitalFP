import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Square from './square';
import { useNavigate } from "react-router-dom";

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom')),
  useNavigate: () => mockedUsedNavigate,
}))

const navigate = useNavigate();

describe("Square component", () => {

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(
      <Square
        icon="/path/to/icon.png"
        label="Test Label"
      />
    );

    expect(getByText("Test Label")).toBeInTheDocument();
  });

  it("navigates when clicked and route prop is provided", () => {

    const { getByText } = render(
      <Square
        icon="/path/to/icon.png"
        label="Test Label"
        route="/test-route"
      />
    );

    fireEvent.click(getByText("Test Label"));
    expect(navigate).toHaveBeenCalledWith("/test-route");
  });

  it("does not navigate when clicked and route prop is not provided", () => {

    const { getByText } = render(
      <Square icon="/path/to/icon.png" label="Test Label" />
    );

    fireEvent.click(getByText("Test Label"));
    expect(navigate).not.toHaveBeenCalled();
  });
});
