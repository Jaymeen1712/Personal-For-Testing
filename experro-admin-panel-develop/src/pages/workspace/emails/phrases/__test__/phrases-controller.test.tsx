import { renderHook } from '@testing-library/react-hooks';
import { renderWithClient, wrapper } from '../../../../../test/utills';
import { fireEvent, screen, waitFor, act } from '@testing-library/react';
import usePhrasesController from '../phrases-controller';
import * as utills from '../../../../../utills';
import { useRef } from 'react';

const mockParams = jest.fn();
const mockSetFields = jest.fn();
const mockValidateFields = jest.fn();

const mockResetFields = jest.fn();
const mockGetFieldValue = jest.fn();
const mockSetFieldsValue = jest.fn();

const mockClose = jest.fn();
const mockCanUpdateEmailTemplatesTemplate = jest.fn();

const spyOpenNotificationWithIcon = jest.spyOn(
  utills,
  'openNotificationWithIcon'
);

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn().mockReturnValue(() => mockParams())(),
  };
});

jest.mock('lodash', () => {
  const originalModule = jest.requireActual('lodash');

  return {
    ...originalModule,
    //@ts-ignore
    debounce: (fn) => {
      fn.cancel = mockClose;
      return fn;
    },
  };
});

jest.mock('antd', () => {
  const originalModule = jest.requireActual('antd');

  return {
    __esModule: true,
    ...originalModule,
    Form: {
      useForm: () => [
        {
          setFields: mockSetFields,
          validateFields: jest
            .fn()
            .mockReturnValue(() => mockValidateFields())(),
          resetFields: mockResetFields,
          getFieldValue: jest.fn().mockReturnValue(() => mockGetFieldValue())(),
          setFieldsValue: mockSetFieldsValue,
        },
      ],
    },
  };
});

jest.mock('../../../../../hooks/permissions', () => () => ({
  canReadEmailTemplatesTemplate: jest.fn().mockReturnValue(true),
  canUpdateEmailTemplatesTemplate: jest
    .fn()
    .mockReturnValue(() => mockCanUpdateEmailTemplatesTemplate())(),
  canDeleteEmailTemplatesTemplate: jest.fn().mockReturnValue(true),
  canCreateEmailTemplatesTemplate: jest.fn().mockReturnValue(true),
}));

