import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import queryClient from '../../../../../../query-client';
import {
  API_QUERY_KEY,
  openNotificationWithIcon,
} from '../../../../../../utills';
import { FormInstance } from 'antd/es/form';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import {
  useCreateSynonyms,
  useDetailsSynonyms,
  useUpdateSynonyms,
} from '../../../services';
import useError from '../../../../../../hooks/error';
import OneWayIcon from '../../../../../../images/icons/one-way-icon';
import TowWayIcon from '../../../../../../images/icons/two-way-icon';

const listData = [
  {
    id: '1',
    label: 'pants',
  },
  {
    id: '2',
    label: 'trousers',
  },
  {
    id: '3',
    label: 'jeans',
  },
  {
    id: '4',
    label: 'denims',
  },
];

const useCreateUpdateSynonymsController = (
  form: FormInstance,
  synonymsId: string,
  setIsModalVisible: (isModalVisible: boolean) => void,
  setSynonymsId: (synonymsId: string[]) => void,
  selectedSynonyms: { id: string; text: string; className?: string }[],
  setSelectedSynonyms: (
    selectedSynonyms: { id: string; text: string; className?: string }[]
  ) => void
) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const [environmentId] = useState<string>(
    // @ts-ignore
    localStorage.getItem(`${workspaceId}/environmentId`)
  );

  const [radioType, setRadioType] = useState('any');
  const [disableSave, setIsDisableSave] = useState(true);
  const [isFieldChange, setIsFieldChange] = useState(false);
  const [isTagChange, setTageChange] = useState(false);

  const createSynonyms = useCreateSynonyms(workspaceId);
  const updateSynonyms = useUpdateSynonyms(synonymsId, workspaceId);
  const getSynonymsData = useDetailsSynonyms(workspaceId, synonymsId);

  useError({
    mutation: createSynonyms,
    entity: t('common.labels.synonym'),
  });

  useError({
    mutation: updateSynonyms,
    entity: t('common.labels.synonym'),
  });

  const onCancel = useCallback(() => {
    form.resetFields();
    setIsModalVisible(false);
    setSynonymsId([]);
    setIsFieldChange(false);
    setSelectedSynonyms([]);
    // eslint-disable-next-line
  }, [form]);

  // eslint-disable-next-line
  const synonymsArray: any = [];

  selectedSynonyms.map((item) => {
    if (synonymsId && getSynonymsData.isSuccess) {
      if (item.text) {
        synonymsArray.push(item.text);
      } else {
        synonymsArray.push(item);
      }
    } else {
      synonymsArray.push(item.text);
    }
    return '';
  });

  const onSave = async () => {
    const values = await form.validateFields();
    if (values.term.trim().length === 0) {
      form.setFields([
        {
          name: 'term',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.term.trim().length > 255) {
      form.setFields([
        {
          name: 'term',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.term'),
            }),
          ],
        },
      ]);
    } else {
      values.term = values.term.trim();
      values.type = values.type ? values.type : 'oneway';
      if (synonymsId.length) {
        updateSynonyms.mutate({
          canonicalForm: values.term,
          synonymsType: values.type,
          surfaceForm: values.synonyms,
          displayForm: values.synonyms,
          isApproved: true,
          isUserDefined: true,
          environmentId: environmentId,
        });
      } else {
        createSynonyms.mutate({
          canonicalForm: values.term,
          synonymsType: values.type,
          surfaceForm: values.synonyms,
          displayForm: values.synonyms,
          isApproved: true,
          isUserDefined: true,
          environmentId: environmentId,
        });
      }
    }
  };

  const onChangeRadioType = ({ target: { value } }: RadioChangeEvent) => {
    setRadioType(value);
  };

  const onClickSuggestionsTag = (item: { id: string; label: string }) => {
    setSelectedSynonyms([
      ...selectedSynonyms,
      { id: item.id, text: item.label },
    ]);
  };

  const onAddSynonym = (values: { id: string; text: string }) => {
    setTageChange(true);
    setSelectedSynonyms([
      ...selectedSynonyms,
      { id: values.id, text: values.text },
    ]);
  };

  const onDeleteSynonyms = (position: number) => {
    setTageChange(true);
    const tempDelete = selectedSynonyms.filter(
      (product, index) => index !== position
    );
    setSelectedSynonyms(tempDelete);
  };

  const synonymsDataArray: { id: string; label: string }[] = [];

  listData.map((item) => {
    return selectedSynonyms.map((element) => {
      if (element.id === item.id) {
        synonymsDataArray.push(item);
      }
      return synonymsDataArray;
    });
  });

  const handleFieldChange = useCallback(() => {
    const values = form.getFieldsValue();
    if (values.term && values.synonyms) {
      setIsFieldChange(true);
    } else {
      setIsFieldChange(false);
    }
    // eslint-disable-next-line
  }, [synonymsArray]);

  useEffect(() => {
    form.setFieldsValue({
      synonyms: synonymsArray,
    });
    // eslint-disable-next-line
  }, [synonymsArray]);

  const radioOption = [
    {
      label: (
        <div className="ant-row ant-space-align-center ant-row-center">
          <div className="icon-16 m-r-4 ant-row">
            <OneWayIcon />
          </div>
          {t('common.labels.one_way')}
        </div>
      ),
      value: 'oneway',
    },
    {
      label: (
        <div className="ant-row ant-space-align-center ant-row-center">
          <div className="icon-16 m-r-4 ant-row">
            <TowWayIcon />
          </div>
          {t('common.labels.two_way')}
        </div>
      ),
      value: 'twoway',
    },
  ];

  const onHandleInputChange = (value: string) => {
    if (value) {
      setTageChange(true);
    }
    if (!value.length) {
      form.setFields([
        {
          name: 'synonyms',
          errors: [
            t('common.messages.required', {
              entity: t('common.labels.synonyms'),
            }),
          ],
        },
      ]);
    }
  };

  useEffect(() => {
    if (
      !synonymsId.length
        ? isFieldChange && isTagChange && selectedSynonyms?.length > 0
        : isFieldChange || (isTagChange && selectedSynonyms?.length > 0)
    ) {
      setIsDisableSave(false);
    } else {
      setIsDisableSave(true);
    }
  }, [isFieldChange, isTagChange, synonymsId, selectedSynonyms]);

  useEffect(() => {
    if (createSynonyms.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.LIST_SYNONYMS]);
      onCancel();
      openNotificationWithIcon(
        'success',
        t('common.messages.added_successfully')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, createSynonyms.isSuccess]);

  useEffect(() => {
    if (updateSynonyms.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.LIST_SYNONYMS]);
      onCancel();
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
    }
    // eslint-disable-next-line
  }, [workspaceId, updateSynonyms.isSuccess]);

  return {
    t,
    form,
    listData,
    disableSave,
    handleFieldChange,
    radioOption,
    radioType,
    onChangeRadioType,
    selectedSynonyms,
    synonymsDataArray,
    onCancel,
    onAddSynonym,
    onDeleteSynonyms,
    onClickSuggestionsTag,
    onSave,
    getSynonymsData,
    isFieldChange,
    onHandleInputChange,
    isLoading: createSynonyms.isLoading || updateSynonyms.isLoading,
  };
};

export default useCreateUpdateSynonymsController;
