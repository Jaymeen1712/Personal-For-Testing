import React from 'react';

import CreateUpdateRole from '../create-update-role';
import { renderWithClient } from '../../../../test';
import { act, fireEvent, screen } from '@testing-library/react';

const mockHistory = jest.fn();
const mockOnFinish = jest.fn();
const mockOnFinishFailed = jest.fn();
const mockCancel = jest.fn();
const mockGetRole = jest.fn();
const mockWorkspaces = jest.fn();
const mockCollectionType = jest.fn();
const mockSingleType = jest.fn();
const mockLanguageList = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn().mockReturnValue(() => ({ workspaceId: '123' }))(),
    useHistory: jest.fn().mockReturnValue(() => mockHistory())(),
  };
});

jest.mock('../create-update-role-controller', () => () => ({
  id: null,
  t: (name: string) => name,
  onFinish: mockOnFinish,
  onFinishFailed: mockOnFinishFailed,
  roleDetails: mockGetRole(),
  workspaces: mockWorkspaces(),
  listCollection: mockCollectionType(),
  listSingleTypes: mockSingleType(),
  listLanguage: mockLanguageList(),
  onCancel: mockCancel,
}));

describe('CreateUpdateRole', () => {
  const validateInputs = async () => {
    // let alertElements = screen.getAllByRole('alert');
    // expect(alertElements.length).toBe(2);
    // expect(alertElements[0].innerHTML).toBe('common.messages.required');
    // expect(alertElements[1].innerHTML).toBe('common.messages.required');

    // const comboboxElement = screen.getByRole('combobox');
    // expect(comboboxElement).toBeInTheDocument();
    // const comboboxElement = screen.getByTestId('workspace-select')
    //   .firstElementChild as Element;
    // console.log('Combobox element', comboboxElement);
    //
    // fireEvent.mouseDown(comboboxElement);
    //
    // await waitFor(() =>
    //   expect(screen.getByText('common.labels.global')).toBeVisible()
    // );

    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      fireEvent.change(
        screen.getByRole('textbox', { name: 'common.labels.role-name' }),
        {
          target: { value: '' },
        }
      );
      fireEvent.change(
        screen.getByRole('textbox', { name: 'common.labels.description' }),
        {
          target: { value: '' },
        }
      );
      // userEvent.selectOptions(
      //   // Find the select element
      //   screen.getByRole('combobox'),
      //   // Find and select the Ireland option
      //   // @ts-ignore
      //   screen.getByRole('option', { id: 'workspace_list_1' })
      // );
      // expect(screen.getByRole('option', { name: 'Ireland' }).onselect).toBe(
      //   true
      // );
      // fireEvent.click(
      //   screen.getByRole('combobox', {
      //     name: 'common.labels.global-or-workspace',
      //   }),
      //   {
      //     target: { value: '' },
      //   }
      // );
      // @ts-ignore
      // const { firstElementChild } = screen.getByRole('combobox', {
      //   name: 'common.labels.global-or-workspace',
      // });
      // fireEvent.mouseDown(firstElementChild, {
      //   target: { value: '' },
      // });
    });

    const comboboxElement = screen.getByRole('combobox');
    fireEvent.click(comboboxElement);
    fireEvent.mouseDown(comboboxElement);

    await new Promise((r) => setTimeout(r, 500));
    const options = screen.getAllByRole('option');
    fireEvent.mouseDown(options[0]);

    await new Promise((r) => setTimeout(r, 50));

    // alertElements = screen.getAllByRole('alert');
    // expect(alertElements.length).toBe(2);
    // expect(alertElements[0].innerHTML).toBe('common.messages.required');
    // expect(alertElements[1].innerHTML).toBe('common.messages.required');
  };

  it('create-Update-Role render properly', () => {
    mockLanguageList.mockReturnValue({
      data: {
        isFetched: true,
        isSuccess: true,
      },
    });
    mockSingleType.mockReturnValue({
      data: {
        isFetched: true,
        isSuccess: true,
      },
    });
    mockCollectionType.mockReturnValue({
      data: {
        isFetched: true,
        isSuccess: true,
      },
    });
    mockWorkspaces.mockReturnValue({
      isFetched: true,
      isSuccess: true,
      data: [
        {
          name: 'RapidOps',
          id: '082915b8-2858-439f-bc96-4a50e4c01bcb',
        },
      ],
    });
    mockGetRole.mockReturnValue({
      isFetched: true,
      isSuccess: true,
    });
    const { container } = renderWithClient(<CreateUpdateRole />);

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
    const formElement = container.getElementsByClassName('ant-form');
    expect(formElement.length).toBe(1);

    const textElements = screen.getAllByRole('textbox');
    expect(textElements.length).toBe(2);
    expect(textElements[0].id).toBe('roleName');
    expect(textElements[1].id).toBe('roleDescription');

    const comboboxElements = screen.getAllByRole('combobox');
    expect(comboboxElements.length).toBe(1);
    expect(comboboxElements[0].id).toBe('workspace');

    const buttonElements = screen.getAllByRole('button');
    expect(buttonElements.length).toBe(2);
    expect(buttonElements[1].id).toBe('common.labels.save');
    // expect(buttonElements[2].id).toBe('common.labels.cancel');

    // const tabElements = screen.getAllByRole('tab');
    // expect(tabElements.length).toBe(7);
    // expect(tabElements[0].id).toBe('rc-tabs-test-tab-1');
    // expect(tabElements[1].id).toBe('rc-tabs-test-tab-2');
    // expect(tabElements[2].id).toBe('rc-tabs-test-tab-3');
    // expect(tabElements[3].id).toBe('rc-tabs-test-tab-4');
    // expect(tabElements[4].id).toBe('rc-tabs-test-tab-5');
    // expect(tabElements[5].id).toBe('rc-tabs-test-tab-6');
    // expect(tabElements[6].id).toBe('rc-tabs-test-tab-7');

    const comboBoxElement = screen.getAllByRole('combobox');
    expect(comboBoxElement.length).toBe(1);
    expect(comboBoxElement[0].id).toBe('workspace');

    const textBoxElement = screen.getAllByRole('textbox');
    expect(textBoxElement.length).toBe(2);
    expect(textBoxElement[0].id).toBe('roleName');
    expect(textBoxElement[1].id).toBe('roleDescription');
  });

  it('create-update validation', async () => {
    mockLanguageList.mockReturnValue({
      data: {
        isFetched: true,
        isSuccess: true,
      },
    });
    mockSingleType.mockReturnValue({
      data: {
        isFetched: true,
        isSuccess: true,
      },
    });
    mockCollectionType.mockReturnValue({
      data: {
        isFetched: true,
        isSuccess: true,
      },
    });
    mockWorkspaces.mockReturnValue({
      isFetched: true,
      isSuccess: true,
      data: [
        {
          workspaceName: 'RapidOps',
          workspaceId: '082915b8-2858-439f-bc96-4a50e4c01bcb',
        },
      ],
    });
    mockGetRole.mockReturnValue({
      isFetched: true,
      isSuccess: true,
    });
    renderWithClient(<CreateUpdateRole />);

    const saveButtonElement = screen.getByRole('button', {
      name: 'common.labels.save',
    });
    expect(saveButtonElement).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      fireEvent.submit(saveButtonElement);
    });

    await new Promise((r) => setTimeout(r, 50));

    await validateInputs();
  });

  // it('create-update form renders with edit role value', async () => {
  //   mockLanguageList.mockReturnValue({
  //     data: {
  //       isFetched: true,
  //       isSuccess: true,
  //     },
  //   });
  //   mockSingleType.mockReturnValue({
  //     data: {
  //       isFetched: true,
  //       isSuccess: true,
  //     },
  //   });
  //   mockCollectionType.mockReturnValue({
  //     data: {
  //       isFetched: true,
  //       isSuccess: true,
  //     },
  //   });
  //   mockWorkspaces.mockReturnValue({
  //     isFetched: true,
  //     isSuccess: true,
  //     data: [
  //       {
  //         workspaceName: 'RapidOps',
  //         workspaceId: '082915b8-2858-439f-bc96-4a50e4c01bcb',
  //       },
  //     ],
  //   });
  //   mockGetRole.mockReturnValue({
  //     isSuccess: true,
  //     isFetched: true,
  //     roleName: 'Rapid Admin',
  //     roleDescription: 'Rapid Admin',
  //     workspaceId: null,
  //     tenantId: 'd4956fe5-dccb-4c09-ac02-44bac1042e1f',
  //     roleField: {
  //       global: {
  //         permission: {
  //           canManageWorkspace: true,
  //           canManageUserAndSecurity: true,
  //         },
  //       },
  //     },
  //   });
  //   const { container } = renderWithClient(<CreateUpdateRole />);

  //   const options = screen.getByRole('option');
  //   console.log('Options', options);

  //   const saveButtonElement = screen.getByRole('button', {
  //     name: 'common.labels.save',
  //   });
  //   expect(saveButtonElement).toBeInTheDocument();
  //   eslint-disable-next-line testing-library/no-unnecessary-act

  //   fireEvent.change(
  //     screen.getByRole('textbox', { name: 'common.labels.role-name' }),
  //     {
  //       target: { value: 'Admin Role' },
  //     }
  //   );
  //   fireEvent.change(
  //     screen.getByRole('textbox', { name: 'common.labels.description' }),
  //     {
  //       target: { value: 'Admin Role' },
  //     }
  //   );
  //   const comboboxElement = screen.getByRole('combobox');
  //   console.log(comboboxElement);
  //   fireEvent.change(comboboxElement, {
  //     target: { value: 'common.labels.global' },
  //   });
  //   fireEvent.submit(comboboxElement);
  //   fireEvent.click(comboboxElement);
  //   fireEvent.mouseDown(comboboxElement);

  //   await new Promise((r) => setTimeout(r, 500));
  //   const options = screen.getAllByRole('option');
  //   fireEvent.click(options[0]);
  //   fireEvent.mouseDown(options[0]);
  //   fireEvent.click(container);

  //   fireEvent.mouseDown(
  //     screen.getByRole('combobox', {
  //       name: 'common.labels.global-or-workspace',
  //     }),
  //     {
  //       target: { value: 'global' },
  //     }
  //   );

  //   const selectedValueElement = container.getElementsByClassName(
  //     'ant-select-selection-item'
  //   );
  //
  //   expect(selectedValueElement.length).toBe(1);

  //   @ts-ignore
  //   fireEvent.mouseDown(comboboxElement);

  //   fireEvent.submit(saveButtonElement);

  //   await new Promise((r) => setTimeout(r, 1000));
  //   // expect(mockOnFinishFailed).toBeCalledWith('');
  //   expect(mockOnFinish).toBeCalled();
  //   expect(mockOnFinish).toBeCalledWith({
  //     audience: {
  //       segments: {
  //         create: undefined,
  //         delete: undefined,
  //         read: undefined,
  //         update: undefined,
  //       },
  //     },
  //     'insights-create': undefined,
  //     'insights-delete': undefined,
  //     'insights-publish': undefined,
  //     'insights-read': undefined,
  //     'insights-update': undefined,
  //     merchandising: {
  //       facets: {
  //         create: undefined,
  //         delete: undefined,
  //         read: undefined,
  //         update: undefined,
  //       },
  //       rules: {
  //         categoryRules: {
  //           create: undefined,
  //           delete: undefined,
  //           read: undefined,
  //           update: undefined,
  //         },
  //         globalRules: {
  //           create: undefined,
  //           delete: undefined,
  //           read: undefined,
  //           update: undefined,
  //         },
  //         searchRules: {
  //           create: undefined,
  //           delete: undefined,
  //           read: undefined,
  //           update: undefined,
  //         },
  //       },
  //       synonyms: {
  //         create: undefined,
  //         delete: undefined,
  //         read: undefined,
  //         update: undefined,
  //       },
  //     },
  //     personalization: {
  //       widget: {
  //         create: undefined,
  //         delete: undefined,
  //         read: undefined,
  //         update: undefined,
  //       },
  //     },
  //     roleDescription: 'Admin Role',
  //     roleName: 'Admin Role',
  //     settings: {
  //       apiToken: {
  //         create: undefined,
  //         delete: undefined,
  //         read: undefined,
  //         update: undefined,
  //       },
  //       ecommercePlugin: {
  //         bigcommerce: {
  //           create: undefined,
  //           delete: undefined,
  //           read: undefined,
  //           update: undefined,
  //         },
  //       },
  //       internationalization: {
  //         create: undefined,
  //         delete: undefined,
  //         read: undefined,
  //         update: undefined,
  //       },
  //       mediaLibrary: {
  //         access: undefined,
  //       },
  //       usersAndRoles: {
  //         roles: {
  //           create: undefined,
  //           delete: undefined,
  //           read: undefined,
  //           update: undefined,
  //         },
  //         users: {
  //           create: undefined,
  //           delete: undefined,
  //           read: undefined,
  //           update: undefined,
  //         },
  //       },
  //     },
  //     workspace: 'global',
  //   });
  // });

  it('create-update form cancel', async () => {
    mockLanguageList.mockReturnValue({
      data: {
        isFetched: true,
        isSuccess: true,
      },
    });
    mockSingleType.mockReturnValue({
      data: {
        isFetched: true,
        isSuccess: true,
      },
    });
    mockCollectionType.mockReturnValue({
      data: {
        isFetched: true,
        isSuccess: true,
      },
    });
    mockWorkspaces.mockReturnValue({
      isFetched: true,
      isSuccess: true,
      data: [
        {
          workspaceName: 'RapidOps',
          workspaceId: '082915b8-2858-439f-bc96-4a50e4c01bcb',
        },
      ],
    });
    mockGetRole.mockReturnValue({
      isFetched: true,
      isSuccess: true,
    });
    renderWithClient(<CreateUpdateRole />);

    const cancelButtonElement = screen.getByRole('button', {
      name: 'common.labels.cancel',
    });
    expect(cancelButtonElement).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      fireEvent.click(cancelButtonElement);
    });

    await new Promise((r) => setTimeout(r, 50));

    expect(mockCancel).toBeCalled();
  });
});
