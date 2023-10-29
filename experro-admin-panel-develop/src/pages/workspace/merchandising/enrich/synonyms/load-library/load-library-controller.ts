import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import { IWorkspaceParams } from '../../../../../../types';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useGetIndustries from '../../../services/load-library/get-industry-list';
import useAddIndustrySpecific from '../../../services/load-library/add-industry';
import {
  API_QUERY_KEY,
  openNotificationWithIcon,
} from '../../../../../../utills';
import queryClient from '../../../../../../query-client';

const useLoadLibraryController = (
  environment: string,
  hideModal: () => void
) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const industriesListRes = useGetIndustries();
  const addIndustrySpecific = useAddIndustrySpecific(workspaceId);
  const [selectedIndustriesIds, setSelectedIndustriesIds] = useState<string[]>(
    []
  );

  const onSave = () => {
    const values = form.getFieldsValue();
    const addValues = {
      categoryIds: values.industries,
      environmentId: environment,
      type: 'synonyms',
    };

    addIndustrySpecific.mutate(addValues);
  };

  const onIndustriesChanged = (industriesIds: string[]) => {
    setSelectedIndustriesIds(industriesIds);
  };

  const onCancelModal = () => {
    form.resetFields();
    hideModal();
  };

  useEffect(() => {
    if (addIndustrySpecific.isSuccess) {
      form.resetFields();
      openNotificationWithIcon(
        'success',
        t('common.messages.loaded_successfully')
      );
      queryClient.removeQueries([API_QUERY_KEY.LIST_SYNONYMS]);
      setSelectedIndustriesIds([]);
      hideModal();
    }
    // eslint-disable-next-line
  }, [addIndustrySpecific.isSuccess]);

  return {
    t,
    form,
    industries: industriesListRes.data || [],
    isLoading: addIndustrySpecific.isLoading,
    selectedIndustriesIds,
    onSave,
    onCancelModal,
    onIndustriesChanged,
  };
};
export default useLoadLibraryController;
