import React, { forwardRef } from 'react';
import { Form, Select, Switch, Table, Checkbox, Alert, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import useFacetsDetailController from './facets-detail-controller';
import NoDataFound from '../../../../../components/no-data-found';
import NoRecordIcon from '../../../../../images/icons/no-records-icon';
import ConfigModal from '../config-modal';
import HeaderFacetsDetail from './header-facets-detail';
import DownArrowIcon from '../../../../../images/icons/downarrow-icon';

const { Option } = Select;

interface IFacetsDetail {
  onSaveFacetClick: () => void;
}

const FacetsDetail = forwardRef<HTMLButtonElement, IFacetsDetail>(
  (props, ref) => {
    const {
      DraggableContainer,
      DraggableBodyRow,
      dataSource,
      columns,
      form,
      t,
      onCategoryChange,
      categoryList,
      onTableFromValueChange,
      isFacetsEnable,
      onCheckBoxClick,
      isCheckBoxChecked,
      isModalVisible,
      onModalCancelClick,
      category,
      selectedFacetName,
      updateFacetDetail,
      onFacetApply,
      ChangeFacetValue,
      isLoading,
      onBackButtonClick,
      isEditingExistingFacet,
    } = useFacetsDetailController(ref);

    return (
      <>
        <HeaderFacetsDetail
          t={t}
          onSaveFacetClick={props.onSaveFacetClick}
          onBackButtonClick={onBackButtonClick}
          isEditingExistingFacet={isEditingExistingFacet}
        />

        <>
          {isLoading ? (
            <Spin
              className="HV-center table-center"
              indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
              size="large"
            />
          ) : (
            <>
              <div className="search-section">
                {/* <div className="w-480 m-b-32">
                  <label className="custom-input-label">Environment</label>
                  <Input disabled value={environmentName} />
                </div> */}
                <Form
                  layout="vertical"
                  className="ant-row ant-row-space-between ant-row-bottom w-100"
                  form={form}
                  labelCol={{
                    span: 24,
                  }}
                  wrapperCol={{
                    span: 24,
                  }}>
                  <Form.Item
                    className="w-480 m-0"
                    name="category"
                    label={t('common.labels.category')}
                    initialValue={category === 'undefined' ? '' : category}>
                    <Select
                      optionFilterProp="children"
                      suffixIcon={<DownArrowIcon />}
                      filterOption={(input, categoryList) =>
                        (categoryList?.children ?? '')
                          //@ts-ignore
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      onChange={onCategoryChange}
                      placeholder="Please select"
                      placement="bottomRight">
                      {categoryList.map((item) => (
                        <Option value={item.id}>{item.title}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    className="m-0 label-switch-inline faceted-switch"
                    name="isFacetEnable"
                    label={t('common.labels.facet_enable')}>
                    <Switch checked={isFacetsEnable} />
                  </Form.Item>
                </Form>
              </div>
              {category !== 'All' && (
                <div className="m-b-28">
                  <Checkbox
                    disabled={!isFacetsEnable}
                    checked={isCheckBoxChecked}
                    onChange={(e) => {
                      onCheckBoxClick(e.target.checked);
                    }}>
                    {t('common.labels.use_storefront_default')}
                  </Checkbox>
                </div>
              )}

              {isCheckBoxChecked && (
                <Alert
                  message={t('common.messages.default_storefront_facet_enable')}
                  type="info"
                  className="m-t-32 m-b-24"
                />
              )}
              {!isFacetsEnable && (
                <Alert
                  message={t('common.messages.facet_disable_for_this_category')}
                  type="error"
                  className="m-t-32 m-b-24"
                />
              )}

              <div
                className={`table-section ${
                  (isCheckBoxChecked || !isFacetsEnable) && 'table-disable'
                }`}>
                <Form form={form} onValuesChange={onTableFromValueChange}>
                  <Table
                    className="tableCellPadding-5"
                    pagination={false}
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="index"
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
                          title={t('common.labels.facet_not_found')}
                        />
                      ),
                    }}
                  />
                </Form>
              </div>
              <ConfigModal
                isVisible={isModalVisible}
                onCancelClick={onModalCancelClick}
                updateFacetDetail={updateFacetDetail}
                selectedFacetName={selectedFacetName}
                onFacetApply={onFacetApply}
                ChangeFacetValue={ChangeFacetValue}
              />
            </>
          )}
        </>
      </>
    );
  }
);

export default FacetsDetail;
