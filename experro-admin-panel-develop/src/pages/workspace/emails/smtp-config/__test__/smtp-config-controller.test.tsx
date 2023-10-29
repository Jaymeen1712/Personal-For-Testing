import { renderHook } from '@testing-library/react-hooks';
import { wrapper } from '../../../../../test/utills';
import { act, waitFor } from '@testing-library/react';
import * as utills from '../../../../../utills';
import useSmtpConfigController from '../smtp-config-controller';

const mockParams = jest.fn();
const mockSetFields = jest.fn();
const mockValidateFields = jest.fn();

const mockResetFields = jest.fn();
const mockGetFieldValue = jest.fn();
const mockSetFieldsValue = jest.fn();
const mockCanUpdateEmailTemplatesSmtp = jest.fn().mockReturnValue(null);

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
  };
});

jest.mock('antd', () => {
  const originalModule = jest.requireActual('antd');

  return {
    __esModule: true,
    ...originalModule,
    Form: {
      useForm: () => [
        {
          setFields: mockSetFields,
          validateFields: jest
            .fn()
            .mockReturnValue(() => mockValidateFields())(),
          resetFields: mockResetFields,
          getFieldValue: jest.fn().mockReturnValue(() => mockGetFieldValue())(),
          setFieldsValue: mockSetFieldsValue,
        },
      ],
    },
  };
});

jest.mock('../../../../../hooks/permissions', () => () => ({
  canUpdateEmailTemplatesSmtp: mockCanUpdateEmailTemplatesSmtp,
  canReadEmailTemplatesSmtp: jest.fn().mockReturnValue(true),
}));

