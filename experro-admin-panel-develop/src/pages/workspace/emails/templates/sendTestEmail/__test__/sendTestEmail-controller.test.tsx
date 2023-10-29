import { renderHook } from '@testing-library/react-hooks';
import useSendTestEmailController from '../sendTestEmail-controller';
import { wrapper } from '../../../../../../test/utills';
import { waitFor } from '@testing-library/react';

const mockParams = jest.fn();
const mockTemplateId = jest.fn();
const mockOnHideSendTestEmail = jest.fn();
const mockSetFields = jest.fn();
const mockValidateFields = jest.fn();
const mockResetFields = jest.fn();

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
        },
      ],
    },
  };
});

describe('useSendTestEmailController', () => {
  it('on save with all data', async () => {
    mockValidateFields.mockReturnValue({
      email: 'test@testing.com',
    });
    mockParams.mockReturnValue({
      workspaceId: '1234',
    });

    const { result } = renderHook(
      () =>
        useSendTestEmailController({
          templateId: mockTemplateId(),
          onHideSendTestEmail: mockOnHideSendTestEmail,
        }),
      {
        wrapper,
      }
    );

    result.current.onSave();

    await waitFor(() => expect(result.current.sendTestEmail.data).toBeTruthy());
  });

  it('on save without email', async () => {
    mockValidateFields.mockReturnValue({
      email: '',
    });
    mockParams.mockReturnValue({
      workspaceId: '1234',
    });

    const { result } = renderHook(
      () =>
        useSendTestEmailController({
          templateId: mockTemplateId(),
          onHideSendTestEmail: mockOnHideSendTestEmail,
        }),
      {
        wrapper,
      }
    );

    result.current.onSave();

    await waitFor(() => expect(mockSetFields).toBeCalled());
  });

  it('on save with inappropriate email format', async () => {
    mockValidateFields.mockReturnValue({
      email: 'test',
    });
    mockParams.mockReturnValue({
      workspaceId: '1234',
    });

    const { result } = renderHook(
      () =>
        useSendTestEmailController({
          templateId: mockTemplateId(),
          onHideSendTestEmail: mockOnHideSendTestEmail,
        }),
      {
        wrapper,
      }
    );

    result.current.onSave();

    await waitFor(() => expect(mockSetFields).toBeCalled());
  });

  it('on save with error', async () => {
    mockValidateFields.mockReturnValue({
      email: 'test@testing.com',
    });
    mockParams.mockReturnValue({
      workspaceId: '123',
    });

    const { result } = renderHook(
      () =>
        useSendTestEmailController({
          templateId: mockTemplateId(),
          onHideSendTestEmail: mockOnHideSendTestEmail,
        }),
      {
        wrapper,
      }
    );

    result.current.onSave();

    await waitFor(() => expect(mockResetFields).toBeCalled());

    expect(mockOnHideSendTestEmail).toBeCalled();
  });

  it('on close send test email', async () => {
    mockParams.mockReturnValue({
      workspaceId: '1234',
    });

    const { result } = renderHook(
      () =>
        useSendTestEmailController({
          templateId: mockTemplateId(),
          onHideSendTestEmail: mockOnHideSendTestEmail,
        }),
      {
        wrapper,
      }
    );

    result.current.onCloseSendTestEmail();

    await waitFor(() => expect(mockResetFields).toBeCalled());

    expect(mockOnHideSendTestEmail).toBeCalled();
  });
});
