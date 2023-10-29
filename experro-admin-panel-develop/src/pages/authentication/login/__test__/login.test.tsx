import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import Login from '../login';
import { renderWithClient } from '../../../../test';

const mockLogin = jest.fn();
const mockOnFinish = jest.fn();

jest.mock('../login-controller', () => () => ({
  t: (name: string) => name,
  Login: mockLogin(),
  onFinish: mockOnFinish,
}));

describe('Login', () => {
  it('login render properly', () => {
    renderWithClient(<Login />);

    const textboxElements = screen.getAllByRole('textbox');
    // expect(textboxElements.length).toBe(2);
    expect(textboxElements.length).toBe(1);
    expect(textboxElements[0].id).toBe('login-form_username');
    // expect(textboxElements[1].id).toBe('login-form_password');
    const buttonElements = screen.getAllByRole('button');
    expect(buttonElements.length).toBe(1);
    expect(buttonElements[0].id).toBe('common.labels.submit');
  });

  it('login validation', async () => {
    mockLogin.mockReturnValue(() => ({}));
    renderWithClient(<Login />);
    const submitButtonElement = screen.getByRole('button', {
      name: 'common.labels.sign_in',
    });
    expect(submitButtonElement).toBeInTheDocument();

    fireEvent.submit(submitButtonElement);

    await new Promise((r) => setTimeout(r, 50));
  });
});
