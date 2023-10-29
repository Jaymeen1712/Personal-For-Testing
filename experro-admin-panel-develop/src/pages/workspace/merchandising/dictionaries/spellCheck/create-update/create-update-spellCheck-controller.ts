import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import queryClient from '../../../../../../query-client';
import {
  API_QUERY_KEY,
  openNotificationWithIcon,
  WHITE_SPACE_NOT_ALLOW,
} from '../../../../../../utills';
import { FormInstance } from 'antd/es/form';
import { useCreateSpellCheck, useUpdateSpellCheck } from '../../../services';
import useError from '../../../../../../hooks/error';

const useCreateUpdateStopWordsController = (
  form: FormInstance,
  spellcheckId: string,
  setSpellCheckId: (spellCheckId: string[]) => void,
  setIsModalVisible: (isModalVisible: boolean) => void
) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const [disableSave, setIsDisableSave] = useState(true);

  const [environmentId] = useState<string>(
    // @ts-ignore
    localStorage.getItem(`${workspaceId}/environmentId`)
  );

  const createSpellCheck = useCreateSpellCheck(workspaceId);
  const updateSpellCheck = useUpdateSpellCheck(spellcheckId, workspaceId);

  useError({
    mutation: createSpellCheck,
    entity: t('common.labels.spell_check'),
  });
  useError({
    mutation: updateSpellCheck,
    entity: t('common.labels.spell_check'),
  });

  const onCancel = useCallback(() => {
    form.resetFields();
    setSpellCheckId([]);
    setIsModalVisible(false);
    // eslint-disable-next-line
  }, [form]);

  const onSave = async () => {
    const values = await form.validateFields();
    values.suggested_correction = values.suggested_correction.toString();
    values.term = values.term.trim();
    values.suggested_correction = values.suggested_correction.trim();
    if (values.term.trim().length === 0) {
      form.setFields([
        {
          name: 'term',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.suggested_correction.trim().length === 0) {
      form.setFields([
        {
          name: 'suggested_correction',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (
      values.term.trim().length > 0 &&
      !WHITE_SPACE_NOT_ALLOW.test(values.term)
    ) {
      form.setFields([
        {
          name: 'term',
          errors: [t('common.messages.whitespace_are_not_allowed')],
        },
      ]);
    } else if (
      values.suggested_correction.trim().length > 0 &&
      !WHITE_SPACE_NOT_ALLOW.test(values.suggested_correction)
    ) {
      form.setFields([
        {
          name: 'suggested_correction',
          errors: [t('common.messages.whitespace_are_not_allowed')],
        },
      ]);
    } else {
      if (spellcheckId.length) {
        updateSpellCheck.mutate({
          canonicalForm: values.term,
          surfaceForm: Array.isArray(values.suggested_correction)
            ? values.suggested_correction
            : [values.suggested_correction],
          displayForm: Array.isArray(values.suggested_correction)
            ? values.suggested_correction
            : [values.suggested_correction],
          isApproved: true,
          isUserDefined: true,
          environmentId: environmentId,
        });
      } else {
        createSpellCheck.mutate({
          canonicalForm: values.term,
          surfaceForm: [values.suggested_correction],
          displayForm: [values.suggested_correction],
          isApproved: true,
          isUserDefined: true,
          environmentId: environmentId,
        });
      }
    }
  };

  const handleFieldChange = () => {
    const values = form.getFieldsValue();
    if (values.term && values.suggested_correction) {
      setIsDisableSave(false);
    } else {
      setIsDisableSave(true);
    }
  };

  useEffect(() => {
    if (createSpellCheck.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.LIST_SPELL_CHECK]);
      onCancel();
      openNotificationWithIcon(
        'success',
        t('common.messages.added_successfully')
      );
    }
  }, [form, t, workspaceId, createSpellCheck.isSuccess, onCancel]);

  useEffect(() => {
    if (updateSpellCheck.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.LIST_SPELL_CHECK]);
      onCancel();
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
    }
  }, [form, t, workspaceId, updateSpellCheck.isSuccess, onCancel]);

  return {
    t,
    onCancel,
    onSave,
    disableSave,
    handleFieldChange,
    isLoading: createSpellCheck.isLoading || updateSpellCheck.isLoading,
  };
};

export default useCreateUpdateStopWordsController;
