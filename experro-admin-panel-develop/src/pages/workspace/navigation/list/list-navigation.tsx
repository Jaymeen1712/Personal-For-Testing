import React from 'react';
import {
  Form,
  Input,
  Modal as AntdModal,
  Button,
  Spin,
  Row,
  Col,
  Table,
  Select,
} from 'antd';
import useListNavigationController from './list-navigation-controller';
import HeaderListNavigation from './header-list-navigation';
import SubSideBar from '../../../../components/sub-sidebar/sub-sidebar';
import { SIDEBAR_KEYS, SUB_SIDEBAR_KEYS } from '../../../../utills';
import NavigationBannerImage from '../../../../images/icons/navigation-banner-image';
import { LoadingOutlined } from '@ant-design/icons';
import SearchIcon from '../../../../images/icons/search-icon';
import FilterDropDownIcon from '../../../../images/icons/filterdropdown-icon';
import NoDataFound from '../../../../components/no-data-found/no-data-found';
import NoRecordIcon from '../../../../images/icons/no-records-icon';

interface IMenus {
  onMainSidebarActiveItem?: (val: string) => void;
}

const ListNavigation: React.FC<IMenus> = ({ onMainSidebarActiveItem }) => {
  const {
    t,
    onAddNavigation,
    onAddNavigationClick,
    isModalVisible,
    onCancel,
    columns,
    isDeleteModalVisible,
    hideDeleteModal,
    onDeleteNavigation,
    listNavigation,
    contentModel,
    isRename,
    createNavigation,
    deleteNavigation,
    form,
    updateNavigation,
    filter,
    onFilterChange,
    // onTableChange,
    listAllUsers,
    onUserChange,
    selectedUserIds,
    // isSortByClick,
    isFilter,
    isUserIds,
    isSaveButtonDisable,
    onFormFieldChange,
  } = useListNavigationController({ onMainSidebarActiveItem });

  return (
    <>
      <SubSideBar
        sidebarActiveItemKey={SIDEBAR_KEYS.WORKSPACE.SETTINGS}
        subSidebarActiveItemKey={
          SUB_SIDEBAR_KEYS.WORKSPACE.SETTINGS.APPEARANCE.NAVIGATION
        }
        isEnvironmentSelectorVisible={true}
        isEnvironmentSelectorDisable={true}
        environmentSelectDefaultValue={'All'}
        disableEnvironmentToolTipMessage={t(
          'common.messages.environment_is_not_applicable'
        )}>
        <HeaderListNavigation
          t={t}
          listNavigation={listNavigation}
          contentModel={contentModel}
          onAddNavigationClick={onAddNavigationClick}
        />

        {(listNavigation.isLoading ||
          listNavigation.isFetching ||
          contentModel.isLoading ||
          contentModel.isFetching) &&
        // !isSortByClick &&
        (!isFilter ||
          (listNavigation.data?.length === 0 &&
            (!listNavigation.isFetching || filter.length === 0))) &&
        (!isUserIds ||
          (filter.length === 0 && selectedUserIds.length === 0)) ? (
          <Spin
            className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        ) : (
          <>
            <div
              className={`${
                !filter &&
                selectedUserIds?.length === 0 &&
                !listNavigation.isLoading &&
                !listNavigation.isFetching &&
                listNavigation.data?.length === 0
                  ? 'display-none'
                  : 'search-section ant-row ant-space-align-center ant-row-space-between list-user-filter'
              }`}>
              <div className="ant-row ant-space-align-center">
                <Form>
                  <Form.Item name="filter" className="m-0 m-r-16">
                    <Input
                      size="middle"
                      placeholder={t('common.labels.search')}
                      prefix={<SearchIcon />}
                      // value={filter}
                      onChange={onFilterChange}
                    />
                  </Form.Item>
                </Form>
              </div>
              <div className="filters ant-space ant-space-horizontal ant-space-align-center">
                <div className="ant-space-item-main">
                  <span className="filter-custom-dropdown-label">
                    {t('common.labels.users')}
                  </span>
                  <Select
                    className="m-0 ant-space-align-center borderless-select"
                    popupClassName="dropdown-size-medium"
                    placement={'bottomRight'}
                    onChange={onUserChange}
                    size={'middle'}
                    mode="multiple"
                    suffixIcon={<FilterDropDownIcon />}
                    showArrow={true}
                    maxTagCount={1}
                    showSearch={false}
                    defaultValue={['All']}
                    value={
                      selectedUserIds?.length === 0 ? ['All'] : selectedUserIds
                    }>
                    {listAllUsers &&
                      Object.keys(listAllUsers).map((item) => (
                        <Select.Option value={item}>
                          {listAllUsers[item]}
                        </Select.Option>
                      ))}
                  </Select>
                </div>
              </div>
            </div>
            {!listNavigation.isLoading &&
              listNavigation.isSuccess &&
              !contentModel.isLoading &&
              ((listNavigation.data && listNavigation.data.length > 0) ||
              filter ||
              selectedUserIds?.length ? (
                <div className="table-section">
                  <Table
                    columns={columns}
                    //@ts-ignore
                    dataSource={listNavigation.data}
                    // onChange={onTableChange}
                    pagination={false}
                    // showSorterTooltip={false}
                    // loading={listNavigation.isFetching}
                    locale={{
                      emptyText: (
                        <NoDataFound
                          icon={<NoRecordIcon />}
                          title={t('common.labels.no_record_found')}
                        />
                      ),
                    }}
                  />
                </div>
              ) : (
                !isUserIds &&
                !isFilter && (
                  // && !isSortByClick
                  <Row className="generate-box ant-row ant-space-align-center p-32">
                    <Col span={12}>
                      <div className="generate-box-content p-l-32">
                        <h1 className="h4 m-b-16 secondary-black">
                          {t('common.labels.navigation_banner_title')}
                        </h1>
                        <p className="m-b-32 gray-text">
                          {t('common.labels.navigation_description')}
                        </p>

                        <Button type="primary" onClick={onAddNavigationClick}>
                          {t('common.labels.add_navigation')}
                        </Button>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="generate-box-img ant-row ant-row-end">
                        <NavigationBannerImage />
                      </div>
                    </Col>
                  </Row>
                )
              ))}
          </>
        )}

        <AntdModal
          centered
          className="CustomModal CustomModal-small"
          onCancel={onCancel}
          title={
            isRename
              ? t('common.labels.rename_navigation')
              : t('common.labels.add_navigation')
          }
          open={isModalVisible}
          footer={[
            <Button key="cancel" onClick={onCancel}>
              {t('common.labels.cancel')}
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={createNavigation.isLoading || updateNavigation.isLoading}
              disabled={isSaveButtonDisable}
              onClick={onAddNavigation}>
              {t('common.labels.save')}
            </Button>,
          ]}>
          <Form
            autoComplete="off"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            layout="vertical"
            form={form}
            onFieldsChange={onFormFieldChange}>
            <Form.Item
              label={t('common.labels.navigation_name')}
              name="navigationName"
              rules={[
                {
                  required: true,
                  message: t('common.messages.required', {
                    entity: t('common.labels.navigation_name'),
                  }),
                },
              ]}>
              <Input placeholder={t('common.labels.navigation_placeholder')} />
            </Form.Item>
          </Form>
        </AntdModal>

        <AntdModal
          title={t('common.labels.navigation_delete_title')}
          centered
          open={isDeleteModalVisible}
          onOk={onDeleteNavigation}
          onCancel={hideDeleteModal}
          className="confirm-modal"
          confirmLoading={deleteNavigation.isLoading}
          okText={t('common.labels.delete')}
          okButtonProps={{
            danger: true,
          }}>
          <p>{t('common.messages.delete_navigation_message')}</p>
        </AntdModal>
      </SubSideBar>
    </>
  );
};
export default ListNavigation;
