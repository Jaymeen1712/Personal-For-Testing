import React from 'react';
import { TFunction } from 'react-i18next';
import { Button, Form, Modal } from 'antd';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';

import FileUploadIcon from '../../../../images/icons/file-upload-icon';
import SampleFileUploadIcon from '../../../../images/icons/samplefile-upload-icon';
import DeleteIcon from '../../../../images/icons/delete-icon';
import { FormInstance } from 'antd/es/form';
import { formatFileSize } from '../../../../utills';

interface IImportFileProps {
  t: TFunction<'translation', undefined>;
  isImportModalVisible?: boolean;
  hideImportModal: () => void;
  importFileForm: FormInstance;
  importRedirectButtonLoading: boolean;
  isImportButtonDisable: boolean;
  onImportFileFormSubmit: () => void;
  isDragDropVisible: boolean;
  onTemplateClick: string;
  uploadClass: string;
  isOverRideModalVisible: boolean;
  onHideOverRideModal: () => void;
  onOverRideData: () => void;
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
  importFile: File[] | undefined;
  onDeleteImportedFile: () => void;
}

const ImportFile: React.FC<IImportFileProps> = ({
  t,
  isImportModalVisible,
  hideImportModal,
  importFileForm,
  importRedirectButtonLoading,
  isImportButtonDisable,
  onImportFileFormSubmit,
  isDragDropVisible,
  onTemplateClick,
  uploadClass,
  isOverRideModalVisible,
  onHideOverRideModal,
  onOverRideData,
  getRootProps,
  getInputProps,
  importFile,
  onDeleteImportedFile,
}) => {
  return (
    <>
      <Modal
        centered
        title={t('common.labels.import_file')}
        open={isImportModalVisible}
        onCancel={hideImportModal}
        className="CustomModal CustomModal-small"
        footer={[
          <div className="ant-row ant-row-space-between">
            <div className="custom-delete-button">
              {isDragDropVisible && (
                <Button
                  href={onTemplateClick}
                  key="importFile"
                  className="template-button"
                  icon={
                    <span className="anticon">
                      <SampleFileUploadIcon />
                    </span>
                  }>
                  {t('common.labels.sample_file')}
                </Button>
              )}
            </div>
            <div>
              <Button key="back" onClick={hideImportModal}>
                {t('common.labels.cancel')}
              </Button>
              <Button
                key="submit"
                type="primary"
                onClick={onImportFileFormSubmit}
                loading={importRedirectButtonLoading}
                disabled={isImportButtonDisable}>
                {t('common.labels.import')}
              </Button>
            </div>
          </div>,
        ]}>
        <Form
          layout="vertical"
          form={importFileForm}
          className={`media-upload-box redirect-popup ${uploadClass}`}>
          <Form.Item name="importFileData">
            <div className="modal-file-upload-box">
              <div
                {...getRootProps({
                  className: `${
                    isDragDropVisible
                      ? 'ant-upload ant-upload-drag file-upload-box import-file-popup'
                      : 'display-none'
                  } `,
                })}>
                <input {...getInputProps()} />
                {isDragDropVisible && (
                  <>
                    <p className="ant-upload-drag-icon">
                      <span className="anticon">
                        <FileUploadIcon />
                      </span>
                    </p>
                    <p className="ant-upload-text">
                      {t('common.labels.upload_msg')}
                      <span className="text-blue">
                        {t('common.labels.upload').toLowerCase()}
                      </span>
                    </p>
                    <p className="ant-upload-hint">
                      {t('common.labels.redirect_import_supported_file')}
                    </p>
                  </>
                )}
              </div>
              <div className="ant-upload-list ant-upload-list-text">
                <div className="ant-upload-list-text-container">
                  <div className="ant-upload-list-item ant-upload-list-item-undefined ant-upload-list-item-list-type-text">
                    <div className="ant-upload-list-item-info">
                      {importFile && importFile.length > 0 && (
                        // @ts-ignore
                        <span className="ant-upload-span">
                          <div className="ant-upload-text-icon">
                            <span className="anticon anticon-paper-clip"></span>
                          </div>
                          <div className="upload-item-details">
                            <span
                              // @ts-ignore
                              key={importFile[0].path}
                              className="ant-upload-list-item-name">
                              {
                                // @ts-ignore
                                importFile[0].path
                              }
                            </span>
                            <span className="ant-upload-list-item-name gray-text">
                              {formatFileSize(importFile[0].size)}
                            </span>
                          </div>
                          <span className="ant-upload-list-item-card-actions">
                            <Button
                              size="small"
                              type="link"
                              icon={<DeleteIcon />}
                              onClick={onDeleteImportedFile}
                            />
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        className="confirm-modal"
        centered
        title={t('common.labels.override_existing_data')}
        open={isOverRideModalVisible}
        onCancel={onHideOverRideModal}
        onOk={onOverRideData}
        okText={t('common.labels.override')}>
        {t('common.labels.override_import_model_children')}
      </Modal>
    </>
  );
};

export default ImportFile;
