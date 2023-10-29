import { Button, Col, Modal, Row, Table } from 'antd';
import useListCLITokenController from './list-cli-token-controller';
import CreateUpdateCLIToken from '../create-update';
import { Trans } from 'react-i18next';
import APITokenBannerImage from '../../../../../images/icons/api-token-banner-image';

const ListCLIToken = () => {
  const {
    t,
    isCreateModalVisible,
    onCreateCLIToken,
    columns,
    listCLITokenData,
    isLoading,
    hideDeleteModal,
    onDeleteToken,
    isDeleteModalVisible,
    CLITokenId,
    setIsCreateModalVisible,
    isDeleteLoading,
    setCLITokenId,
    setIsModalVisible,
    isModalVisible,
    onCancelCLIToken,
    // onChangeTable,
    pagination,
    createCLITokenPermission,
    // isFetching,
  } = useListCLITokenController();

  return (
    <>
      <div className="page-content">
        <>
          {!isLoading &&
            (listCLITokenData !== undefined ? (
              <>
                <div className="ant-row ant-row-space-between m-b-40">
                  <div className="w-480">
                    <h3 className="title-default m-b-8">
                      {t('common.labels.cli_tokens')}
                    </h3>
                    <p className="m-0">
                      <Trans
                        i18nKey={t(
                          'common.messages.cli_token_banner_description',
                          {
                            entity: 'doc',
                          }
                        )}
                        components={{
                          doc: (
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href="https://developer.experro.com/theme-docs/4vpfkwoq5oovj-installing-experro-cli">
                              CLI docs
                            </a>
                          ),
                        }}
                      />
                    </p>
                  </div>
                  <div>
                    {createCLITokenPermission && (
                      <Button
                        id={t('common.labels.create_token')}
                        type="primary"
                        onClick={onCreateCLIToken}>
                        {t('common.labels.create_token')}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="table-section">
                  <Table
                    // loading={isLoading || isFetching}
                    showSorterTooltip={false}
                    columns={columns}
                    //@ts-ignore
                    dataSource={listCLITokenData}
                    pagination={pagination}
                    // onChange={onChangeTable}
                  />
                </div>
              </>
            ) : (
              <Row className="generate-box ant-row ant-space-align-center p-32">
                <Col span={12}>
                  <div className="generate-box-content p-l-32">
                    <h1 className="h4 m-b-16 secondary-black">
                      {t('common.labels.cli_tokens')}
                    </h1>
                    <p className="m-b-32 gray-text">
                      <Trans
                        i18nKey={t(
                          'common.messages.cli_token_banner_description',
                          {
                            entity: 'doc',
                          }
                        )}
                        components={{
                          doc: (
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href="https://developer.experro.com/theme-docs/4vpfkwoq5oovj-installing-experro-cli">
                              CLI docs
                            </a>
                          ),
                        }}
                      />
                    </p>
                    {createCLITokenPermission && (
                      <Button type="primary" onClick={onCreateCLIToken}>
                        {t('common.labels.create_token')}
                      </Button>
                    )}
                  </div>
                </Col>
                <Col span={12}>
                  <div className="generate-box-img ant-row ant-row-end">
                    <APITokenBannerImage />
                  </div>
                </Col>
              </Row>
            ))}
        </>
      </div>
      <>
        {(isCreateModalVisible || isModalVisible) && (
          <CreateUpdateCLIToken
            isCreateModalVisible={isCreateModalVisible}
            tokenId={CLITokenId}
            setCLITokenId={setCLITokenId}
            onCancelCLIToken={onCancelCLIToken}
            setIsCreateModalVisible={setIsCreateModalVisible}
            setIsModalVisible={setIsModalVisible}
            isModalVisible={isModalVisible}
          />
        )}

        <Modal
          className="confirm-modal"
          title={t('common.labels.delete_cli_token')}
          open={isDeleteModalVisible}
          centered
          onCancel={hideDeleteModal}
          footer={[
            <Button key="deleteCLIToken" onClick={hideDeleteModal}>
              {t('common.labels.cancel')}
            </Button>,
            <Button
              key="deleteCLIToken"
              type="primary"
              loading={isDeleteLoading}
              danger
              onClick={onDeleteToken}>
              {t('common.labels.delete')}
            </Button>,
          ]}>
          <p>{t('common.messages.confirm_delete_cli_token')}</p>
        </Modal>
      </>
    </>
  );
};

export default ListCLIToken;