describe('useSmtpConfigController', () => {
  beforeEach(() => {
    mockParams.mockReturnValue({
      workspaceId: '1234',
    });
    mockCanUpdateEmailTemplatesSmtp.mockReturnValue(true);
  });

  it('onSwitchChange with false', async () => {
    const { result } = renderHook(() => useSmtpConfigController(), {
      wrapper,
    });

    act(() => {
      result.current.onSwitchChange(false);
    });

    await waitFor(() =>
      expect(result.current.isSwitchDisableModalVisible).toBeTruthy()
    );

    mockCanUpdateEmailTemplatesSmtp.mockReturnValue(false);

    act(() => {
      result.current.onSwitchChange(false);
    });

    await waitFor(() =>
      expect(result.current.isSwitchDisableModalVisible).toBeTruthy()
    );

    //@ts-ignore
    result.current.getSmtpEmails.data = 0;

    act(() => {
      result.current.onSwitchChange(false);
    });

    await waitFor(() => expect(result.current.switchValue).toBeFalsy());
  });

  it('onSwitchChange with true', async () => {
    const { result } = renderHook(() => useSmtpConfigController(), {
      wrapper,
    });

    act(() => {
      result.current.onSwitchChange(true);
    });

    await waitFor(() =>
      expect(result.current.isSaveButtonVisible).toBeTruthy()
    );

    expect(spyOpenNotificationWithIcon).toBeCalledTimes(1);

    //@ts-ignore
    result.current.getSmtpEmails.data = 0;

    act(() => {
      result.current.onSwitchChange(true);
    });

    await waitFor(() =>
      expect(result.current.isSaveButtonVisible).toBeTruthy()
    );
    expect(spyOpenNotificationWithIcon).toBeCalledTimes(2);
  });

  it('onHideDisableSwitchButton', () => {
    const { result } = renderHook(() => useSmtpConfigController(), {
      wrapper,
    });

    result.current.onHideDisableSwitchButton();

    expect(result.current.isSwitchDisableModalVisible).toBeFalsy();
  });

  it('onDisableSmtpData', async () => {
    const { result } = renderHook(() => useSmtpConfigController(), {
      wrapper,
    });

    result.current.onDisableSmtpData();
    expect(result.current.switchValue).toBeFalsy();

    await new Promise((r) => setTimeout(r, 500));

    act(() => {
      result.current.onDisableSmtpData();
    });

    expect(result.current.switchValue).toBeTruthy();

    //@ts-ignore
    expect(result.current.getSmtpEmails.data.isSmtpEnable).toBeFalsy();
  });

  it('onAuthenticationSwitchChange with true and without smtp password', async () => {
    const { result } = renderHook(() => useSmtpConfigController(), {
      wrapper,
    });

    await new Promise((r) => setTimeout(r, 500));

    //@ts-ignore
    result.current.getSmtpEmails.data.smtpPassword = '';

    act(() => {
      result.current.onAuthenticationSwitchChange(true);
    });

    expect(result.current.isSaveButtonVisible).toBeTruthy();
    expect(result.current.isAuthenticationSwitch).toBeTruthy();
  });

  it('onAuthenticationSwitchChange with false', async () => {
    const { result } = renderHook(() => useSmtpConfigController(), {
      wrapper,
    });

    await new Promise((r) => setTimeout(r, 500));

    act(() => {
      result.current.onAuthenticationSwitchChange(false);
    });

    expect(result.current.isSaveButtonVisible).toBeTruthy();
    expect(result.current.isAuthenticationSwitch).toBeFalsy();
  });

  it('onSmtpData with all data and smtp emails', async () => {
    const { result } = renderHook(() => useSmtpConfigController(), {
      wrapper,
    });

    act(() => {
      result.current.onSwitchChange(false);
    });

    await new Promise((r) => setTimeout(r, 500));

    //@ts-ignore
    result.current.onSmtpData({
      id: 'test1',
      isSmtpEnable: true,
      fromName: 'Testing',
      fromEmail: 'testing@test.com',
      smtpHost: 'testing.host.com',
      smtpPort: '80',
      isAuthenticationEnable: true,
    });

    await waitFor(() =>
      expect(spyOpenNotificationWithIcon).toBeCalledWith(
        'success',
        'common.messages.disabled_successfully'
      )
    );

    result.current.getSmtpEmails.data = undefined;

    //@ts-ignore
    result.current.onSmtpData({
      id: 'test1',
      isSmtpEnable: true,
      fromName: 'Testing',
      fromEmail: 'testing@test.com',
      smtpHost: 'testing.host.com',
      smtpPort: '80',
      isAuthenticationEnable: true,
    });

    await waitFor(() =>
      expect(spyOpenNotificationWithIcon).toBeCalledWith(
        'success',
        'common.messages.updated_successfully'
      )
    );

    //@ts-ignore
    result.current.getSmtpEmails.data = 0;

    //@ts-ignore
    result.current.onSmtpData({
      id: 'test1',
      isSmtpEnable: true,
      fromName: 'Testing',
      fromEmail: 'testing@test.com',
      smtpHost: 'testing.host.com',
      smtpPort: '80',
      isAuthenticationEnable: true,
    });

    await waitFor(() =>
      expect(spyOpenNotificationWithIcon).toBeCalledWith(
        'success',
        'common.messages.created_successfully'
      )
    );
  });

  it('onSmtpData throw validation errors', () => {
    const { result } = renderHook(() => useSmtpConfigController(), {
      wrapper,
    });

    //@ts-ignore
    result.current.onSmtpData({
      fromName: '',
    });

    expect(mockSetFields).toBeCalledTimes(1);

    //@ts-ignore
    result.current.onSmtpData({
      fromName: 'Te',
    });

    expect(mockSetFields).toBeCalledTimes(2);

    //@ts-ignore
    result.current.onSmtpData({
      fromName: 'Testing'.repeat(43),
    });

    expect(mockSetFields).toBeCalledTimes(3);

    //@ts-ignore
    result.current.onSmtpData({
      fromName: 'Testing123',
    });

    expect(mockSetFields).toBeCalledTimes(4);

    //@ts-ignore
    result.current.onSmtpData({
      fromName: 'Testing',
      fromEmail: '',
    });

    expect(mockSetFields).toBeCalledTimes(5);

    //@ts-ignore
    result.current.onSmtpData({
      fromName: 'Testing',
      fromEmail: 'testing@test',
    });

    expect(mockSetFields).toBeCalledTimes(6);

    //@ts-ignore
    result.current.onSmtpData({
      fromName: 'Testing',
      fromEmail: 'testing@test.com',
      smtpHost: 'te',
    });

    expect(mockSetFields).toBeCalledTimes(7);

    //@ts-ignore
    result.current.onSmtpData({
      fromName: 'Testing',
      fromEmail: 'testing@test.com',
      smtpHost: 'testing.host.com',
      smtpPort: '',
    });

    expect(mockSetFields).toBeCalledTimes(8);

    //@ts-ignore
    result.current.onSmtpData({
      fromName: 'Testing',
      fromEmail: 'testing@test.com',
      smtpHost: 'testing.host.com',
      smtpPort: 'test',
    });

    expect(mockSetFields).toBeCalledTimes(9);
  });

  it('onValueChange', async () => {
    const { result } = renderHook(() => useSmtpConfigController(), {
      wrapper,
    });

    act(() => {
      result.current.onValueChange(
        //@ts-ignore
        {},
        {
          fromName: 'Testing',
          fromEmail: 'testing@test.com',
          smtpHost: 'testing.host.com',
          smtpPort: '',
          isAuthenticationEnable: true,
        }
      );
    });

    await waitFor(() =>
      expect(result.current.isSaveButtonVisible).toBeTruthy()
    );

    act(() => {
      result.current.onValueChange(
        //@ts-ignore
        {},
        {
          fromName: 'Testing',
          fromEmail: 'testing@test.com',
          smtpHost: 'testing.host.com',
          smtpPort: '80',
          smtpUsername: 'testing',
          smtpPassword: '',
          isAuthenticationEnable: true,
        }
      );
    });

    await waitFor(() =>
      expect(result.current.isSaveButtonVisible).toBeTruthy()
    );

    act(() => {
      result.current.onValueChange(
        //@ts-ignore
        {},
        {
          fromName: 'Testing',
          fromEmail: 'testing@test.com',
          smtpHost: 'testing.host.com',
          smtpPort: '80',
          isAuthenticationEnable: false,
        }
      );
    });

    await waitFor(() =>
      expect(result.current.isSaveButtonVisible).toBeTruthy()
    );
  });
});
