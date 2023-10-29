import React from 'react';
import { Typography } from 'antd';

import Internationlization from '../../i18n/i18n';
import { useTranslation } from 'react-i18next';

const { Link } = Typography;

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="bottom-link">
      <Internationlization />
      <p>
        <Link href="">{t('common.labels.terms_of_services')}</Link>
        <span>&nbsp;</span>
        <Link href="">{t('common.labels.privacy_policy')}</Link>
      </p>
    </div>
  );
};
export default Footer;
