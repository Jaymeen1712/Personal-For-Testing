import {fireEvent, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithClient} from '../../../../../../test';
import CreateUpdateTemplates from '../create-update-templates';

const mockGetEmailTemplate = jest.fn().mockReturnValue(null);
const mockGetAllEnvironments = jest.fn().mockReturnValue(null);
const mockOnBackButtonClick = jest.fn();
const mockOnFinish = jest.fn();
const mockOnHideSendTestEmailModal = jest.fn();
const mockOnSendTestEmail = jest.fn();
const mockIsSendEmailModalVisible = jest.fn().mockReturnValue(null);
const mockSelectedTemplateIdForSendEmail = jest.fn().mockReturnValue(null);
const mockOnTextAreaChange = jest.fn();
const mockHtmlData = jest.fn().mockReturnValue(null);
const mockOnSubjectChange = jest.fn();
const mockSubjectData = jest.fn().mockReturnValue(null);
const mockPermission = jest.fn().mockReturnValue(null);

jest.mock('../create-update-templates-emails-controller', () => () => ({
  t: (name: string) => name,
  getEmailTemplate: mockGetEmailTemplate(),
  getAllEnvironments: mockGetAllEnvironments(),
  onBackButtonClick: mockOnBackButtonClick,
  onFinish: mockOnFinish,
  onHideSendTestEmailModal: mockOnHideSendTestEmailModal,
  onSendTestEmail: mockOnSendTestEmail,
  isSendEmailModalVisible: mockIsSendEmailModalVisible(),
  selectedTemplateIdForSendEmail: mockSelectedTemplateIdForSendEmail(),
  onTextAreaChange: mockOnTextAreaChange,
  htmlData: mockHtmlData(),
  onSubjectChange: mockOnSubjectChange,
  subjectData: mockSubjectData(),
  permission: mockPermission(),
}));

