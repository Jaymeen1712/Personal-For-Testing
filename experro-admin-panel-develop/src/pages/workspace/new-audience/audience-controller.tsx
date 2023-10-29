import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useLocation,
  useParams,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';
import { Button, Form } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import debounce from 'lodash.debounce';

import {
  API_QUERY_KEY,
  convertDateTimeToUserTimezone,
  countryListWithCountryCode,
  openNotificationWithIcon,
  SIDEBAR_KEYS,
} from '../../../utills';
import BulletIcon from '../../../images/icons/bullet-icon';
import { ISegmentList, IWorkspaceParams } from '../../../types';
import {
  useGetSegmentsList,
  useCreateSegment,
  useGetSegmentDetailsByQuery,
  useUpdateSegment,
} from './services';
import PlusArrowIcon from '../../../images/icons/plusarrow-icon';
import usePermissions from '../../../hooks/permissions/permissions';
import queryClient from '../../../query-client';
import useUser from '../../../hooks/user';
import shapeCollection from '../../../utills/convert-request-response';
import useQuery from '../../../hooks/queryParameter';

const useAudienceController = (
  onMainSidebarActiveItem?: (val: string) => void
) => {
  const { t } = useTranslation();
  const { workspaceId } = useParams<IWorkspaceParams>();
  const history = useHistory();
  const { path } = useRouteMatch();
  const location = useLocation();
  const { canCreateAudience } = usePermissions();
  const [form] = Form.useForm();
  const user = useUser();
  const query = useQuery();

  const [sidebarActiveItem, setSidebarActiveItem] =
    useState<string>('all-audiance');
  const [environmentId, setEnvironmentId] = useState<string>(
    //@ts-ignore
    localStorage.getItem(`${workspaceId}/environmentId`)
  );

  const [segmentDetail, setSegmentDetail] = useState<{
    name: string;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryJson: any;
  }>({} as ISegmentList);

  const [segmentsList, setSegmentsList] = useState<ISegmentList[]>();

  const [isCreateSegmentModalVisible, setIsCreateSegmentModalVisible] =
    useState(false);

  const [isCreateSegmentButtonDisabled, setIsCreateSegmentButtonDisabled] =
    useState(true);

  const [skip, setSkip] = useState(1);
  const [totalRecordCount, setTotalRecordCount] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [skipLimit, setSkipLimit] = useState(20);
  const [searchData, setSearchData] = useState('');

  const [segmentDetailsByQuery, setSegmentDetailsByQuery] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any>([]);

  const [segmentEditStatus, setSegmentEditStatus] = useState(false);

  const getSegmentsList = useGetSegmentsList(workspaceId, environmentId);

  const createSegment = useCreateSegment(workspaceId);

  const getSegmentDetailsByQuery = useGetSegmentDetailsByQuery(workspaceId);

  const updateSegment = useUpdateSegment(workspaceId);

  const onEnvironmentChange = (environment: string) => {
    setEnvironmentId(environment);
    history.push(`/workspaces/${workspaceId}/audience/all-audiance`);
  };

  const onSubSidebarMenuItemClick = (menu: MenuInfo) => {
    setSidebarActiveItem(menu.key);
    if (menu.key === 'allVisitor') {
      history.push(
        `/workspaces/${workspaceId}/audience/all-details?queryType=allVisitor`
      );
      resetFilter();
      getAllVisitorsDetails();
    } else if (menu.key === 'knownVisitor') {
      history.push(
        `/workspaces/${workspaceId}/audience/all-details?queryType=knownVisitor`
      );
      resetFilter();
      getKnowsVisitorsDetails();
    } else if (menu.key === 'anonymousVisitor') {
      history.push(
        `/workspaces/${workspaceId}/audience/all-details?queryType=anonymousVisitor`
      );
      resetFilter();
      getAnonymousVisitorsDetails();
    } else if (menu.key === 'allCustomers') {
      history.push(
        `/workspaces/${workspaceId}/audience/all-details?queryType=allCustomers`
      );
      resetFilter();
      getAllCustomersDetails();
    } else {
      const result = segmentsList?.find((item) => item.id === menu.key);
      history.push(
        `/workspaces/${workspaceId}/audience/${menu.key}/query-builder`
      );
      if (result) {
        setSegmentDetail({
          name: result.name,
          description: result.description,
          queryJson: JSON.parse(JSON.stringify(result.queryJson)),
        });
      }
    }
  };

  const onCreteSegmentModalVisibleChange = (visible: boolean) => {
    if (visible) {
      if (segmentDetail.name) {
        setSegmentEditStatus(true);
        form.setFieldsValue({
          name: segmentDetail.name,
          description: segmentDetail.description,
        });
      } else {
        setSegmentEditStatus(false);
        form.resetFields();
      }
    } else {
      setSegmentEditStatus(false);
      form.resetFields();
    }
    setIsCreateSegmentModalVisible(visible);
  };
  const onValueChange = (val: { segmentName: string; description: string }) => {
    if (form.getFieldValue('name')) {
      if (segmentEditStatus) {
        if (
          form.getFieldValue('name') !== segmentDetail.name ||
          (form.getFieldValue('description') !== segmentDetail.description &&
            form.getFieldValue('description'))
        ) {
          setIsCreateSegmentButtonDisabled(false);
        } else {
          setIsCreateSegmentButtonDisabled(true);
        }
      } else {
        setIsCreateSegmentButtonDisabled(false);
      }
    } else {
      setIsCreateSegmentButtonDisabled(true);
    }
  };

  const resetFilter = () => {
    setSkipLimit(20);
    setCurrentPageNumber(1);
    setSkip(1);
    setSegmentEditStatus(false);
    setSearchData('');
    setSegmentDetail({} as ISegmentList);
  };

  const onSaveSegmentButtonClick = async () => {
    try {
      const result = await form.validateFields();
      if (result) {
        if (segmentEditStatus) {
          const url = location.pathname.split('/');
          updateSegment.mutate({
            name: result.name,
            description: result.description,
            queryJson: segmentDetail.queryJson,
            id: url[4],
          });
        } else {
          createSegment.mutate({
            name: result.name,
            description: result.description,
            queryJson: {
              group: {
                operator: 'AND',
                rules: [],
              },
            },
            environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
          });
        }
      }
    } catch (err) {}
  };

  const onPageChange = (page: number, pageSize: number) => {
    setSegmentDetailsByQuery([]);
    setCurrentPageNumber(page);
    setSkip(page);
    setSkipLimit(pageSize);
    getSegmentDetailsByQuery.mutate({
      //@ts-ignore
      environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
      query: segmentEditStatus
        ? segmentDetail.queryJson
        : query.get('queryType') === 'allVisitor'
        ? {
            group: {
              operator: 'AND',
              rules: [],
            },
          }
        : query.get('queryType') === 'knownVisitor'
        ? {
            group: {
              operator: 'AND',
              rules: [
                {
                  condition: 'NOT_EMPTY',
                  field: {
                    field_name: 'name',
                    display_name: 'Name',
                    type: 'Text',
                  },
                  data: '',
                },
              ],
            },
          }
        : query.get('queryType') === 'anonymousVisitor'
        ? {
            group: {
              operator: 'AND',
              rules: [
                {
                  condition: 'EMPTY',
                  field: {
                    field_name: 'name',
                    display_name: 'Name',
                    type: 'Text',
                  },
                  data: '',
                },
              ],
            },
          }
        : {
            group: {
              operator: 'AND',
              rules: [
                {
                  condition: '<>',
                  field: {
                    field_name: 'last_purchase_amount',
                    display_name: 'Last Purchase Amount',
                    type: 'Integer',
                  },
                  data: 0,
                },
                {
                  condition: '<>',
                  field: {
                    field_name: 'last_purchase_count',
                    display_name: 'Last Purchase Count',
                    type: 'Integer',
                  },
                  data: 0,
                },
              ],
            },
          },
      skip: page,
      skipLimit: pageSize,
      searchData: searchData,
    });
  };

  const onSearchDataChange = debounce((val) => {
    setSearchData(val.target.value.trim());
    getSegmentDetailsByQuery.mutate({
      //@ts-ignore
      environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
      query: segmentEditStatus
        ? segmentDetail.queryJson
        : query.get('queryType') === 'allVisitor'
        ? {
            group: {
              operator: 'AND',
              rules: [],
            },
          }
        : query.get('queryType') === 'knownVisitor'
        ? {
            group: {
              operator: 'AND',
              rules: [
                {
                  condition: 'NOT_EMPTY',
                  field: {
                    field_name: 'name',
                    display_name: 'Name',
                    type: 'Text',
                  },
                  data: '',
                },
              ],
            },
          }
        : query.get('queryType') === 'anonymousVisitor'
        ? {
            group: {
              operator: 'AND',
              rules: [
                {
                  condition: 'EMPTY',
                  field: {
                    field_name: 'name',
                    display_name: 'Name',
                    type: 'Text',
                  },
                  data: '',
                },
              ],
            },
          }
        : {
            group: {
              operator: 'AND',
              rules: [
                {
                  condition: '<>',
                  field: {
                    field_name: 'last_purchase_amount',
                    display_name: 'Last Purchase Amount',
                    type: 'Integer',
                  },
                  data: 0,
                },
                {
                  condition: '<>',
                  field: {
                    field_name: 'last_purchase_count',
                    display_name: 'Last Purchase Count',
                    type: 'Integer',
                  },
                  data: 0,
                },
              ],
            },
          },
      skip: skip,
      skipLimit: skipLimit,
      searchData: val.target.value.trim(),
    });
  }, 500);

  const getAllVisitorsDetails = () => {
    getSegmentDetailsByQuery.mutate({
      //@ts-ignore
      environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
      query: {
        group: {
          operator: 'AND',
          rules: [],
        },
      },
      skip: 1,
      skipLimit: 20,
      columnSortOrder: {
        sortBy: '',
        orderBy: '',
      },
      searchData: searchData,
    });
  };
  const getKnowsVisitorsDetails = () => {
    getSegmentDetailsByQuery.mutate({
      //@ts-ignore
      environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
      query: {
        group: {
          operator: 'AND',
          rules: [
            {
              condition: 'NOT_EMPTY',
              field: {
                field_name: 'name',
                display_name: 'Name',
                type: 'Text',
              },
              data: '',
            },
          ],
        },
      },
      skip: 1,
      skipLimit: 20,
      columnSortOrder: {
        sortBy: '',
        orderBy: '',
      },
      searchData: searchData,
    });
  };
  const getAnonymousVisitorsDetails = () => {
    getSegmentDetailsByQuery.mutate({
      //@ts-ignore
      environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
      query: {
        group: {
          operator: 'AND',
          rules: [
            {
              condition: 'EMPTY',
              field: {
                field_name: 'name',
                display_name: 'Name',
                type: 'Text',
              },
              data: '',
            },
          ],
        },
      },
      skip: 1,
      skipLimit: 20,
      columnSortOrder: {
        sortBy: '',
        orderBy: '',
      },
      searchData: searchData,
    });
  };
  const getAllCustomersDetails = () => {
    getSegmentDetailsByQuery.mutate({
      //@ts-ignore
      environmentId: localStorage.getItem(`${workspaceId}/environmentId`),
      query: {
        group: {
          operator: 'AND',
          rules: [
            {
              condition: '<>',
              field: {
                field_name: 'last_purchase_amount',
                display_name: 'Last Purchase Amount',
                type: 'Integer',
              },
              data: 0,
            },
            {
              condition: '<>',
              field: {
                field_name: 'last_purchase_count',
                display_name: 'Last Purchase Count',
                type: 'Integer',
              },
              data: 0,
            },
          ],
        },
      },
      skip: 1,
      skipLimit: 20,
      columnSortOrder: {
        sortBy: '',
        orderBy: '',
      },
      searchData: searchData,
    });
  };

  const menuItems = useMemo(() => {
    const menuData = [
      {
        key: 'segment',
        disabled: true,
        label: (
          <div className={'ant-row ant-row-space-between ant-row-middle'}>
            {t('common.labels.segments')}
            <div className="ant-menu-submenu-arrows">
              {canCreateAudience() && (
                <Button
                  className="plusarrow"
                  type="link"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsCreateSegmentModalVisible(true);
                    setSegmentEditStatus(false);
                  }}>
                  <PlusArrowIcon />
                </Button>
              )}
            </div>
          </div>
        ),
        icon: (
          <>
            <div className="folders-icon bullet-icon ant-row display-none">
              <BulletIcon />
            </div>
          </>
        ),
      },
      {
        key: 'allVisitor',
        label: t('common.labels.all_visitors'),
        icon: (
          <>
            <div className="folders-icon bullet-icon ant-row display-none">
              <BulletIcon />
            </div>
          </>
        ),
      },
      {
        key: 'knownVisitor',
        label: t('common.labels.known_visitor'),
        icon: (
          <>
            <div className="folders-icon bullet-icon ant-row display-none">
              <BulletIcon />
            </div>
          </>
        ),
      },
      {
        key: 'anonymousVisitor',
        label: t('common.labels.anonymous_visitor'),
        icon: (
          <>
            <div className="folders-icon bullet-icon ant-row display-none">
              <BulletIcon />
            </div>
          </>
        ),
      },
      {
        key: 'allCustomers',
        label: t('common.labels.all_customers'),
        icon: (
          <>
            <div className="folders-icon bullet-icon ant-row display-none">
              <BulletIcon />
            </div>
          </>
        ),
      },

      {
        key: 'separator-1',
        label: '',
        className: 'separator',
        icon: <></>,
      },
    ];
    if (segmentsList && segmentsList?.length > 0) {
      for (let i = 0; i < segmentsList.length; i++) {
        menuData.push({
          key: segmentsList[i].id,
          label: segmentsList[i].name,
          icon: (
            <>
              <div className="folders-icon bullet-icon ant-row display-none">
                <BulletIcon />
              </div>
            </>
          ),
        });
      }
    }
    return menuData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, segmentsList, workspaceId]);

  const columns = [
    {
      title: t('common.labels.name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, row: { id: string }) => {
        return (
          <>
            <div className="ant-row ant-space-align-center ant-row-space-between w-100 table-text-button">
              <div className="table-text">
                <div
                  className="text-truncate with-pixel text-blue cursor-pointer"
                  onClick={() =>
                    history.push(
                      `/workspaces/${workspaceId}/audience/all-details/${
                        row.id
                      }/details?queryType=${query.get('queryType')}`
                    )
                  }>
                  {/* @ts-ignore */}
                  {row.name ? row.name : row.device_id ? row.device_id : '-'}
                </div>
              </div>
            </div>
          </>
        );
      },
    },
    {
      title: t('common.labels.country'),
      dataIndex: 'country',
      key: 'country',
      render: (country: string, row: object) => {
        return (
          <>
            <div className="text-truncate with-pixel">
              {/*@ts-ignore*/}
              {row.country ? countryListWithCountryCode[row.country] : '-'}
            </div>
          </>
        );
      },
    },
    {
      title: t('common.labels.device'),
      dataIndex: 'device_vendor',
      key: 'device_vendor',
      render: (device_vendor: string, row: object) => {
        return (
          <>
            <div className="text-truncate with-pixel">
              {/*@ts-ignore*/}
              {row.device_category
                ? //@ts-ignore
                  row.device_category === 'pc'
                  ? 'Desktop'
                  : 'Smartphone'
                : '-'}
            </div>
          </>
        );
      },
    },
    {
      title: t('common.labels.browser'),
      dataIndex: 'device_name',
      key: 'device_name',
      render: (device_name: string, row: object) => {
        return (
          <>
            <div className="text-truncate with-pixel">
              {/*@ts-ignore*/}
              {row.device_name ? row.device_name : '-'}
            </div>
          </>
        );
      },
    },
    {
      title: t('common.labels.sessions'),
      dataIndex: 'total_session_count',
      key: 'total_session_count',
      render: (total_session_count: number, row: object) => {
        return (
          <>
            <div className="text-truncate with-pixel">
              {/*@ts-ignore*/}
              {row.total_session_count ? row.total_session_count : '-'}
            </div>
          </>
        );
      },
    },
    {
      title: t('common.labels.last_seen'),
      dataIndex: 'last_seen_at',
      key: 'last_seen_at',
      render: (last_seen_at: string, row: object) => {
        return (
          <>
            <div className="text-truncate with-pixel">
              {/*@ts-ignore*/}
              {row.last_seen_at
                ? convertDateTimeToUserTimezone(
                    last_seen_at,
                    user?.user?.timezone
                  )
                : '-'}
            </div>
          </>
        );
      },
    },
    {
      title: t('common.labels.time_spent'),
      dataIndex: 'total_duration',
      key: 'total_duration',
      render: (total_duration: string, row: object) => {
        return (
          <>
            <div className="text-truncate with-pixel">
              {/*@ts-ignore*/}
              {row.total_duration
                ? //@ts-ignore
                  new Date(row.total_duration * 1000)
                    .toISOString()
                    .slice(11, 19)
                : '-'}
            </div>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    if (getSegmentsList.isSuccess) {
      setSegmentsList(getSegmentsList.data.items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSegmentsList.isSuccess]);

  useEffect(() => {
    if (location.pathname.split('/').length <= 4) {
      if (
        location.pathname !== `/workspaces/${workspaceId}/audience/all-details`
      ) {
        history.push(
          `/workspaces/${workspaceId}/audience/all-details?queryType=allVisitor`
        );
      }
    } else if (
      location.pathname.split('/').includes('all-details') ||
      location.pathname.split('/').includes('new')
    ) {
      if (query.get('queryType')) {
        //@ts-ignore
        setSidebarActiveItem(query.get('queryType'));
      }

      setSegmentDetail(
        {} as { name: string; description: string; queryJson: object }
      );
    } else if (location.pathname.split('/').length >= 5) {
      setSidebarActiveItem(location.pathname.split('/')[4]);
      if (
        `/workspaces/${workspaceId}/audience/all-details` !== location.pathname
      ) {
        if (segmentsList) {
          const result = segmentsList?.find(
            (item) => item.id === location.pathname.split('/')[4]
          );
          if (result) {
            setSegmentDetail({
              name: result.name,
              description: result.description,
              queryJson: JSON.parse(JSON.stringify(result.queryJson)),
            });
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, segmentsList]);

  useEffect(() => {
    if (getSegmentsList.error) {
      console.log('test', getSegmentsList.error);
    }
  }, [getSegmentsList.error]);

  useEffect(() => {
    if (createSegment.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.segment_created_successfully')
      );
      queryClient.removeQueries([API_QUERY_KEY.GET_SEGMENTS_LIST]);
      setIsCreateSegmentModalVisible(false);
      form.resetFields();
      setIsCreateSegmentButtonDisabled(true);
      history.push(
        `/workspaces/${workspaceId}/audience/${createSegment.data.id}/query-builder`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSegment.isSuccess]);

  useEffect(() => {
    if (createSegment.error) {
      //@ts-ignore
      openNotificationWithIcon('error', createSegment.error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSegment.error]);

  useEffect(() => {
    if (getSegmentDetailsByQuery.isSuccess) {
      setTotalRecordCount(getSegmentDetailsByQuery.data.totalCount);
      setSegmentDetailsByQuery(
        shapeCollection(
          getSegmentDetailsByQuery.data.items,
          false,
          'camelToSnackCase'
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSegmentDetailsByQuery.isSuccess, getSegmentDetailsByQuery.data]);
  useEffect(() => {
    if (getSegmentDetailsByQuery.error) {
      setSegmentDetailsByQuery([]);
      setTotalRecordCount(0);
      console.log('test', getSegmentDetailsByQuery.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSegmentDetailsByQuery.error]);

  useEffect(() => {
    if (updateSegment.isSuccess) {
      openNotificationWithIcon(
        'success',
        t('common.messages.segment_updated_successfully')
      );
      setIsCreateSegmentButtonDisabled(true);
      form.resetFields();
      const url = location.pathname.split('/');
      setIsCreateSegmentModalVisible(false);
      getSegmentsList.remove();
      history.push(
        `/workspaces/${workspaceId}/audience/${url[4]}/query-builder`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSegment.isSuccess]);

  useEffect(() => {
    if (updateSegment.error) {
      //@ts-ignore
      openNotificationWithIcon('error', updateSegment.error.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSegment.error]);

  useEffect(() => {
    if (onMainSidebarActiveItem) {
      onMainSidebarActiveItem(SIDEBAR_KEYS.WORKSPACE.AUDIENCE);
    }
    if (query.get('queryType') === 'allVisitor') {
      getAllVisitorsDetails();
    } else if (query.get('queryType') === 'knownVisitor') {
      getKnowsVisitorsDetails();
    } else if (query.get('queryType') === 'anonymousVisitor') {
      getAnonymousVisitorsDetails();
    } else if (query.get('queryType') === 'allCustomers') {
      getAllCustomersDetails();
    }
    if (!query.get('queryType')) {
      getAllVisitorsDetails();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    menuItems,
    onEnvironmentChange,
    path,
    environmentId,
    onSubSidebarMenuItemClick,
    sidebarActiveItem,
    segmentDetail,
    isCreateSegmentModalVisible,
    onCreteSegmentModalVisibleChange,
    t,
    form,
    onValueChange,
    isCreateSegmentButtonDisabled,
    onSaveSegmentButtonClick,
    isSaveButtonLoading: segmentEditStatus
      ? updateSegment.isLoading
      : createSegment.isLoading,
    skipLimit,
    totalRecordCount,
    currentPageNumber,
    columns,
    onPageChange,
    segmentDetailsByQuery,
    isLoading: getSegmentDetailsByQuery.isLoading,
    onSearchDataChange,
    segmentEditStatus,
  };
};
export default useAudienceController;
