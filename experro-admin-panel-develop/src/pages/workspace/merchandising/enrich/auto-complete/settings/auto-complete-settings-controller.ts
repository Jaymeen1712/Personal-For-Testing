import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Form } from 'antd';
import { openNotificationWithIcon } from '../../../../../../utills';
import { useHistory, useParams } from 'react-router-dom';
import { IWorkspaceParams } from '../../../../../../types';
import { useGetSettingDetails, useUpdateSetting } from '../../../services';
import useError from '../../../../../../hooks/error';

interface IAutoCompleteInterface {
  isEnableAutoComplete: boolean;
  setIsEnableAutoComplete: (isEnableAutoComplete: boolean) => void;
}

const useAutoCompleteSettingsController = (props: IAutoCompleteInterface) => {
  const { isEnableAutoComplete, setIsEnableAutoComplete } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const [isDisableModalVisible, setIsDisableModalVisible] = useState(false);
  const [isDisableSave, setIsDisableSave] = useState(true);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [isDirtyCheck, setDirtyCheck] = useState(false);
  const [searchId, setSearchId] = useState<string>('');
  const getSettingDetails = useGetSettingDetails(workspaceId, 'AUTOSUGGESTER');
  const updateAutoCompleteSetting = useUpdateSetting(workspaceId, searchId);

  useError({
    mutation: updateAutoCompleteSetting,
    entity: t('common.labels.auto_complete'),
  });

  const onChangeEnableAutoComplete = (value: boolean) => {
    setIsDisableSave(false);
    if (value) {
      setIsEnableAutoComplete(value);
    } else {
      setIsDisableModalVisible(true);
    }
  };

  const onSaveButtonClick = async () => {
    const updatedValues = await form.validateFields();
    updateAutoCompleteSetting.mutate({
      isEnabled: updatedValues.isEnableAutoComplete,
    });
  };

  const onCancel = () => {
    setIsDisableModalVisible(false);
    setIsSaveModalVisible(false);
  };

  const onBackButtonClick = () => {
    if (isDirtyCheck) {
      setIsSaveModalVisible(true);
    } else {
      history.push(`/workspaces/${workspaceId}/discovery/enrich/auto-complete`);
    }
  };

  const onHandleFieldChange = (value: { touched?: boolean | undefined }[]) => {
    if (value[0]?.touched) {
      setDirtyCheck(true);
    }
  };

  const onCancelSettingsClick = () => {
    history.push(`/workspaces/${workspaceId}/discovery/enrich/auto-complete`);
  };

  const onDisableSettingsClick = () => {
    setIsDisableModalVisible(false);
    setIsEnableAutoComplete(false);
  };

  useEffect(() => {
    if (getSettingDetails.isSuccess && getSettingDetails.data) {
      setSearchId(getSettingDetails?.data?.id);
      setIsEnableAutoComplete(getSettingDetails?.data?.isEnabled);
    }
    // eslint-disable-next-line
  }, [getSettingDetails.isSuccess, getSettingDetails.data]);

  useEffect(() => {
    if (updateAutoCompleteSetting.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      onCancel();
      history.push(`/workspaces/${workspaceId}/discovery/enrich/auto-complete`);
    }
    // eslint-disable-next-line
  }, [updateAutoCompleteSetting.isSuccess]);

  return {
    t,
    form,
    isEnableAutoComplete,
    onChangeEnableAutoComplete,
    onCancel,
    isDisableModalVisible,
    onDisableSettingsClick,
    onCancelSettingsClick,
    onSaveButtonClick,
    isSaveModalVisible,
    isDisableSave,
    onBackButtonClick,
    onHandleFieldChange,
    isSuccess: getSettingDetails.isSuccess,
  };
};

export default useAutoCompleteSettingsController;
