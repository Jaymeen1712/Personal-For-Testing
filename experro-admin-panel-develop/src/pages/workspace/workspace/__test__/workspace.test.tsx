import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import Workspace from '../workspace';
import { renderWithClient } from '../../../../test';

const mockOnFinish = jest.fn();
const mockTimeZones = jest.fn();
const mockListCurrency = jest.fn();
const mockListTimeZones = jest.fn();
const mockDetailsWorkspace = jest.fn();
const mockIsButtonVisible = jest.fn();
const mockCanManageGlobalWorkspace = jest.fn();
const mockUpdateWorkspace = jest.fn();

jest.mock('../workspace-controller', () => () => ({
  t: (name: string) => name,
  timezone: mockTimeZones(),
  onFinish: mockOnFinish,
  isButtonDisable: mockIsButtonVisible,
  canManageGlobalWorkspace: mockCanManageGlobalWorkspace,
  detailsWorkspace: mockDetailsWorkspace(),
  listCurrency: mockListCurrency(),
  listTimeZones: mockListTimeZones(),
  updateWorkspace: mockUpdateWorkspace,
}));

describe('workspace', () => {
  it('create-update render properly for update', () => {
    mockDetailsWorkspace.mockReturnValueOnce({
      data: {},
    });
    const { container } = renderWithClient(<Workspace />);

    const formElement = container.getElementsByClassName('ant-form');
    expect(formElement.length).toBe(1);

    const textElements = screen.getAllByRole('textbox');
    expect(textElements.length).toBe(2);
    expect(textElements[0].id).toBe('workspace-form_name');
    expect(textElements[1].id).toBe('workspace-form_description');

    const currencySelector = container.getElementsByClassName(
      'ant-select-selection-item'
    )[1];
    expect(currencySelector.getAttribute('title')).toBe('USD');

    const selectors = screen.getAllByRole('combobox');
    expect(selectors.length).toBe(3);
    expect(selectors[1].id).toBe('workspace-form_timezone');
    expect(selectors[2].id).toBe('workspace-form_currency');

    const buttonElements = screen.getAllByRole('button');
    expect(buttonElements.length).toBe(4);
    expect(buttonElements[1].id).toBe('');
    expect(buttonElements[2].id).toBe('common.labels.update');
  });

  it('workspace render with value', () => {
    mockDetailsWorkspace.mockReturnValueOnce({
      data: {
        id: '11111',
        name: 'workspace1',
        description: 'description',
        timezone: 'UTC',
        storeLink: 'https://uduHyk.experro.com/nish',
        currency: 'INR',
      },
    });
    const { container } = renderWithClient(<Workspace />);
    const textElements = screen.getAllByRole('textbox');
    expect(textElements[0]).toHaveValue('workspace1');
    const selectors = container.getElementsByClassName(
      'ant-select-selection-item'
    );
    expect(selectors[1].getAttribute('title')).toBe('UTC');
    expect(selectors[2].getAttribute('title')).toBe('INR');
  });

  it('renders list of timezones and currency', () => {
    mockListTimeZones.mockReturnValueOnce({
      data: [{ value: 'Test', label: 'Test' }],
    });
    mockListCurrency.mockReturnValueOnce({
      data: [{ value: 'Test', label: 'Test' }],
    });
    renderWithClient(<Workspace />);
  });

  it('onDelete Button Click', async () => {
    renderWithClient(<Workspace />);

    const deleteButtonElement = screen.getByRole('button', {
      name: 'common.labels.delete_workspace',
    });
    expect(deleteButtonElement).toBeInTheDocument();
    fireEvent.submit(deleteButtonElement);

    await new Promise((r) => setTimeout(r, 50));
  });
});
