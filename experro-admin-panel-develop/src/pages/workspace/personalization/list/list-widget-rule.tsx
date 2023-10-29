import { Button, Form, Input, Select, Spin, Table, Row, Col } from 'antd';
import React from 'react';
import NoDataFound from '../../../../components/no-data-found';
import NoRecordIcon from '../../../../images/icons/no-records-icon';
import useListWidgetRuleControllerNew from './list-widget-rule-controller';
import { onSidebarToggle } from '../../../../utills';
import HamburgerIcon from '../../../../images/icons/hamburger-icon';
import PlusIcon from '../../../../images/icons/plus-icon';
import SearchIcon from '../../../../images/icons/search-icon';
import FilterDropDownIcon from '../../../../images/icons/filterdropdown-icon';
import { LoadingOutlined } from '@ant-design/icons';
import CreateUpdateWidget from '../modal/widget/create-update-widget';
import CreateUpdateRule from '../modal/rule/create-update-rule';
import DeleteModal from '../modal/delete/delete-modal';
import MerchandisingSiteRuleBanner from '../../../../images/icons/merchandising-site-rule-banner';

interface IListWidgetRule {
  selectedWidget: { id: string; type?: string | undefined } | undefined;
  selectedId: string;
  titleSubTitle: { title: string; subTitle?: string | undefined } | undefined;
  isEditWidget: boolean;
  isEditRule: boolean;
  environment: string | null;
  // eslint-disable-next-line
  widgetData: any;
  // eslint-disable-next-line
  customWidgetData: any;
  isAddWidgetModalVisible: boolean;
  isDeleteModalVisible: boolean;
  onDeleteModalVisible: (val: boolean) => void;
  onSetWidgetModalVisible: (val: boolean) => void;
  onSetEditWidget: (val: boolean) => void;
  onSetEditRule: (val: boolean) => void;
  isAddRuleModalVisible: boolean;
  onAddEditRuleModalVisible: (val: boolean) => void;
}

const { Option } = Select;

