import React from 'react';
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Form,
  Input,
  Layout,
  Row,
  Tooltip,
} from 'antd';
import Nestable from 'react-nestable';
import 'react-nestable/dist/styles/index.css';
import get from 'lodash.get';
import useUpdateNavigationController from './update-navigation-controller';
import ArrowLeftIcon from '../../../../images/icons/arrow-left-icon';
import SearchIcon from '../../../../images/icons/search-icon';
import { Link } from 'react-router-dom';
import PlusArrowIcon from '../../../../images/icons/plusarrow-icon';
import Modal from '../../../../components/modal';
import NavigationBannerImage from '../../../../images/icons/navigation-banner-image';
import ArrowRightIcon from '../../../../images/icons/arrow-right-icon';

interface IEditMenus {
  onMainSidebarActiveItem?: (val: string) => void;
}

const UpdateNavigation: React.FC<IEditMenus> = ({
  onMainSidebarActiveItem,
}) => {
  const {
    t,
    sidebarMenuForm,
    collectionTypes,
    collapseChange,
    pushedMenuItems,
    changeTree,
    nestedMenuForm,
    updateMenu,
    renderItem,
    onAddMenuItems,
    updateMenuItems,
    navigationName,
    onFilterTextChange,
    addRecordCount,
    customLink,
    workspaceId,
    cancelUpdate,
    onSaveNavigation,
    onCloseModal,
    saveModalVisible,
    discardChanges,
    getMenuDetails,
    updateNavigationItem,
    onFormFieldChange,
    isAddButtonDisabled,
    clearCache,
    purgeCacheModalVisible,
    onClosePurgeModal,
    setPurgeCacheModalVisible,
    canDeleteCache,
    allContentModelAndRecords,
    allContentModelAndFilteredRecords,
    addedContentRecords,
    noRecordsFoundChecker,
    isSaveButtonDisable,
    isPushedMenuStateSet,
    contentModel,
  } = useUpdateNavigationController({ onMainSidebarActiveItem });

  return (
    <Layout className={`page navigation-page`}>
      <Layout.Content>
        <div className="ant-row navigation-page-main">
          <Form
            layout="vertical"
            // @ts-ignore
            onFieldsChange={onFormFieldChange}
            onFinish={onAddMenuItems}
            form={sidebarMenuForm}
            key={get(collectionTypes?.data?.[0], 'id')}
            className="navigation-page-menu">
            <div className="navigation-submenu">
              <h2 className="title-default">{t('common.labels.all_pages')}</h2>
              {collectionTypes.isSuccess &&
                customLink.isSuccess &&
                allContentModelAndRecords.length > 0 && (
                  <>
                    <Collapse
                      onChange={collapseChange}
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
                      }>
                      {allContentModelAndRecords.map((model) => {
                        if (model.internalName === 'custom_links') {
                          return (
                            <Collapse.Panel
                              key={`${model.id}/link`}
                              header={
                                <>
                                  {model.name}
                                  <Tooltip
                                    title={t('common.labels.add_custom_link')}
                                    placement="bottom">
                                    <Link
                                      className="plusarrow"
                                      onClick={(e) => e.stopPropagation()}
                                      to={`/workspaces/${workspaceId}/content-library/collection-type/${model.id}/list-records`}
                                      target="_blank">
                                      <PlusArrowIcon />
                                    </Link>
                                  </Tooltip>
                                </>
                              }>
                              <Form.Item
                                name={[model.id, 'searchText']}
                                className="sidebar-search">
                                <Input
                                  placeholder={t('common.labels.search')}
                                  prefix={<SearchIcon />}
                                  // value={filterText}
                                  onChange={(e) => {
                                    onFilterTextChange(
                                      e,
                                      `${customLink.data?.id}/link`
                                    );
                                  }}
                                />
                              </Form.Item>
                              {sidebarMenuForm
                                .getFieldValue([model.id])
                                ?.searchText?.trim() ? (
                                <>
                                  {allContentModelAndFilteredRecords.map(
                                    (filter) => {
                                      if (filter.id === model.id) {
                                        return (
                                          <>
                                            {filter.records?.map(
                                              (record) =>
                                                !addedContentRecords.some(
                                                  (addedRecord) =>
                                                    addedRecord.id === record.id
                                                ) && (
                                                  <Form.Item
                                                    valuePropName="checked"
                                                    name={record.id}
                                                    key={record.id}>
                                                    <Checkbox>
                                                      {record.title}
                                                    </Checkbox>
                                                  </Form.Item>
                                                )
                                            )}
                                            {((noRecordsFoundChecker(
                                              filter.records,
                                              addedContentRecords
                                            ) &&
                                              // @ts-ignore
                                              model?.totalRecord <=
                                                model.records.length) ||
                                              filter.records?.length === 0) && (
                                              <div>
                                                {t(
                                                  'common.messages.no_records_found'
                                                )}
                                              </div>
                                            )}
                                          </>
                                        );
                                      }
                                      return null;
                                    }
                                  )}
                                </>
                              ) : (
                                <>
                                  <>
                                    {model.records?.map(
                                      (record) =>
                                        !addedContentRecords.some(
                                          (addedRecord) =>
                                            addedRecord.id === record.id
                                        ) && (
                                          <Form.Item
                                            valuePropName="checked"
                                            name={record.id}
                                            key={record.id}>
                                            <Checkbox>{record.title}</Checkbox>
                                          </Form.Item>
                                        )
                                    )}
                                    {((noRecordsFoundChecker(
                                      model.records,
                                      addedContentRecords
                                    ) &&
                                      // @ts-ignore
                                      model?.totalRecord <=
                                        model.records.length) ||
                                      model.records?.length === 0) && (
                                      <div>
                                        {t('common.messages.no_records_found')}
                                      </div>
                                    )}
                                  </>
                                </>
                              )}
                              {model.records &&
                                // @ts-ignore
                                model.records?.length < model?.totalRecord &&
                                !sidebarMenuForm
                                  .getFieldValue([model.id])
                                  ?.searchText?.trim() && (
                                  <Button
                                    type="link"
                                    className="OnlyIcon"
                                    onClick={() => addRecordCount(model.id)}>
                                    {t('common.labels.load_more')}
                                  </Button>
                                )}
                            </Collapse.Panel>
                          );
                        }
                        return (
                          <Collapse.Panel
                            key={model.id}
                            header={<>{model.name}</>}>
                            <Form.Item
                              name={[model.id, 'searchText']}
                              className="sidebar-search">
                              <Input
                                placeholder={t('common.labels.search')}
                                prefix={<SearchIcon />}
                                // value={filterText}
                                onChange={(e) => {
                                  onFilterTextChange(e, model.id);
                                }}
                              />
                            </Form.Item>
                            {sidebarMenuForm
                              .getFieldValue([model.id])
                              ?.searchText?.trim() ? (
                              <>
                                {allContentModelAndFilteredRecords.map(
                                  (filter) => {
                                    if (filter.id === model.id) {
                                      return (
                                        <>
                                          {filter.records?.map(
                                            (record) =>
                                              !addedContentRecords.some(
                                                (addedRecord) =>
                                                  addedRecord.id === record.id
                                              ) && (
                                                <Form.Item
                                                  valuePropName="checked"
                                                  name={record.id}
                                                  key={record.id}>
                                                  <Checkbox>
                                                    {record.title}
                                                  </Checkbox>
                                                </Form.Item>
                                              )
                                          )}
                                          {((noRecordsFoundChecker(
                                            filter.records,
                                            addedContentRecords
                                          ) &&
                                            // @ts-ignore
                                            model?.totalRecord <=
                                              model.records.length) ||
                                            filter.records?.length === 0) && (
                                            <div>
                                              {t(
                                                'common.messages.no_records_found'
                                              )}
                                            </div>
                                          )}
                                        </>
                                      );
                                    }
                                    return null;
                                  }
                                )}
                              </>
                            ) : (
                              <>
                                {model.records?.map(
                                  (record) =>
                                    !addedContentRecords.some(
                                      (addedRecord) =>
                                        addedRecord.id === record.id
                                    ) && (
                                      <Form.Item
                                        valuePropName="checked"
                                        name={record.id}
                                        key={record.id}>
                                        <Checkbox>{record.title}</Checkbox>
                                      </Form.Item>
                                    )
                                )}
                                {((noRecordsFoundChecker(
                                  model.records,
                                  addedContentRecords
                                ) &&
                                  // @ts-ignore
                                  model?.totalRecord <= model.records.length) ||
                                  model.records?.length === 0) && (
                                  <div>
                                    {t('common.messages.no_records_found')}
                                  </div>
                                )}
                              </>
                            )}
                            {model.records &&
                              // @ts-ignore
                              model.records?.length < model?.totalRecord &&
                              !sidebarMenuForm
                                .getFieldValue([model.id])
                                ?.searchText?.trim() && (
                                <Button
                                  type="link"
                                  className="OnlyIcon"
                                  onClick={() => addRecordCount(model.id)}>
                                  {t('common.labels.load_more')}
                                </Button>
                              )}
                          </Collapse.Panel>
                        );
                      })}
                    </Collapse>
                    <div className="addToMenuBtnWrap">
                      <Button
                        htmlType="submit"
                        type="primary"
                        disabled={isAddButtonDisabled}>
                        {t('common.labels.add_to_menu')}
                      </Button>
                    </div>
                  </>
                )}
            </div>
          </Form>
          <Form
            layout="vertical"
            form={nestedMenuForm}
            onFinish={updateMenuItems}
            key={get(collectionTypes?.data?.[0], 'name')}
            className="navigation-page-content"
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}>
            <Layout.Header>
              <div className="headerinner ant-row ant-space-align-start ant-row-space-between">
                <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
                  <div className="hamburgericon" onClick={cancelUpdate}>
                    <ArrowLeftIcon />
                  </div>
                  <div className="w-100 ant-row ant-space-vertical">
                    <span className="ant-page-header-heading-title">
                      {navigationName}
                    </span>
                  </div>
                </div>
                <div className="headerright">
                  <div className="ant-row ant-row-end ant-space-align-center">
                    {canDeleteCache() ? (
                      <Button
                        onClick={() => setPurgeCacheModalVisible(true)}
                        danger
                        type="link">
                        {t('common.labels.purge_all_cache')}
                      </Button>
                    ) : (
                      <Tooltip
                        placement="top"
                        title={t('common.messages.you_dont_have_access')}>
                        <Button danger disabled type="link">
                          {t('common.labels.purge_all_cache')}
                        </Button>
                      </Tooltip>
                    )}
                    <Button onClick={cancelUpdate}>
                      {t('common.labels.cancel')}
                    </Button>
                    <Button
                      id={t('common.labels.save')}
                      type="primary"
                      onClick={updateMenu}
                      disabled={isSaveButtonDisable}>
                      {t('common.labels.save')}
                    </Button>
                  </div>
                </div>
              </div>
            </Layout.Header>
            {getMenuDetails.isSuccess &&
              collectionTypes.isSuccess &&
              customLink.isSuccess &&
              contentModel.isSuccess &&
              // isPushedMenuStateSet &&
              // @ts-ignore
              (pushedMenuItems?.length > 0 ? (
                <div className="navigation-page-content-inner">
                  <div className="navigation-mange-title m-b-24">
                    <p className="title-sm m-b-8">
                      {t('common.labels.manage_menu')}
                    </p>
                    <p className="gray-text font-sm">
                      {t('common.labels.add_menu_instruction')}
                    </p>
                  </div>
                  <Nestable
                    items={pushedMenuItems}
                    // @ts-ignore
                    renderItem={renderItem}
                    onChange={(e) => changeTree(e)}
                  />
                </div>
              ) : (
                <>
                  {!getMenuDetails.isFetching &&
                    !getMenuDetails.isLoading &&
                    !customLink.isFetching &&
                    !customLink.isLoading &&
                    !collectionTypes.isFetching &&
                    !collectionTypes.isLoading &&
                    !contentModel.isLoading &&
                    !contentModel.isFetching &&
                    isPushedMenuStateSet && (
                      <div className="navigation-page-content-inner">
                        <div className="navigation-mange-title m-b-24">
                          <p className="title-sm m-b-8">
                            {t('common.labels.manage_menu')}
                          </p>
                          <p className="gray-text font-sm">
                            {t('common.labels.add_menu_instruction')}
                          </p>
                        </div>
                        <Row className="generate-box ant-row ant-space-align-center p-32">
                          <Col span={12}>
                            <div className="generate-box-content p-l-32">
                              <h1 className="h4 m-b-16 secondary-black">
                                {t('common.labels.no_menu_items_added')}
                              </h1>
                              <p className="m-b-32 gray-text">
                                {t('common.labels.add_navigation_description')}
                              </p>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="generate-box-img ant-row ant-row-end">
                              <NavigationBannerImage />
                            </div>
                          </Col>
                        </Row>
                      </div>
                    )}
                </>
              ))}
          </Form>
        </div>

        <Modal
          title={t('common.labels.save_changes')}
          isModalVisibility={saveModalVisible}
          hideModal={onCloseModal}
          footer={[
            <Button key="1" onClick={discardChanges}>
              {t('common.labels.discard')}
            </Button>,
            <Button
              key="2"
              type="primary"
              onClick={onSaveNavigation}
              loading={updateNavigationItem.isLoading}>
              {t('common.labels.save')}
            </Button>,
          ]}>
          <p>{t('common.messages.save_navigation_message')}</p>
        </Modal>

        <Modal
          classname="confirm-modal"
          title={t('common.labels.purge_cache')}
          isModalVisibility={purgeCacheModalVisible}
          hideModal={onClosePurgeModal}
          footer={[
            <Button key="1" onClick={onClosePurgeModal}>
              {t('common.labels.cancel')}
            </Button>,
            <Button
              key="2"
              type="primary"
              danger
              onClick={clearCache}
              loading={updateNavigationItem.isLoading}>
              {t('common.labels.purge_all_cache')}
            </Button>,
          ]}>
          {t('common.messages.clear_cache_message')}
        </Modal>
      </Layout.Content>
    </Layout>
  );
};

export default UpdateNavigation;
