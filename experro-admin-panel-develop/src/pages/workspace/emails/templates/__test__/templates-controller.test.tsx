import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { wrapper } from '../../../../../test/utills';
import useTemplatesController from '../templates-controller';

const mockHistory = jest.fn();
const mockPush = jest.fn();
const mockParams = jest.fn();
const mockRouteMatch = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn().mockReturnValue(() => mockParams())(),
    useHistory: jest.fn().mockReturnValue(() => ({ push: mockPush }))(),
    useRouteMatch: jest
      .fn()
      .mockReturnValue(() => ({ path: mockRouteMatch }))(),
  };
});

jest.mock('../../../../../hooks/permissions', () => () => ({
  canUpdateEmailTemplatesTemplate: jest.fn().mockReturnValue(true),
  canCreateEmailTemplatesTemplate: jest.fn().mockReturnValue(true),
  canDeleteEmailTemplatesTemplate: jest.fn().mockReturnValue(true),
}));

describe('useTemplatesController', () => {
  beforeEach(() => {
    mockParams.mockReturnValue({ workspaceId: '1234' });
    mockHistory.mockReturnValue({
      push: mockPush.mockReturnValue({ historyPush: jest.fn() }),
    });
    mockRouteMatch.mockReturnValue({
      path: `/workspaces/1234/emails/templates/12345`,
    });
  });

  it('list of master template emails', async () => {
    const { result } = renderHook(() => useTemplatesController(), { wrapper });

    await waitFor(() => {
      expect(result.current.listMasterTemplateEmails.data).toStrictEqual([
        { id: 'rs1', name: 'Reset Password' },
        { id: 'su1', name: 'Sign Up' },
        { id: 'fp1', name: 'Forgot Password' },
      ]);
    });
  });

  it('change master email template', () => {
    const { result } = renderHook(() => useTemplatesController(), { wrapper });

    act(() => {
      result.current.onListMasterTemplateChange('su1');
    });
    expect(result.current.selectedMasterTemplateId).toBe('su1');
  });

  // it('active status label', () => {
  //   const { result } = renderHook(() => useTemplatesController(), { wrapper });
  //
  //   const { container } = renderWithClient(
  //     <span
  //       //@ts-ignore
  //       class={
  //         //@ts-ignore
  //         result.current.columns[2].rendererProps.getColor({ isActive: true })
  //           ? 'ant-tag ant-tag-success'
  //           : 'ant-tag ant-tag-error'
  //       }>
  //       {
  //         //@ts-ignore
  //         result.current.columns[2].rendererProps.getText({ isActive: true })
  //       }
  //     </span>
  //   );
  //
  //   const statusLabel = container.getElementsByClassName('ant-tag')[0];
  //   // expect(statusLabel).toBeInTheDocument();
  //   expect(statusLabel.innerHTML).toBe('common.labels.active');
  // });

  // it('inactive status label', () => {
  //   const { result } = renderHook(() => useTemplatesController(), { wrapper });
  //
  //   const { container } = renderWithClient(
  //     <span
  //       //@ts-ignore
  //       class={
  //         //@ts-ignore
  //         result.current.columns[2].rendererProps.getColor({ isActive: false })
  //           ? 'ant-tag ant-tag-success'
  //           : 'ant-tag ant-tag-error'
  //       }>
  //       {
  //         //@ts-ignore
  //         result.current.columns[2].rendererProps.getText({ isActive: false })
  //       }
  //     </span>
  //   );
  //
  //   const statusLabel = container.getElementsByClassName('ant-tag')[0];
  //   expect(statusLabel).toBeInTheDocument();
  //   expect(statusLabel.innerHTML).toBe('common.labels.inactive');
  // });
});
