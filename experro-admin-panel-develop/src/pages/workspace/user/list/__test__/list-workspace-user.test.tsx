import React from 'react';
import ListWorkspaceUser from '../list-workspace-user';
import { renderWithClient } from '../../../../../test';

const mockSetFilter = jest.fn();
const mockUserReturn = jest.fn().mockReturnValue({});
const mockHideModal = jest.fn();
const mockOnDeleteUser = jest.fn();
const mockOnAddUser = jest.fn();
const mockLocation = jest.fn();
const mockHistory = jest.fn();
const mockGridData = jest.fn();
const mockCanCreateUser = jest.fn().mockReturnValue(true);

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useHistory: jest.fn().mockReturnValue(() => mockHistory())(),
    useParams: () => ({}),
    useLocation: () => jest.fn().mockReturnValue(() => mockLocation())(),
  };
});

jest.mock('../../../../../components/grid/grid-controller', () => () => ({
  data: mockGridData(),
}));

jest.mock('../list-workspace-user-controller', () => () => ({
  t: (name: string) => name,
  setFilter: mockSetFilter,
  columns: [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'roles',
      key: 'roles',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ],
  filter: 'Hello',
  userRolesOptions: [],
  user: mockUserReturn,
  hideModal: mockHideModal,
  onDeleteModalSubmit: mockOnDeleteUser,
  onAddUserClick: mockOnAddUser,
  canCreateUser: mockCanCreateUser(),
}));

describe('List Workspace User', () => {
  it('Component Render Properly', () => {
    mockCanCreateUser();
    mockGridData.mockReturnValue(['1', '2']);
    renderWithClient(<ListWorkspaceUser />);

    // const tableElement = screen.getByRole('table');
    // expect(tableElement).toBeInTheDocument();
  });
});
