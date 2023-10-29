import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Form } from 'antd';
import { openNotificationWithIcon } from '../../../../../../utills';
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { IWorkspaceParams } from '../../../../../../types';
import { useGetSettingDetails, useUpdateSetting } from '../../../services';
import useError from '../../../../../../hooks/error';

//@ts-ignore
const usePhrasesSettingsController = (props, ref) => {
  const {
    isEnableSmartSuggestions,
    isEnablePhrases,
    setIsEnableSmartSuggestions,
    setIsEnablePhrases,
  } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const [form] = Form.useForm();
  const location = useLocation();
  const [isEnableAutomatePhrases, setIsEnableAutomatePhrases] = useState<
    boolean | undefined
  >(false);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [searchId, setSearchId] = useState<string>('');
  const [isDisableModalVisible, setIsDisableModalVisible] = useState(false);
  const [isDisableSave, setIsDisableSave] = useState(true);
  const [isDirtyCheck, setDirtyCheck] = useState(false);

  const [pendingConfidence, setPendingConfidence] = useState<number | null>();
  const [publishConfidence, setPublishConfidence] = useState<number | null>();
  const [rejectConfidence, setRejectConfidence] = useState<number | null>();

  const getSettingDetails = useGetSettingDetails(workspaceId, 'PHRASES');
  const updatePhrasesSetting = useUpdateSetting(workspaceId, searchId);

  useError({
    mutation: updatePhrasesSetting,
    entity: t('common.labels.phrases'),
  });

  const onChangeEnablePhrases = (value: boolean) => {
    setIsDisableSave(false);
    if (!value) {
      setIsDisableModalVisible(true);
    } else {
      setIsEnablePhrases(value);
    }
  };

  const onChangeSmartSuggestions = (value: boolean) => {
    setIsDisableSave(false);
    setIsEnableSmartSuggestions(value);
  };

  const onChangeAutomatePhrases = (event: CheckboxChangeEvent) => {
    if (event) {
      setIsDisableSave(false);
      const checked = event.target.checked;
      setIsEnableAutomatePhrases(checked);
    }
  };

  const onHandleFieldChange = (value: { touched?: boolean | undefined }[]) => {
    if (value[0].touched) {
      setDirtyCheck(true);
    }
  };

  const onBackButtonClick = () => {
    if (isDirtyCheck) {
      setIsSaveModalVisible(true);
    } else {
      history.push(`/workspaces/${workspaceId}/discovery/enrich/phrases`);
    }
  };

  const onCancelClick = () => {
    setIsSaveModalVisible(false);
    history.push(`/workspaces/${workspaceId}/discovery/enrich/phrases`);
  };

  const onSaveButtonClick = async () => {
    updatePhrasesSetting.mutate({
      isEnabled: isEnablePhrases,
      isSmartSuggestion: isEnableSmartSuggestions,
      smartSuggestionProperty: {
        isAutomate: isEnableAutomatePhrases,
        confidenceObject: {
          pending: pendingConfidence,
          publish: publishConfidence,
          reject: rejectConfidence,
        },
      },
    });
  };

  const onCancel = () => {
    setIsDisableModalVisible(false);
    setIsSaveModalVisible(false);
  };

  const onChangePending = (value: number | null) => {
    setPendingConfidence(value);
    setIsDisableSave(false);
  };

  const onChangePublish = (value: number | null) => {
    setPublishConfidence(value);
    setIsDisableSave(false);
  };

  const onChangeReject = (value: number | null) => {
    setRejectConfidence(value);
    setIsDisableSave(false);
  };

  const onDisableSettingsClick = () => {
    setIsDisableModalVisible(false);
    setIsEnablePhrases(false);
    setIsEnableSmartSuggestions(false);
  };

  useEffect(() => {
    setIsDisableModalVisible(false);
    setDirtyCheck(false);
  }, [location]);

  useEffect(() => {
    if (getSettingDetails.isSuccess && getSettingDetails.data) {
      setSearchId(getSettingDetails?.data?.id);
      setIsEnablePhrases(getSettingDetails?.data?.isEnabled);
      setIsEnableSmartSuggestions(getSettingDetails?.data?.isSmartSuggestion);
      setIsEnableAutomatePhrases(
        getSettingDetails?.data?.smartSuggestionProperty?.isAutomate
      );
      setPendingConfidence(
        getSettingDetails?.data?.smartSuggestionProperty?.confidenceObject
          ?.pending
      );
      setPublishConfidence(
        getSettingDetails?.data?.smartSuggestionProperty?.confidenceObject
          ?.publish
      );
      setRejectConfidence(
        getSettingDetails?.data?.smartSuggestionProperty?.confidenceObject
          ?.reject
      );
      form.setFieldsValue({
        isAutomatePhrases:
          getSettingDetails?.data?.smartSuggestionProperty?.isAutomate,
      });
    }
    // eslint-disable-next-line
  }, [getSettingDetails.isSuccess, getSettingDetails.data]);

  useEffect(() => {
    if (updatePhrasesSetting.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      onCancel();
      history.push(`/workspaces/${workspaceId}/discovery/enrich/phrases`);
    }
    // eslint-disable-next-line
  }, [updatePhrasesSetting.isSuccess]);

  return {
    t,
    form,
    isDirtyCheck,
    isEnablePhrases,
    isDisableSave,
    isSaveModalVisible,
    isEnableSmartSuggestions,
    onChangeEnablePhrases,
    onSaveButtonClick,
    onCancelClick,
    onChangeSmartSuggestions,
    onCancel,
    isDisableModalVisible,
    isEnableAutomatePhrases,
    onChangeAutomatePhrases,
    onDisableSettingsClick,
    onHandleFieldChange,
    onChangeReject,
    onChangePublish,
    onChangePending,
    onBackButtonClick,
    pendingConfidence,
    publishConfidence,
    rejectConfidence,
    isSuccess: getSettingDetails?.isSuccess,
    isLoading: getSettingDetails?.isLoading,
  };
};

export default usePhrasesSettingsController;
