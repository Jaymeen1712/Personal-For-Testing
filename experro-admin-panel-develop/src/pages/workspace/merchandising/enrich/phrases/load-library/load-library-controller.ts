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

const useLoadLibraryController = (hideModal: () => void) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const environmentId = localStorage.getItem(`${workspaceId}/environmentId`);
  const [form] = Form.useForm();
  const industriesListRes = useGetIndustries();
  const addIndustrySpecific = useAddIndustrySpecific(workspaceId);
  const [selectedIndustriesIds, setSelectedIndustriesIds] = useState<string[]>(
    []
  );

  const onSave = () => {
    const values = form.getFieldsValue();
    const addValues = {
      categoryIds: values.industries,
      environmentId: environmentId,
      type: 'phrases',
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
      queryClient.removeQueries([API_QUERY_KEY.LIST_PHRASES]);
      setSelectedIndustriesIds([]);
      hideModal();
    }
    // eslint-disable-next-line
  }, [addIndustrySpecific.isSuccess]);

  return {
    t,
    form,
    isLoading: addIndustrySpecific.isLoading,
    industries: industriesListRes.data || [],
    selectedIndustriesIds,
    onSave,
    onCancelModal,
    onIndustriesChanged,
  };
};
export default useLoadLibraryController;
