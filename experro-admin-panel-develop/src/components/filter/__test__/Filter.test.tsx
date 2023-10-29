import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import Filter from '../filter';

const mockChangeFn = jest.fn();
jest.mock('../filter-controller', () => () => {
  return {
    filterText: 'Test',
    onInputChange: mockChangeFn,
    t: jest.fn(),
  };
});

describe('Filter', () => {
  it('Component render properly', () => {
    const onChangeFn = jest.fn();

    render(<Filter onChange={onChangeFn} />);

    const textElement = screen.getByRole('textbox');
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveValue('Test');

    fireEvent.change(textElement, { target: { value: 'testing' } });
    expect(mockChangeFn).toBeCalled();
  });
});
