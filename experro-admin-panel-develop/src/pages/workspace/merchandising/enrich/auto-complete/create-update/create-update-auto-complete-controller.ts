import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import queryClient from '../../../../../../query-client';
import {
  API_QUERY_KEY,
  openNotificationWithIcon,
} from '../../../../../../utills';
import {
  useCreateAutoComplete,
  useUpdateAutoComplete,
} from '../../../services';
import useError from '../../../../../../hooks/error';
import useDetailsAutoComplete from '../../../services/enrich/auto-complete/details/details-auto-complete';
import { Form } from 'antd';

const useCreateUpdateAutoCompleteController = (
  autoCompleteId: string,
  setAutoCompleteId: (stopWordId: string[]) => void,
  setIsModalVisible: (isModalVisible: boolean) => void
) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const [disableSave, setIsDisableSave] = useState(true);
  const createAutoComplete = useCreateAutoComplete(workspaceId);
  const updateAutoComplete = useUpdateAutoComplete(autoCompleteId, workspaceId);
  const getAutoComplete = useDetailsAutoComplete(autoCompleteId, workspaceId);

  useError({
    mutation: createAutoComplete,
    entity: t('common.labels.auto_complete'),
  });

  useError({
    mutation: updateAutoComplete,
    entity: t('common.labels.auto_complete'),
  });

  const onCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setAutoCompleteId([]);
  };

  const onSave = async () => {
    const values = await form.validateFields();

    if (values.searchTerm.trim().length === 0) {
      form.setFields([
        {
          name: 'searchTerm',
          errors: [t('common.messages.please_provide')],
        },
      ]);
    } else if (values.searchTerm.trim().length > 255) {
      form.setFields([
        {
          name: 'searchTerm',
          errors: [
            t('common.messages.max_length', {
              entity: t('common.labels.search_term'),
            }),
          ],
        },
      ]);
    } else {
      values.searchTerm = values.searchTerm.trim();
      if (autoCompleteId.length) {
        updateAutoComplete.mutate({
          searchTerm: values.searchTerm,
        });
      } else {
        createAutoComplete.mutate({
          searchTerm: values.searchTerm,
        });
      }
    }
  };

  const handleFieldChange = () => {
    const values = form.getFieldsValue();
    if (values.searchTerm) {
      setIsDisableSave(false);
    } else {
      setIsDisableSave(true);
    }
  };

  useEffect(() => {
    if (createAutoComplete.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.LIST_AUTO_COMPLETE]);
      onCancel();
      openNotificationWithIcon(
        'success',
        t('common.messages.added_successfully')
      );
    }
    // eslint-disable-next-line
  }, [createAutoComplete.isSuccess]);

  useEffect(() => {
    if (updateAutoComplete.isSuccess) {
      queryClient.removeQueries([API_QUERY_KEY.LIST_AUTO_COMPLETE]);
      queryClient.removeQueries([API_QUERY_KEY.AUTO_COMPLETE_DETAIL]);
      onCancel();
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
    }
    // eslint-disable-next-line
  }, [updateAutoComplete.isSuccess]);

  useEffect(() => {
    if (getAutoComplete.isSuccess && getAutoComplete.data) {
      form.setFieldsValue({
        searchTerm: getAutoComplete?.data?.searchTerm,
      });
    }
    // eslint-disable-next-line
  }, [getAutoComplete.isSuccess, getAutoComplete.data]);

  return {
    t,
    form,
    isLoading: createAutoComplete.isLoading || updateAutoComplete.isLoading,
    handleFieldChange,
    disableSave,
    onCancel,
    onSave,
  };
};
export default useCreateUpdateAutoCompleteController;
