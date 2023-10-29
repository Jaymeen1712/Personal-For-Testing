import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithClient } from '../../../../../../test';
import SendTestEmail from '../sendTestEmail';

const mockIsSendTestEmailModalVisible = jest.fn().mockReturnValue(null);
const mockTemplateId = jest.fn().mockReturnValue(null);
const mockOnHideSendTestEmail = jest.fn();
const mockOnCloseSendTestEmail = jest.fn();
const mockSendTestEmail = jest.fn();
const mockOnSave = jest.fn();

jest.mock('../sendTestEmail-controller', () => () => ({
  t: (name: string) => name,
  onCloseSendTestEmail: mockOnCloseSendTestEmail,
  sendTestEmail: mockSendTestEmail(),
  onSave: mockOnSave,
}));

describe('send test email', () => {
  beforeEach(() => {
    mockSendTestEmail.mockReturnValue({ isLoading: false, data: true });
    mockIsSendTestEmailModalVisible.mockReturnValue(true);
    mockTemplateId.mockReturnValue('rs1');
  });

  it('render properly', () => {
    renderWithClient(
      <SendTestEmail
        isSendTestEmailModalVisible={mockIsSendTestEmailModalVisible()}
        onHideSendTestEmail={mockOnHideSendTestEmail}
        templateId={mockTemplateId()}
      />
    );

    const sendTestEmailDialog = screen.getByRole('dialog');
    expect(sendTestEmailDialog).toBeInTheDocument();

    const headingLabel = screen.getByText('common.labels.send_test_mail');
    expect(headingLabel).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toBeInTheDocument();

    const emailLabel = screen.getByText('common.labels.email');
    expect(emailLabel).toBeInTheDocument();

    const emailTextbox = screen.getByPlaceholderText(
      'common.labels.email_placeholder'
    );
    expect(emailTextbox).toBeInTheDocument();

    const cancelButton = screen.getByText('common.labels.cancel');
    expect(cancelButton).toBeInTheDocument();

    const sendButton = screen.getByText('common.labels.send');
    expect(sendButton).toBeInTheDocument();
  });

  it('close send test email dialog', () => {
    renderWithClient(
      <SendTestEmail
        isSendTestEmailModalVisible={mockIsSendTestEmailModalVisible()}
        onHideSendTestEmail={mockOnHideSendTestEmail}
        templateId={mockTemplateId()}
      />
    );

    const closeButton = screen.getByLabelText('Close');

    fireEvent.click(closeButton);

    expect(mockOnCloseSendTestEmail).toBeCalled();
  });

  it('cancel send test email dialog', () => {
    renderWithClient(
      <SendTestEmail
        isSendTestEmailModalVisible={mockIsSendTestEmailModalVisible()}
        onHideSendTestEmail={mockOnHideSendTestEmail}
        templateId={mockTemplateId()}
      />
    );

    const cancelButton = screen.getByText('common.labels.cancel');

    fireEvent.click(cancelButton);

    expect(mockOnCloseSendTestEmail).toBeCalled();
  });

  it('send test email with all data', () => {
    renderWithClient(
      <SendTestEmail
        isSendTestEmailModalVisible={mockIsSendTestEmailModalVisible()}
        onHideSendTestEmail={mockOnHideSendTestEmail}
        templateId={mockTemplateId()}
      />
    );

    const sendButton = screen.getByText('common.labels.send');
    const emailTextbox = screen.getByPlaceholderText(
      'common.labels.email_placeholder'
    );

    userEvent.type(emailTextbox, 'test@testing.com');

    fireEvent.click(sendButton);

    expect(mockOnSave).toBeCalled();
  });
});
