import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';

test('renders Flight Search Engine header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Flight Search Engine/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders sidebar and main content', () => {
  render(<App />);
  const sidebarElement = screen.getByRole('complementary');
  const mainContentElement = screen.getByRole('main');
  expect(sidebarElement).toBeInTheDocument();
  expect(mainContentElement).toBeInTheDocument();
});

test('handles search and filters correctly', () => {
  render(<App />);

  const searchButton = screen.getByRole('button', { name: /Search/i });

  fireEvent.click(searchButton);

  const searchResults = screen.getByTestId('search-results');
  expect(searchResults).toBeInTheDocument();

});