import React from 'react';
import { Button, Input } from 'antd';

import Modal from '../../../../../components/modal';
import SearchIcon from '../../../../../images/icons/search-icon';
import FolderIcon from '../../../../../images/icons/folder-icon';
import useMoveFolderModalController from './move-folder-modal-controller';
import NoDataFound from '../../../../../components/no-data-found';

interface MoveFolderProps {
  isModalVisible: boolean;
  folderId?: string;
  onMoveFile: (targetFolderId?: string) => void;
  hideModal: () => void;
  isMoveFileLoading?: boolean;
}

const MoveFolderModal: React.FC<MoveFolderProps> = ({
  isModalVisible,
  hideModal,
  onMoveFile,
  folderId,
  isMoveFileLoading,
}) => {
  const {
    t,
    folders,
    search,
    targetFolderId,
    onFolderClick,
    onSearchChange,
    listFolder,
  } = useMoveFolderModalController(folderId);

  return (
    <Modal
      classname="CustomModal CustomModal-small"
      isModalVisibility={isModalVisible}
      title={t('common.labels.move_items_to')}
      hideModal={hideModal}
      confirmLoading={listFolder.isLoading}
      footer={[
        <Button key="cancel" onClick={hideModal}>
          {t('common.labels.cancel')}
        </Button>,
        <Button
          disabled={targetFolderId.length === 0}
          key="submit"
          type="primary"
          loading={isMoveFileLoading}
          onClick={() => onMoveFile(targetFolderId)}>
          {t('common.labels.move')}
        </Button>,
      ]}>
      <div>
        <div className="m-b-24 move-folder-search">
          {/* <Text type="secondary" className="custom-input-label">
            {t('common.labels.search_folder')}
          </Text> */}
          <Input
            placeholder={t('common.labels.search_folder')}
            suffix={<SearchIcon />}
            value={search}
            onChange={onSearchChange}
          />
        </div>
        <div className="folder-list">
          {folders?.find((folder) => folder.name) ? (
            <>
              <p className="m-b-12">{t('common.labels.all_folder')}</p>
              <ul>
                {folders?.map((folder) => (
                  <li
                    key={folder.id}
                    className={`cursor-pointer ${
                      folder.id === targetFolderId ? 'active' : ''
                    }`}
                    onClick={onFolderClick.bind(this, folder.id)}>
                    <FolderIcon />
                    {folder.name}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <NoDataFound title={t('common.messages.no_folder_found')} />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MoveFolderModal;