describe('usePhrasesController', () => {
  beforeEach(() => {
    mockParams.mockReturnValue({
      workspaceId: '1234',
    });
  });

  it.skip('defaultActiveKey is not phrases', () => {
    const emailRef = useRef(null);
    const { result } = renderHook(
      () =>
        usePhrasesController({
          defaultActiveKey: '',
          emailRef: emailRef,
        }),
      {
        wrapper,
      }
    );

    expect(result.current.filter).toBe('');
  });

  it.skip('onHideDeleteModalVisible', () => {
    const emailRef = useRef(null);
    const { result } = renderHook(
      () =>
        usePhrasesController({
          defaultActiveKey: 'phrases',
          emailRef: emailRef,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onHideDeleteModalVisible();
    });

    expect(result.current.isDeleteModalVisible).toBeFalsy();
  });

  it.skip('addPhrase', () => {
    const emailRef = useRef(null);
    const { result } = renderHook(
      () =>
        usePhrasesController({
          defaultActiveKey: 'phrases',
          emailRef: emailRef,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.addPhrase();
    });

    expect(result.current.isCreateUpdatePhrasesModalVisible).toBeTruthy();
  });

  it.skip('onHideCreateUpdatePhraseModal', () => {
    const emailRef = useRef(null);
    const { result } = renderHook(
      () =>
        usePhrasesController({
          defaultActiveKey: 'phrases',
          emailRef: emailRef,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onHideCreateUpdatePhraseModal();
    });

    expect(result.current.editRecordId).toBeDefined();
    expect(result.current.shortCode).toBeDefined();
    expect(result.current.isCreateUpdatePhrasesModalVisible).toBeFalsy();
  });

  it.skip('onNameChange with name', () => {
    const emailRef = useRef(null);
    mockGetFieldValue.mockReturnValue('TestName');

    const { result } = renderHook(
      () =>
        usePhrasesController({
          defaultActiveKey: 'phrases',
          emailRef: emailRef,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onNameChange();
    });

    expect(result.current.shortCode).toBe('{{TestName}}');
  });

  it.skip('onNameChange without name', () => {
    const emailRef = useRef(null);
    mockGetFieldValue.mockReturnValue('');

    const { result } = renderHook(
      () =>
        usePhrasesController({
          defaultActiveKey: 'phrases',
          emailRef: emailRef,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onNameChange();
    });

    expect(result.current.shortCode).toBe('');
  });

  it.skip('onAddPhrase with all data', async () => {
    mockValidateFields.mockReturnValue({
      id: 'p1',
      name: 'TestName',
      value: 'Name',
      shortCode: '{{TestName}}',
    });
    const emailRef = useRef(null);

    const { result } = renderHook(
      () =>
        usePhrasesController({
          defaultActiveKey: 'phrases',
          emailRef: emailRef,
        }),
      {
        wrapper,
      }
    );

    result.current.onAddPhrase();

    await waitFor(() => expect(mockResetFields).toBeCalled());
  });

  it.skip('onAddPhrase without name', async () => {
    const emailRef = useRef(null);
    mockValidateFields.mockReturnValue({
      id: 'p1',
      name: '',
      value: 'Name',
      shortCode: '{{TestName}}',
    });

    const { result } = renderHook(
      () =>
        usePhrasesController({
          defaultActiveKey: 'phrases',
          emailRef: emailRef,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onAddPhrase();
    });

    await waitFor(() => expect(mockSetFields).toBeCalled());
  });

  it.skip('onAddPhrase with name more than 255 characters', async () => {
    mockValidateFields.mockReturnValue({
      id: 'p1',
      name: 'TestName'.repeat(32),
      value: 'Name',
      shortCode: '{{TestName}}',
    });
    const emailRef = useRef(null);

    const { result } = renderHook(
      () =>
        usePhrasesController({
          defaultActiveKey: 'phrases',
          emailRef: emailRef,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onAddPhrase();
    });

    await waitFor(() => expect(mockSetFields).toBeCalled());
  });

  it.skip('onAddPhrase with inappropriate name format', async () => {
    mockValidateFields.mockReturnValue({
      id: 'p1',
      name: 'TestName1',
      value: 'Name',
      shortCode: '{{TestName}}',
    });
    const emailRef = useRef(null);

    const { result } = renderHook(
      () =>
        usePhrasesController({
          defaultActiveKey: 'phrases',
          emailRef: emailRef,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onAddPhrase();
    });

    await waitFor(() => expect(mockSetFields).toBeCalled());
  });

  it.skip('onAddPhrase without value', async () => {
    mockValidateFields.mockReturnValue({
      id: 'p1',
      name: 'TestName',
      value: '',
      shortCode: '{{TestName}}',
    });
    const emailRef = useRef(null);

    const { result } = renderHook(
      () =>
        usePhrasesController({
          defaultActiveKey: 'phrases',
          emailRef: emailRef,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onAddPhrase();
    });

    await waitFor(() => expect(mockSetFields).toBeCalled());
  });

  it.skip('onAddPhrase with value more than 255 characters', async () => {
    mockValidateFields.mockReturnValue({
      id: 'p1',
      name: 'TestName',
      value: 'Name'.repeat(64),
      shortCode: '{{TestName}}',
    });
    const emailRef = useRef(null);

    const { result } = renderHook(
      () =>
        usePhrasesController({
          defaultActiveKey: 'phrases',
          emailRef: emailRef,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      result.current.onAddPhrase();
    });

    await waitFor(() => expect(mockSetFields).toBeCalled());
  });

  it.skip('onFilterChange', () => {
    const emailRef = useRef(null);
    const { result } = renderHook(
      () =>
        usePhrasesController({
          defaultActiveKey: 'phrases',
          emailRef: emailRef,
        }),
      {
        wrapper,
      }
    );

    act(() => {
      //@ts-ignore
      result.current.onFilterChange({ target: { value: 'Test' } });
    });

    expect(result.current.filter).toBe('');

    act(() => {
      //@ts-ignore
      result.current.onFilterChange({ target: { value: '' } });
    });

    // expect(mockClose).toBeCalledTimes(1);
    expect(result.current.filter).toBe('');
  });

  it.skip('edit phrase with name', async () => {
    mockCanUpdateEmailTemplatesTemplate.mockReturnValue(true);
    mockValidateFields.mockReturnValue({
      id: 'p1',
      name: 'TestName',
      value: 'Testing',
      shortCode: '{{TestName}}',
    });
    const emailRef = useRef(null);

    const { result } = renderHook(
      () =>
        usePhrasesController({
          defaultActiveKey: 'phrases',
          emailRef: emailRef,
        }),
      {
        wrapper,
      }
    );

    renderWithClient(
      //@ts-ignore
      result.current.columns[0].render('TestName', {
        id: 'p1',
        name: 'TestName',
        value: 'Testing',
        shortCode: '{{TestName}}',
      })
    );

    const nameLabel = screen.getByText('TestName');
    expect(nameLabel).toBeInTheDocument();

    const optionsDropdownList = screen.getByRole('button');
    fireEvent.click(optionsDropdownList);

    const editPhraseOption = screen.getByText('common.labels.edit');
    fireEvent.click(editPhraseOption);

    expect(result.current.shortCode).toBe('{{TestName}}');
    expect(result.current.editRecordId).toBe('p1');

    result.current.onAddPhrase();

    await waitFor(() => expect(spyOpenNotificationWithIcon).toBeCalled());
  });

  it.skip('phrase without name', () => {
    mockCanUpdateEmailTemplatesTemplate.mockReturnValue(false);
    const emailRef = useRef(null);

    const { result } = renderHook(
      () =>
        usePhrasesController({
          defaultActiveKey: 'phrases',
          emailRef: emailRef,
        }),
      {
        wrapper,
      }
    );

    renderWithClient(
      //@ts-ignore
      result.current.columns[0].render('', {
        id: 'p1',
        name: '',
        value: 'Testing',
        shortCode: '{{TestName}}',
      })
    );

    const nameLabel = screen.getByText('-');
    expect(nameLabel).toBeInTheDocument();
  });

  it.skip('delete phrase', async () => {
    mockCanUpdateEmailTemplatesTemplate.mockReturnValue(true);
    const emailRef = useRef(null);

    const { result } = renderHook(
      () =>
        usePhrasesController({
          defaultActiveKey: 'phrases',
          emailRef: emailRef,
        }),
      {
        wrapper,
      }
    );

    renderWithClient(
      //@ts-ignore
      result.current.columns[0].render('TestName', {
        id: 'p1',
        name: 'TestName',
        value: 'Testing',
        shortCode: '{{TestName}}',
      })
    );

    const nameLabel = screen.getByText('TestName');
    expect(nameLabel).toBeInTheDocument();

    const optionsDropdownList = screen.getByRole('button');
    fireEvent.click(optionsDropdownList);

    const deletePhraseOption = screen.getByText('common.labels.delete');
    fireEvent.click(deletePhraseOption);

    result.current.onDeletePhrase();

    // await new Promise((r) => setTimeout(r, 500));

    // expect(result.current.isDeleteModalVisible).toBeFalsy();
  });

  it.skip('phrase with shortCode and its pagination', async () => {
    const emailRef = useRef(null);
    const { result } = renderHook(
      () =>
        usePhrasesController({
          defaultActiveKey: 'phrases',
          emailRef: emailRef,
        }),
      {
        wrapper,
      }
    );

    renderWithClient(
      //@ts-ignore
      result.current.columns[2].render('{{TestName}}', {
        id: 'p1',
        name: 'TestName',
        value: 'Testing',
        shortCode: '{{TestName}}',
      })
    );

    const shortCode = screen.getByText('{{TestName}}');
    expect(shortCode).toBeInTheDocument();

    await waitFor(() =>
      expect(result.current.getPhraseEmails.data).toBeDefined()
    );

    // expect(result.current.getPhraseEmails.data).toBeUndefined();
  });
});
