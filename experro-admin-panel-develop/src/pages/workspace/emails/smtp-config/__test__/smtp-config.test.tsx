import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithClient } from '../../../../../test';
import SmtpConfig from '../smtp-config';

const mockSwitchValue = jest.fn().mockReturnValue(null);
const mockIsSwitchDisableModalVisible = jest.fn().mockReturnValue(null);
const mockOnSwitchChange = jest.fn();

const mockOnDisableSmtpData = jest.fn();
const mockOnSmtpData = jest.fn();
const mockOnHideDisableSwitchButton = jest.fn();

const mockIsAuthenticationSwitch = jest.fn().mockReturnValue(null);
const mockOnAuthenticationSwitchChange = jest.fn();
const mockGetSmtpEmails = jest.fn().mockReturnValue(null);

const mockPermission = jest.fn().mockReturnValue(null);
const mockOnValueChange = jest.fn();
const mockIsSaveButtonVisible = jest.fn().mockReturnValue(null);
const mockCanUpdateEmailTemplatesSmtp = jest.fn().mockReturnValue(null);

jest.mock('../smtp-config-controller', () => () => ({
  t: (name: string) => name,
  switchValue: mockSwitchValue(),
  isSwitchDisableModalVisible: mockIsSwitchDisableModalVisible(),
  onSwitchChange: mockOnSwitchChange,
  onDisableSmtpData: mockOnDisableSmtpData,
  onSmtpData: mockOnSmtpData,
  onHideDisableSwitchButton: mockOnHideDisableSwitchButton,
  isAuthenticationSwitch: mockIsAuthenticationSwitch(),
  onAuthenticationSwitchChange: mockOnAuthenticationSwitchChange,
  getSmtpEmails: mockGetSmtpEmails(),
  permission: mockPermission(),
  onValueChange: mockOnValueChange,
  isSaveButtonVisible: mockIsSaveButtonVisible(),
}));

