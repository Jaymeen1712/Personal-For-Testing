import CopyableIcon from '../../../../../images/icons/copyable-icon';
import { Button, Typography } from 'antd';
import React from 'react';
import { TFunction } from 'react-i18next';

import { IGetProfileResponse } from '../../../../../types';
import { openNotificationWithIcon } from '../../../../../utills';

const { Paragraph } = Typography;

interface ICopiedRecoveryKey {
  t: TFunction<'translation', undefined>;
  profile: IGetProfileResponse;
  onIHaveCopiedClick: () => void;
}

const CopiedRecoveryKeyTwoFactorAuthentication: React.FC<
  ICopiedRecoveryKey
> = ({ t, profile, onIHaveCopiedClick }) => {
  return (
    <div className="security-box p-24 m-t-16">
      <h3 className="m-b-8">
        {t('common.labels.save_emergency_recovery_key')}
      </h3>
      <p className="m-0 gray-text m-b-32">
        {t('common.labels.save_emergency_recovery_key_subheader')}
      </p>
      <Paragraph
        className="copyable-dashed-border ant-row ant-row-middle gray-text w-480 ant-row-space-between"
        copyable={{
          icon: <CopyableIcon />,
          onCopy: () =>
            openNotificationWithIcon(
              'success',
              t('common.messages.copied_successfully')
            ),
          tooltips: false,
          text: profile.recoveryKey?.match(/.{1,4}/g)?.join(' '),
        }}>
          <div className="copyable-text" title={profile.recoveryKey?.match(/.{1,4}/g)?.join(' ')}>
            {profile.recoveryKey?.match(/.{1,4}/g)?.join(' ')}
          </div>
      </Paragraph>
      <Button type="primary" onClick={onIHaveCopiedClick} className="m-t-32">
        {t('common.labels.i_have_copied_let_finish')}
      </Button>
    </div>
  );
};

export default CopiedRecoveryKeyTwoFactorAuthentication;
