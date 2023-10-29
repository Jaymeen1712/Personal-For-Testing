import React from 'react';
import { Form, Input, Table, Spin, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import useFacetsController from './facets-controller';
import SearchIcon from '../../../../images/icons/search-icon';
import NoDataFound from '../../../../components/no-data-found';
import NoRecordIcon from '../../../../images/icons/no-records-icon';
import HeaderFacets from './header-facets';
import FacetBanner from './facet-banner';
import FilterDropDownIcon from '../../../../images/icons/filterdropdown-icon';
import { FACET_LIST_SORTING_OPTIONS } from '../../../../utills';
import OnBoardBanner from '../../../../components/on-board-banner/on-board-banner';

const Facets: React.FC<{
  onAddFacetClick: () => void;
}> = ({ onAddFacetClick }) => {
  const {
    form,
    t,
    columns,
    columnData,
    onInputChange,
    isLoading,
    isStoreAdded,
    selectedSortValue,
    onSortRuleListData,
    onAddStore,
    permission,
    searchFlag,
  } = useFacetsController();

  return (
    <>
      <HeaderFacets
        t={t}
        isStoreAdded={isStoreAdded}
        onAddFacetClick={onAddFacetClick}
      />
      <div>
        {isLoading ? (
          <Spin
            className="HV-center table-center"
            indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
            size="large"
          />
        ) : (
          <>
            {isStoreAdded ? (
              columnData.length > 0 || searchFlag ? (
                <>
                  <div className="search-section">
                    <Form
                      form={form}
                      className="ant-row ant-row-space-between ant-space-align-center w-100">
                      <Form.Item name="searchText" className="m-0">
                        <Input
                          onChange={(e) => {
                            onInputChange(e);
                          }}
                          size="middle"
                          placeholder={t('common.labels.search')}
                          prefix={<SearchIcon />}
                          onKeyDown={(e) =>
                            e.keyCode === 13 ? e.preventDefault() : ''
                          }
                        />
                      </Form.Item>
                      <div className="ant-space-item-main">
                        <span className="m-r-8">
                          {t('common.labels.sort_by')}
                        </span>
                        <Select
                          className="m-0 ant-space-align-center borderless-select"
                          popupClassName="dropdown-size-medium"
                          placement={'bottomRight'}
                          size={'middle'}
                          onChange={onSortRuleListData}
                          suffixIcon={<FilterDropDownIcon />}
                          showArrow={true}
                          value={selectedSortValue}>
                          {FACET_LIST_SORTING_OPTIONS.map((option) => (
                            <Select.Option value={option.value}>
                              {option.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </div>
                    </Form>
                  </div>
                  <div className="table-section">
                    <Table
                      columns={columns}
                      //@ts-ignore
                      dataSource={columnData}
                      pagination={false}
                      locale={{
                        emptyText: (
                          <NoDataFound
                            icon={<NoRecordIcon />}
                            title={t('common.labels.facet_not_found')}
                          />
                        ),
                      }}
                    />
                  </div>
                </>
              ) : (
                <FacetBanner t={t} onAddFacet={onAddFacetClick} />
              )
            ) : (
              <OnBoardBanner
                header={t('common.labels.no_store_found')}
                description={t(
                  'common.messages.store_not_found_description_module',
                  { name: 'Facets' }
                )}
                buttonName={t('common.labels.add_store')}
                onClickAction={onAddStore}
                addButtonPermission={
                  permission.canReadEcommerceStore() &&
                  permission.canCreateEcommerceStore()
                }
                className="image-large"
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Facets;
