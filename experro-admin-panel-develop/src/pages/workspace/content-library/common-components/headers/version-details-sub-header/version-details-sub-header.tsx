import React from 'react';
import { Tag } from 'antd';

import useHeaderVersionDetailsController from './version-details-sub-header-controller';

const VersionDetailsSubHeader: React.FC<{
  
  currentVersionStatus: {
    id: string;
    name: string;
    status: string;
  }[];
}> = ({ currentVersionStatus }) => {
  const { environmentStatus, t } =
    useHeaderVersionDetailsController(currentVersionStatus);
  return (
    <>
      <>
        {environmentStatus === 'PUBLISHED' ? (
          <Tag color="success">
            <p className="m-0">{t('common.labels.Published')}</p>
          </Tag>
        ) : environmentStatus === 'SCHEDULE' ? (
          <Tag color="blue">
            <p className="m-0">{t('common.labels.Scheduled')}</p>
          </Tag>
        ) : (
          <Tag color="warning">
            <p className="m-0">{t('common.labels.draft')}</p>
          </Tag>
        )}
      </>
    </>
  );
};
export default VersionDetailsSubHeader;