describe('create update email templates', () => {
  beforeEach(() => {
    mockGetEmailTemplate.mockReturnValue({
      data: {
        id: 'test1',
        masterTemplateName: 'Master Template',
        name: 'Template',
        htmlContent: '<html><body>Test</body></html>',
        subject: 'Template',
      },
    });
    mockGetAllEnvironments.mockReturnValue({
      data: [
        {
          id: 'dev1',
          title: 'Development',
        },
        {
          id: 'prod1',
          title: 'Production',
        },
      ],
    });
    mockPermission.mockReturnValue({
      canUpdateEmailTemplatesTemplate: jest.fn().mockReturnValue(true),
    });
    mockSubjectData.mockReturnValue('Template');
  });

  it('render properly', () => {
    mockIsSendEmailModalVisible.mockReturnValue(false);
    mockSelectedTemplateIdForSendEmail.mockReturnValue('');
    mockHtmlData.mockReturnValue('<html><body>Test</body></html>');

    const {container} = renderWithClient(<CreateUpdateTemplates/>);

    const backButton = container.getElementsByClassName('arrowleft-icon');
    expect(backButton).toHaveLength(0);

    const headingTitle = screen.getByText('common.labels.edit_template');
    expect(headingTitle).toBeInTheDocument();

    const sendTestMailButton = screen.getByText('common.labels.send_test_mail');
    expect(sendTestMailButton).toBeInTheDocument();

    const cancelButton = screen.getByText('common.labels.cancel');
    expect(cancelButton).toBeInTheDocument();

    const saveButton = screen.getByText('common.labels.save');
    expect(saveButton).toBeInTheDocument();

    const masterTemplateNameLabel = screen.getByText('common.labels.template');
    expect(masterTemplateNameLabel).toBeInTheDocument();

    const masterTemplateNameTextbox =
      screen.getByDisplayValue('Master Template');
    expect(masterTemplateNameTextbox).toBeInTheDocument();

    const nameLabel = screen.getByText('common.labels.name');
    expect(nameLabel).toBeInTheDocument();

    const nameTextbox = screen.getByDisplayValue('Template');
    expect(nameTextbox).toBeInTheDocument();

    const assignedToDropdown = screen.getByRole('combobox');
    expect(assignedToDropdown).toBeInTheDocument();

    const assignedToTooltip = screen.getByRole('img');
    expect(assignedToTooltip).toHaveClass('anticon-question-circle');
    expect(assignedToTooltip).toBeInTheDocument();

    const emailTabs = screen.getByRole('tablist');
    expect(emailTabs).toBeInTheDocument();

    const previewTab = screen.getByRole('tab', {selected: true});
    expect(previewTab.id).toBe('rc-tabs-test-tab-preview');
    expect(previewTab).toBeInTheDocument();

    const previewSubjectLabel = screen.getByText('Subject:');
    expect(previewSubjectLabel).toBeInTheDocument();

    const previewSubjectDataLabel = screen.getByText('Template');
    expect(previewSubjectDataLabel).toBeInTheDocument();

    const emailPreviewContent = screen.getByText('Test');
    expect(emailPreviewContent).toBeInTheDocument();

    const codeTab = screen.getByRole('tab', {selected: false});
    expect(codeTab.id).toBe('rc-tabs-test-tab-code');
    expect(codeTab).toBeInTheDocument();

    fireEvent.click(codeTab);

    const codeSubjectLabel = screen.getByText('common.labels.subject');
    expect(codeSubjectLabel).toBeInTheDocument();

    const codeSubjectTextbox = screen.getByPlaceholderText(
      'common.labels.subject'
    );
    expect(codeSubjectTextbox).toBeInTheDocument();

    const codeContentLabel = screen.getByText('common.labels.content');
    expect(codeContentLabel).toBeInTheDocument();

    const codeContentEditor = container.getElementsByClassName('cm-theme')[0];
    expect(codeContentEditor).toBeInTheDocument();
    expect(codeContentEditor.id).toBe(
      'create-update-template-form_htmlContent'
    );
  });

  it('back button working properly', () => {
    const {container} = renderWithClient(<CreateUpdateTemplates/>);

    const backButton = container.getElementsByClassName('hamburgericon')[0];

    fireEvent.click(backButton);
    expect(mockOnBackButtonClick).toBeCalled();
  });

  it('send test email button working properly', () => {
    renderWithClient(<CreateUpdateTemplates/>);

    const sendTestMailButton = screen.getByText('common.labels.send_test_mail');

    fireEvent.click(sendTestMailButton);
    expect(mockOnSendTestEmail).toBeCalled();
  });

  it('cancel button working properly', () => {
    renderWithClient(<CreateUpdateTemplates/>);

    const cancelButton = screen.getByText('common.labels.cancel');

    fireEvent.click(cancelButton);
    expect(mockOnBackButtonClick).toBeCalled();
  });

  it('save button working properly', async () => {
    renderWithClient(<CreateUpdateTemplates/>);

    const saveButton = screen.getByText('common.labels.save');

    fireEvent.click(saveButton);
    await waitFor(() => expect(mockOnFinish).toBeCalled());
  });

  it('name textbox working properly', () => {
    renderWithClient(<CreateUpdateTemplates/>);

    const nameTextbox = screen.getByDisplayValue('Template');

    userEvent.type(nameTextbox, '1');
    expect(nameTextbox).toHaveValue('Template1');
  });

  it('subject textbox in code tab working properly', () => {
    renderWithClient(<CreateUpdateTemplates/>);

    const codeTab = screen.getByRole('tab', {selected: false});
    fireEvent.click(codeTab);

    const codeSubjectTextbox = screen.getByPlaceholderText(
      'common.labels.subject'
    );
    expect(codeSubjectTextbox).toHaveValue('Template');

    userEvent.type(codeSubjectTextbox, '1');

    expect(codeSubjectTextbox).toHaveValue('Template1');
    expect(mockOnSubjectChange).toBeCalled();
  });

  it('content editor in code tab working properly', () => {
    const {container} = renderWithClient(<CreateUpdateTemplates/>);

    const codeTab = screen.getByRole('tab', {selected: false});
    fireEvent.click(codeTab);

    const codeContentEditor = container.getElementsByClassName('cm-activeLine')[0];

    userEvent.type(codeContentEditor, 'Testing');
    expect(mockOnTextAreaChange).toBeCalled();
  });
});