describe('phrases emails', () => {
  beforeEach(() => {
    mockGetSmtpEmails.mockReturnValue({
      data: {
        id: 'test1',
        isSmtpEnable: true,
        fromName: 'Testing',
        fromEmail: 'testing@test.com',
        smtpHost: 'testing.host.com',
        smtpPort: '80',
        isAuthenticationEnable: true,
        encryptionType: 'SSL',
        smtpUsername: 'testing',
        smtpPassword: 'test@1234',
      },
    });
    mockPermission.mockReturnValue({
      canUpdateEmailTemplatesSmtp: mockCanUpdateEmailTemplatesSmtp,
      canReadEmailTemplatesSmtp: jest.fn().mockReturnValue(true),
    });
    mockIsSaveButtonVisible.mockReturnValue(false);
  });

  it('render properly and switch working properly', () => {
    mockSwitchValue.mockReturnValue(false);
    mockIsAuthenticationSwitch.mockReturnValue(false);

    mockCanUpdateEmailTemplatesSmtp.mockReturnValue(true);
    mockIsSwitchDisableModalVisible.mockReturnValue(false);

    renderWithClient(<SmtpConfig />);

    const switchButton = screen.getByRole('switch');
    expect(switchButton).toBeInTheDocument();

    const headingText = screen.getByText('common.labels.use_personal_smtp');
    expect(headingText).toBeInTheDocument();

    const subHeadingText = screen.getByText(
      'common.labels.use_personal_smtp_subtitle'
    );
    expect(subHeadingText).toBeInTheDocument();

    userEvent.click(switchButton);

    expect(mockOnSwitchChange).toBeCalled();
  });

  it('form render properly after switch enabled', () => {
    mockSwitchValue.mockReturnValue(true);
    mockIsAuthenticationSwitch.mockReturnValue(false);

    mockCanUpdateEmailTemplatesSmtp.mockReturnValue(true);
    mockIsSwitchDisableModalVisible.mockReturnValue(false);

    renderWithClient(<SmtpConfig />);

    const fromNameLabel = screen.getByText('common.labels.form_name');
    expect(fromNameLabel).toBeInTheDocument();

    const fromNameTextbox = screen.getByPlaceholderText(
      'common.labels.enter_name'
    );
    expect(fromNameTextbox).toBeInTheDocument();

    const fromEmailLabel = screen.getByText('common.labels.form_email');
    expect(fromEmailLabel).toBeInTheDocument();

    const fromEmailTextbox = screen.getByPlaceholderText(
      'common.labels.enter_email'
    );
    expect(fromEmailTextbox).toBeInTheDocument();

    const smtpHostLabel = screen.getByText('common.labels.smtp_host');
    expect(smtpHostLabel).toBeInTheDocument();

    const smtpHostTextbox = screen.getByPlaceholderText(
      'common.labels.enter_host'
    );
    expect(smtpHostTextbox).toBeInTheDocument();

    const smtpPortLabel = screen.getByText('common.labels.smtp_port');
    expect(smtpPortLabel).toBeInTheDocument();

    const smtpPortTextbox = screen.getByPlaceholderText(
      'common.labels.enter_port'
    );
    expect(smtpPortTextbox).toBeInTheDocument();

    const encryptionLabel = screen.getByText('common.labels.Encryption');
    expect(encryptionLabel).toBeInTheDocument();

    const noneEncryptionOption = screen.getByText('common.labels.none');
    expect(noneEncryptionOption).toBeInTheDocument();

    const sslEncryptionOption = screen.getByText('common.labels.ssl');
    expect(sslEncryptionOption).toBeInTheDocument();

    const tlsEncryptionOption = screen.getByText('common.labels.tls');
    expect(tlsEncryptionOption).toBeInTheDocument();

    const authenticationLabel = screen.getByText(
      'common.labels.authentication'
    );
    expect(authenticationLabel).toBeInTheDocument();

    const switchAuthenticationButton = screen.getAllByRole('switch')[1];
    expect(switchAuthenticationButton).toBeInTheDocument();

    expect(switchAuthenticationButton.id).toBe(
      'smtp-form_isAuthenticationEnable'
    );

    userEvent.click(switchAuthenticationButton);

    expect(mockOnAuthenticationSwitchChange).toBeCalled();
  });

  it('authentication form render properly after authentication switch enabled', () => {
    mockSwitchValue.mockReturnValue(true);
    mockIsAuthenticationSwitch.mockReturnValue(true);

    mockCanUpdateEmailTemplatesSmtp.mockReturnValue(true);
    mockIsSwitchDisableModalVisible.mockReturnValue(false);

    renderWithClient(<SmtpConfig />);

    const smtpUsernameLabel = screen.getByText('common.labels.smtp_user_name');
    expect(smtpUsernameLabel).toBeInTheDocument();

    const smtpUsernameTextbox = screen.getByPlaceholderText(
      'common.labels.enter_user_name'
    );
    expect(smtpUsernameTextbox).toBeInTheDocument();

    const smtpPasswordLabel = screen.getByText('common.labels.smtp_password');
    expect(smtpPasswordLabel).toBeInTheDocument();

    const smtpPasswordTextbox = screen.getByPlaceholderText(
      'common.labels.enter_password'
    );
    expect(smtpPasswordTextbox).toBeInTheDocument();

    const saveButton = screen.getByRole('button', {
      name: 'common.labels.save',
    });
    expect(saveButton).toBeInTheDocument();
  });

  it('render properly wihtout update permission', () => {
    mockSwitchValue.mockReturnValue(false);
    mockIsAuthenticationSwitch.mockReturnValue(false);

    mockCanUpdateEmailTemplatesSmtp.mockReturnValue(false);
    mockIsSwitchDisableModalVisible.mockReturnValue(false);

    renderWithClient(<SmtpConfig />);

    const switchButton = screen.getByRole('switch');

    userEvent.click(switchButton);

    expect(mockOnSwitchChange).toBeCalled();
  });

  it('dialog render properly and ok button working properly', () => {
    mockSwitchValue.mockReturnValue(false);
    mockIsAuthenticationSwitch.mockReturnValue(false);

    mockCanUpdateEmailTemplatesSmtp.mockReturnValue(false);
    mockIsSwitchDisableModalVisible.mockReturnValue(true);

    renderWithClient(<SmtpConfig />);

    const smtpDialog = screen.getByRole('dialog');
    expect(smtpDialog).toBeInTheDocument();

    const dialogTitle = screen.getByText('common.labels.disable_smtp');
    expect(dialogTitle).toBeInTheDocument();

    const dialogDescription = screen.getByText(
      'common.labels.smtp_disable_modal_message'
    );
    expect(dialogDescription).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();

    const disableButton = screen.getByText('common.labels.disable');
    expect(disableButton).toBeInTheDocument();

    fireEvent.click(disableButton);

    expect(mockOnDisableSmtpData).toBeCalled();
  });

  it('dialog cancel button working properly', () => {
    mockSwitchValue.mockReturnValue(false);
    mockIsAuthenticationSwitch.mockReturnValue(false);

    mockCanUpdateEmailTemplatesSmtp.mockReturnValue(false);
    mockIsSwitchDisableModalVisible.mockReturnValue(true);

    renderWithClient(<SmtpConfig />);

    const cancelButton = screen.getByText('Cancel');

    fireEvent.click(cancelButton);

    expect(mockOnHideDisableSwitchButton).toBeCalled();
  });

  it('save button clicked', async () => {
    mockSwitchValue.mockReturnValue(true);
    mockIsAuthenticationSwitch.mockReturnValue(true);

    mockCanUpdateEmailTemplatesSmtp.mockReturnValue(true);
    mockIsSwitchDisableModalVisible.mockReturnValue(false);

    renderWithClient(<SmtpConfig />);

    const saveButton = screen.getByRole('button', {
      name: 'common.labels.save',
    });

    fireEvent.click(saveButton);

    await waitFor(() => expect(mockOnSmtpData).toBeCalled());
  });

  it('on value change working properly', () => {
    mockSwitchValue.mockReturnValue(true);
    mockIsAuthenticationSwitch.mockReturnValue(true);

    mockCanUpdateEmailTemplatesSmtp.mockReturnValue(true);
    mockIsSwitchDisableModalVisible.mockReturnValue(false);

    renderWithClient(<SmtpConfig />);

    const fromNameTextbox = screen.getByPlaceholderText(
      'common.labels.enter_name'
    );

    userEvent.type(fromNameTextbox, 'Testing');

    expect(mockOnValueChange).toBeCalled();
  });
});
