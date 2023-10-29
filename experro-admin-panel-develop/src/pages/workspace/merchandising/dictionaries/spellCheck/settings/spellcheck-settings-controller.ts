import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Form } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';
import { openNotificationWithIcon } from '../../../../../../utills';
import { ISpellCheckSettings } from './spellcheck-settings';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { IWorkspaceParams } from '../../../../../../types';
import { useGetSettingDetails, useUpdateSetting } from '../../../services';
import useError from '../../../../../../hooks/error';

const useSpellCheckSettingsController = (props: ISpellCheckSettings) => {
  const {
    isEnableSmartSuggestions,
    isEnableSpellCheck,
    setIsEnableSmartSuggestions,
    setIsEnableSpellCheck,
  } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const { workspaceId } = useParams<IWorkspaceParams>();

  const [form] = Form.useForm();
  const [isEnableAutomateSpellCheck, setIsEnableAutomateSpellCheck] = useState<
    boolean | undefined
  >(false);
  const [isDisableSave, setIsDisableSave] = useState(true);
  const [isDirtyCheck, setDirtyCheck] = useState(false);
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [searchId, setSearchId] = useState<string>('');
  const [isDisableModalVisible, setIsDisableModalVisible] = useState(false);
  const getSettingDetails = useGetSettingDetails(workspaceId, 'SPELLCHECK');
  const updateSpellCheckSetting = useUpdateSetting(workspaceId, searchId);

  useError({
    mutation: updateSpellCheckSetting,
    entity: t('common.labels.spell_check'),
  });

  const onChangeEnableSpellCheck = (value: boolean) => {
    setIsDisableSave(false);
    if (!value) {
      setIsDisableModalVisible(true);
    } else {
      setIsEnableSpellCheck(value);
    }
  };

  const onChangeSmartSuggestions = (value: boolean) => {
    setIsDisableSave(false);
    setIsEnableSmartSuggestions(value);
  };

  const onChangeAutomateSpellCheck = (event: CheckboxChangeEvent) => {
    if (event) {
      setIsDisableSave(false);
      const checked = event.target.checked;
      setIsEnableAutomateSpellCheck(checked);
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
      history.push(
        `/workspaces/${workspaceId}/discovery/dictionaries/spell-check`
      );
    }
  };

  const onCancelClick = () => {
    history.push(
      `/workspaces/${workspaceId}/discovery/dictionaries/spell-check`
    );
  };

  const onDisableSettingsClick = () => {
    setIsDisableModalVisible(false);
    setIsEnableSpellCheck(false);
    setIsEnableSmartSuggestions(false);
  };

  const onSaveButtonClick = async () => {
    updateSpellCheckSetting.mutate({
      isEnabled: isEnableSpellCheck,
      isSmartSuggestion: isEnableSmartSuggestions,
      smartSuggestionProperty: {
        isAutomate: isEnableAutomateSpellCheck,
      },
    });
  };

  const onCancel = () => {
    setIsSaveModalVisible(false);
    setIsDisableModalVisible(false);
  };

  useEffect(() => {
    setIsDisableModalVisible(false);
    setDirtyCheck(false);
  }, [location]);

  useEffect(() => {
    if (getSettingDetails.isSuccess && getSettingDetails.data) {
      setSearchId(getSettingDetails?.data?.id);
      form.setFieldsValue({
        isAutomateSpellCheck:
          getSettingDetails?.data?.smartSuggestionProperty?.isAutomate,
      });
      setIsEnableSpellCheck(getSettingDetails?.data?.isEnabled);
      setIsEnableSmartSuggestions(getSettingDetails?.data?.isSmartSuggestion);
    }
    // eslint-disable-next-line
  }, [getSettingDetails.isSuccess, getSettingDetails.data]);

  useEffect(() => {
    if (updateSpellCheckSetting.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.updated_successfully')
      );
      onCancel();
      history.push(
        `/workspaces/${workspaceId}/discovery/dictionaries/spell-check`
      );
    }
    // eslint-disable-next-line
  }, [updateSpellCheckSetting.isSuccess]);

  return {
    t,
    form,
    isEnableSpellCheck,
    onSaveButtonClick,
    onCancelClick,
    isEnableSmartSuggestions,
    isDisableSave,
    onChangeEnableSpellCheck,
    onChangeSmartSuggestions,
    onBackButtonClick,
    onCancel,
    isEnableAutomateSpellCheck,
    onChangeAutomateSpellCheck,
    isDisableModalVisible,
    onDisableSettingsClick,
    onHandleFieldChange,
    isSaveModalVisible,
    isSuccess: getSettingDetails.isSuccess,
    isLoading: getSettingDetails.isFetching,
  };
};

export default useSpellCheckSettingsController;
