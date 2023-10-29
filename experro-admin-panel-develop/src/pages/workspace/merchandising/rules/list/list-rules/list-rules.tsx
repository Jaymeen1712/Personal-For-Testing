import React from 'react';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Popover,
  Row,
  Select,
  Table,
  Modal,
  Spin,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import CreateUpdateRule from '../create-update/create-update-rule';
import { IListRule } from '../../../../../../types';
import SearchIcon from '../../../../../../images/icons/search-icon';
import NoDataFound from '../../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../../images/icons/no-records-icon';
import RuleBanner from './list-rules-banner';
import useListRuleController from './list-rules-controller';
import {
  MERCHANDISING_FIELDS,
  MERCHANDISING_LIST_SORTING_OPTIONS,
} from '../../../../../../utills';
import GearIcon from '../../../../../../images/icons/gear-icon';
import HeaderListRules from './header-list-rules';
import BigcommerceBannerImage from '../../../../../../images/icons/bigcommerce-banner-image';
import FilterDropDownIcon from '../../../../../../images/icons/filterdropdown-icon';

const ListRules: React.FC<IListRule> = ({
  hideAddRule,
  onAddRule,
  addParentRule,
  onSave,
  environment,
  buttonLoading,
  setIsAddRuleButtonVisible,
  isAddRuleButtonVisible,
  onDuplicateRule,
}) => {
  const {
    t,
    list,
    workspaceId,
    columns,
    isModalVisible,
    hideModal,
    onDeleteRule,
    onInputChange,
    form,
    filterFlag,
    deleteRule,
    onSortRuleListData,
    userPreference,
    onPreferenceChange,
    selectedSortValue,
    storeIssueFound,
    onAddStore,
    permission,
    subMenu,
    searchData,
  } = useListRuleController({
    environment,
    setIsAddRuleButtonVisible,
    onDuplicateRule,
  });

  return (
    <>
      <HeaderListRules
        subMenu={subMenu}
        t={t}
        isAddRuleButtonVisible={isAddRuleButtonVisible}
        onAddRule={onAddRule}
      />

      {!storeIssueFound ? (
        <>
          <div
            className={`${
              list.data && list.data?.totalCount === 0 && !searchData
                ? 'display-none'
                : 'search-section'
            } ant-row ant-row-space-between`}>
            <>
              <div className="ant-row ant-space-align-center">
                <Form form={form}>
                  <Form.Item name="searchText" className={`m-0 m-r-16`}>
                    <Input
                      size="middle"
                      placeholder={t('common.labels.search')}
                      prefix={<SearchIcon />}
                      onChange={(e) => {
                        onInputChange(e.target.value);
                      }}
                    />
                  </Form.Item>
                </Form>

                {list.isSuccess && (
                  <p className="gray-text m-0 search-count">
                    {list.data?.totalCount && list.data?.totalCount > 1
                      ? t('common.labels.total_records', {
                          entity: list.data?.totalCount,
                        })
                      : t('common.labels.total_record', {
                          entity: list.data?.totalCount,
                        })}
                  </p>
                )}
              </div>
              <div className="filters ant-row m-0">
                <div className="ant-space-item-main m-r-24">
                  <span className="m-r-8">{t('common.labels.sort_by')}</span>
                  <Select
                    className="m-0 ant-space-align-center borderless-select"
                    popupClassName="dropdown-size-medium"
                    placement={'bottomRight'}
                    size={'middle'}
                    onChange={onSortRuleListData}
                    suffixIcon={<FilterDropDownIcon />}
                    showArrow={true}
                    value={selectedSortValue}>
                    {MERCHANDISING_LIST_SORTING_OPTIONS.map((option) => (
                      <Select.Option value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <Popover
                  className={`${
                    list.data?.items && list.data?.items.length === 0
                      ? 'display-none'
                      : ''
                  }`}
                  placement="bottomRight"
                  content={
                    <Checkbox.Group
                      options={MERCHANDISING_FIELDS}
                      defaultValue={userPreference}
                      onChange={onPreferenceChange}
                    />
                  }
                  trigger="click">
                  <Button icon={<GearIcon />} size="middle"></Button>
                </Popover>
              </div>
            </>
          </div>

          {(list.isSuccess &&
            !list.isLoading &&
            list?.data?.items &&
            list?.data?.items.length) ||
          filterFlag ? (
            <div className="table-section">
              <Table
                className="tableCellPadding-11"
                columns={columns}
                dataSource={list.data?.items}
                pagination={false}
                locale={{
                  emptyText: !list.isFetching ? (
                    <NoDataFound
                      icon={<NoRecordIcon />}
                      title={t('common.labels.no_record_found')}
                    />
                  ) : (
                    <></>
                  ),
                }}
              />
            </div>
          ) : (
            <>
              {list.isLoading || list.isFetching ? (
                <Spin
                  className="HV-center table-center"
                  indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
                  size="large"
                />
              ) : (
                !list.isFetching &&
                !list.isLoading && (
                  <RuleBanner t={t} subMenu={subMenu} addRule={onAddRule} />
                )
              )}
            </>
          )}
        </>
      ) : storeIssueFound ? (
        <Row className="generate-box ant-row ant-space-align-center p-32">
          <Col span={12}>
            <div className="generate-box-content p-l-32">
              <h1 className="h4 m-b-16 secondary-black">
                {t('common.labels.no_store_found')}
              </h1>
              <p className="m-b-32 gray-text">
                {t('common.labels.store_not_found_description')}
              </p>
              {permission.canReadEcommerceStore() &&
                permission.canCreateEcommerceStore() && (
                  <Button type="primary" onClick={onAddStore}>
                    {t('common.labels.add_store')}
                  </Button>
                )}
            </div>
          </Col>
          <Col span={12}>
            <div className="generate-box-img ant-row ant-row-end">
              <BigcommerceBannerImage />
            </div>
          </Col>
        </Row>
      ) : (
        <Spin
          className="HV-center table-center"
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          size="large"
        />
      )}

      <Modal
        className="confirm-modal"
        title={t('common.labels.delete_folder_title')}
        open={isModalVisible}
        okText={t('common.labels.delete')}
        onCancel={hideModal}
        onOk={onDeleteRule}
        confirmLoading={deleteRule?.isLoading ? true : false}
        centered
        okButtonProps={{
          style: { background: 'red', border: 'red' },
        }}>
        <p>{t('common.labels.delete_rule_message')}</p>
      </Modal>

      {addParentRule && (
        <CreateUpdateRule
          t={t}
          subMenu={subMenu}
          onSave={onSave}
          hideAddRule={hideAddRule}
          workspaceId={workspaceId}
          selectedEnvironment={environment}
          buttonLoading={buttonLoading}
        />
      )}
    </>
  );
};

export default ListRules;
