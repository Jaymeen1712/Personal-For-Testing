import React from 'react';
import { Spin, Table } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import AddLanguage from '../add-language';
import Modal from '../../../../components/modal';
import useAddReOrderInternationalization from './add-reorder-internationalization-controller';

const AddReorderInternationalization: React.FC = () => {
  const {
    selectedLanguages,
    columns,
    DraggableContainer,
    DraggableBodyRow,
    isModalVisible,
    hideModal,
    deleteLanguage,
    t,
    canAddLanguage,
    canUpdateLanguage,
    isFetching,
    isLoading,
    removeWorkspaceLanguage,
    languageDeleteName,
    languageDeleteLocale,
  } = useAddReOrderInternationalization();

  return (
    <>
      {canAddLanguage && <AddLanguage selectedLanguages={selectedLanguages} />}

      <p className="m-b-16 p-12 font-semibold gray-text title-with-border">
        {t('common.labels.internationalize_title')}
      </p>

      {!isFetching || !isLoading ? (
        <Table
          pagination={false}
          showHeader={false}
          dataSource={selectedLanguages}
          columns={columns}
          rowKey="index"
          style={{ width: 300 }}
          className="drag-content"
          components={
            canUpdateLanguage
              ? {
                  body: {
                    wrapper: DraggableContainer,
                    row: DraggableBodyRow,
                  },
                }
              : {}
          }
        />
      ) : (
        <Spin
          data-testid={'loader'}
          className="HV-center table-center"
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          size="large"
        />
      )}

      <Modal
        classname="confirm-modal"
        title={t('common.labels.internationalization_delete_title', {
          language: languageDeleteName,
          languageDeleteLocale: languageDeleteLocale,
        })}
        isModalVisibility={isModalVisible}
        hideModal={hideModal}
        onOK={deleteLanguage}
        confirmLoading={removeWorkspaceLanguage.isLoading ? true : false}
        okText="Delete">
        <p className="text-dark-gray">
          {t('common.labels.all_data_wiped_immediately_language')}
        </p>
      </Modal>
    </>
  );
};

export default AddReorderInternationalization;
