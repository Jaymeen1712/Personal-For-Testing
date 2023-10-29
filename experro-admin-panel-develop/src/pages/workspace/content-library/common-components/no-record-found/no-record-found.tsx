import React from 'react';
import { Button, Col, Row } from 'antd';

import useNoRecordFoundController from './no-record-found-controller';
import HamburgerIcon from '../../../../../images/icons/hamburger-icon';
import ContentModalSingleTypeImage from '../../../../../images/icons/content-modal-single-type-image';
// import NoRecordFoundHeader from '../headers/no-record-found-header';

const NoRecordFound = () => {
  const { t, onAddModelClick, onCollapseChange } = useNoRecordFoundController();
  return (
    <>
      <div className="headerinner ant-row ant-row-no-wrap ant-space-align-center ant-row-space-between content-library-header">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={onCollapseChange}>
            <HamburgerIcon />
          </div>
          <div className="w-100">
            <span className="ant-page-header-heading-title"></span>
            <span className="ant-page-header-heading-sub-title"></span>
          </div>
        </div>
      </div>
      <div className="content-library-table">
        <Row className='generate-box ant-row ant-space-align-center p-32'>
          <Col span={12}>
            <div className="generate-box-content p-l-32">
              <h1 className='h4 m-b-16 secondary-black'>{t('common.labels.no_content_modal_added')}</h1>
              <p className="m-b-32 gray-text">
                {t('common.labels.you_do_not_have_content_modal')}
              </p>
              <Button type="primary" onClick={onAddModelClick}>
                {t('common.labels.add_model')}
              </Button>
            </div>
          </Col>
          <Col span={12}>
            <div className="generate-box-img ant-row ant-row-end">
              <ContentModalSingleTypeImage />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default NoRecordFound;
