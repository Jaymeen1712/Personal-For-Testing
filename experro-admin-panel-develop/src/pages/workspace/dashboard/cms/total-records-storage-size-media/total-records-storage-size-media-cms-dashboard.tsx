import React from 'react';

import { IMediaRecordCounts } from '../../../../../types';
import useTotalRecordsStorageSizeMediaCmsDashboardController from './total-records-storage-size-media-cms-dashboard-controller';
import { numberFormatter } from '../../../../../utills';
import { Col } from 'antd';

const TotalRecordsStorageSizeMediaCmsDashboard: React.FC<
  IMediaRecordCounts
> = ({ t, workspaceId, startDate, endDate }) => {
  const { mediaManagerFileCounts } =
    useTotalRecordsStorageSizeMediaCmsDashboardController({
      workspaceId,
      startDate,
      endDate,
    });

  return (
    <>
    <Col span={6} className='counter-item'>
        <div className="item-inner">
          <h3>{t('common.labels.total_assets')}</h3>
          <div className="ant-row ant-row-space-between">
            <p>
            {mediaManagerFileCounts.isSuccess &&
              mediaManagerFileCounts.data?.filesCount
                ? numberFormatter(mediaManagerFileCounts.data?.filesCount)
                : numberFormatter(0)}
            </p>
          </div>
        </div>
    </Col>
    <Col span={6} className='counter-item'>
    <div className="item-inner">
          <h3>
            {t('common.labels.total_assets_in_gb', {
              entity: mediaManagerFileCounts.data?.filesSize.split(' ')[
                mediaManagerFileCounts.data?.filesSize.split(' ').length - 1
              ]
                ? mediaManagerFileCounts.data?.filesSize.split(' ')[
                    mediaManagerFileCounts.data?.filesSize.split(' ').length - 1
                  ]
                : t('common.labels.bytes'),
            })}
          </h3>
          <div className="ant-row ant-row-space-between">
            <p>
            {mediaManagerFileCounts.isSuccess &&
              mediaManagerFileCounts.data?.filesSize &&
              mediaManagerFileCounts.data?.filesSize.split(' ')[0]
                ? mediaManagerFileCounts.data?.filesSize.split(' ')[0]
                : 0}
            </p>
          </div>
        </div>
    </Col>
      {/* <div className="col counter-item">
        <div className="item-inner">
          <h3>{t('common.labels.total_assets')}</h3>
          <div className="ant-row ant-row-space-between">
            <p>
              {mediaManagerFileCounts.isSuccess &&
              mediaManagerFileCounts.data?.filesCount
                ? numberFormatter(mediaManagerFileCounts.data?.filesCount)
                : numberFormatter(0)}
            </p>
          </div>
        </div>
      </div>

      <div className="col counter-item">
        <div className="item-inner">
          <h3>
            {t('common.labels.total_assets_in_gb', {
              entity: mediaManagerFileCounts.data?.filesSize.split(' ')[
                mediaManagerFileCounts.data?.filesSize.split(' ').length - 1
              ]
                ? mediaManagerFileCounts.data?.filesSize.split(' ')[
                    mediaManagerFileCounts.data?.filesSize.split(' ').length - 1
                  ]
                : t('common.labels.bytes'),
            })}
          </h3>
          <div className="ant-row ant-row-space-between">
            <p>
              {mediaManagerFileCounts.isSuccess &&
              mediaManagerFileCounts.data?.filesSize &&
              mediaManagerFileCounts.data?.filesSize.split(' ')[0]
                ? mediaManagerFileCounts.data?.filesSize.split(' ')[0]
                : 0}
            </p>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default TotalRecordsStorageSizeMediaCmsDashboard;
