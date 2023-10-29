import { Button, Col, Row } from 'antd';
import React, { ReactNode } from 'react';
import PlusIcon from '../../../../images/icons/plus-icon';
import FacetNotFoundBanner from '../../../../images/icons/facet-not-found-banner';

interface FacetNotFoundBannerProps {
  t: (s: string) => ReactNode;
  onAddFacet: () => void;
}

const FacetBanner = ({ t, onAddFacet }: FacetNotFoundBannerProps) => {
  return (
    <Row className="generate-box ant-row ant-space-align-center p-32">
      <Col span={12}>
        <div className="generate-box-content p-l-32">
          <h1 className="h4 m-b-16 secondary-black">
            {t('common.labels.no_facets_found')}
          </h1>
          <p className="m-b-32 gray-text">
            {t('common.labels.facets_not_found_description')}
          </p>

          <Button
            type="primary"
            onClick={onAddFacet}
            icon={
              <span className="anticon">
                <PlusIcon />
              </span>
            }>
            {t('common.labels.add_facet')}
          </Button>
        </div>
      </Col>
      <Col span={12}>
        <div className="generate-box-img ant-row ant-row-end">
          <FacetNotFoundBanner />
        </div>
      </Col>
    </Row>
  );
};

export default FacetBanner;
