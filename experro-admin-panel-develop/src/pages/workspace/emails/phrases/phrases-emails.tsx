import React, { MutableRefObject } from 'react';
import { Button, Input, Spin, Table } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import NoDataFound from '../../../../components/no-data-found';
import NoRecordIcon from '../../../../images/icons/no-records-icon';
import usePhrasesController from './phrases-controller';
import Modal from '../../../../components/modal';
import CreateUpdatePhrases from './create-update';
import SearchIcon from '../../../../images/icons/search-icon';

interface IPhrasesEmails {
  defaultActiveKey?: string;
  emailRef: MutableRefObject<null>;
}

const PhrasesEmails: React.FC<IPhrasesEmails> = ({
  defaultActiveKey,
  emailRef,
}) => {
  const {
    getPhraseEmails,
    columns,
    pagination,
    t,
    addPhrase,
    isCreateUpdatePhrasesModalVisible,
    onHideCreateUpdatePhraseModal,
    form,
    onNameChange,
    onAddPhrase,
    isDeleteModalVisible,
    onHideDeleteModalVisible,
    onDeletePhrase,
    editRecordId,
    shortCode,
    canCreateEmailTemplate,
    filter,
    onFilterChange,
    onPhrasesSelectChange,
    isAllPhrasesSelected,
    onClearAllPhrases,
    onSelectAllPhrases,
    deletePhrasesIds,
    onDeleteMultipleData,
    handleFieldChange,
    disableSave,
    onShortCodeCopy,
    deleteSinglePhrases,
    canDeleteEmailTemplate,
  } = usePhrasesController({ defaultActiveKey, emailRef });

  return (
    <>
      <div
        className={`${
          getPhraseEmails.data &&
          getPhraseEmails.data.items.length === 0 &&
          !filter
            ? 'display-none'
            : 'search-section'
        } ant-row ant-row-space-between`}>
        <div className="ant-row ant-space-align-center">
          <div className="m-0 ">
            <>
              <Input
                size="middle"
                className="m-r-16"
                placeholder={t('common.labels.search')}
                prefix={<SearchIcon />}
                onChange={onFilterChange}
              />
            </>
          </div>

          {getPhraseEmails.isSuccess && (
            <span
              className={`${
                (getPhraseEmails.isSuccess &&
                  getPhraseEmails.data.totalCount > 0) ||
                filter ||
                deletePhrasesIds.length > 0
                  ? 'search-count'
                  : 'display-none'
              }`}>
              {deletePhrasesIds && deletePhrasesIds.length > 0
                ? `${deletePhrasesIds.length} ${t('common.labels.selected')}`
                : getPhraseEmails?.data && getPhraseEmails?.data?.totalCount > 1
                ? `${t('common.labels.total_records', {
                    entity:
                      getPhraseEmails.data &&
                      getPhraseEmails.data.totalCount &&
                      getPhraseEmails.data.totalCount,
                  })}`
                : `${t('common.labels.total_record', {
                    entity:
                      getPhraseEmails.data &&
                      getPhraseEmails.data.totalCount &&
                      getPhraseEmails.data.totalCount,
                  })}`}
            </span>
          )}
        </div>

        {((getPhraseEmails.isSuccess &&
          getPhraseEmails.data.items.length > 0) ||
          filter) &&
          (deletePhrasesIds.length > 0
            ? canDeleteEmailTemplate && (
                <>
                  <Button danger onClick={onDeleteMultipleData} type="primary">
                    {t('common.labels.delete')}
                  </Button>
                </>
              )
            : canCreateEmailTemplate && (
                <Button onClick={addPhrase} type="primary">
                  {t('common.labels.add_phrase')}
                </Button>
              ))}
      </div>

      {(getPhraseEmails.isSuccess && getPhraseEmails.data.items.length) ||
      filter ? (
        <div className="table-section">
          <>
            <Table
              className="tableCellPadding-9"
              columns={columns}
              dataSource={getPhraseEmails.data?.items}
              pagination={pagination}
              locale={{
                emptyText: (
                  <NoDataFound
                    icon={<NoRecordIcon />}
                    title={t('common.labels.no_phrases_found')}
                    description={t(
                      'common.labels.no_phrases_found_description'
                    )}
                  />
                ),
              }}
              rowSelection={{
                type: 'checkbox',
                /* eslint-disable @typescript-eslint/no-explicit-any */
                selectedRowKeys: deletePhrasesIds.map((item: any) => item),
                onChange: onPhrasesSelectChange,
                onSelectAll: isAllPhrasesSelected
                  ? onClearAllPhrases
                  : onSelectAllPhrases,
              }}
              rowKey="id"
            />
          </>
        </div>
      ) : (
        <>
          {getPhraseEmails.isLoading || getPhraseEmails.isFetching ? (
            <Spin
              className="HV-center"
              indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
              size="large"
            />
          ) : (
            !getPhraseEmails.isFetching &&
            !getPhraseEmails.isLoading && (
              <div className="no-data">
                <>
                  <NoRecordIcon />
                </>
                <h5>{t('common.labels.no_phrases_found')}</h5>
                <span>{t('common.labels.no_phrases_added_description')}</span>
                {canCreateEmailTemplate && (
                  <Button onClick={addPhrase} type="primary">
                    {t('common.labels.add_phrase')}
                  </Button>
                )}
              </div>
            )
          )}
        </>
      )}

      <CreateUpdatePhrases
        editRecordId={editRecordId}
        t={t}
        isCreateUpdatePhrasesModalVisible={isCreateUpdatePhrasesModalVisible}
        onHideCreateUpdatePhraseModal={onHideCreateUpdatePhraseModal}
        handleFieldChange={handleFieldChange}
        disableSave={disableSave}
        onAddPhrase={onAddPhrase}
        form={form}
        onNameChange={onNameChange}
        shortCode={shortCode}
        onShortCodeCopy={onShortCodeCopy}
      />

      <Modal
        classname="confirm-modal"
        onOK={onDeletePhrase}
        okText={t('common.labels.delete')}
        hideModal={onHideDeleteModalVisible}
        isModalVisibility={isDeleteModalVisible}
        title={
          deletePhrasesIds.length > 1
            ? t('common.labels.delete_selected_phrases')
            : t('common.messages.delete_entity', {
                entity: deleteSinglePhrases // @ts-ignore
                  ? getPhraseEmails.data?.items.find(
                      (phrase) => phrase.id === deleteSinglePhrases
                    ).name
                  : getPhraseEmails.data && deletePhrasesIds[0]
                  ? // @ts-ignore
                    getPhraseEmails.data.items.find(
                      (phrase) => phrase.id === deletePhrasesIds[0]
                    ).name
                  : '',
              })
        }>
        <div className="user-delete-modal">
          <p className="m-0 gray-text">
            {t('common.messages.delete_phrase_modal_message')}
          </p>
        </div>
      </Modal>
    </>
  );
};

export default PhrasesEmails;
