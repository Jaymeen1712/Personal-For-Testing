import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import CreateUpdateGroup from '../create-update-group';
import { renderWithClient } from '../../../../../test';

const mockHistory = jest.fn();
const mockLocation = jest.fn();
const mockDetailsGroup = jest.fn();
const mockCancel = jest.fn();
const mockOnFinish = jest.fn();
const mockOnFinishFailed = jest.fn();
const mockOnSaveAndAddNewClick = jest.fn();
const mockOnSaveAndUpdateClick = jest.fn();
const mockListRoles = jest.fn().mockReturnValue({
  isSuccess: true,
});
const mockListUsers = jest.fn().mockReturnValue({ isSuccess: true });

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

jest.mock('../create-update-group-controller', () => () => ({
  groupId: null,
  t: (name: string) => name,
  onFinish: mockOnFinish,
  onFinishFailed: mockOnFinishFailed,
  detailsGroup: mockDetailsGroup(),
  onSaveAndAddNewClick: mockOnSaveAndAddNewClick,
  onSaveAndUpdateClick: mockOnSaveAndUpdateClick,
  onCancel: mockCancel,
  listRoles: mockListRoles,
  listUsers: mockListUsers,
}));

describe('CreateUpdateGroup', () => {
  // const validateInputs = async () => {
  //   // let alertElements = screen.getAllByRole('alert');
  //   // expect(alertElements.length).toBe(3);
  //
  //   fireEvent.change(
  //     screen.getByRole('textbox', { name: 'common.labels.groupName' }),
  //     {
  //       target: { value: '' },
  //     }
  //   );
  //
  //   await new Promise((r) => setTimeout(r, 50));
  //
  //   // alertElements = screen.getAllByRole('alert');
  //   // expect(alertElements.length).toBe(3);
  //   // expect(alertElements[0].innerHTML).toBe('common.messages.required');
  // };

  it('create-Update render properly', () => {
    mockDetailsGroup.mockReturnValue({
      data: {},
    });

    const { container } = renderWithClient(<CreateUpdateGroup />);

    // eslint-disable-next-line testing-library/no-container,testing-library/no-node-access
    const formElement = container.getElementsByClassName('ant-form');
    expect(formElement.length).toBe(1);

    const textElements = screen.getAllByRole('textbox');
    expect(textElements.length).toBe(2);
    expect(textElements[0].id).toBe('group-form_name');
    expect(textElements[1].id).toBe('group-form_description');

    const buttonElements = screen.getAllByRole('button');
    expect(buttonElements.length).toBe(2);
    expect(buttonElements[1].id).toBe('common.labels.cancel');
    // expect(buttonElements[2].id).toBe('common.labels.cancel');
  });

  it('create-update validation', async () => {
    mockDetailsGroup.mockReturnValue({
      data: {},
    });
    renderWithClient(<CreateUpdateGroup />);

    const saveButtonElement = screen.getByRole('button', {
      name: 'common.labels.save',
    });
    expect(saveButtonElement).toBeInTheDocument();

    fireEvent.submit(saveButtonElement);

    await new Promise((r) => setTimeout(r, 50));
  });

  it('create-update form renders with edit group value', async () => {
    mockDetailsGroup.mockReturnValue({
      data: {
        groupName: 'Hello World',
        groupDescription: 'Hello ?',
        roleIds: [
          '8efd08d7-591e-4c39-be19-1c4dc440e9a3',
          'ff1b14ec-f26c-4e73-9c9b-38ebec3383b9',
        ],
        userIds: [
          '9646c3ca-816b-41cd-8dc7-b9ed4c53b19c',
          '98d9d0b4-c35e-4461-b34e-5f05489cdc6b',
        ],
      },
    });

    renderWithClient(<CreateUpdateGroup />);

    const saveButtonElement = screen.getByRole('button', {
      name: 'common.labels.save',
    });
    expect(saveButtonElement).toBeInTheDocument();

    fireEvent.submit(saveButtonElement);

    await new Promise((r) => setTimeout(r, 500));
  });

  it('create-update from cancel', async () => {
    mockDetailsGroup.mockReturnValue({
      data: {},
    });

    renderWithClient(<CreateUpdateGroup />);

    const cancelButtonElement = screen.getByRole('button', {
      name: 'common.labels.cancel',
    });
    expect(cancelButtonElement).toBeInTheDocument();

    fireEvent.click(cancelButtonElement);

    await new Promise((r) => setTimeout(r, 50));

    expect(mockCancel).toBeCalled();
  });
});
