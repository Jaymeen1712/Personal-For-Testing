import { Button, Col, Modal, Row, Table } from 'antd';
import APITokenBannerImage from '../../../../../images/icons/api-token-banner-image';
import useListAPITokenController from './list-api-token-controller';
import { Trans } from 'react-i18next';

const ListApiToken = () => {
  const {
    t,
    isModalVisible,
    hideModal,
    onDeleteToken,
    columns,
    onAddAPITokenClick,
    createAPITokenPermission,
    listApiToken,
    pagination,
    deleteAPIToken,
  } = useListAPITokenController();
  return (
    <div className="page-content">
      {!listApiToken.isLoading &&
        (listApiToken.isSuccess && listApiToken.data?.items !== undefined ? (
          <>
            <div className="ant-row ant-row-space-between m-b-40">
              <div className="w-480">
                <h3 className="title-default m-b-8">
                  {t('common.labels.api_tokens')}
                </h3>
                <p className="m-0">
                  <Trans
                    i18nKey={t('common.messages.tokens_banner_description', {
                      entity: 'doc',
                    })}
                    components={{
                      doc: (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://developer.experro.com/api-docs/9maocpby81ng1-about-our-ap-is">
                          API docs
                        </a>
                      ),
                    }}
                  />
                </p>
              </div>
              <div>
                {createAPITokenPermission && (
                  <Button
                    id={t('common.labels.create_token')}
                    type="primary"
                    onClick={onAddAPITokenClick}>
                    {t('common.labels.create_token')}
                  </Button>
                )}
              </div>
            </div>
            <div className="table-section">
              <Table
                columns={columns}
                //@ts-ignore
                dataSource={listApiToken?.data?.items}
                pagination={pagination}
              />
            </div>
          </>
        ) : (
          <Row className="generate-box ant-row ant-space-align-center p-32">
            <Col span={12}>
              <div className="generate-box-content p-l-32">
                <h1 className="h4 m-b-16 secondary-black">
                  {t('common.labels.api_tokens')}
                </h1>
                <p className="m-b-32 gray-text">
                  <Trans
                    i18nKey={t('common.messages.tokens_banner_description', {
                      entity: 'doc',
                    })}
                    components={{
                      doc: (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://developer.experro.com/api-docs/9maocpby81ng1-about-our-ap-is">
                          API docs
                        </a>
                      ),
                    }}
                  />
                </p>

                {createAPITokenPermission && (
                  <Button type="primary" onClick={onAddAPITokenClick}>
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
      <Modal
        className="confirm-modal"
        title={t('common.labels.api_token_delete_title')}
        open={isModalVisible}
        centered
        onCancel={hideModal}
        footer={[
          <Button key="deleteAPITokenCancel" onClick={hideModal}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            key="deleteAPIToken"
            type="primary"
            loading={deleteAPIToken.isLoading}
            danger
            onClick={onDeleteToken}>
            {t('common.labels.delete')}
          </Button>,
        ]}>
        <p>{t('common.messages.delete_api_token_message')}</p>
      </Modal>
    </div>
  );
};

export default ListApiToken;
