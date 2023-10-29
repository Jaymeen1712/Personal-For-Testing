import React from 'react';
import { Button, Form, Input, Spin, Table, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import useContentFieldsController from './content-fields-controller';
import Modal from '../../../../components/modal';
import BannerContentModelField from '../banner/field/banner-content-model-field';
import NoDataFound from '../../../../components/no-data-found';
import NoRecordIcon from '../../../../images/icons/no-records-icon';
import ReorderIcon from '../../../../images/icons/reorder-icon';
import ArrowRightIcon from '../../../../images/icons/arrow-right-icon';
import SearchIcon from '../../../../images/icons/search-icon';

interface ContentFieldsProps {
  isCreateFieldFormModalVisible: boolean;
  setIsCreateFieldFormModalVisible: (
    isCreateFieldFormModalVisible: boolean
  ) => void;
  onEditFieldStatusChange: (id: string, status: boolean) => void;
  onCreateField: (id: string) => void;
  onAddFieldClick: () => void;
  addNewType: string;
  modelInternalName: string;
  sortable: boolean;
  changeTableSortOrderStatus: (val: boolean) => void;
}

const ContentFields: React.FC<ContentFieldsProps> = ({
  isCreateFieldFormModalVisible,
  setIsCreateFieldFormModalVisible,
  onEditFieldStatusChange,
  onCreateField,
  onAddFieldClick,
  addNewType,
  modelInternalName,
  sortable,
  changeTableSortOrderStatus,
}) => {
  const {
    t,
    onSortingClick,
    columns,
    contentFields,
    isDeleteField,
    onDeleteField,
    onHideDeleteField,
    componentFields,
    filterFlag,
    deleteField,
    deleteComponentField,
    dataSource,
    DraggableContainer,
    DraggableBodyRow,
    onSortSave,
    type,
    componentDataSource,
    canUpdateContentModelField,
    canUpdateComponent,
    expandedRowRender,
    // onChangeTable,
    onInputChange,
    form,
  } = useContentFieldsController({
    isCreateFieldFormModalVisible,
    setIsCreateFieldFormModalVisible,
    onEditFieldStatusChange,
    onCreateField,
    addNewType,
    modelInternalName,
    sortable,
    changeTableSortOrderStatus,
  });

  return (
    <>
      {addNewType === 'component' ? (
        <>
          {componentFields.isFetched || filterFlag ? (
            componentDataSource.length > 0 || filterFlag ? (
              <div>
                <div className="search-section ant-row ant-row-space-between">
                  {!sortable && (
                    <div className="ant-row ant-space-align-center">
                      <Form form={form}>
                        <Form.Item name="searchText" className="m-0 m-r-16">
                          <Input
                            autoComplete="off"
                            size="middle"
                            placeholder={t('common.labels.search')}
                            prefix={<SearchIcon />}
                            onChange={(e) => {
                              onInputChange(e);
                            }}
                            onKeyDown={(e) =>
                              e.keyCode === 13 ? e.preventDefault() : ''
                            }
                          />
                        </Form.Item>
                      </Form>
                      <span className="search-count">
                        <>
                          {componentDataSource.length > 1 ? (
                            <span>
                              {componentDataSource.length}{' '}
                              {t('common.labels.records')}
                            </span>
                          ) : (
                            <span>
                              {componentDataSource.length}{' '}
                              {t('common.labels.record')}
                            </span>
                          )}
                        </>
                      </span>
                    </div>
                  )}
                  {sortable ? (
                    <div className="text-right w-100">
                      <Button type="primary" onClick={onSortSave}>
                        {t('common.labels.save')}
                      </Button>
                    </div>
                  ) : (
                    <Tooltip
                      placement="left"
                      title={
                        !canUpdateComponent
                          ? t('common.messages.error_model_field_update')
                          : t('common.messages.content_modal_reorder_message')
                      }>
                      <Button
                        disabled={!canUpdateComponent}
                        size="middle"
                        icon={<ReorderIcon />}
                        onClick={onSortingClick}
                      />
                    </Tooltip>
                  )}
                </div>
                <div className={`table-section content-fields`}>
                  <Table
                    showSorterTooltip={false}
                    // onChange={onChangeTable}
                    className={`${
                      componentDataSource.length > 0
                        ? ''
                        : 'ant-custom-placeholder'
                    } tableCellPadding-10`}
                    // loading={componentFields.isLoading}
                    rowKey={(record, index) => record.index}
                    //@ts-ignore
                    columns={columns}
                    //@ts-ignore
                    dataSource={componentDataSource}
                    pagination={false}
                    components={{
                      body: {
                        wrapper: DraggableContainer,
                        row: DraggableBodyRow,
                      },
                    }}
                    locale={{
                      emptyText: (
                        <NoDataFound
                          icon={<NoRecordIcon />}
                          title={t('common.labels.no_record_added')}
                          description={t(
                            'common.labels.add_content_field_above'
                          )}
                        />
                      ),
                    }}
                  />
                </div>
              </div>
            ) : (
              <BannerContentModelField onAddContentField={onAddFieldClick} />
            )
          ) : (
            <Spin
              className="HV-center table-center"
              indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
              size="large"
            />
          )}
        </>
      ) : (
        <>
          {contentFields.isFetched || filterFlag ? (
            dataSource.length > 0 || filterFlag ? (
              <div>
                <div className="search-section ant-row ant-row-space-between">
                  {!sortable && (
                    <div className="ant-row ant-space-align-center">
                      <Form form={form}>
                        <Form.Item name="searchText" className="m-0 m-r-16">
                          <Input
                            autoComplete="off"
                            size="middle"
                            placeholder={t('common.labels.search')}
                            prefix={<SearchIcon />}
                            onChange={(e) => {
                              onInputChange(e);
                            }}
                            onKeyDown={(e) =>
                              e.keyCode === 13 ? e.preventDefault() : ''
                            }
                          />
                        </Form.Item>
                      </Form>
                      <span className="search-count">
                        <>
                          {dataSource.length > 1 ? (
                            <span>
                              {dataSource.length} {t('common.labels.records')}
                            </span>
                          ) : (
                            <span>
                              {dataSource.length} {t('common.labels.record')}
                            </span>
                          )}
                        </>
                      </span>
                    </div>
                  )}
                  {sortable ? (
                    <div className="text-right w-100">
                      <Button type="primary" onClick={onSortSave}>
                        {t('common.labels.save')}
                      </Button>
                    </div>
                  ) : (
                    <Tooltip
                      title={
                        !canUpdateContentModelField
                          ? t('common.messages.error_model_field_update')
                          : t('common.messages.content_modal_reorder_message')
                      }
                      placement="left">
                      <Button
                        disabled={!canUpdateContentModelField}
                        size="middle"
                        icon={<ReorderIcon />}
                        onClick={onSortingClick}
                      />
                    </Tooltip>
                  )}
                </div>
                <div
                  className={`table-section content-fields  ${
                    sortable && 'table-select-active'
                  }`}>
                  <Table
                    showSorterTooltip={false}
                    // onChange={onChangeTable}
                    className="tableCellPadding-10"
                    rowKey={(record, index) => record.index}
                    pagination={false}
                    // loading={contentFields.isLoading}
                    //@ts-ignore
                    columns={columns}
                    dataSource={dataSource}
                    expandable={{
                      expandedRowRender: expandedRowRender,
                      expandIcon: ({ expanded, onExpand, record }) =>
                        record.fields ? (
                          expanded ? (
                            <span
                              className="anticon expanded"
                              onClick={(e) => onExpand(record, e)}>
                              <ArrowRightIcon />
                            </span>
                          ) : (
                            <span
                              className="anticon"
                              onClick={(e) => onExpand(record, e)}>
                              <ArrowRightIcon />
                            </span>
                          )
                        ) : null,
                    }}
                    components={
                      sortable
                        ? {
                            body: {
                              wrapper: DraggableContainer,
                              row: DraggableBodyRow,
                            },
                          }
                        : {}
                    }
                    locale={{
                      emptyText: (
                        <NoDataFound
                          icon={<NoRecordIcon />}
                          title={t('common.labels.no_record_added')}
                          description={t(
                            'common.labels.add_content_field_above'
                          )}
                        />
                      ),
                    }}
                  />
                </div>
              </div>
            ) : (
              <BannerContentModelField onAddContentField={onAddFieldClick} />
            )
          ) : (
            <Spin
              className="HV-center table-center"
              indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
              size="large"
            />
          )}
        </>
      )}

      <Modal
        classname="confirm-modal"
        title={t('common.labels.delete_field')}
        children={t('common.labels.delete_field_children')}
        isModalVisibility={isDeleteField}
        onOK={onDeleteField}
        okText={t('common.labels.delete')}
        hideModal={onHideDeleteField}
        confirmLoading={
          type === 'component'
            ? deleteComponentField?.isLoading
            : deleteField?.isLoading
        }
      />
    </>
  );
};

export default ContentFields;
