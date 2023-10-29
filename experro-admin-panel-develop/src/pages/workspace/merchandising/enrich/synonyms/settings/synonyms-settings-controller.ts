import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Form } from 'antd';
import { openNotificationWithIcon } from '../../../../../../utills';
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';
import { ISynonymsSettings } from './synonyms-settings';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { IWorkspaceParams } from '../../../../../../types';
import { useGetSettingDetails, useUpdateSetting } from '../../../services';
import useError from '../../../../../../hooks/error';

const useSynonymsSettingsController = (props: ISynonymsSettings) => {
  const {
    isEnableSynonyms,
    isEnableSmartSuggestions,
    setIsEnableSynonyms,
    setIsEnableSmartSuggestions,
  } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const location = useLocation();

  const { workspaceId } = useParams<IWorkspaceParams>();

  const [isEnableAutomateSynonyms, setIsEnableAutomateSynonyms] = useState<
    boolean | undefined
  >(false);
  const [isDisableModalVisible, setIsDisableModalVisible] = useState(false);
  const [isDisableSave, setIsDisableSave] = useState(true);
  const [searchId, setSearchId] = useState<string>('');
  const [isDirtyCheck, setDirtyCheck] = useState(false);

  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const getSettingDetails = useGetSettingDetails(workspaceId, 'SYNONYMS');
  const updateSynonymsSetting = useUpdateSetting(workspaceId, searchId);

  useError({
    mutation: updateSynonymsSetting,
    entity: t('common.labels.synonyms'),
  });

  const onBackButtonClick = () => {
    if (isDirtyCheck) {
      setIsSaveModalVisible(true);
    } else {
      history.push(`/workspaces/${workspaceId}/discovery/enrich/synonyms`);
    }
  };

  const onChangeEnableSynonyms = (value: boolean) => {
    setIsDisableSave(false);
    if (!value) {
      setIsDisableModalVisible(true);
    } else {
      setIsEnableSynonyms(value);
    }
  };

  const onChangeSmartSuggestions = (value: boolean) => {
    setIsDisableSave(false);
    setIsEnableSmartSuggestions(value);
  };

  const onChangeAutomateSynonyms = (event: CheckboxChangeEvent) => {
    if (event) {
      setIsDisableSave(false);
      const checked = event.target.checked;
      setIsEnableAutomateSynonyms(checked);
    }
  };

  const onHandleFieldChange = (value: { touched?: boolean }[]) => {
    if (value[0].touched) {
      setDirtyCheck(true);
    }
  };

  const onSaveButtonClick = async () => {
    updateSynonymsSetting.mutate({
      isEnabled: isEnableSynonyms,
      isSmartSuggestion: isEnableSmartSuggestions,
      smartSuggestionProperty: {
        isAutomate: isEnableAutomateSynonyms,
      },
    });
  };

  const onCancel = () => {
    setIsDisableModalVisible(false);
    setIsSaveModalVisible(false);
  };

  const onCancelClick = () => {
    history.push(`/workspaces/${workspaceId}/discovery/enrich/synonyms`);
  };

  const onDisableSettingsClick = () => {
    setIsDisableModalVisible(false);
    setIsEnableSynonyms(false);
    setIsEnableSmartSuggestions(false);
  };

  useEffect(() => {
    setIsDisableModalVisible(false);
  }, [location]);

  useEffect(() => {
    if (getSettingDetails.isSuccess && getSettingDetails.data) {
      setSearchId(getSettingDetails?.data?.id);
      setIsEnableSynonyms(getSettingDetails?.data?.isEnabled);
      setIsEnableSmartSuggestions(getSettingDetails?.data?.isSmartSuggestion);
      setIsEnableAutomateSynonyms(
        getSettingDetails?.data?.smartSuggestionProperty?.isAutomate
      );
      form.setFieldsValue({
        isAutomateSynonyms:
          getSettingDetails?.data?.smartSuggestionProperty?.isAutomate,
      });
    }
    // eslint-disable-next-line
  }, [getSettingDetails.isSuccess, getSettingDetails.data]);

  useEffect(() => {
    if (updateSynonymsSetting.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      onCancel();
      history.push(`/workspaces/${workspaceId}/discovery/enrich/synonyms`);
    }
    // eslint-disable-next-line
  }, [updateSynonymsSetting.isSuccess]);

  return {
    t,
    form,
    isDisableSave,
    isEnableSynonyms,
    isSaveModalVisible,
    onCancelClick,
    onSaveButtonClick,
    isEnableSmartSuggestions,
    onChangeEnableSynonyms,
    onChangeSmartSuggestions,
    onCancel,
    isDisableModalVisible,
    isEnableAutomateSynonyms,
    onChangeAutomateSynonyms,
    onDisableSettingsClick,
    onBackButtonClick,
    onHandleFieldChange,
    isSuccess: getSettingDetails.isSuccess,
    isLoading: getSettingDetails.isLoading,
  };
};

export default useSynonymsSettingsController;
