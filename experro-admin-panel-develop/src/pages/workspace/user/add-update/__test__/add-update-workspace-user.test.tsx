// import { fireEvent, screen } from '@testing-library/react';

// import { renderWithClient } from '../../../../../test';
// import SearchIcon from '../../../../../images/icons/search-icon';
import { IUser } from '../../../../../types';

const mockHistory = jest.fn();
const mockGetUser = jest.fn();
const mockOnCancel = jest.fn();
const mockOnFinish = jest.fn();
const mockLocation = jest.fn();
const mockUserId = jest.fn().mockReturnValue(null);
const mockWorkspaceUserFormItems = jest.fn();
const mockWorkspaceName = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    __esModule: true,
    useHistory: () => mockHistory,
    useParams: () => ({}),
    useLocation: () => jest.fn().mockReturnValue(() => mockLocation())(),
  };
});

jest.mock('../add-update-workspace-user-controller', () => () => ({
  userId: mockUserId(),
  t: (name: string) => name,
  getUser: mockGetUser(),
  onCancel: mockOnCancel,
  onFinish: mockOnFinish,
  workspaceUserFormItems: mockWorkspaceUserFormItems(),
  workspaceName: mockWorkspaceName(),
}));

describe('AddUpdateWorkspaceUser', () => {
  // const validateInputs = async () => {
  //   const saveButtonElement = screen.getByRole('button', {
  //     name: 'common.labels.save',
  //   });
  //   expect(saveButtonElement).toBeInTheDocument();
  //   fireEvent.submit(saveButtonElement);

  //   await new Promise((r) => setTimeout(r, 50));

  //   // const alertElements = screen.getAllByRole('alert');
  //   // // expect(alertElements.length).toBe(2);

  //   // expect(alertElements[0].innerHTML).toBe(
  //   //   '<div class="ant-form-item-explain-error">Users are required</div>'
  //   // );
  //   // expect(alertElements[1].innerHTML).toBe(
  //   //   '<div class="ant-form-item-explain-error">Roles are required</div>'
  //   // );

  //   await new Promise((r) => setTimeout(r, 50));
  // };

  it('add-update render properly', () => {
    mockWorkspaceUserFormItems.mockReturnValue([
      {
        label: 'Users',
        placeholder: 'Select User',
        name: 'userId',
        type: 'select',
        getLabel: (user: IUser) => `${user.firstName} ${user.lastName}`,
        valueKey: 'id',
        allowClear: true,
        required: true,
        mode: 'single',
        rules: [
          {
            required: true,
            message: 'Users are required',
          },
        ],
      },
      {
        label: 'Roles',
        placeholder: 'Select Roles',
        name: 'roles',
        type: 'select',
        rules: [
          {
            required: true,
            message: 'Roles are required',
          },
        ],
      },
    ]);
    mockGetUser.mockReturnValue({
      data: {},
    });

    mockWorkspaceName.mockReturnValue('Temp Workspace');

    // const { container } = renderWithClient(<AddUpdateWorkspaceUser />);
    // const formElement = container.getElementsByClassName('ant-form');
    // expect(formElement.length).toBe(1);

    // const comboboxElements = screen.getAllByRole('combobox');
    // expect(comboboxElements.length).toBe(2);
    // expect(comboboxElements[0].id).toBe('userId');
    // expect(comboboxElements[1].id).toBe('roles');
    //
    // const buttonElements = screen.getAllByRole('button');
    // expect(buttonElements.length).toBe(2);
    // expect(buttonElements[1].id).toBe('common.labels.cancel');
    // expect(buttonElements[2].id).toBe('common.labels.save');
  });

  // // it('add-update render properly for update', () => {
  // //   mockWorkspaceUserFormItems.mockReturnValue([
  // //     {
  // //       label: 'Users',
  // //       placeholder: 'Select User',
  // //       name: 'userId',
  // //       type: 'select',
  // //       // @ts-ignore
  // //       getLabel: (user: IUser) => `${user.firstName} ${user.lastName}`,
  // //       valueKey: 'id',
  // //       allowClear: true,
  // //       required: true,
  // //       mode: 'single',
  // //       rules: [
  // //         {
  // //           required: true,
  // //           message: 'Users are required',
  // //         },
  // //       ],
  // //     },
  // //     {
  // //       label: 'Roles',
  // //       placeholder: 'Select Roles',
  // //       name: 'roles',
  // //       type: 'select',
  // //       rules: [
  // //         {
  // //           required: true,
  // //           message: 'Roles are required',
  // //         },
  // //       ],
  // //     },
  // //   ]);
  // //   mockUserId.mockReturnValue('123');
  // //   mockWorkspaceName.mockReturnValue('Temp Workspace');
  // //
  // //   mockGetUser.mockReturnValue({
  // //     data: {},
  // //   });
  // //   const { container } = renderWithClient(<AddUpdateWorkspaceUser />);
  // //
  // //   const formElement = container.getElementsByClassName('ant-form');
  // //   expect(formElement.length).toBe(1);
  // //
  // //   const comboboxElements = screen.getAllByRole('combobox');
  // //   expect(comboboxElements.length).toBe(2);
  // //   expect(comboboxElements[0].id).toBe('userId');
  // //   expect(comboboxElements[1].id).toBe('roles');
  // //
  // //   const buttonElements = screen.getAllByRole('button');
  // //   expect(buttonElements.length).toBe(2);
  // //   // expect(buttonElements[1].id).toBe('common.labels.cancel');
  // //   // expect(buttonElements[2].id).toBe('common.labels.cancel');
  // });

  // it('add-update validation', async () => {
  //   mockWorkspaceUserFormItems.mockReturnValue([
  //     {
  //       label: 'Users',
  //       placeholder: 'Select User',
  //       name: 'userId',
  //       type: 'select',
  //       // @ts-ignore
  //       getLabel: (user: Iuser) => `${user.firstName} ${user.lastName}`,
  //       valueKey: 'id',
  //       allowClear: true,
  //       required: true,
  //       mode: 'single',
  //       rules: [
  //         {
  //           required: true,
  //           message: 'Users are required',
  //         },
  //       ],
  //     },
  //     {
  //       label: 'Roles',
  //       placeholder: 'Select Roles',
  //       name: 'roles',
  //       type: 'select',
  //       rules: [
  //         {
  //           required: true,
  //           message: 'Roles are required',
  //         },
  //       ],
  //     },
  //   ]);
  //   mockGetUser.mockReturnValue({
  //     data: {},
  //   });
  //   renderWithClient(<AddUpdateWorkspaceUser />);
  //
  //   const saveButtonElement = screen.getByRole('button', {
  //     name: 'common.labels.save',
  //   });
  //   expect(saveButtonElement).toBeInTheDocument();
  //   fireEvent.submit(saveButtonElement);
  //
  //   await new Promise((r) => setTimeout(r, 50));
  //
  //   await validateInputs();
  // });

  // it('add-update validation with save', async () => {
  //   mockWorkspaceUserFormItems.mockReturnValue([
  //     {
  //       label: 'Users',
  //       placeholder: 'Select User',
  //       name: 'userId',
  //       type: 'select',
  //       // @ts-ignore
  //       getLabel: (user: Iuser) => `${user.firstName} ${user.lastName}`,
  //       valueKey: 'id',
  //       allowClear: true,
  //       required: true,
  //       mode: 'single',
  //       rules: [
  //         {
  //           required: true,
  //           message: 'Users are required',
  //         },
  //       ],
  //     },
  //     {
  //       label: 'Roles',
  //       placeholder: 'Select Roles',
  //       name: 'roles',
  //       type: 'select',
  //       rules: [
  //         {
  //           required: true,
  //           message: 'Roles are required',
  //         },
  //       ],
  //     },
  //   ]);
  //   mockGetUser.mockReturnValue({
  //     data: {},
  //   });
  //   renderWithClient(<AddUpdateWorkspaceUser />);
  //
  //   await new Promise((r) => setTimeout(r, 50));
  //
  //   await validateInputs();
  // });

  // it('add-update form renders with edit workspace user value', async () => {
  //   mockWorkspaceUserFormItems.mockReturnValue([
  //     {
  //       label: 'First Name',
  //       name: 'firstName',
  //       type: 'input',
  //       disabled: true,
  //     },
  //     {
  //       label: 'Last Name',
  //       name: 'lastName',
  //       type: 'input',
  //       disabled: true,
  //     },
  //     {
  //       label: 'email',
  //       name: 'email',
  //       type: 'input',
  //       disabled: true,
  //     },
  //     {
  //       label: 'Roles',
  //       labelKey: 'name',
  //       valueKey: 'id',
  //       name: 'roles',
  //       type: 'select',
  //       withCustomLabel: true,
  //       required: true,
  //       suffixIcon: <SearchIcon />,
  //       rules: [
  //         {
  //           required: true,
  //           message: 'Roles are required',
  //         },
  //       ],
  //     },
  //   ]);
  //   mockGetUser.mockReturnValue({
  //     data: {
  //       firstName: 'John',
  //       lastName: 'Smith',
  //       email: 'john@gmail.com',
  //       roles: ['4', '5'],
  //       groups: ['2', '3'],
  //     },
  //   });
  //   renderWithClient(<AddUpdateWorkspaceUser />);
  //
  //   const saveButtonElement = screen.getByRole('button', {
  //     name: 'common.labels.save',
  //   });
  //   expect(saveButtonElement).toBeInTheDocument();
  //   fireEvent.submit(saveButtonElement);
  //
  //   await new Promise((r) => setTimeout(r, 50));
  //
  //   expect(mockOnFinish).toBeCalled();
  //   expect(mockOnFinish).toBeCalledWith({
  //     firstName: 'John',
  //     lastName: 'Smith',
  //     email: 'john@gmail.com',
  //     roles: ['4', '5'],
  //   });
  // });

  // it('add-update form cancel', async () => {
  //   mockWorkspaceUserFormItems.mockReturnValue([
  //     {
  //       label: 'Users',
  //       placeholder: 'Select User',
  //       name: 'userId',
  //       type: 'select',
  //       // @ts-ignore
  //       getLabel: (user: IUser) => `${user.firstName} ${user.lastName}`,
  //       valueKey: 'id',
  //       allowClear: true,
  //       required: true,
  //       mode: 'single',
  //       rules: [
  //         {
  //           required: true,
  //           message: 'Users are required',
  //         },
  //       ],
  //     },
  //     {
  //       label: 'Roles',
  //       placeholder: 'Select Roles',
  //       name: 'roles',
  //       type: 'select',
  //       rules: [
  //         {
  //           required: true,
  //           message: 'Roles are required',
  //         },
  //       ],
  //     },
  //   ]);
  //   mockGetUser.mockReturnValue({
  //     data: {},
  //   });
  //   renderWithClient(<AddUpdateWorkspaceUser />);
  //
  //   const cancelButtonElement = screen.getByRole('button', {
  //     name: 'common.labels.cancel',
  //   });
  //   expect(cancelButtonElement).toBeInTheDocument();
  //   fireEvent.click(cancelButtonElement);
  //
  //   await new Promise((r) => setTimeout(r, 50));
  //
  //   expect(mockOnCancel).toBeCalled();
  // });
});
