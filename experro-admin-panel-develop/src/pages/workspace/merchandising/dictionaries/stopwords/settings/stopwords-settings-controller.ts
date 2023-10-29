import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Form } from 'antd';
import { openNotificationWithIcon } from '../../../../../../utills';
import { IStopWordSettings } from './stopword-settings';
import { useHistory, useParams } from 'react-router-dom';
import { IWorkspaceParams } from '../../../../../../types';
import { useGetSettingDetails, useUpdateSetting } from '../../../services';
import useError from '../../../../../../hooks/error';

const useStopWordsSettingsController = (props: IStopWordSettings) => {
  const { isEnableStopWord, setIsEnableStopWord } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const [isDisableModalVisible, setIsDisableModalVisible] = useState(false);
  const [isDisableSave, setIsDisableSave] = useState(true);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [isDirtyCheck, setDirtyCheck] = useState(false);
  const [searchId, setSearchId] = useState<string>('');
  const getSettingDetails = useGetSettingDetails(workspaceId, 'STOPWORDS');
  const updateStopWordSetting = useUpdateSetting(workspaceId, searchId);

  useError({
    mutation: updateStopWordSetting,
    entity: t('common.labels.stop_words'),
  });

  const onChangeEnableStopWord = (value: boolean) => {
    setIsDisableSave(false);
    if (value) {
      setIsEnableStopWord(value);
    } else {
      setIsDisableModalVisible(true);
    }
  };

  const onSaveButtonClick = async () => {
    const updatedValues = await form.validateFields();
    updateStopWordSetting.mutate({
      isEnabled: updatedValues.isEnableStopWords,
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
      history.push(
        `/workspaces/${workspaceId}/discovery/dictionaries/stop-words`
      );
    }
  };

  const onHandleFieldChange = (value: { touched?: boolean | undefined }[]) => {
    if (value[0]?.touched) {
      setDirtyCheck(true);
    }
  };

  const onCancelSettingsClick = () => {
    history.push(
      `/workspaces/${workspaceId}/discovery/dictionaries/stop-words`
    );
  };

  const onDisableSettingsClick = () => {
    setIsDisableModalVisible(false);
    setIsEnableStopWord(false);
  };

  useEffect(() => {
    if (getSettingDetails.isSuccess && getSettingDetails.data) {
      setSearchId(getSettingDetails?.data?.id);
      setIsEnableStopWord(getSettingDetails?.data?.isEnabled);
    }
    // eslint-disable-next-line
  }, [getSettingDetails.isSuccess, getSettingDetails.data]);

  useEffect(() => {
    if (updateStopWordSetting.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      onCancel();
      history.push(
        `/workspaces/${workspaceId}/discovery/dictionaries/stop-words`
      );
    }
    // eslint-disable-next-line
  }, [updateStopWordSetting.isSuccess]);

  return {
    t,
    form,
    isEnableStopWord,
    onChangeEnableStopWord,
    onCancel,
    isDisableModalVisible,
    onDisableSettingsClick,
    onCancelSettingsClick,
    onSaveButtonClick,
    isSaveModalVisible,
    isDisableSave,
    onBackButtonClick,
    onHandleFieldChange,
    isLoading: getSettingDetails.isLoading,
  };
};

export default useStopWordsSettingsController;
