import { Button, Collapse, Modal, Select, Tabs, Tag, Tooltip } from 'antd';
import React from 'react';

import ConfigIcon from '../../../../../images/icons/config-icon';
import PublishStatusIcon from '../../../../../images/icons/publish-status-icon';
import InfoIcon from '../../../../../images/icons/Info-icon';
import BigCommerceIcon from '../../../../../images/icons/big-commerce-icon';
import useFieldListRightSideBarController from './field-list-right-side-bar-controller';
import { ContentModelList, ILanguage } from '../../../../../types';
import UpdateVersionNameModal from '../update-version-name-modal';
import FormField from '../field-list-component/form-components';
import useFieldPermissionCheck from '../../utils/field-permission-check';
import CrosscloseIcon from '../../../../../images/icons/crossicon';
import PublishStatusHoverIcon from '../../../../../images/icons/publish-status-hover-icon';
import ConfigHoverIcon from '../../../../../images/icons/config-hover-icon';
import InfoHoverIcon from '../../../../../images/icons/Info-hover-icon';
import BigCommerceHoverIcon from '../../../../../images/icons/big-commerce-hover-icon';
import moment from 'moment/moment';
import DownArrowIcon from '../../../../../images/icons/downarrow-icon';
import ArrowRightIcon from '../../../../../images/icons/arrow-right-icon';
import ShopifyDefaultIcon from '../../../../../images/icons/shopify-default-icon';
import ShopifyHoverIcon from '../../../../../images/icons/shopify-hover-icon';

