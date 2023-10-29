import React from 'react';
import { screen, render } from '@testing-library/react';

import ForgotPasswordEmail from '../forgot-password-email';

const mockRedirectToLogin = jest.fn();
const mockLocation = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    __esModule: true,
    useHistory: () => jest.fn(),
    useParams: () => ({}),
    useLocation: () => jest.fn().mockReturnValue(() => mockLocation())(),
  };
});

jest.mock('../forgot-password-email-controller', () => () => ({
  t: (name: string) => name,
  redirectToLogin: mockRedirectToLogin,
}));

describe('forgot password', () => {
  it('forgot password render successfully', () => {
    render(<ForgotPasswordEmail email="abc@gmail.com" />);

    const headingElement = screen.getByRole('heading');
    expect(headingElement).toBeInTheDocument();

    const buttonElement = screen.getByRole('button', {
      name: 'common.labels.return_to_login_forget_password',
    });
    expect(buttonElement).toBeInTheDocument();

    const footerParagraphElement = screen.getByText(
      'common.labels.check_spam_if_email_not_found'
    );
    expect(footerParagraphElement).toBeInTheDocument();
  });
});
