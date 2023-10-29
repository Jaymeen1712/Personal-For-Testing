import React from 'react';
import { useTranslation } from 'react-i18next';

import NoFieldContentModalTable from '../../../../../images/banners/banner-content-model-no-field';
import { Col, Row } from 'antd';

interface IBannerInfo {
  onAddContentField: () => void;
}

const BannerContentModelField: React.FC<IBannerInfo> = ({
  onAddContentField,
}) => {
  const { t } = useTranslation();

  return (
    <Row className='generate-box ant-row ant-space-align-center p-32'>
      <Col span={12}>
        <div className="generate-box-content p-l-32">
          <h1 className='h4 m-b-16 secondary-black'>{t('common.labels.new_field_banner_title')}</h1>
          <p className="m-b-32 gray-text">{t('common.labels.new_field_banner_subtitle')}</p>
        </div>
      </Col>
      <Col span={12}>
        <div className="generate-box-img ant-row ant-row-end">
          <NoFieldContentModalTable />
        </div>
      </Col>
    </Row>
  );
};

export default BannerContentModelField;
