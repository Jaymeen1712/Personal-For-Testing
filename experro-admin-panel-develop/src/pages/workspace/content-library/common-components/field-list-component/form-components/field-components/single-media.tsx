import { Form, Button } from 'antd';
import React from 'react';

import ImagePreviewIcon from '../../../../../../../images/icons/image-preview-icon';
import { IContentLibraryFieldPops } from '../../../../../../../types';
import { useFieldPermission, useMediaController } from './controllers';
import MediaManager from '../../../../../media-manager';

import { InfoCircleOutlined } from '@ant-design/icons';
import DeleteIcon from '../../../../../../../images/icons/delete-icon';
import { IMAGE_EXTENSIONS } from '../../../../../../../utills';
import FolderDocIcon from '../../../../../../../images/icons/folder-doc-icon';

interface FieldProps {
  contentModalInternalName: string;
  data: IContentLibraryFieldPops;
  componentName?: string;
  isViewContentInPopupOpen?: boolean;
}

const SingleMedia: React.FC<FieldProps> = ({
  contentModalInternalName,
  data,
  componentName,
  isViewContentInPopupOpen,
}) => {
  // console.log('test', data.fieldProperties.attachedField);
  const {
    workspaceId,
    changeIsVisible,
    isVisible,
    imageList,
    changeImageList,
    deleteImages,
    t,
    onCancel,
    onMediaSelectAction,
    cacheDomain,
  } = useMediaController(data, isViewContentInPopupOpen);
  const { canEditField } = useFieldPermission(
    contentModalInternalName,
    data,
    componentName
  );
  return (
    <>
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
          multiple={false}
          onInsert={(file) => {
            changeIsVisible(false);
            changeImageList(file);
            onMediaSelectAction(file, data.name, data.editValue);
          }}
          onCancel={onCancel}
        />
      )}
      <Form.Item
        label={`${data.title} ${t('common.labels.media_single')}`}
        name={data.name}
        tooltip={
          data.fieldProperties.helpText && {
            title: data.fieldProperties.helpText,
            icon: <InfoCircleOutlined />,
          }
        }
        rules={[{ required: data.isRequired, message: 'Please enter value' }]}>
        <div
          className={`library-upload single-media ${
            (!data.isDataEditable || !canEditField) &&
            'table-section table-disable'
          }`}>
          <div className="ant-row ant-row-middle">
            <div className="ant-upload-drag-icon">
              {imageList.length === 0 ? (
                <ImagePreviewIcon />
              ) : (
                imageList.map((item) => (
                  <div
                    className="multiple-media-img"
                    onClick={() => {
                      deleteImages(0);
                      onMediaSelectAction([], data.name, data.editValue);
                    }}>
                    {item?.id ? (
                      IMAGE_EXTENSIONS.includes(item.type) ? (
                        <picture>
                          <source
                            srcSet={`https://${cacheDomain}/${item.absolutePath}?width=120`}
                          />
                          <img
                            src={`https://${cacheDomain}/${item.absolutePath}?width=120`}
                            alt={item.altText ? item.altText : ''}
                            title={item.caption ? item.caption : ''}
                          />
                        </picture>
                      ) : (
                        <div className="media-default-icon">
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

                    <div className="multiple-media-img-hover ">
                      <DeleteIcon />
                    </div>
                  </div>
                ))
              )}
            </div>
            <div>
              <div className="ant-upload-hint ant-row">
                <span className="m-b-16">
                  {imageList.length > 0 && imageList[0].id
                    ? imageList[0].name
                    : t('common.labels.no_image_selected')}
                </span>
                <Button
                  size="small"
                  disabled={!data.isDataEditable || !canEditField}
                  className=""
                  onClick={() => {
                    changeIsVisible(true);
                  }}>
                  Choose File
                </Button>
              </div>
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
      </Form.Item>
    </>
  );
};

export default SingleMedia;
