import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import CreateUpdateUser from '../create-update-user';
import { renderWithClient } from '../../../../../test';

const mockHistory = jest.fn();
const mockGetUser = jest.fn();
const mockCancel = jest.fn();
const mockOnSaveAndAddNewClick = jest.fn();
const mockOnFinish = jest.fn();
const mockOnFinishFailed = jest.fn();
const mockLocation = jest.fn();
const mockUserId = jest.fn().mockReturnValue(null);
const mockListRoles = jest.fn().mockReturnValue({
  isSuccess: true,
});
const mockListGroup = jest.fn().mockReturnValue({
  isSuccess: true,
});

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

jest.mock('../create-update-user-controller', () => () => ({
  userId: mockUserId(),
  t: (name: string) => name,
  getUser: mockGetUser(),
  onCancel: mockCancel,
  onSaveAndAddNewClick: mockOnSaveAndAddNewClick,
  onFinish: mockOnFinish,
  onFinishFailed: mockOnFinishFailed,
  listRoles: mockListRoles,
  listGroup: mockListGroup,
}));

describe('CreateUpdateUser', () => {
  it('create-update render properly', () => {
    mockGetUser.mockReturnValue({
      data: {},
    });
    const { container } = renderWithClient(<CreateUpdateUser />);

    const formElement = container.getElementsByClassName('ant-form');
    expect(formElement.length).toBe(1);

    const textElements = screen.getAllByRole('textbox');

    expect(textElements.length).toBe(3);
    expect(textElements[0].id).toBe('user-form_firstName');
    expect(textElements[1].id).toBe('user-form_lastName');
    expect(textElements[2].id).toBe('user-form_email');

    const buttonElements = screen.getAllByRole('button');
    expect(buttonElements.length).toBe(3);
    expect(buttonElements[1].id).toBe('common.labels.save_add_new');
    // expect(buttonElements[2].id).toBe('common.labels.cancel');
    // expect(buttonElements[3].id).toBe('common.labels.save');
  });

  it('create-update render properly for update', () => {
    mockUserId.mockReturnValue('123');
    mockGetUser.mockReturnValue({
      data: {},
    });
    const { container } = renderWithClient(<CreateUpdateUser />);

    const formElement = container.getElementsByClassName('ant-form');
    expect(formElement.length).toBe(1);

    const textElements = screen.getAllByRole('textbox');

    expect(textElements.length).toBe(3);
    expect(textElements[0].id).toBe('user-form_firstName');
    expect(textElements[1].id).toBe('user-form_lastName');
    expect(textElements[2].id).toBe('user-form_email');

    const buttonElements = screen.getAllByRole('button');
    expect(buttonElements.length).toBe(2);
    expect(buttonElements[1].id).toBe('common.labels.cancel');
    // expect(buttonElements[2].id).toBe('common.labels.save');
  });

  it('create-update form renders with edit user value', async () => {
    mockGetUser.mockReturnValue({
      data: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@gmail.com',
        roles: ['4', '5'],
        groups: ['2', '3'],
      },
    });
    renderWithClient(<CreateUpdateUser />);

    const saveButtonElement = screen.getByRole('button', {
      name: 'common.labels.save',
    });
    expect(saveButtonElement).toBeInTheDocument();
    fireEvent.submit(saveButtonElement);

    await new Promise((r) => setTimeout(r, 50));

    expect(mockOnFinish).toBeCalled();
  });
});
