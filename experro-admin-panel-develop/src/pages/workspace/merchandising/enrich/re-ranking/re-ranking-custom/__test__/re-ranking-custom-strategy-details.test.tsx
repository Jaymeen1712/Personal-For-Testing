import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithClient } from '../../../../../../../test';
import { ProductField } from '../re-ranking-custom-strategy-controller';
import ReRankingCustomStrategyDetails from '../re-ranking-custom-strategy-details';

const mockProductField1 = {
  id: 'fieldId1',
  title: 'fieldTitle1',
  type: 'text',
  typeIcon: <></>,
};
const mockProductField2 = {
  id: 'fieldId2',
  title: 'fieldTitle2',
  type: 'number',
  typeIcon: <></>,
};
const mockProductField3 = {
  id: 'fieldId3',
  title: 'fieldTitle3',
  type: 'number',
  typeIcon: <></>,
};
const mockProductField4 = {
  id: 'fieldId4',
  title: 'fieldTitle4',
  type: 'number',
  typeIcon: <></>,
};
const mockProductField = {
  id: 'fieldId1',
  title: 'fieldTitle1',
  type: 'text',
  typeIcon: <>typeIcon</>,
};

const mockNewSelectedStrategy = {
  strategy: 'default',
  properties: null,
};

const mockFields: Array<ProductField> = [
  mockProductField1,
  mockProductField2,
  mockProductField3,
  mockProductField4,
];
const mockSelectedWeightageFields: Array<ProductField> = [];
const mockUpdateActionEnabled = jest.fn();
const mockUpdateStrategy = jest.fn();
const mockSavedAction = false;
const mockUpdateSavedAction = jest.fn();
const mockOnSortLevel1Change = jest.fn();
const mockOnSortLevel2Change = jest.fn();
const mockOnWeightageFields = jest.fn();
const mockOnFieldWeightageFinish = jest.fn();
const mockOnAddWeightageFields = jest.fn();
const mockOnFieldWeightageChange = jest.fn();
const mockOnRemoveWeightageField = jest.fn();

jest.mock('../re-ranking-custom-strategy-controller', () => () => ({
  t: (name: string) => name,
  isFieldsLoading: false,
  productFields: mockFields,
  sortLevelFields1: [mockProductField1, mockProductField2, mockProductField4],
  sortLevelFields2: [mockProductField2, mockProductField3, mockProductField4],
  onSortLevel1Change: mockOnSortLevel1Change,
  onSortLevel2Change: mockOnSortLevel2Change,
  selectedWeightageFields: mockSelectedWeightageFields,
  isAddWeightedFieldEnabled: false,
  onWeightageFields: mockOnWeightageFields,
  onFieldWeightageFinish: mockOnFieldWeightageFinish,
  onFieldWeightageChange: mockOnFieldWeightageChange,
  onAddWeightageFields: mockOnAddWeightageFields,
  onRemoveWeightageField: mockOnRemoveWeightageField,
}));

describe('re-ranking-custom-strategy-details', () => {
  it('Given parameter When initial load Then render properly', async () => {
    renderWithClient(
      <ReRankingCustomStrategyDetails
        newSelectedStrategy={mockNewSelectedStrategy}
        updateStrategy={mockUpdateStrategy}
        updateActionEnabled={mockUpdateActionEnabled}
        isSavedAction={mockSavedAction}
        updateSavedAction={mockUpdateSavedAction}
      />
    );
    const sortLevel1Element = screen.getByRole('combobox', {
      name: 'common.labels.sort_level_one',
    });
    expect(sortLevel1Element).toBeEnabled();
    expect(sortLevel1Element).toBeInTheDocument();

    const sortLevel2Element = screen.getByTestId('fields');
    expect(sortLevel2Element).toBeInTheDocument();

    const fieldsElement = screen.getByTestId('fields');
    expect(fieldsElement).toBeInTheDocument();

    const addBtnElement = screen.getByRole('button', {
      name: 'common.labels.add',
    });
    expect(addBtnElement).toBeInTheDocument();
    expect(addBtnElement).toBeDisabled();
  });
  it('Given parameter When field selected Then render with fields', async () => {
    mockSelectedWeightageFields.push(mockProductField);
    renderWithClient(
      <ReRankingCustomStrategyDetails
        newSelectedStrategy={mockNewSelectedStrategy}
        updateStrategy={mockUpdateStrategy}
        updateActionEnabled={mockUpdateActionEnabled}
        isSavedAction={mockSavedAction}
        updateSavedAction={mockUpdateSavedAction}
      />
    );
    const sortLevel1Element = screen.getByRole('combobox', {
      name: 'common.labels.sort_level_one',
    });
    expect(sortLevel1Element).toBeEnabled();
    expect(sortLevel1Element).toBeInTheDocument();

    const sortLevel2Element = screen.getByTestId('fields');
    expect(sortLevel2Element).toBeInTheDocument();

    const fieldsElement = screen.getByTestId('fields');
    expect(fieldsElement).toBeInTheDocument();

    const addBtnElement = screen.getByRole('button', {
      name: 'common.labels.add',
    });
    expect(addBtnElement).toBeInTheDocument();
    expect(addBtnElement).toBeDisabled();

    const fieldNameElement = screen.getByText('fieldTitle1');
    expect(fieldNameElement).toBeInTheDocument();
    const fieldIconElement = screen.getByText('typeIcon');
    expect(fieldIconElement).toBeInTheDocument();
    const fieldInputElement = screen.getByTestId('field-input');
    expect(fieldInputElement).toBeInTheDocument();
    expect(fieldInputElement).toHaveAttribute('aria-valuemax', '100');
    expect(fieldInputElement).toHaveAttribute('aria-valuemin', '0');
    expect(fieldInputElement).toHaveAttribute(
      'id',
      'custom-stratey-form_fieldsWeightage_0_percentage'
    );
    const percentageElement = screen.getByText('%');
    expect(percentageElement).toBeInTheDocument();
  });

  it('Given parameter When field deselected Then render with fields', async () => {
    mockSelectedWeightageFields.push(mockProductField);
    renderWithClient(
      <ReRankingCustomStrategyDetails
        newSelectedStrategy={mockNewSelectedStrategy}
        updateStrategy={mockUpdateStrategy}
        updateActionEnabled={mockUpdateActionEnabled}
        isSavedAction={mockSavedAction}
        updateSavedAction={mockUpdateSavedAction}
      />
    );
    const removeFieldBtnElement = screen.getByTestId('remove-field-0');
    expect(removeFieldBtnElement).toBeInTheDocument();

    fireEvent.click(removeFieldBtnElement);
    expect(mockOnRemoveWeightageField).toBeCalled();
  });
});
