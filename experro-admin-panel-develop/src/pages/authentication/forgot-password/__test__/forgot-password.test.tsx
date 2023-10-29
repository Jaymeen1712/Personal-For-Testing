import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import ForgotPassword from '../forgot-password';
import { renderWithClient } from '../../../../test';

const mockForgotPassword = jest.fn();
const mockOnFinish = jest.fn();

jest.mock('../forgot-password-controller', () => () => ({
  t: (name: string) => name,
  ForgotPassword: mockForgotPassword(),
  onFinish: mockOnFinish,
}));

describe('ForgotPassword', () => {
  const validateInputs = async () => {
    // const alertElement = screen.getAllByRole('alert');
    // expect(alertElement.length).toBe(1);
    // expect(alertElement[0].innerHTML).toBe(
    //   '<div class="ant-form-item-explain-error">common.messages.required</div>'
    // );

    // fireEvent.change(screen.getByRole('textbox', { name: 'will_inform_you' }), {
    //   target: { value: 'john@gmail.com' },
    // });

    await new Promise((r) => setTimeout(r, 50));
  };

  it('Forgot Password render properly', () => {
    const { container } = renderWithClient(<ForgotPassword />);
    const formElement = container.getElementsByClassName('ant-form');
    expect(formElement.length).toBe(1);
    const textboxElements = screen.getAllByRole('textbox');
    expect(textboxElements.length).toBe(1);
    expect(textboxElements[0].id).toBe('forgotPassword-form_email');
    const buttonElement = screen.getAllByRole('button');
    expect(buttonElement.length).toBe(1);
    expect(buttonElement[0].id).toBe('common.labels.reset_password');
  });

  it('Forgot Password validation', async () => {
    mockForgotPassword.mockReturnValue({
      data: {},
    });
    renderWithClient(<ForgotPassword />);
    const ResetButtonElement = screen.getByRole('button', {
      name: 'common.labels.reset_password',
    });

    expect(ResetButtonElement).toBeInTheDocument();
    fireEvent.submit(ResetButtonElement);

    await new Promise((r) => setTimeout(r, 50));
    await validateInputs();
  });
});