const FieldListRightSideBar: React.FC<{
  selectedContentModalDetails: ContentModelList;
  headerTitleAndSubtitle: {
    title: '';
    subtitle: '';
  };
  isEcommerceRedirectionTabVisible?: boolean;
  versionNo?: string;
  versionName?: string;
  changerRightSideMenuClose: (val: string) => void;
  languageAvailableInRecord: string[];
  versionList: {
    id: string;
    versionName: string;
    versionNo: number;
  }[];
  onVersionChange: () => void;
  onLanguageChange: () => void;
  workspaceLanguageList?: ILanguage[];
  currentVersionStatus: {
    id: string;
    name: string;
    status: string;
  }[];
  providerIdEsi?: string;
  createdBy: string;
  modifiedBy: string;
  createdAt: string;
  modifiedAt: string;
  recordId: string;
  defaultTemplateId?: string;
  lastSyncAt?: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  relationFieldValues: any;
  currentVersionId: string;
  providerEsi?: string;
  storeHash?: string;
}> = ({
  selectedContentModalDetails,
  headerTitleAndSubtitle,
  isEcommerceRedirectionTabVisible,
  versionName,
  versionNo,
  changerRightSideMenuClose,
  languageAvailableInRecord,
  versionList,
  onVersionChange,
  onLanguageChange,
  workspaceLanguageList,
  currentVersionStatus,
  providerIdEsi,
  createdBy,
  modifiedBy,
  createdAt,
  modifiedAt,
  lastSyncAt,
  recordId,
  defaultTemplateId,
  relationFieldValues,
  currentVersionId,
  providerEsi,
  storeHash,
}) => {
  const {
    t,
    onRightSideCollapseChange,
    onRightSideTabChange,
    onRightMenuCloseClick,
    isUpdateVersionNameModalVisible,
    changeUpdateVersionNameModalVisibility,
    canEditVersion,
    VersionPublishQueue,
    userList,
    languagesList,
    newRecordFieldDetails,
    pageTemplateList,
    onTemplateChange,
    onEditInBigCommerceButtonClick,
    onSyncButtonClick,
    loadingBigCommerce,
    onPurgeCacheClick,
    environmentId,
    canDeleteCache,
    canReadCache,
    onVersionHistoryButtonClick,
    isModalIsEcommerceBrand,
    onPurgeAllCacheClick,
    isPurgeAllCacheModalVisible,
    onPurgeAllCacheCancel,
    onPurgeAllCacheConfirm,
    isSeeMoreVersionDetailsButtonVisible,
    onSeeMoreVersionDetailsButtonClick,
  } = useFieldListRightSideBarController(
    changerRightSideMenuClose,
    selectedContentModalDetails,
    currentVersionId,
    providerIdEsi,
    providerEsi,
    storeHash
  );
  const { Panel } = Collapse;
  const { Option } = Select;
  const { fieldPermissionCheck } = useFieldPermissionCheck(
    selectedContentModalDetails?.internalName
  );

  return (
    <>
      <div className="content-library-right">
        <Tabs
          defaultActiveKey="1"
          tabPosition="right"
          type="card"
          onTabClick={onRightSideTabChange}>
          <Tabs.TabPane
            tab={
              <Tooltip title="Configurations" placement="left">
                <span className="content-icon">
                  <ConfigIcon />
                  <ConfigHoverIcon />
                </span>
              </Tooltip>
            }
            key="config">
            <div className="content-library-right-content">
              <div className="ant-row ant-space-align-center ant-row-space-between content-library-right-content-title">
                <h3 className="m-0">{t('common.labels.configurations')}</h3>
                <div
                  className="cursor-pointer content-right-close"
                  onClick={onRightMenuCloseClick}>
                  <CrosscloseIcon />
                </div>
              </div>
              <Collapse
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) =>
                  isActive ? (
                    <span className="anticon">
                      <ArrowRightIcon />
                    </span>
                  ) : (
                    <span className="anticon">
                      <ArrowRightIcon />
                    </span>
                  )
                }
                onChange={onRightSideCollapseChange}>
                <Panel
                  header={t('common.labels.version')}
                  key="1"
                  extra={<span>{versionName && versionName}</span>}>
                  {!isModalIsEcommerceBrand && (
                    <>
                      <div className="ant-row ant-row-space-between ant-space-align-center m-b-8">
                        <span className="custom-input-label m-0">
                          {t('common.labels.current_version')}
                        </span>
                        <Tooltip
                          placement="left"
                          title={
                            !canEditVersion &&
                            t('common.messages.error_edit_version')
                          }>
                          <Button
                            disabled={!canEditVersion}
                            type="link"
                            className="m-0-important content-right-btn"
                            onClick={() => {
                              changeUpdateVersionNameModalVisibility(true);
                            }}
                            key={'edit-version-button'}>
                            {t('common.labels.edit')}
                          </Button>
                        </Tooltip>
                      </div>
                      <Tooltip
                        placement="left"
                        title={
                          !canEditVersion &&
                          t('common.messages.error_can_not_change_version')
                        }>
                        <Select
                          disabled={!canEditVersion}
                          placeholder={t('common.labels.search_in_version')}
                          className="w-100 m-b-24"
                          suffixIcon={<DownArrowIcon />}
                          optionFilterProp="children"
                          filterOption={(input, versionList) =>
                            (versionList?.children ?? '')
                              //@ts-ignore
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          onChange={onVersionChange}
                          value={newRecordFieldDetails?.versionId}>
                          {versionList?.map((item) => (
                            <Option value={item.id}>{item.versionName}</Option>
                          ))}
                        </Select>
                      </Tooltip>
                    </>
                  )}

                  <div className="environments-status">
                    <p className="gray-text ant-row ant-row-space-between">
                      <small>{t('common.labels.status')}</small>
                      <div className="version-number-title">
                        <small>{t('common.labels.version')} </small>
                        <small>{versionNo && versionNo}</small>
                      </div>
                    </p>

                    {currentVersionStatus.map((item) => (
                      <>
                        {item.status === 'PUBLISHED' ? (
                          <div className="ant-row ant-space-align-center ant-row-space-between m-b-10">
                            <span>{item.name}</span>
                            <Tag color="success">
                              {t('common.labels.publish')}
                            </Tag>
                          </div>
                        ) : item.status === 'SCHEDULE' ? (
                          <div className="ant-row ant-space-align-center ant-row-space-between m-b-10">
                            <span>{item.name}</span>
                            <Tag color="blue">
                              {t('common.labels.schedule')}
                            </Tag>
                          </div>
                        ) : (
                          <div className="ant-row ant-space-align-center ant-row-space-between m-b-10">
                            <span>{item.name}</span>
                            <Tag color="warning">
                              {t('common.labels.draft')}
                            </Tag>
                          </div>
                        )}
                      </>
                    ))}

                    {!isModalIsEcommerceBrand && (
                      <Button
                        disabled={versionList.length < 2}
                        type="link"
                        className="btn-height-auto"
                        onClick={onVersionHistoryButtonClick}
                        key="versionHistoryButton">
                        {t('common.labels.version_history')}
                      </Button>
                    )}
                  </div>
                </Panel>

                {selectedContentModalDetails?.actAsWebPage && (
                  <Panel header={t('common.labels.template')} key="2">
                    <span className="custom-input-label">
                      {t('common.labels.current_template')}
                    </span>
                    <Select
                      showSearch
                      className="w-100"
                      suffixIcon={<DownArrowIcon />}
                      placeholder={t('common.labels.search_template')}
                      optionFilterProp="children"
                      filterOption={(input, pageTemplateList) =>
                        (pageTemplateList?.children ?? '')
                          //@ts-ignore
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      onChange={onTemplateChange}
                      defaultValue={defaultTemplateId && defaultTemplateId}>
                      {pageTemplateList?.map((item) => (
                        <Option value={item.template}>{item.template}</Option>
                      ))}
                    </Select>
                  </Panel>
                )}

                {selectedContentModalDetails?.isLocalizationEnabled && (
                  <Panel
                    className="collapse-border-top-none"
                    header={t('common.labels.internationalization')}
                    key="3">
                    <Select
                      showSearch
                      className="w-100"
                      suffixIcon={<DownArrowIcon />}
                      placeholder={t('common.labels.search_language')}
                      optionFilterProp="children"
                      filterOption={(input, workspaceLanguageList) =>
                        (workspaceLanguageList?.children ?? '')
                          //@ts-ignore
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      value={newRecordFieldDetails?.language}
                      onChange={onLanguageChange}>
                      {workspaceLanguageList?.map((item) => (
                        <Option value={item.locale}>{item.name}</Option>
                      ))}
                    </Select>
                  </Panel>
                )}
                {((selectedContentModalDetails?.actAsWebPage &&
                  canReadCache &&
                  environmentId === 'PRODUCTION') ||
                  (selectedContentModalDetails?.internalName ===
                    'global_settings' &&
                    environmentId === 'PRODUCTION')) && (
                  <Panel
                    className="caching-panel"
                    key="4"
                    header={t('common.labels.caching')}>
                    <div>
                      <p className="gray-text m-b-16">
                        {t(
                          'common.messages.content_library_cache_tab_description'
                        )}
                      </p>
                      <Tooltip
                        placement="bottom"
                        title={
                          !canDeleteCache &&
                          t('common.messages.you_dont_have_access')
                        }>
                        <Button
                          type="primary"
                          size="small"
                          disabled={!canDeleteCache}
                          onClick={() => {
                            selectedContentModalDetails?.internalName ===
                            'global_settings'
                              ? onPurgeAllCacheClick()
                              : onPurgeCacheClick(
                                  headerTitleAndSubtitle?.title,
                                  headerTitleAndSubtitle?.subtitle
                                );
                          }}>
                          {t('common.labels.purge_cache')}
                        </Button>
                      </Tooltip>
                    </div>
                  </Panel>
                )}

                <>
                  {relationFieldValues &&
                    relationFieldValues.length > 0 &&
                    //@ts-ignore
                    relationFieldValues?.map((item, index) => (
                      <>
                        {fieldPermissionCheck(
                          'read',
                          item.internalName?.split('/')[0]
                        ) && (
                          <Panel
                            header={item.title}
                            key={index + 50}
                            forceRender>
                            <FormField
                              contentModalInternalName={
                                selectedContentModalDetails.internalName
                              }
                              type="relation"
                              props={item}
                              key={item.name}
                            />
                          </Panel>
                        )}
                      </>
                    ))}
                </>
              </Collapse>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <Tooltip title="Publish Status" placement="left">
                <span className="content-icon">
                  <PublishStatusIcon />
                  <PublishStatusHoverIcon />
                </span>
              </Tooltip>
            }
            key="publishStatus">
            <div className="content-library-right-content">
              <div className="ant-row ant-space-align-center ant-row-space-between content-library-right-content-title">
                <h3 className="m-0">{t('common.labels.publish_status')}</h3>
                <div
                  className="cursor-pointer content-right-close"
                  onClick={onRightMenuCloseClick}>
                  <CrosscloseIcon />
                </div>
              </div>
              {VersionPublishQueue.length > 0 &&
                VersionPublishQueue.map((data) => (
                  <div className="publish-status-inner">
                    <div className="publish-inner-border">
                      <p className="gray-text">{data.name}</p>
                      {
                        // @ts-ignore
                        data.value.length > 0 ? (
                          <>
                            {
                              // @ts-ignore
                              data.value.map(
                                // @ts-ignore
                                (item, index) =>
                                  (!isSeeMoreVersionDetailsButtonVisible[
                                    //@ts-ignore
                                    data?.name
                                  ] ||
                                    (isSeeMoreVersionDetailsButtonVisible &&
                                      index < 2)) && (
                                    <div className="ant-row ant-row-space-between Environments-tab-list">
                                      <div className="development-details">
                                        <p className="development-details-text m-0">
                                          {`${item.versionName}`}
                                        </p>
                                        <p className="gray-text m-0">
                                          {t('common.labels.version')}:{' '}
                                          {item.versionNo}
                                        </p>
                                        <p className="gray-text m-0">
                                          {item.publishAt &&
                                            moment(item.publishAt)
                                              .local()
                                              .format('DD MMM YYYY,LT')}
                                        </p>
                                        <p className="gray-text m-0">
                                          {
                                            //@ts-ignore
                                            userList[item.createdBy]
                                          }
                                        </p>
                                      </div>
                                      <div>
                                        {item.action === 'PUBLISHED' ? (
                                          <Tag color="success">
                                            {t('common.labels.publish')}
                                          </Tag>
                                        ) : item.action === 'SCHEDULE' ? (
                                          <Tag color="blue">
                                            {t('common.labels.schedule')}
                                          </Tag>
                                        ) : item.action === 'UNPUBLISHED' ? (
                                          <Tag color="red">
                                            {t('common.labels.un_publish')}
                                          </Tag>
                                        ) : (
                                          <Tag color="warning">
                                            {t('common.labels.draft')}
                                          </Tag>
                                        )}
                                      </div>
                                    </div>
                                  )
                              )
                            }
                            {isSeeMoreVersionDetailsButtonVisible[
                              //@ts-ignore
                              data?.name
                            ] && (
                              <Button
                                className="btn-height-auto m-l-16 m-t-16"
                                type="link"
                                onClick={() =>
                                  onSeeMoreVersionDetailsButtonClick(data.name)
                                }>
                                {t('common.labels.see_more')}
                              </Button>
                            )}
                          </>
                        ) : (
                          t('common.messages.no_version_publish_scheduled')
                        )
                      }
                    </div>
                  </div>
                ))}
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <Tooltip title="Information" placement="left">
                <span className="content-icon">
                  <InfoIcon />
                  <InfoHoverIcon />
                </span>
              </Tooltip>
            }
            key="info">
            <div className="content-library-right-content">
              <div className="ant-row ant-space-align-center ant-row-space-between content-library-right-content-title">
                <h3 className="m-0">{t('common.labels.information')}</h3>
                <div
                  className="cursor-pointer content-right-close"
                  onClick={onRightMenuCloseClick}>
                  <CrosscloseIcon />
                </div>
              </div>
              <div className="content-library-right-list">
                <div className="content-library-right-list-border">
                  <p>
                    {t('common.labels.record_id')}
                    <span>{recordId}</span>
                  </p>
                  <p>
                    {t('common.labels.content_modal_type')}
                    <span>
                      {selectedContentModalDetails?.type === 'single'
                        ? t('common.labels.single')
                        : t('common.labels.collection')}
                    </span>
                  </p>
                  <p>
                    {t('common.labels.collection_type')}
                    <span>{selectedContentModalDetails?.name}</span>
                  </p>
                  {createdAt && (
                    <p>
                      {t('created_at')}
                      <span>
                        {moment(createdAt).local().format('DD MMM YYYY,LT')}
                      </span>
                    </p>
                  )}
                  <p>
                    {t('common.labels.created_by')}
                    <span>{createdBy}</span>
                  </p>
                  <p>
                    {t('common.labels.last_modified_by')}
                    <span>{modifiedBy}</span>
                  </p>
                  {modifiedAt && (
                    <p>
                      {t('common.labels.last_modified_at')}
                      <span>
                        {moment(modifiedAt).local().format('DD MMM YYYY,LT')}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="content-library-right-list">
                <div className="content-library-right-list-border">
                  <h3>{t('common.labels.localizations')}</h3>
                  <p>
                    {t('common.labels.form_default_field')}
                    <span> {t('common.labels.english_us')}</span>
                  </p>
                  {languageAvailableInRecord &&
                    languageAvailableInRecord.includes('en-us') &&
                    languageAvailableInRecord.length > 1 && (
                      <p>
                        {t('common.labels.other')}
                        {languageAvailableInRecord &&
                          languageAvailableInRecord.map((item) => {
                            if (item !== 'en-us') {
                              const languages = languagesList?.find(
                                (itemData) => itemData.locale === item
                              );
                              return <span>{languages?.name}</span>;
                            }
                            return '';
                          })}
                      </p>
                    )}
                </div>
              </div>
            </div>
          </Tabs.TabPane>
          {isEcommerceRedirectionTabVisible && (
            <Tabs.TabPane
              tab={
                providerEsi === 'BIGCOMMERCE' ? (
                  <Tooltip
                    title={t('common.labels.bigcommerce')}
                    placement="left">
                    <span className="content-icon">
                      <BigCommerceIcon />
                      <BigCommerceHoverIcon />
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip title={t('common.labels.shopify')} placement="left">
                    <span className="content-icon">
                      <ShopifyDefaultIcon />
                      <ShopifyHoverIcon />
                    </span>
                  </Tooltip>
                )
              }
              key="bigCommerce">
              <div className="content-library-right-content">
                <div className="ant-row ant-space-align-center ant-row-space-between content-library-right-content-title">
                  <h3 className="m-0">
                    {providerEsi === 'BIGCOMMERCE'
                      ? t('common.labels.bigcommerce')
                      : t('common.labels.shopify')}
                  </h3>
                  <div
                    className="cursor-pointer content-right-close"
                    onClick={onRightMenuCloseClick}>
                    <CrosscloseIcon />
                  </div>
                </div>
                <div
                  key="bigCom"
                  className="content-library-right-list bigcommerce-library-right-list">
                  <div className="publish-status-inner padding-0">
                    <h3>{t('common.labels.sync_status')}</h3>
                  </div>
                  <p>
                    {t('common.labels.last_sync_on')}
                    {lastSyncAt && (
                      <span>
                        {moment(lastSyncAt).local().format('DD MMM YYYY,LT')}
                      </span>
                    )}
                  </p>
                  <Button
                    key="viewBigCommerce"
                    onClick={onEditInBigCommerceButtonClick}
                    size="small">
                    {providerEsi === 'BIGCOMMERCE'
                      ? t('common.labels.edit_in_bigcommerce')
                      : t('common.labels.edit_in_shopify')}
                  </Button>
                  <Button
                    loading={loadingBigCommerce}
                    key="viewBigCommerce"
                    type="primary"
                    size="small"
                    onClick={() => {
                      onSyncButtonClick(
                        headerTitleAndSubtitle?.title,
                        headerTitleAndSubtitle?.subtitle
                      );
                    }}>
                    {t('common.labels.sync_now')}
                  </Button>
                </div>
              </div>
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
      {isUpdateVersionNameModalVisible && (
        <UpdateVersionNameModal
          versionNo={versionNo}
          versionName={versionName}
          changeUpdateVersionNameModalVisibility={
            changeUpdateVersionNameModalVisibility
          }
        />
      )}
      <Modal
        visible={isPurgeAllCacheModalVisible}
        title={t('common.labels.purge_cache')}
        centered
        onCancel={onPurgeAllCacheCancel}
        footer={[
          <Button key="cancel" onClick={onPurgeAllCacheCancel}>
            {t('common.labels.cancel')}
          </Button>,
          <Button
            key="purge_all_cache"
            type="primary"
            onClick={onPurgeAllCacheConfirm}
            danger>
            {t('common.labels.purge_all_cache')}
          </Button>,
        ]}
        className="CustomModal-small">
        {t('common.messages.clear_all_cache_message')}
      </Modal>
    </>
  );
};
export default FieldListRightSideBar;
