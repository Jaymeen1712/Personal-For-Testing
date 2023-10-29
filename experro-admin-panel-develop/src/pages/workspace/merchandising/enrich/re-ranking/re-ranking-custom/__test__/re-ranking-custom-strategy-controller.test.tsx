import { renderHook } from '@testing-library/react-hooks';
import { wrapper } from '../../../../../../../test/utills';
import useReRankingCustomStrategyController from '../re-ranking-custom-strategy-controller';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useListProductField } from '../../../../services';
import useEnums from '../../../../../content-model/enums';
import { act } from '@testing-library/react';
import { IReRankingStrategy } from '../../../../../../../types';

const mockUpdateSavedAction = jest.fn();
const mockUpdateStrategy = jest.fn();
const mockNewSelectedStrategy: IReRankingStrategy = {
  strategy: 'default',
  properties: null,
};
const mockUpdateActionEnabled = jest.fn();
const mockFormSubmit = jest.fn();
const mockSetFieldsValue = jest.fn();
const mockValidateFields = jest.fn();
const mockGetFieldsValue = jest.fn();
const mockFormInstance = [
  {
    submit: mockFormSubmit,
    setFieldsValue: mockSetFieldsValue,
    validateFields: mockValidateFields,
    getFieldsValue: mockGetFieldsValue,
  },
];
const mockContentFieldTypes = [
  {
    key: 'text',
    icon: 'textIcon',
  },
  {
    key: 'number',
    icon: 'numberIcon',
  },
  {
    key: 'boolean',
    icon: 'booleanIcon',
  },
];
const mockListField = {
  data: [
    {
      fieldName: 'priceId',
      title: 'Price',
      type: 'string',
    },
    {
      fieldName: 'nameId',
      title: 'Name',
      type: 'string',
    },
    {
      fieldName: 'sizeId',
      title: 'Size',
      type: 'number',
    },
    {
      fieldName: 'featuredId',
      title: 'isFeatured',
      type: 'boolean',
    },
  ],
  isFetching: false,
};
const mockT = { t: jest.fn() };
const mockUseListProductField = jest.fn();
const mockWorkSpaceIdParams = jest.fn();
const mockOpenNotificationWithIcon = jest.fn();
const mockEnums = {
  CONTENT_FIELD_TYPES: mockContentFieldTypes,
};

jest.mock('antd', () => ({
  Form: { useForm: jest.fn() },
}));
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => mockWorkSpaceIdParams),
}));
jest.mock('../../../../services', () => ({
  useListProductField: jest
    .fn()
    .mockImplementation(() => mockUseListProductField),
}));
jest.mock('../../../../../../../utills', () => ({
  openNotificationWithIcon: jest
    .fn()
    .mockImplementation(() => mockOpenNotificationWithIcon),
}));
jest.mock('../../../../../content-model/enums', () => jest.fn());

