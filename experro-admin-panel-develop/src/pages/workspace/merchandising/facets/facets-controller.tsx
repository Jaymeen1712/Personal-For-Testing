import React, { useEffect, useMemo, useState } from 'react';
import { Form, Dropdown, Menu, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import debounce from 'lodash.debounce';

import {
  IWorkspaceParams,
  FacetList,
  RowRecord,
  ISortDataObject,
} from '../../../../types';
import useUser from '../../../../hooks/user';
import {
  convertDateTimeToUserTimezone,
  openNotificationWithIcon,
} from '../../../../utills';

import usePermissions from '../../../../hooks/permissions';
import { useFacetRecordList, useFacetsCategoryList } from '../services';
import EllipsisIcon from '../../../../images/icons/ellipsis-icon';

const useFacetsController = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const userDetails = useUser();
  const history = useHistory();
  const permission = usePermissions();
  const { workspaceId } = useParams<IWorkspaceParams>();

  const [searchData, setSearchData] = useState('');
  const [searchFlag, setSearchFlag] = useState(false);
  const [envId, setEnvId] = useState(
    localStorage.getItem(`${workspaceId}/environmentId`)
  );

  const [sortOrder, setSortOrder] = useState<ISortDataObject>({
    orderBy: 'desc',
    sortBy: 'modified_at',
  });

  const getFacetRecordList = useFacetRecordList(
    workspaceId,
    searchData,
    envId,
    sortOrder.sortBy,
    sortOrder.orderBy
  );

  const getFacetCategoryList = useFacetsCategoryList(workspaceId, envId);

  const [columnData, setColumnData] = useState<FacetList[] | []>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [categoryList, setCategoryList] = useState<
    { id: string; title: string; current_version_id: string }[]
  >([]);
  const [isStoreAdded, setIsStoreAdded] = useState(true);

  const [selectedSortValue, setSelectedSortValue] =
    useState('recently_updated');

  const onSortRuleListData = (sortValue: string) => {
    setSelectedSortValue(sortValue);
    if (sortValue === 'recently_updated') {
      setSortOrder({
        orderBy: 'desc',
        sortBy: 'modified_at',
      });
    } else if (sortValue === 'oldest_updated') {
      setSortOrder({
        orderBy: 'asc',
        sortBy: 'modified_at',
      });
    } else if (sortValue === 'a_to_z') {
      setSortOrder({
        orderBy: 'asc',
        sortBy: 'category_name',
      });
    } else if (sortValue === 'z_to_a') {
      setSortOrder({
        orderBy: 'desc',
        sortBy: 'category_name',
      });
    }
    getFacetRecordList.remove();
  };

  useEffect(() => {
    if (getFacetCategoryList.isError) {
      if (
        // @ts-ignore
        getFacetCategoryList?.error.response.Error.errorCode === 'EX-00047'
      ) {
        openNotificationWithIcon(
          'error',
          // @ts-ignore
          getFacetCategoryList?.error.message
        );
        setIsStoreAdded(false);
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFacetCategoryList.isError]);

  const columns = useMemo(
    () => [
      {
        title: t('common.labels.category'),
        dataIndex: 'category',
        key: 'category',
        render: (text: string, record: RowRecord) => (
          <>
            <div className="ant-row ant-space-align-center ant-row-space-between w-100 table-text-button">
              <div className="table-text">
                <span
                  className="cursor-pointer text-blue"
                  onClick={() => {
                    history.push(
                      `/workspaces/${workspaceId}/discovery/${envId}/facets/${record.categoryId}/add-facet`
                    );
                  }}>
                  {text}
                </span>
              </div>
              <Dropdown
                placement="bottomRight"
                trigger={['click']}
                overlay={
                  <div className="table-dropdown">
                    <Menu>
                      <Menu.Item
                        onClick={() => {
                          history.push(
                            `/workspaces/${workspaceId}/discovery/${envId}/facets/${record.categoryId}/add-facet`
                          );
                        }}>
                        {t('common.labels.edit')}
                      </Menu.Item>
                    </Menu>
                  </div>
                }>
                <Button
                  type="text"
                  size="small"
                  className="on-hover"
                  icon={<EllipsisIcon />}
                  style={{ float: 'right' }}
                />
              </Dropdown>
            </div>
          </>
        ),
      },
      {
        title: t('common.labels.facets'),
        dataIndex: 'facets',
        key: 'facets',
        render: (text: string[]) => (
          <>
            {text.map((item, index) =>
              index < 2 ? (
                <>
                  <span>{index > 0 ? ', ' : ''}</span>
                  <span>{item}</span>
                </>
              ) : (
                ''
              )
            )}
            {text.length > 2 && (
              <Dropdown
                className="filter-custom-dropdown"
                overlayClassName="dropdown-size-small"
                trigger={['hover']}
                placement="bottomRight"
                overlay={
                  <Menu>
                    {text.length > 2 &&
                      text.map(
                        (data, index) =>
                          index > 1 && <Menu.Item>{data}</Menu.Item>
                      )}
                  </Menu>
                }>
                <Button
                  type="link"
                  onClick={(e) => e.preventDefault()}
                  className="font-normal facets-custom">
                  +{text.length - 2}
                </Button>
                {/* <a
                  href="/#"
                  style={{ display: 'inline-block' }}>
                  <div className="text-blue cursor-pointer">
                    +{text.length - 2}
                  </div>
                </a> */}
              </Dropdown>
            )}
          </>
        ),
      },
      // {
      //   title: t('common.labels.environments'),
      //   dataIndex: 'environment',
      //   key: 'environment',
      // },
      {
        title: t('common.labels.modified_by'),
        dataIndex: 'modifiedBy',
        key: 'modifiedBy',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: t('common.labels.modified_at'),
        dataIndex: 'modifiedAt',
        key: 'modifiedAt',
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, envId]
  );

  const onInputChange = debounce((val) => {
    if (val !== '') {
      setSearchFlag(true);
    } else {
      setSearchFlag(false);
    }
    setSearchData(val.target.value);
    getFacetRecordList.remove();
  }, 500);

  useEffect(() => {
    const envChange = () => {
      setEnvId(localStorage.getItem(`${workspaceId}/environmentId`));
      getFacetCategoryList.remove();
    };
    document.addEventListener('environmentChange', envChange);

    return () => {
      document.removeEventListener('environmentChange', envChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps

  //TODO Environment List

  useEffect(() => {
    if (getFacetRecordList.isSuccess) {
      const arr: FacetList[] = [];
      if (getFacetRecordList.data.length > 0) {
        getFacetRecordList.data.map((item) => {
          const facetArray: string[] = [];
          //@ts-ignore
          JSON.parse(item.facets).map((item) => {
            if (item.is_enabled) {
              facetArray.push(item.display_name);
            }
            return '';
          });
          const categoryNameData = categoryList?.find(
            (data) => data.id === item.category
          );
          if (item.category === 'All') {
            arr.push({
              categoryId: 'All',
              category: item.category,
              facets: facetArray,
              environment: '-',
              //@ts-ignore
              modifiedBy: userDetails?.listAllUser?.[item.modifiedBy],
              modifiedAt: convertDateTimeToUserTimezone(item.modifiedAt),
            });
          } else {
            if (categoryNameData) {
              arr.push({
                categoryId: item.category,
                category: categoryNameData && categoryNameData.title,
                facets: facetArray,
                environment: '-',
                //@ts-ignore
                modifiedBy: userDetails?.listAllUser?.[item.modifiedBy],
                modifiedAt: convertDateTimeToUserTimezone(item.modifiedAt),
              });
            }
          }

          return '';
        });
      }
      setIsLoading(false);
      setColumnData([...arr]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFacetRecordList.isSuccess, categoryList]);

  useEffect(() => {
    if (getFacetRecordList.isError) {
      setColumnData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFacetRecordList.isError]);

  useEffect(() => {
    if (getFacetCategoryList.isSuccess) {
      setCategoryList(getFacetCategoryList.data.items);
      setIsStoreAdded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFacetCategoryList.isSuccess]);

  const onAddStore = () => {
    history.push(`/workspaces/${workspaceId}/platforms`);
    setIsStoreAdded(false);
  };

  useEffect(() => {
    form.resetFields();
    setSearchData('');
    setSelectedSortValue('recently_updated');
    // eslint-disable-next-line
  }, [envId]);

  return {
    form,
    t,
    columns,
    columnData,
    onInputChange,
    isLoading,
    onAddStore,
    permission,
    isStoreAdded,
    selectedSortValue,
    onSortRuleListData,
    searchFlag,
  };
};
export default useFacetsController;
