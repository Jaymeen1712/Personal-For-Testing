import React from 'react';
import { Button, Form, Spin, Tooltip, Typography } from 'antd';

import useEditFileController from './edit-file-controller';
import FormItems from '../../../../../components/form-items';
import CopyableIcon from '../../../../../images/icons/copyable-icon';
import { ISelectedFiles } from '../../../../../types';
import MediaIcon from '../../list-media/media-icon';
import ArrowTopIcon from '../../../../../images/icons/arrow-top-icon';
import { APIS_ROUTES, IMAGE_EXTENSIONS } from '../../../../../utills';
import DeleteFileModal from '../delete';
import { LoadingOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

interface IEditFile {
  workspaceId: string;
  folderId: string;
  fileId: string;
  file?: ISelectedFiles;
  refetchFolderData: () => void;
  onFileEdited: () => void;
  isFileDetailsLoading: boolean;
}

const EditFile: React.FC<IEditFile> = ({
  workspaceId,
  folderId,
  fileId,
  file,
  refetchFolderData,
  onFileEdited,
  isFileDetailsLoading,
}) => {
  const {
    t,
    isFileDetailsChange,
    isDeleteFileModalVisible,
    form,
    onFinish,
    onCancel,
    isLoading,
    domainName,
    onLinkCopy,
    onHideDeleteFileModal,
    onDeleteFileClick,
    onDeleteFile,
    onFormChange,
  } = useEditFileController(
    workspaceId,
    folderId,
    fileId,
    refetchFolderData,
    onFileEdited
  );
  return (
    <div>
      {isFileDetailsLoading ? (
        <>
          <Spin
            className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
            size="large"
          />
        </>
      ) : (
        <Form
          layout="vertical"
          name="detailFile-form"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          onChange={onFormChange}
          onFinish={onFinish}
          initialValues={file}
          key={file?.id}
          form={form}
          autoComplete="off">
          <div className="left-right-section ant-row ant-row-space-between">
            <div className="page-content-top w-480 m-b-32">
              <FormItems
                items={[
                  {
                    label: t('common.labels.file_name'),
                    name: 'name',
                    placeholder: t('common.labels.add_file_name'),
                    type: 'input',
                    rules: [
                      {
                        required: true,
                        message: t('common.messages.required', {
                          entity: t('common.labels.file_name'),
                        }),
                      },
                      {
                        whitespace: true,
                        message: t('common.messages.please_provide'),
                      },
                    ],
                  },
                  {
                    label: t('common.labels.alt_text'),
                    name: 'altText',
                    placeholder: t('common.labels.add_alt_text'),
                    type: 'input',
                    rules: [
                      {
                        max: 255,
                        message: t('common.messages.max_length', {
                          entity: t('common.labels.alt_text'),
                        }),
                      },
                      {
                        whitespace: true,
                        message: t('common.messages.please_provide'),
                      },
                    ],
                  },
                  {
                    label: t('common.labels.title_caption'),
                    name: 'caption',
                    placeholder: t('common.labels.add_title_caption'),
                    type: 'input',
                    rules: [
                      {
                        required: true,
                        message: t('common.messages.required', {
                          entity: t('common.labels.title_caption'),
                        }),
                      },
                      {
                        whitespace: true,
                        message: t('common.messages.please_provide'),
                      },
                    ],
                  },
                ]}
              />

              <Form.Item name="storeLink" label={t('common.labels.file_url')}>
                <Tooltip
                  placement="topRight"
                  title={t('common.labels.copy_link')}>
                  <Paragraph
                    className="copyable-dashed-border ant-row ant-row-middle ant-row-space-between"
                    copyable={{
                      icon: <CopyableIcon />,
                      tooltips: false,
                      text:
                        file && domainName
                          ? `https://${domainName}/${file?.absolutePath}`
                          : file?.publicUrl,
                      onCopy: onLinkCopy,
                    }}>
                    <div
                      className="copyable-text"
                      title={
                        file && domainName
                          ? `https://${domainName}/${file?.absolutePath}`
                          : file?.publicUrl
                      }>
                      {file && domainName
                        ? `https://${domainName}/${file?.absolutePath}`
                        : file?.publicUrl}
                    </div>
                  </Paragraph>
                </Tooltip>
              </Form.Item>
              <div className="footer-btn-panel ant-row-space-between ant-row ant-space-align-center">
                <div className="footer-btn-left">
                  <Button
                    type="primary"
                    disabled={!isFileDetailsChange}
                    loading={isLoading}
                    htmlType="submit">
                    {t('common.labels.save')}
                  </Button>
                  <Button onClick={onCancel}>
                    {t('common.labels.cancel')}
                  </Button>
                </div>

                <div className="footer-btn-right">
                  <Button
                    danger
                    type="text"
                    htmlType="button"
                    size="middle"
                    onClick={onDeleteFileClick}>
                    {t('common.labels.delete')}
                  </Button>
                </div>
              </div>
            </div>
            <div className="media-details">
              <div className="ant-row ant-row ant-row-space-between ant-row ant-space-align-center m-b-16">
                <p className="m-0 gray-text font-semibold">
                  {t('common.labels.media_details')}
                </p>
                <Button
                  size="small"
                  href={
                    file && IMAGE_EXTENSIONS.includes(file.type)
                      ? file?.url
                      : `${process.env.REACT_APP_API_URL}${APIS_ROUTES.MEDIA_MANAGER}/${workspaceId}/files/${fileId}/download?extension=${file?.type}&name=${file?.name}`
                  }
                  target={
                    file && IMAGE_EXTENSIONS.includes(file.type)
                      ? '_blank'
                      : '_self'
                  }>
                  {t('common.labels.view_original')}
                  <span className="anticon">
                    <ArrowTopIcon />
                  </span>
                </Button>
              </div>
              <div>
                <div className="media-image m-b-16">
                  {file && (
                    <MediaIcon
                      fileDetails={file}
                      type={file.type}
                      url={file.url}
                      isDetailsPage
                    />
                  )}
                </div>
                <div className="media-content-details">
                  <div className="ant-row m-b-12">
                    <span>{t('common.labels.author')} </span>
                    <p>{file?.createdByUser}</p>
                  </div>
                  <div className="ant-row m-b-12">
                    <span>{t('common.labels.uploaded_on')} </span>
                    <p>{file?.createdAt}</p>
                  </div>
                  <div className="ant-row m-b-12">
                    <span>{t('common.labels.modified_on')} </span>
                    <p>{file?.modifiedAt}</p>
                  </div>
                  <div className="ant-row m-b-12">
                    <span>{t('common.labels.file_name')} </span>
                    <p>{file?.name}</p>
                  </div>
                  <div className="ant-row m-b-12">
                    <span>{t('common.labels.file_type')} </span>
                    <p>{`.${file?.type}`}</p>
                  </div>
                  <div className="ant-row">
                    <span>{t('common.labels.size')} </span>
                    <p>{file?.sizeWithFormat}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}

      {file && (
        <DeleteFileModal
          confirmationMessage={t('common.messages.delete_particular_file_message')}
          workspaceId={workspaceId}
          folderId={folderId}
          isDeleteModalVisible={isDeleteFileModalVisible}
          hideDeleteModal={onHideDeleteFileModal}
          selectedFiles={file ? [file.id] : []}
          refetchData={onDeleteFile}
        />
      )}
    </div>
  );
};

export default EditFile;
