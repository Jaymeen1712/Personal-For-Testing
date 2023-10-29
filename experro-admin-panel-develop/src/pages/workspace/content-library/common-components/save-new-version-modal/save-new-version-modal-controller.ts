import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import { useState } from 'react';

import { openNotificationWithIcon } from '../../../../../utills';

const useSaveNewVersionModalController = (
  onSave: (val: { versionName: string; versionNo: number }) => void
) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [isSaveAsNewVersionButtonDisabled, setSaveAsNewVersionButtonDisabled] =
    useState(true);

  const onFormValuesChange = (values: { versionName: string }) => {
    if (values.versionName) {
      setSaveAsNewVersionButtonDisabled(false);
    } else {
      setSaveAsNewVersionButtonDisabled(true);
    }
  };

  const onSaveButtonClick = async () => {
    try {
      const result = await form.validateFields();
      onSave(result);
      form.resetFields();
    } catch (e) {
      openNotificationWithIcon(
        'error',
        t('common.messages.provide_all_details')
      );
    }
  };
  return {
    t,
    form,
    onSaveButtonClick,
    isSaveAsNewVersionButtonDisabled,
    onFormValuesChange,
  };
};
export default useSaveNewVersionModalController;
