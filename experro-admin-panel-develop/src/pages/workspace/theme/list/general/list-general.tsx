import useListGeneralController from './list-general-controller';
import developmentImage from '../../../../../images/development-theme.png';
import productionImage from '../../../../../images/development-theme.png';
import React from 'react';
import moment from 'moment';
import { UseQueryResult } from 'react-query';
import {
  IAPIError,
  IListEnvironments,
  IThemeStatus,
} from '../../../../../types';
import { Button, Modal, Select, Spin } from 'antd';
import FileUploadIcon from '../../../../../images/icons/file-upload-icon';
import { LoadingOutlined } from '@ant-design/icons';
import DownArrowIcon from '../../../../../images/icons/downarrow-icon';
import DownloadIcon from '../../../../../images/icons/download-icon';
import { APIS_ROUTES } from '../../../../../utills';

interface ListGeneralProps {
  listEnvironments: UseQueryResult<IListEnvironments[], IAPIError>;
  themePublishStatus: UseQueryResult<IThemeStatus | undefined, IAPIError>;
  isThemePublished: boolean;
  setIsThemePublished: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListGeneral: React.FC<ListGeneralProps> = ({ themePublishStatus }) => {
  const {
    t,
    developmentObject,
    productionObject,
    stagingObject,
    isPublishEnvironmentModalVisible,
    onHideSelectEnvironment,
    onEnvironmentToPublish,
    isPublishButtonVisible,
    selectedPublishThemeEnvironment,
    onSelectEnvironmentToPublish,
    listEnvironments,
    themePublishedEnvironmentId,
    onPublishTheme,
    canPublishTheme,
    listTheme,
    workspaceId,
    userDetails,
  } = useListGeneralController(themePublishStatus);

  return (
    <>
      {listTheme.isLoading ? (
        <Spin
          className="HV-center table-center"
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          size="large"
        />
      ) : (
        <>
          {developmentObject && (
            <div className="theme-section">
              <h3 className="title-default m-b-16">
                {t('common.labels.development_theme')}
              </h3>
              <div
                className={`theme-details ant-row ${
                  themePublishStatus.isSuccess &&
                  themePublishStatus.data?.[
                    developmentObject.publishEnvironmentId
                  ]
                    ? 'loading-data'
                    : ''
                } `}>
                <div className="theme-image">
                  <img
                    src={developmentImage}
                    alt="pic"
                    width={216}
                    height={112}
                  />
                </div>
                <div className="theme-content">
                  <div className="theme-content-top ant-row ant-row-space-between">
                    <div>
                      <p className="title-default m-b-8">
                        {developmentObject.name}
                      </p>
                      <span className="gray-text font-sm">
                        {developmentObject.versionHash}
                      </span>
                    </div>
                    <div>
                      {developmentObject.hasSourceCode && (
                        <Button
                          icon={
                            <span className="anticon">
                              <DownloadIcon />
                            </span>
                          }
                          href={`${process.env.REACT_APP_API_URL}${APIS_ROUTES.THEME_SERVICE}/${workspaceId}/theme-versions/${developmentObject.id}/download`}
                          target="_self">
                          {t('common.labels.download')}
                        </Button>
                      )}
                      {canPublishTheme() && (
                        <Button
                          icon={
                            <span className="anticon">
                              <FileUploadIcon />
                            </span>
                          }
                          onClick={() =>
                            onPublishTheme(
                              developmentObject.id,
                              developmentObject.publishEnvironmentId
                            )
                          }>
                          {t('common.labels.publish')}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="ant-row theme-content-bottom">
                    <div>
                      <p className="font-sm font-medium m-0">
                        {t('common.labels.published_on')}
                      </p>
                      <p>
                        {moment(developmentObject?.publishAt).format(
                          'DD MMM YYYY,LT'
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="font-sm font-medium m-0">
                        {t('common.labels.published_by')}
                      </p>
                      <p>
                        {developmentObject?.publishedBy
                          ? userDetails?.listAllUser?.[
                              developmentObject?.publishedBy
                            ]
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="blur-loading-section text-center w-100">
                  <div>
                    <Spin
                      indicator={
                        <LoadingOutlined style={{ fontSize: 40 }} spin />
                      }
                      size="large"
                    />
                    <p className="m-0 m-t-16">
                      Theme publishing in progress...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {productionObject && (
            <div className="theme-section">
              <h3 className="title-default m-b-16">
                {t('common.labels.production_theme')}
              </h3>
              <div
                className={`theme-details ant-row ${
                  themePublishStatus.isSuccess &&
                  themePublishStatus.data?.[
                    productionObject.publishEnvironmentId
                  ]
                    ? 'loading-data'
                    : ''
                } `}>
                <div className="theme-image">
                  <img
                    src={productionImage}
                    alt="pic"
                    width={216}
                    height={112}
                  />
                </div>
                <div className="theme-content">
                  <div className="theme-content-top ant-row ant-row-space-between">
                    <div>
                      <p className="title-default m-b-8">
                        {productionObject.name}
                      </p>
                      <span className="gray-text font-sm">
                        {productionObject.versionHash}
                      </span>
                    </div>
                    <div>
                      {productionObject.hasSourceCode && (
                        <Button
                          icon={
                            <span className="anticon">
                              <DownloadIcon />
                            </span>
                          }
                          href={`${process.env.REACT_APP_API_URL}${APIS_ROUTES.THEME_SERVICE}/${workspaceId}/theme-versions/${productionObject.id}/download`}
                          target="_self">
                          {t('common.labels.download')}
                        </Button>
                      )}
                      {canPublishTheme() && (
                        <Button
                          icon={
                            <span className="anticon">
                              <FileUploadIcon />
                            </span>
                          }
                          onClick={() =>
                            onPublishTheme(
                              productionObject.id,
                              productionObject.publishEnvironmentId
                            )
                          }>
                          {t('common.labels.publish')}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="ant-row theme-content-bottom">
                    <div>
                      <p className="font-sm font-medium m-0">
                        {t('common.labels.published_on')}
                      </p>
                      <p>
                        {moment(productionObject?.publishAt).format(
                          'DD MMM YYYY,LT'
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="font-sm font-medium m-0">
                        {t('common.labels.published_by')}
                      </p>
                      <p>
                        {developmentObject?.publishedBy
                          ? userDetails?.listAllUser?.[
                              developmentObject?.publishedBy
                            ]
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="blur-loading-section text-center w-100">
                  <div>
                    <Spin
                      indicator={
                        <LoadingOutlined style={{ fontSize: 40 }} spin />
                      }
                      size="large"
                    />
                    <p className="m-0 m-t-16">
                      Theme publishing in progress...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {stagingObject && (
            <div className="theme-section">
              <h3 className="title-default m-b-16">
                {t('common.labels.staging_theme')}
              </h3>
              <div
                className={`theme-details ant-row ${
                  themePublishStatus.isSuccess &&
                  themePublishStatus.data?.[stagingObject.publishEnvironmentId]
                    ? 'loading-data'
                    : ''
                } `}>
                <div className="theme-image">
                  <img
                    src={productionImage}
                    alt="pic"
                    width={216}
                    height={112}
                  />
                </div>
                <div className="theme-content">
                  <div className="theme-content-top ant-row ant-row-space-between">
                    <div>
                      <p className="title-default m-b-8">
                        {stagingObject.name}
                      </p>
                      <span className="gray-text font-sm">
                        {stagingObject.versionHash}
                      </span>
                    </div>
                    <div>
                      {canPublishTheme() && (
                        <Button
                          icon={
                            <span className="anticon">
                              <FileUploadIcon />
                            </span>
                          }
                          onClick={() =>
                            onPublishTheme(
                              stagingObject.id,
                              stagingObject.publishEnvironmentId
                            )
                          }>
                          {t('common.labels.publish')}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="ant-row theme-content-bottom">
                    <div>
                      <p className="font-sm font-medium m-0">
                        {t('common.labels.published_on')}
                      </p>
                      <p>
                        {moment(stagingObject?.publishAt).format(
                          'DD MMM YYYY,LT'
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="font-sm font-medium m-0">
                        {t('common.labels.published_by')}
                      </p>
                      <p>
                        {developmentObject?.publishedBy
                          ? userDetails?.listAllUser?.[
                              developmentObject?.publishedBy
                            ]
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="blur-loading-section text-center w-100">
                  <div>
                    <Spin
                      indicator={
                        <LoadingOutlined style={{ fontSize: 40 }} spin />
                      }
                      size="large"
                    />
                    <p className="m-0 m-t-16">
                      Theme publishing in progress...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        centered
        className="CustomModal CustomModal-small"
        open={isPublishEnvironmentModalVisible}
        title={t('common.labels.select_environment_to_publish')}
        onCancel={onHideSelectEnvironment}
        footer={[
          <Button key="back" onClick={onHideSelectEnvironment}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={onEnvironmentToPublish}
            disabled={isPublishButtonVisible}>
            {t('common.labels.publish')}
          </Button>,
        ]}>
        <>
          <span className="text-dark-gray">
            {t('common.labels.environment')}
          </span>
          <Select
            className="w-100 m-t-8"
            placeholder="Select Environment"
            value={selectedPublishThemeEnvironment}
            suffixIcon={<DownArrowIcon />}
            onChange={onSelectEnvironmentToPublish}>
            {listEnvironments.isSuccess &&
              listEnvironments.data &&
              listEnvironments.data.length > 0 &&
              listEnvironments.data.map((environment) => {
                if (environment.id !== themePublishedEnvironmentId) {
                  return (
                    <Select.Option value={environment.id}>
                      {environment.title}
                    </Select.Option>
                  );
                }
                return null;
              })}
          </Select>
        </>
      </Modal>
    </>
  );
};

export default ListGeneral;
