import React from 'react';
import { useTranslation } from 'react-i18next';

import ContentModalSingleTypeImage from '../../../../../images/icons/content-modal-single-type-image';
import ContentModalCollectionTypeImage from '../../../../../images/icons/content-modal-collection-type-image';
import ContentModalComponentTypeImage from '../../../../../images/icons/content-modal-component-type-image';
import { Col, Row } from 'antd';

interface IBannerInfo {
  type: string;
  onAddContentType: () => void;
}

const BannerContentModelType: React.FC<IBannerInfo> = ({
  type,
  onAddContentType,
}) => {
  const { t } = useTranslation();
  const changeText = type?.charAt(0).toUpperCase() + type?.slice(1);

  return (
    <Row className='generate-box ant-row ant-space-align-center p-32'>
      <Col span={12}>
      <div className="generate-box-content p-l-32">
        <h1 className='h4 m-b-16 secondary-black'>
          {type === 'component'
            ? t('common.labels.component_type', { entity: changeText })
            : t('common.labels.single_collection_type', { entity: changeText })}
        </h1>
        <p className="m-b-32 gray-text">
          {type === 'component'
            ? t('common.labels.add_type_banner_subheader_component_type', {
                entity: type,
              })
            : t(
                'common.labels.add_type_banner_subheader_collection_single_type',
                {
                  entity: type,
                }
              )}
        </p>
      </div>
      </Col>
      <Col span={12}>
      <div className="generate-box-img ant-row ant-row-end">
        {type === 'component' ? (
          <ContentModalComponentTypeImage />
        ) : type === 'collection' ? (
          <ContentModalCollectionTypeImage />
        ) : (
          <ContentModalSingleTypeImage />
        )}
      </div>
      </Col>
    </Row>
  );
};

export default BannerContentModelType;