describe('re-ranking-custom-strategy-controller', () => {
  beforeEach(() => {
    // @ts-ignore
    Form.useForm.mockReturnValue(mockFormInstance);
    // @ts-ignore
    useTranslation.mockReturnValue(mockT);
    // @ts-ignore
    useParams.mockReturnValue(mockWorkSpaceIdParams);
    // @ts-ignore
    useListProductField.mockReturnValue(mockListField);
    // @ts-ignore
    useEnums.mockReturnValue(mockEnums);
    // @ts-ignore
    useParams.mockReturnValue({ workspaceId: 'workspaceId' });
  });

  it('Given user not selected custom strategy Then render properly', async () => {
    const { result } = renderHook(
      () =>
        useReRankingCustomStrategyController({
          isSavedAction: false,
          updateSavedAction: mockUpdateSavedAction,
          updateStrategy: mockUpdateStrategy,
          newSelectedStrategy: mockNewSelectedStrategy,
          updateActionEnabled: mockUpdateActionEnabled,
        }),
      {
        wrapper,
      }
    );
    expect(result.current.t).toBe(mockT.t);
    expect(result.current.form).toBe(mockFormInstance[0]);
    expect(result.current.isFieldsLoading).toBe(false);
    expect(result.current.productFields.length).toBe(
      mockListField.data.length + 1
    );
    expect(result.current.productFields[0].id).toBe('priceId');
    expect(result.current.productFields[0].title).toBe('Price');
    expect(result.current.productFields[0].type).toBe('text');
    expect(result.current.productFields[0].typeIcon).toBe('textIcon');
    expect(result.current.productFields[1].type).toBe('text');
    expect(result.current.productFields[1].typeIcon).toBe('textIcon');
    expect(result.current.productFields[2].type).toBe('number');
    expect(result.current.productFields[2].typeIcon).toBe('numberIcon');
    expect(result.current.productFields[3].type).toBe('boolean');
    expect(result.current.productFields[3].typeIcon).toBe('booleanIcon');
    expect(result.current.selectedSortLevel1).toBe('priceId');
    expect(result.current.selectedSortLevel2).toBe('nameId');
    expect(
      result.current.sortLevelFields1.find(
        (f) => f.id === result.current.selectedSortLevel2
      )
    ).toBe(undefined);
    expect(
      result.current.sortLevelFields2.find(
        (f) => f.id === result.current.selectedSortLevel1
      )
    ).toBe(undefined);
    expect(useListProductField).toBeCalledWith('workspaceId', 're-ranking', '');
  });

  it('Given user not selected custom strategy When onSortLevel1Change call Then change sortLevelField accordingly', async () => {
    const { result } = renderHook(
      () =>
        useReRankingCustomStrategyController({
          isSavedAction: false,
          updateSavedAction: mockUpdateSavedAction,
          updateStrategy: mockUpdateStrategy,
          newSelectedStrategy: mockNewSelectedStrategy,
          updateActionEnabled: mockUpdateActionEnabled,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onSortLevel1Change('sizeId');
    });

    expect(result.current.selectedSortLevel1).toBe('sizeId');
    expect(result.current.selectedSortLevel2).toBe('nameId');
    expect(
      result.current.sortLevelFields1.find(
        (f) => f.id === result.current.selectedSortLevel2
      )
    ).toBe(undefined);
    expect(
      result.current.sortLevelFields2.find(
        (f) => f.id === result.current.selectedSortLevel1
      )
    ).toBe(undefined);
  });

  it('Given user not selected custom strategy When onSortLevel2Change call Then change sortLevelField accordingly', async () => {
    const { result } = renderHook(
      () =>
        useReRankingCustomStrategyController({
          isSavedAction: false,
          updateSavedAction: mockUpdateSavedAction,
          updateStrategy: mockUpdateStrategy,
          newSelectedStrategy: mockNewSelectedStrategy,
          updateActionEnabled: mockUpdateActionEnabled,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onSortLevel2Change('sizeId');
    });

    expect(result.current.selectedSortLevel1).toBe('priceId');
    expect(result.current.selectedSortLevel2).toBe('sizeId');
    expect(
      result.current.sortLevelFields1.find(
        (f) => f.id === result.current.selectedSortLevel2
      )
    ).toBe(undefined);
    expect(
      result.current.sortLevelFields2.find(
        (f) => f.id === result.current.selectedSortLevel1
      )
    ).toBe(undefined);
  });

  it('Given user not selected custom strategy When onWeightageFields & onAddWeightageFields call Then addField for percentage weight', async () => {
    mockGetFieldsValue.mockReturnValue({ fieldsWeightage: 'fieldsWeightage' });
    const { result } = renderHook(
      () =>
        useReRankingCustomStrategyController({
          isSavedAction: false,
          updateSavedAction: mockUpdateSavedAction,
          updateStrategy: mockUpdateStrategy,
          newSelectedStrategy: mockNewSelectedStrategy,
          updateActionEnabled: mockUpdateActionEnabled,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      // result.current.onWeightageFields(['featuredId']);
      result.current.onAddWeightageFields();
    });

    // expect(result.current.selectedWeightageFields.length).toBe(1);
    // expect(result.current.selectedWeightageFields[0].id).toBe('featuredId');
    // expect(result.current.selectedWeightageFields[0].title).toBe('isFeatured');
    // expect(result.current.selectedWeightageFields[0].typeIcon).toBe(
    //   'booleanIcon'
    // );
  });

  it('Given user not selected custom strategy & action save Then submit form', async () => {
    const { result } = renderHook(
      () =>
        useReRankingCustomStrategyController({
          isSavedAction: true,
          updateSavedAction: mockUpdateSavedAction,
          updateStrategy: mockUpdateStrategy,
          newSelectedStrategy: mockNewSelectedStrategy,
          updateActionEnabled: mockUpdateActionEnabled,
        }),
      {
        wrapper,
      }
    );

    expect(result.current.form.submit).toBeCalled();
    expect(mockUpdateSavedAction).toBeCalledWith(false);
  });

  it('Given user selected custom strategy Then render properly', async () => {
    mockNewSelectedStrategy.properties = {
      sortOrders: {
        level1: 'sizeId',
        level2: 'priceId',
      },
      fieldsWeightage: [{ title: 'nameId', percentage: 100 }],
    };
    const { result } = renderHook(
      () =>
        useReRankingCustomStrategyController({
          isSavedAction: false,
          updateSavedAction: mockUpdateSavedAction,
          updateStrategy: mockUpdateStrategy,
          newSelectedStrategy: mockNewSelectedStrategy,
          updateActionEnabled: mockUpdateActionEnabled,
        }),
      {
        wrapper,
      }
    );
    expect(result.current.selectedSortLevel1).toBe('sizeId');
    expect(result.current.selectedSortLevel2).toBe('priceId');

    // expect(onWeightageFieldDeselect.current.selectedWeightageFields[0].id).toBe('nameId');
  });

  it('Given user selected custom strategy When onFieldWeightageFinish call success Then call updateStrategy', async () => {
    mockValidateFields.mockReturnValue({
      sortOrders: {
        level1: 'nameId',
        level2: 'sizeId',
      },
      fields: ['name'],
      fieldsWeightage: [{ percentage: 100 }],
    });
    const { result, waitFor } = renderHook(
      () =>
        useReRankingCustomStrategyController({
          isSavedAction: false,
          updateSavedAction: mockUpdateSavedAction,
          updateStrategy: mockUpdateStrategy,
          newSelectedStrategy: mockNewSelectedStrategy,
          updateActionEnabled: mockUpdateActionEnabled,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onFieldWeightageFinish();
    });
    await waitFor(() => undefined);

    expect(mockUpdateStrategy).toBeCalledWith({
      properties: {
        fieldsWeightage: [
          {
            percentage: 100,
            title: 'name',
          },
        ],
        sortOrders: { level1: 'nameId', level2: 'sizeId' },
      },
      strategy: 'default',
    });
  });

  it('Given user selected custom strategy When onFieldWeightageFinish call and percentage undefined Then show error', async () => {
    mockValidateFields.mockReturnValue({
      sortOrders: {
        level1: 'nameId',
        level2: 'sizeId',
      },
      fields: ['name'],
      fieldsWeightage: [{ percentage: undefined }],
    });
    const { result, waitFor } = renderHook(
      () =>
        useReRankingCustomStrategyController({
          isSavedAction: false,
          updateSavedAction: mockUpdateSavedAction,
          updateStrategy: mockUpdateStrategy,
          newSelectedStrategy: mockNewSelectedStrategy,
          updateActionEnabled: mockUpdateActionEnabled,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onFieldWeightageFinish();
    });
    await waitFor(() => undefined);

    expect(mockT.t).toBeCalledWith(
      'common.messages.custom_strategy_field_percentage_zero_error'
    );
  });

  it('Given user selected custom strategy When onFieldWeightageFinish call and percentage greater then 100 Then show error message', async () => {
    mockValidateFields.mockReturnValue({
      sortOrders: {
        level1: 'nameId',
        level2: 'sizeId',
      },
      fields: ['name', 'score'],
      fieldsWeightage: [{ percentage: 80 }, { percentage: 40 }],
    });
    const { result, waitFor } = renderHook(
      () =>
        useReRankingCustomStrategyController({
          isSavedAction: false,
          updateSavedAction: mockUpdateSavedAction,
          updateStrategy: mockUpdateStrategy,
          newSelectedStrategy: mockNewSelectedStrategy,
          updateActionEnabled: mockUpdateActionEnabled,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onFieldWeightageFinish();
    });

    await waitFor(() => undefined);

    expect(mockT.t).toBeCalledWith(
      'common.messages.custom_strategy_field_percentage_error'
    );
  });

  it('Given user selected custom strategy When onFieldWeightageFinish call and fields not selected Then show error message', async () => {
    mockValidateFields.mockReturnValue({
      sortOrders: {
        level1: 'nameId',
        level2: 'sizeId',
      },
      fields: ['name'],
    });
    const { result, waitFor } = renderHook(
      () =>
        useReRankingCustomStrategyController({
          isSavedAction: false,
          updateSavedAction: mockUpdateSavedAction,
          updateStrategy: mockUpdateStrategy,
          newSelectedStrategy: mockNewSelectedStrategy,
          updateActionEnabled: mockUpdateActionEnabled,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onFieldWeightageFinish();
    });

    await waitFor(() => undefined);

    expect(mockT.t).toBeCalledWith(
      'common.messages.custom_strategy_fields_not_added_error'
    );
  });

  it('Given user selected custom strategy When field deselect call Then remove from weightage field', async () => {
    mockGetFieldsValue.mockReturnValue({
      fields: ['nameId', 'priceId'],
      fieldsWeightage: [10],
    });
    renderHook(
      () =>
        useReRankingCustomStrategyController({
          isSavedAction: false,
          updateSavedAction: mockUpdateSavedAction,
          updateStrategy: mockUpdateStrategy,
          newSelectedStrategy: mockNewSelectedStrategy,
          updateActionEnabled: mockUpdateActionEnabled,
        }),
      {
        wrapper,
      }
    );

    // await waitFor(() => undefined);

    // result.current.onWeightageFieldDeselect('priceId');

    // expect(mockSetFieldsValue).toBeCalledWith({
    //   fields: ['nameId'],
    //   fieldsWeightage: [10],
    // });
    // expect(mockUpdateActionEnabled).toBeCalledWith(true);
    // expect(result.current.isAddWeightedFieldEnabled).toBe(false);
  });

  it('Given user selected custom strategy When remove weightage field call Then remove from weightage field', async () => {
    mockGetFieldsValue.mockReturnValue({
      fields: ['nameId', 'priceId'],
      fieldsWeightage: [10],
    });
    const { result, waitFor } = renderHook(
      () =>
        useReRankingCustomStrategyController({
          isSavedAction: false,
          updateSavedAction: mockUpdateSavedAction,
          updateStrategy: mockUpdateStrategy,
          newSelectedStrategy: mockNewSelectedStrategy,
          updateActionEnabled: mockUpdateActionEnabled,
        }),
      {
        wrapper,
      }
    );

    await waitFor(() => undefined);

    act(() => {
      result.current.onRemoveWeightageField({
        id: 'priceId',
        title: 'Price',
        type: 'text',
        typeIcon: <div></div>,
      });
    });

    // expect(mockSetFieldsValue).toBeCalledWith({
    //   fields: ['nameId'],
    //   fieldsWeightage: [10],
    // });
    // expect(mockUpdateActionEnabled).toBeCalledWith(true);
    // expect(result.current.isAddWeightedFieldEnabled).toBe(false);
  });

  it('Given any strategy When onFieldWeightageChange call Then enable action button', async () => {
    const { result, waitFor } = renderHook(
      () =>
        useReRankingCustomStrategyController({
          isSavedAction: false,
          updateSavedAction: mockUpdateSavedAction,
          updateStrategy: mockUpdateStrategy,
          newSelectedStrategy: mockNewSelectedStrategy,
          updateActionEnabled: mockUpdateActionEnabled,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onFieldWeightageChange();
    });

    await waitFor(() => undefined);

    expect(mockUpdateActionEnabled).toBeCalledWith(true);
  });
});
