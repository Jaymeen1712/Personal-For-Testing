import { Button, Col, Row } from 'antd';
import React from 'react';

import UseAddNewRecordBannerController from './add-new-record-banner-controller';
import contentModalImage from '../../../../../images/content-modal.png';
import AddNewModal from '../add-new-record-modal';

const AddNewRecordBanner = () => {
  const { isAddNewRecordModalVisible, t, onAddNewRecordButtonClick } =
    UseAddNewRecordBannerController();
  return (
    <>
      {isAddNewRecordModalVisible && (
        <AddNewModal onAddNewRecordButtonClick={onAddNewRecordButtonClick} />
      )}

      {/* <div className="generate-box ant-row ant-space-align-center">
        <div className="generate-box-content">
          <h1 className='h4'>{t('common.labels.no_record_added_content_library')}</h1>
          <p className="m-b-32">
            {t('common.labels.you_do_not_have_record_add_one')}
          </p>
          <Button
            type="primary"
            onClick={() => {
              onAddNewRecordButtonClick(true);
            }}>
            {t('common.labels.add_new_record')}
          </Button>
        </div>
        <div className="generate-box-img">
          <img src={contentModalImage} alt="internationalize" />
        </div>
      </div> */}
      <Row className='generate-box ant-row ant-space-align-center p-32'>
        <Col span={12}>
        <div className="generate-box-content p-l-32">
          <h1 className='h4 m-b-16 secondary-black'>{t('common.labels.no_record_added_content_library')}</h1>
          <p className="m-b-32 gray-text">
            {t('common.labels.you_do_not_have_record_add_one')}
          </p>
          <Button
            type="primary"
            onClick={() => {
              onAddNewRecordButtonClick(true);
            }}>
            {t('common.labels.add_new_record')}
          </Button>
        </div>
        </Col>
        <Col span={12}>
        <div className="generate-box-img ant-row ant-row-end">
          <img src={contentModalImage} alt="internationalize" width={460} height={360}/>
        </div>
        </Col>
      </Row>
    </>
  );
};
export default AddNewRecordBanner;
