import { renderHook } from '@testing-library/react-hooks';
import useCreateUpdateTemplatesEmailsController from '../create-update-templates-emails-controller';
import { wrapper } from '../../../../../../test/utills';
import { act, waitFor } from '@testing-library/react';
import * as utills from '../../../../../../utills';

const mockHistory = jest.fn();
const mockPush = jest.fn();
const mockParams = jest.fn();
const spyOpenNotificationWithIcon = jest.spyOn(
  utills,
  'openNotificationWithIcon'
);

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn().mockReturnValue(() => mockParams())(),
    useHistory: jest.fn().mockReturnValue(() => ({ push: mockPush }))(),
  };
});

describe('useCreateUpdateTemplatesEmailsController', () => {
  describe('not cloned email templates', () => {
    beforeEach(() => {
      mockParams.mockReturnValue({
        workspaceId: '1234',
        templateId: 'rs1',
        cloned: 'false',
        masterTemplateId: '1234',
      });
      mockHistory.mockReturnValue({
        push: mockPush.mockReturnValue({ historyPush: jest.fn() }),
      });
    });

    it('back button click method working properly', () => {
      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      result.current.onBackButtonClick();
      expect(mockPush).toBeCalledWith('/workspaces/1234/emails/templates/1234');
    });

    it('onFinish method with all data', async () => {
      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      result.current.onFinish({
        name: 'Template',
        masterTemplateName: 'Reset Password',
        environmentIds: ['prod1', 'dev1'],
        masterTemplateId: 'rs1',
        htmlContent: '<html><body>Test</body></html>',
        subject: 'Template',
      });

      await waitFor(() =>
        expect(mockPush).toBeCalledWith(
          '/workspaces/1234/emails/templates/1234'
        )
      );
    });

    it('onFinish method with empty name', async () => {
      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      result.current.onFinish({
        name: '',
        masterTemplateName: 'Reset Password',
        environmentIds: ['prod1', 'dev1'],
        masterTemplateId: 'rs1',
        htmlContent: '<html><body>Test</body></html>',
        subject: 'Template',
      });

      await waitFor(() => expect(mockPush).not.toBeCalled());
    });

    it('onFinish method with name more than 255 characters', async () => {
      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      result.current.onFinish({
        name: 'test'.repeat(65),
        masterTemplateName: 'Reset Password',
        environmentIds: ['prod1', 'dev1'],
        masterTemplateId: 'rs1',
        htmlContent: '<html><body>Test</body></html>',
        subject: 'Template',
      });

      await waitFor(() => expect(mockPush).not.toBeCalled());
    });

    it('onFinish method with name less than 3 characters', async () => {
      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      result.current.onFinish({
        name: 'ab',
        masterTemplateName: 'Reset Password',
        environmentIds: ['prod1', 'dev1'],
        masterTemplateId: 'rs1',
        htmlContent: '<html><body>Test</body></html>',
        subject: 'Template',
      });

      await waitFor(() => expect(mockPush).not.toBeCalled());
    });

    it('onFinish method with space in subject', async () => {
      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      result.current.onFinish({
        name: 'Template',
        masterTemplateName: 'Reset Password',
        environmentIds: ['prod1', 'dev1'],
        masterTemplateId: 'rs1',
        htmlContent: '<html><body>Test</body></html>',
        subject: ' ',
      });

      await waitFor(() => expect(mockPush).not.toBeCalled());
    });

    it('onFinish method without htmlContent', async () => {
      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      result.current.onFinish({
        name: 'Template',
        masterTemplateName: 'Reset Password',
        environmentIds: ['prod1', 'dev1'],
        masterTemplateId: 'rs1',
        subject: 'Template',
      });

      await waitFor(() => expect(mockPush).not.toBeCalled());
    });

    it('onFinish method without subject', async () => {
      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      result.current.onFinish({
        name: 'Template',
        masterTemplateName: 'Reset Password',
        environmentIds: ['prod1', 'dev1'],
        masterTemplateId: 'rs1',
        htmlContent: '<html><body>Test</body></html>',
      });

      await waitFor(() => expect(mockPush).not.toBeCalled());
    });

    it('hide send test email dialog', () => {
      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      result.current.onHideSendTestEmailModal();

      expect(result.current.selectedTemplateIdForSendEmail).toBe('');
      expect(result.current.isSendEmailModalVisible).toBeFalsy();
    });

    it('send test email', async () => {
      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      await waitFor(() =>
        expect(result.current.getEmailTemplate.data).toBeDefined()
      );

      act(() => {
        result.current.onSendTestEmail();
      });

      expect(result.current.selectedTemplateIdForSendEmail).toBe('rs1');
      expect(result.current.isSendEmailModalVisible).toBeTruthy();
    });

    it('on text area change with phrase emails', async () => {
      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      await new Promise((r) => setTimeout(r, 500));

      act(() => {
        result.current.onTextAreaChange(
          '<html><body>{{experiment}}</body></html>'
        );
      });

      // expect(result.current.htmlData).toBe(
      //   '<html><body>Have you ever tried e-commerce platform?</body></html>'
      // );
    });

    it('on text area change without phrase emails', () => {
      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      act(() => {
        result.current.onTextAreaChange('<html><body>Tested</body></html>');
      });

      expect(result.current.htmlData).toBe('<html><body>Tested</body></html>');
    });

    it('on subject change with phrase emails', async () => {
      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      await new Promise((r) => setTimeout(r, 500));

      act(() => {
        //@ts-ignore
        result.current.onSubjectChange({ target: { value: '{{experiment}}' } });
      });

      // expect(result.current.subjectData).toBe(
      //   'Have you ever tried e-commerce platform?'
      // );
    });

    it('on subject change without phrase emails', () => {
      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      act(() => {
        //@ts-ignore
        result.current.onSubjectChange({ target: { value: 'Test' } });
      });

      expect(result.current.subjectData).toBe('Test');
    });
  });

  describe('cloned email templates', () => {
    beforeEach(() => {
      mockParams.mockReturnValue({
        workspaceId: '1234',
        templateId: 'rs1',
        cloned: 'true',
      });
      mockHistory.mockReturnValue({
        push: mockPush.mockReturnValue({ historyPush: jest.fn() }),
      });
    });

    it('back button click method working properly', () => {
      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      result.current.onBackButtonClick();
      // expect(spyOpenNotificationWithIcon).toBeCalled();
      expect(mockPush).toBeCalledWith(
        '/workspaces/1234/emails/templates/undefined'
      );
    });

    it('onFinish method with all data', async () => {
      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      result.current.onFinish({
        name: 'Template',
        masterTemplateName: 'Reset Password',
        environmentIds: ['prod1', 'dev1'],
        masterTemplateId: 'rs1',
        htmlContent: '<html><body>Test</body></html>',
        subject: 'Template',
      });

      await waitFor(() => expect(spyOpenNotificationWithIcon).toBeCalled());
      expect(mockPush).toBeCalledWith(
        '/workspaces/1234/emails/templates/undefined'
      );
    });
  });

  describe('without phrase or templates in emails', () => {
    beforeEach(() => {
      mockHistory.mockReturnValue({
        push: mockPush.mockReturnValue({ historyPush: jest.fn() }),
      });
    });

    it('without phrase working properly', async () => {
      mockParams.mockReturnValue({
        workspaceId: '12345',
        templateId: 'rs1',
        cloned: 'false',
      });

      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      await waitFor(() =>
        expect(result.current.htmlData).toBe('<html><body>Test</body></html>')
      );

      expect(result.current.subjectData).toBe('Template');
      expect(result.current.selectedTemplateIdForSendEmail).toBe('rs1');
    });

    it('without email template working properly', async () => {
      mockParams.mockReturnValue({
        workspaceId: '123',
        templateId: 'rs1',
        cloned: 'false',
      });

      const { result } = renderHook(
        () => useCreateUpdateTemplatesEmailsController(),
        { wrapper }
      );

      act(() => {
        result.current.onSendTestEmail();
      });

      expect(result.current.isSendEmailModalVisible).toBeTruthy();
    });
  });
});
