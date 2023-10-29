import React from 'react';
import { Form, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import { IContentLibraryFieldPops } from '../../../../../../../types';
import { useFieldPermission, useMediaController } from './controllers';

import MediaManager from '../../../../../media-manager';
import ImagePreviewIcon from '../../../../../../../images/icons/image-preview-icon';
import DeleteIcon from '../../../../../../../images/icons/delete-icon';
import { IMAGE_EXTENSIONS } from '../../../../../../../utills';
import FolderDocIcon from '../../../../../../../images/icons/folder-doc-icon';

interface FieldProps {
  contentModalInternalName: string;
  data: IContentLibraryFieldPops;
  componentName?: string;
  isViewContentInPopupOpen?: boolean;
}

const MultiMedia: React.FC<FieldProps> = ({
  contentModalInternalName,
  data,
  componentName,
  isViewContentInPopupOpen,
}) => {
  const {
    workspaceId,
    changeIsVisible,
    isVisible,
    imageList,
    changeImageList,
    deleteImages,
    t,
    onCancel,
    cacheDomain,
  } = useMediaController(data, isViewContentInPopupOpen);

  const { canEditField } = useFieldPermission(
    contentModalInternalName,
    data,
    componentName
  );

  return (
    <Form.Item
      label={`${data.title} ${t('common.labels.media_multi')}`}
      name={data.name}
      tooltip={
        data.fieldProperties.helpText && {
          title: data.fieldProperties.helpText,
          icon: <InfoCircleOutlined />,
        }
      }
      rules={[
        {
          required: data.isRequired,
          message: t('common.labels.multi_media_message'),
        },
      ]}>
      <div
        className={`library-upload multiple-media ${
          (!data.isDataEditable || !canEditField) &&
          'table-section table-disable'
        }`}>
        <div className="ant-row ant-row-middle">
          <div
            className={`ant-upload-drag-icon ant-row ${
              imageList.length > 0 && 'media-row'
            }`}>
            {imageList.length === 0 ? (
              <ImagePreviewIcon />
            ) : (
              imageList.map((item, index) => (
                <div
                  className="multiple-media-img"
                  onClick={() => {
                    deleteImages(index);
                  }}>
                  {item?.id ? (
                    IMAGE_EXTENSIONS.includes(item.type) ? (
                      <picture>
                        <source
                          srcSet={`https://${cacheDomain}/${item.absolutePath}?width=86`}
                        />
                        <img
                          src={`https://${cacheDomain}/${item.absolutePath}?width=86`}
                          alt={item.altText ? item.altText : ''}
                          title={item.caption ? item.caption : ''}
                        />
                      </picture>
                    ) : (
                      <div className="text-center multiple-img-icon">
                        <FolderDocIcon />
                      </div>
                    )
                  ) : (
                    <picture>
                      <source
                        type="image/avif"
                        srcSet={`${process.env.REACT_APP_API_THUMBNAIL_URL}/${workspaceId}/${item}?height=160&expected_file_type=avif`}
                      />
                      <source
                        type="image/webp"
                        srcSet={`${process.env.REACT_APP_API_THUMBNAIL_URL}/${workspaceId}/${item}?height=160&expected_file_type=webp`}
                      />
                      <source
                        type="image/jpg"
                        srcSet={`${process.env.REACT_APP_API_THUMBNAIL_URL}/${workspaceId}/${item}?height=160&expected_file_type=jpg`}
                      />
                      <img
                        src={`${process.env.REACT_APP_API_THUMBNAIL_URL}/${workspaceId}/${item}?height=160&expected_file_type=png`}
                        alt="pic"
                      />
                    </picture>
                  )}
                  <div className="multiple-media-img-hover">
                    <DeleteIcon />
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="ant-row ant-upload-hint ant-space-vertical">
            {imageList.length <= 0 && (
              <span className="m-b-16">
                {t('common.labels.no_image_selected')}
              </span>
            )}
            <Button
              size="small"
              disabled={!data.isDataEditable || !canEditField}
              className={`${
                imageList.length && imageList.length <= 4 && 'm-l-12'
              }`}
              onClick={() => {
                changeIsVisible(true);
              }}>
              Choose File
            </Button>
          </div>
        </div>
      </div>
      <p className="font-sm m-0 gray-text m-t-8">
        {t('common.labels.supported_files')}:{' '}
        {data.fieldProperties.attachedField === 'image'
          ? t('common.labels.images_type')
          : data.fieldProperties.attachedField === 'file'
          ? t('common.labels.doc_type')
          : t('common.labels.all')}
      </p>

      {isVisible && (
        <MediaManager
          accept={
            data.fieldProperties.attachedField === 'image'
              ? 'image'
              : data.fieldProperties.attachedField === 'file'
              ? 'documents'
              : ''
          }
          showSubmenuIcon={false}
          isPopUp={true}
          multiple={true}
          onCancel={onCancel}
          onInsert={(file) => {
            changeIsVisible(false);
            changeImageList(file);
          }}
        />
      )}
    </Form.Item>
  );
};

export default MultiMedia;
