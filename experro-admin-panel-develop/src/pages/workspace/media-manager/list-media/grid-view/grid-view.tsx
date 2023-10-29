import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import FolderFillIcon from '../../../../../images/icons/folder-fill-icon';
import FileCard from './file-card';
import {
  IFile,
  IFolder,
  IGlobalSearch,
  ISubFolder,
} from '../../../../../types';
import { Button, Col, Row } from 'antd';

interface GridViewProps {
  files?: IFile[];
  folders?: ISubFolder[];
  selectedFiles?: IFile[];
  onFolderClick: (folderId: string) => void;
  onFileSelectChange: (file: IFile) => void;
  onLinkCopy: () => void;
  onClickHover?: (fileId: string) => void;
  menuList: {
    key: string;
    onClick?: (fileId: string) => void;
    label: string | ReactNode;
  }[];
  multiple?: boolean;
  isPopUp?: boolean;
  isLoading: boolean;
  search: IGlobalSearch;
  mediaSearchList: IFolder[];
  updatePageNum: () => void;
  perPage: number;
  filter: string;
}

const GridView: React.FC<GridViewProps> = ({
  files,
  folders,
  onFolderClick,
  onFileSelectChange,
  selectedFiles,
  onLinkCopy,
  onClickHover,
  menuList,
  multiple,
  isPopUp,
  isLoading,
  search,
  mediaSearchList,
  updatePageNum,
  perPage,
  filter,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <>
        {folders && folders.length > 0 && (
          <>
            <p className="gray-text m-b-16">{t('common.labels.folders')}</p>
            <Row gutter={16} className="m-b-40 folder-grid">
              {folders.map((folder) => (
                <Col lg={8} xl={6} className="m-b-16">
                  <div
                    className="ant-row folder-list"
                    onClick={onFolderClick.bind(this, folder.id)}>
                    <div className='folder-grid-icon'>
                      <FolderFillIcon />
                    </div>
                    <div className='folder-grid-desc'>
                      <p className="m-b-4 text-truncate with-pixel-large"> {folder.name}</p>
                      <div className="folder-info-bottom">
                        <span>
                          {folder.foldersCount && folder.foldersCount > 1
                            ? `${folder.foldersCount} ${t(
                                'common.labels.folders'
                              )}`
                            : `${folder.foldersCount} ${t(
                                'common.labels.folder'
                              )}`}
                        </span>
                        <span>
                          {folder.filesCount && folder.filesCount > 1
                            ? `${folder.filesCount} ${t('common.labels.media')}`
                            : `${folder.filesCount} ${t(
                                'common.labels.media'
                              )}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}

        {files && files.length > 0 && (
          <>
            <p className="gray-text m-b-16">{t('common.labels.media')}</p>

            <Row gutter={16} className="media-grid-layout">
              {files.map(
                (file) =>
                  file.type && (
                    <FileCard
                      t={t}
                      key={file.id}
                      file={file}
                      selectedFiles={selectedFiles}
                      onFileSelectChange={onFileSelectChange}
                      onLinkCopy={onLinkCopy}
                      menuList={menuList}
                      onClickHover={onClickHover}
                      multiple={multiple}
                      isPopUp={isPopUp}
                    />
                  )
              )}
            </Row>
          </>
        )}

        <div className="text-center load-more-button">
          {!isLoading && filter?.length > 0 ? (
            search?.fileCount &&
            search?.fileCount > 0 &&
            mediaSearchList?.length < search?.fileCount ? (
              <Button type="primary" onClick={() => updatePageNum()}>
                {t('common.labels.load_more')}
              </Button>
            ) : (
              Number(search?.fileCount) > perPage && (
                <span>{t('common.labels.that_is_all_folks')}</span>
              )
            )
          ) : (
            files &&
            files?.length > 0 &&
            files[0].totalFiles &&
            (files?.length < files[0].totalFiles ? (
              <Button type="primary" onClick={() => updatePageNum()}>
                {t('common.labels.load_more')}
              </Button>
            ) : (
              Number(files[0].totalFiles) > perPage && (
                <span>{t('common.labels.that_is_all_folks')}</span>
              )
            ))
          )}
        </div>
      </>
    </>
  );
};

export default GridView;
