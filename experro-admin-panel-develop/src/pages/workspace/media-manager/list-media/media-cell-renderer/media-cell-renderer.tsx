import React, { ReactNode } from 'react';
import { Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { IFile, IMedia } from '../../../../../types';
import CopyIcon from '../../../../../images/icons/copy-icon';
import GridMenu from '../../../../../components/grid-menu';
import MediaIcon from '../media-icon';
import FolderFillIcon from '../../../../../images/icons/folder-fill-icon';
import {
  APPLICATION_EXTENSIONS,
  AUDIO_EXTENSIONS,
  IMAGE_EXTENSIONS,
  TEXT_EXTENSIONS,
} from '../../../../../utills';

const { Paragraph } = Typography;

interface FileListCellRendererProps {
  media: IMedia;
  selectedFiles?: IFile[];
  menuList: {
    key: string;
    onClick?: (fileId: string) => void;
    label: string | ReactNode;
    onHref?: (id: string) => string | undefined;
  }[];
  onLinkCopy: () => void;
  onFolderClick: (folderId: string) => void;
  onFileSelectChange: (file: IFile) => void;
  onFileClick: (folderId: string) => void;
  isPopUp?: boolean;
  multiple?: boolean;
}

const FileListCellRenderer: React.FC<FileListCellRendererProps> = ({
  media,
  selectedFiles,
  menuList,
  onLinkCopy,
  onFolderClick,
  onFileSelectChange,
  onFileClick,
  isPopUp,
  multiple,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {media.type ? (
        <>
          <div className="ant-row ant-space-align-center ant-row-space-between w-100">
            <div
              className="table-img cursor-pointer"
              onClick={
                isPopUp
                  ? () => onFileSelectChange(media)
                  : onFileClick.bind(this, media.id)
              }>
              <div className="img">
                {media && (
                  <MediaIcon
                    isPopUp={isPopUp}
                    fileDetails={media}
                    type={media.type}
                    url={media.url}
                    isListMediaPage
                  />
                )}
              </div>
              <div className="list-view-folder">
                <p className='text-truncate with-pixel-small'>{media.name}</p>
                <div className="folder-info-bottom">
                  <span>
                    {IMAGE_EXTENSIONS.includes(media.type)
                      ? 'Image'
                      : AUDIO_EXTENSIONS.includes(media.type)
                      ? 'Audio'
                      : TEXT_EXTENSIONS.includes(media.type)
                      ? 'Text'
                      : APPLICATION_EXTENSIONS.includes(media.type)
                      ? 'Application'
                      : 'document'}
                  </span>
                </div>
              </div>
            </div>
            <div className="ant-row ant-space-align-center ant-row-space-between">
              <Tooltip placement="top" title={t('common.labels.copy_link')}>
                <Paragraph
                  className="OnlyIcon on-hover"
                  copyable={{
                    text: media.url,
                    icon: <CopyIcon />,
                    tooltips: false,
                    onCopy: onLinkCopy,
                  }}
                />
              </Tooltip>
              {menuList?.length > 0 && (
                <GridMenu menuList={menuList} id={media.id} />
              )}
            </div>
          </div>
        </>
      ) : (
        <div
          className="table-img cursor-pointer"
          onClick={onFolderClick.bind(this, media.id)}>
          <div className="img">
            <FolderFillIcon />
          </div>
          <div className="list-view-folder">
            <p className='text-truncate with-pixel-small'>{media.name}</p>
            <div className="folder-info-bottom">
              <span>
                {media.foldersCount && media.foldersCount > 1
                  ? `${media.foldersCount} ${t('common.labels.folders')}`
                  : `${media.foldersCount} ${t('common.labels.folder')}`}
              </span>
              <span>
                {media.filesCount && media.filesCount > 1
                  ? `${media.filesCount} ${t('common.labels.media')}`
                  : `${media.filesCount} ${t('common.labels.media')}`}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default FileListCellRenderer;
