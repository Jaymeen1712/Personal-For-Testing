import { Button } from 'antd';
import React from 'react';
import { TFunction } from 'react-i18next';

interface ICreateNewRecoveryKey {
  t: TFunction<'translation', undefined>;
  onReCreateEmergencyRecoveryKey: () => void;
}

const CreateNewRecoveryKeyTwoFactorAuthentication: React.FC<
  ICreateNewRecoveryKey
> = ({ t, onReCreateEmergencyRecoveryKey }) => {
  return (
    <div className="security-box p-24 m-t-16 m-b-16">
      <h3 className='m-b-8'>{t('common.labels.generate_new_key')}</h3>
      <p className="m-0 gray-text m-b-32">
        {t('common.labels.generate_new_key_subheader')}
      </p>
      <Button type="primary" onClick={onReCreateEmergencyRecoveryKey}>
        {t('common.labels.create_new_emergency_recovery_key')}
      </Button>
    </div>
  );
};

export default CreateNewRecoveryKeyTwoFactorAuthentication;
