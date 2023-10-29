// eslint-disable-next-line
import React from 'react';
// import { screen } from '@testing-library/react';
// import { renderWithClient } from '../../../../../test';
// import ListEmails from '../list-emails';

// const mockCanReadEmailTemplatesTemplate = jest.fn();
// const mockCanReadEmailTemplatesSmtp = jest.fn();

const mockDefaultActiveKey = jest.fn();
const mockOnTabChange = jest.fn();
const mockPermissions = jest.fn();

jest.mock('../list-emails-controller', () => () => ({
  t: (name: string) => name,
  defaultActiveKey: mockDefaultActiveKey(),
  onTabChange: mockOnTabChange,
  permissions: mockPermissions(),
}));

describe('list emails', () => {
  it('render properly', () => {
    // mockPermissions.mockReturnValue({
    //   canReadEmailTemplatesTemplate:
    //     mockCanReadEmailTemplatesTemplate.mockReturnValue(true),
    //   canReadEmailTemplatesSmtp:
    //     mockCanReadEmailTemplatesSmtp.mockReturnValue(true),
    // });
    // mockDefaultActiveKey.mockReturnValue('templates');
    //
    // renderWithClient(<ListEmails />);
    //
    // const emailTabs = screen.getByRole('tablist');
    // expect(emailTabs).toBeInTheDocument();
  });

  // it('render properly with templates permission', () => {
  //   mockPermissions.mockReturnValue({
  //     canReadEmailTemplatesTemplate:
  //       mockCanReadEmailTemplatesTemplate.mockReturnValue(true),
  //     canReadEmailTemplatesSmtp:
  //       mockCanReadEmailTemplatesSmtp.mockReturnValue(true),
  //   });
  //   mockDefaultActiveKey.mockReturnValue('templates');
  //
  //   renderWithClient(<ListEmails />);
  //
  //   const emailTemplatesTab = screen.getByRole('tabpanel');
  //
  //   expect(emailTemplatesTab.id).toBe('rc-tabs-test-panel-templates');
  //   expect(emailTemplatesTab).not.toHaveClass('display-none');
  // });
  //
  // it('render properly without templates permission', () => {
  //   mockPermissions.mockReturnValue({
  //     canReadEmailTemplatesTemplate:
  //       mockCanReadEmailTemplatesTemplate.mockReturnValue(false),
  //     canReadEmailTemplatesSmtp:
  //       mockCanReadEmailTemplatesSmtp.mockReturnValue(false),
  //   });
  //   mockDefaultActiveKey.mockReturnValue('templates');
  //
  //   renderWithClient(<ListEmails />);
  //
  //   const emailTemplatesTab = screen.getByRole('tabpanel');
  //
  //   expect(emailTemplatesTab.id).toBe('rc-tabs-test-panel-templates');
  //   expect(emailTemplatesTab).toHaveClass('display-none');
  // });
  //
  // it('render properly with phrases permission', () => {
  //   mockPermissions.mockReturnValue({
  //     canReadEmailTemplatesTemplate:
  //       mockCanReadEmailTemplatesTemplate.mockReturnValue(true),
  //     canReadEmailTemplatesSmtp:
  //       mockCanReadEmailTemplatesSmtp.mockReturnValue(true),
  //   });
  //   mockDefaultActiveKey.mockReturnValue('phrases');
  //
  //   renderWithClient(<ListEmails />);
  //
  //   const emailPhrasesTab = screen.getByRole('tabpanel');
  //
  //   expect(emailPhrasesTab.id).toBe('rc-tabs-test-panel-phrases');
  //   expect(emailPhrasesTab).not.toHaveClass('display-none');
  // });
  //
  // it('render properly without phrases permission', () => {
  //   mockPermissions.mockReturnValue({
  //     canReadEmailTemplatesTemplate:
  //       mockCanReadEmailTemplatesTemplate.mockReturnValue(false),
  //     canReadEmailTemplatesSmtp:
  //       mockCanReadEmailTemplatesSmtp.mockReturnValue(false),
  //   });
  //   mockDefaultActiveKey.mockReturnValue('phrases');
  //
  //   renderWithClient(<ListEmails />);
  //
  //   const emailPhrasesTab = screen.getByRole('tabpanel');
  //
  //   expect(emailPhrasesTab.id).toBe('rc-tabs-test-panel-phrases');
  //   expect(emailPhrasesTab).toHaveClass('display-none');
  // });
  //
  // it('render properly with smtp_config permission', () => {
  //   mockPermissions.mockReturnValue({
  //     canReadEmailTemplatesTemplate:
  //       mockCanReadEmailTemplatesTemplate.mockReturnValue(true),
  //     canReadEmailTemplatesSmtp:
  //       mockCanReadEmailTemplatesSmtp.mockReturnValue(true),
  //   });
  //   mockDefaultActiveKey.mockReturnValue('smtp config');
  //
  //   renderWithClient(<ListEmails />);
  //
  //   const emailSmtpConfigTab = screen.getByRole('tabpanel');
  //
  //   expect(emailSmtpConfigTab.id).toBe('rc-tabs-test-panel-smtp config');
  //   expect(emailSmtpConfigTab).not.toHaveClass('display-none');
  // });
  //
  // it('render properly without smtp_config permission', () => {
  //   mockPermissions.mockReturnValue({
  //     canReadEmailTemplatesTemplate:
  //       mockCanReadEmailTemplatesTemplate.mockReturnValue(false),
  //     canReadEmailTemplatesSmtp:
  //       mockCanReadEmailTemplatesSmtp.mockReturnValue(false),
  //   });
  //   mockDefaultActiveKey.mockReturnValue('smtp config');
  //
  //   renderWithClient(<ListEmails />);
  //
  //   const emailSmtpConfigTab = screen.getByRole('tabpanel');
  //
  //   expect(emailSmtpConfigTab.id).toBe('rc-tabs-test-panel-smtp config');
  //   expect(emailSmtpConfigTab).toHaveClass('display-none');
  // });
  //
  // it('list emails header render properly', () => {
  //   mockPermissions.mockReturnValue({
  //     canReadEmailTemplatesTemplate:
  //       mockCanReadEmailTemplatesTemplate.mockReturnValue(false),
  //     canReadEmailTemplatesSmtp:
  //       mockCanReadEmailTemplatesSmtp.mockReturnValue(false),
  //   });
  //
  //   const { container } = renderWithClient(<ListEmails />);
  //
  //   const sidebarToogleIcon =
  //     container.getElementsByClassName('hamburgericon')[0];
  //   expect(sidebarToogleIcon).toBeInTheDocument();
  //
  //   const headerTitle = screen.getByText('common.labels.emails');
  //   expect(headerTitle).toBeInTheDocument();
  //
  //   const headerSubtitle = screen.getByText('common.labels.emails_subtitle');
  //   expect(headerSubtitle).toBeInTheDocument();
  // });
});