const ListWidgetRule = ({
  selectedWidget,
  titleSubTitle,
  isEditWidget,
  isEditRule,
  selectedId,
  environment,
  widgetData,
  customWidgetData,
  isAddWidgetModalVisible,
  isDeleteModalVisible,
  onDeleteModalVisible,
  onSetWidgetModalVisible,
  isAddRuleModalVisible,
  onAddEditRuleModalVisible,
  onSetEditWidget,
  onSetEditRule,
}: IListWidgetRule) => {
  const {
    t,
    form,
    isLoading,
    isDeleteLoading,
    isSuccess,
    isFetching,
    columns,
    searchData,
    status,
    selectedSortValue,
    sortingOptions,
    applicable,
    columnData,
    onInputChange,
    setStatus,
    onSortByWidgetRule,
    onAddWidgetRule,
    onCancelRuleModalVisible,
    onDeleteWidget,
    onDeleteRule,
    contentModalDataId,
    listWidgetRuleDataLength,
    onCancelModal,
  } = useListWidgetRuleControllerNew(
    selectedWidget,
    selectedId,
    environment,
    widgetData,
    customWidgetData,
    onDeleteModalVisible,
    onAddEditRuleModalVisible
  );

  return (
    <>
      <div className="headerinner ant-row ant-space-align-center ant-row-space-between ">
        <div className="headerleft ant-row ant-row-top ant-row-no-wrap">
          <div className="hamburgericon" onClick={onSidebarToggle}>
            <HamburgerIcon />
          </div>
          <div className="w-100 ant-row ant-space-vertical">
            <span className="ant-page-header-heading-title">
              {titleSubTitle?.title}
            </span>
            <span className="ant-page-header-heading-sub-title m-t-4">
              {titleSubTitle?.subTitle}
            </span>
          </div>
        </div>
        <div className="headerright">
          {isSuccess &&
            listWidgetRuleDataLength &&
            listWidgetRuleDataLength > 0 && (
              <div className="ant-row ant-row-end">
                <Button
                  id={t('common.labels.add_rule')}
                  type="primary"
                  size="middle"
                  icon={<PlusIcon />}
                  onClick={onAddWidgetRule}>
                  {t('common.labels.add_rule')}
                </Button>
              </div>
            )}
        </div>
      </div>

      <>
        {isSuccess &&
          ((listWidgetRuleDataLength && listWidgetRuleDataLength > 0) ||
            applicable ||
            status ||
            searchData) && (
            <div className="search-section ant-row ant-row-space-between environment-search personalization-search">
              <Form form={form}>
                <Form.Item name="searchText" className="m-0">
                  <Input
                    autoFocus={!!searchData}
                    size="middle"
                    placeholder={t('common.labels.search')}
                    prefix={<SearchIcon />}
                    onChange={(e) => {
                      onInputChange(e.target.value);
                    }}
                  />
                </Form.Item>
              </Form>
              <div className="ant-row ant-space-align-center">
                <div className="filters ant-space ant-space-horizontal ant-space-align-center">
                  <div className="ant-space-item-main">
                    <Form.Item
                      label={t('common.labels.sort_by')}
                      className="m-0">
                      <Select
                        key="sortingFilter"
                        placeholder={t('common.labels.recently_updated')}
                        options={sortingOptions}
                        value={selectedSortValue}
                        onChange={onSortByWidgetRule}
                        suffixIcon={<FilterDropDownIcon />}
                        placement="bottomRight"
                      />
                    </Form.Item>
                  </div>
                  <div className="ant-space-item-main">
                    <Form.Item
                      label={t('common.labels.status')}
                      className="m-0">
                      <Select
                        key="statusFilter"
                        placeholder={t('common.labels.any')}
                        onChange={setStatus}
                        value={status}
                        suffixIcon={<FilterDropDownIcon />}
                        placement="bottomRight">
                        <Option value="">{t('common.labels.any')}</Option>
                        <Option value="active">
                          {t('common.labels.active')}
                        </Option>
                        <Option value="inactive">
                          {t('common.labels.inactive')}
                        </Option>
                      </Select>
                    </Form.Item>
                  </div>
                </div>
                {/*<Popover*/}
                {/*  placement="bottomRight"*/}
                {/*  content={*/}
                {/*    <Checkbox.Group*/}
                {/*      options={PERSONALIZATION_FIELDS}*/}
                {/*      defaultValue={userPreference}*/}
                {/*      onChange={onPreferenceChange}*/}
                {/*    />*/}
                {/*  }*/}
                {/*  trigger="click">*/}
                {/*  <Button icon={<GearIcon />}></Button>*/}
                {/*</Popover>*/}
              </div>
            </div>
          )}
      </>
      {isLoading || isFetching ? (
        <Spin
          className="HV-center min-height-chart"
          indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
          size="large"
        />
      ) : (
        <>
          {isSuccess &&
          ((listWidgetRuleDataLength && listWidgetRuleDataLength > 0) ||
            applicable ||
            status ||
            searchData) ? (
            <div className="table-section">
              <Table
                className="tableCellPadding-11"
                columns={columns}
                // @ts-ignore
                dataSource={columnData}
                scroll={{ x: 1050 }}
                pagination={false}
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
            <>
              {listWidgetRuleDataLength === 0 && (
                <Row className="generate-box ant-row ant-space-align-center p-32">
                  <Col span={12}>
                    <div className="generate-box-content p-l-32">
                      <h1 className="h4 m-b-32 secondary-black">
                        {t('common.labels.lets_add_widget_rule')}
                      </h1>
                      <Button
                        icon={
                          <span className="anticon">
                            {
                              <span className="anticon">
                                <PlusIcon />
                              </span>
                            }
                          </span>
                        }
                        type="primary"
                        onClick={onAddWidgetRule}>
                        {t('common.labels.add_rule')}
                      </Button>
                    </div>
                  </Col>

                  <Col span={12}>
                    <div className="generate-box-img ant-row ant-row-end">
                      <MerchandisingSiteRuleBanner />
                    </div>
                  </Col>
                </Row>
              )}
            </>
          )}
        </>
      )}
      <CreateUpdateWidget
        environment={environment}
        isEditWidget={isEditWidget}
        onSetEditWidget={onSetEditWidget}
        isAddWidgetModalVisible={isAddWidgetModalVisible}
        onSetWidgetModalVisible={onSetWidgetModalVisible}
      />
      <CreateUpdateRule
        isEditRule={isEditRule}
        onSetEditRule={onSetEditRule}
        environment={environment}
        isAddRuleModalVisible={isAddRuleModalVisible}
        onCancelRuleModalVisible={onCancelRuleModalVisible}
      />
      <DeleteModal
        isVisible={isDeleteModalVisible}
        isLoading={isDeleteLoading}
        onCancel={onCancelModal}
        onDelete={contentModalDataId ? onDeleteRule : onDeleteWidget}
      />
    </>
  );
};

export default ListWidgetRule;
