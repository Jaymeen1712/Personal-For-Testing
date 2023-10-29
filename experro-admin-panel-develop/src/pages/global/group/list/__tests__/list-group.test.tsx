import React from 'react';
import ListGroup from '../list-group';
import { renderWithClient } from '../../../../../test';

const mockSetFilter = jest.fn();
const mockGroupReturn = jest.fn().mockReturnValue({});
const mockHideModal = jest.fn();
const mockOnDeleteGroup = jest.fn();
const mockOnAddGroup = jest.fn();
const mockLocation = jest.fn();
const mockHistory = jest.fn();
const mockGridData = jest.fn();

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

jest.mock('../list-group-controller', () => () => ({
  t: (name: string) => name,
  setFilter: mockSetFilter,
  columns: [
    {
      title: 'group Name',
      dataIndex: 'groupName',
      key: 'groupName',
    },
    {
      title: 'users',
      dataIndex: 'users',
      key: 'users',
    },
  ],
  filter: 'Hello',
  group: mockGroupReturn,
  hideModal: mockHideModal,
  onDeleteGroup: mockOnDeleteGroup,
  onAddGroup: mockOnAddGroup,
}));

describe('List Group', () => {
  it('Component Render Properly', () => {
    mockGridData.mockReturnValue(['1', '2']);
    renderWithClient(<ListGroup />);

    // const tableElement = screen.getByRole('table');
    // expect(tableElement).toBeInTheDocument();
  });
});
