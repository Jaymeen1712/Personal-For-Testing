import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Col, Row } from 'antd';

import Modal from '../../../../components/modal';
import useEnums from '../enums';
import useFieldModalController from './field-modal-controller';

interface FieldModalProps {
  isModalVisible: boolean;
  hideModal: () => void;
  showCreateFormFieldModal: (key: string) => void;
  contentId?: string;
  type?: string;
  actAsWebPage: boolean;
}

const FieldModal: React.FC<FieldModalProps> = ({
  isModalVisible,
  hideModal,
  showCreateFormFieldModal,
  actAsWebPage,
}) => {
  const { type } = useFieldModalController();
  const { t } = useTranslation();
  const { CONTENT_FIELD_TYPES } = useEnums();
  return (
    <Modal
      classname="CustomModal CustomModal-xlarge"
      title={t('common.labels.add_new_field_model_title')}
      isModalVisibility={isModalVisible}
      hideModal={hideModal}
      footer={<Button onClick={hideModal}>{t('common.labels.cancel')}</Button>}>
      <Row gutter={24} className="fieldlistmain ant-row">
        {CONTENT_FIELD_TYPES.map(
          (item) =>
            item.key !== 'component' &&
            !(
              type === 'component' &&
              ['component', 'relation', 'page-editor', 'link-record'].includes(
                item.key
              )
            ) &&
            !(
              type === 'single' &&
              ['page-editor', 'link-record'].includes(item.key)
            ) &&
            !(!actAsWebPage && ['page-editor'].includes(item.key)) && (
              <Col span={8} className="fieldlist-item">
                <div
                  className="fieldlist"
                  key={item.key}
                  onClick={() => {
                    showCreateFormFieldModal(item.key);
                  }}
                  data-testid="modalVisible">
                  {item.icon}
                  <div className="info">
                    <div className="title-sm" role="heading" aria-level={1}>
                      {item.title}
                    </div>
                    <p className="font-sm gray-text">{item.subTitle}</p>
                  </div>
                </div>
              </Col>
            )
        )}
      </Row>
      {type !== 'component' && (
        <Row gutter={24} className="fieldlistmain ant-row">
          {CONTENT_FIELD_TYPES.map(
            (item) =>
              item.key === 'component' &&
              type !== 'component' && (
                <Col span={8} className="fieldlist-item">
                  <div
                    className="fieldlist"
                    key={item.key}
                    onClick={() => {
                      showCreateFormFieldModal(item.key);
                    }}
                    data-testid="modalVisible">
                    {item.icon}
                    <div className="info">
                      <div className="title-sm" role="heading" aria-level={1}>
                        {item.title}
                      </div>
                      <p className="font-sm gray-text">{item.subTitle}</p>
                    </div>
                  </div>
                </Col>
              )
          )}
        </Row>
      )}
    </Modal>
  );
};

export default FieldModal;
