import React from 'react';
import { Form, Input, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface IPassword {
  passwordStrength: string;
  name: string;
  label: string;
  errorLabel: string;
  autoFocus?: boolean;
}

const Password: React.FC<IPassword> = ({
  passwordStrength,
  name,
  label,
  errorLabel,
  autoFocus,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Form.Item
        name={name}
        label={label}
        rules={[
          {
            required: true,
            message: t('common.messages.new_password_message', {
              entity: errorLabel,
            }),
          },
        ]}>
        <Input.Password
          autoFocus={autoFocus}
          placeholder={t('common.labels.reset_set_password_placeholder')}
        />
      </Form.Item>

      {passwordStrength && (
        <div className={`strength ${passwordStrength}`}>
          <div className="ant-row">
            <div className="strength-length">&nbsp;</div>
            <div className="strength-length">&nbsp;</div>
            <div className="strength-length">&nbsp;</div>
            <div className="strength-length">&nbsp;</div>
          </div>
          <div className="strength-word">
            {passwordStrength.charAt(0).toUpperCase() +
              passwordStrength.slice(1)}
            <Tooltip
              overlayClassName="custom-tooltip custom-large"
              title={t('common.messages.password_strength_message')}
              placement="bottom">
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        </div>
      )}

      <Form.Item
        name="confirmPassword"
        label={t('common.labels.confirm_password_label')}
        rules={[
          {
            required: true,
            message: t('common.messages.confirm_password_message'),
          },
        ]}>
        <Input.Password
          placeholder={t(
            'common.labels.reset_set_confirm_password_placeholder'
          )}
        />
      </Form.Item>
    </>
  );
};
export default Password;
