import React from 'react';
import { Button, Form } from 'antd';

import LanguageSelect from '../language-select';
import useAddLanguageController from './add-language-controller';
import { ILanguage } from '../../../../types';

interface AddLanguageProps {
  selectedLanguages: ILanguage[];
}

const AddLanguage: React.FC<AddLanguageProps> = ({ selectedLanguages }) => {
  const {
    form,
    onFinish,
    t,
    addWorkspaceLanguage,
    isAddButtonVisible,
    onChangeLanguage,
  } = useAddLanguageController();

  return (
    <div className="m-b-40">
      <Form
        layout="vertical"
        form={form}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        className="ant-row ant-space-align-end">
        <Form.Item
          name="language"
          label={t('common.labels.languages')}
          className="display-block m-r-16 margin-button m-0 w-420">
          {/* @ts-ignore */}
          <LanguageSelect
            onChange={onChangeLanguage}
            selectedLanguages={selectedLanguages}
          />
        </Form.Item>
        <Form.Item className="m-0">
          <Button
            disabled={isAddButtonVisible}
            type="primary"
            htmlType="submit"
            loading={addWorkspaceLanguage.isLoading ? true : false}>
            {t('common.labels.add')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddLanguage;
